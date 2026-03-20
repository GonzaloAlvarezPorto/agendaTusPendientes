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
        <div className='d-flex fd-col g-0_2rem w-100'>
            {/* Tareas Pendientes en un desplegable */}
            {tareasOrdenadas.filter(({ clave }) => /^T\/P/.test(clave)).length > 0 && (
                <details>
                    <summary className='ai-center d-flex fd-row cu-poi jc-center bgc-unBlancoMenos py-1rem w-100'>▶ Tareas Pendientes</summary>
                    {tareasOrdenadas
                        .filter(({ clave }) => /^T\/P/.test(clave))  // Filtrar solo tareas pendientes
                        .map(({ clave, descripcion }, index) => {
                            const visibilidadDia = JSON.parse(localStorage.getItem(`visibilidad-${selectedDayTasks}`)) || {};
                            const tareaClave = clave;

                            // Verificar si la tarea es visible
                            const tareaVisible = visibilidadDia[tareaClave] !== false;
                            const esTareaPendiente = /^T\/P/.test(tareaClave);

                            return (
                                tareaVisible && (
                                    <ul className='bgc-crema' key={index}>
                                        <li className='d-flex fd-col g-0_5rem py-1rem md-fd-row ai-center m-auto w-90'>
                                            <p className='d-flex ai-center w-90 ta-right md-w-20'>{clave}</p>
                                            <p className='d-flex ai-center w-90 ta-left md-w-60'>{descripcion}</p>
                                            <button
                                                onClick={() => !esTareaPendiente && tareaRealizada(tareaClave)}
                                                disabled={esTareaPendiente}
                                                className='btn-gris'
                                            >
                                                Tarea realizada
                                            </button>
                                            <button
                                                className='btn'
                                                onClick={() => eliminarTarea(tareaClave)}
                                            >
                                                Quitar tarea del listado
                                            </button>
                                        </li>
                                    </ul>
                                )
                            );
                        })
                    }
                </details>
            )}

            {/* Otras tareas */}
            {tareasOrdenadas
                .filter(({ clave }) => !/^T\/P/.test(clave))  // Filtrar tareas que no son pendientes
                .map(({ clave, hora, descripcion }, index) => {
                    const visibilidadDia = JSON.parse(localStorage.getItem(`visibilidad-${selectedDayTasks}`)) || {};
                    const tareaClave = clave || hora;

                    const tareaVisible = visibilidadDia[tareaClave] !== false;

                    return (
                        tareaVisible && (
                            <ul className='bgc-unBlancoMenos' key={index}>
                                <li className='d-flex fd-col g-0_5rem py-1rem md-fd-row ai-center m-auto w-90'>
                                    <p className='d-flex ai-center w-90 ta-right md-w-20'>{clave || hora || 'Sin horario'}</p>
                                    <p className='d-flex ai-center w-90 ta-left md-w-60'>{descripcion}</p>
                                    <button
                                        className='btn'
                                        onClick={() => tareaRealizada(tareaClave)}
                                    >
                                        Tarea realizada
                                    </button>
                                    <button
                                        className='btn'
                                        onClick={() => eliminarTarea(tareaClave)}
                                    >
                                        Quitar tarea del listado
                                    </button>
                                </li>
                            </ul>
                        )
                    );
                })}
        </div>
    );

};
