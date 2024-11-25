import React, { useEffect, useState } from 'react';

export const ListadoTareas = ({ selectedDayTasks }) => {
    const [tareas, setTareas] = useState({});

    useEffect(() => {
        // Función para actualizar las tareas desde localStorage
        const actualizarTareas = () => {
            if (selectedDayTasks) {
                const tareasPendientes = JSON.parse(localStorage.getItem('tareas-pendientes')) || {};
                const tareasDelDia = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};

                // Combina las tareas pendientes con las tareas del día seleccionado
                const tareasCombinadas = { ...tareasPendientes, ...tareasDelDia };
                setTareas(tareasCombinadas);
            }
        };

        // Actualizar tareas inmediatamente al cargar
        actualizarTareas();

        // Actualizar tareas cada 1 segundo
        const interval = setInterval(actualizarTareas, 1000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, [selectedDayTasks]);

    // Función para ordenar las tareas
    const ordenarTareas = (tareas) => {
        const tareasConHorario = [];
        const tareasSinHorario = [];

        // Separa las tareas con horario y sin horario
        for (const [hora, descripcion] of Object.entries(tareas)) {
            if (hora === 's/h') {
                tareasSinHorario.push({ descripcion, hora });
            } else {
                tareasConHorario.push({ hora, descripcion });
            }
        }

        // Ordena las tareas con hora de menor a mayor
        tareasConHorario.sort((a, b) => {
            const [horaA, minutoA] = a.hora.split(':').map(Number);
            const [horaB, minutoB] = b.hora.split(':').map(Number);
            return horaA !== horaB ? horaA - horaB : minutoA - minutoB;
        });

        // Ordena las tareas pendientes (sin hora) por el orden que prefieras, aquí ordenadas alfabéticamente
        tareasSinHorario.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

        // Combina las tareas
        return [...tareasSinHorario, ...tareasConHorario];
    };

    // Ordenar tareas antes de mostrarlas
    const tareasOrdenadas = ordenarTareas(tareas);

    return (
        <>
            {tareasOrdenadas.length > 0 ? (
                tareasOrdenadas.map(({ hora, descripcion }, index) => (
                    <li key={index} className="tareas__item">
                        <p className="item__hora">{hora === 's/h' ? 'Sin horario' : hora}</p>
                        <p className="item__descripcion">{descripcion}</p>
                        <button className="item__boton">Tarea realizada</button>
                        <button className="item__boton eliminar">Quitar tarea del listado</button>
                    </li>
                ))
            ) : (
                <p className='tareas__item'>No hay tareas para mostrar.</p>
            )}
        </>
    );
};
