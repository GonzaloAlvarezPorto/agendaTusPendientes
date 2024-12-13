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
        if (!clave) {
            console.error('La clave no está definida');
            return;
        }

        const tareasPendientes = JSON.parse(localStorage.getItem('tareas-pendientes')) || {};
        const tareasDelDia = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};
        const visibilidadTareasDelDia = JSON.parse(localStorage.getItem(`visibilidad-${selectedDayTasks}`)) || {};

        if (/^T\/P/.test(clave)) {
            // Eliminar tarea pendiente
            delete tareasPendientes[clave];
            localStorage.setItem('tareas-pendientes', JSON.stringify(tareasPendientes));
        } else if (tareasDelDia[clave]) {
            // Eliminar tarea del día seleccionado
            delete tareasDelDia[clave];

            // Eliminar la visibilidad correspondiente a la tarea
            if (visibilidadTareasDelDia.hasOwnProperty(clave)) {
                delete visibilidadTareasDelDia[clave];
            }

            // Actualizar localStorage
            localStorage.setItem(`tareas-${selectedDayTasks}`, JSON.stringify(tareasDelDia));
            localStorage.setItem(`visibilidad-${selectedDayTasks}`, JSON.stringify(visibilidadTareasDelDia));
        }

        // Combinar tareas restantes y actualizar el estado
        const tareasCombinadas = { ...tareasPendientes, ...tareasDelDia, ...visibilidadTareasDelDia };
        setTareas(tareasCombinadas);
    };

    // Función para marcar tarea como realizada
    const tareaRealizada = (clave) => {
        const visibilidadDia = JSON.parse(localStorage.getItem(`visibilidad-${selectedDayTasks}`)) || {};
        visibilidadDia[clave] = false;  // Marcar tarea como oculta

        // Guardar en localStorage
        localStorage.setItem(`visibilidad-${selectedDayTasks}`, JSON.stringify(visibilidadDia));

        // Actualizar el estado de las tareas
        setTareas((prevTareas) => {
            const tareasActualizadas = { ...prevTareas };
            delete tareasActualizadas[clave];  // Eliminar la tarea del estado
            return tareasActualizadas;
        });
    };

    const ordenarTareas = (tareas) => {
        const tareasPendientes = [];
        const tareasSinHorario = [];
        const tareasConHorario = [];

        // Clasificar tareas usando expresiones regulares
        for (const [clave, descripcion] of Object.entries(tareas)) {
            if (/^T\/P/.test(clave)) {
                tareasPendientes.push({ clave, descripcion });
            } else if (/^S\/H/.test(clave)) {
                tareasSinHorario.push({ clave, descripcion });
            } else if (/^\d{2}:\d{2}$/.test(clave)) {
                tareasConHorario.push({ hora: clave, descripcion });
            }
        }

        // Ordenar las tareas pendientes (T/P)
        tareasPendientes.sort((a, b) => {
            const numA = parseInt(a.clave.replace('T/P', ''), 10);
            const numB = parseInt(b.clave.replace('T/P', ''), 10);
            return numA - numB;
        });

        // Ordenar las tareas sin horario (S/H)
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
                tareasOrdenadas.map(({ clave, hora, descripcion }, index) => {
                    const visibilidadDia = JSON.parse(localStorage.getItem(`visibilidad-${selectedDayTasks}`)) || {};
                    const tareaClave = clave || hora; // Para las tareas con horario, usar la hora como clave

                    // Verificar si la tarea es visible
                    const tareaVisible = visibilidadDia[tareaClave] !== false;

                    // Verificar si la clave pertenece a una tarea pendiente (T/P)
                    const esTareaPendiente = /^T\/P/.test(clave);

                    return (
                        tareaVisible && (
                            <ul key={index}>
                                <li key={index} className="tareas__item">
                                    <p className="item__hora">{clave || hora || 'Sin horario'}</p>
                                    <p className="item__descripcion">{descripcion}</p>
                                    <button
                                        className={`item__boton ${esTareaPendiente ? 'item__boton--gris' : ''}`}
                                        onClick={() => !esTareaPendiente && tareaRealizada(tareaClave)}
                                        disabled={esTareaPendiente}
                                    >
                                        Tarea realizada
                                    </button>
                                    <button
                                        className="item__boton eliminar"
                                        onClick={() => eliminarTarea(tareaClave)}
                                    >
                                        Quitar tarea del listado
                                    </button>
                                </li>
                            </ul>
                        )
                    );
                })
            ) : (
                <></>
            )}
        </>
    );
};
