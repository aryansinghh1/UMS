import { useEffect, useState } from "react";
import axios from "axios";

const AdminDash = () => {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    totalEnrollments: 0,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats",
          config
        );
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Students</h2>
          <p className="text-2xl font-bold text-blue-600">
            {stats.students}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Faculty</h2>
          <p className="text-2xl font-bold text-green-600">
            {stats.faculty}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Courses</h2>
          <p className="text-2xl font-bold text-purple-600">
            {stats.courses}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">
            Total Enrollments
          </h2>
          <p className="text-2xl font-bold text-orange-600">
            {stats.totalEnrollments}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4 flex-wrap">
          <a
            href="/admin/users"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Users
          </a>

          <a
            href="/admin/courses"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Course
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;