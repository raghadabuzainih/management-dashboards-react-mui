import React, { useEffect } from "react"
import { AuthContext } from "./AuthContext"
import users from '../data/users.json'

function getStoredUser(){
    const stored = JSON.parse(localStorage.getItem('userEmail'))
    if(!stored) return null
    else{
        if(new Date().getTime() > stored.expiry){
            localStorage.removeItem('userEmail')
            return null
        }else return stored
    }
}

export const AuthProvider = ({children})=>{
    const [userEmail, setUserEmail] = React.useState(getStoredUser)

    const login = (email)=>{
        const hours=3
        const item = {
            value: email,
            expiry: new Date().getTime() + (hours*60*60*1000),
            role: users.find(user=> user.email === email).role
        }
        localStorage.setItem('userEmail', JSON.stringify(item))
        setUserEmail(item)
    }
    
    const logout = ()=> {
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