# UMS - University Management System

A comprehensive web-based platform for managing university operations including user authentication, course management, student enrollment, attendance tracking, and academic record management. Built with React, Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## Features

### Authentication & User Management
- ✅ User registration with auto-generated roll numbers
- ✅ Secure login with JWT token authentication
- ✅ Password reset functionality
- ✅ Role-based access control (Student, Faculty, Admin)

### Course Management
- ✅ Create and manage courses (Admin/Faculty)
- ✅ View all available courses with faculty information
- ✅ Student course enrollment and management
- ✅ View enrolled students in courses
- ✅ Course search functionality

### Academic Features
- ✅ Student profiles with enrolled courses
- ✅ Grade tracking per course per semester
- ✅ CGPA calculation
- ✅ Attendance tracking (present/absent status)
- ✅ Attendance percentage calculation per course

### Role-Based Dashboards
- 📊 **Student Dashboard**: View enrolled courses, grades, and attendance
- 📚 **Faculty Dashboard**: Manage attendance, view enrolled students
- ⚙️ **Admin Dashboard**: Manage users, courses, and system administration

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **Key Libraries**:
  - Mongoose v9.2.1 (MongoDB ODM)
  - jsonwebtoken v9.0.3 (JWT authentication)
  - bcryptjs v3.0.3 (Password hashing)
  - cors v2.8.6 (Cross-origin requests)
  - dotenv v17.3.1 (Environment variables)

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v8.0.0-beta.13
- **Styling**: Tailwind CSS v4.2.1
- **HTTP Client**: Axios v1.13.5
- **Routing**: React Router DOM v7.13.0
- **UI Icons**: Lucide React v0.575.0

### Development Tools
- **Backend**: Nodemon (auto-reload)
- **Frontend**: ESLint

## Project Structure

```
UMS/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, password reset
│   │   ├── courseController.js   # Course management and enrollment
│   │   ├── adminController.js    # Admin operations
│   │   ├── facultyController.js  # Faculty operations
│   │   ├── studentController.js  # Student operations
│   │   └── attendanceController.js # Attendance tracking
│   ├── models/
│   │   ├── User.js               # User schema with roles
│   │   ├── Course.js             # Course schema
│   │   ├── StudentProfile.js     # Student academic profile
│   │   ├── Attendance.js         # Attendance records
│   │   └── Counter.js            # Auto-increment counter
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── proxyMiddleware.js    # External API proxy
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── courseRoutes.js       # Course endpoints
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── facultyRoutes.js      # Faculty endpoints
│   │   └── attendanceRoutes.js   # Attendance endpoints
│   ├── .env                      # Environment variables
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components for each route
│   │   ├── context/              # React Context for state management
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service calls
│   │   ├── App.jsx               # Main routing
│   │   └── main.jsx              # React entry point
│   └── package.json
│
└── .git/                         # Git repository
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env  # or create manually
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Backend Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/UMS
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Required Variables**:
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)

### Frontend Configuration

Update the API base URL in your axios instance or environment file if needed. The default is configured to http://localhost:5000/api.

## Running the Application

### Run Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Run Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar, check your terminal output)

### Run Both (Optional)

You can run both in separate terminal windows or use a tool like `concurrently` for simultaneous execution.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Reset password

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll student in course
- `GET /api/courses/:id/students` - Get enrolled students

### Faculty
- `GET /api/faculty/courses` - Get faculty courses
- `POST /api/faculty/attendance` - Mark attendance
- `GET /api/faculty/attendance/:courseId` - Get attendance records

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/enrollment` - Get enrolled courses
- `GET /api/students/grades` - Get grades

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `POST /api/admin/courses` - Create course

### Attendance
- `POST /api/attendance` - Create attendance record
- `GET /api/attendance/:courseId` - Get attendance for course
- `GET /api/attendance/student/percentage` - Get attendance percentage

## User Roles

The system supports three user roles with corresponding access levels:

| Role | Permissions |
|------|-------------|
| **Student** | View enrolled courses, grades, attendance, enroll in courses |
| **Faculty** | Create courses, mark attendance, view student attendance, manage course enrollment |
| **Admin** | Manage all users, create/edit courses, access all system functions |

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Add your commit message"
```

3. Push to repository:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Push to the branch
5. Open a pull request with a detailed description

## Future Enhancements

- [ ] Email notifications for important events
- [ ] SMS alerts for attendance warnings
- [ ] Export grades to PDF
- [ ] Advanced analytics and reporting
- [ ] Mobile app for students and faculty
- [ ] Real-time notifications using WebSockets
- [ ] Payment gateway integration for fees

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Last Updated**: February 2026
**Author**: Aryan Singh
