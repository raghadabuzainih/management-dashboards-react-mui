import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { storage } from "../lib/storage";
import { arraySliceName } from "../types/arraySliceName";

export default function arraySlice<T extends {id: string}>(sliceName: arraySliceName, jsonData: T[]){
    const data: T[] = storage.getItem(sliceName) ?? jsonData
    return createSlice({
        name: sliceName,
        initialState: data,
        reducers: {
            add: (state, action: PayloadAction<T>) => {
                const newState = [...state, action.payload] as T[]
                storage.setItem(sliceName, newState)
                return newState
            },
            editItem: (state, action: PayloadAction<{item: T; values: Partial<T>}>) => {
                const { item, values } = action.payload
                const existing = state.find(x => x.id === item.id)
                if(existing){
                    Object.assign(existing, values)
                    storage.setItem(sliceName, state)
                }
            },
            removeByID: (state, action: PayloadAction<string>) => {
                const newState = state.filter(item => item.id !== action.payload)
                storage.setItem(sliceName, newState)
                return newState
            }
        }
    })
}