import { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("student");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  const fetchUsers = async (role) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/admin/users?role=${role}`,
        config
      );
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // ✅ CREATE USER
  const handleCreateUser = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/users",
        formData,
        config
      );

      setUsers((prev) => [data, ...prev]);
      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: activeTab,
        department: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  // ✅ DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        config
      );

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  // ✅ CHANGE ROLE
  const handleRoleChange = async (id, newRole) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/users/${id}/role`,
        { role: newRole },
        config
      );

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? data : user))
      );
    } catch (error) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("student")}
          className={`px-4 py-2 rounded ${
            activeTab === "student"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setActiveTab("faculty")}
          className={`px-4 py-2 rounded ${
            activeTab === "faculty"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Faculty
        </button>
      </div>

      {/* Add User Button */}
      <button
        onClick={() => {
          setFormData({ ...formData, role: activeTab });
          setShowForm(!showForm);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        {showForm ? "Cancel" : "Add User"}
      </button>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-gray-100 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Department"
            className="border p-2 rounded"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />

          <button
            onClick={handleCreateUser}
            className="bg-blue-600 text-white py-2 rounded col-span-full"
          >
            Save User
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.department || "-"}</td>

                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;