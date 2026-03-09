import { useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  X,
  ClipboardList
} from 'lucide-react';
import { shiftsApi } from '@/api/shifts';
import type { Shift } from '@/types';

export function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const filters = [
    { id: 'all', label: 'All Shifts' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const fetchShifts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: { status?: string; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }
      
      const response = await shiftsApi.getEmployerShifts(params);
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
  }, [activeFilter, pagination.currentPage]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const handleCancel = async (shiftId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason === null) return;
    
    try {
      await shiftsApi.cancel(shiftId, reason);
      fetchShifts();
    } catch (error) {
      console.error('Failed to cancel shift:', error);
    }
  };

  const handleDelete = async (shiftId: string) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    
    try {
      await shiftsApi.delete(shiftId);
      fetchShifts();
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-50 text-blue-700',
      confirmed: 'bg-green-50 text-green-700',
      'in-progress': 'bg-yellow-50 text-yellow-700',
      completed: 'bg-purple-50 text-purple-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group shifts by date
  const groupedShifts = shifts.reduce((acc, shift) => {
    const date = shift.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">My Shifts</h1>
          <p className="text-gray-500">Manage scheduled shifts with your workers</p>
        </div>
        <NavLink
          to="/employer/shifts/new"
          className="px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Shift
        </NavLink>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shifts scheduled</h3>
          <p className="text-gray-500 mb-4">Create shifts for your accepted applicants</p>
          <NavLink
            to="/employer/shifts/new"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Create First Shift
          </NavLink>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedShifts).map(([date, dateShifts]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {formatDate(date)}
              </h3>
              <div className="space-y-4">
                {dateShifts.map((shift) => (
                  <div key={shift._id} className="bg-white rounded-2xl p-6 shadow-card">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{shift.job.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{shift.applicant.name}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(shift.status)}`}>
                            {shift.status.replace('-', ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {shift.startTime} - {shift.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {shift.location}
                          </span>
                          {shift.paymentAmount && (
                            <span className="flex items-center gap-1">
                              Payment: ₹{shift.paymentAmount}
                            </span>
                          )}
                        </div>

                        {shift.instructions && (
                          <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                            <strong>Instructions:</strong> {shift.instructions}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/employer/attendance?shift=${shift._id}`)}
                          className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center gap-2"
                        >
                          <ClipboardList className="w-4 h-4" />
                          Attendance
                        </button>
                        {(shift.status === 'scheduled' || shift.status === 'confirmed') && (
                          <>
                            <button
                              onClick={() => navigate(`/employer/shifts/${shift._id}/edit`)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancel(shift._id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        {shift.status === 'cancelled' && (
                          <button
                            onClick={() => handleDelete(shift._id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
