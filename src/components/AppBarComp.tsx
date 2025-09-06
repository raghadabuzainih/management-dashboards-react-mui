import {AppBar, Typography, Grid, Box, Button} from '@mui/material'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { DarkMode, LightMode,Menu } from '@mui/icons-material'
import { ThemeModeContext } from '../contexts/ThemeModeContext'
import { storage } from '../lib/storage'

interface props{
    onToggleDrawer: ()=> void
}

export const AppBarComp = ({onToggleDrawer}: props)=> {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    if(!authContext) throw new Error('auth context not defined')
    const {userEmail, logout} = authContext

    const themeModeContext = useContext(ThemeModeContext)
    if(!themeModeContext) throw new Error('theme mode context not defined')
    const {mode, setMode} = themeModeContext
    function handleTheme(){
        const newTheme: 'light' | 'dark' = mode === 'light' ? 'dark' : 'light'
        setMode(newTheme)
        storage.setItem('mode', newTheme)
    }
    return(
        <AppBar>
            <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                {userEmail&& <Button 
                    aria-label='show-drawer-icon'
                    color="inherit" 
                    sx={{
                        pr: '1rem'
                    }}
                    onClick={onToggleDrawer}
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
                            aria-label='theme-icon'
                            onClick={handleTheme}
                            >
                                {mode === 'light' ? <DarkMode color='action'/> : <LightMode />}
                            </Button>
                    }
                </Grid>
            </Box>
        </AppBar>
    )
}