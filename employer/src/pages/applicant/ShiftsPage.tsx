import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Clock,
  MapPin,
  DollarSign,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { shiftsApi } from '@/api/shifts';
import type { Shift } from '@/types';

export function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filters = [
    { id: 'all', label: 'All Shifts' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchShifts();
  }, [activeFilter, pagination.currentPage]);

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      const params: { status?: string; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }
      
      const response = await shiftsApi.getApplicantShifts(params);
      setShifts(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (shiftId: string) => {
    setIsProcessing(true);
    try {
      await shiftsApi.confirm(shiftId);
      fetchShifts();
    } catch (error) {
      console.error('Failed to confirm shift:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedShift) return;
    
    setIsProcessing(true);
    try {
      await shiftsApi.cancel(selectedShift._id, cancellationReason);
      setShowCancelModal(false);
      setSelectedShift(null);
      setCancellationReason('');
      fetchShifts();
    } catch (error) {
      console.error('Failed to cancel shift:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-50 text-blue-700',
      confirmed: 'bg-forest-50 text-forest-800',
      'in-progress': 'bg-yellow-50 text-yellow-700',
      completed: 'bg-purple-50 text-purple-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">My Shifts</h1>
        <p className="text-gray-500">View and manage your scheduled shifts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-forest-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : shifts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shifts found</h3>
          <p className="text-gray-500 mb-4">
            {activeFilter === 'all' 
              ? 'You don\'t have any shifts scheduled yet' 
              : `No ${activeFilter} shifts found`}
          </p>
          {activeFilter === 'all' && (
            <NavLink
              to="/jobs"
              className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
            >
              Browse Jobs
            </NavLink>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div key={shift._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                        <span className="text-forest-700 font-bold">
                          {shift.employer.storeName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{shift.job.title}</h3>
                        <p className="text-sm text-gray-500">{shift.employer.storeName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(shift.status)}`}>
                      {shift.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(shift.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{shift.location}</span>
                    </div>
                    {shift.paymentAmount && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span>₹{shift.paymentAmount}</span>
                      </div>
                    )}
                  </div>

                  {shift.instructions && (
                    <div className="p-3 bg-[#F5F5ED] rounded-xl text-sm text-gray-600 mb-4">
                      <strong>Instructions:</strong> {shift.instructions}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {shift.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedShift(shift);
                          setShowCancelModal(true);
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirm(shift._id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    </>
                  )}
                  {(shift.status === 'confirmed' || shift.status === 'in-progress') && (
                    <NavLink
                      to={`/shifts/${shift._id}`}
                      className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                    >
                      View Details
                    </NavLink>
                  )}
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

      {/* Cancel Modal */}
      {showCancelModal && selectedShift && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Cancel Shift</h2>
              <button onClick={() => setShowCancelModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-orange-500" />
              <p className="text-center text-gray-600">
                Are you sure you want to cancel this shift on {formatDate(selectedShift.date)}?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Tell the employer why you're cancelling..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellationReason('');
                    setSelectedShift(null);
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Keep Shift
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Cancel Shift'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
