import React, { useState } from 'react'
import { FechaTareas } from './FechaTareas'
import { ListadoTareas } from './ListadoTareas'

export const Tareas = ({setSelectedDayTasks, selectedDayTasks}) => {

    return (
        <div className='d-flex w-100 md-w-75 fd-col fc-negro'>
            <FechaTareas setSelectedDayTasks={setSelectedDayTasks} />
            <ListadoTareas selectedDayTasks={selectedDayTasks} />
        </div>
    )
}
