import { useState } from "react"

export const useClick = (initialValue: boolean) : [boolean, ()=> void] => {
    const [value, setValue] = useState(initialValue)
    const toggle = () => {
        setValue(old => !old)
    }
    return [value, toggle]
}