import Box from "@mui/material/Box"
import { AppBarComp } from "./AppBarComp"
import { DrawerComp } from "./DrawerComp"
import { Outlet } from "react-router-dom"
import { useState } from "react"

export const AppBarAndDrawer= ({theme, updateTheme}) => {
    const [isMenuClicked, setIsMenuClicked]= useState(false)
    return <Box>
        <AppBarComp theme={theme} updateTheme={updateTheme} setIsMenuClicked={setIsMenuClicked}/>
        <DrawerComp open={isMenuClicked} setOpen={setIsMenuClicked}/>
        <Box marginTop={'3%'}>
            <Outlet />
        </Box>
    </Box>
}