import { useEffect, useState, useCallback } from 'react';
import { 
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { attendanceApi } from '@/api/attendance';
import type { Attendance } from '@/types';

export function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [employerRemarks, setEmployerRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const statusOptions = ['all', 'present', 'late', 'absent'];
  const approvalOptions = [
    { value: '', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending Approval' },
  ];

  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: { status?: string; isApproved?: boolean; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (approvalFilter === 'approved') params.isApproved = true;
      if (approvalFilter === 'pending') params.isApproved = false;

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
      setSelectedRecord(null);
      setEmployerRemarks('');
      fetchAttendance();
    } catch (error) {
      console.error('Failed to approve attendance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-50 text-green-700',
      late: 'bg-yellow-50 text-yellow-700',
      absent: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
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
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Attendance Records</h1>
        <p className="text-gray-500">Track and approve worker attendance</p>
      </div>

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
            color: 'bg-green-50 text-green-600'
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status || (status === 'all' && !statusFilter)
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
                      <h3 className="font-semibold text-gray-900">{record.shift.job.title}</h3>
                      <p className="text-sm text-gray-500">{record.shift.applicant.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      {record.isApproved ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-700">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(record.shift.date)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Check In</p>
                      <p className="font-medium text-gray-900">
                        {record.checkInTime ? formatTime(record.checkInTime) : 'Not checked in'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Check Out</p>
                      <p className="font-medium text-gray-900">
                        {record.checkOutTime ? formatTime(record.checkOutTime) : 'Not checked out'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                      <p className="font-medium text-gray-900">
                        {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {record.lateBy && record.lateBy > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 mb-4">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Worker was {record.lateBy} minutes late
                    </div>
                  )}

                  {record.remarks && (
                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 mb-4">
                      <strong>Worker Remarks:</strong> {record.remarks}
                    </div>
                  )}

                  {record.employerRemarks && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                      <strong>Your Remarks:</strong> {record.employerRemarks}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {!record.isApproved && record.status !== 'absent' && (
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
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

      {/* Approve Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Approve Attendance</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Worker</p>
                <p className="font-medium text-gray-900">{selectedRecord.shift.applicant.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium text-gray-900">{formatTime(selectedRecord.checkInTime)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
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
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
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
    </div>
  );
}
