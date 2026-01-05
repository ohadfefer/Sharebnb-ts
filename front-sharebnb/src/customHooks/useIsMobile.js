import { useEffect, useState } from "react"

export function useIsMobile(breakpoint = 768) {
    const query = `(max-width:${breakpoint}px)`
    const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches

    const [isMobile, setIsMobile] = useState(get)

    useEffect(() => {
        const mql = window.matchMedia(query)
        const onChange = (e) => setIsMobile(e.matches)
        setIsMobile(mql.matches)
        mql.addEventListener?.("change", onChange)
        return () => mql.removeEventListener?.("change", onChange)
    }, [query])

    return isMobile
}
