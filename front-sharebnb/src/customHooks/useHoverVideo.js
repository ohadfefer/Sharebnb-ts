import { useRef } from "react"

export function useHoverVideo() {
  const ref = useRef(null)
  const play = () => ref.current?.play().catch(() => {})
  const pauseReset = () => {
    const v = ref.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }
  return { ref, play, pauseReset }
}
