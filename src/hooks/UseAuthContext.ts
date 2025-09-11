import { AuthContext } from "../contexts/AuthContext"
import { AuthContextType } from "../types/AuthContext"
import { useContext } from "react"

export const useAuthContext = () : AuthContextType => {
    const authContext = useContext(AuthContext)
    if(!authContext) throw new Error('auth context not defined')
    return authContext
}