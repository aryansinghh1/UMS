import { useEffect, useState } from "react";
import axios from "axios";
import { Search, CheckCircle } from "lucide-react";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  // ✅ FETCH ALL COURSES + ENROLLED COURSES
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all courses
        console.log("📚 Fetching all courses...");
        const resCourses = await axios.get(
          "http://localhost:5000/api/courses",
          config
        );
        console.log("✅ All courses fetched:", resCourses.data.length);
        setCourses(resCourses.data);

        // Get enrolled courses
        console.log("📚 Fetching enrolled courses...");
        const resMyCourses = await axios.get(
          "http://localhost:5000/api/courses/my",
          config
        );
        console.log("✅ Enrolled courses fetched:", resMyCourses.data.length);

        const ids = resMyCourses.data.map((course) => course._id);
        setEnrolledIds(ids);

      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  // 🔍 SEARCH (Frontend filtering)
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎓 ENROLL FUNCTION
  const handleEnroll = async (courseId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        config
      );

      console.log("✅ Enrollment response:", response.data);

      // ✅ Instant UI update
      setEnrolledIds((prev) => [...prev, courseId]);
      alert("Successfully enrolled in the course!");

    } catch (err) {
      console.error("❌ Enrollment error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Student Portal</h1>

      {/* 🔍 Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* 📚 Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course._id);

          return (
            <div
              key={course._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600 uppercase">
                    {course.courseCode}
                  </span>

                  {isEnrolled && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <CheckCircle size={14} /> Joined
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {course.title}
                </h3>

                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="mt-6">
                <button
                  disabled={isEnrolled}
                  onClick={() => handleEnroll(course._id)}
                  className={`w-full py-2.5 rounded-xl font-semibold transition ${
                    isEnrolled
                      ? "bg-green-100 text-green-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {isEnrolled ? "Enrolled" : "Enroll Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;