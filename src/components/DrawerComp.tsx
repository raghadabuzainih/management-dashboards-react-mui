import Drawer from "@mui/material/Drawer"
import { Link as RouterLink, useLocation } from "react-router-dom"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import { ListItemIcon, ListItemText } from "@mui/material"
import { Dashboard, People, MenuBook, Assignment, Assessment, Menu } from "@mui/icons-material"

interface props{
    open: boolean,
    onClose: ()=> void
}

interface items{
    name: string,
    icon: React.ReactNode,
    path: string
}

export const DrawerComp = ({open, onClose}: props) => {
    const location = useLocation()
    const drawerItems: items[] = [
        { name: "Dashboard", icon: <Dashboard />, path: "/" },
        { name: "Students", icon: <People />, path: "/students" },
        { name: "Courses", icon: <MenuBook />, path: "/courses" },
        { name: "Enrollments", icon: <Assignment />, path: "/enrollments" },
        { name: "Reports", icon: <Assessment />, path: "/reports" },
    ]
    let isActive: boolean

    return( 
        <Drawer 
            open={open} 
            onClose={onClose}
        >
            <List sx={{display: 'grid', gap:'1rem', pt: 8}}>
                {drawerItems.map(({name, icon, path}) =>{
                    isActive = path === location.pathname
                    return <ListItemButton 
                                key={`${name}-drawerItem`}
                                component={RouterLink}
                                to={path}
                                sx={{
                                    display: "flex", 
                                    gap:'6%',
                                    backgroundColor: isActive ? 'info.main' : 'transparent',
                                    "&:hover": {
                                        bgcolor: "info.main",
                                        opacity: 0.9,
                                    },
                                    transition: "0.3s"
                                }} 
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText>{name}</ListItemText>
                            </ListItemButton>
                })}
            </List>
        </Drawer>
    )
}