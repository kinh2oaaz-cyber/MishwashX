import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Ambient molecular field: drifting nodes with proximity links, gently
 * repelled by the pointer. Canvas 2D keeps this cheap enough to run behind
 * the hero on mid-range hardware.
 */
export function MolecularCanvas({
  className = '',
  density = 0.000075,
  maxParticles = 90,
  color = '36,198,177',
  lineColor = '8,126,170',
  speed = 0.35,
  linkDistance = 150,
  interactive = true,
}) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pointer = { x: -9999, y: -9999 }

    let particles = []

    const build = () => {
      const count = Math.min(maxParticles, Math.max(18, Math.floor(width * height * density)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    resize()
    window.addEventListener('resize', resize)

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    if (interactive) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      canvas.addEventListener('pointerleave', onLeave)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},0.35)`
        ctx.fill()
      })
    }

    const draw = (time) => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // pointer repulsion
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < 130) {
          const force = (130 - dist) / 130
          p.x += (dx / (dist || 1)) * force * 1.6
          p.y += (dy / (dist || 1)) * force * 1.6
        }

        const twinkle = 0.28 + Math.sin(time * 0.0011 + p.phase) * 0.16
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${twinkle})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const ddx = p.x - q.x
          const ddy = p.y - q.y
          const d = Math.hypot(ddx, ddy)
          if (d < linkDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${lineColor},${0.18 * (1 - d / linkDistance)})`
            ctx.lineWidth = 0.55
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    if (reduce) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(draw)
    }

    // Pause when offscreen or the tab is hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          running = true
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(draw)
        } else {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduce) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, maxParticles, color, lineColor, speed, linkDistance, interactive, reduce])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
