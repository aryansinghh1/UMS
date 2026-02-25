import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import StudentDashboard from "./pages/StudentDashBoard";
import StudentAttendance from "./pages/StudentAttendance";
import StudentEnrollment from "./pages/StudentEnrollment";
import FacultyAttendance from "./pages/FacultyAttendance";

import AdminAddCourse from "./pages/AdminAddCourse";
import ManageUsers from "./pages/ManageUsers";
import AdminDash from "./pages/AdminDashboard";
import FacultyDashBoard from "./pages/FacultyDashBoard";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={
                user.role === "admin"
                  ? "/admin-dashboard"
                  : user.role === "faculty"
                  ? "/faculty-dashboard"
                  : "/student-dashboard"
              }
              replace
            />
          )
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔒 Shared Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["student", "faculty", "admin"]} />
        }
      >
        <Route element={<Layout />}>

          {/* 🎓 Student Routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/enroll" element={<StudentEnrollment />} />
          <Route path="/student/grades" element={<div className="p-8 text-2xl font-bold">My Academic Grades</div>} />
          <Route path="/student/attendance" element={<StudentAttendance />} />

          {/* 👨‍🏫 Faculty Routes */}
          <Route path="/faculty-dashboard" element={<FacultyDashBoard />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route
            path="/faculty/attendance/:courseId"
            element={<FacultyAttendance />}
          />
        </Route>
      </Route>

      {/* 🔒 Admin Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route path="/admin-dashboard" element={<AdminDash />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/courses" element={<AdminAddCourse />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;