import { useState } from 'react';
import { CreditCard, ChevronDown } from 'lucide-react';

// Price Range Dropdown Component by StarX
const PriceRangeDropdown = ({ filters, setFilters, updateUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isRent = filters.transactionType === 'Rent';

    // Price Options
    const rentOptions = [
        { val: 5000, label: '₹ 5 Thousand' },
        { val: 10000, label: '₹ 10 Thousand' },
        { val: 15000, label: '₹ 15 Thousand' },
        { val: 20000, label: '₹ 20 Thousand' },
        { val: 25000, label: '₹ 25 Thousand' },
        { val: 30000, label: '₹ 30 Thousand' },
        { val: 40000, label: '₹ 40 Thousand' },
        { val: 50000, label: '₹ 50 Thousand' },
        { val: 75000, label: '₹ 75 Thousand' },
        { val: 100000, label: '₹ 1 Lakh' },
    ];

    const sellOptions = [
        { val: 2000000, label: '₹ 20 Lakh' },
        { val: 4000000, label: '₹ 40 Lakh' },
        { val: 6000000, label: '₹ 60 Lakh' },
        { val: 8000000, label: '₹ 80 Lakh' },
        { val: 10000000, label: '₹ 1 Cr' },
        { val: 15000000, label: '₹ 1.5 Cr' },
        { val: 20000000, label: '₹ 2 Cr' },
        { val: 30000000, label: '₹ 3 Cr' },
        { val: 50000000, label: '₹ 5 Cr' },
    ];

    const options = isRent ? rentOptions : sellOptions;

    // Helper to format display value
    const formatPrice = (val) => {
        if (!val) return '';
        if (val >= 10000000) return `₹${val / 10000000} Cr`;
        if (val >= 100000) return `₹${val / 100000} L`;
        if (val >= 1000) return `₹${val / 1000} K`;
        return `₹${val}`;
    };

    const displayText = filters.minPrice || filters.maxPrice
        ? `${formatPrice(filters.minPrice) || 'Min'} - ${formatPrice(filters.maxPrice) || 'Max'}`
        : 'Budget';

    return (
        <div className={`relative ${isOpen ? 'z-30' : 'z-auto'}`}>
            <label className="text-sm font-bold text-slate-700 ml-1">
                Budget
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl flex items-center justify-between transition-all hover:bg-white hover:border-[#D4AF37]/50 text-left ${isOpen ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/10' : 'border-slate-200'}`}
            >
                <span className={filters.minPrice || filters.maxPrice ? "font-medium text-slate-700" : "text-slate-400"}>
                    {displayText}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute z-50 w-[300px] mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-0 transform -translate-x-1/2 left-1/2 md:translate-x-0 md:left-auto md:right-0">
                        <div className="flex border-b border-gray-100 bg-gray-50">
                            <div className="flex-1 p-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r">Min</div>
                            <div className="flex-1 p-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Max</div>
                        </div>
                        <div className="flex max-h-64">
                            {/* Min Column */}
                            <div className="flex-1 overflow-y-auto border-r border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!filters.minPrice ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'}`}
                                >
                                    Min
                                </button>
                                {options.map(opt => (
                                    <button
                                        key={`min-${opt.val}`}
                                        type="button"
                                        onClick={() => setFilters(prev => ({ ...prev, minPrice: opt.val }))}
                                        disabled={filters.maxPrice && opt.val >= filters.maxPrice} // Disable if > max
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${Number(filters.minPrice) === opt.val ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'} disabled:opacity-30 disabled:cursor-not-allowed`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Max Column */}
                            <div className="flex-1 overflow-y-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, maxPrice: '' }));
                                        setIsOpen(false);
                                        if (updateUrl) setTimeout(updateUrl, 100);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!filters.maxPrice ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'}`}
                                >
                                    Max
                                </button>
                                {options.map(opt => (
                                    <button
                                        key={`max-${opt.val}`}
                                        type="button"
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, maxPrice: opt.val }));
                                            setIsOpen(false);
                                            if (updateUrl) setTimeout(updateUrl, 100);
                                        }}
                                        disabled={filters.minPrice && opt.val <= filters.minPrice} // Disable if < min
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${Number(filters.maxPrice) === opt.val ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'} disabled:opacity-30 disabled:cursor-not-allowed`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PriceRangeDropdown;
