import React, { useEffect, useState } from 'react';

export const ListadoTareas = ({selectedDayTasks}) => {
    const [tareas, setTareas] = useState({});

    useEffect(() => {
        // Cargar tareas del día seleccionado desde localStorage
        if (selectedDayTasks) {
            const tareasGuardadas = JSON.parse(localStorage.getItem(`tareas-${selectedDayTasks}`)) || {};
            setTareas(typeof tareasGuardadas === 'object' && !Array.isArray(tareasGuardadas) ? tareasGuardadas : {});
        }
    }, [selectedDayTasks]); // Ejecutar cada vez que cambie selectedDayTasks

    return (
        <>
            {Object.entries(tareas).map(([hora, descripcion], index) => (
                <li key={index} className="tareas__item">
                    <p className='item__hora'>
                        {hora} {/* Muestra el horario como la clave */}
                    </p>
                    <p className='item__descripcion'>
                        {descripcion} {/* Muestra la descripción de la tarea como el valor */}
                    </p>
                    <button className='item__boton'>
                        Tarea realizada
                    </button>
                    <button className='item__boton eliminar'>
                        Quitar tarea del listado
                    </button>
                </li>
            ))}
        </>
    );
}
