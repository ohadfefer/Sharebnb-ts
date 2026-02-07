// src/cmps/WherePanel.jsx
import { WhereSuggestionsPanel } from "./WhereSuggestionsPanel.js"
import { AutoCompletePanel } from "./AutoCompletePanel.jsx"

export type WherePanelProps = {
    value: {address: string}
    onChange: any
    onComplete: any
    onAdvance: any
}

export function WherePanel(props: WherePanelProps) {
    const q = (props.value?.address || "").trim();
    const useAutocomplete = q.length >= 2;
    return useAutocomplete
        ? <AutoCompletePanel {...props} />
        : <WhereSuggestionsPanel {...props} />;
}
