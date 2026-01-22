import { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EMICalculator() {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState(null);

    const calculateEMI = (principal, rate, tenure) => {
        if (!principal || !rate || !tenure) return;

        const monthlyRate = rate / (12 * 100);
        const months = tenure * 12;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        setResult({
            monthlyEMI: Math.round(emi),
            totalAmount: Math.round(emi * months),
            totalInterest: Math.round((emi * months) - principal)
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-white p-4 rounded-full shadow-2xl hover:shadow-[#D4AF37]/50 transition-all"
                        title="EMI Calculator"
                    >
                        <Calculator className="w-6 h-6" />
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="bg-white rounded-3xl shadow-2xl p-6 w-80 border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#FFFDF0] p-2 rounded-lg">
                                    <Calculator className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">EMI Calculator</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setResult(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loan Amount (₹)</label>
                                <input
                                    type="number"
                                    id="loanAmount"
                                    placeholder="50,00,000"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate (%)</label>
                                    <input
                                        type="number"
                                        id="interestRate"
                                        placeholder="8.5"
                                        step="0.1"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Years</label>
                                    <input
                                        type="number"
                                        id="tenure"
                                        placeholder="20"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const amount = parseFloat(document.getElementById('loanAmount').value);
                                    const rate = parseFloat(document.getElementById('interestRate').value);
                                    const years = parseFloat(document.getElementById('tenure').value);
                                    calculateEMI(amount, rate, years);
                                }}
                                className="w-full bg-[#D4AF37] text-white py-3 rounded-xl font-bold hover:bg-[#C5A059] transition shadow-lg hover:shadow-[#D4AF37]/30"
                            >
                                Calculate
                            </button>

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 p-4 bg-[#FFFDF0] rounded-2xl border border-[#D4AF37]/30"
                                >
                                    <p className="text-xs text-[#D4AF37] font-semibold mb-1 uppercase">Monthly EMI</p>
                                    <p className="text-3xl font-bold text-[#D4AF37] mb-3">₹{result.monthlyEMI.toLocaleString('en-IN')}</p>
                                    <div className="space-y-2 text-sm text-gray-600 border-t border-[#D4AF37]/20 pt-3">
                                        <div className="flex justify-between">
                                            <span>Total Amount:</span>
                                            <span className="font-bold">₹{result.totalAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Interest:</span>
                                            <span className="font-bold text-rose-500">₹{result.totalInterest.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
