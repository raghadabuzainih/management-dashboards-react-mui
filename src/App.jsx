import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthProvider"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { useState, useMemo } from "react"
import { BuildTheme } from "./contexts/ThemeContext"
import { ThemeModeContext } from "./contexts/ThemeModeContext"

export const App = () => {
    const [mode, setMode] = useState(localStorage.getItem('mode')||'light')
    const theme = useMemo(()=> BuildTheme(mode), [mode]) //to avoid rebuild theme every rerender
    
    return(
        <ThemeModeContext.Provider value = {{mode, setMode}}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <BrowserRouter>
                        <AppRoutes/>
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </ThemeModeContext.Provider>
    )
}
