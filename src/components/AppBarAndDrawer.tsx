import Box from "@mui/material/Box"
import { AppBarComp } from "./AppBarComp"
import { DrawerComp } from "./DrawerComp"
import { Outlet } from "react-router-dom"
import { useCallback } from "react"
import { useClick } from "../hooks/UseClick"

export const AppBarAndDrawer= () => {
    const [isDrawerOpen, toggleDrawer] = useClick(false)
    const handleToggleDrawer = useCallback(()=> {
        toggleDrawer()
    }, [toggleDrawer])
    return (
    <>
        <AppBarComp onToggleDrawer={handleToggleDrawer}/>
        <DrawerComp 
            open={isDrawerOpen} 
            onClose={toggleDrawer}
        />
        <Box sx={{mt: 3}}>
            <Outlet />
        </Box>
    </>
    )
}