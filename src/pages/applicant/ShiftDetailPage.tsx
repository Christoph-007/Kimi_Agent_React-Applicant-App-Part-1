import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    ChevronLeft,
    Loader2,
    Building2,
    Info,
    CheckCircle,
    AlertCircle,
    Navigation
} from 'lucide-react';
import { shiftsApi } from '@/api/shifts';
import { attendanceApi } from '@/api/attendance';
import type { Shift, Attendance } from '@/types';
import { toast } from 'sonner';

export function ShiftDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [shift, setShift] = useState<Shift | null>(null);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchShiftDetails(id);
        }
    }, [id]);

    const fetchShiftDetails = async (shiftId: string) => {
        try {
            setIsLoading(true);
            const shiftResponse = await shiftsApi.getById(shiftId);
            setShift(shiftResponse.data);

            try {
                const attendanceResponse = await attendanceApi.getShiftAttendance(shiftId);
                setAttendance(attendanceResponse.data);
            } catch (err) {
                console.log('No attendance record yet');
            }
        } catch (error) {
            console.error('Failed to fetch shift details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!shift) return;
        setIsProcessing(true);
        try {
            await shiftsApi.confirm(shift._id);
            toast.success('Shift confirmed successfully');
            fetchShiftDetails(shift._id);
        } catch (error) {
            console.error('Failed to confirm shift:', error);
            toast.error('Failed to confirm shift');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContactEmployer = () => {
        if (!shift?.employer?.phone) {
            toast.error('Employer phone number not available');
            return;
        }
        window.location.href = `tel:${shift.employer.phone}`;
    };

    const handleAddToCalendar = () => {
        if (!shift) return;

        const { job, location, instructions, date, startTime, endTime } = shift;

        // Format date and time for Google Calendar (YYYYMMDDTHHmmSS)
        // shift.date is expected to be YYYY-MM-DD or ISO string
        const datePart = date.split('T')[0].replace(/-/g, '');
        const startPart = startTime.replace(/:/g, '') + '00';
        const endPart = endTime.replace(/:/g, '') + '00';

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            job.title
        )}&dates=${datePart}T${startPart}/${datePart}T${endPart}&details=${encodeURIComponent(
            instructions || ''
        )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(googleCalendarUrl, '_blank');
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
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
            </div>
        );
    }

    if (!shift) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shift not found</h3>
                <button
                    onClick={() => navigate('/applicant/shifts')}
                    className="text-forest-700 hover:text-forest-900 font-medium"
                >
                    Back to My Shifts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/applicant/shifts')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-forest-900 line-clamp-1">
                        {shift.job.title}
                    </h1>
                    <p className="text-gray-500">Shift ID: {shift._id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Shift Status</h2>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(shift.status)}`}>
                                {shift.status.replace('-', ' ')}
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium text-gray-900">{formatDate(shift.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-forest-50 text-forest-700 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-medium text-gray-900">{shift.startTime} - {shift.endTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">{shift.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment</p>
                                    <p className="font-medium text-gray-900">₹{shift.paymentAmount || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    {shift.instructions && (
                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-forest-700" />
                                <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {shift.instructions}
                            </p>
                        </div>
                    )}

                    {/* Attendance Info */}
                    {attendance && (
                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <div className="flex items-center gap-2 mb-6">
                                <CheckCircle className="w-5 h-5 text-forest-700" />
                                <h2 className="text-lg font-semibold text-gray-900">Attendance Log</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-[#F5F5ED] rounded-xl">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-sm text-gray-500">Check In</p>
                                            {attendance.checkInStatus === 'early' && (
                                                <span className="text-[10px] font-bold px-1.5 bg-blue-100 text-blue-700 rounded uppercase">Early</span>
                                            )}
                                            {attendance.checkInStatus === 'on-time' && (
                                                <span className="text-[10px] font-bold px-1.5 bg-forest-100 text-forest-800 rounded uppercase">On Time</span>
                                            )}
                                            {attendance.checkInStatus === 'late' && (
                                                <span className="text-[10px] font-bold px-1.5 bg-red-100 text-red-700 rounded uppercase">Late</span>
                                            )}
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {attendance.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString() : 'Not Yet'}
                                        </p>
                                        {attendance.checkInStatus === 'late' && attendance.lateBy && (
                                            <p className="text-[10px] text-red-600 font-medium">Lateness: {attendance.lateBy} mins</p>
                                        )}
                                        {attendance.checkInStatus === 'early' && attendance.earlyByMinutes && (
                                            <p className="text-[10px] text-blue-600 font-medium">Arrived early: {attendance.earlyByMinutes} mins</p>
                                        )}
                                    </div>
                                    {attendance.checkInTime && (
                                        <span className="text-xs font-medium px-2 py-1 bg-forest-100 text-forest-800 rounded-lg">Verified</span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center p-4 bg-[#F5F5ED] rounded-xl">
                                    <div>
                                        <p className="text-sm text-gray-500">Check Out</p>
                                        <p className="font-medium text-gray-900">
                                            {attendance.checkOutTime ? new Date(attendance.checkOutTime).toLocaleTimeString() : 'Not Yet'}
                                        </p>
                                    </div>
                                    {attendance.checkOutTime && (
                                        <span className="text-xs font-medium px-2 py-1 bg-forest-100 text-forest-800 rounded-lg">Verified</span>
                                    )}
                                </div>

                                {attendance.totalHours && (
                                    <div className="p-4 bg-forest-50 border border-forest-100 rounded-xl flex justify-between items-center">
                                        <p className="font-semibold text-forest-900">Total Hours Worked</p>
                                        <p className="text-xl font-bold text-forest-900">{attendance.totalHours.toFixed(1)} hrs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Employer Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-card">
                        <h3 className="font-semibold text-gray-900 mb-4 text-center">Employer Details</h3>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-10 h-10 text-forest-700" />
                            </div>
                            <h4 className="font-bold text-gray-900">{shift.employer.storeName}</h4>
                            <NavLink to={`/applicant/jobs/${shift.job._id}`} className="text-sm text-forest-700 hover:text-forest-900 mt-1 block">
                                View Original Job Post
                            </NavLink>
                        </div>

                        <button
                            onClick={handleContactEmployer}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            Contact Employer
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-card">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {shift.status === 'scheduled' && (
                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Confirm Shift
                                </button>
                            )}

                            {shift.status === 'confirmed' && (
                                <NavLink
                                    to="/applicant/attendance"
                                    className="w-full py-3 bg-lime text-forest-900 rounded-full font-semibold hover:bg-lime-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Go to Attendance
                                </NavLink>
                            )}

                            <button
                                onClick={handleAddToCalendar}
                                className="w-full py-3 border-2 border-gray-100 text-gray-600 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                            >
                                Add to Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
