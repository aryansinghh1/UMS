import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, RefreshCcw } from 'lucide-react'; // Added RefreshCcw icon

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      });
      
      login(data);

      if (data.role === 'admin') navigate('/admin-dashboard');
      else if (data.role === 'faculty') navigate('/faculty-dashboard');
      else navigate('/student-dashboard');

    } catch (error) {
      setError(error.response?.data?.message || error.message || "Invalid Credentials");
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
            <LogIn size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Login to your University account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              className="w-full p-3 border rounded-xl outline-blue-500 transition"
              placeholder="name@university.edu"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              {/* Existing mini-link */}
              <Link to="/reset-password" name="reset-password" className="text-xs text-blue-600 hover:underline">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              className="w-full p-3 border rounded-xl outline-blue-500 transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* --- DUAL ACTION FOOTER --- */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account yet? 
              <Link 
                to="/signup" 
                className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition"
              >
                Sign Up
              </Link>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;