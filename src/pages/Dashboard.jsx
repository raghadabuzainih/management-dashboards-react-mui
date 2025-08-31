import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Grid,
  Chip,
  Box
} from '@mui/material';
import { AccessPage } from '../components/AccessPage'
import { People, MenuBook, Assignment, Unpublished } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const navigate = useNavigate()
    const {userEmail}= useContext(AuthContext)
    const students = localStorage.getItem('students') ?
        JSON.parse(localStorage.getItem('students')) : users.filter(({role}) => role == 'Student')
    const savedEnrollments = localStorage.getItem('enrollments') ?
        JSON.parse(localStorage.getItem('enrollments')) : enrollments
    const savedCourses = localStorage.getItem('courses') ?
        JSON.parse(localStorage.getItem('courses')) : courses
    let progressSum = 0
    savedEnrollments.forEach(({progress})=> progressSum += +progress)

    const icons = [
        <People sx={{fontSize: '5rem'}}/>, 
        <MenuBook sx={{fontSize: '5rem'}}/>, 
        <Assignment sx={{fontSize: '5rem'}}/>, 
        <Unpublished sx={{fontSize: '5rem'}}/>
    ]

    const counts = {
        "Total Students": students.length,
        "Total Courses": savedCourses.length,
        "Total Enrollments": savedEnrollments.length,
        "Completion Rate": (progressSum / savedEnrollments.length).toFixed(2) + "%"
    }

    const last_5_students = students.slice(students.length-5, students.length)
    const last_5_studentsMap = last_5_students.map(st =>{
        return <ListItem key={`student-${st.id}`} sx={{display:'grid', textAlign:'center'}}>
            <Typography component={'h2'}>{st.firstName + " " + st.lastName}</Typography>
            <Chip 
                color='info' 
                variant='outlined' 
                label='Click to see the profile link'
                onClick={()=> navigate(`/students/${st.id}`)}
            />
        </ListItem>
    })

    let countsToCards = Object.keys(counts).map((key,index) => {
        return <Card key={`${key}-dashboard-card`} 
                    sx={{
                        width: '35%',
                        height:'70%',
                        alignContent:'center',
                        margin: '8px', 
                        textAlign: 'center'
                    }}>
                    <CardContent sx={{height:'17rem', display:'grid', alignItems:'center'}}>
                        <Typography component={'h1'} color='info'>{icons[index]}</Typography>
                        <Box>
                            <Typography component={'h3'} fontSize={'1.4rem'}>{key}</Typography>
                            <Typography component={'h1'} color='info' fontSize={'1.2rem'}>{counts[key]}</Typography>
                        </Box>
                    </CardContent>
                </Card>   
    })
    return(
        <Grid 
            container 
            marginTop={'6rem'} 
            justifyContent="center" 
            alignItems={'center'} 
            spacing={3} 
        >
        {userEmail?.role == 'Admin' ? 
            <>
                {/* Cards Section */}
                <Grid>
                    <Grid container spacing={2} justifyContent="center">
                        {countsToCards}
                    </Grid>
                </Grid>

                {/* Last Students Section */}
                <Grid>
                    <List sx={{ textAlign: 'center' }}>
                        <Typography component="h3" variant="h6" mb={2}>
                            Last 5 Students Added :
                        </Typography>
                        {last_5_studentsMap}
                    </List>
                </Grid>
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Grid>
    )
}