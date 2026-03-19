import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Navigation
} from 'lucide-react';
import { attendanceApi } from '@/api/attendance';
import type { Attendance } from '@/types';

export function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [pagination.currentPage]);

  const fetchAttendanceHistory = async () => {
    try {
      setIsLoading(true);
      const response = await attendanceApi.getApplicantHistory({
        page: pagination.currentPage,
        limit: 10,
      });
      setAttendanceRecords(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return Promise.resolve({ lat: 0, lng: 0 });
  };

  const handleCheckIn = async (shiftId: string) => {
    setIsCheckingIn(true);
    try {
      const loc = await getCurrentLocation();
      await attendanceApi.checkIn(shiftId, {
        latitude: loc.lat,
        longitude: loc.lng,
      });
      fetchAttendanceHistory();
    } catch (error) {
      console.error('Failed to check in:', error);
      alert('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedRecord) return;
    
    setIsCheckingOut(true);
    try {
      const loc = await getCurrentLocation();
      await attendanceApi.checkOut(selectedRecord.shift._id, {
        latitude: loc.lat,
        longitude: loc.lng,
        remarks: remarks.trim() || undefined,
      });
      setShowCheckOutModal(false);
      setSelectedRecord(null);
      setRemarks('');
      fetchAttendanceHistory();
    } catch (error) {
      console.error('Failed to check out:', error);
      alert('Failed to check out. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-forest-50 text-forest-800',
      late: 'bg-yellow-50 text-yellow-700',
      absent: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCheckIn = (record: Attendance) => {
    return !record.checkInTime && record.shift.status === 'confirmed';
  };

  const canCheckOut = (record: Attendance) => {
    return record.checkInTime && !record.checkOutTime;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Attendance History</h1>
        <p className="text-gray-500">Track your shift attendance and working hours</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Shifts', 
            value: attendanceRecords.length,
            color: 'bg-blue-50 text-blue-600'
          },
          { 
            label: 'Present', 
            value: attendanceRecords.filter(r => r.status === 'present').length,
            color: 'bg-forest-50 text-forest-700'
          },
          { 
            label: 'Late', 
            value: attendanceRecords.filter(r => r.status === 'late').length,
            color: 'bg-yellow-50 text-yellow-600'
          },
          { 
            label: 'Absent', 
            value: attendanceRecords.filter(r => r.status === 'absent').length,
            color: 'bg-red-50 text-red-600'
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-500 mb-4">Your attendance will appear here once you start working shifts</p>
          <NavLink
            to="/shifts"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            View My Shifts
          </NavLink>
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceRecords.map((record) => (
            <div key={record._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.shift.job.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(record.shift.date)}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Check In</p>
                      <p className="font-medium text-gray-900">
                        {record.checkInTime ? formatTime(record.checkInTime) : 'Not checked in'}
                      </p>
                    </div>
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Check Out</p>
                      <p className="font-medium text-gray-900">
                        {record.checkOutTime ? formatTime(record.checkOutTime) : 'Not checked out'}
                      </p>
                    </div>
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                      <p className="font-medium text-gray-900">
                        {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Approved</p>
                      <p className="font-medium text-gray-900">
                        {record.isApproved ? (
                          <span className="flex items-center gap-1 text-forest-700">
                            <CheckCircle className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          'Pending'
                        )}
                      </p>
                    </div>
                  </div>

                  {record.lateBy && record.lateBy > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 mb-4">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      You were {record.lateBy} minutes late
                    </div>
                  )}

                  {record.remarks && (
                    <div className="p-3 bg-[#F5F5ED] rounded-xl text-sm text-gray-600">
                      <strong>Your Remarks:</strong> {record.remarks}
                    </div>
                  )}

                  {record.employerRemarks && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 mt-2">
                      <strong>Employer Remarks:</strong> {record.employerRemarks}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {canCheckIn(record) && (
                    <button
                      onClick={() => handleCheckIn(record.shift._id)}
                      disabled={isCheckingIn}
                      className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isCheckingIn ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      Check In
                    </button>
                  )}
                  {canCheckOut(record) && (
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowCheckOutModal(true);
                      }}
                      className="px-4 py-2 bg-lime text-forest-900 rounded-lg text-sm font-medium hover:bg-lime-400 transition-colors"
                    >
                      Check Out
                    </button>
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

      {/* Check Out Modal */}
      {showCheckOutModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Check Out</h2>
              <button onClick={() => setShowCheckOutModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#F5F5ED] rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Shift</p>
                <p className="font-medium text-gray-900">{selectedRecord.shift.job.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any notes about your shift..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>


              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCheckOutModal(false);
                    setSelectedRecord(null);
                    setRemarks('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                  className="flex-1 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Confirm Check Out
                    </>
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
