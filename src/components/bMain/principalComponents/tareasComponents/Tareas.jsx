import React, { useState } from 'react'
import { FechaTareas } from './FechaTareas'
import { ListadoTareas } from './ListadoTareas'

export const Tareas = ({setSelectedDayTasks, selectedDayTasks}) => {

    return (
        <ul className='tareas__listado'>
            <FechaTareas setSelectedDayTasks={setSelectedDayTasks} />
            <ListadoTareas selectedDayTasks={selectedDayTasks} />
        </ul>
    )
}
