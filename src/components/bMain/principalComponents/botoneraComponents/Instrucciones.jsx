import React from 'react'

export const Instrucciones = ({mostrar}) => {
    return (
        <div className='cuerpo__informacion' style={{ display: mostrar ? 'flex' : 'none' }}>
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
                <p>Reinicia el listado de tareas del día a mostrar con las tareas agregadas inclusive. Las eliminadas no vuelven a aparecer.</p>
            </div>
        </div>
    )
}
