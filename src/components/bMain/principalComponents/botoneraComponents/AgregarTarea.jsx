import React, { useState, useEffect } from 'react';
import { Instrucciones } from './Instrucciones';

export const AgregarTarea = ({ setSelectedDayTasks, selectedDayTasks }) => {
    const [mostrar, setMostrar] = useState(false);
    const [habilitarHorario, setHabilitarHorario] = useState(true); // Estado para habilitar o deshabilitar el input de horario

    const mostrarExplicacion = () => {
        setMostrar(!mostrar);
    };

    // Función para obtener el día de la semana actual
    const obtenerDiaDeHoy = () => {
        const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const hoy = new Date();
        return dias[hoy.getDay()]; // Devuelve el nombre del día (ej. "lunes", "martes", etc.)
    };

    useEffect(() => {
        const opcionSeleccionada = document.getElementById("opciones").value;
        setHabilitarHorario(opcionSeleccionada !== "pendientes");

        if (opcionSeleccionada === "pendientes") {
            document.getElementById("horario").value = ''; // Vaciar el campo
            document.getElementById("horario").style.backgroundColor = '#333'; // Cambiar a gris oscuro
        } else {
            document.getElementById("horario").style.backgroundColor = ''; // Restaurar color original
        }

        // Establecer el día de hoy como opción seleccionada por defecto
        const diaHoy = obtenerDiaDeHoy();
        document.getElementById("opciones").value = diaHoy; // Asigna el día actual como valor seleccionado
    }, []); // Este efecto se ejecuta solo al montar el componente

    const manejarCambioOpcion = () => {
        const opcionSeleccionada = document.getElementById("opciones").value;
        setHabilitarHorario(opcionSeleccionada !== "pendientes");

        if (opcionSeleccionada === "pendientes") {
            document.getElementById("horario").value = ''; // Vaciar el campo
            document.getElementById("horario").style.backgroundColor = '#333'; // Cambiar a gris oscuro
        } else {
            document.getElementById("horario").style.backgroundColor = ''; // Restaurar color original
        }
    };

    const sumarUnMinuto = (hora) => {
        const [hh, mm] = hora.split(":").map(Number);
        let nuevosMinutos = mm + 1;
        let nuevasHoras = hh;

        if (nuevosMinutos === 60) {
            nuevosMinutos = 0;
            nuevasHoras = (nuevasHoras + 1) % 24;
        }

        return `${String(nuevasHoras).padStart(2, "0")}:${String(nuevosMinutos).padStart(2, "0")}`;
    };

    const obtenerClaveSinHorario = (tareasExistentes, prefijo) => {
        let contador = 1;
        while (tareasExistentes[`${prefijo}${contador}`]) {
            contador++;
        }
        return `${prefijo}${contador}`;
    };

    const formatearHora = (hora) => {
        if (!hora || typeof hora !== "string") {
            throw new Error("Hora inválida: debe ser una cadena en formato HH:MM");
        }

        const partes = hora.split(":");
        if (partes.length !== 2) {
            throw new Error("Hora inválida: debe contener exactamente una coma (:) para separar las horas y los minutos.");
        }

        const [hh, mm] = partes;

        if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
            throw new Error("Hora inválida: las horas deben estar entre 00 y 23 y los minutos entre 00 y 59.");
        }

        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };

    const agregarTarea = () => {
        const opciones = document.getElementById("opciones");
        const horario = document.getElementById("horario");
        const tarea = document.getElementById("tarea");

        const validarFormatoHora = (hora) => {
            const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
            return regex.test(hora);
        };

        if (!tarea.value.trim()) {
            alert("La tarea no puede estar vacía.");
            return;
        }

        let horarioClave = horario.value.trim();
        if (horarioClave) {
            if (!validarFormatoHora(horarioClave)) {
                alert("El formato del horario debe ser HH:MM");
                return;
            }
            horarioClave = formatearHora(horarioClave);
        }

        if (opciones.value === "todos") {
            const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

            diasSemana.forEach((dia) => {
                const tareasKey = `tareas-${dia}`;
                let tareasExistentes = JSON.parse(localStorage.getItem(tareasKey)) || {};

                let horarioDiaClave = horarioClave || obtenerClaveSinHorario(tareasExistentes, "S/H");

                while (tareasExistentes[horarioDiaClave]) {
                    horarioDiaClave = sumarUnMinuto(horarioDiaClave);
                }

                tareasExistentes[horarioDiaClave] = tarea.value;
                localStorage.setItem(tareasKey, JSON.stringify(tareasExistentes));
            });
        } else {
            const tareasKey = `tareas-${opciones.value}`;
            let tareasExistentes = JSON.parse(localStorage.getItem(tareasKey)) || {};

            const prefijo = opciones.value === "pendientes" ? "T/P" : "S/H";
            let horarioClaveFinal = horarioClave || obtenerClaveSinHorario(tareasExistentes, prefijo);

            while (tareasExistentes[horarioClaveFinal]) {
                horarioClaveFinal = sumarUnMinuto(horarioClaveFinal);
            }

            tareasExistentes[horarioClaveFinal] = tarea.value;
            localStorage.setItem(tareasKey, JSON.stringify(tareasExistentes));
        }

        horario.value = "";
        tarea.value = "";
    };

    const reiniciarTareas = () => {
        // Construir la clave dinámica basada en el día seleccionado
        const tareasAReiniciar = `visibilidad-${selectedDayTasks}`;
    
        // Obtener el objeto de tareas del localStorage
        const tareasDelDiaAReiniciar = JSON.parse(localStorage.getItem(tareasAReiniciar));
    
        // Validar si existen tareas para el día seleccionado
        if (!tareasDelDiaAReiniciar) {
            console.error(`No se encontraron tareas para ${selectedDayTasks}`);
            return;
        }
    
        // Cambiar todos los valores a true
        const tareasReiniciadas = Object.fromEntries(
            Object.entries(tareasDelDiaAReiniciar).map(([clave, _]) => [clave, true])
        );
    
        // Guardar el objeto actualizado en el localStorage
        localStorage.setItem(tareasAReiniciar, JSON.stringify(tareasReiniciadas));
    
    };
    

    const manejarEnter = (event) => {
        if (event.key === "Enter") {
            agregarTarea();
        }
    };

    return (
        <>
            <div className="agregar-tarea">
                <label htmlFor="opciones">Agregar tarea a:</label>
                <select id="opciones" name="opciones" onChange={manejarCambioOpcion}>
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
                    disabled={!habilitarHorario}
                />
                <label htmlFor="tarea">Tarea:</label>
                <input
                    type="text"
                    placeholder="Ingresá una descripción"
                    id="tarea"
                    name="tarea"
                    onKeyDown={manejarEnter}
                />
                <button onClick={agregarTarea}>Agregar tarea</button>
                <button className="reiniciar__boton" onClick={reiniciarTareas}>Reiniciar tareas</button>
                <button onClick={mostrarExplicacion}>
                    {mostrar ? "Ocultar explicación" : "Mostrar explicación"}
                </button>
            </div>
            <Instrucciones mostrar={mostrar} />
        </>
    );
};
