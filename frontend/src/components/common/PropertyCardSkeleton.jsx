export default function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-slate-200 relative">
                <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300 rounded-full"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-slate-300 rounded-full"></div>
            </div>

            {/* Content Placeholder */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>

                {/* Price */}
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>

                {/* Divider */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}
