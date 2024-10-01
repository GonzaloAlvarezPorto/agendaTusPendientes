import React, { useState, useEffect, useRef } from 'react';

export const Principal = () => {
    const tareasIniciales = {
        domingo: [],
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: []
    };
    const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const fechaHoy = new Date();
    const diaDeLaSemana = diasSemana[fechaHoy.getDay()]; // Obtiene el día actual en minúsculas

    const horaInputRef = useRef(null);

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
            return Object.keys(tareasDelDia || {}).reduce((acc, hora) => {
                acc[hora] = true; // Inicializa todas las tareas como visibles
                return acc;
            }, {});
        }
    };

    const [visibilidad, setVisibilidad] = useState(cargarEstadoInicial);

    useEffect(() => {
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(visibilidad));
    }, [visibilidad, diaDeLaSemana]);

    useEffect(() => {
        localStorage.setItem(`tareas-${diaDeLaSemana}`, JSON.stringify(tareasDelDia));
    }, [tareasDelDia, diaDeLaSemana]);

    const cambiarDisplay = (hora) => {
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [hora]: false // Cambia solo el estado de visibilidad de la tarea correspondiente
        }));
    };

    const eliminarTarea = (hora) => {
        const nuevasTareas = { ...tareasDelDia };
        delete nuevasTareas[hora]; // Eliminar la tarea por hora
        setTareasDelDia(nuevasTareas);
        setVisibilidad((prevVisibilidad) => {
            const { [hora]: _, ...nuevoEstado } = prevVisibilidad; // Elimina la tarea del estado de visibilidad
            return nuevoEstado;
        });
    };

    const reiniciarTareas = () => {
        const todasVisibles = Object.keys(tareasDelDia).reduce((acc, hora) => {
            acc[hora] = true; // Inicializa todas las tareas como visibles
            return acc;
        }, {});

        setVisibilidad(todasVisibles); // Establece todas las tareas como visibles
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(todasVisibles)); // Actualiza el localStorage
    };

    const [nuevaHora, setNuevaHora] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');

    const esHoraValida = (hora) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/; // Formato estricto HH.MM
        return regex.test(hora);
    };

    const normalizarHora = (hora) => {
        let [horas, minutos] = hora.split('.');
        horas = horas.padStart(2, '0'); // Agrega un 0 al principio si es necesario
        minutos = minutos.padStart(2, '0'); // Lo mismo para los minutos
        return `${horas}.${minutos}`;
    };

    const agregarTarea = () => {
        let horaTarea = '';
    
        if (nuevaHora && nuevaHora.includes(':')) {
            alert("El formato de la hora es inválido. Debe ser HH.MM (con punto).");
            return; // Detiene la ejecución si se usa el formato con dos puntos
        }
    
        if (nuevaHora && !esHoraValida(nuevaHora)) {
            alert("El formato de la hora es inválido. Debe ser HH.MM");
            return;
        }
    
        if (!nuevaDescripcion) {
            alert("La descripción es obligatoria.");
            return; // No permite agregar la tarea si la descripción está vacía
        }
    
        if (nuevaHora) {
            horaTarea = normalizarHora(nuevaHora);
        } else {
            // Maneja tareas sin horario
            let contadorSinHorario = 1;
            while (tareasDelDia[`S/H${contadorSinHorario}`]) {
                contadorSinHorario++; // Encuentra el siguiente número disponible para tareas sin horario
            }
            horaTarea = `S/H${contadorSinHorario}`; // Asigna el siguiente número disponible
        }
    
        const nuevasTareas = { ...tareasDelDia };
    
        // Verifica si la hora ya está ocupada y encuentra el siguiente horario disponible
        while (nuevasTareas[horaTarea]) {
            let [horas, minutos] = horaTarea.split('.').map(Number);
    
            if (!isNaN(horas) && !isNaN(minutos)) {
                // Incrementa los minutos solo si es una tarea con horario
                minutos++;
    
                // Si los minutos alcanzan 60, reinicia a 0 y suma 1 a las horas
                if (minutos === 60) {
                    minutos = 0;
                    horas = (horas + 1) % 24; // Asegura que no sobrepase las 23
                }
    
                // Normaliza la nueva hora
                horaTarea = `${String(horas).padStart(2, '0')}.${String(minutos).padStart(2, '0')}`;
            } else {
                // Si es una tarea sin horario (S/H), encuentra el siguiente S/H disponible
                let contadorSinHorario = 1;
                while (nuevasTareas[`S/H${contadorSinHorario}`]) {
                    contadorSinHorario++;
                }
                horaTarea = `S/H${contadorSinHorario}`;
            }
        }
    
        // Agrega la tarea en el nuevo horario disponible
        nuevasTareas[horaTarea] = nuevaDescripcion;
    
        // Ordena las tareas
        const tareasOrdenadas = Object.entries(nuevasTareas)
            .sort(([horaA], [horaB]) => {
                // Las tareas sin horario (S/H) se ordenan antes que las con horario (HH.MM)
                if (horaA.startsWith('S/H') && !horaB.startsWith('S/H')) {
                    return -1; // `S/H` va primero
                } else if (!horaA.startsWith('S/H') && horaB.startsWith('S/H')) {
                    return 1; // `S/H` va primero
                } else {
                    // Si ambas son del mismo tipo (ambas con horario o ambas sin horario), las ordena normalmente
                    return horaA.localeCompare(horaB);
                }
            })
            .reduce((obj, [hora, desc]) => {
                obj[hora] = desc;
                return obj;
            }, {});
    
        setTareasDelDia(tareasOrdenadas);
    
        // Asegúrate de mantener el mismo número de elementos en visibilidad
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [horaTarea]: true // Agrega la nueva tarea como visible
        }));
    
        setNuevaHora('');
        setNuevaDescripcion('');
        horaInputRef.current.focus();
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

    // Función para formatear la fecha
    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones); // Cambia 'es-ES' a tu localización deseada
    };

    return (
        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                {
                    tareasDelDia ? (
                        <>
                            <ul className='tareas__listado'>
                                <h2>
                                    {capitalizarPrimeraLetra(diaDeLaSemana)} - {formatearFecha(fechaHoy)}
                                </h2>
                                {Object.entries(tareasDelDia).map(([hora, descripcion], i) => (
                                    visibilidad[hora] && (
                                        <li className="tareas__item" key={i}>
                                            <p className='item__hora'>
                                                {hora}
                                            </p>
                                            <p className='item__descripcion'>
                                                {descripcion}
                                            </p>
                                            <button
                                                className='item__boton'
                                                onClick={() => cambiarDisplay(hora)} // Cambia aquí
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
                                        ref={horaInputRef} // Agrega la referencia aquí
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
