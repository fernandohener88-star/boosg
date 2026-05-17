'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    no: '01',
    name: 'Schnitt & ',
    nameEm: 'Form',
    price: 'ab €58',
    desc: 'Beratung, Wäsche mit Kopfmassage, individueller Schnitt und Styling. Wir schneiden in deine Haarstruktur — nicht gegen sie.',
  },
  {
    no: '02',
    name: 'Farbe & ',
    nameEm: 'Strähnchen',
    price: 'ab €95',
    desc: 'Von dezenten Highlights über Balayage bis zur sanften Komplettcolorierung. Farben, die mit dir altern und nicht gegen dich arbeiten.',
  },
  {
    no: '03',
    name: 'Styling & ',
    nameEm: 'Anlass',
    price: 'ab €42',
    desc: 'Hochzeit, Foto, Geburtstag — oder einfach, weil. Stylings, die halten, und sich trotzdem nach dir anfühlen.',
  },
  {
    no: '04',
    name: 'Pflege & ',
    nameEm: 'Treatment',
    price: 'ab €28',
    desc: 'Tiefenpflege, Kopfhautrituale und Olaplex-Behandlungen. Für die Tage, an denen dein Haar mehr braucht als einen Schnitt.',
  },
  {
    no: '05',
    name: 'Beratung ',
    nameEm: 'im Studio',
    price: 'kostenlos',
    desc: 'Unsicher? Komm vorbei, trink einen Kaffee mit uns und wir schauen gemeinsam, was wirklich zu dir passt — ganz ohne Termin am Stuhl.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Section header
      gsap.from(headRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
      })

      // — Rows stagger in
      gsap.from(rowRefs.current, {
        opacity: 0,
        x: -30,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rowRefs.current[0], start: 'top 85%' },
      })

      // — Hover effects per row
      rowRefs.current.forEach((row) => {
        if (!row) return
        const name = row.querySelector<HTMLElement>('.svc__name')
        const no = row.querySelector<HTMLElement>('.svc__no')
        const bg = row.querySelector<HTMLElement>('.svc__bg')

        const onEnter = () => {
          gsap.to(row, { paddingLeft: 28, duration: 0.45, ease: 'power2.out' })
          gsap.to(bg, { opacity: 0.55, duration: 0.5, ease: 'power2.out' })
          gsap.to(name, { color: '#6F4F4A', duration: 0.35 })
          gsap.to(no, { color: '#3A2825', duration: 0.35 })
        }
        const onLeave = () => {
          gsap.to(row, { paddingLeft: 0, duration: 0.45, ease: 'power2.inOut' })
          gsap.to(bg, { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
          gsap.to(name, { color: '#3A2825', duration: 0.35 })
          gsap.to(no, { color: '#8B6560', duration: 0.35 })
        }
        row.addEventListener('mouseenter', onEnter)
        row.addEventListener('mouseleave', onLeave)
        return () => {
          row.removeEventListener('mouseenter', onEnter)
          row.removeEventListener('mouseleave', onLeave)
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .services {
          padding: 140px 0;
          background: linear-gradient(to bottom, transparent, var(--bg-deep) 30%, var(--bg-deep) 70%, transparent);
        }
        .svc-list { display: flex; flex-direction: column; }
        .svc {
          display: grid;
          grid-template-columns: 60px 1fr auto 1.4fr;
          gap: 40px;
          align-items: center;
          padding: 40px 0;
          border-top: var(--rule);
          cursor: default;
          position: relative;
        }
        .svc:last-child { border-bottom: var(--rule); }
        .svc__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--accent-soft), transparent 70%);
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }
        .svc > * { position: relative; z-index: 1; }
        .svc__no {
          font-family: var(--serif);
          font-style: italic;
          color: var(--primary);
          font-size: 18px;
        }
        .svc__name {
          font-family: var(--serif);
          font-size: clamp(28px, 3.6vw, 48px);
          line-height: 1.05;
          font-weight: 400;
          color: var(--ink);
          will-change: color;
        }
        .svc__name em { font-style: italic; }
        .svc__price {
          font-family: var(--sans);
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          white-space: nowrap;
        }
        .svc__desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-soft);
          max-width: 44ch;
        }
        @media (max-width: 820px) {
          .svc {
            grid-template-columns: 40px 1fr;
            grid-template-rows: auto auto auto;
            gap: 8px 20px;
            padding: 32px 0;
          }
          .svc__no { grid-row: 1 / 4; align-self: start; padding-top: 6px; }
          .svc__price { grid-column: 2; }
          .svc__desc { grid-column: 2; margin-top: 6px; }
        }
      `}</style>

      <section className="services" id="services" ref={sectionRef}>
        <div className="wrap">
          <div className="sec-head" ref={headRef}>
            <div>
              <div className="sec-head__no">— 02</div>
              <h2 className="sec-head__title">
                Leistungen<br /><em>mit Bedacht.</em>
              </h2>
            </div>
            <p className="sec-head__lede">
              Beratung gehört für uns immer dazu. Preise sind Anhaltspunkte — was du am Ende zahlst,
              besprechen wir vorab, ohne Überraschung.
            </p>
          </div>

          <div className="svc-list">
            {SERVICES.map((svc, i) => (
              <div
                key={i}
                className="svc"
                ref={(el) => { if (el) rowRefs.current[i] = el }}
              >
                <div className="svc__bg" />
                <div className="svc__no">{svc.no}</div>
                <div className="svc__name">
                  {svc.name}<em>{svc.nameEm}</em>
                </div>
                <div className="svc__price">{svc.price}</div>
                <p className="svc__desc">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
