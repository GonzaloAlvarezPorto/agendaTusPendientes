import React from 'react'
import { FechaTareas } from './FechaTareas'
import { ListadoTareas } from './ListadoTareas'

export const Tareas = () => {
    
    return (
        <ul className='tareas__listado'>
            <FechaTareas />
            <ListadoTareas />
        </ul>
    )
}
