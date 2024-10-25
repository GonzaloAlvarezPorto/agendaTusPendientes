import React, { createContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

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

    const inputRef = useRef(null);

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

        Toastify({
            text: "Tarea realizada con éxito",
            duration: 1000, // Duración de 2 segundos
            stopOnFocus: true, // No detenerse si se pasa el mouse por encima
            style: {
                background: "#006400", // Estilo personalizado del toast
                color: 'white',
                fontSize: "12px", // Tamaño de la fuente
                padding: "10px", // Padding del contenido
                borderRadius: "5px", // Bordes redondeados
                position: 'absolute',
                left: '20%',
                zIndex: 9999 // Para asegurarse de que esté sobre los demás elementos
            }
        }).showToast();

    };

    const eliminarTarea = (hora) => {
        const nuevasTareas = { ...tareasDelDia };
        delete nuevasTareas[hora];
        setTareasDelDia(nuevasTareas);
        setVisibilidad((prevVisibilidad) => {
            const { [hora]: _, ...nuevoEstado } = prevVisibilidad;
            return nuevoEstado;
        });
        Toastify({
            text: "Tarea eliminada",
            duration: 1000, // Duración de 2 segundos
            stopOnFocus: true, // No detenerse si se pasa el mouse por encima
            style: {
                background: "#800000", // Estilo personalizado del toast
                color: 'white',
                fontSize: "12px", // Tamaño de la fuente
                padding: "10px", // Padding del contenido
                borderRadius: "5px", // Bordes redondeados
                position: 'absolute',
                left: '20%',
                zIndex: 9999 // Para asegurarse de que esté sobre los demás elementos
            }
        }).showToast();
    };

    const reiniciarTareas = () => {
        const todasVisibles = Object.keys(tareasDelDia).reduce((acc, hora) => {
            acc[hora] = true;
            return acc;
        }, {});
        setVisibilidad(todasVisibles);
        localStorage.setItem(`visibilidad-${diaDeLaSemana}`, JSON.stringify(todasVisibles));
        Toastify({
            text: `Todas las tareas han sido reiniciadas`,
            duration: 1000, // Duración de 2 segundos
            stopOnFocus: true, // No detenerse si se pasa el mouse por encima
            style: {
                background: "#FFD700", // Estilo personalizado del toast
                color: 'black',
                fontSize: "12px", // Tamaño de la fuente
                padding: "10px", // Padding del contenido
                borderRadius: "5px", // Bordes redondeados
                position: 'absolute',
                left: '20%',
                zIndex: 9999 // Para asegurarse de que esté sobre los demás elementos
            }
        }).showToast();
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
    
        // Validación de hora con formato incorrecto
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
    
        // Validación adicional del formato de hora
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
    
        // Validación de la descripción
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
    
        // Asignar hora a la tarea
        if (nuevaHora) {
            horaTarea = normalizarHora(nuevaHora);
        } else {
            // Generar una hora sin horario (S/H)
            let contadorSinHorario = 1;
            while (tareasDelDia[`S/H${contadorSinHorario}`]) {
                contadorSinHorario++;
            }
            horaTarea = `S/H${contadorSinHorario}`;
        }
    
        // Verificar que la hora no esté ocupada y ajustar si es necesario
        while (tareasDelDia[horaTarea]) {
            const [horas, minutos] = horaTarea.split('.').map(Number);
            let nuevoMinuto = minutos + 1;
            let nuevaHora = horas;
    
            if (nuevoMinuto === 60) {
                nuevoMinuto = 0;
                nuevaHora = (nuevaHora + 1) % 24;
            }
    
            horaTarea = normalizarHora(`${nuevaHora}.${nuevoMinuto}`);
        }
    
        // Guardar la tarea según la opción seleccionada
        if (opcionSeleccionada === "todos") {
            // Itera por cada día de la semana y agrega la tarea
            diasSemana.forEach((dia) => {
                const tareasGuardadas = JSON.parse(localStorage.getItem(`tareas-${dia}`)) || {};
                tareasGuardadas[horaTarea] = nuevaDescripcion;
                localStorage.setItem(`tareas-${dia}`, JSON.stringify(tareasGuardadas));

                setTareasDelDia((prevTareas) => ({
                    ...prevTareas,
                    [horaTarea]: nuevaDescripcion
                }));
            });
    
            Toastify({
                text: "Tarea agregada a todos los días",
                duration: 1000, // Duración de 1 segundo
                stopOnFocus: true,
                style: {
                    background: "#006400",
                    color: 'white',
                    fontSize: "12px",
                    padding: "10px",
                    borderRadius: "5px",
                    position: 'absolute',
                    left: '20%',
                    zIndex: 9999
                }
            }).showToast();
        } else {
            // Agrega la tarea solo para el día específico seleccionado
            const tareasGuardadas = JSON.parse(localStorage.getItem(`tareas-${opcionSeleccionada}`)) || {};
            tareasGuardadas[horaTarea] = nuevaDescripcion;
            localStorage.setItem(`tareas-${opcionSeleccionada}`, JSON.stringify(tareasGuardadas));

            setTareasDelDia((prevTareas) => ({
                ...prevTareas,
                [horaTarea]: nuevaDescripcion
            }));
        }
    
        // Mostrar la tarea agregada
        setVisibilidad((prevVisibilidad) => ({
            ...prevVisibilidad,
            [horaTarea]: true
        }));
    
        // Limpiar inputs
        setNuevaHora('');
        setNuevaDescripcion('');
        inputRef.current.focus();
    };
    
    const manejarTeclado = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita el comportamiento predeterminado
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
        <CartContext.Provider value={{
            tareasIniciales,
            diasSemana,
            diaDeLaSemana,
            fechaHoy,
            inputRef,
            capitalizarPrimeraLetra,
            cargarTareasIniciales,
            cargarEstadoInicial,
            visibilidad,
            cambiarDisplay,
            eliminarTarea,
            reiniciarTareas,
            nuevaHora,
            nuevaDescripcion,
            esHoraValida,
            normalizarHora,
            agregarTarea,
            manejarTeclado,
            mostrarExplicacion,
            toggleExplicacion,
            formatearFecha,
            tareasDelDia,
            setNuevaDescripcion,
            setNuevaHora
        }}>
            {children}
        </CartContext.Provider>
    )
}
