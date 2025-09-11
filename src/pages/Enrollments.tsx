import enrollments from '../data/enrollments.json'
import users from '../data/users.json'
import courses from '../data/courses.json'
import React from 'react'
import * as Yup from 'yup'
import { DialogForm } from '../components/DialogForm'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'
import { useMemo } from 'react'
import { storage } from '../lib/storage'

import { AccessPage } from '../components/AccessPage'
import { Enrollment } from '../types/Enrollment'
import { Student } from '../types/Student'
import { Course } from '../types/Course'

import { Role } from '../types/User'
import { useAuthContext } from '../hooks/UseAuthContext'
import { useArray } from '../hooks/UseArray'
import { useDialogs } from '../hooks/UseDialogs'
import { useSelectedID } from '../hooks/UseSelectedID'

const Enrollments = () => {
    const {userEmail}= useAuthContext()
    const [savedEnrollments, update] = useArray<Enrollment>(enrollments, 'enrollments')

    const students: Student[] = storage.getItem('students') || users.filter(({role}) => role === 'Student') 
    let savedCourses: Course[] = storage.getItem('courses') || courses
    
    const [dialogs, updateCondition] = useDialogs()
    //store enrollmentId for edit/delete operations
    const [enrollmentId, updateID] = useSelectedID()
    let enrollment = useMemo(()=> savedEnrollments.find(({id}) => id === enrollmentId), [savedEnrollments, enrollmentId])
    //show student name in edit/delete enrollment dialog title
    let editedOrDeletedStudent = useMemo(()=> students.find(({id})=> id === enrollment?.studentId), [students, enrollment])
    let editedOrDeletedStudentName = editedOrDeletedStudent?.firstName + " " + editedOrDeletedStudent?.lastName
    //using this for add new enrollment for course
    let courseID = storage.getItem('courseId')

    type studentEnrollment ={
        id: string,
        stName: string,
        progress: number
    }
    
    //we will use these lines to make courses enrollments cards
    const enrollmentsMap = useMemo(()=> {
        let map = new Map() //using map to make key always unique
        savedEnrollments.map(en => {
            let courseName = savedCourses.find(course => course.id === en.courseId)?.title
            let student: Student | undefined = students.find(st => st.id === en.studentId)
            if(!student) throw new Error('student not defined')
            let studentName = student.firstName + " " + student.lastName
            map.set(
                //key, value => courseName, array of objects that contain student name & his progress
                // || [] --> if key is not exists because [...enroll] will give error if key not defined --> [...undefined]
                courseName, [...map.get(courseName) || [], {id: en.id , stName: studentName, progress: en.progress}]
            )
        })
        //courses without enrollments
        savedCourses.forEach(course=>{
            if(!map.has(course.title)) map.set(course.title, null)
        })
        return map
    }, [savedCourses, students, savedEnrollments])

    let enrollmentsMapToCards = Array.from(enrollmentsMap.entries()).map(([courseName, enrollment]) => {
        return(
            <Grid>
                <ListItem key={`${courseName}-listItem`}>
                    <Card sx={{
                        width: '25rem', 
                        height:'20rem'
                    }}>
                        <CardContent>
                            <Typography component={'h1'} variant='h6' fontWeight={'bold'}>{courseName} Enrollments</Typography>
                            <Grid display={'flex'} marginBottom={'2%'} marginTop={'4%'}>
                                <Typography flexGrow={1} component={'h5'} color='primary'>Students</Typography>
                                <Typography flexGrow={1} component={'h5'} color='primary'>Progress</Typography>
                                <Typography flexGrow={1} component={'h5'} color='primary'>Edit / UnEnroll</Typography>
                            </Grid>
                            <Box 
                                display={'grid'}
                                sx={{
                                    height: '13rem', 
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    '&::-webkit-scrollbar': { width: '8px' },
                                    '&::-webkit-scrollbar-thumb': { 
                                        backgroundColor: '#90caf9', 
                                        borderRadius: '8px' 
                                    },
                                    paddingBottom:'1.4rem'
                                }}
                            >
                                {enrollment ? enrollment.map((en: studentEnrollment) => {
                                    return <Grid display={'flex'} gap={'1rem'} alignItems={'center'} justifyContent={'space-between'}>
                                        <Typography flexGrow={1} component={'p'}>{en.stName}</Typography>
                                        <Box position={'relative'} right={'3%'}>
                                            <Typography
                                                justifySelf={'center'}
                                                position={'relative'}
                                                top={'12px'}
                                                component={'p'}
                                            >
                                                {en.progress}
                                            </Typography>
                                            <CircularProgress sx={{marginTop:'-1rem'}} size={'2rem'} variant='determinate' value={en.progress}/>
                                        </Box>
                                        <Box display={'flex'} gap={'2%'}>
                                            <Chip
                                                aria-label='edit student progress'
                                                label="Edit progress"
                                                onClick={()=> {
                                                    updateID(en.id)
                                                    updateCondition({type: 'isEditClicked', value: true})
                                                }}
                                                color='success'
                                            />
                                            {/* unEnroll -> delete */}
                                            <Chip
                                                aria-label='unenroll student'
                                                label="UnEnroll"
                                                onClick={()=> {
                                                    updateID(en.id)
                                                    updateCondition({type: 'isDeleteClicked', value: true})
                                                }}
                                                color='error'
                                            />
                                        </Box>
                                    </Grid>
                                }): <Typography color='error' alignSelf={'center'} justifySelf={'center'}>No Enrollments yet.</Typography>}
                            </Box>
                        </CardContent>
                        <CardActions sx={{position:'absolute', bottom:0, width:'96%', left:'9px'}}>
                            <Button
                            aria-label='add new enrollment'
                                variant='contained'
                                sx={{width:'100%'}}
                                onClick={()=> {
                                    updateCondition({ type: "isAddClicked", value: true })
                                    const course = savedCourses.find(course => course.title === courseName)
                                    if(!course) throw new Error('course not defined')
                                    const courseId: string = course.id
                                    storage.setItem('courseId', courseId)
                                }}
                            >
                                Add New Enrollment
                            </Button>
                        </CardActions>
                    </Card>
                </ListItem>
            </Grid>
        )     
    })

    //for operations -> edit, add, delete
    let initialEditFormValues: Pick<Enrollment, 'progress'>= {
        progress: enrollment?.progress || 0
    }

    let editFormValidationSchema = Yup.object({
        progress: Yup.number().required('enter progress')
            .min(0, 'must be >= 0')
            .max(100, 'must be <= 100')
    })

    let initialAddFormValues: Pick<Enrollment, 'studentId'| 'progress'> = {
        studentId: "",
        progress: 0
    }

    let addFormValidationSchema = Yup.object({
        studentId: Yup.string().required('enter student id')
            .test('existStudent', 'student not exist', (value)=> {return students.find(({id})=> id === value) !== undefined})
            //prevent repeated enrollment if the student enrolled before at the same course(instedof it: edit his progress)
            .test('enrolledBefore', 'student enrolled before', (value)=> {
                const courseEnrollments = savedEnrollments.filter(({courseId}) => courseId === courseID)
                return courseEnrollments.find(({studentId})=> studentId === value) === undefined
            }),
        progress: Yup.number().required('enter progress')
            .min(0, 'must be >= 0')
            .max(100, 'must be <= 100')
    })

    function deleteEnrollment(){
        updateCondition({type: 'isDeleteClicked', value: false}) //to close delete dialog
        const updatedEnrollments = savedEnrollments.filter(({id})=> id != enrollmentId)
        storage.setItem('enrollments', updatedEnrollments)
        update(updatedEnrollments)
        updateCondition({ type: "openSuccessDeleted", value: true })
    }
    
    return(
        //maxWidth={false} -> containerr will take all the page width
        <Container maxWidth={false} 
            sx={{
                display: 'grid', 
                justifyContent:'center', 
                marginTop:'5rem', 
                paddingBottom:'3%',
            }}>
            {userEmail?.role === Role.Admin ? <>
                <Grid container justifyContent={'center'} width={'90%'} marginLeft={'4%'}>{enrollmentsMapToCards}</Grid>
                    {/* edit dialog form */}
                    <DialogForm
                        formTitle={`Edit ${editedOrDeletedStudentName} progress`}
                        condition={dialogs.isEditClicked}
                        setCondition= {(value)=> updateCondition({type: 'isEditClicked', value: value})}
                        initialValues={initialEditFormValues}
                        validationSchema = {editFormValidationSchema}
                        setSuccessAction ={(value)=> updateCondition({type: 'openSuccessEdited', value: value})}
                        setFailedAction ={(value)=> updateCondition({type: 'openFailedEdited', value: value})}
                        array= {savedEnrollments}
                        arrayName= 'enrollments'
                        updateArray= {update}
                        item= {enrollment}
                        mode= 'edit'
                    />
                    {/* successful edit */}
                    <SuccessOrFailMessage
                        open={dialogs.openSuccessEdited}
                        onClose={() => updateCondition({ type: "openSuccessEdited", value: false })}
                        severity="success"
                        message="Enrollment Info edited successfully"
                    />
                    {/* failed edit */}
                    <SuccessOrFailMessage
                        open={dialogs.openFailedEdited}
                        onClose={() => updateCondition({ type: "openFailedEdited", value: false })}
                        severity="error"
                        message="Failed to edit enrollment info"
                    />
                    {/* add dialog form */}
                    <DialogForm
                        formTitle='Add New Enrollment'
                        condition={dialogs.isAddClicked}
                        setCondition={(value) => updateCondition({ type: "isAddClicked", value })}
                        initialValues={initialAddFormValues}
                        validationSchema = {addFormValidationSchema}
                        setSuccessAction={(value) => updateCondition({ type: "openSuccessAdded", value })}
                        setFailedAction={(value) => updateCondition({ type: "openFailedAdded", value })}
                        array= {savedEnrollments}
                        arrayName = 'enrollments'
                        updateArray= {update}
                        courseId ={courseID}
                        mode= 'add'
                    />
                {/* successful add */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessAdded}
                    onClose={() => updateCondition({ type: "openSuccessAdded", value: false })}
                    severity="success"
                    message="Enrollment added successfully"
                />
                {/* failed add */}
                <SuccessOrFailMessage
                    open={dialogs.openFailedAdded}
                    onClose={() => updateCondition({ type: "openFailedAdded", value: false })}
                    severity="error"
                    message="Failed to add new enrollment"
                />
                {/* delete dialog */}
                <Dialog 
                    open={dialogs.isDeleteClicked} 
                    onClose={() => updateCondition({ type: "isDeleteClicked", value: false })}
                >
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete {editedOrDeletedStudentName} enrollment?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> deleteEnrollment()}>Yes</Button>
                        <Button onClick={() => updateCondition({ type: "isDeleteClicked", value: false })}>No</Button>
                    </DialogActions>
                </Dialog>
                {/* successful delete */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessDeleted}
                    onClose={() => updateCondition({ type: "openSuccessDeleted", value: false })}
                    severity="success"
                    message="Enrollment deleted successfully"
                />
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}
export default Enrollments