import { renderWithProviders } from "../../shared/test-utils";
import Courses from "../../pages/Courses";
import { Dashboard } from "../../pages/Dashboard";
import Enrollments from "../../pages/Enrollments";
import Reports from "../../pages/Reports";
import StudentDetails from "../../pages/StudentDetails";
import Students from "../../pages/Students";
import {screen} from '@testing-library/react'
import React from "react";
import { Role } from "../../types/User";

const pages = [
    {name: 'Courses', Component: Courses},
    {name: 'Dashboard', Component: Dashboard},
    {name: 'Enrollments', Component: Enrollments},
    {name: 'Reports', Component: Reports},
    {name: 'StudentDetails', Component: StudentDetails},
    {name: 'Students', Component: Students}
]

describe('check authorized access to some pages', () =>{
    pages.forEach(({name, Component}) => {
        test(`check authorized access to ${name}`, ()=>{
            renderWithProviders(React.createElement(Component), {userRole: Role.Student})
            expect(screen.getByText(/You don't have access to this page./i)).toBeInTheDocument()
        })
    })
})
