import { Role } from "./User"

export interface UserEmail{
    value: string,
    expiry: number,
    role: Role
}