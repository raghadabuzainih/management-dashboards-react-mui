import {AppBar, Typography, Grid, Box, Button} from '@mui/material'
import { useNavigate } from "react-router-dom"
import { DarkMode, LightMode,Menu } from '@mui/icons-material'
import { storage } from '../lib/storage'
import { useAuthContext } from '../hooks/UseAuthContext'
import { useThemeModeContext } from '../hooks/UseThemeModeContext'

interface props{
    onToggleDrawer: ()=> void
}

export const AppBarComp = ({onToggleDrawer}: props)=> {
    const navigate = useNavigate()
    const {userEmail, logout} = useAuthContext()
    const {mode, setMode} = useThemeModeContext()
    function handleTheme() : void{
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