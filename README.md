# Student Management Dashboard (React + MUI)

## Overview
The dashboard allows management of students, courses, enrollments, and displays analytics using charts, all within a responsive and user-friendly interface.

---

## Features

### Authentication & Session Management
- Role-based access: **Admin / Instructor / Student**.  
- **AuthContext + AuthProvider** handle authentication.  
- User session is stored for **3 hours**, after which the user is automatically logged out.  
- **Protected Routes** ensure only authenticated users can access specific pages.  

### Local Storage Integration
- All data (**Students, Courses, Enrollments**) is persisted in **Local Storage**, keeping data available after page refresh.  

### Students Management
- Students are displayed using **MUI DataGrid** for better UI and performance.  
- Full CRUD operations: Create, Read, Update, Delete.  
- Validation applied with **Formik + Yup**.  
- Relational handling: deleting a student automatically removes their enrollments. //relations point didn't limit on students table only

### Courses Management
- Courses displayed in **Accordion** with details (description, instructor, hours).  
- Full CRUD functionality with validation.  
- Can assign instructors and enroll students.  

### Enrollment Management
- Enroll/unenroll students in courses.  
- Update student progress (0–100%).  
- Relational integrity maintained between students, courses, and enrollments.  

### Reports & Analytics
- Designed **Pie** and **Bar charts** using **Chart.js**.  
- Visual insights: number of students per course, number of courses per instructor, enrollment distribution.

### Theme
- Light/Dark theme toggle button in **AppBar**.  
- Theme preference saved in Local Storage.  
- Responsive layout for desktop and mobile.  

### Routing & Lazy Loading
- Navigation handled with **React Router v6**.  
- **Lazy Loading** used for page components with `React.lazy` and `Suspense`.  
- Protected Routes restrict access to authenticated users.  

### Feedback & Validation
- Used **Formik + Yup** for input validation.  
- Success/Failure feedback is shown to users with **MUI Snackbar + Alert** after operations such as:  
  - Adding.  
  - Deleting.  
  - Editing.  

---

## Tech Stack
- **React 18**  
- **Material UI v6 (MUI)**  
- **React Router v6**  
- **Formik + Yup** for form handling and validation  
- **Chart.js / MUI X-Charts** for charts  
- **LocalStorage** for data persistence  

---
### Project Screenshots: 

Login page:

<img width="1920" height="908" alt="2025-08-30" src="https://github.com/user-attachments/assets/2a169668-973a-4622-8d5f-d91cf2250509" />

I'll change theme & login as admin:

<img width="1920" height="920" alt="2025-08-30 (2)" src="https://github.com/user-attachments/assets/01470d67-c832-4202-8bb8-dc3254ac4b0f" />

Dashboard page:

<img width="1920" height="910" alt="2025-08-30 (3)" src="https://github.com/user-attachments/assets/fb8f33f1-d014-4d24-b7d9-cace2afc0879" />

Drawer item:

<img width="1920" height="903" alt="2025-08-30 (4)" src="https://github.com/user-attachments/assets/c51aa134-40a3-4310-8a0f-bc481fc2a4c3" />

Students page & I clicked to show the first profile:

<img width="1920" height="908" alt="2025-08-30 (5)" src="https://github.com/user-attachments/assets/fc4d32ab-b5e5-40c9-bb96-ccd946feb8e7" />

<img width="1920" height="898" alt="2025-08-30 (6)" src="https://github.com/user-attachments/assets/142cacd4-9ffd-4b94-9b90-205fffbf5159" />

Edit & add forms:

<img width="1920" height="906" alt="2025-08-30 (7)" src="https://github.com/user-attachments/assets/204830a7-b434-461f-9a6d-17d47e58db75" />

<img width="1920" height="913" alt="2025-08-30 (9)" src="https://github.com/user-attachments/assets/cdf7f092-eddf-4583-bb98-81cb6760c489" />

pressed save before filled all the fields & this showed for me error:

<img width="1920" height="916" alt="2025-08-30 (8)" src="https://github.com/user-attachments/assets/f8c2c839-3966-44b5-a426-76e1a1ab7fe8" />

Courses page:

<img width="1920" height="921" alt="2025-08-30 (10)" src="https://github.com/user-attachments/assets/09c67eb7-4cb5-4e23-a26b-5be0c70528e5" />

<img width="1920" height="904" alt="2025-08-30 (11)" src="https://github.com/user-attachments/assets/d82f2945-d4d2-49b2-9f6c-0d9ef39d2aad" />

Enrollments page, operations & success/fail messages:

<img width="1920" height="922" alt="2025-08-30 (12)" src="https://github.com/user-attachments/assets/2fef9aba-277e-42fd-bef5-39f6efc6c699" />

<img width="1920" height="931" alt="2025-08-30 (13)" src="https://github.com/user-attachments/assets/eb4ace54-ad5f-407c-be9f-13b87af811a1" />

<img width="1920" height="919" alt="2025-08-30 (14)" src="https://github.com/user-attachments/assets/29b39fef-3c2f-4541-8f17-b658c76cae37" />

<img width="1920" height="914" alt="2025-08-30 (15)" src="https://github.com/user-attachments/assets/4c27ffd1-0f51-4ce8-b623-728af66ebb1f" />

<img width="1920" height="921" alt="2025-08-30 (16)" src="https://github.com/user-attachments/assets/720a93cd-0dd5-4bdc-bc5d-75444eae35c7" />

<img width="1920" height="924" alt="2025-08-30 (17)" src="https://github.com/user-attachments/assets/5fdafb02-2d48-4e57-93bf-8b70173f7c4e" />

<img width="1920" height="918" alt="2025-08-30 (18)" src="https://github.com/user-attachments/assets/f0b4840d-13fa-4507-aed9-2456a5f35382" />

Reports page:

<img width="1920" height="916" alt="2025-08-30 (19)" src="https://github.com/user-attachments/assets/4b3daa6e-ce16-405f-b09d-126ae325d31d" />

<img width="1920" height="888" alt="2025-08-30 (20)" src="https://github.com/user-attachments/assets/e4a410dd-fa31-45d5-bd34-385559ba34bb" />

Responsive(some screenshots):

<img width="632" height="903" alt="2025-08-30 (22)" src="https://github.com/user-attachments/assets/e884dee0-1b81-473d-a5e3-85a039f10428" />

<img width="632" height="916" alt="2025-08-30 (21)" src="https://github.com/user-attachments/assets/a0427d68-ce19-4b52-9a93-7d483f5999cf" />
