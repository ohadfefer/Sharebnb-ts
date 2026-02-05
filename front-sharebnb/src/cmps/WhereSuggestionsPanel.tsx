// src/cmps/WherePanel.jsx
import { useMemo, useState } from "react"
import { SUGGESTED } from "../services/helpers/where.suggestions.icons.js"

export function WhereSuggestionsPanel({ value = {}, onChange, onAdvance }: {value: any, onChange: any, onAdvance: any}) {
    const [query, setQuery] = useState(value.address || "")

    const items = useMemo(() => {
        const queris = query.trim().toLowerCase()
        if (!queris) return SUGGESTED;
        return SUGGESTED.filter(i =>
            i.label.toLowerCase().includes(queris) || (i.sub || "").toLowerCase().includes(queris)
        )
    }, [query])

    function select(item: Record<any, string>) {
        const address = item.id === "nearby" ? "Nearby" : `${item.label}${item.sub ? `, ${item.sub}` : ""}`
        onChange?.({ address })
        onAdvance?.(); // jump to Check-in
    }

    return (
        <div className="where-panel">
            <ul className="where-list">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className="where-row"
                            onClick={() => select(item)}
                        >
                            <img className="where-icon" src={item.icon} alt="" width={40} height={40} />
                            <span className="where-texts">
                                <span className="where-title">{item.label}</span>
                                {item.sub && <span className="where-sub">{item.sub}</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
