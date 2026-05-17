'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LETTERS = ['L', 'O', 'R', 'R', 'A', 'I', 'N', 'E']

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const silhouetteRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])
  const sigRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const cueLineRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Letters rise up
      gsap.from(charsRef.current, {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.055,
        ease: 'power4.out',
        delay: 0.6,
      })

      // — Signature fade
      gsap.from(sigRef.current, {
        opacity: 0,
        y: 16,
        duration: 1.3,
        delay: 1.2,
        ease: 'power3.out',
      })

      // — Tagline
      gsap.from(tagRef.current, {
        opacity: 0,
        y: 16,
        duration: 1.3,
        delay: 1.6,
        ease: 'power3.out',
      })

      // — Meta
      gsap.from(metaRef.current, {
        opacity: 0,
        y: 16,
        duration: 1.3,
        delay: 1.9,
        ease: 'power3.out',
      })

      // — Scroll cue
      gsap.from(scrollCueRef.current, {
        opacity: 0,
        y: 16,
        duration: 1.2,
        delay: 2.3,
        ease: 'power3.out',
      })

      // — Drip animation on scroll cue line
      if (cueLineRef.current) {
        gsap.set(cueLineRef.current, { scaleY: 0, transformOrigin: 'top' })
        gsap.to(cueLineRef.current, {
          scaleY: 1,
          duration: 0.6,
          ease: 'power2.inOut',
          delay: 2.8,
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.4,
          onRepeat() {
            gsap.set(cueLineRef.current, { transformOrigin: 'bottom' })
          },
          onRepeatParams: [],
        })
      }

      // — Silhouette subtle breathe
      gsap.to(silhouetteRef.current, {
        scale: 1.04,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // — Silhouette parallax on scroll
      gsap.to(silhouetteRef.current, {
        yPercent: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          padding: 140px 0 80px;
          display: grid;
          place-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero__inner {
          width: 100%;
          max-width: 1100px;
          padding: 0 var(--gutter);
          position: relative;
          z-index: 2;
        }
        .hero__eyebrow {
          display: inline-flex; align-items: center; gap: 14px;
          margin-bottom: 38px;
        }
        .hero__eyebrow::before, .hero__eyebrow::after {
          content: ""; width: 28px; height: 1px;
          background: var(--primary); opacity: 0.5;
        }
        .hero__title-wrap {
          overflow: hidden;
          display: block;
        }
        .hero__title {
          font-family: var(--serif);
          font-size: clamp(48px, 12vw, 200px);
          line-height: 0.9;
          letter-spacing: 0.08em;
          font-weight: 400;
          color: var(--ink);
          display: block;
          white-space: nowrap;
        }
        .hero__char {
          display: inline-block;
          will-change: transform;
        }
        .hero__sig {
          font-family: var(--script);
          font-size: clamp(28px, 4.5vw, 48px);
          color: var(--primary);
          line-height: 1;
          margin-top: 14px;
          will-change: transform, opacity;
        }
        .hero__tag {
          margin-top: 56px;
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(20px, 2.6vw, 30px);
          color: var(--ink-soft);
          letter-spacing: 0.005em;
          will-change: transform, opacity;
        }
        .hero__meta {
          margin-top: 48px;
          display: flex; gap: 28px; justify-content: center; flex-wrap: wrap;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ink-soft);
          will-change: transform, opacity;
        }
        .hero__meta span { display: inline-flex; align-items: center; gap: 14px; }
        .hero__meta span + span::before {
          content: ""; width: 4px; height: 4px; border-radius: 50%;
          background: var(--accent); display: inline-block;
          transform: translateY(-2px);
        }
        .hero__silhouette {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -52%);
          width: min(78vmin, 780px);
          height: min(78vmin, 780px);
          opacity: 0.07;
          z-index: 1;
          pointer-events: none;
          color: var(--primary);
          will-change: transform;
        }
        .hero__silhouette svg { width: 100%; height: 100%; display: block; }
        .scroll-cue {
          position: absolute;
          bottom: 36px; left: 50%; transform: translateX(-50%);
          font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--ink-soft);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          will-change: opacity, transform;
        }
        .scroll-cue__line {
          display: block;
          width: 1px; height: 44px;
          background: linear-gradient(to bottom, var(--primary), transparent);
          will-change: transform;
          transform-origin: top;
        }
      `}</style>

      <header className="hero" id="top" ref={heroRef}>
        <div className="hero__silhouette" ref={silhouetteRef} aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M218 110 Q236 112 244 130 Q248 148 244 164 Q254 170 256 184 Q256 198 250 214 Q250 226 240 232 L240 248 L260 260" />
              <path d="M214 116 Q186 124 176 156 Q170 188 178 222 Q180 250 174 278" />
              <path d="M198 120 Q170 134 158 168 Q152 202 158 236 Q161 262 156 290" />
              <path d="M226 116 Q210 138 206 168 Q204 198 212 228 Q216 254 213 282" />
              <path d="M210 122 Q194 144 192 174 Q192 204 198 232 Q201 256 198 278" />
              <path d="M186 132 Q164 156 158 188 Q156 218 166 244" />
              <path d="M170 154 Q150 184 150 218" />
            </g>
          </svg>
        </div>

        <div className="hero__inner">
          <div className="hero__eyebrow eyebrow">Haarstudio · Landau in der Pfalz</div>

          <span className="hero__title-wrap" aria-hidden="true">
            <span className="hero__title">
              {LETTERS.map((char, i) => (
                <span
                  key={i}
                  className="hero__char"
                  ref={(el) => { if (el) charsRef.current[i] = el }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
          <span className="sr-only">LORRAINE</span>

          <div className="hero__sig" ref={sigRef}>by Lorraine Padberg</div>

          <p className="hero__tag" ref={tagRef}>Dein Haar. Deine Geschichte.</p>

          <div className="hero__meta" ref={metaRef}>
            <span>seit 2019</span>
            <span>Theaterstraße 16</span>
            <span>von Frauen geführt</span>
          </div>
        </div>

        <div className="scroll-cue" ref={scrollCueRef} aria-hidden="true">
          Scroll
          <span className="scroll-cue__line" ref={cueLineRef} />
        </div>
      </header>
    </>
  )
}
