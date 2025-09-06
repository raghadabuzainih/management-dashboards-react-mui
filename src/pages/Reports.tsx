import {Bar} from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2' 
import courses from '../data/courses.json'
import enrollments from '../data/enrollments.json'
import users from '../data/users.json'
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title,
    Tooltip, 
    Legend,
    ArcElement
} from 'chart.js';
//every import will put in:
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)
import { AuthContext } from '../contexts/AuthContext'
import { useContext, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import { GridLegacy as Grid } from "@mui/material";
import { AccessPage } from '../components/AccessPage'
import { storage } from '../lib/storage'
import { Course } from '../types/Course'
import { Enrollment } from '../types/Enrollment'
import { User,Role } from '../types/User'

const allUsers = users as User[]

const Reports = () => {
    const authContext = useContext(AuthContext)
    if(!authContext) throw new Error('auth context not defined')
    const {userEmail}= authContext
    let savedCourses: Course[] = storage.getItem('courses') as Course[] || courses
    let savedEnrollments: Enrollment[] = storage.getItem('enrollments') || enrollments
    //1- students/courses chart info: 
    let coursesNames: string[] = savedCourses.map(course => { return course.title })
    let coursesIDs: string[] = savedCourses.map(course => { return course.id })
    let studentCountsPerCourse: number[] = useMemo (()=> coursesIDs.map(courseID => {
        return savedEnrollments.filter(({courseId}) => courseId == courseID).length
    }), [coursesIDs, savedEnrollments])
    const bgColors: string[] = coursesNames.map(()=>{
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    })
    const data = {
        labels: coursesNames, //x-axis
        datasets: [ //y-axis
            {
                label: 'Number of students',
                data: studentCountsPerCourse,
                backgroundColor: bgColors
            }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false, //chart will fit with container size
        plugins: {
            legend: {display: false},
            title: {
                display: true,
                text: "Number of Students per Courses"
            }
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
    //2- courses/instructors chart info: 
    let instructors: User[] = allUsers.filter(user => user.role === Role.Instructor)
    let instructorsNames: string[] = instructors.map(inst => {return inst.firstName + " " + inst.lastName})
    let instructorsIDs: string[] = instructors.map(inst => {return inst.id})
    let coursesCountsPerInstructor: number[] = useMemo(()=> instructorsIDs.map(instructorID => {
        return savedCourses.filter(({instructorId}) => instructorId == instructorID).length
    }), [instructorsIDs, savedCourses])
    const bgColors2: string[] = instructorsNames.map(()=>{
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    })
    const data2 = {
        labels: instructorsNames,
        datasets: [{
            label: 'Number of courses',
            data: coursesCountsPerInstructor,
            backgroundColor: bgColors2
        }]
    }

    const options2 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: "Number of Courses per Instructor" },
            legend: {position: 'bottom' as 'bottom'}
        },
        scales: {
            y: { ticks: { stepSize: 1 } }
        }
    }

    let enrollmentsCountsPerCourse: number[] = []
    savedCourses.forEach(course=>{
        enrollmentsCountsPerCourse.push(savedEnrollments.filter(({courseId})=> courseId == course.id).length)
    })
    const data3 = {
        labels: coursesNames,
        datasets: [{
            label: 'Number of Enrollments',
            data: enrollmentsCountsPerCourse,
            backgroundColor: bgColors
        }]
    }

    const options3 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: "Number of Enrollments per Course" },
            legend: {position: 'bottom' as 'bottom'} //not accept any type of string
        },
        scales: {
            y: { ticks: { stepSize: 1 } }
        }
    }

    return(
        <Container sx={{display:'grid', gap:'3%', marginTop:'4rem',marginBottom: '3%'}}>
            {userEmail?.role == Role.Admin ?
            <>
                {/* students/courses */}
                <Card sx={{paddingBottom: '2rem'}}>
                    <CardContent sx={{justifySelf:'center',width:'700px',height: "450px"}}>
                        <Bar data={data} options={options} />
                    </CardContent>
                </Card>
                <Grid container spacing={2} justifyContent={'center'}>
                    {/* courses/instructors */}
                    <Grid item xs={6}>
                        <Card sx={{paddingBottom: '1rem'}}>
                            <CardContent sx={{justifySelf:'center', width:'400px', height: "600px"}}>
                                <Pie data={data2} options={options2} />
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* enrollments/courses */}
                    <Grid item xs={6}>
                        <Card sx={{paddingBottom: '1rem'}}>
                            <CardContent sx={{justifySelf:'center', width:'400px',height: "600px"}}>
                                <Pie data={data3} options={options3} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )

}
export default Reports