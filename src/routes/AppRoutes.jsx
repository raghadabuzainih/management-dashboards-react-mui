import {Routes, Route} from 'react-router-dom'
import { AppBarAndDrawer } from '../components/AppBarAndDrawer'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { lazy,Suspense } from 'react'
const Students = lazy(()=> import('../pages/Students'))
const StudentDetails = lazy(()=> import('../pages/StudentDetails'))
const Courses = lazy(()=> import('../pages/Courses'))
const Enrollments = lazy(()=> import('../pages/Enrollments'))
const Reports = lazy(()=> import('../pages/Reports'))
import { AccessPage } from '../components/AccessPage'
import {Box, CircularProgress} from "@mui/material"

export const AppRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={<AppBarAndDrawer/>}>
                <Route path='login' element={<Login />}/>
                <Route index element={<Dashboard />}/>
                <Route path='students' element={<Suspense fallback={<Box justifySelf={'center'}><CircularProgress /></Box>}><Students /></Suspense>}/>
                <Route path='students/:id' element={<Suspense fallback={<Box justifySelf={'center'}><CircularProgress /></Box>}><StudentDetails /></Suspense>}/>
                <Route path='courses' element={<Suspense fallback={<Box justifySelf={'center'}><CircularProgress /></Box>}><Courses /></Suspense>}/>
                <Route path='enrollments' element={<Suspense fallback={<Box justifySelf={'center'}><CircularProgress /></Box>}><Enrollments /></Suspense>}/>
                <Route path='reports' element={<Suspense fallback={<Box justifySelf={'center'}><CircularProgress /></Box>}><Reports /></Suspense>}/>
                <Route path='*' element={<AccessPage message={'Page Not Found'}/>}/>
            </Route>
        </Routes>
    )
}