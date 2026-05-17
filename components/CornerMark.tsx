'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CornerMark() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.from(ref.current, {
      opacity: 0,
      x: 20,
      duration: 1.2,
      delay: 2.5,
      ease: 'power3.out',
    })
  }, [])

  return (
    <>
      <style>{`
        .corner-mark {
          position: fixed; bottom: 24px; right: 24px;
          z-index: 30;
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--ink-soft);
          background: rgba(245, 237, 232, 0.7);
          backdrop-filter: blur(8px);
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(58,40,37,0.08);
          pointer-events: none;
        }
        .corner-mark .dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
        }
        @media (max-width: 600px) { .corner-mark { display: none; } }
      `}</style>
      <div className="corner-mark" ref={ref}>
        <span className="dot" />
        seit MMXIX
      </div>
    </>
  )
}
