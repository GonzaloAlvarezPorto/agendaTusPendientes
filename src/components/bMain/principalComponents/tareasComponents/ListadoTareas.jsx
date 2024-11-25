import React, { useEffect, useState } from 'react';

export const ListadoTareas = ({ selectedDayTasks }) => {
    const [tareas, setTareas] = useState({});

    useEffect(() => {
        const actualizarTareas = () => {
            if (selectedDayTasks) {
                const tareasPendientes = JSON.parse(localStorage.getItem('tareas-pendientes')) || {};
                const tareasDelDia = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};

                const tareasCombinadas = { ...tareasPendientes, ...tareasDelDia };
                setTareas(tareasCombinadas);
            }
        };

        actualizarTareas();
        const interval = setInterval(actualizarTareas, 1000);

        return () => clearInterval(interval);
    }, [selectedDayTasks]);

    // Función para eliminar una tarea
    const eliminarTarea = (clave) => {
        const tareasPendientes = JSON.parse(localStorage.getItem('tareas-pendientes')) || {};
        const tareasDelDia = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};

        if (clave.startsWith('T/P')) {
            // Eliminar tarea pendiente
            delete tareasPendientes[clave];
            localStorage.setItem('tareas-pendientes', JSON.stringify(tareasPendientes));
        } else if (tareasDelDia[clave]) {
            // Eliminar tarea del día seleccionado
            delete tareasDelDia[clave];
            localStorage.setItem(`tareas-${selectedDayTasks}`, JSON.stringify(tareasDelDia));
        }

        const tareasCombinadas = { ...tareasPendientes, ...tareasDelDia };
        setTareas(tareasCombinadas);
    };

    const ordenarTareas = (tareas) => {
        const tareasPendientes = [];
        const tareasSinHorario = [];
        const tareasConHorario = [];

        // Clasificar tareas
        for (const [clave, descripcion] of Object.entries(tareas)) {
            if (clave.startsWith('T/P')) {
                tareasPendientes.push({ clave, descripcion });
            } else if (clave.startsWith('S/H')) {
                tareasSinHorario.push({ clave, descripcion });
            } else {
                tareasConHorario.push({ hora: clave, descripcion });
            }
        }

        // Ordenar las tareas pendientes (T/P)
        tareasPendientes.sort((a, b) => {
            const numA = parseInt(a.clave.replace('T/P', ''), 10);
            const numB = parseInt(b.clave.replace('T/P', ''), 10);
            return numA - numB;
        });

        // Ordenar las tareas sin horario (s/h)
        tareasSinHorario.sort((a, b) => {
            const numA = parseInt(a.clave.replace('S/H', ''), 10);
            const numB = parseInt(b.clave.replace('S/H', ''), 10);
            return numA - numB;
        });

        // Ordenar las tareas con horario
        tareasConHorario.sort((a, b) => {
            const [horaA, minutoA] = a.hora.split(':').map(Number);
            const [horaB, minutoB] = b.hora.split(':').map(Number);
            return horaA !== horaB ? horaA - horaB : minutoA - minutoB;
        });

        // Combinar las tareas en el orden deseado
        return [...tareasPendientes, ...tareasSinHorario, ...tareasConHorario];
    };

    const tareasOrdenadas = ordenarTareas(tareas);

    return (
        <>
            {tareasOrdenadas.length > 0 ? (
                tareasOrdenadas.map(({ clave, hora, descripcion }, index) => (
                    <li key={index} className="tareas__item">
                        <p className="item__hora">{clave || hora || 'Sin horario'}</p>
                        <p className="item__descripcion">{descripcion}</p>
                        <button className="item__boton">Tarea realizada</button>
                        <button
                            className="item__boton eliminar"
                            onClick={() => eliminarTarea(clave || hora)}
                        >
                            Quitar tarea del listado
                        </button>
                    </li>
                ))
            ) : (
                <p className="tareas__item">No hay tareas para mostrar.</p>
            )}
        </>
    );
};
