import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student', department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Signup Failed";
      setError(message);
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm">Join the University Portal</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

        <div className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl outline-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-xl outline-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-xl outline-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 border rounded-xl outline-blue-500 bg-white"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <input type="text" placeholder="Department" className="p-3 border rounded-xl outline-blue-500"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>

        </div>

        <button 
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold mt-8 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center text-slate-600 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;













