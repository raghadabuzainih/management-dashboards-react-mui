import Drawer from "@mui/material/Drawer"
import { Link,useLocation } from "react-router-dom"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { Typography } from "@mui/material"
import { Dashboard, People, MenuBook, Assignment, Assessment, Menu } from "@mui/icons-material"

export const DrawerComp = ({open, setOpen}) => {
    const location = useLocation()
    const drawerItems = [
        'Dashboard',
        'Students',
        'Courses',
        'Enrollments',
        'Reports',
    ]
    const drawerItemsIcons = [
        <Dashboard/>, 
        <People/>, 
        <MenuBook/>, 
        <Assignment/>, 
        <Assessment/>, 
    ]
    let isActive

    return( 
        <Drawer 
            open={open} 
            onClose={()=> setOpen(false)}
        >
            <List sx={{display: 'grid', gap:'1rem', marginTop: '50%'}}>
                {drawerItems.map((itemName, index) =>{
                    isActive = itemName == 'Dashboard' ? '/' == location.pathname : `/${itemName.toLowerCase()}` == location.pathname
                    return <ListItem 
                                key={`${itemName}-drawerItem`}
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
                                <Typography fontSize={'1px'} color="inheret">{drawerItemsIcons[index]}</Typography>
                                <Link 
                                    to={`${itemName == 'Dashboard' ? '/' : `/${itemName.toLowerCase()}`}`}
                                    style={{
                                        textDecoration: 'none',
                                        color:"inherit"
                                    }} 
                                    >
                                        {itemName}
                                    </Link>
                            </ListItem>
                })}
            </List>
        </Drawer>
    )
}