import {AppBar, Typography, Grid, Button} from '@mui/material'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { DarkMode, LightMode,Menu } from '@mui/icons-material'

export const AppBarComp = ({theme,updateTheme,setIsMenuClicked})=> {
    const navigate = useNavigate()
    const {userEmail, logout}= useContext(AuthContext)
    function handleTheme(){
        const newTheme = theme == 'light' ? 'dark' : 'light'
        updateTheme(newTheme)
        localStorage.setItem('mode', newTheme)
    }
    return(
        <AppBar>
            <Grid display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                {userEmail&& <Button 
                    color="inherit" 
                    sx={{
                        pr: '1rem'
                    }}
                    onClick={()=>{
                        setIsMenuClicked(true)
                    }}
                >
                    <Menu/>
                </Button>}
                <Typography component={'h1'}>Student Management System</Typography>
                <Grid direction={'row'}>
                    {
                        userEmail?
                        <Button color='inherit'
                            onClick={()=> {
                                navigate('/login')
                                logout()
                            }}
                        >
                            Log Out
                        </Button>
                    
                        :
                        <Button
                            color='inherit'
                            onClick={()=> navigate('/login')}
                        >
                            Log In
                        </Button>
                    }
                    {
                        <Button
                            color='warning'
                            onClick={handleTheme}
                            >
                                {theme == 'light' ? <DarkMode color='action'/> : <LightMode />}
                            </Button>
                    }
                </Grid>
            </Grid>
        </AppBar>
    )
}