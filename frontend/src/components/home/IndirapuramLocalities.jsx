import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IndirapuramLocalities() {
    const localities = [
        {
            name: 'Nyay Khand',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
            trend: '+12%',
            demand: 'High',
            avgPrice: '65L'
        },
        {
            name: 'Ahinsa Khand',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            trend: '+15%',
            demand: 'Very High',
            avgPrice: '75L'
        },
        {
            name: 'Vaibhav Khand',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            trend: '+10%',
            demand: 'Medium',
            avgPrice: '80L'
        },
        {
            name: 'Shipra Suncity',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            trend: '+8%',
            demand: 'High',
            avgPrice: '90L'
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1.5 rounded-full mb-4">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Top Localities</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Indirapuram Neighborhoods</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">Discover premium living spaces across the most sought-after localities in Indirapuram.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {localities.map((area, index) => (
                        <motion.div
                            key={area.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/properties?region=${encodeURIComponent(area.name)}`}
                                className="group relative h-[400px] block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <img
                                    src={area.image}
                                    alt={area.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                                {/* Price Trend Badge */}
                                <div className="absolute top-4 right-4 bg-[#D4AF37]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg transform group-hover:scale-105 transition-transform">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {area.trend}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold mb-1">{area.name}</h3>
                                    <p className="text-sm text-slate-300 mb-4">{area.demand} Demand</p>

                                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider">Avg. Price</p>
                                            <p className="text-lg font-bold">{area.avgPrice}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
