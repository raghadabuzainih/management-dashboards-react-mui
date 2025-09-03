import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

export const AccessPage = ({message})=>{
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