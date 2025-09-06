import { createContext } from "react"
import { UserEmail } from "../types/UserEmail"

interface AuthContextType{
    userEmail: UserEmail | null,
    login: (email: string) => string | void,
    logout: ()=> void
}

export const AuthContext = createContext<AuthContextType | null>(null)