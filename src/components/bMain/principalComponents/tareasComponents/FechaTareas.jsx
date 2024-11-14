import React, { useState } from 'react';

export const FechaTareas = () => {
    // Fecha actual
    const fechaHoy = new Date();
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
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

        // Si el día seleccionado es hoy, regresamos hoy
        if (diasDiferencia === 0) {
            return `${diaHoy} ${fechaHoy.getDate()} ${meses[fechaHoy.getMonth()]}`;
        }
        
        // Si el día seleccionado ya pasó, sumar 7 para la próxima ocurrencia
        if (diasDiferencia < 0) {
            diasDiferencia += 7;
        }
        
        const fechaObjetivo = new Date(fechaHoy);
        fechaObjetivo.setDate(fechaHoy.getDate() + diasDiferencia);

        const dia = diasSemana[fechaObjetivo.getDay() === 0 ? 6 : fechaObjetivo.getDay() - 1]; // Ajustamos el índice
        const diaNumero = fechaObjetivo.getDate();
        const mesNombre = meses[fechaObjetivo.getMonth()];
        
        return `${dia} ${diaNumero} ${mesNombre}`;
    };

    // Maneja el cambio en el selector
    const handleSelectChange = (event) => {
        setDiaSeleccionado(event.target.value);
    };

    // Define el texto a mostrar en el h2, dependiendo del día seleccionado
    const diaAMostrar = calcularFechaProxima(diaSeleccionado);

    return (
        <div className='tareas__fecha'>
            <h2>
                Viendo tareas del {diaAMostrar}
            </h2>
            <div>
                <label htmlFor="verTareas">Ver tareas del</label>
                <select id="verTareas" name="verTareas" onChange={handleSelectChange} value={diaSeleccionado}>
                    {diasSemana.map((dia, index) => (
                        <option key={index} value={dia}>{dia}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
