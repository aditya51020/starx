import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Building2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../axiosConfig';

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    fetchJobs();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/api/properties?limit=100');
      const data = res.data?.data || res.data?.properties || res.data || [];
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setProperties([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const deleteProperty = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/api/admin/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      alert('Property successfully deleted!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete property');
    }
  };

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      alert('Job deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete job');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="w-10 h-10" /> Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-white/20 px-5 py-3 rounded-lg transition font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Properties Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              All Properties
              <span className="text-2xl text-gray-600 ml-3">({properties.length})</span>
            </h2>
          </div>
          <Link
            to="/admin/add"
            className="bg-blue-600 text-white px-7 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <Plus className="w-6 h-6" /> Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Properties Yet</h3>
            <p className="text-xl text-gray-500 mb-8">Start by adding your first property!</p>
            <Link
              to="/admin/add"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
            >
              <Plus className="w-6 h-6" /> Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map(p => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={p.images?.[0] || '/placeholder.jpg'}
                    alt={p.title || 'Property'}
                    className="w-full h-full object-cover"
                  />
                  {p.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {p.title || 'Untitled Property'}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mb-3">
                    ₹{p.price?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {p.region || 'Unknown'} • {p.bhk || '?'} BHK • {p.area || '?'} sqft
                  </p>

                  <div className="flex gap-3">
                    <Link
                      to={`/admin/edit/${p._id}`}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Edit className="w-5 h-5" /> Edit
                    </Link>
                    <button
                      onClick={() => deleteProperty(p._id)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs Section */}
        <div className="mt-20 border-t border-gray-200 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Job Openings
                <span className="text-2xl text-gray-600 ml-3">({jobs.length})</span>
              </h2>
            </div>
            <Link
              to="/admin/add-job"
              className="bg-emerald-600 text-white px-7 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <Plus className="w-6 h-6" /> Post New Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active job postings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.department} • {job.location}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{job.description}</p>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}