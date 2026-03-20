import React, { useContext, useState } from 'react'

export const Header = () => {

    return (
        <header>
            <div className='d-flex py-1rem fd-row jc-around ai-center'>
                <a className='d-flex' href="#main" title='encabezado con imagen' alt="encabezado con imagen">
                    <img className='h-120px bd_1_s_letrasLogo as-center' src='/media/images/tusPendientes.png' title='logotuspendientes' alt="logotuspendientes" />
                </a>
            </div>
        </header>
    )
}
