import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import Meta from '../components/Meta';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export default function Blog() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <Meta
                title="Real Estate Insights & Guides"
                description="Expert analysis, investment guides, and market trends for Ghaziabad real estate. Read our case studies and tips."
                keywords="Real Estate Blog, Property Investment Guide, Ghaziabad Property Market, Real Estate Tips"
            />

            {/* Hero Section */}
            <div className="bg-[#D4AF37] text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Insights</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        Expert perspectives on the real estate market, investment strategies, and property trends in Ghaziabad.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
                            <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden h-56">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-white/90 backdrop-blur-sm text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" /> {post.author}
                                    </span>
                                </div>

                                <Link to={`/blog/${post.slug}`} className="block mb-3">
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                </Link>

                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto">
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-[#D4AF37] font-bold hover:gap-3 transition-all"
                                    >
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
