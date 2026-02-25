import { useEffect, useState } from "react";
import axios from "axios";

const StudentEnrollment = () => {
  const [courses, setCourses] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  };

  useEffect(() => {
    const fetchEnrolled = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/courses/my",
        config
      );
      setCourses(data);
    };

    fetchEnrolled();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">No enrolled courses yet.</p>
      )}

      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white p-4 rounded-xl shadow mb-4"
        >
          <h3 className="font-bold">{course.title}</h3>
          <p className="text-sm text-gray-500">
            Code: {course.courseCode}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StudentEnrollment;