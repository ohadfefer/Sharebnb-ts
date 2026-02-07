import { useIsMobile } from "../customHooks/useIsMobile.js"
import { AppHeaderDesktop } from "./AppHeaderDesktop.js"
import { AppHeaderMobile } from "./AppHeaderMobile.js"

export function AppHeader() {
  const isMobile = useIsMobile(768)
  return isMobile ? <AppHeaderMobile /> : <AppHeaderDesktop />
}
