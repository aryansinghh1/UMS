import { useEffect, useState } from "react";
import axios from "axios";

const FacultyDashBoard = () => {
  const [courses, setCourses] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("📚 Fetching faculty courses...");
        const { data } = await axios.get(
          "http://localhost:5000/api/courses/faculty",
          config
        );
        console.log("✅ Courses fetched:", data);
        setCourses(data);
      } catch (error) {
        console.error(
          "❌ Failed to fetch faculty courses:",
          error.response?.data || error.message
        );
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Faculty Portal</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl shadow border"
            >
              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-sm text-gray-500">
                Code: {course.courseCode}
              </p>

              <p className="mt-2 text-gray-600">
                {course.description}
              </p>

              <div className="mt-4">
                <p className="font-semibold text-blue-600">
                  Students Enrolled:{" "}
                  {course.enrolledStudents?.length || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashBoard;