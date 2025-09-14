import arraySlice from "./arraySlice";
import { Student } from "../types/Student";
import jsonStudents from "../shared/getStudents";

const students: Student[] = jsonStudents
const studentsSlice = arraySlice<Student>('students', students)

export const {add, removeByID, editItem} = studentsSlice.actions
export default studentsSlice.reducer