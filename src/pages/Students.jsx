import React from 'react'
import users from '../data/users.json'
//there is a relation between students & enrollments...
//so any delete on students will affect on enrollments
//--> add new student or edit not effect because add/edit forms contain info like info in users.json
//edit/add form don't contain enrollments or courses
import enrollments from '../data/enrollments.json'
import * as Yup from 'yup'
import { DialogForm } from '../components/DialogForm'
import { SuccessOrFailMessage } from '../components/SuccessOrFailMessage'
import { AuthContext } from '../contexts/AuthContext'
import { useContext, useReducer } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Container
} from '@mui/material';
import { ModeEdit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { AccessPage } from '../components/AccessPage'
import { useNavigate } from 'react-router-dom'
import { storage } from '../lib/storage'

const Students = () => {
    const navigate = useNavigate()
    const {userEmail} = useContext(AuthContext)
    const [students, setStudents] = React.useState(storage.getItem('students') || users.filter(({role}) => role == 'Student'))
    
        //run only the first time
    if(storage.getItem('enrollments') == null){
        storage.setItem('enrollments', enrollments)
    }
    const [dialogs, setDialogs] = useReducer(
        (state, action) => ({
            ...state,
            [action.type]: action.value
        }),
        {
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
    //store student id for edit & delete dialogs
    const [studentId, setStudentId] = React.useState('')
    //get data of the student to show it in edit dialog at the first time(initialValues)
    const student = students.find(student => student.id == studentId)

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstName', headerName: 'First Name', width: 120 },
        { field: 'lastName', headerName: 'Last Name', width: 120 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone Number', type: 'number', width: 160 },
        {
            field: 'profileURL',
            headerName: 'Profile URL',
            width: 180,
            renderCell: (params) => (
                <Button variant='contained' size='small' onClick={()=> navigate(params.value)}>
                    {params.value}
                </Button>
            )
        },
        {
            headerName: 'Edit / Delete',
            width: 150,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box display={'flex'} gap={1}>
                    <Button aria-label='edit student info' sx={{cursor: 'pointer'}} onClick={()=> openEditDialog(params.id)}>
                        <EditIcon sx={{color: 'red'}}/>
                    </Button>
                    <Button aria-label='delete student' sx={{cursor:'pointer'}} onClick={()=> openDeleteDialog(params.id)}>
                        <DeleteIcon sx={{color: 'green'}}/>
                    </Button>
                </Box>
            )
        }
    ]
    const rows = students
    const initialEditFormValues = {
        id: student?.id, //this (?) because student undefined before we press edit button..
                         //because we catch student id when click edit button then find the student
        firstName: student?.firstName,
        lastName: student?.lastName,
        email: student?.email,
        password: student?.password,
        phone: student?.phone,
        profileURL: student?.profileURL,
    }

    const initialAddFormValues = {
        id: `stu_0${students.length+1}`,
        firstName: "",
        lastName: "",
        email: "",
        //note in data -> password begin with order of student 
        password: `${students.length+1}Stude%@`,
        phone: "",
        profileURL: ""
    }

    //Regular Expressions for testing: 
    const numberRegExp = /^[0-9]+$/
    const englishCharactersOnly = /^[A-Za-z]+$/
    const englishCharactersAndAcceptedSpaces = /^[A-Za-z\s]+$/
    const englishWithNumsAndSymbols = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-\s]+$/
    const phoneNumberRegExp = /^\+970-5[69]\d{7}$/

    const commonValidation = Yup.object({
        id: Yup.string()
            .required('enter id')
            .matches(englishWithNumsAndSymbols, 'write in english please')
            .test('unique', 'enter unique id', (value) => 
                //x != student -> because maybe admin rewrite the same id for the same student & gave it enter unique id
                students.find(x => x.id == value && x != student) == undefined)
            .test('valid', 'it must start by stu_ and 3 numbers', (value)=> 
                //wanna check if it's unique
                //assume that id start from stu_001 to stu_999
                value.length == 7 && value.slice(0,4) == 'stu_' && numberRegExp.test(value.slice(4, 7))
            ),
        firstName: Yup.string()
                   .required('enter first name')
                   .matches(englishCharactersOnly, 'write only english letters'),
        lastName: Yup.string()
                  .required('enter last name')
                  .matches(englishCharactersAndAcceptedSpaces, 'write only english letters'),
        email: Yup.string()
               .required('enter email')
               .email('enter valid email')
               .matches(englishWithNumsAndSymbols, 'write in english please')
               .test('exists', 'enter unique email', (value) => 
                students.find(st => st.email == value && st != student)== undefined),
        password: Yup.string()
                  .required('enter password')
                  .test('validPassword', 'password must contain "Stude%@"', (value)=>
                    value.includes("Stude%@")),
        phone: Yup.string()
               .required('enter phone')
               .matches(phoneNumberRegExp, 'must begin with +970'),
        profileURL: Yup.string()
                    .required('enter profile URL')
                    //contain english letters, - , _
                    .matches(/^[a-zA-Z0-9/_-]+$/, 'enter valid path')
                    .test('pathPattern', 'enter like "/students/{id}"', function(value){
                        const parent = this.parent
                        return value == '/students/' + parent['id']
                    })
                    .test('uniquePath', 'enter unique path "/students/{id}"', (value)=>
                        students.find(st => st.profileURL == value && st!= student)== undefined
                    )
    })
    
    function openEditDialog(id) {
        setDialogs({type: 'isEditClicked', value: true})
        setStudentId(id)
    }
    
    function openDeleteDialog(id) {
        setDialogs({type: 'isDeleteClicked', value: true})
        setStudentId(id)
    }

    function deleteStudent(){
        const studentsAfterDelete = students.filter(student => student.id != studentId)
        storage.setItem('students', studentsAfterDelete)
        const savedEnrollments = storage.getItem('enrollments')
        //delete all student enrollments because this student will deleted from students
        const updatedEnrollments = savedEnrollments.filter(en => en.studentId != studentId)
        storage.setItem('enrollments', updatedEnrollments)
        setStudents(studentsAfterDelete)
        setDialogs({ type: "isDeleteClicked", value: false })
        setDialogs({ type: "openSuccessDeleted", value: true })
    }

    return (
        <Container sx={{marginTop: '4rem'}}>
            {userEmail?.role=='Admin' ?
                <>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        autoHeight
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10
                                }
                            }
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick      
                    />
                    {/* edit dialog form */}
                    <DialogForm
                        formTitle='Edit Student Info'
                        condition={dialogs.isEditClicked}
                        setCondition= {(value)=> setDialogs({type: 'isEditClicked', value: value})}
                        initialValues={initialEditFormValues}
                        validationSchema = {commonValidation}
                        setSuccessAction ={(value)=> setDialogs({type: 'openSuccessEdited', value: value})}
                        setFailedAction ={(value)=> setDialogs({type: 'openFailedEdited', value: value})}
                        array= {students}
                        arrayName= 'students'
                        setArray= {setStudents}
                        item= {student}
                        mode= 'edit'
                    />
                    {/* successful edit */}
                    <SuccessOrFailMessage
                        open={dialogs.openSuccessEdited}
                        onClose={() => setDialogs({ type: "openSuccessEdited", value: false })}
                        severity="success"
                        message="Student Info edited successfully"
                    />
                    {/* failed edit */}
                    <SuccessOrFailMessage
                        open={dialogs.openFailedEdited}
                        onClose={() => setDialogs({ type: "openFailedEdited", value: false })}
                        severity="error"
                        message="Failed to edit student info"
                    />
                    {/* delete dialog */}
                    <Dialog 
                        open={dialogs.isDeleteClicked} 
                        onClose={() => setDialogs({ type: "isDeleteClicked", value: false })}
                    >
                        <DialogContent>
                            <DialogContentText>
                                Are you sure that you want to delete this student?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => deleteStudent()}>Yes</Button>
                            <Button onClick={() => setDialogs({ type: "isDeleteClicked", value: false })}>No</Button>
                        </DialogActions>
                    </Dialog>
                    {/* successful delete */}
                    <SuccessOrFailMessage
                        open={dialogs.openSuccessDeleted}
                        onClose={() => setDialogs({ type: "openSuccessDeleted", value: false })}
                        severity="success"
                        message="Student deleted successfully"
                    />
                    {/* add dialog form */}
                    <DialogForm
                        formTitle='Add New Student'
                        condition={dialogs.isAddClicked}
                        setCondition={(value) => setDialogs({ type: "isAddClicked", value })}
                        initialValues={initialAddFormValues}
                        validationSchema={commonValidation}
                        setSuccessAction={(value) => setDialogs({ type: "openSuccessAdded", value })}
                        setFailedAction={(value) => setDialogs({ type: "openFailedAdded", value })}
                        array={students}
                        arrayName='students'
                        setArray={setStudents}
                        mode='add'
                    />
                    {/* successful add */}
                    <SuccessOrFailMessage
                        open={dialogs.openSuccessAdded}
                        onClose={() => setDialogs({ type: "openSuccessAdded", value: false })}
                        severity="success"
                        message="Student added successfully"
                    />
                    {/* failed add */}
                    <SuccessOrFailMessage
                        open={dialogs.openFailedAdded}
                        onClose={() => setDialogs({ type: "openFailedAdded", value: false })}
                        severity="error"
                        message="Failed to add new student"
                    />
                    <Box sx={{position:'fixed', bottom:'3%', right:'2%'}}>
                        <Fab aria-label='add student' color='primary' onClick={() => setDialogs({ type: "isAddClicked", value: true })}>
                            <AddIcon />
                        </Fab>
                    </Box>
                </> : 
                    <AccessPage message={"You don't have access to this page."}/>
            }
        </Container>
  )
}

export default Students