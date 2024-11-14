import React, { useState } from 'react'
import { Instrucciones } from './Instrucciones';

export const AgregarTarea = () => {

    const [mostrar, setMostrar] = useState(false);

    const mostrarExplicacion = () => {
        setMostrar(!mostrar);
    }

    return (
        <>
            <div className="agregar-tarea">
                <label htmlFor="opciones">Agregar tarea a:</label>
                <select
                    id="opciones"
                    name="opciones"
                >
                    <option value="todos">Todos los días</option>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miércoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Viernes</option>
                    <option value="sábado">Sábado</option>
                    <option value="domingo">Domingo</option>
                </select>
                <label htmlFor="horario">Horario:</label>
                <input
                    type="text"
                    id="horario"
                    name="horario"
                    placeholder="Ingresá la hora (HH.MM)"
                />
                <label htmlFor="tarea">Tarea:</label>
                <input
                    type="text"
                    placeholder="Ingresá una descripción"
                    id="tarea"
                    name="tarea"
                />
                <button >Agregar tarea</button>
                <button className='reiniciar__boton' >
                    Reiniciar tareas
                </button>
                <button onClick={mostrarExplicacion}>
                    {mostrar ? "Ocultar explicación" : "Mostrar explicación"}
                </button>
            </div>
            <Instrucciones mostrar={mostrar} />
        </>
    )
}
