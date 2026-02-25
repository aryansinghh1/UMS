import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  GraduationCap,
  User as UserIcon
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Navigation logic based on user role
  const menuItems = {
    admin: [
      { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Manage Users', path: '/admin/users', icon: <Users size={20}/> },
      { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={20}/> },
    ],
    faculty: [
      { name: 'My Dashboard', path: '/faculty-dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Attendance', path: '/faculty/attendance', icon: <ClipboardCheck size={20}/> },
    ],
    student: [
      { name: 'Portal', path: '/student-dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Enrollment', path: '/student/enroll', icon: <GraduationCap size={20}/> },
      { name: 'My Attendance', path: '/student/attendance', icon: <ClipboardCheck size={20}/> },
      { name: 'My Grades', path: '/student/grades', icon: <BookOpen size={20}/> },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <GraduationCap size={24} className="text-white" />
        </div>
        <span className="tracking-tight text-blue-50">UniPortal</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
        {currentMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-blue-200'
            }`}
          >
            <span className={location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Profile & Logout Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {user && (
          <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <UserIcon size={20} className="text-blue-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{user.role}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;