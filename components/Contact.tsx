'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMarkSmall } from './LogoMark'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const colsRef = useRef<HTMLDivElement[]>([])
  const footRef = useRef<HTMLDivElement>(null)
  const circle1Ref = useRef<HTMLDivElement>(null)
  const circle2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Heading words reveal
      const headWords = headRef.current?.querySelectorAll('.c-word')
      if (headWords) {
        gsap.from(Array.from(headWords), {
          opacity: 0,
          y: 50,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        })
      }

      // — Contact columns
      gsap.from(colsRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: colsRef.current[0], start: 'top 85%' },
      })

      // — Footer
      gsap.from(footRef.current, {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: footRef.current, start: 'top 95%' },
      })

      // — Decorative circles slow drift
      if (circle1Ref.current) {
        gsap.to(circle1Ref.current, {
          x: 20,
          y: -15,
          rotation: 15,
          duration: 12,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }
      if (circle2Ref.current) {
        gsap.to(circle2Ref.current, {
          x: -15,
          y: 20,
          rotation: -10,
          duration: 14,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .contact {
          background: var(--primary);
          color: var(--paper);
          padding: 140px 0 60px;
          position: relative;
          overflow: hidden;
          border-top-left-radius: 40px;
          border-top-right-radius: 40px;
        }
        .contact__circle1 {
          position: absolute;
          top: -200px; right: -160px;
          width: 520px; height: 520px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }
        .contact__circle2 {
          position: absolute;
          bottom: -260px; left: -120px;
          width: 480px; height: 480px;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }
        .contact .eyebrow { color: var(--accent-soft); }
        .contact h2 {
          color: var(--paper);
          font-size: clamp(48px, 7vw, 96px);
          line-height: 1;
          font-weight: 400;
          margin: 18px 0 0;
          letter-spacing: -0.015em;
        }
        .contact h2 em { font-style: italic; color: var(--accent-soft); }
        .contact__sig {
          font-family: var(--script);
          font-size: 40px;
          color: var(--accent-soft);
          margin-top: 14px;
          display: inline-block;
        }
        .c-word { display: inline-block; will-change: transform, opacity; }
        .contact__grid {
          margin-top: 96px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          padding-bottom: 80px;
          border-bottom: 1px solid rgba(255,255,255,0.18);
        }
        .contact__col h4 {
          color: var(--accent-soft);
          font-family: var(--sans);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 400;
          margin-bottom: 18px;
        }
        .contact__col p, .contact__col a {
          font-family: var(--serif);
          font-size: 22px;
          line-height: 1.45;
          color: var(--paper);
          margin: 0;
          transition: color 0.3s;
        }
        .contact__col a:hover { color: var(--accent-soft); }
        .contact__hours {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 22px;
          font-family: var(--sans);
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.86);
        }
        .contact__hours dt { color: var(--accent-soft); letter-spacing: 0.12em; }
        .contact__hours dd { margin: 0; }
        .foot {
          margin-top: 48px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 24px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          will-change: transform, opacity;
        }
        .foot__mark {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--serif);
          letter-spacing: 0.42em;
          font-size: 16px;
          color: var(--paper);
        }
        .foot__badge {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 999px;
          color: var(--paper);
        }
        @media (max-width: 820px) {
          .contact__grid { grid-template-columns: 1fr; gap: 40px; padding-bottom: 56px; }
          .contact { border-top-left-radius: 24px; border-top-right-radius: 24px; }
        }
      `}</style>

      <section className="contact" id="contact" ref={sectionRef}>
        <div className="contact__circle1" ref={circle1Ref} />
        <div className="contact__circle2" ref={circle2Ref} />

        <div className="wrap">
          <div ref={headRef}>
            <div className="eyebrow">— 04 · Besuch uns</div>
            <h2>
              <span className="c-word">Komm&nbsp;</span>
              <span className="c-word">vorbei,</span>
              <br />
              <span className="c-word">setz&nbsp;</span>
              <span className="c-word">dich,&nbsp;</span>
              <span className="c-word"><em>bleib.</em></span>
            </h2>
            <div className="contact__sig">— bis bald</div>
          </div>

          <div className="contact__grid">
            <div className="contact__col" ref={(el) => { if (el) colsRef.current[0] = el }}>
              <h4>Adresse</h4>
              <p>Theaterstraße 16<br />76829 Landau in der Pfalz</p>
            </div>
            <div className="contact__col" ref={(el) => { if (el) colsRef.current[1] = el }}>
              <h4>Termin</h4>
              <p><a href="tel:063419029615">06341 9029615</a></p>
              <p style={{ marginTop: 14, fontSize: 16, fontFamily: 'var(--sans)', letterSpacing: '0.04em' }}>
                <a href="mailto:hallo@lorraine-haarstudio.de">hallo@lorraine-haarstudio.de</a>
              </p>
            </div>
            <div className="contact__col" ref={(el) => { if (el) colsRef.current[2] = el }}>
              <h4>Öffnungszeiten</h4>
              <dl className="contact__hours">
                <dt>Di</dt><dd>09 – 18 Uhr</dd>
                <dt>Mi</dt><dd>09 – 18 Uhr</dd>
                <dt>Do</dt><dd>09 – 20 Uhr</dd>
                <dt>Fr</dt><dd>09 – 18 Uhr</dd>
                <dt>Sa</dt><dd>08 – 14 Uhr</dd>
                <dt>So &amp; Mo</dt><dd>geschlossen</dd>
              </dl>
            </div>
          </div>

          <div className="foot" ref={footRef}>
            <div className="foot__mark">
              <LogoMarkSmall style={{ color: 'var(--accent-soft)' }} />
              <span>Lorraine</span>
            </div>
            <div className="foot__badge">Von Frauen geführt 🤍</div>
            <div>© 2026 · Lorraine Padberg · Impressum · Datenschutz</div>
          </div>
        </div>
      </section>
    </>
  )
}
