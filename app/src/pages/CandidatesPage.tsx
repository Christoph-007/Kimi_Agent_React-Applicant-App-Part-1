import { NavLink } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { useState } from 'react';

export function CandidatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    const candidates = [
        {
            id: 1,
            name: 'Priya Sharma',
            role: 'Experienced Server',
            location: 'Mumbai, MH',
            experience: '2 years',
            skills: ['Customer Service', 'Point of Sale', 'Teamwork'],
            avatar: 'P',
            jobType: 'Shift',
            category: 'Food Service'
        },
        {
            id: 2,
            name: 'Rahul Kumar',
            role: 'Head Chef',
            location: 'Mumbai, MH',
            experience: '3 years',
            skills: ['Continental', 'Kitchen Mgmt', 'Food safety'],
            avatar: 'R',
            jobType: 'Full-time',
            category: 'Food Service'
        },
        {
            id: 3,
            name: 'Anita Patel',
            role: 'Retail Associate',
            location: 'Bangalore, KA',
            experience: '1 year',
            skills: ['Sales', 'Inventory', 'Merchandising'],
            avatar: 'A',
            jobType: 'Part-time',
            category: 'Retail'
        }
    ];

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLocation = !locationFilter || candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesCategory = categoryFilter === 'All Categories' || candidate.category === categoryFilter;

        return matchesSearch && matchesLocation && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <NavLink to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-forest-900 font-bold text-sm">S</span>
                            </div>
                            <span className="font-semibold text-lg text-white">ShiftMaster</span>
                        </NavLink>
                        <div className="flex items-center gap-4">
                            <NavLink to="/login" className="text-white hover:text-lime transition-colors">Sign In</NavLink>
                            <NavLink to="/signup/employer" className="bg-lime text-forest-900 px-5 py-2 rounded-full font-medium hover:bg-lime-400 transition-colors">
                                Hire Now
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-forest-900 mb-4">Find Top Talent for Your Business</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Browse through our pool of skilled professionals ready to jump into your next shift.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="City or State"
                                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500"
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Category</label>
                                        <select
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            <option>All Categories</option>
                                            <option>Food Service</option>
                                            <option>Retail</option>
                                            <option>Logistics</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-forest-900 rounded-2xl p-6 text-white shadow-lg">
                                <h4 className="font-bold mb-3 text-lg">Are you an Employer?</h4>
                                <p className="text-gray-300 text-sm mb-6">
                                    Post jobs, manage shifts, and contact candidates directly.
                                </p>
                                <NavLink to="/signup/employer" className="block w-full py-3 bg-lime text-forest-900 text-center rounded-xl font-bold hover:bg-lime-400 transition-colors">
                                    Get Started
                                </NavLink>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, skills or keywords..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-forest-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredCandidates.map(candidate => (
                                    <div key={candidate.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center text-xl font-bold text-forest-700">
                                                {candidate.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
                                                <p className="text-forest-600 font-medium">{candidate.role}</p>
                                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {candidate.location}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    Experience:
                                                </span>
                                                <span className="text-gray-900 font-medium">{candidate.experience}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skills.map(skill => (
                                                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <NavLink
                                            to={`/signup/employer`}
                                            className="block w-full py-2.5 text-center bg-gray-900 text-white rounded-xl font-medium hover:bg-forest-800 transition-colors"
                                        >
                                            View Profile
                                        </NavLink>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
