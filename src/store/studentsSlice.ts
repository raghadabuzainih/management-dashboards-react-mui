import arraySlice from "./arraySlice";
import { Role, User } from "../types/User";
import { Student } from "../types/Student";
import users from '../data/users.json'

const students: Student[] = users.filter(({role}) => role === Role.Student) as Student[]
const studentsSlice = arraySlice<Student>('students', students)

export const {add, removeByID, editItem} = studentsSlice.actions
export default studentsSlice.reducer