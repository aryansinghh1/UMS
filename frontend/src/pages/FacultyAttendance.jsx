import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const FacultyAttendance = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    const fetchCourses = async () => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/faculty/courses",
        config
      );

      setCourses(data);
    };

    fetchCourses();
  }, [user?.token]);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchStudents = async () => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/courses/${selectedCourse}/students`,
        config
      );

      setStudents(data);

      const initial = {};
      data.forEach((s) => (initial[s._id] = "present"));
      setAttendance(initial);
    };

    fetchStudents();
  }, [selectedCourse]);

  const toggleStatus = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const records = Object.keys(attendance).map((id) => ({
        studentId: id,
        status: attendance[id],
      }));

      await axios.post(
        "http://localhost:5000/api/attendance/mark",
        {
          courseId: selectedCourse,
          records,
        },
        config
      );

      setMessage("Attendance saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Error saving attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.courseCode} - {course.title}
          </option>
        ))}
      </select>

      {students.map((student) => (
        <div
          key={student._id}
          className="flex justify-between items-center border-b py-2"
        >
          <span>{student.name}</span>

          <button
            onClick={() => toggleStatus(student._id)}
            className={`px-4 py-1 rounded ${
              attendance[student._id] === "present"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {attendance[student._id]}
          </button>
        </div>
      ))}

      {students.length > 0 && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default FacultyAttendance;