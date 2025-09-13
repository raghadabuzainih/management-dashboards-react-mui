import { Enrollment } from "../types/Enrollment";
import enrollments from '../data/enrollments.json'
import arraySlice from "./arraySlice";

const enrollmentsSlice = arraySlice<Enrollment>('enrollments', enrollments)
export const {add, removeByID, editItem} = enrollmentsSlice.actions
export default enrollmentsSlice.reducer