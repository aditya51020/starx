import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompareFloat() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 z-[999] border border-gray-100 w-full max-w-3xl mx-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto">
                        <span className="font-bold text-gray-700 whitespace-nowrap">
                            Compare ({compareList.length}/3)
                        </span>
                        <div className="flex items-center gap-3">
                            {compareList.map((property) => (
                                <div key={property.id} className="relative group">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={property.images?.[0]}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeFromCompare(property.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <button
                            onClick={clearCompare}
                            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Clear
                        </button>
                        <Link
                            to="/compare"
                            className={`flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#C5A059] transition shadow-lg ${compareList.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Compare Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
