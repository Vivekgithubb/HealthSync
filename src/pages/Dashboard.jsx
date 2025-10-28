import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { appointmentsAPI, visitsAPI, documentsAPI } from '../services/api';
import { Calendar, FileText, ClipboardList, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalVisits: 0,
    totalDocuments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [appointmentsRes, visitsRes, documentsRes] = await Promise.all([
        appointmentsAPI.getUpcoming(),
        visitsAPI.getAll(),
        documentsAPI.getAll(),
      ]);

      setUpcomingAppointments(appointmentsRes.data.slice(0, 3));
      setRecentVisits(visitsRes.data.slice(0, 3));
      
      setStats({
        upcomingAppointments: appointmentsRes.data.length,
        totalVisits: visitsRes.data.length,
        totalDocuments: documentsRes.data.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-blue-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-blue-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's an overview of your health data.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.upcomingAppointments}</p>
            </div>
            <Calendar className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Visits</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalVisits}</p>
            </div>
            <ClipboardList className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Documents</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-12 h-12 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-amber-600 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt._id} className="border-l-4 border-amber-500 pl-4 py-2 bg-gray-50 rounded">
                  <p className="font-semibold text-blue-900">{apt.doctor?.name || 'Unknown Doctor'}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(apt.appointmentDate), 'PPP')} at {apt.appointmentTime}
                  </p>
                  {apt.reason && <p className="text-sm text-gray-500 mt-1">{apt.reason}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Visits */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Recent Visits</h2>
            <Link to="/visits" className="text-amber-600 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          {recentVisits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No visits recorded yet</p>
          ) : (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div key={visit._id} className="border-l-4 border-amber-500 pl-4 py-2 bg-gray-50 rounded">
                  <p className="font-semibold text-blue-900">{visit.doctor?.name || 'Unknown Doctor'}</p>
                  <p className="text-sm text-gray-500">{format(new Date(visit.visitDate), 'PPP')}</p>
                  {visit.reason && <p className="text-sm text-gray-500 mt-1">{visit.reason}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/appointments"
          className="bg-gradient-to-r from-amber-500 to-amber-600/80 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <Calendar className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-bold mb-2">Schedule Appointment</h3>
          <p className="text-white/90">Book your next doctor's visit</p>
        </Link>

        <Link
          to="/documents"
          className="bg-gradient-to-r from-blue-900 to-blue-800/80 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <FileText className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-bold mb-2">Upload Document</h3>
          <p className="text-white/90">Add prescriptions and reports</p>
        </Link>

        <Link
          to="/pharmacy"
          className="bg-gradient-to-r from-amber-500 to-amber-600/80 text-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <TrendingUp className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-bold mb-2">AI Pharmacy</h3>
          <p className="text-white/90">Analyze prescriptions with AI</p>
        </Link>
      </div>
    </div>
  );
}
