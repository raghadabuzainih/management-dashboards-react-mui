import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Formik, Form } from 'formik'
import { storage } from '../lib/storage'

export const DialogForm = (
    {
        formTitle, condition, setCondition, initialValues, 
        validationSchema, setSuccessAction, setFailedAction,
        array, arrayName, setArray, item, courseId, mode
        //array -> students / enrollments / courses
        //arrayName string like the name of item was stored in local storage
        //item for edit operation
        //courseId for enrollment addForm
        //mode --> add/edit
    }) => {

    const saveEdit = (values, errors) => {
        setCondition(false)
        if(Object.keys(errors).length > 0){
            setFailedAction(true)
            return
        }

        let updatedArray = array.map(x => {
            if(x == item) return {...item, ...values} //because enrollment edit form contains only progress
            return x
        })
        saveToLocalStorageAndShowSuccessMessage(arrayName, updatedArray)
    }

    const addNewItem = (values, errors) => {
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
        let newItem = arrayName === 'enrollments' ? 
                      {
                        id: `enr_${array.length}`,
                        courseId: courseId,
                        ...values
                      } : values
        let updatedArray = [...array, newItem]
        saveToLocalStorageAndShowSuccessMessage(arrayName, updatedArray)
    }

    const saveToLocalStorageAndShowSuccessMessage = (arrayName, updatedArray)=>{
       storage.setItem(arrayName, updatedArray)
       setArray(updatedArray)
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
                                    error={Object.keys(errors)[0] == fieldName && touched[fieldName] && Boolean(errors[fieldName])}
                                    helperText={Object.keys(errors)[0] == fieldName && touched[fieldName] && errors[fieldName]}
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