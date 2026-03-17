import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
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

            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-forest-900 mb-4">Get in Touch</h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Have questions or need support? We're here to help you get the most out of ShiftMatch.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-8">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-forest-700 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email us at</p>
                                            <p className="font-semibold text-gray-900">support@shiftmatch.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-forest-700 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Call us at</p>
                                            <p className="font-semibold text-gray-900">+1 (804) 207-4094</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-forest-700 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Main Office</p>
                                            <p className="font-semibold text-gray-900">Mumbai, Maharashtra, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-8">Send us a Message</h3>
                                <form className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                                            placeholder="Your last name"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-forest-500"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                    <div className="col-span-2">
                                        <button className="w-full py-4 bg-forest-900 text-white rounded-xl font-bold hover:bg-forest-800 transition-colors flex items-center justify-center gap-2">
                                            Send Message
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
