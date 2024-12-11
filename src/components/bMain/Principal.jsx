import { useState } from "react";
import { Botonera } from "./principalComponents/botoneraComponents/Botonera";
import { Tareas } from "./principalComponents/tareasComponents/Tareas";

export const Principal = () => {

    const [selectedDayTasks, setSelectedDayTasks] = useState('');

    return (
        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                <Tareas setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
                <Botonera setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
            </div>
        </div >
    );
};
