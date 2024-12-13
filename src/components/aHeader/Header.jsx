import React, { useContext, useState } from 'react'

export const Header = () => {

    return (
        <header>
            <div className="encabezado">
                <a className='encabezado__logo' href="#main" alt="encabezado con imagen">
                    <img className='logo__imagen' src='/media/images/tusPendientes.png' alt="logotuspendientes" />
                </a>
                </div>
        </header>
    )
}
