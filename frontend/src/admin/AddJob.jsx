import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { Loader2, ArrowLeft, Save, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        department: '',
        location: 'Remote',
        type: 'Full-time',
        description: '',
        requirements: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert requirements string to array
            const payload = {
                ...form,
                requirements: form.requirements.split('\n').filter(req => req.trim() !== '')
            };

            await api.post('/api/jobs', payload);
            toast.success('Job posted successfully!');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Failed to post job:', err);
            toast.error('Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-[#D4AF37] hover:bg-white rounded-xl transition"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                            <div className="w-16 h-16 bg-[#FFFDF0] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                                <p className="text-gray-500">Enter the information for the new position</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                        placeholder="e.g. Senior React Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.department}
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                        placeholder="e.g. Remote, Noida"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Employment Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                    placeholder="Describe the role and responsibilities..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Requirements (One per line)</label>
                                <textarea
                                    rows="4"
                                    value={form.requirements}
                                    onChange={e => setForm({ ...form, requirements: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
                                    placeholder="- 3+ years of experience&#10;- Knowledge of React&#10;- Good communication skills"
                                ></textarea>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#C5A059] transition shadow-lg hover:shadow-[#D4AF37]/30 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Post Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
