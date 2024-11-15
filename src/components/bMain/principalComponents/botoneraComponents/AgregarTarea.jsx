import React, { useState } from 'react';
import { Instrucciones } from './Instrucciones';

export const AgregarTarea = () => {
    const [mostrar, setMostrar] = useState(false);

    const mostrarExplicacion = () => {
        setMostrar(!mostrar);
    };

    const agregarTarea = () => {
        const opciones = document.getElementById("opciones");
        const horario = document.getElementById("horario");
        const tarea = document.getElementById("tarea");

        const tareasKey = `tareas-${opciones.value}`; // Clave dinámica según el valor seleccionado
        let tareasExistentes = JSON.parse(localStorage.getItem(tareasKey)) || {}; // Recuperar o inicializar como objeto

        // Función para validar el formato HH:MM
        const validarFormatoHora = (hora) => {
            const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
            return regex.test(hora);
        };

        // Función para formatear la hora a 2 dígitos (ej. 9 -> 09)
        const formatearHora = (hora) => {
            const [hh, mm] = hora.split(":");
            const hhFormateada = hh.padStart(2, "0"); // Añade un 0 al inicio si la hora es menor a 10
            const mmFormateada = mm.padStart(2, "0"); // Añade un 0 al inicio si los minutos son menores a 10
            return `${hhFormateada}:${mmFormateada}`;
        };

        // Función para sumar un minuto a la hora
        const sumarUnMinuto = (hora) => {
            let [hh, mm] = hora.split(":").map(Number);
            mm++; // Sumar un minuto

            if (mm === 60) {
                mm = 0; // Si los minutos son 60, los resetamos a 0 y sumamos una hora
                hh++;
            }

            if (hh === 24) {
                hh = 0; // Si la hora es 24, la resetemos a 00
            }

            return formatearHora(`${hh}:${mm}`); // Devolver la nueva hora formateada
        };

        // Validar que la tarea no esté vacía
        if (!tarea.value.trim()) {
            alert("La tarea no puede estar vacía.");
            return; // Detener la ejecución si la tarea está vacía
        }

        // Determinar la clave del horario
        let horarioClave = horario.value.trim(); // Usar el valor ingresado en horario
        if (horarioClave) {
            // Si hay un horario ingresado, formatearlo y validarlo
            horarioClave = formatearHora(horarioClave); // Formatea el horario
            if (!validarFormatoHora(horarioClave)) {
                alert("El formato del horario debe ser HH:MM");
                return; // Detener la ejecución si el formato es incorrecto
            }

            // Si el horario ya existe, sumar un minuto y seguir verificando
            while (tareasExistentes[horarioClave]) {
                horarioClave = sumarUnMinuto(horarioClave); // Sumar un minuto
            }
        } else {
            // Si no se ingresa horario, buscar el siguiente S/H disponible
            let contador = 1;
            while (tareasExistentes[`S/H${contador}`]) {
                contador++;
            }
            horarioClave = `S/H${contador}`;
        }

        // Agregar o actualizar la tarea
        tareasExistentes[horarioClave] = tarea.value;

        // Actualizar el localStorage
        localStorage.setItem(tareasKey, JSON.stringify(tareasExistentes));

        // Limpiar los inputs (opcional)
        horario.value = "";
        tarea.value = "";
    };

    // Función para manejar el evento de presionar "Enter"
    const manejarEnter = (event) => {
        if (event.key === "Enter") {
            agregarTarea();
        }
    };

    return (
        <>
            <div className="agregar-tarea">
                <label htmlFor="opciones">Agregar tarea a:</label>
                <select
                    id="opciones"
                    name="opciones"
                >
                    <option value="todos">Todos los días</option>
                    <option value="pendientes">Pendientes</option>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miércoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Viernes</option>
                    <option value="sábado">Sábado</option>
                    <option value="domingo">Domingo</option>
                </select>
                <label htmlFor="horario">Horario:</label>
                <input
                    type="text"
                    id="horario"
                    name="horario"
                    placeholder="Ingresá la hora (HH.MM)"
                />
                <label htmlFor="tarea">Tarea:</label>
                <input
                    type="text"
                    placeholder="Ingresá una descripción"
                    id="tarea"
                    name="tarea"
                    onKeyDown={manejarEnter} // Agregar el manejador para "Enter"
                />
                <button onClick={agregarTarea}>Agregar tarea</button>
                <button className='reiniciar__boton' >
                    Reiniciar tareas
                </button>
                <button onClick={mostrarExplicacion}>
                    {mostrar ? "Ocultar explicación" : "Mostrar explicación"}
                </button>
            </div>
            <Instrucciones mostrar={mostrar} />
        </>
    );
};
