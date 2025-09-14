import { createContext } from "react"
import { ThemeModeContextType } from "../types/ThemeModeContext"

export const ThemeModeContext = createContext<ThemeModeContextType | null>(null)