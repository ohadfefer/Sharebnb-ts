import { StayFilterBy } from "../types/stay.js"


export function DynamicPanel({ activeKey, registry, panelProps }: DynamicPanel) {
  if (!activeKey) return null
  const renderPanel = registry[activeKey]
  return renderPanel ? renderPanel(panelProps) : null
}


type DynamicPanel = {
  activeKey: keyof PANELS_BY_KEY,
  registry: PANELS_BY_KEY
  panelProps: PanelProps
}

interface PANELS_BY_KEY {
  where: (props: any) => JSX.Element
  checkin: (props: any) => JSX.Element
  checkout: (props: any) => JSX.Element
  who: (props: any) => JSX.Element
}

interface PanelProps {
  value: StayFilterBy
  onChange: (partial: React.ChangeEvent)=>void
  onAdvance: ()=>void
}