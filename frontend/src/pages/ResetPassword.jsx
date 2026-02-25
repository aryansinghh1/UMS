import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");

    try {
      await axios.put('http://localhost:5000/api/auth/reset-password', { email, newPassword });
      alert("Password Reset Successful!");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Reset Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={18} /> Back to Login
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-3">
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input type="email" placeholder="Verify Email" required className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setEmail(e.target.value)} />
          
          <input type="password" placeholder="New Password" required className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setNewPassword(e.target.value)} />

          <input type="password" placeholder="Confirm New Password" required className="w-full p-3 border rounded-xl outline-blue-500"
            onChange={(e) => setConfirmPassword(e.target.value)} />

          <button className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;