import { Provider } from "react-redux"
import { store } from "./store"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthProvider"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { useState, useMemo, ReactNode } from "react"
import { BuildTheme } from "./contexts/ThemeContext"
import { ThemeModeContext } from "./contexts/ThemeModeContext"
import { storage } from "./lib/storage"

export const App=() : ReactNode => {
    const [mode, setMode] = useState<'light' | 'dark'>(storage.getItem('mode') || 'light')
    const theme = useMemo(()=> BuildTheme(mode), [mode]) //to avoid rebuild theme every rerender
    
    return(
        <Provider store={store}>
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
        </Provider>
    )
}
