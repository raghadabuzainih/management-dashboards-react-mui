import { createSlice, Draft } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { storage } from "../lib/storage";
import { arraySliceName } from "../types/arraySliceName";
import updateStorage from "../shared/updateStorage";

export default function arraySlice<T extends {id: string}>(sliceName: arraySliceName, jsonData: T[]){
    const data: T[] = Array.isArray(storage.getItem(sliceName)) ? storage.getItem(sliceName) : jsonData
    return createSlice({
        name: sliceName,
        initialState: data,
        reducers: {
            add: (state, action: PayloadAction<T>) => {
                state.push(action.payload as Draft<T>)
                updateStorage<T>(sliceName, state as T[])
            },
            editItem: (state, action: PayloadAction<{item: T; values: Partial<T>}>) => {
                const { item, values } = action.payload
                const existing = state.find(x => x.id === item.id)
                if(existing){
                    Object.assign(existing, values)
                    updateStorage<T>(sliceName, state as T[])
                }
            },
            removeByID: (state, action: PayloadAction<string>) => {
                const index = state.findIndex(item => item.id === action.payload)
                if(index !== -1) state.splice(index, 1)
                updateStorage<T>(sliceName, state as T[])
            }
        }
    })
}