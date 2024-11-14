import React, { useEffect, useState } from 'react';

export const ListadoTareas = () => {
    const [tareas, setTareas] = useState({});

    useEffect(() => {
        // Cargar tareas desde localStorage y manejar el caso de que no sea un objeto
        const tareasGuardadas = JSON.parse(localStorage.getItem("tareas-jueves")) || {};
        setTareas(typeof tareasGuardadas === 'object' && !Array.isArray(tareasGuardadas) ? tareasGuardadas : {});
    }, []);

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
