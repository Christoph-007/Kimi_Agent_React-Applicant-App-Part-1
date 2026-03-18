import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Star,
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  X,
  Edit2,
  CheckCircle
} from 'lucide-react';
import { employerApi } from '@/api/employer';

interface ShortlistItem {
  _id: string;
  applicant: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    skills?: string[];
    experience?: number;
    preferredWorkLocation?: string;
    expectedHourlyRate?: number;
  };
  label?: string;
  notes?: string;
  createdAt: string;
}

const labelOptions = ['Top Pick', 'Follow Up', 'Interviewed', 'Hired', ''];

export function ShortlistPage() {
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const navigate = useNavigate();
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchShortlist();
  }, [pagination.currentPage]);

  const fetchShortlist = async () => {
    try {
      setIsLoading(true);
      const response = await employerApi.getShortlist({
        page: pagination.currentPage,
        limit: 10,
      });
      setShortlist(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch shortlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this applicant from your shortlist?')) return;
    
    try {
      await employerApi.removeFromShortlist(id);
      fetchShortlist();
    } catch (error) {
      console.error('Failed to remove from shortlist:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await employerApi.updateShortlist(id, {
        label: editLabel || undefined,
        notes: editNotes || undefined,
      });
      setEditingItem(null);
      setEditNotes('');
      setEditLabel('');
      fetchShortlist();
    } catch (error) {
      console.error('Failed to update shortlist:', error);
    }
  };

  const startEditing = (item: ShortlistItem) => {
    setEditingItem(item._id);
    setEditNotes(item.notes || '');
    setEditLabel(item.label || '');
  };

  const filteredShortlist = shortlist.filter((item) =>
    item.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.label && item.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">My Shortlist</h1>
          <p className="text-gray-500">Manage your saved candidates</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shortlisted candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredShortlist.length} of {pagination.totalItems} shortlisted
      </div>

      {/* Shortlist */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : filteredShortlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shortlisted candidates</h3>
          <p className="text-gray-500 mb-4">Save candidates you're interested in for quick access</p>
          <NavLink
            to="/employer/applicants"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Browse Applicants
          </NavLink>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShortlist.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center">
                        <span className="text-forest-700 font-bold text-lg">
                          {item.applicant.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{item.applicant.name}</h3>
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </div>
                        {item.label && (
                          <span className="inline-block px-3 py-1 bg-lime-50 text-forest-700 text-xs font-medium rounded-full mt-1">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    {item.applicant.preferredWorkLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.applicant.preferredWorkLocation}
                      </span>
                    )}
                    {item.applicant.expectedHourlyRate && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{item.applicant.expectedHourlyRate}/hr
                      </span>
                    )}
                    {item.applicant.experience !== undefined && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {item.applicant.experience} years exp
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      Saved on {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Edit Notes */}
                  {editingItem === item._id ? (
                    <div className="space-y-3 p-4 bg-[#F5F5ED] rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <select
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                        >
                          <option value="">No Label</option>
                          {labelOptions.filter(l => l).map((label) => (
                            <option key={label} value={label}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add private notes about this candidate..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(item._id)}
                          className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(null);
                            setEditNotes('');
                            setEditLabel('');
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : item.notes ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Notes:</strong> {item.notes}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/employer/applicants/${item.applicant._id}`)}
                    className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/employer/applicants/${item.applicant._id}/request`)}
                    className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Request
                  </button>
                  <button
                    onClick={() => startEditing(item)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Notes
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5ED]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5ED]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
