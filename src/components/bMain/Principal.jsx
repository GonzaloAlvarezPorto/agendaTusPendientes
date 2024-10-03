import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

export const Principal = () => {
    const tareasIniciales = {
        domingo: [],
        lunes: [],
        martes: [],
        miércoles: [],
        jueves: [],
        viernes: [],
        sábado: []
    };
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
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
            [hora]: false
        }));

        Swal.fire({
            title: 'Tarea marcada como realizada',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
                title: 'swalTitulo',
                confirmButton: 'swalBoton',
                popup: 'swalVentana' // Clase personalizada
            }
        }); // SweetAlert para tarea realizada
    };

    const eliminarTarea = (hora) => {
        const nuevasTareas = { ...tareasDelDia };
        delete nuevasTareas[hora];
        setTareasDelDia(nuevasTareas);
        setVisibilidad((prevVisibilidad) => {
            const { [hora]: _, ...nuevoEstado } = prevVisibilidad;
            return nuevoEstado;
        });
        Swal.fire({
            title: 'Tarea eliminada',
            icon: 'info',
            confirmButtonText: 'Aceptar',
            customClass: {
                title: 'swalTitulo',
                confirmButton: 'swalBoton',
                popup: 'swalVentana' // Clase personalizada
            }
        }); // SweetAlert para eliminar tarea
    };

    const reiniciarTareas = () => {
        const todasVisibles = Object.keys(tareasDelDia).reduce((acc, hora) => {
            acc[hora] = true;
            return acc;
        }, {});
        setVisibilidad(todasVisibles);
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(todasVisibles));
        Swal.fire({
            title: 'Todas las tareas han sido reiniciadas',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            customClass: {
                title: 'swalTitulo',
                confirmButton: 'swalBoton',
                popup: 'swalVentana' // Clase personalizada
            }
        }); // SweetAlert para reiniciar tareas
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
        const opcionSeleccionada = document.getElementById("opciones").value;

        if (nuevaHora && nuevaHora.includes(':')) {
            Swal.fire({
                title: 'El formato de la hora es inválido',
                text: 'Debe ser HH.MM (con punto)',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'swalTitulo',
                    confirmButton: 'swalBoton',
                    popup: 'swalVentana' // Clase personalizada
                }
            });
            return;
        }

        if (nuevaHora && !esHoraValida(nuevaHora)) {
            Swal.fire({
                title: 'El formato de la hora es inválido',
                text: 'Debe ser HH.MM',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'swalTitulo',
                    confirmButton: 'swalBoton',
                    popup: 'swalVentana' // Clase personalizada
                }
            });
            return;
        }

        if (!nuevaDescripcion) {
            Swal.fire({
                title: 'La descripción es obligatoria',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'swalTitulo',
                    confirmButton: 'swalBoton',
                    popup: 'swalVentana' // Clase personalizada
                }
            });
            return;
        }

        if (nuevaHora) {
            horaTarea = normalizarHora(nuevaHora);
        } else {
            let contadorSinHorario = 1;
            while (tareasDelDia[`S/H${contadorSinHorario}`]) {
                contadorSinHorario++;
            }
            horaTarea = `S/H${contadorSinHorario}`;
        }

        while (tareasDelDia[horaTarea]) {
            const [horas, minutos] = horaTarea.split('.').map(Number);
            let nuevoMinuto = minutos + 1;
            let nuevoHora = horas;

            if (nuevoMinuto === 60) {
                nuevoMinuto = 0;
                nuevoHora = (nuevoHora + 1) % 24;
            }

            horaTarea = normalizarHora(`${nuevoHora}.${nuevoMinuto}`);
        }

        if (opcionSeleccionada !== "tareaDeTodosLosDias" && opcionSeleccionada !== diaDeLaSemana) {
            const tareasGuardadas = JSON.parse(localStorage.getItem(`tareas-${opcionSeleccionada}`)) || {};
            tareasGuardadas[horaTarea] = nuevaDescripcion;
            localStorage.setItem(`tareas-${opcionSeleccionada}`, JSON.stringify(tareasGuardadas));
        }

        if (opcionSeleccionada === diaDeLaSemana || opcionSeleccionada === "todos") {
            const nuevasTareas = { ...tareasDelDia };
            nuevasTareas[horaTarea] = nuevaDescripcion;
            setTareasDelDia(nuevasTareas);
        }

        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [horaTarea]: true
        }));

        if (opcionSeleccionada === "todos") {
            Swal.fire({
                title: 'Tarea agregada a todos los días',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'swalTitulo',
                    confirmButton: 'swalBoton',
                    popup: 'swalVentana' // Clase personalizada
                }
            });
        } else {
            Swal.fire({
                title: `Tarea agregada al ${opcionSeleccionada}`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'swalTitulo',
                    confirmButton: 'swalBoton',
                    popup: 'swalVentana' // Clase personalizada
                }
            });
        }

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
                                {Object.entries(tareasDelDia)
                                    .sort(([horaA], [horaB]) => {
                                        // Ordenar por horario
                                        if (horaA === "S/H" && horaB === "S/H") return 0;
                                        if (horaA === "S/H") return 1; // Mover sin horario al final
                                        if (horaB === "S/H") return -1;
                                        return horaA.localeCompare(horaB);
                                    })
                                    .map(([hora, descripcion], i) => (
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
                                                    onClick={() => cambiarDisplay(hora)}
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
                                    <label htmlFor="opciones">Agregar tarea a:</label>
                                    <select id="opciones" name="opciones">
                                        <option value="todos">Todos los días</option>
                                        <option value="lunes">Lunes</option>
                                        <option value="martes">Martes</option>
                                        <option value="miércoles">Miércoles</option>
                                        <option value="jueves">Jueves</option>
                                        <option value="viernes">Viernes</option>
                                        <option value="sábado">Sábado</option>
                                        <option value="domingo">Domingo</option>
                                    </select>
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
