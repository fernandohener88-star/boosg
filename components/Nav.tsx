'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMarkSmall } from './LogoMark'

gsap.registerPlugin(ScrollTrigger)

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide nav down on load
      gsap.from(navRef.current, {
        yPercent: -100,
        duration: 1.2,
        delay: 0.3,
        ease: 'power4.out',
      })

      // Backdrop on scroll
      ScrollTrigger.create({
        start: 'top+=24 top',
        onEnter: () => navRef.current?.classList.add('scrolled'),
        onLeaveBack: () => navRef.current?.classList.remove('scrolled'),
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 50;
          padding: 22px var(--gutter);
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease, border-color 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(245, 237, 232, 0.88);
          backdrop-filter: saturate(140%) blur(12px);
          -webkit-backdrop-filter: saturate(140%) blur(12px);
          padding: 14px var(--gutter);
          border-bottom-color: rgba(58, 40, 37, 0.08);
        }
        .nav__mark {
          display: flex; align-items: center; gap: 12px;
          font-family: var(--serif);
          font-size: 18px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
        }
        .nav__links {
          display: flex; gap: 36px;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .nav__links a { position: relative; padding: 4px 0; transition: color 0.3s; }
        .nav__links a::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -2px;
          height: 1px; background: var(--accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.2, 0.6, 0.2, 1);
        }
        .nav__links a:hover { color: var(--primary); }
        .nav__links a:hover::after { transform: scaleX(1); }
        .nav__cta {
          font-family: var(--sans);
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 12px 22px;
          border: 1px solid var(--ink);
          color: var(--ink);
          border-radius: 999px;
          transition: background 0.35s, color 0.35s, border-color 0.35s, transform 0.3s;
          cursor: pointer;
        }
        .nav__cta:hover {
          background: var(--ink);
          color: var(--paper);
          transform: scale(1.04);
        }
        @media (max-width: 820px) { .nav__links { display: none; } }
      `}</style>

      <nav className="nav" ref={navRef} id="nav">
        <a href="#top" className="nav__mark" aria-label="LORRAINE Haarstudio">
          <LogoMarkSmall />
          <span>Lorraine</span>
        </a>
        <div className="nav__links">
          <a href="#about">Studio</a>
          <a href="#services">Leistungen</a>
          <a href="#voices">Stimmen</a>
          <a href="#contact">Kontakt</a>
        </div>
        <a href="tel:063419029615" className="nav__cta">Termin</a>
      </nav>
    </>
  )
}
