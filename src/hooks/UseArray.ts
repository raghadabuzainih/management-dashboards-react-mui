import { useState } from "react"
import { storage } from "../lib/storage"

//array name like item name was saved or will save in storage
export function useArray<T>(jsonValue: T[], arrayName: string) : [T[], (item: T[])=> void]{
    
    const saved: T[] | null = storage.getItem(arrayName)
    const [array, setArray] = useState<T[]>(saved ?? jsonValue)

    const updateArray = (newArray: T[]) => {
        setArray(newArray)
        storage.setItem(arrayName, newArray)
    }

    return [array, updateArray]
}