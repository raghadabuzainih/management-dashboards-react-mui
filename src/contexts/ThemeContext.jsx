import { createTheme } from "@mui/material/styles"

export const BuildTheme = (mode = 'light')=> createTheme({
    palette: {
        mode,
        //optional
        primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
        },
        secondary: {
            main: '#f50057',
        }
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2rem', fontWeight: 600 },
        h2: { fontSize: '1.5rem', fontWeight: 500 },
        body1: { fontSize: '1rem' }
    },
    //we can put components to make styles for MUI components
    // components: {
    //     MuiAccordion:{
    //         styleOverrides: {
    //             root:{
    //                 color:........
    //             }
    //         }
    //     },
    //     ...........
    // }
})