import { useState } from "react"
export const useSelectedID = (initialValue: string = '') : [string, (val: string) => void] => {
    const [selectedID, setSelectedID] = useState<string>(initialValue)
    const update = (newValue: string) => setSelectedID(newValue)
    return [selectedID, update]
}