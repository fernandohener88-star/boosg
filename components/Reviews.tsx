'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const REVIEWS = [
  {
    quote:
      'Endlich ein Salon, in dem ich nicht erklären muss, was ich will — Lorraine hört einmal zu und versteht es. Bin seit über einem Jahr Stammkundin und gehe jedes Mal mit einem besseren Gefühl raus als rein.',
    name: 'Susi',
    meta: 'Stammkundin',
  },
  {
    quote:
      'Die Atmosphäre ist warm, ehrlich und unaufgeregt. Mein Balayage sieht nach drei Monaten immer noch wie frisch gemacht aus. Mehr muss man eigentlich nicht sagen.',
    name: 'Jo B.',
    meta: 'Google Rezension',
  },
  {
    quote:
      'Ich war vor meiner Hochzeit nervös wie selten. Die Mädels haben mich beruhigt, einen Kaffee in die Hand gedrückt und am Ende fühlte ich mich wie ich selbst — nur an einem sehr guten Tag.',
    name: 'Lena Ziehmer',
    meta: 'Brautstyling',
  },
]

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const quoteRefs = useRef<HTMLElement[]>([])
  const markRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Header
      gsap.from(headRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
      })

      // — Big quote marks pop in
      gsap.from(markRefs.current, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: quoteRefs.current[0], start: 'top 85%' },
      })

      // — Review cards stagger fade
      gsap.from(quoteRefs.current, {
        opacity: 0,
        y: 50,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: quoteRefs.current[0], start: 'top 85%' },
      })

      // — Hover: subtle lift per card
      quoteRefs.current.forEach((card) => {
        if (!card) return
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -6, duration: 0.4, ease: 'power2.out' })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' })
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .reviews { padding: 160px 0; }
        .reviews__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-top: 40px;
        }
        .review {
          padding: 8px 0 0;
          position: relative;
          cursor: default;
          will-change: transform;
        }
        .review__mark {
          font-family: var(--serif);
          font-size: 80px;
          line-height: 0.6;
          color: var(--accent);
          display: block;
          margin-bottom: 8px;
          font-style: normal;
          will-change: transform, opacity;
        }
        .review__quote {
          font-family: var(--serif);
          font-size: clamp(18px, 1.7vw, 22px);
          line-height: 1.55;
          font-weight: 400;
          color: var(--ink);
          margin: 0 0 32px;
          font-style: italic;
        }
        .review__by {
          display: flex; align-items: center; gap: 14px;
          padding-top: 20px;
          border-top: var(--rule);
        }
        .review__by .name {
          font-family: var(--serif);
          font-size: 18px;
          color: var(--ink);
        }
        .review__by .meta {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-left: auto;
        }
        .review__stars { color: var(--accent); letter-spacing: 2px; font-size: 12px; }
        @media (max-width: 900px) {
          .reviews__grid { grid-template-columns: 1fr; gap: 56px; }
        }
      `}</style>

      <section className="reviews" id="voices" ref={sectionRef}>
        <div className="wrap">
          <div className="sec-head" ref={headRef}>
            <div>
              <div className="sec-head__no">— 03</div>
              <h2 className="sec-head__title">
                Stimmen<br />aus dem <em>Stuhl.</em>
              </h2>
            </div>
            <p className="sec-head__lede">
              Worte unserer Kundinnen — gesammelt über die letzten Monate. Keine Werbeagentur, keine
              Stockfotos. Echte Menschen aus Landau und Umgebung.
            </p>
          </div>

          <div className="reviews__grid">
            {REVIEWS.map((r, i) => (
              <figure
                key={i}
                className="review"
                ref={(el) => { if (el) quoteRefs.current[i] = el }}
              >
                <span
                  className="review__mark"
                  ref={(el) => { if (el) markRefs.current[i] = el }}
                >
                  &ldquo;
                </span>
                <blockquote className="review__quote">{r.quote}</blockquote>
                <figcaption className="review__by">
                  <span className="name">{r.name}</span>
                  <span className="review__stars">★ ★ ★ ★ ★</span>
                  <span className="meta">{r.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
