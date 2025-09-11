import { createContext } from "react"
import { AuthContextType } from "../types/AuthContext"

export const AuthContext = createContext<AuthContextType | null>(null)