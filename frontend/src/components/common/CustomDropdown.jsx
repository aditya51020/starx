import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = "Select...",
    icon: Icon
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Get display label for current value
    const getDisplayLabel = () => {
        if (!value) return placeholder;
        const selected = options.find(opt =>
            (typeof opt === 'object' ? opt.value : opt) === value
        );
        return selected ? (typeof selected === 'object' ? selected.label : selected) : placeholder;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${isOpen ? 'z-30' : 'z-auto'}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl flex items-center justify-between transition-all hover:bg-white hover:border-[#D4AF37]/50 text-left ${isOpen ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/10' : 'border-slate-200'
                    }`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                    <span className={`block truncate ${!value ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                        {getDisplayLabel()}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                    >
                        {options.map((option, idx) => {
                            const optValue = typeof option === 'object' ? option.value : option;
                            const optLabel = typeof option === 'object' ? option.label : option;
                            const isSelected = optValue === value;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        onChange(optValue);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-[#FFFDF0] text-[#D4AF37] font-medium' : 'text-slate-600'
                                        }`}
                                >
                                    <span className={`truncate ${isSelected ? 'text-[#D4AF37]' : 'group-hover:text-slate-900'}`}>
                                        {optLabel}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
