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
            {message == 'Page Not Found' && <Link to={'/'}>Back to home</Link>}
        </Typography>        
    )
}