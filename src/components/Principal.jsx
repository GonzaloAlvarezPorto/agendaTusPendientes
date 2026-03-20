import { useState } from "react";
import { Botonera } from "./Botonera";
import { Tareas } from "./Tareas";

export const Principal = () => {

    const [selectedDayTasks, setSelectedDayTasks] = useState('');

    return (
        <main>
            <div className="d-flex fd-col md-fd-row jc-center md-jc-between ai-start g-1rem w-90 m-auto py-1rem">
                <Tareas setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
                <Botonera setSelectedDayTasks={setSelectedDayTasks} selectedDayTasks={selectedDayTasks}/>
            </div>
        </main >
    );
};
