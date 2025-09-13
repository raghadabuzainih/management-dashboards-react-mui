import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from './coursesSlice'
import studentsReducer from './studentsSlice'
import enrollmentsReducer from './enrollmentsSlice'

export const store = configureStore({
    reducer: {
        courses: coursesReducer,
        students: studentsReducer,
        enrollments: enrollmentsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch