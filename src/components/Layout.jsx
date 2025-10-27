import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  ClipboardList,
  Pill,
  LogOut,
  Activity
} from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctors', label: 'Doctors', icon: Users },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/visits', label: 'Visit History', icon: ClipboardList },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/pharmacy', label: 'AI Pharmacy', icon: Pill },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-amber-500/20">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold">HealthSync</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-amber-500/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-amber-500/20">
          <div className="mb-3 px-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold text-white truncate">{user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
