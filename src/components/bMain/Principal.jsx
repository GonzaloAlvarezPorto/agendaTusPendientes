import React, { useState, useEffect } from 'react';
import dataTareas from '../../data/tareas.json';

export const Principal = () => {
    const tareasIniciales = dataTareas[0]; // Accedemos al objeto principal que contiene los días
    const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const fechaHoy = new Date();
    const diaDeLaSemana = diasSemana[fechaHoy.getDay()]; // Obtiene el día actual en minúsculas

    const capitalizarPrimeraLetra = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Cargar tareas del día desde localStorage o usar las iniciales
    const cargarTareasIniciales = () => {
        const tareasGuardadas = localStorage.getItem(`tareas-${diaDeLaSemana}`);
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : tareasIniciales[diaDeLaSemana] || {};
    };

    // Verifica si hay tareas para el día actual
    const [tareasDelDia, setTareasDelDia] = useState(cargarTareasIniciales);

    // Función para cargar el estado de visibilidad desde localStorage
    const cargarEstadoInicial = () => {
        const estadoGuardado = localStorage.getItem(`visibilidad-${diaDeLaSemana}`);
        if (estadoGuardado) {
            return JSON.parse(estadoGuardado); // Cargamos el estado guardado
        } else {
            return Object.keys(tareasDelDia || {}).map(() => true); // Si no hay nada en localStorage, todas las tareas son visibles
        }
    };

    // Estado para la visibilidad de las tareas (se carga desde localStorage)
    const [visibilidad, setVisibilidad] = useState(cargarEstadoInicial);

    // Guardar el estado de visibilidad en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(visibilidad));
    }, [visibilidad, diaDeLaSemana]);

    // Guardar las tareas actualizadas en localStorage
    useEffect(() => {
        localStorage.setItem(`tareas-${diaDeLaSemana}`, JSON.stringify(tareasDelDia));
    }, [tareasDelDia, diaDeLaSemana]);

    // Función que cambia la visibilidad de una tarea específica
    const cambiarDisplay = (index) => {
        setVisibilidad((prevVisibilidad) =>
            prevVisibilidad.map((visible, i) => (i === index ? false : visible))
        );
    };

    // Función para eliminar una tarea específica
    const eliminarTarea = (hora) => {
        const nuevasTareas = { ...tareasDelDia };
        delete nuevasTareas[hora]; // Eliminar la tarea por hora
        setTareasDelDia(nuevasTareas);
        setVisibilidad((prevVisibilidad) => prevVisibilidad.filter((_, i) => i !== Object.keys(tareasDelDia).indexOf(hora))); // Eliminar la visibilidad de la tarea eliminada
    };

    // Función para reiniciar la visibilidad de todas las tareas
    const reiniciarTareas = () => {
        const todasVisibles = Object.keys(tareasDelDia || {}).map(() => true);
        setVisibilidad(todasVisibles);
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(todasVisibles)); // Actualizamos el localStorage
    };

    // Función para reiniciar tareas a las originales
    const reiniciarTareasOriginales = () => {
        const tareasOriginales = tareasIniciales[diaDeLaSemana] || {};
        setTareasDelDia(tareasOriginales);
        setVisibilidad(Object.keys(tareasOriginales).map(() => true)); // Hacer todas las tareas visibles
        localStorage.setItem(`tareas-${diaDeLaSemana}`, JSON.stringify(tareasOriginales)); // Actualizamos el localStorage
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(Object.keys(tareasOriginales).map(() => true))); // Restablecemos la visibilidad
    };

    // Estados para agregar nueva tarea
    const [nuevaHora, setNuevaHora] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');

    // Función para validar el formato de la hora
    const esHoraValida = (hora) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]).[0-5][0-9]$/; // Formato HH.MM
        return regex.test(hora);
    };

    // Función para agregar una nueva tarea
    const agregarTarea = () => {
        if (esHoraValida(nuevaHora) && nuevaDescripcion) {
            const nuevasTareas = { ...tareasDelDia, [nuevaHora]: nuevaDescripcion };
            
            // Ordenar las tareas por horario
            const tareasOrdenadas = Object.entries(nuevasTareas)
                .sort(([horaA], [horaB]) => horaA.localeCompare(horaB)) // Ordenar cronológicamente
                .reduce((obj, [hora, desc]) => {
                    obj[hora] = desc;
                    return obj;
                }, {});

            setTareasDelDia(tareasOrdenadas);
            setVisibilidad((prevVisibilidad) => [...prevVisibilidad, true]); // Añadir la nueva tarea como visible
            setNuevaHora('');
            setNuevaDescripcion('');
        } else {
            alert("Por favor, ingresa una hora válida en formato HH.MM.");
        }
    };

    return (
        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                {
                    tareasDelDia ? (
                        <>
                            <ul className='tareas__listado'>
                                <h3>{capitalizarPrimeraLetra(diaDeLaSemana)}</h3>
                                {Object.entries(tareasDelDia).map(([hora, descripcion], i) => (
                                    visibilidad[i] && ( // Verificamos si la tarea debe ser visible
                                        <li className="tareas__item" key={i}>
                                            <p className='item__hora'>
                                                {hora}
                                            </p>
                                            <p className='item__descripcion'>
                                                {descripcion}
                                            </p>
                                            <button
                                                className='item__boton'
                                                onClick={() => cambiarDisplay(i)} // Pasamos el índice al cambiar la visibilidad
                                            >
                                                Tarea realizada
                                            </button>
                                            <button
                                                className='item__boton eliminar'
                                                onClick={() => eliminarTarea(hora)} // Eliminar tarea al hacer clic
                                            >
                                                Quitar tarea del listado
                                            </button>
                                        </li>
                                    )
                                ))}
                            </ul>

                            {/* Formulario para agregar nueva tarea */}
                            <div className="agregar-tarea">
                                <input
                                    type="text"
                                    placeholder="Ingresá la hora (HH.MM)"
                                    value={nuevaHora}
                                    onChange={(e) => setNuevaHora(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Ingresá una descripción"
                                    value={nuevaDescripcion}
                                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                                />
                                <button onClick={agregarTarea}>Agregar tarea</button>
                                <button className='reiniciar__boton' onClick={reiniciarTareas}>
                                    Reiniciar tareas
                                </button>
                                <button className='reiniciar__boton' onClick={reiniciarTareasOriginales}>
                                    Borrar todas las tareas
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No hay tareas para hoy</p>
                    )
                }
            </div>
        </div>
    );
};
