import { useIsMobile } from "../customHooks/useIsMobile"
import { AppHeaderDesktop } from "./AppHeaderDesktop.jsx"
import { AppHeaderMobile } from "./AppHeaderMobile"

export function AppHeader() {
  const isMobile = useIsMobile(768)
  return isMobile ? <AppHeaderMobile /> : <AppHeaderDesktop />
}
