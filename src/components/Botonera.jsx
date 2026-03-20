import React from 'react'
import { AgregarTarea } from './AgregarTarea'

export const Botonera = ({setSelectedDayTasks, selectedDayTasks}) => {
    return (
        <div className='d-flex fd-col g-1rem ai-center w-100 md-w-25'>
            <AgregarTarea setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
        </div>
    )
}
