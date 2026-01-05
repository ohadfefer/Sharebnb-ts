import { useEffect, useRef, useState } from 'react'

export function useFocusRing() {
  const pillRef = useRef(null)
  const [ring, setRing] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false })

  function moveTo(el) {
    if (!pillRef.current || !el) return
    const p = pillRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setRing({ x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, visible: true })
  }

  useEffect(() => {
    const reflow = () => {
      const el = document.querySelector('[data-focus-ring-target="true"]')
      if (el) moveTo(el)
    }
    window.addEventListener('resize', reflow)
    return () => window.removeEventListener('resize', reflow)
  }, [])

  return { pillRef, ring, moveTo }
}
