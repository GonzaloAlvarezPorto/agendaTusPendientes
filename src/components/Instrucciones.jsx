import React from 'react'

export const Instrucciones = ({ }) => {

    const instrucciones = [
        {
            titulo: 'Botón "Tarea realizada"',
            descripcion: 'Oculta la tarea hasta el mismo día de la semana siguiente.'
        },
        {
            titulo: 'Botón "Quitar tarea del listado"',
            descripcion: 'Elimina la tarea definitivamente del listado, no vuelve a aparecer cuando se reinician.'
        },
        {
            titulo: 'Botón "Reiniciar tareas"',
            descripcion: 'Reinicia el listado de tareas del día a mostrar con las tareas agregadas inclusive. Las eliminadas no vuelven a aparecer.'
        }
    ];

    return (
        <div className='w-100 d-flex fd-col jc-between g-0_5rem ta-center ai-center fc-letrasLogo'>
            {instrucciones.map((item, index) => (
                <div 
                    key={index}
                    className='d-flex fd-col jc-center py-1rem md-jc-between bgc-fondoAgregar ai-center w-100'
                >
                    <p>{item.titulo}</p>
                    <p>{item.descripcion}</p>
                </div>
            ))}
        </div>
    )
}