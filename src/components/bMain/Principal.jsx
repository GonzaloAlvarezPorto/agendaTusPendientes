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

    const [tareasDelDia, setTareasDelDia] = useState(cargarTareasIniciales);

    const cargarEstadoInicial = () => {
        const estadoGuardado = localStorage.getItem(`visibilidad-${diaDeLaSemana}`);
        if (estadoGuardado) {
            return JSON.parse(estadoGuardado); // Cargamos el estado guardado
        } else {
            return Object.keys(tareasDelDia || {}).map(() => true); // Si no hay nada en localStorage, todas las tareas son visibles
        }
    };

    const [visibilidad, setVisibilidad] = useState(cargarEstadoInicial);

    useEffect(() => {
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(visibilidad));
    }, [visibilidad, diaDeLaSemana]);

    useEffect(() => {
        localStorage.setItem(`tareas-${diaDeLaSemana}`, JSON.stringify(tareasDelDia));
    }, [tareasDelDia, diaDeLaSemana]);

    const cambiarDisplay = (index) => {
        setVisibilidad((prevVisibilidad) =>
            prevVisibilidad.map((visible, i) => (i === index ? false : visible))
        );
    };

    const eliminarTarea = (hora) => {
        const nuevasTareas = { ...tareasDelDia };
        delete nuevasTareas[hora]; // Eliminar la tarea por hora
        setTareasDelDia(nuevasTareas);
        setVisibilidad((prevVisibilidad) => prevVisibilidad.filter((_, i) => i !== Object.keys(tareasDelDia).indexOf(hora))); // Eliminar la visibilidad de la tarea eliminada
    };

    const reiniciarTareas = () => {
        const todasVisibles = Object.keys(tareasDelDia || {}).map(() => true);
        setVisibilidad(todasVisibles);
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(todasVisibles)); // Actualizamos el localStorage
    };

    const [nuevaHora, setNuevaHora] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');

    const esHoraValida = (hora) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]).[0-5][0-9]$/; // Formato estricto HH.MM
        return regex.test(hora);
    };

    const normalizarHora = (hora) => {
        let [horas, minutos] = hora.split('.');
        horas = horas.padStart(2, '0'); // Agrega un 0 al principio si es necesario
        minutos = minutos.padStart(2, '0'); // Lo mismo para los minutos
        return `${horas}.${minutos}`;
    };

    const agregarTarea = () => {
        if (nuevaHora && !esHoraValida(nuevaHora)) {
            alert("El formato de la hora es inválido. Debe ser HH.MM");
            return;
        }

        const horaTarea = nuevaHora ? normalizarHora(nuevaHora) : '';
        const nuevasTareas = { ...tareasDelDia, [horaTarea]: nuevaDescripcion };

        const tareasOrdenadas = Object.entries(nuevasTareas)
            .sort(([horaA], [horaB]) => {
                if (horaA === '') return 1;
                if (horaB === '') return -1;

                return horaA.localeCompare(horaB);
            })
            .reduce((obj, [hora, desc]) => {
                obj[hora] = desc;
                return obj;
            }, {});

        setTareasDelDia(tareasOrdenadas);
        setVisibilidad((prevVisibilidad) => [...prevVisibilidad, true]);
        setNuevaHora('');
        setNuevaDescripcion('');
    };

    const manejarTeclado = (event) => {
        if (event.key === 'Enter') {
            agregarTarea();
        }
    };

    // Estado para controlar la visibilidad de la sección de explicación
    const [mostrarExplicacion, setMostrarExplicacion] = useState(false);

    // Función para alternar la visibilidad de la explicación
    const toggleExplicacion = () => {
        setMostrarExplicacion(!mostrarExplicacion);
    };

    return (
        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                {
                    tareasDelDia ? (
                        <>
                            <ul className='tareas__listado'>
                                <h2>{capitalizarPrimeraLetra(diaDeLaSemana)}</h2>
                                {Object.entries(tareasDelDia).map(([hora, descripcion], i) => (
                                    visibilidad[i] && (
                                        <li className="tareas__item" key={i}>
                                            <p className='item__hora'>
                                                {hora}
                                            </p>
                                            <p className='item__descripcion'>
                                                {descripcion}
                                            </p>
                                            <button
                                                className='item__boton'
                                                onClick={() => cambiarDisplay(i)}
                                            >
                                                Tarea realizada
                                            </button>
                                            <button
                                                className='item__boton eliminar'
                                                onClick={() => eliminarTarea(hora)}
                                            >
                                                Quitar tarea del listado
                                            </button>
                                        </li>
                                    )
                                ))}
                            </ul>
                            <div className='contenedor__botonera'>
                                <div className="agregar-tarea">
                                    <input
                                        type="text"
                                        placeholder="Ingresá la hora (HH.MM)"
                                        value={nuevaHora}
                                        onChange={(e) => setNuevaHora(e.target.value)}
                                        onKeyDown={manejarTeclado}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ingresá una descripción"
                                        value={nuevaDescripcion}
                                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                                        onKeyDown={manejarTeclado}
                                    />
                                    <button onClick={agregarTarea}>Agregar tarea</button>
                                    <button className='reiniciar__boton' onClick={reiniciarTareas}>
                                        Reiniciar tareas
                                    </button>
                                    <button onClick={toggleExplicacion}>
                                        {mostrarExplicacion ? "Ocultar explicación" : "Mostrar explicación"}
                                    </button>
                                </div>
                                <div
                                    className='cuerpo__informacion'
                                    style={{ display: mostrarExplicacion ? 'flex' : 'none' }} // Cambia el display según el estado
                                >
                                    <div className='contenedorInformacion'>
                                        <p>Botón "Tarea realizada"</p>
                                        <p>Oculta la tarea hasta el mismo día de la semana siguiente.</p>
                                    </div>
                                    <div className='contenedorInformacion'>
                                        <p>Botón "Quitar tarea del listado"</p>
                                        <p>Elimina la tarea definitivamente del listado, no vuelve a aparecer cuando se reinician.</p>
                                    </div>
                                    <div className='contenedorInformacion'>
                                        <p>Botón "Reiniciar tareas"</p>
                                        <p>Reinicia el listado de tareas con las tareas agregadas inclusive. Las eliminadas no vuelven a aparecer.</p>
                                    </div>
                                </div>
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
