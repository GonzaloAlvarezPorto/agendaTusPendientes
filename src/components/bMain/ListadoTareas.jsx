import React, { useContext } from 'react'
import { CartContext } from '../../context/CartProvider';

export const ListadoTareas = () => {

    const {capitalizarPrimeraLetra,
        diaDeLaSemana,
        formatearFecha,
        fechaHoy,
        tareasDelDia,
        visibilidad,
        cambiarDisplay,
        eliminarTarea
     } = useContext(CartContext);

    return (
        <ul className='tareas__listado'>
            <h2>
                {capitalizarPrimeraLetra(diaDeLaSemana)} - {formatearFecha(fechaHoy)}
            </h2>
            {Object.entries(tareasDelDia)
                .sort(([horaA], [horaB]) => {
                    const esSinHorarioA = horaA.startsWith("S/H");
                    const esSinHorarioB = horaB.startsWith("S/H");

                    // Si ambas tareas son sin horario, no cambia el orden
                    if (esSinHorarioA && esSinHorarioB) return 0;
                    // Las tareas sin horario deben ir al principio
                    if (esSinHorarioA) return -1;
                    if (esSinHorarioB) return 1;
                    // Ordenar por horario (tareas con formato de hora)
                    return horaA.localeCompare(horaB);
                })
                .map(([hora, descripcion], i) => (
                    visibilidad[hora] && (
                        <li className="tareas__item" key={i}>
                            <p className='item__hora'>
                                {hora}
                            </p>
                            <p className='item__descripcion'>
                                {descripcion}
                            </p>
                            <button
                                className='item__boton'
                                onClick={() => cambiarDisplay(hora)}
                            >
                                Tarea realizada
                            </button>
                            <button
                                className='item__boton eliminar'
                                onClick={() => eliminarTarea(hora)}
                            >
                                Quitar tarea del listado
                            </button>
                        </li>
                    )
                ))}
        </ul>
    )
}
