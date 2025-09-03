import * as Yup from 'yup'
import React from "react"
import users from '../data/users.json'
import courses from '../data/courses.json'
import { SuccessOrFailMessage } from "../components/SuccessOrFailMessage"
import { DialogForm } from "../components/DialogForm"
import { useContext, useReducer } from "react"
import { AuthContext } from "../contexts/AuthContext"
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

const Courses = () => {
    const {userEmail}= useContext(AuthContext)
    const [allCourses, setAllCourses] = React.useState(storage.getItem('courses') || courses)
    const [dialogs, setDialogs] = useReducer(
        (state, action) => ({
            ...state,
            [action.type]: action.value
        }),
        {
            //initial values
            isEditClicked: false,
            openSuccessEdited: false,
            openFailedEdited: false,
            isAddClicked: false,
            openSuccessAdded: false,
            openFailedAdded: false,
            isDeleteClicked: false,
            openSuccessDeleted: false
        }
    )
    //store course id for edit & delete dialogs
    const [courseId, setCourseId] = React.useState('')
    //get data of the course to show it in edit dialog at the first time(initialValues)
    let course = allCourses.find(({id}) => id === courseId)

    const initialEditFormValues = {
        id: course?.id,
        title: course?.title,
        instructorId: course?.instructorId,
        hours: course?.hours,
        description: course?.description
    }

    const initialAddFormValues = {
        id: `crs_0${allCourses.length+1}`,
        title: "",
        instructorId: "",
        hours: "",
        description: ""
    }

    //Regular Expressions for testing: 
    const numberRegExp = /^[0-9]+$/
    const englishWithNumsAndSymbols = /^[A-Za-z0-9!@#$%^&*(),.?"':{}/|<>_\-\s]+$/

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
                      users.find(({id})=> id=== value) != undefined),
        description: Yup.string()
                    .required('enter course description')
                    .matches(englishWithNumsAndSymbols, 'write only english letters'),
        hours: Yup.string()
               .required('enter hours')
               .matches(/^[0-9]+$/, "Must be only digits")
                .test('checkHourRange', 'enter number between 1-100', (value) => 
                value >= 1 && value <= 100)          
    })

    const coursesInLists = React.useMemo(()=> allCourses.map((course, index) => {
        const instructor = users.find(({id})=> id === course.instructorId)
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
                                setCourseId(course.id)
                                setDialogs({ type: 'isEditClicked', value: true })
                            }}
                            >
                                Edit
                            </Button>
                            <Button aria-label='delete course' color='error' variant='contained' onClick={()=> {
                                setCourseId(course.id)
                                setDialogs({ type: 'isDeleteClicked', value: true })
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
        const coursesAfterDelete = allCourses.filter(course => course.id != courseId)
        storage.setItem('courses', coursesAfterDelete)
        setAllCourses(coursesAfterDelete)
        setDialogs({ type: 'isDeleteClicked', value: true })
        setDialogs({ type: 'openSuccessDeleted', value: true })
    }

    return(
        <Container sx={{marginTop:'5rem'}}>
            {userEmail?.role=== 'Admin' ?
            <>
                <Grid container spacing={2} justifyContent={'center'}>{coursesInLists}</Grid>
                <Box sx={{position:'fixed', bottom:'3%', right:'2%'}}>
                    <Fab aria-label='add new course' color='primary' onClick={()=> setDialogs({ type: 'isAddClicked', value: true })}>
                        <AddIcon />
                    </Fab>
                </Box>
                {/* edit dialog form */}
                <DialogForm
                    formTitle='Add New Course'
                    condition={dialogs.isEditClicked}
                    setCondition= {(value)=> setDialogs({type: 'isEditClicked', value: value})}
                    initialValues={initialEditFormValues}
                    validationSchema = {commonValidation}
                    setSuccessAction ={(value)=> setDialogs({type: 'openSuccessEdited', value: value})}
                    setFailedAction ={(value)=> setDialogs({type: 'openFailedEdited', value: value})}
                    array= {allCourses}
                    arrayName= 'courses'
                    setArray= {setAllCourses}
                    item= {course}
                    mode= 'edit'
                />
                {/* successful edit */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessEdited}
                    onClose={()=> setDialogs({type: 'openSuccessEdited', value: false})}
                    severity="success"
                    message="Course Info edited successfully"
                />
                {/* failed edit */}
                <SuccessOrFailMessage
                    open={dialogs.openFailedEdited}
                    onClose={()=> setDialogs({type: 'openFailedEdited', value: false})}
                    severity="error"
                    message="Failed to edit course info"
                />
                {/* delete dialog */}
                <Dialog open={dialogs.isDeleteClicked} onClose={()=> setDialogs({type: 'isDeleteClicked', value: false})}>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete this course?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> deleteCourse()}>Yes</Button>
                        <Button onClick={()=> setDialogs({type: 'isDeleteClicked', value: false})}>No</Button>
                    </DialogActions>
                </Dialog>
                {/* successful delete */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessDeleted}
                    onClose={()=> setDialogs({type: 'openSuccessDeleted', value: false})}
                    severity="success"
                    message="Course deleted successfully"
                />
                {/* add dialog form */}
                <DialogForm
                    formTitle='Edit Course Info'
                    condition={dialogs.isAddClicked}
                    setCondition= {(value)=> setDialogs({type: 'isAddClicked', value: value})}
                    initialValues={initialAddFormValues}
                    validationSchema = {commonValidation}
                    setSuccessAction ={(value)=> setDialogs({type: 'openSuccessAdded', value: value})}
                    setFailedAction ={(value)=> setDialogs({type: 'openFailedAdded', value: value})}
                    array= {allCourses}
                    arrayName = 'courses'
                    setArray= {setAllCourses}
                    mode= 'add'
                />
                {/* successful add */}
                <SuccessOrFailMessage
                    open={dialogs.openSuccessAdded}
                    onClose={()=> setDialogs({type: 'openSuccessAdded', value: false})}
                    severity="success"
                    message="Course added successfully"
                />
                {/* failed add */}
                <SuccessOrFailMessage
                    open={dialogs.openFailedAdded}
                    onClose={()=> setDialogs({type: 'openFailedAdded', value: false})}
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