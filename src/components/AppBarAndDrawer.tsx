import Box from "@mui/material/Box"
import { AppBarComp } from "./AppBarComp"
import { DrawerComp } from "./DrawerComp"
import { Outlet } from "react-router-dom"
import { useState, useCallback } from "react"

export const AppBarAndDrawer= () => {
    const [isDrawerOpen, setIsDrawerOpen]= useState<boolean>(false)
    const handleToggleDrawer = useCallback(()=> {
        setIsDrawerOpen(prev => !prev)
    }, [])
    return (
    <>
        <AppBarComp onToggleDrawer={handleToggleDrawer}/>
        <DrawerComp 
            open={isDrawerOpen} 
            onClose={()=> setIsDrawerOpen(false)}
        />
        <Box sx={{mt: 3}}>
            <Outlet />
        </Box>
    </>
    )
}