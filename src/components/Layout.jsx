import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/UseAuth";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  Pill,
  LogOut,
  Activity,
  Menu,
  X,
} from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/doctors", label: "Doctors", icon: Users },
    { path: "/documents", label: "Documents", icon: FileText },
    { path: "/visits", label: "Visit History", icon: ClipboardList },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/pharmacy", label: "AI Pharmacy", icon: Pill },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Activity className="w-7 h-7 text-amber-500" />
              <h1 className="text-xl font-bold tracking-wide">HealthSync</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-amber-500 text-white shadow"
                        : "text-gray-200 hover:bg-amber-500/20 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side - User Info + Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-300">Logged in as</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-red-400 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-200 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <nav className="flex flex-col px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-amber-500 text-white shadow"
                        : "text-gray-300 hover:bg-amber-500/20 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-blue-700 pt-3 mt-2 flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xs text-gray-400">Logged in as</p>
                  <p>{user?.name}</p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center w-full px-1 py-2 mt-3 space-x-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 rounded-md transition-all duration-200"
                >
                  <LogOut className="w-7  h-7" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
