import { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Navigation,
  Clock,
  MapPin,
  LogIn,
  LogOut,
  ClipboardList,
  RefreshCw
} from 'lucide-react';
import { attendanceApi } from '@/api/attendance';
import { shiftsApi } from '@/api/shifts';
import type { Attendance, Shift } from '@/types';
import { toast } from 'sonner';

export function AttendancePage() {
  // Today's live shifts
  const [todayShifts, setTodayShifts] = useState<Shift[]>([]);
  const [shiftAttendances, setShiftAttendances] = useState<Record<string, Attendance | null>>({});
  const [isLoadingToday, setIsLoadingToday] = useState(true);

  // History
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Check in/out state
  const [processingShiftId, setProcessingShiftId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkOutShiftId, setCheckOutShiftId] = useState<string | null>(null);


  useEffect(() => {
    fetchTodayShifts();
    fetchAttendanceHistory();
  }, []);

  useEffect(() => {
    fetchAttendanceHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  const fetchTodayShifts = async () => {
    try {
      setIsLoadingToday(true);
      // Fetch confirmed and in-progress shifts
      const [confirmedRes, inProgressRes] = await Promise.all([
        shiftsApi.getApplicantShifts({ status: 'confirmed', limit: 50 }),
        shiftsApi.getApplicantShifts({ status: 'in-progress', limit: 50 }),
      ]);

      const allActiveShifts = [
        ...(confirmedRes.data || []),
        ...(inProgressRes.data || []),
      ];

      setTodayShifts(allActiveShifts);

      // Fetch attendance records for each shift
      const attendanceMap: Record<string, Attendance | null> = {};
      await Promise.all(
        allActiveShifts.map(async (shift) => {
          try {
            const res = await attendanceApi.getShiftAttendance(shift._id);
            attendanceMap[shift._id] = res.data;
          } catch {
            attendanceMap[shift._id] = null;
          }
        })
      );
      setShiftAttendances(attendanceMap);
    } catch (error) {
      console.error('Failed to fetch today shifts:', error);
    } finally {
      setIsLoadingToday(false);
    }
  };

  const fetchAttendanceHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const response = await attendanceApi.getApplicantHistory({
        page: pagination.currentPage,
        limit: 10,
      });
      setAttendanceRecords(response.data || []);
      setPagination(prev => ({
        ...prev,
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [pagination.currentPage]);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Allow check-in even without location
          resolve({ lat: 0, lng: 0 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  };

  const handleCheckIn = async (shiftId: string) => {
    setProcessingShiftId(shiftId);
    try {
      let location = { lat: 0, lng: 0 };
      try {
        location = await getCurrentLocation();
      } catch {
        // proceed without location
      }

      await attendanceApi.checkIn(shiftId, {
        latitude: location.lat,
        longitude: location.lng,
      });
      toast.success('✅ Checked in successfully!');
      fetchTodayShifts();
      fetchAttendanceHistory();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to check in');
    } finally {
      setProcessingShiftId(null);
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutShiftId) return;
    setProcessingShiftId(checkOutShiftId);
    try {
      let location = { lat: 0, lng: 0 };
      try {
        location = await getCurrentLocation();
      } catch {
        // proceed without location
      }

      await attendanceApi.checkOut(checkOutShiftId, {
        latitude: location.lat,
        longitude: location.lng,
        remarks: remarks.trim() || undefined,
      });
      toast.success('✅ Checked out successfully!');
      setShowCheckOutModal(false);
      setCheckOutShiftId(null);
      setRemarks('');
      fetchTodayShifts();
      fetchAttendanceHistory();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to check out');
    } finally {
      setProcessingShiftId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-50 text-green-700',
      late: 'bg-yellow-50 text-yellow-700',
      absent: 'bg-red-50 text-red-700',
      'half-day': 'bg-orange-50 text-orange-700',
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Attendance</h1>
          <p className="text-gray-500">Clock in and out for your shifts</p>
        </div>
        <button
          onClick={() => { fetchTodayShifts(); fetchAttendanceHistory(); }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* ───── TODAY'S SHIFTS (CLOCK IN/OUT SECTION) ───── */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5" />
            <h2 className="text-lg font-bold">Active Shifts</h2>
          </div>
          <span className="text-sm opacity-80">
            {isLoadingToday ? '...' : `${todayShifts.length} shift${todayShifts.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {isLoadingToday ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
          </div>
        ) : todayShifts.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No active shifts right now</h3>
            <p className="text-sm text-gray-500 mb-6">
              You need a <strong>confirmed</strong> shift to clock in. Go to My Shifts to confirm your shifts.
            </p>
            <NavLink
              to="/shifts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              View My Shifts
            </NavLink>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayShifts.map((shift) => {
              const attendance = shiftAttendances[shift._id];
              const isProcessing = processingShiftId === shift._id;
              const hasCheckedIn = !!attendance?.checkInTime;
              const hasCheckedOut = !!attendance?.checkOutTime;

              return (
                <div key={shift._id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Shift Info */}
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        hasCheckedIn && !hasCheckedOut
                          ? 'bg-green-100'
                          : hasCheckedOut
                          ? 'bg-purple-100'
                          : 'bg-forest-100'
                      }`}>
                        {hasCheckedIn && !hasCheckedOut ? (
                          <LogOut className="w-6 h-6 text-green-600" />
                        ) : hasCheckedOut ? (
                          <CheckCircle className="w-6 h-6 text-purple-600" />
                        ) : (
                          <LogIn className="w-6 h-6 text-forest-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{shift.job.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{shift.employer.storeName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {shift.startTime} – {shift.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {shift.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(shift.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Attendance status */}
                        {attendance && (
                          <div className="flex gap-3 mt-3 text-xs">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium ${
                              hasCheckedIn ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                            }`}>
                              <LogIn className="w-3 h-3" />
                              In: {hasCheckedIn ? formatTime(attendance.checkInTime) : 'Not yet'}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium ${
                              hasCheckedOut ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-500'
                            }`}>
                              <LogOut className="w-3 h-3" />
                              Out: {hasCheckedOut ? formatTime(attendance.checkOutTime) : 'Not yet'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {hasCheckedOut ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Shift Complete
                        </div>
                      ) : hasCheckedIn ? (
                        <button
                          onClick={() => {
                            setCheckOutShiftId(shift._id);
                            setShowCheckOutModal(true);
                          }}
                          disabled={isProcessing}
                          className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogOut className="w-4 h-4" />
                          )}
                          Clock Out
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(shift._id)}
                          disabled={isProcessing}
                          className="px-6 py-3 bg-forest-900 text-white rounded-xl text-sm font-bold hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogIn className="w-4 h-4" />
                          )}
                          Clock In
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───── ATTENDANCE HISTORY ───── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-forest-700" />
          Attendance History
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Records', value: pagination.totalItems, color: 'bg-blue-50 text-blue-600' },
            { label: 'Present', value: attendanceRecords.filter(r => r.status === 'present').length, color: 'bg-green-50 text-green-600' },
            { label: 'Late', value: attendanceRecords.filter(r => r.status === 'late').length, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Absent', value: attendanceRecords.filter(r => r.status === 'absent').length, color: 'bg-red-50 text-red-600' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-card">
            <ClipboardList className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No attendance records yet</h3>
            <p className="text-sm text-gray-500">Your history will appear here after you clock in.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div key={record._id} className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.shift?.job?.title || record.job?.title || 'Unknown Job'}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(record.shift.date)}</p>
                        {record.employer?.storeName && (
                          <p className="text-xs text-gray-400">{record.employer.storeName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        {record.isApproved ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-600">
                            Pending Approval
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 mb-0.5 flex items-center justify-between">
                          Check In
                          {record.checkInStatus === 'early' && (
                            <span className="text-[10px] font-bold px-1.5 bg-blue-100 text-blue-700 rounded uppercase ml-1">Early</span>
                          )}
                          {record.checkInStatus === 'on-time' && (
                            <span className="text-[10px] font-bold px-1.5 bg-green-100 text-green-700 rounded uppercase ml-1">On Time</span>
                          )}
                          {record.checkInStatus === 'late' && (
                            <span className="text-[10px] font-bold px-1.5 bg-red-100 text-red-700 rounded uppercase ml-1">Late</span>
                          )}
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                          {record.checkInTime ? formatTime(record.checkInTime) : '—'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 mb-0.5">Check Out</p>
                        <p className="font-semibold text-sm text-gray-900">
                          {record.checkOutTime ? formatTime(record.checkOutTime) : '—'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 mb-0.5">Total Hours</p>
                        <p className="font-semibold text-sm text-gray-900">
                          {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '—'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 mb-0.5">Date</p>
                        <p className="font-semibold text-sm text-gray-900">
                          {new Date(record.shift.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {record.checkInStatus === 'late' && record.lateBy && record.lateBy > 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        You were {record.lateBy} minutes late
                      </div>
                    )}

                    {record.checkInStatus === 'early' && record.earlyByMinutes && record.earlyByMinutes > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        You arrived {record.earlyByMinutes} minutes early
                      </div>
                    )}

                    {record.remarks && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                        <strong>Your Remarks:</strong> {record.remarks}
                      </div>
                    )}

                    {record.employerRemarks && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                        <strong>Employer Remarks:</strong> {record.employerRemarks}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
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

      {/* Check Out Modal */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Clock Out</h2>
              <button
                onClick={() => {
                  setShowCheckOutModal(false);
                  setCheckOutShiftId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                <LogOut className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-sm text-orange-700 font-medium">
                  Your location will be recorded when you clock out.
                </p>
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

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCheckOutModal(false);
                    setCheckOutShiftId(null);
                    setRemarks('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!!processingShiftId}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingShiftId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Confirm Clock Out
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
