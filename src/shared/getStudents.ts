import users from '../data/users.json'
import { Student } from '../types/Student'
import { User, Role } from '../types/User'

const allUsers: User[] = users as User[]

const jsonStudents = users.filter(({role}) => role === Role.Student) as Student[]

export default jsonStudents