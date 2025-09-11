import * as Yup from 'yup'
import React from "react"
import users from '../data/users.json'
import courses from '../data/courses.json'
import { SuccessOrFailMessage } from "../components/SuccessOrFailMessage"
import { DialogForm } from "../components/DialogForm"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionActions from "@mui/material/AccordionActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import Fab from "@mui/material/Fab"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { storage } from '../lib/storage'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'

import { AccessPage } from '../components/AccessPage'

import { Course } from '../types/Course'
import { User, Role } from '../types/User'
import { useAuthContext } from '../hooks/UseAuthContext'
import { useArray } from '../hooks/UseArray'
import { useDialogs } from '../hooks/UseDialogs'
import { useSelectedID } from '../hooks/UseSelectedID'

const allUsers = users as User[]

const Courses = () => {
    const {userEmail} = useAuthContext()
    const [allCourses, updateCourses] = useArray<Course>(courses, 'courses')
    const [dialogs, updateCondition] = useDialogs()
    //store course id for edit & delete dialogs
    const [courseId, updateCourseID] = useSelectedID()
    //get data of the course to show it in edit dialog at the first time(initialValues)
    let course: Course | undefined = allCourses.find(({id}) => id === courseId)

    const initialEditFormValues: Course = {
        id: course?.id || '',
        title: course?.title || '',
        instructorId: course?.instructorId || '',
        hours: course?.hours || 0,
        description: course?.description || ''
    }

    const initialAddFormValues: Course = {
        id: `crs_0${allCourses.length+1}`,
        title: "",
        instructorId: "",
        hours: 0,
        description: ""
    }

    //Regular Expressions for testing: 
    const numberRegExp: RegExp = /^[0-9]+$/
    const englishWithNumsAndSymbols: RegExp = /^[A-Za-z0-9!@#$%^&*(),.?"':{}/|<>_\-\s]+$/

    const commonValidation = Yup.object({
        id: Yup.string()
           .required('enter id')
            .matches(englishWithNumsAndSymbols, 'write in english please')
            .test('unique', 'enter unique id', (value) => 
            //x != course -> because maybe admin rewrite the same id for the same course & gave it enter unique id
            allCourses.find(x => x.id === value && x != course) === undefined)
            .test('valid', 'it must start by crs_ and 3 numbers', (value)=> 
            //check if it's unique
            //assume that id start from crs_001 to crs_999
            value.length === 7 && value.slice(0,4) === 'crs_' && numberRegExp.test(value.slice(4, 7))
            ),
        title: Yup.string()
                .required('enter course title')
               .matches(englishWithNumsAndSymbols, 'write only english letters'),
        instructorId: Yup.string()
                      .required('enter instructor id')
                      .test('checkInstID', 'instructor not exists', (value)=>
                      allUsers.find(({id})=> id=== value) != undefined),
        description: Yup.string()
                    .required('enter course description')
                    .matches(englishWithNumsAndSymbols, 'write only english letters'),
        hours: Yup.number()
               .required('enter hours')
               .min(1, 'must be >= 1')
               .max(100, 'must be <= 100')         
    })

    const coursesInLists = React.useMemo(()=> allCourses.map((course, index) => {
        const instructor: User | undefined = allUsers.find(({id})=> id === course.instructorId)
        if(!instructor) throw new Error('instructor is not defined')
        const instructorFullName = instructor.firstName + " " + instructor.lastName
        return(
            <Grid key={`accordion-course-${index}`} width={'30%'}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`course${index}-details`}
                        id={`course${index}-header`}
                    >
                        <Typography component="span" fontWeight={'bold'}>{course.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails id={`course${index}-details`}>
                        <Typography component={'span'} color='primary' fontWeight={'bold'}>Taught by:</Typography> {instructorFullName}<br/>
                        <Typography component={'span'} color='primary' fontWeight={'bold'}>Total hours:</Typography> {course.hours}<br/>
                        <Typography component={'span'} color='primary' fontWeight={'bold'}>Description:</Typography> {course.description}<br/>
                    </AccordionDetails>
                    <AccordionActions sx={{paddingBottom: 2}}>
                        <Grid container spacing={1} justifyContent={'center'}>
                            <Button aria-label='edit course info' color='success' variant='contained' onClick={()=> {
                                //these two lines we will use it for edit dialog form
                                updateCourseID(course.id)
                                updateCondition({ type: 'isEditClicked', value: true })
                            }}
                            >
                                Edit
                            </Button>
                            <Button aria-label='delete course' color='error' variant='contained' onClick={()=> {
                                updateCourseID(course.id)
                                updateCondition({ type: 'isDeleteClicked', value: true })
                            }}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </AccordionActions>
                </Accordion>
            </Grid>
        )
    }), [allCourses])

    function deleteCourse(){
        const coursesAfterDelete: Course[] = allCourses.filter(course => course.id != courseId)
        storage.setItem('courses', coursesAfterDelete)
        updateCourses(coursesAfterDelete)
        updateCondition({ type: 'isDeleteClicked', value: true })
        updateCondition({ type: 'openSuccessDeleted', value: true })
    }

    return(
        <Container sx={{marginTop:'5rem'}}>
            {userEmail?.role === Role.Admin ?
            <>
                <Grid container spacing={2} justifyContent={'center'}>{coursesInLists}</Grid>
                <Box sx={{position:'fixed', bottom:'3%', right:'2%'}}>
                    <Fab aria-label='add new course' color='primary' onClick={()=> updateCondition({ type: 'isAddClicked', value: true })}>
                        <AddIcon />
                    </Fab>
                </Box>
                {/* edit dialog form */}
                <DialogForm
                    formTitle='Add New Course'
                    condition={dialogs.isEditClicked}
                    setCondition= {(value)=> updateCondition({type: 'isEditClicked', value: value})}
                    initialValues={initialEditFormValues}
                    validationSchema = {commonValidation}
                    setSuccessAction ={(value)=> updateCondition({type: 'openSuccessEdited', value: value})}
                    setFailedAction ={(value)=> updateCondition({type: 'openFailedEdited', value: value})}
                    array= {allCourses}
                    arrayName= 'courses'
                    updateArray= {updateCourses}
                    item= {course}
                    mode= 'edit'
                />
                {/* successful edit */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessEdited}
                    onClose={()=> updateCondition({type: 'openSuccessEdited', value: false})}
                    severity="success"
                    message="Course Info edited successfully"
                />
                {/* failed edit */}
                <SuccessOrFailMessage
                    open={dialogs.openFailedEdited}
                    onClose={()=> updateCondition({type: 'openFailedEdited', value: false})}
                    severity="error"
                    message="Failed to edit course info"
                />
                {/* delete dialog */}
                <Dialog open={dialogs.isDeleteClicked} onClose={()=> updateCondition({type: 'isDeleteClicked', value: false})}>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete this course?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> deleteCourse()}>Yes</Button>
                        <Button onClick={()=> updateCondition({type: 'isDeleteClicked', value: false})}>No</Button>
                    </DialogActions>
                </Dialog>
                {/* successful delete */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessDeleted}
                    onClose={()=> updateCondition({type: 'openSuccessDeleted', value: false})}
                    severity="success"
                    message="Course deleted successfully"
                />
                {/* add dialog form */}
                <DialogForm
                    formTitle='Edit Course Info'
                    condition={dialogs.isAddClicked}
                    setCondition= {(value)=> updateCondition({type: 'isAddClicked', value: value})}
                    initialValues={initialAddFormValues}
                    validationSchema = {commonValidation}
                    setSuccessAction ={(value)=> updateCondition({type: 'openSuccessAdded', value: value})}
                    setFailedAction ={(value)=> updateCondition({type: 'openFailedAdded', value: value})}
                    array= {allCourses}
                    arrayName = 'courses'
                    updateArray= {updateCourses}
                    mode= 'add'
                />
                {/* successful add */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessAdded}
                    onClose={()=> updateCondition({type: 'openSuccessAdded', value: false})}
                    severity="success"
                    message="Course added successfully"
                />
                {/* failed add */}
                <SuccessOrFailMessage
                    open={dialogs.openFailedAdded}
                    onClose={()=> updateCondition({type: 'openFailedAdded', value: false})}
                    severity="error"
                    message="Failed to add new course"
                />
            </> : 
                <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
    )
}
export default Courses