import { arraySliceName } from "../types/arraySliceName"
import { storage } from "../lib/storage"

export default function updateStorage<T>(sliceName: arraySliceName, state: T[]){
    storage.setItem(sliceName, state)
}