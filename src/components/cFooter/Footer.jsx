import React from 'react'

export const Footer = () => {
  return (
    <footer className='pieDePagina'>
      <h2>Organizador diario creado por Gonzalo Alvarez Porto</h2>
      <a href="https://wa.me/5491135880974" target="_blank" title='whatsapp'>
        <img className='logoWP' src="/media/images/whatsapp.png" title='whatsapp' alt="whatsapp" />
      </a>
      <a href="https://gonzaloalvarezporto.vercel.app/" target="_blank" title='gapdev'>
        <img className='logoGonzalo' src='/media/images/gonzaloAlvarezPorto.png' title='gapdev' alt="gapdev"/>
      </a>
    </footer>
  )
}
