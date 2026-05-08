import { motion } from 'framer-motion';
import { Train, Stethoscope, GraduationCap, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';

export default function TrustSection() {
    const highlights = [
        {
            icon: Train,
            title: "Metro Connectivity",
            desc: "Minutes away from Vaishali and Noida Electronic City Metro Stations."
        },
        {
            icon: GraduationCap,
            title: "Top Schools",
            desc: "Close proximity to DPS, St. Thomas, and Presidium School."
        },
        {
            icon: Stethoscope,
            title: "Premium Healthcare",
            desc: "Easy access to Max Hospital, Fortis, and Shanti Gopal Hospital."
        },
        {
            icon: TrendingUp,
            title: "High Appreciation",
            desc: "Consistent 10-15% annual property value appreciation."
        }
    ];

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -ml-10 -mb-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-[#D4AF37]" />
                            <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">Why Invest Here?</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            The Heart of NCR:<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                                Indirapuram
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                            Indirapuram stands as the most sought-after residential hub in Ghaziabad, offering the perfect blend of modern lifestyle, seamless connectivity, and exceptional return on investment.
                        </p>
                        
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit">
                            <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-6 h-6 text-slate-900" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">Safest Investment</p>
                                <p className="text-slate-400 text-sm">Consistent high rental yields</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {highlights.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-[#D4AF37]/50 transition-all group hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
