import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils/cn'

/**
 * Three.js DNA double helix.
 * Loaded lazily so the initial bundle stays small; if WebGL is unavailable the
 * component renders nothing and the surrounding CSS molecular field remains.
 */
export function HelixCanvas({ className = '', height = '100%' }) {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let renderer
    let raf = 0
    const cleanups = []

    async function init() {
      let THREE
      try {
        THREE = await import('three')
      } catch {
        return
      }
      if (disposed || !mount) return

      const width = mount.clientWidth
      const h = mount.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, width / h, 0.1, 100)
      camera.position.set(0, 0, 7.4)

      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
      } catch {
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, h, false)
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      mount.appendChild(renderer.domElement)

      const group = new THREE.Group()
      scene.add(group)

      const NODES = 46
      const RADIUS = 1.28
      const STEP = 0.155
      const TWIST = 0.42

      const pointsA = []
      const pointsB = []

      const nodeGeo = new THREE.IcosahedronGeometry(0.055, 1)
      const matA = new THREE.MeshBasicMaterial({ color: 0x24c6b1, transparent: true, opacity: 0.92 })
      const matB = new THREE.MeshBasicMaterial({ color: 0x7fc9e2, transparent: true, opacity: 0.78 })

      const nodesA = new THREE.InstancedMesh(nodeGeo, matA, NODES)
      const nodesB = new THREE.InstancedMesh(nodeGeo.clone(), matB, NODES)
      const dummy = new THREE.Object3D()

      for (let i = 0; i < NODES; i++) {
        const angle = i * TWIST
        const y = (i - (NODES - 1) / 2) * STEP
        const ax = Math.cos(angle) * RADIUS
        const az = Math.sin(angle) * RADIUS
        const bx = Math.cos(angle + Math.PI) * RADIUS
        const bz = Math.sin(angle + Math.PI) * RADIUS

        pointsA.push(new THREE.Vector3(ax, y, az))
        pointsB.push(new THREE.Vector3(bx, y, bz))

        dummy.position.set(ax, y, az)
        dummy.updateMatrix()
        nodesA.setMatrixAt(i, dummy.matrix)

        dummy.position.set(bx, y, bz)
        dummy.updateMatrix()
        nodesB.setMatrixAt(i, dummy.matrix)
      }

      group.add(nodesA, nodesB)

      // Strand tubes
      const curveA = new THREE.CatmullRomCurve3(pointsA)
      const curveB = new THREE.CatmullRomCurve3(pointsB)
      const tubeMatA = new THREE.MeshBasicMaterial({ color: 0x24c6b1, transparent: true, opacity: 0.22 })
      const tubeMatB = new THREE.MeshBasicMaterial({ color: 0x7fc9e2, transparent: true, opacity: 0.18 })
      const tubeA = new THREE.Mesh(new THREE.TubeGeometry(curveA, 180, 0.012, 6, false), tubeMatA)
      const tubeB = new THREE.Mesh(new THREE.TubeGeometry(curveB, 180, 0.012, 6, false), tubeMatB)
      group.add(tubeA, tubeB)

      // Base-pair rungs
      const rungPositions = []
      for (let i = 0; i < NODES; i += 2) {
        const a = pointsA[i]
        const b = pointsB[i]
        rungPositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
      }
      const rungGeo = new THREE.BufferGeometry()
      rungGeo.setAttribute('position', new THREE.Float32BufferAttribute(rungPositions, 3))
      const rungMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.16,
      })
      const rungs = new THREE.LineSegments(rungGeo, rungMat)
      group.add(rungs)

      // Slow drift
      const pointer = { x: 0, y: 0 }
      const onPointer = (e) => {
        const rect = mount.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      }
      if (!reduce) window.addEventListener('pointermove', onPointer, { passive: true })

      const resize = () => {
        const w = mount.clientWidth
        const hh = mount.clientHeight
        if (!w || !hh) return
        camera.aspect = w / hh
        camera.updateProjectionMatrix()
        renderer.setSize(w, hh, false)
      }
      const ro = new ResizeObserver(resize)
      ro.observe(mount)

      let t = 0
      const render = () => {
        t += 0.006
        group.rotation.y = t
        group.rotation.x = 0.12 + pointer.y * 0.1
        group.rotation.z = pointer.x * 0.05
        camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
        raf = requestAnimationFrame(render)
      }

      if (reduce) {
        group.rotation.y = 0.6
        renderer.render(scene, camera)
      } else {
        raf = requestAnimationFrame(render)
      }

      setReady(true)

      cleanups.push(() => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('pointermove', onPointer)
        nodeGeo.dispose()
        matA.dispose()
        matB.dispose()
        nodesA.geometry.dispose()
        nodesB.geometry.dispose()
        tubeA.geometry.dispose()
        tubeB.geometry.dispose()
        tubeMatA.dispose()
        tubeMatB.dispose()
        rungGeo.dispose()
        rungMat.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      })
    }

    init()

    return () => {
      disposed = true
      cleanups.forEach((fn) => fn())
    }
  }, [reduce])

  return (
    <div
      ref={mountRef}
      className={cn('relative w-full', className)}
      style={{ height }}
      aria-hidden="true"
      data-ready={ready}
    >
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border border-brand-teal/15" />
        </div>
      ) : null}
    </div>
  )
}
