import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import users from '../data/users.json'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box
} from '@mui/material';
import { ReactNode, useCallback } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useAuthContext } from '../hooks/UseAuthContext'
import { useClick } from '../hooks/UseClick'

export const Login = () : ReactNode => {
    const navigate = useNavigate()
    const {login} = useAuthContext()
    interface loginFields{
        email: string,
        password: string
    }

    const initialValues: loginFields = {
        email: '',
        password: ''
    }
    const findUserByEmail = (email: string) => users.find(user => user.email === email)
    const validationSchema = Yup.object({
        email: Yup.string()
               .email('invalid email')
               .test('exists', "incorrect email" , (value)=> {
                    //check if email (value) is used either by admin or student or instructor (auth)
                    return value !== undefined && findUserByEmail(value) !== undefined
                })
               .required('email is required'),
        password: Yup.string()
                  .test('isCorrect', 'incorrect password', function(value){
                    const {email} = this.parent
                    const user = findUserByEmail(email)
                    return user && user.password === value
                  })
                  .required('password is required')
    })

    const handleSubmit = useCallback((values: loginFields)=> {
        login(values.email)
        navigate('/')
    }, [login, navigate])

    const [showPassword, togglePassword] = useClick(false)

    return(
        <Container maxWidth="xs" sx={{display:'grid', minHeight:'90vh', alignContent:'center'}}>
            <Box sx={{p: 4, boxShadow: 3, width: '100%'}}>
                <Typography color='primary' variant='h5' fontWeight="fontWeightBold" marginBottom={3}>Log in</Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({touched, errors, handleBlur, handleChange}) => (
                        <Form>
                            <Grid container spacing={2} direction={'column'}>
                                <TextField
                                    name='email'
                                    label="Email"
                                    aria-label='email feild'
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={Boolean(Object.keys(errors)[0] == 'email' && touched.email && errors.email)}
                                    helperText={Boolean(Object.keys(errors)[0] == 'email' && touched.email && errors.email)? errors.email : ''}
                                />
                                <TextField
                                    type={`${showPassword === false ? 'password' : 'text'}`}
                                    name='password'
                                    label="Password"
                                    aria-label='password field'
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={Boolean(Object.keys(errors)[0] == 'password' && touched.password && errors.password)}
                                    helperText={Boolean(Object.keys(errors)[0] == 'password' && touched.password && errors.password)? errors.password : ''}
                                />
                                <Button 
                                    sx={{
                                        position:'relative', 
                                        bottom: '3.7rem',
                                        width: '10%',
                                        left: '16rem'
                                    }}
                                    onClick={togglePassword}
                                >
                                    {showPassword === false ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </Button>
                                <Button 
                                    type='submit' 
                                    variant='contained' 
                                    aria-label='submit login'
                                    disabled={Object.keys(errors).length > 0 ? true : false}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    )
}