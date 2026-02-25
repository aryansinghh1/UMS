import { useState, useEffect } from "react";
import axios from "axios";
import { BookPlus } from "lucide-react";

const AdminAddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    credits: 3,
    department: "Computer Science",
    faculty: "",
    description: "",
  });

  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/users?role=faculty",
          config
        );
        setFacultyList(data);
      } catch (err) {
        setError("Failed to load faculty list");
      }
    };

    fetchFaculty();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/admin/courses",
        formData,
        config
      );

      alert("Course created successfully!");

      setFormData({
        title: "",
        courseCode: "",
        credits: 3,
        department: "Computer Science",
        faculty: "",
        description: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Course creation failed";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
      <div className="flex items-center gap-3 mb-8">
        <BookPlus className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Create New Course</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title */}
        <div>
          <label className="text-sm font-semibold">
            Course Title
          </label>
          <input
            type="text"
            required
            className="w-full p-2.5 border rounded-lg"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Course Code */}
        <div>
          <label className="text-sm font-semibold">
            Course Code
          </label>
          <input
            type="text"
            required
            className="w-full p-2.5 border rounded-lg"
            value={formData.courseCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                courseCode: e.target.value.toUpperCase(),
              })
            }
          />
        </div>

        {/* Department */}
        <div>
          <label className="text-sm font-semibold">
            Department
          </label>
          <input
            type="text"
            className="w-full p-2.5 border rounded-lg"
            value={formData.department}
            onChange={(e) =>
              setFormData({
                ...formData,
                department: e.target.value,
              })
            }
          />
        </div>

        {/* Faculty */}
        <div>
          <label className="text-sm font-semibold">
            Assign Faculty
          </label>
          <select
            required
            className="w-full p-2.5 border rounded-lg bg-white"
            value={formData.faculty}
            onChange={(e) =>
              setFormData({
                ...formData,
                faculty: e.target.value,
              })
            }
          >
            <option value="">Select Instructor</option>
            {facultyList.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.department})
              </option>
            ))}
          </select>
        </div>

        {/* Credits */}
        <div>
          <label className="text-sm font-semibold">
            Credits
          </label>
          <input
            type="number"
            min="1"
            max="5"
            className="w-full p-2.5 border rounded-lg"
            value={formData.credits}
            onChange={(e) =>
              setFormData({
                ...formData,
                credits: parseInt(e.target.value),
              })
            }
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold">
            Description
          </label>
          <textarea
            rows="3"
            className="w-full p-2.5 border rounded-lg"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Course..." : "Publish Course"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddCourse;