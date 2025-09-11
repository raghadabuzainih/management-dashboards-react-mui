import { UserEmail } from "../types/UserEmail"

export type AuthContextType = {
    userEmail: UserEmail | null,
    login: (email: string) => string | void,
    logout: ()=> void
}