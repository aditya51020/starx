import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationCards({ locationData }) {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Explore by Location</h2>
                    <p className="text-xl text-slate-600">Find properties in the most popular neighborhoods</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {locationData.map((area, index) => (
                        <motion.div
                            key={area.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/properties?region=${area.name}`}
                                className="group relative h-[450px] block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                            >
                                <img
                                    src={area.image}
                                    alt={area.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                                {/* Price Trend Badge */}
                                <div className="absolute top-6 right-6 bg-[#D4AF37]/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg transform group-hover:scale-105 transition-transform">
                                    <ArrowUpRight className="w-4 h-4" />
                                    {area.trend}
                                </div>

                                {/* Demand Badge */}
                                <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">
                                    {area.demand} Demand
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-4xl font-bold mb-3">{area.name}</h3>
                                    <p className="text-lg text-slate-300 mb-6">{area.count} Properties Available</p>

                                    <div className="flex items-center justify-between border-t border-white/20 pt-6">
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1">Avg. Price</p>
                                            <p className="text-2xl font-bold">{area.avgPrice}</p>
                                        </div>
                                        <div className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D4AF37] hover:text-white transition-colors">
                                            View All
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
