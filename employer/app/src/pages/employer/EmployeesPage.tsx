import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Phone,
  Mail,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { applicationsApi } from '@/api/applications';
import type { Application } from '@/types';
import { toast } from 'sonner';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, [pagination.currentPage]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await applicationsApi.getAllEmployerApplications({
        status: 'accepted',
        page: pagination.currentPage,
        limit: 10,
      });
      setEmployees(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.job?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading && pagination.currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Employees</h1>
          <p className="text-gray-500">View and manage your current team members</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 rounded-full font-medium">
          <UserCheck className="w-5 h-5" />
          {pagination.totalItems} Active Employees
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card border border-dashed border-gray-200">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-6">Accepted appplications will appear here as employees</p>
          <NavLink
            to="/employer/applicants"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Find Candidates
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee._id} className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-50 group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-forest-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-forest-700 font-bold text-2xl uppercase">
                      {employee.applicant.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-forest-700 transition-colors">
                      {employee.applicant.name}
                    </h3>
                    <p className="text-sm text-forest-600 font-medium mt-0.5">{employee.job?.title || 'Team Member'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  {employee.applicant.phone}
                </div>
                {employee.applicant.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    {employee.applicant.email}
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  Joined {formatDate(employee.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <NavLink
                    to={`/employer/applicants/${employee.applicant._id}`}
                    className="flex-1 text-center py-2.5 bg-gray-50 text-gray-700 rounded-2xl text-sm font-bold hover:bg-forest-100 hover:text-forest-900 transition-all border border-transparent hover:border-forest-200"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to={`/employer/shifts`}
                    className="flex-1 text-center py-2.5 bg-forest-900 text-white rounded-2xl text-sm font-bold hover:bg-forest-800 transition-all shadow-sm"
                  >
                    Shifts
                  </NavLink>
                </div>
                <NavLink
                  to={`/employer/attendance?applicant=${employee.applicant._id}`}
                  className="w-full text-center py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  View Attendance
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="p-3 rounded-2xl border border-gray-100 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 shadow-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <button
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-3 rounded-2xl border border-gray-100 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
