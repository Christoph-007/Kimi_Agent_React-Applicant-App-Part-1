import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Users,
  MapPin
} from 'lucide-react';
import { attendanceApi } from '@/api/attendance';
import { shiftsApi } from '@/api/shifts';
import type { Attendance, Shift } from '@/types';
import { toast } from 'sonner';
import { 
  Button 
} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [employerRemarks, setEmployerRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Decline state
  const [declineRecord, setDeclineRecord] = useState<Attendance | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Manual Attendance State
  const [showManualModal, setShowManualModal] = useState(false);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [manualData, setManualData] = useState({
    shiftId: '',
    checkInTime: '',
    checkOutTime: '',
    status: 'present',
    employerRemarks: '',
  });

  const [searchParams] = useSearchParams();
  const initialShiftId = searchParams.get('shift');
  const hasInitializedFromParams = useRef(false);

  const statusOptions = ['all', 'present', 'late', 'absent'];
  const approvalOptions = [
    { value: '', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending Approval' },
  ];

  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const applicantId = searchParams.get('applicant');
      const params: { status?: string; isApproved?: boolean; page: number; limit: number; applicant?: string } = {
        page: pagination.currentPage,
        limit: 10,
      };

      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (approvalFilter === 'approved') params.isApproved = true;
      if (approvalFilter === 'pending') params.isApproved = false;
      if (applicantId) params.applicant = applicantId;

      const response = await attendanceApi.getEmployerRecords(params);
      setAttendanceRecords(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, approvalFilter, pagination.currentPage]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleApprove = async (recordId: string) => {
    setIsProcessing(true);
    try {
      await attendanceApi.approve(recordId, employerRemarks.trim() || undefined);
      toast.success('Attendance record approved successfully');
      setSelectedRecord(null);
      setEmployerRemarks('');
      fetchAttendance();
    } catch (error) {
      console.error('Failed to approve attendance:', error);
      toast.error('Failed to approve attendance record');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!declineRecord) return;
    setIsProcessing(true);
    try {
      await attendanceApi.decline(declineRecord._id, declineReason.trim() || undefined);
      toast.success('Attendance record declined');
      setDeclineRecord(null);
      setDeclineReason('');
      fetchAttendance();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to decline attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchAvailableShifts = async () => {
    try {
      // Fetch confirmed or scheduled shifts that don't have attendance yet
      const response = await shiftsApi.getEmployerShifts({ status: 'confirmed' });
      const shifts = response.data || [];
      setAvailableShifts(shifts);
      return shifts;
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
      return [];
    }
  };

  useEffect(() => {
    const initFromParams = async () => {
      if (initialShiftId && !hasInitializedFromParams.current) {
        hasInitializedFromParams.current = true;
        const shifts = await fetchAvailableShifts();
        const found = shifts.find(s => s._id === initialShiftId);
        if (found) {
          setManualData(prev => ({ ...prev, shiftId: initialShiftId }));
          setShowManualModal(true);
        }
      }
    };
    initFromParams();
  }, [initialShiftId]);

  const handleMarkManual = async () => {
    if (!manualData.shiftId || !manualData.status) {
      toast.error('Please select a shift and status');
      return;
    }

    setIsProcessing(true);
    try {
      await attendanceApi.markManual({
        ...manualData,
        checkInTime: manualData.checkInTime ? new Date(manualData.checkInTime).toISOString() : '',
        checkOutTime: manualData.checkOutTime ? new Date(manualData.checkOutTime).toISOString() : '',
      });
      toast.success('Manual attendance marked successfully');
      setShowManualModal(false);
      setManualData({
        shiftId: '',
        checkInTime: '',
        checkOutTime: '',
        status: 'present',
        employerRemarks: '',
      });
      fetchAttendance();
    } catch (error) {
      console.error('Failed to mark manual attendance:', error);
      toast.error('Failed to mark manual attendance');
    } finally {
      setIsProcessing(false);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Attendance Records</h1>
          <p className="text-gray-500">Track and approve worker attendance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              fetchAvailableShifts();
              setShowManualModal(true);
            }}
            className="bg-forest-900 text-white rounded-full"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Mark Manual Attendance
          </Button>
        </div>
      </div>

      {searchParams.get('applicant') && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-800">
            <Users className="w-5 h-5" />
            <span className="font-medium">Viewing attendance records for a specific worker</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('applicant');
              window.history.pushState({}, '', `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`);
              fetchAttendance();
            }}
            className="text-blue-700 hover:bg-blue-100"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filter
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Records',
            value: pagination.totalItems,
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
            label: 'Pending Approval',
            value: attendanceRecords.filter(r => !r.isApproved).length,
            color: 'bg-orange-50 text-orange-600'
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === status || (status === 'all' && !statusFilter)
                      ? 'bg-forest-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval</label>
            <select
              value={approvalFilter}
              onChange={(e) => {
                setApprovalFilter(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
            >
              {approvalOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-500">Attendance will appear here once workers check in</p>
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceRecords.map((record) => (
            <div key={record._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {record.job?.title || record.shift?.job?.title || 'Unknown Job'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {record.applicant?.name || record.shift?.applicant?.name || 'Unknown Worker'}
                      </p>
                      {record.applicant?.phone && (
                        <p className="text-xs text-gray-400">{record.applicant.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      {record.isApproved ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-forest-50 text-forest-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      ) : record.isDeclined ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Declined
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-700">
                          Pending
                        </span>
                      )}
                      {!record.checkInLocation && record.isApproved && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          Manual Entry
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900">{record.shift ? formatDate(record.shift.date) : 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1 flex items-center justify-between">
                        Check In
                        {record.checkInStatus === 'early' && (
                          <span className="text-[10px] font-bold px-1.5 bg-blue-100 text-blue-700 rounded uppercase">Early</span>
                        )}
                        {record.checkInStatus === 'on-time' && (
                          <span className="text-[10px] font-bold px-1.5 bg-forest-100 text-forest-800 rounded uppercase">On Time</span>
                        )}
                        {record.checkInStatus === 'late' && (
                          <span className="text-[10px] font-bold px-1.5 bg-red-100 text-red-700 rounded uppercase">Late</span>
                        )}
                      </p>
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
                      <p className="text-sm text-gray-500 mb-1 text-blue-600 font-bold">Total Hours</p>
                      <p className="font-medium text-gray-900">
                        {typeof record.totalHours === 'number' ? `${record.totalHours.toFixed(1)} hrs` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-[#F5F5ED] rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Shift Location</p>
                      <p className="font-medium text-sm text-gray-900 line-clamp-1" title={record.shift?.location || 'N/A'}>
                        {record.shift?.location || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {record.checkInStatus === 'late' && record.lateBy && record.lateBy > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Worker was {record.lateBy} minutes late
                    </div>
                  )}

                  {record.checkInStatus === 'early' && record.earlyByMinutes && record.earlyByMinutes > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 mb-4">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Worker arrived {record.earlyByMinutes} minutes early
                    </div>
                  )}

                  {record.checkInLocation?.latitude != null && record.checkInLocation?.longitude != null && (
                    <div className="p-3 bg-forest-50 border border-forest-100 rounded-xl text-sm text-forest-700 mb-4 flex items-center gap-2">
                       <MapPin className="w-4 h-4 flex-shrink-0" />
                       <span>
                        Checked in from: {Number(record.checkInLocation.latitude).toFixed(4)}, {Number(record.checkInLocation.longitude).toFixed(4)}
                       </span>
                    </div>
                  )}

                  {record.remarks && (
                    <div className="p-3 bg-[#F5F5ED] rounded-xl text-sm text-gray-600 mb-4">
                      <strong>Worker Remarks:</strong> {record.remarks}
                    </div>
                  )}

                  {record.employerRemarks && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                      <strong>Your Remarks:</strong> {record.employerRemarks}
                    </div>
                  )}

                  {record.isDeclined && record.declineReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mt-2">
                      <strong>Decline Reason:</strong> {record.declineReason}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[120px]">
                  {!record.isApproved && !record.isDeclined && record.status !== 'absent' && (
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                  {!record.isApproved && !record.isDeclined && record.checkInTime && (
                    <button
                      onClick={() => {
                        setDeclineRecord(record);
                        setDeclineReason('');
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Decline
                    </button>
                  )}
                  {record.isDeclined && (
                    <span className="px-4 py-2 text-xs font-medium text-red-500 text-center">
                      Declined{record.declinedAt ? `\n${new Date(record.declinedAt).toLocaleDateString()}` : ''}
                    </span>
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

      {/* Approve Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Approve Attendance</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#F5F5ED] rounded-xl">
                <p className="text-sm text-gray-500">Worker</p>
                <p className="font-medium text-gray-900">
                  {selectedRecord.applicant?.name || selectedRecord.shift?.applicant?.name || 'Unknown Worker'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRecord.job?.title || 'Unknown Job'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium text-gray-900">{formatTime(selectedRecord.checkInTime)}</p>
                </div>
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium text-gray-900">{formatTime(selectedRecord.checkOutTime)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={employerRemarks}
                  onChange={(e) => setEmployerRemarks(e.target.value)}
                  placeholder="Add any notes about this attendance record..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setEmployerRemarks('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedRecord._id)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Attendance Modal */}
      {declineRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Decline Attendance</h2>
              <button
                onClick={() => { setDeclineRecord(null); setDeclineReason(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Record summary */}
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm">
                      Declining attendance for:
                    </p>
                    <p className="text-red-700 font-bold mt-1">
                      {declineRecord.applicant?.name || declineRecord.shift?.applicant?.name || 'Unknown Worker'}
                    </p>
                    <p className="text-red-600 text-sm">
                      {declineRecord.job?.title || declineRecord.shift?.job?.title || 'Unknown Job'}
                    </p>
                    {declineRecord.checkInTime && (
                      <p className="text-red-600 text-xs mt-1">
                        Checked in at: {new Date(declineRecord.checkInTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Declining <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Worker did not attend the shift, incorrect check-in..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setDeclineRecord(null); setDeclineReason(''); }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Decline Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Manual Modal */}

      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Manual Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Shift</Label>
              <Select 
                value={manualData.shiftId} 
                onValueChange={(val) => setManualData({...manualData, shiftId: val})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a shift..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {availableShifts.length > 0 ? (
                    availableShifts.map((shift) => (
                      <SelectItem key={shift._id} value={shift._id}>
                        <div className="flex flex-col items-start text-xs">
                          <span className="font-bold text-sm">worker: {shift.applicant.name}</span>
                          <span className="text-gray-500">Job: {shift.job.title} | Date: {new Date(shift.date).toLocaleDateString()}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No confirmed shifts found to mark attendance.</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check In Time</Label>
                <Input 
                  type="datetime-local" 
                  value={manualData.checkInTime}
                  onChange={(e) => setManualData({...manualData, checkInTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Check Out Time</Label>
                <Input 
                  type="datetime-local" 
                  value={manualData.checkOutTime}
                  onChange={(e) => setManualData({...manualData, checkOutTime: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={manualData.status} 
                onValueChange={(val) => setManualData({...manualData, status: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea 
                placeholder="Manager notes..."
                value={manualData.employerRemarks}
                onChange={(e) => setManualData({...manualData, employerRemarks: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualModal(false)}>Cancel</Button>
            <Button 
              onClick={handleMarkManual} 
              disabled={isProcessing}
              className="bg-forest-900 text-white"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
