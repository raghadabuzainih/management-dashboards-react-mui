import { useParams } from "react-router-dom"
import users from '../data/users.json'
import enrollments from '../data/enrollments.json'
import courses from '../data/courses.json'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { AccessPage } from "../components/AccessPage"
import { storage } from "../lib/storage"
import { Student } from "../types/Student"
import { Enrollment } from "../types/Enrollment"
import { Course } from "../types/Course"

import { Role, User } from "../types/User"
import { useAuthContext } from "../hooks/UseAuthContext";
import { ReactNode } from "react";
const allUsers = users as User[]

const StudentDetails = () : ReactNode => {
    const {userEmail}= useAuthContext()
    const students: Student[] = storage.getItem('students') || users.filter(({role}) => role == 'Student')
    const savedEnrollments: Enrollment[] = storage.getItem('enrollments') || enrollments
    const savedCourses: Course[] = storage.getItem('courses') || courses
    const {id} = useParams()
    const student: Student | undefined = students.find(st=> st.id == id)
    const studentEnrollments: Enrollment[] | undefined = savedEnrollments.filter(({studentId})=> studentId == id)

    return(
        <Container maxWidth="md" sx={{py:4, justifyItems:'center',marginTop:'4rem'}}>
            {userEmail?.role === Role.Admin ?
            <>
                {/* check if student exists, because id parameter maybe false id or not exist */}
                {student ? <>
                <Typography 
                  variant="h4" 
                  fontWeight="bold"
                  gutterBottom 
                  sx={{color:"primary.main"}}
                >
                    Personal Information:
                </Typography>
                <Typography variant="h5" sx={{mb:1}}>
                    {`${student.firstName} ${student.lastName}`}
                </Typography>
                <Typography variant="body1" color="primary.main" sx={{mb:0.5}}>ID Number: <b>{id}</b></Typography>
                <Typography variant="body1" sx={{mb:0.5}}>Email: <b>{student.email}</b></Typography>
                <Typography variant="body1" sx={{mb:3}}>Phone Number: <b>{student.phone}</b></Typography>

                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom 
                  sx={{color:"primary.main", mt:4}}
                >
                    Enrollment Details:
                </Typography>
                <Grid container justifyContent={'center'} spacing={2}>
                    {studentEnrollments.length === 0 && 'No Enrollments yet'}
                    {studentEnrollments.map(en => {
                        const course = savedCourses.find(({id})=> id == en.courseId)
                        if(!course) throw new Error('course not defined')
                        let {title, instructorId, hours} = course
                        let instructor: User | undefined = allUsers.find(({id})=> id == instructorId)
                        if(!instructor) throw new Error('instructor not defined')
                        return (
                          <Card
                            key={en.courseId}
                            sx={{mb:2, boxShadow:3}}
                          >
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="primary.main" sx={{mb:0.5}}>
                                    <b>Taught By:</b> {instructor.firstName} {instructor.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{mb:0.5}}>
                                    <b>Course Hours:</b> {hours}
                                </Typography>
                                <Typography variant="body2" color="primary.main">
                                    <b>Progress:</b> {en.progress}%
                                </Typography>
                            </CardContent>
                          </Card>
                        )
                    })}
                </Grid>
                <Typography variant="body1" sx={{mb:2}}>
                    Total number of enrollments: <b>{studentEnrollments.length}</b>
                </Typography></>
                : <AccessPage message={"Student Not Found."}/>}
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}
export default StudentDetails
