//instructor & admin have the same schema
//but student has additional prop -> profileURL
export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
    phone: string
}

export enum Role{
    Admin = "Admin",
    Instructor = "Instructor",
    Student = "Student",
    Guest = "Guest"
}