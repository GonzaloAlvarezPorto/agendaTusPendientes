import { Botonera } from "./principalComponents/botoneraComponents/Botonera";
import { Tareas } from "./principalComponents/tareasComponents/Tareas";

export const Principal = () => {

    return (
        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                <Tareas/>
                <Botonera/>
            </div>
        </div >
    );
};
