import React, { useContext } from 'react';
import { ListadoTareas } from './ListadoTareas';
import { Botonera } from './Botonera';
import { CartContext } from '../../context/CartProvider';

export const Principal = () => {

    const {tareasDelDia } = useContext(CartContext)

    return (

        <div className='principal__cuerpo'>
            <div className='cuerpo__tareas'>
                {
                    tareasDelDia ? (
                        <>
                            <ListadoTareas/>
                            <Botonera/>
                        </>
                    ) : (
                        <p>No hay tareas para hoy</p>
                    )
                }
            </div>
        </div>
    );
};
