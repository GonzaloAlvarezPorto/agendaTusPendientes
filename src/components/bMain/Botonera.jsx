import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartProvider';

export const Botonera = () => {
    const {
        nuevaHora,
        manejarTeclado,
        inputRef,
        nuevaDescripcion,
        agregarTarea,
        reiniciarTareas,
        toggleExplicacion,
        mostrarExplicacion,
        setNuevaDescripcion,
        setNuevaHora
    } = useContext(CartContext);

    const [diaSeleccionado, setDiaSeleccionado] = useState('');

    // Función para obtener el día actual
    const obtenerDiaActual = () => {
        const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diaActual = new Date().getDay(); // Obtiene el día de la semana (0-6)
        return dias[diaActual]; // Devuelve el nombre del día
    };

    useEffect(() => {
        // Establece el día actual como valor por defecto del select
        setDiaSeleccionado(obtenerDiaActual());
    }, []);

    return (
        <div className='contenedor__botonera'>
            <div className="agregar-tarea">
                <label htmlFor="opciones">Agregar tarea a:</label>
                <select 
                    id="opciones" 
                    name="opciones" 
                    value={diaSeleccionado} // Establece el valor seleccionado
                    onChange={(e) => setDiaSeleccionado(e.target.value)} // Actualiza el estado cuando cambia
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
                <label>Horario:</label>
                <input
                    type="text"
                    placeholder="Ingresá la hora (HH.MM)"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    onKeyDown={manejarTeclado}
                    />
                <label>Tarea:</label>
                <input
                    type="text"
                    placeholder="Ingresá una descripción"
                    value={nuevaDescripcion}
                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                    onKeyDown={manejarTeclado}
                    ref={inputRef}
                />
                <button onClick={agregarTarea}>Agregar tarea</button>
                <button className='reiniciar__boton' onClick={reiniciarTareas}>
                    Reiniciar tareas
                </button>
                <button onClick={toggleExplicacion}>
                    {mostrarExplicacion ? "Ocultar explicación" : "Mostrar explicación"}
                </button>
            </div>
            <div
                className='cuerpo__informacion'
                style={{ display: mostrarExplicacion ? 'flex' : 'none' }}
            >
                <div className='contenedorInformacion'>
                    <p>Botón "Tarea realizada"</p>
                    <p>Oculta la tarea hasta el mismo día de la semana siguiente.</p>
                </div>
                <div className='contenedorInformacion'>
                    <p>Botón "Quitar tarea del listado"</p>
                    <p>Elimina la tarea definitivamente del listado, no vuelve a aparecer cuando se reinician.</p>
                </div>
                <div className='contenedorInformacion'>
                    <p>Botón "Reiniciar tareas"</p>
                    <p>Reinicia el listado de tareas con las tareas agregadas inclusive. Las eliminadas no vuelven a aparecer.</p>
                </div>
            </div>
        </div>
    );
};
