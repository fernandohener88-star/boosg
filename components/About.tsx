'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoMark from './LogoMark'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const circle1Ref = useRef<SVGCircleElement>(null)
  const circle2Ref = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Section header reveal
      gsap.from(headRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headRef.current,
          start: 'top 85%',
        },
      })

      // — Copy stagger
      const copyChildren = copyRef.current?.querySelectorAll('p, .about__sign')
      if (copyChildren) {
        gsap.from(Array.from(copyChildren), {
          opacity: 0,
          y: 30,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: copyRef.current,
            start: 'top 80%',
          },
        })
      }

      // — Logo mark scale-in
      gsap.from(markRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: markRef.current,
          start: 'top 80%',
        },
      })

      // — Logo mark slow rotation
      gsap.to(markRef.current, {
        rotation: 3,
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // — Badge slide in
      gsap.from(badgeRef.current, {
        opacity: 0,
        x: -24,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: markRef.current,
          start: 'top 75%',
        },
      })

      // — SVG circles draw animation
      if (circle1Ref.current && circle2Ref.current) {
        const c1 = circle1Ref.current
        const c2 = circle2Ref.current
        const r1 = parseFloat(c1.getAttribute('r') || '48.5')
        const r2 = parseFloat(c2.getAttribute('r') || '46')
        const circ1 = 2 * Math.PI * r1
        const circ2 = 2 * Math.PI * r2

        gsap.set(c1, { strokeDasharray: circ1, strokeDashoffset: circ1 })
        gsap.set(c2, { strokeDasharray: circ2, strokeDashoffset: circ2 })
        gsap.to(c1, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: markRef.current, start: 'top 80%' },
        })
        gsap.to(c2, {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: markRef.current, start: 'top 80%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .about { padding: 160px 0 140px; }
        .about__grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about__copy p { font-size: 17px; line-height: 1.8; color: var(--ink); margin: 0 0 22px; max-width: 52ch; }
        .about__copy p.lead {
          font-family: var(--serif);
          font-size: clamp(24px, 2.6vw, 30px);
          line-height: 1.35;
          color: var(--ink);
          font-weight: 400;
          font-style: italic;
          margin-bottom: 32px;
          max-width: 22ch;
        }
        .about__sign {
          display: flex; align-items: baseline; gap: 14px;
          margin-top: 36px;
          color: var(--ink-soft);
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .about__sign .script { font-size: 34px; color: var(--primary); line-height: 1; font-family: var(--script); }
        .about__mark-wrap {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
          max-width: 480px;
          justify-self: end;
          will-change: transform;
        }
        .about__badge {
          position: absolute;
          bottom: -10px; left: -10px;
          background: var(--bg);
          border: 1px solid rgba(58,40,37,0.12);
          border-radius: 999px;
          padding: 12px 20px;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 12px 40px -20px rgba(58,40,37,0.25);
          will-change: transform, opacity;
        }
        @media (max-width: 900px) {
          .about__grid { grid-template-columns: 1fr; gap: 60px; }
          .about__mark-wrap { justify-self: center; max-width: 360px; }
        }
      `}</style>

      <section className="about" id="about" ref={sectionRef}>
        <div className="wrap">
          <div className="sec-head" ref={headRef}>
            <div>
              <div className="sec-head__no">— 01</div>
              <h2 className="sec-head__title">
                Ein Studio.<br />Eine <em>Handschrift.</em>
              </h2>
            </div>
            <p className="sec-head__lede">
              Ein kleines, herzliches Team mitten in Landau. Wir nehmen uns Zeit — für dein Haar, für
              deine Geschichte und für den Moment, in dem du dich im Spiegel wiedererkennst.
            </p>
          </div>

          <div className="about__grid">
            <div className="about__copy" ref={copyRef}>
              <p className="lead">Wir sind keine Kette. Wir sind ein Atelier.</p>
              <p>
                Bei LORRAINE arbeitet ein Team aus Frauen, die ihr Handwerk lieben — und die wissen,
                dass ein guter Schnitt nichts mit Schablonen zu tun hat. Wir beraten ehrlich, nehmen
                uns Zeit, und am Ende soll dir gefallen, was du siehst — nicht nur an dem Tag, sondern
                auch in der Woche danach, vor dem Spiegel zu Hause.
              </p>
              <p>
                Klare Räume, gutes Licht, ein guter Kaffee. Wenig Lärm, viel Aufmerksamkeit. Termine
                sind kein Durchlauf, sondern eine Stunde, die dir gehört.
              </p>
              <div className="about__sign">
                <span className="script">Lorraine</span>
                <span>— Inhaberin &amp; Meisterin</span>
              </div>
            </div>

            <div className="about__mark-wrap" ref={markRef}>
              <LogoMark
                size={480}
                style={{ width: '100%', height: '100%' }}
              />
              <div className="about__badge" ref={badgeRef}>
                <span>Von Frauen geführt</span>
                <span>🤍</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
