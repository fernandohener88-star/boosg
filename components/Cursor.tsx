'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' })
    }

    // Ring follows with slight lag
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      requestAnimationFrame(tick)
    }
    tick()

    // Hover state on interactive elements
    const onEnter = () => dot.classList.add('hover-state')
    const onLeave = () => dot.classList.remove('hover-state')
    const targets = document.querySelectorAll('a, button, .svc, .review')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
