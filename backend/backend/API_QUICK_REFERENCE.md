# ShiftMaster API - Quick Reference Guide

## 📋 Quick Stats
- **Total Endpoints**: 44
- **Database Models**: 7
- **User Roles**: 3 (Employer, Applicant, Admin)
- **External Services**: Email (Nodemailer), SMS (Twilio), File Upload (Cloudinary)

---

## 🔗 API Endpoints Summary

### Authentication (6 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/employer/signup` | Public | Register employer |
| POST | `/api/auth/applicant/signup` | Public | Register applicant |
| POST | `/api/auth/login` | Public | Login all users |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/update-password` | Protected | Update password |
| POST | `/api/auth/logout` | Protected | Logout |

### Jobs (8 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs` | Public | Get all jobs (with filters) |
| GET | `/api/jobs/:id` | Public | Get single job |
| POST | `/api/jobs` | Employer (Approved) | Create job |
| GET | `/api/jobs/employer/my-jobs` | Employer | Get my jobs |
| PUT | `/api/jobs/:id` | Employer | Update job |
| DELETE | `/api/jobs/:id` | Employer | Delete job |
| PUT | `/api/jobs/:id/close` | Employer | Close job |
| PUT | `/api/jobs/:id/reopen` | Employer | Reopen job |

### Applications (7 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications/:jobId` | Applicant | Apply for job |
| GET | `/api/applications/my-applications` | Applicant | Get my applications |
| GET | `/api/applications/job/:jobId` | Employer | Get job applications |
| GET | `/api/applications/:id` | Employer/Applicant | Get application details |
| PUT | `/api/applications/:id/accept` | Employer | Accept application |
| PUT | `/api/applications/:id/reject` | Employer | Reject application |
| PUT | `/api/applications/:id/withdraw` | Applicant | Withdraw application |

### Shifts (8 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/shifts` | Employer | Create shift |
| GET | `/api/shifts/employer/my-shifts` | Employer | Get employer shifts |
| GET | `/api/shifts/applicant/my-shifts` | Applicant | Get applicant shifts |
| GET | `/api/shifts/:id` | Employer/Applicant | Get shift details |
| PUT | `/api/shifts/:id` | Employer | Update shift |
| PUT | `/api/shifts/:id/confirm` | Applicant | Confirm shift |
| PUT | `/api/shifts/:id/cancel` | Employer/Applicant | Cancel shift |
| DELETE | `/api/shifts/:id` | Employer | Delete shift |

### Attendance (7 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/attendance/:shiftId/checkin` | Applicant | Check in |
| POST | `/api/attendance/:shiftId/checkout` | Applicant | Check out |
| GET | `/api/attendance/shift/:shiftId` | Employer/Applicant | Get shift attendance |
| GET | `/api/attendance/employer/records` | Employer | Get attendance records |
| GET | `/api/attendance/applicant/history` | Applicant | Get attendance history |
| PUT | `/api/attendance/:id/approve` | Employer | Approve attendance |
| POST | `/api/attendance/manual` | Employer | Mark manual attendance |

### Admin (8 endpoints)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/dashboard/stats` | Admin | Get dashboard stats |
| GET | `/api/admin/employers` | Admin | Get all employers |
| PUT | `/api/admin/employers/:id/approve` | Admin | Approve employer |
| PUT | `/api/admin/employers/:id/block` | Admin | Block employer |
| PUT | `/api/admin/employers/:id/unblock` | Admin | Unblock employer |
| GET | `/api/admin/applicants` | Admin | Get all applicants |
| PUT | `/api/admin/applicants/:id/deactivate` | Admin | Deactivate applicant |
| DELETE | `/api/admin/jobs/:id` | Admin | Delete job |

---

## 🗄️ Database Models

### 1. Employer
- **Key Fields**: storeName, ownerName, email, phone, password, address, businessType
- **Status Fields**: isApproved, isBlocked
- **Stats**: totalJobsPosted, activeJobs

### 2. Applicant
- **Key Fields**: name, phone, email, password, skills, experience
- **Preferences**: preferredJobType, availability
- **Files**: resume (Cloudinary)
- **Stats**: totalApplications, acceptedApplications, completedShifts

### 3. Job
- **Key Fields**: employer, title, description, jobType
- **Details**: salary, workingHours, location, requirements, benefits
- **Status**: status (open/closed/filled), expiryDate
- **Stats**: totalApplications, acceptedApplicants, views

### 4. Application
- **Key Fields**: job, applicant, employer
- **Details**: coverLetter, expectedSalary
- **Status**: status (applied/reviewing/accepted/rejected/withdrawn)
- **History**: statusHistory (tracks all changes)

### 5. Shift
- **Key Fields**: job, employer, applicant, date, startTime, endTime
- **Details**: location, instructions, paymentAmount
- **Status**: status (scheduled/confirmed/in-progress/completed/cancelled/no-show)
- **Tracking**: confirmedByApplicant, cancelledBy, cancellationReason

### 6. Attendance
- **Key Fields**: shift, applicant, employer, job
- **Check-in/out**: time, location (lat/long), method (app/manual)
- **Calculations**: totalHours, isLate, lateByMinutes
- **Status**: status (present/absent/late/half-day)
- **Approval**: isApproved, approvedBy, approvedAt

### 7. Admin
- **Key Fields**: name, email, password, role
- **Permissions**: permissions array
- **Status**: isActive

---

## 🔐 Authentication Flow

### 1. Signup
```
POST /api/auth/employer/signup or /api/auth/applicant/signup
→ User created
→ Password hashed
→ JWT token generated
→ Email notification sent
```

### 2. Login
```
POST /api/auth/login
→ Verify credentials
→ Check account status (approved/blocked/active)
→ Generate JWT token
→ Return user + token
```

### 3. Protected Request
```
Request with Authorization: Bearer <token>
→ Verify token
→ Check user role
→ Check specific permissions (approved/blocked/active)
→ Execute request
```

---

## 📊 Common Query Parameters

### Pagination
- `page` (Number, default: 1)
- `limit` (Number, default: 10)

### Job Filters
- `jobType` - full-time, part-time, shift, contract
- `city` - City name
- `state` - State name
- `minSalary` - Minimum salary
- `maxSalary` - Maximum salary
- `search` - Text search in title/description
- `status` - open, closed, filled

### Application Filters
- `status` - applied, reviewing, accepted, rejected, withdrawn

### Shift Filters
- `status` - scheduled, confirmed, in-progress, completed, cancelled, no-show
- `date` - Specific date

### Attendance Filters
- `status` - present, absent, late, half-day
- `isApproved` - true/false

---

## 🎯 User Workflows

### Employer Workflow
```
1. Signup → Wait for admin approval
2. Login → Get JWT token
3. Create job → Post job listing
4. Review applications → Accept/reject applicants
5. Create shifts → Assign work shifts
6. Track attendance → Approve attendance records
```

### Applicant Workflow
```
1. Signup → Account created
2. Login → Get JWT token
3. Browse jobs → Search and filter
4. Apply for job → Submit application
5. Confirm shift → Accept assigned shift
6. Check-in/out → Mark attendance with location
7. View history → Track applications and attendance
```

### Admin Workflow
```
1. Login → Get JWT token
2. View dashboard → Platform statistics
3. Approve employers → Enable job posting
4. Manage users → Block/deactivate users
5. Moderate content → Delete inappropriate jobs
```

---

## 🔔 Notification Triggers

### Email Notifications
- ✉️ Employer signup (pending approval)
- ✉️ Employer approval
- ✉️ Applicant signup (welcome)
- ✉️ Application status change
- ✉️ Shift assignment

### SMS Notifications
- 📱 Application accepted
- 📱 Shift assigned

---

## 🚨 Critical Business Rules

1. **Employer Approval**: Must be approved by admin before posting jobs
2. **One Application Per Job**: Enforced by database index
3. **Shift Creation**: Only for accepted applications
4. **Check-in Timing**: Only on shift date
5. **Check-out Requirement**: Must check-in first
6. **Late Detection**: >15 minutes = "late" status
7. **Status History**: All changes tracked and immutable

---

## 🛡️ Middleware Chain Examples

### Create Job
```
protect → authorize('employer') → checkEmployerBlocked → checkEmployerApproval → validate(jobCreationSchema) → createJob
```

### Apply for Job
```
protect → authorize('applicant') → checkApplicantActive → applyForJob
```

### Check In
```
protect → authorize('applicant') → checkApplicantActive → checkIn
```

### Approve Employer
```
protect → authorize('admin') → approveEmployer
```

---

## 📝 Sample Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "employer@example.com",
    "password": "password123",
    "userType": "employer"
  }'
```

### Create Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Sales Associate",
    "description": "Looking for sales associate",
    "jobType": "full-time",
    "salary": {"amount": 25000, "period": "monthly"},
    "location": {"city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}
  }'
```

### Apply for Job
```bash
curl -X POST http://localhost:5000/api/applications/JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "coverLetter": "I am interested...",
    "expectedSalary": 30000
  }'
```

### Check In
```bash
curl -X POST http://localhost:5000/api/attendance/SHIFT_ID/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "location": {"latitude": 19.0760, "longitude": 72.8777},
    "remarks": "On time"
  }'
```

---

## 🔧 Environment Setup

### Required Services
1. **MongoDB** - Database
2. **Gmail** - Email notifications (with app password)
3. **Twilio** - SMS notifications
4. **Cloudinary** - File uploads

### Minimum .env Configuration
```env
MONGODB_URI=mongodb://localhost:27017/shiftmaster
JWT_SECRET=your_secret_key_minimum_32_characters
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 📊 Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Data retrieved successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry (email, phone) |
| 500 | Server Error | Internal server error |

---

## 🎓 Key Concepts

### JWT Token Structure
```json
{
  "userId": "user_id",
  "userType": "employer | applicant | admin",
  "role": "employer | applicant | admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Status Transitions

**Application:**
```
applied → reviewing → accepted/rejected
         ↓
      withdrawn
```

**Shift:**
```
scheduled → confirmed → in-progress → completed
    ↓           ↓
cancelled   cancelled
```

**Attendance:**
```
Check-in → Check-out → Pending Approval → Approved
```

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production mode
npm start

# Create admin user
node createAdmin.js
```

---

**For detailed documentation, see `API_DOCUMENTATION.md`**

*Last Updated: February 2024*
