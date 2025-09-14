import React, { ReactNode, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import users from '../data/users.json'
import { User } from "../types/User"
import { UserEmail } from "../types/UserEmail"
import { storage } from "../lib/storage"

//because there is enum Role
const allUsers = users as User[]

function getStoredUser(): UserEmail | null{
    const stored: UserEmail = storage.getItem('userEmail')
    if(!stored) return null
    else{
        if(new Date().getTime() > stored.expiry){
            localStorage.removeItem('userEmail')
            return null
        }else return stored
    }
}

interface AuthProviderProps{
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children})=>{
    const [userEmail, setUserEmail] = React.useState<UserEmail | null>(getStoredUser)

    const login = (email: string): string | void=>{
        const user: User | undefined = allUsers.find(user=> user.email === email)
        if(!user) return
        const hours=3
        const item: UserEmail = {
            value: email,
            expiry: new Date().getTime() + (hours*60*60*1000),
            role: user.role
        }
        storage.setItem('userEmail', item)
        setUserEmail(item)
    }
    
    const logout = (): void => {
        setUserEmail(null)
        localStorage.removeItem('userEmail')
    }

    //auto logout when expiry reached
    useEffect(()=> {
        if(!userEmail) return
        const timer = setInterval(()=> {
            if(new Date().getTime() > userEmail.expiry){
                logout()
            }
        }, 6000) //check every 1min
        return() => clearInterval(timer)
    },[userEmail])

    return(
        <AuthContext.Provider value={{userEmail, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}