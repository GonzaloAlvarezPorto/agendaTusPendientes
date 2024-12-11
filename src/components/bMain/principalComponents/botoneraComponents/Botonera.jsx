import React from 'react'
import { AgregarTarea } from './AgregarTarea'

export const Botonera = ({setSelectedDayTasks, selectedDayTasks}) => {
    return (
        <div className='contenedor__botonera'>
            <AgregarTarea setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
        </div>
    )
}
