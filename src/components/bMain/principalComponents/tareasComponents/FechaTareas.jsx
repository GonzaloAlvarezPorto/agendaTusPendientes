import React, { useContext, useState } from 'react';
import { TaskContext } from '../../../../context/TaskContext';

export const FechaTareas = ({setSelectedDayTasks}) => {

    const { capitalizeFirstLetter } = useContext(TaskContext);

    // Fecha actual
    const fechaHoy = new Date();
    const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    
    // Día actual como valor inicial (ajuste para que Domingo sea 6)
    const diaHoyIndex = fechaHoy.getDay() === 0 ? 6 : fechaHoy.getDay() - 1; // Ajustar para el índice de días
    const diaHoy = diasSemana[diaHoyIndex];

    // Estado para la opción seleccionada en el select, inicializado al día actual
    const [diaSeleccionado, setDiaSeleccionado] = useState(diaHoy);
    
    // Calcular la fecha de la próxima ocurrencia del día seleccionado
    const calcularFechaProxima = (diaSemana) => {
        const diaSeleccionadoIndex = diasSemana.indexOf(diaSemana); // Índice del día seleccionado
        let diasDiferencia = (diaSeleccionadoIndex - diaHoyIndex + 7) % 7; // Diferencia de días

        const fechaObjetivo = new Date(fechaHoy);
        fechaObjetivo.setDate(fechaHoy.getDate() + diasDiferencia);

        const dia = diasSemana[fechaObjetivo.getDay() === 0 ? 6 : fechaObjetivo.getDay() - 1]; // Ajustamos el índice
        const diaNumero = fechaObjetivo.getDate();
        const mesNombre = meses[fechaObjetivo.getMonth()];

        // Si el día seleccionado es hoy, regresamos hoy
        if (diasDiferencia === 0) {
            return ` hoy ${dia} ${diaNumero} de ${mesNombre}`;
        }
        
        // Si el día seleccionado ya pasó, sumar 7 para la próxima ocurrencia
        if (diasDiferencia < 0) {
            diasDiferencia += 7;
        }
        
        
        return `l ${dia} ${diaNumero} de ${mesNombre}`;
    };

    
    // Define el texto a mostrar en el h2, dependiendo del día seleccionado
    const diaAMostrar = calcularFechaProxima(diaSeleccionado);
    
    const handleChange = (event) => {
        const selectedDay = event.target.value.toLowerCase();
        setDiaSeleccionado(selectedDay);
        setSelectedDayTasks(selectedDay);
    }

    return (
        <div className='tareas__fecha'>
            <h2>
                Tareas de{diaAMostrar}
            </h2>
            <div>
                <label htmlFor="verTareas">Mostrar tareas de</label>
                <select id="verTareas" name="verTareas" onChange={handleChange} value={diaSeleccionado}>
                    {diasSemana.map((dia, index) => {
                        // Si el día de la opción es el día actual, mostramos "hoy"
                        const diaMostrar = dia === diaHoy ? `Hoy (${dia})` : capitalizeFirstLetter(dia);
                        return (
                            <option key={index} value={dia}>{diaMostrar}</option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}
