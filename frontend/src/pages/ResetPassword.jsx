import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { KeyRound, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          newPassword,
        }
      );

      alert(response.data.message || "Password Reset Successful!");

      navigate("/login");

    } catch (error) {
      console.log("Reset Error:", error.response?.data);
      alert(error.response?.data?.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={18} /> Back to Login
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-3">
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Reset Password
          </h2>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Verify Email"
            required
            value={email}
            className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            required
            value={newPassword}
            className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            required
            value={confirmPassword}
            className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;