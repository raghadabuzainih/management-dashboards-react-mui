import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import { useContext, useMemo } from "react"
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
import { storage } from '../lib/storage'
import { Student } from '../types/Student'
import { Enrollment } from '../types/Enrollment'
import { Course } from '../types/Course'
import { Role } from '../types/User'

export const Dashboard = () => {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    if(!authContext) throw new Error('auth context not defined')
    const {userEmail}= authContext
    const students: Student[] = storage.getItem('students') || users.filter(({role}) => role == 'Student')
    const savedEnrollments: Enrollment[] = storage.getItem('students') || enrollments
    const savedCourses: Course[] = storage.getItem('courses') || courses
    // let progressSum = 0
    // savedEnrollments.forEach(({progress})=> progressSum += +progress)
    // another way
    let progressSum: number = savedEnrollments.reduce((sum, e)=> sum + Number(e.progress), 0)


    const counts = useMemo(()=> ([
        {name: "Total Students", value: students.length, icon: <People sx={{ fontSize: '5rem' }}/>},
        {name: "Total Courses", value: savedCourses.length, icon: <MenuBook sx={{ fontSize: '5rem' }}/>},
        {name: "Total Enrollments", value: savedEnrollments.length, icon: <Assignment sx={{ fontSize: '5rem' }}/>},
        {name: "Completion Rate", value: savedEnrollments.length > 0 ? (progressSum / savedEnrollments.length).toFixed(2) + "%" : "0%", icon: <Unpublished sx={{ fontSize: '5rem' }}/>},
    ]), [students, savedCourses, savedEnrollments, progressSum])

    const last_5_students = useMemo(()=> students.slice(students.length-5, students.length), [students])
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

    let countsToCards = useMemo(()=> counts.map((count, index) => {
        return <Card key={`${index}-dashboard-card`}
                    sx={{
                        width: '35%',
                        height:'70%',
                        alignContent:'center',
                        margin: '8px', 
                        textAlign: 'center'
                    }}>
                    <CardContent sx={{height:'17rem', display:'grid', alignItems:'center'}}>
                        <Typography component={'h1'} color='info'>{count.icon}</Typography>
                        <Box>
                            <Typography component={'h3'} fontSize={'1.4rem'}>{count.name}</Typography>
                            <Typography component={'h1'} color='info' fontSize={'1.2rem'}>{count.value}</Typography>
                        </Box>
                    </CardContent>
                </Card>   
    }), [counts])
    return(
        <Grid 
            container 
            marginTop={'6rem'} 
            justifyContent="center" 
            alignItems={'center'} 
            spacing={3} 
        >
        {userEmail?.role == Role.Admin ? 
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