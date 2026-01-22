import { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function Career() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/api/jobs');
                setJobs(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Build the future of real estate with StarX. We're looking for passionate individuals to help us revolutionize the industry.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Open Positions</h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-700">No Openings Currently</h3>
                            <p className="text-slate-500 mt-2">Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {jobs.map((job) => (
                                <div key={job.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#D4AF37] transition-colors">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-slate-500 text-sm mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" /> {job.department}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" /> {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" /> {job.type}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 line-clamp-2">{job.description}</p>
                                        </div>
                                        <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-semibold hover:bg-[#C5A059] transition-all flex items-center gap-2 shrink-0 shadow-md hover:shadow-[#D4AF37]/30">
                                            Apply Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
