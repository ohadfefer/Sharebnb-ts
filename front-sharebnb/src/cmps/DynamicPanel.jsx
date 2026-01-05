export function DynamicPanel({ activeKey, panelProps = {}, registry }) {
  if (!activeKey) return null
  const renderPanel = registry[activeKey]
  return renderPanel ? renderPanel(panelProps) : null
}
