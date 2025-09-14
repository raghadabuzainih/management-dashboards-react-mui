import { ThemeModeContext } from "../contexts/ThemeModeContext"
import { ThemeModeContextType } from "../types/ThemeModeContext"
import { useContext } from "react"

export const useThemeModeContext = () : ThemeModeContextType => {
    const context = useContext(ThemeModeContext)
    if(!context) throw new Error('theme mode context not defined')
    return context
}