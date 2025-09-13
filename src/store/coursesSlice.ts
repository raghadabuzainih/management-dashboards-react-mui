import { Course } from "../types/Course";
import courses from '../data/courses.json'
import arraySlice from "./arraySlice";

const coursesSlice = arraySlice<Course>('courses', courses)
export const {add, removeByID, editItem} = coursesSlice.actions
export default coursesSlice.reducer