import { createContext, Dispatch, SetStateAction } from "react"

interface ThemeModeContextType{
    mode: 'light' | 'dark',
    setMode: Dispatch<SetStateAction<'light'|'dark'>>
}

export const ThemeModeContext = createContext<ThemeModeContextType | null>(null)