import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

interface props{
    message: string
}

export const AccessPage = ({message}: props)=>{
    return(
        <Typography 
            component={'h1'}
            marginTop={'30%'}
        >
            {message}
            {message === 'Page Not Found' && <Link to={'/'}>Back to home</Link>}
            {message === "You don't have access to this page." && <Link to={'/login'}>You must log in first</Link>}
        </Typography>        
    )
}