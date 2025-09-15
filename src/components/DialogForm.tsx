import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Formik, Form, FormikValues } from 'formik'
import * as Yup from 'yup'
import {add as addNewCourse} from '../store/coursesSlice'
import {add as addNewEnrollment} from '../store/enrollmentsSlice'
import {add as addNewStudent} from '../store/studentsSlice'
import {editItem as editCourse} from '../store/coursesSlice'
import {editItem as editStudent} from '../store/studentsSlice'
import {editItem as editEnrollment} from '../store/enrollmentsSlice'
import { useAppDispatch } from '../store/hooks'
import { Student } from '../types/Student'
import { Enrollment } from '../types/Enrollment'
import { Course } from '../types/Course'

interface props<T>{
    formTitle: string,
    condition: boolean, 
    setCondition: (value: boolean)=> void, 
    initialValues: Partial<T>, 
    //because maybe not every items collected
    validationSchema: Yup.ObjectSchema<any>, 
    setSuccessAction: (value: boolean)=> void,
    setFailedAction: (value: boolean)=> void,
    array: T[],
    arrayName: string, 
    item?: T | undefined, 
    courseId?: string, 
    mode: 'add' | 'edit'
}

export const DialogForm = <T extends FormikValues>(
    {
        formTitle, condition, setCondition, initialValues, 
        validationSchema, setSuccessAction, setFailedAction,
        array, arrayName, item, courseId, mode
        //array -> students / enrollments / courses
        //arrayName string like the name of item was stored in local storage
        //item for edit operation
        //courseId for enrollment addForm
        //mode --> add/edit
    }: props<T>) => {
        
    const dispatch = useAppDispatch()

    const saveEdit = (values: Partial<T>, errors: Partial<Record<keyof T, string>>) => {
        setCondition(false)
        if(Object.keys(errors).length > 0){
            setFailedAction(true)
            return
        }
        if(!item) throw new Error('item not defined')
        if(arrayName === 'students') dispatch(editStudent({item: item as unknown as Student, values: values as Partial<Student>}))
        else if(arrayName === 'courses') dispatch(editCourse({item: item as unknown as Course, values: values as Partial<Course>}))
        else if(arrayName === 'enrollments') dispatch(editEnrollment({item: item as unknown as Enrollment, values: values as Partial<Enrollment>}))
        setSuccessAction(true)
    }

    const addNewItem = (values: any, errors: Partial<Record<keyof T, string>>) => {
        for(let key of Object.keys(values)){
            //if there is at least one item null
            if(!values[key]) return
        }
        setCondition(false)
        //if all items filled but validation conditions not met
        if(Object.keys(errors).length > 0){
            setFailedAction(true)
            return
        }
        if(arrayName === 'students') dispatch(addNewStudent(values as Student))
        else if(arrayName === 'courses') dispatch(addNewCourse(values as Course))
        else if(arrayName === 'enrollments'){
            const newItem = {
                                id: `enr_${array.length}`,
                                courseId: courseId,
                                ...values
                            }
            dispatch(addNewEnrollment(newItem as Enrollment))
        }
        setSuccessAction(true)
    }

    return (
        <Dialog 
            sx={{
                display: 'grid', 
                textAlign:'center'
            }} 
            open={condition} 
            onClose={()=> setCondition(false)}
        >
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogContent sx={{display: 'grid', gap: '2rem'}}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setSubmitting})=>{
                        if(mode =='edit') saveEdit(values, {})
                        else if(mode =='add') addNewItem(values, {})
                        setSubmitting(false)
                    }}
                >
                {({values, touched, errors, handleBlur, handleChange}) => (
                    <Form style={{
                        marginTop: '1%' ,
                        display: 'flex', 
                        flexWrap:'wrap',
                        gap:'1rem', 
                        justifyContent: 'center',
                    }}>
                        {Object.keys(initialValues).map(fieldName =>
                            //key={fieldName} becaues name of input or field is unique
                            <Box display={'flex'} key={`${arrayName}-${fieldName}-input`}>
                                <TextField
                                    name={fieldName}
                                    label={fieldName}
                                    placeholder={`enter ${fieldName}`}
                                    variant="outlined"
                                    //set value to dynamic value using values state from formik
                                    //becaues of we assign it to constant value we can't edit on it
                                    value={values[fieldName]}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    //Object.keys(errors)[0] == fieldName --> only the first wrong field value will shown -- best UI practise
                                    error={Boolean(Object.keys(errors)[0] == fieldName && touched[fieldName] && errors[fieldName])}
                                    helperText={(Object.keys(errors)[0] == fieldName && touched[fieldName] && typeof errors[fieldName] === "string") ? errors[fieldName] : ''}
                                />
                            </Box>
                        )}
                        <DialogActions sx={{display: 'block',width: '100%'}}>
                            <Button 
                                type='submit'
                                color='success'
                                variant='contained'
                            >
                                    Save
                            </Button>
                            <Button color='error' variant='contained' onClick={()=> setCondition(false)}>Cancel</Button>
                        </DialogActions>
                    </Form>
                )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}