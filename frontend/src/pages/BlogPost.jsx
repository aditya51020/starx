import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import Meta from '../components/Meta';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
                <Link to="/blog" className="text-[#D4AF37] hover:underline">Back to Blog</Link>
            </div>
        );
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <Meta
                title={post.title}
                description={post.excerpt}
                image={post.image}
                type="article"
            />

            <article className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to Articles
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-[#FFFDF0] text-[#D4AF37] px-3 py-1 rounded-full text-sm font-bold border border-[#FDEebb]">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-gray-100 py-6">
                        <div className="flex items-center gap-6 text-gray-600">
                            <span className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                                    <p className="text-xs">Author</p>
                                </div>
                            </span>
                            <span className="h-8 w-px bg-gray-200"></span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{post.date}</p>
                                    <p className="text-xs">Published</p>
                                </div>
                            </span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                            title="Copy Link"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#D4AF37] prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Call to Action */}
                <div className="mt-16 bg-[#FFFDF0] p-8 rounded-2xl border border-[#FDEebb] text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Looking for a property in Ghaziabad?</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">Let our experts help you find the best deals in Indirapuram, Vasundhara, and more.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/properties" className="bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#C5A059] transition shadow-lg">
                            Browse Properties
                        </Link>
                        <Link to="/contact" className="bg-white text-[#D4AF37] border-2 border-[#D4AF37] px-8 py-3 rounded-xl font-bold hover:bg-[#FFFDF0] transition">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
