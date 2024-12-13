import React, { useContext, useState } from 'react'

export const Header = () => {

    return (
        <header>
            <div className="encabezado">
                <a className='encabezado__logo' href="#main" title='encabezado con imagen' alt="encabezado con imagen">
                    <img className='logo__imagen' src='/media/images/tusPendientes.png' title='logotuspendientes' alt="logotuspendientes" />
                </a>
                </div>
        </header>
    )
}
