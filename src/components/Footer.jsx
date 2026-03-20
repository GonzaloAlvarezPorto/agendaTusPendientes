import React from 'react'

export const Footer = () => {

  const links = [
    {
      href: "https://wa.me/5491135880974",
      img: "/media/images/whatsapp.png",
      alt: "whatsapp",
      title: "whatsapp"
    },
    {
      href: "https://gonzaloalvarezporto.vercel.app/",
      img: "/media/images/gonzaloAlvarezPorto.png",
      alt: "gapdev",
      title: "gapdev"
    }
  ];

  return (
    <footer>
      <h2 className='fs-14px md-fs-22px'>
        Organizador diario creado por Gonzalo Alvarez Porto
      </h2>

      {links.map((link, i) => (
        <a
          key={i}
          className='td-none fc-letrasLogo'
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.title}
        >
          <img
            className='w-30px bd_1_s_letrasLogo bdrad-100px'
            src={link.img}
            alt={link.alt}
          />
        </a>
      ))}
    </footer>
  )
}