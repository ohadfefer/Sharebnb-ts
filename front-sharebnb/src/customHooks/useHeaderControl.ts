import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export function useHeaderControl() {
  const { pathname } = useLocation()
  const isHome = pathname === "/" || pathname === "/stay"
  const isDetailPage = /^\/stay\/[^/]+$/.test(pathname)

  const [mini, setMini] = useState(true)
  const sticky = !isDetailPage

  useEffect(() => {
    const handleScroll = () => {
      const atTop = window.scrollY === 0
      setMini(!(isHome && atTop))
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome, pathname])

  return { mini, sticky }
}
