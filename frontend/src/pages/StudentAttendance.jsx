import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!user?.token) return;

    const fetchAttendance = async () => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/attendance/my",
        config
      );

      setRecords(data);

      let present = 0;
      let absent = 0;

      data.forEach((r) => {
        if (r.status === "present") present++;
        else absent++;
      });

      const total = present + absent;
      const percentage =
        total > 0 ? ((present / total) * 100).toFixed(2) : 0;

      setStats({ present, absent, percentage });
    };

    fetchAttendance();
  }, [user?.token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

      <div className="mb-6">
        <p>Present: {stats.present}</p>
        <p>Absent: {stats.absent}</p>
        <p>Percentage: {stats.percentage}%</p>
      </div>

      {records.map((record) => (
        <div key={record._id} className="border-b py-2">
          <p>
            {record.course?.title} -{" "}
            {new Date(record.date).toLocaleDateString()}
          </p>
          <p
            className={
              record.status === "present"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {record.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StudentAttendance;