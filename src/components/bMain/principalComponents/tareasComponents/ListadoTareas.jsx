import React, { useEffect, useState } from 'react';

export const ListadoTareas = ({ selectedDayTasks }) => {
    const [tareas, setTareas] = useState({});

    useEffect(() => {
        // Función para actualizar las tareas desde localStorage
        const actualizarTareas = () => {
            if (selectedDayTasks) {
                const tareasGuardadas = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};
                setTareas(tareasGuardadas);
            }
        };

        // Actualizar tareas inmediatamente al cargar
        actualizarTareas();

        // Actualizar tareas cada 1 segundo
        const interval = setInterval(actualizarTareas, 1000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, [selectedDayTasks]);

    return (
        <>
            {Object.entries(tareas).map(([hora, descripcion], index) => (
                <li key={index} className="tareas__item">
                    <p className='item__hora'>{hora}</p>
                    <p className='item__descripcion'>{descripcion}</p>
                    <button className='item__boton'>Tarea realizada</button>
                    <button className='item__boton eliminar'>Quitar tarea del listado</button>
                </li>
            ))}
        </>
    );
};
