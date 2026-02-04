import { useState, ChangeEvent } from "react"

export function useForm<T extends Record<string, any>>(
    initialState: T
) {
    const [fields, setFields] = useState<T>(initialState)

    function handleChange({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name: field, value, type, checked } = target as any

        let newValue: string | number | boolean = value

        switch (type) {
            case "number":
            case "range":
                newValue = value === "" ? "" : Number(value)
                break
            case "checkbox":
                newValue = checked
                break
            default:
                newValue = value
        }

        setFields((prevFields) => ({
            ...prevFields,
            [field]: newValue,
        }))
    }

    return [fields, setFields, handleChange]
}