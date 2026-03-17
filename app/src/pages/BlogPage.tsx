import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function BlogPage() {
    const posts = [
        {
            id: 1,
            title: 'How to Land Your First Shift Job',
            excerpt: 'Learn the best tips and tricks to get hired quickly in the shift-based economy.',
            date: 'Oct 12, 2023',
            author: 'Team ShiftMatch'
        },
        {
            id: 2,
            title: 'The Future of Flexible Work',
            excerpt: 'Discover why more and more people are choosing flexible work over traditional 9-to-5s.',
            date: 'Oct 15, 2023',
            author: 'Justeena Santy'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <NavLink to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-forest-900 font-bold text-sm">S</span>
                            </div>
                            <span className="font-semibold text-lg text-white">ShiftMatch</span>
                        </NavLink>
                        <NavLink to="/" className="text-white hover:text-lime transition-colors">Home</NavLink>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-forest-900 mb-4">The ShiftMatch Blog</h1>
                    <p className="text-gray-500 text-lg">Insights, tips, and stories from the frontlines of flexible work.</p>
                </div>

                <div className="space-y-12">
                    {posts.map(post => (
                        <div key={post.id} className="group cursor-pointer">
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                <span>{post.date}</span>
                                <span>By {post.author}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-forest-700 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                            <div className="flex items-center text-forest-700 font-semibold gap-1">
                                Read More
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
