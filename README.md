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

<img width="1920" height="908" alt="2025-08-30" src="https://github.com/user-attachments/assets/76c0b536-4d60-433d-89b8-75dcabcdab1d" />

I'll change theme & login as admin:

<img width="1920" height="920" alt="2025-08-30 (2)" src="https://github.com/user-attachments/assets/157abd53-418b-40f0-9048-fffb5a88c1bd" />

Dashboard page:

<img width="1920" height="910" alt="2025-08-30 (3)" src="https://github.com/user-attachments/assets/8014581f-28b7-41bf-ac33-6bf25ef479c3" />

Drawer item:

<img width="1920" height="903" alt="2025-08-30 (4)" src="https://github.com/user-attachments/assets/b73ac149-a334-4216-8afc-9ef02cdf59d2" />

Students page & I clicked to show the first profile:

<img width="1920" height="908" alt="2025-08-30 (5)" src="https://github.com/user-attachments/assets/1aaa153d-5938-4b9b-90df-53db22ffffc2" />

<img width="1920" height="898" alt="2025-08-30 (6)" src="https://github.com/user-attachments/assets/abb9a191-e6c3-4f09-a0c2-f6da94aef16d" />

Edit & add forms:

<img width="1920" height="906" alt="2025-08-30 (7)" src="https://github.com/user-attachments/assets/4c4e0432-701a-41e9-9307-fd0a6fab03f2" />

<img width="1920" height="913" alt="2025-08-30 (9)" src="https://github.com/user-attachments/assets/1f3673c0-6472-4c90-b020-a7897ae6f7ef" />

pressed save before filled all the fields & this showed for me error:

<img width="1920" height="916" alt="2025-08-30 (8)" src="https://github.com/user-attachments/assets/85d7328e-f9f6-436d-801f-b04425a20422" />

Courses page:

<img width="1920" height="921" alt="2025-08-30 (10)" src="https://github.com/user-attachments/assets/b53d3d0b-010f-46cc-b31a-0d8029f628b9" />

<img width="1920" height="904" alt="2025-08-30 (11)" src="https://github.com/user-attachments/assets/2c3efee7-b41a-4009-a1ee-fe3d614f6e4f" />

Enrollments page & operations:

<img width="1920" height="922" alt="2025-08-30 (12)" src="https://github.com/user-attachments/assets/d42187ab-022d-4f43-96f5-eced3ef7bb5f" />

<img width="1120" height="513" alt="2025-08-30 (24)" src="https://github.com/user-attachments/assets/061c184a-4b03-4987-bf7a-cfe584823e88" />

<img width="1920" height="931" alt="2025-08-30 (13)" src="https://github.com/user-attachments/assets/3d24ff12-663c-46c2-8991-53350d7b1fff" />

<img width="1920" height="919" alt="2025-08-30 (14)" src="https://github.com/user-attachments/assets/b17918d5-53d2-4c5e-bd96-4b944224bc0b" />

<img width="1920" height="914" alt="2025-08-30 (15)" src="https://github.com/user-attachments/assets/a9a785ba-80c9-4290-9654-3ffa252529e6" />

<img width="1920" height="921" alt="2025-08-30 (16)" src="https://github.com/user-attachments/assets/fcf21f59-40ee-4dc1-8613-7bcb28fd9a9e" />

<img width="1920" height="924" alt="2025-08-30 (17)" src="https://github.com/user-attachments/assets/98c8dc46-621b-4968-b406-6b19e9de2792" />

<img width="1920" height="918" alt="2025-08-30 (18)" src="https://github.com/user-attachments/assets/2edb60cc-775e-4194-a1d6-f5e276ef1b16" />

Reports page:

<img width="1920" height="916" alt="2025-08-30 (19)" src="https://github.com/user-attachments/assets/59525338-f9e4-4cfd-a18c-a67cc6e2e0df" />

<img width="1920" height="888" alt="2025-08-30 (20)" src="https://github.com/user-attachments/assets/33547563-2b60-4890-9722-c212a9a5bb51" />

Responsive(some screenshots):

<img width="632" height="903" alt="2025-08-30 (22)" src="https://github.com/user-attachments/assets/39e1643c-1d06-49a7-b88a-f648b8c2e431" />

<img width="632" height="916" alt="2025-08-30 (21)" src="https://github.com/user-attachments/assets/ed16abdc-3aa6-4720-a74d-3f9da7068e28" />

<img width="651" height="892" alt="2025-08-30 (23)" src="https://github.com/user-attachments/assets/ed8c30e5-8b80-4c53-b831-7246cead636d" />
