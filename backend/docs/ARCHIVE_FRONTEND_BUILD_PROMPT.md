# ShiftMaster — Complete Frontend Development Prompt

> **STRICT RULE**: This frontend must connect **only** to the existing backend APIs listed below.
> Do **NOT** invent new endpoints, do **NOT** add features that have no backend support,
> and do **NOT** remove any feature that the backend already supports.
> Every API call must match the exact method, URL, and payload documented here.

---

## 🛠️ Technology Stack

- **Framework**: React (Vite)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with a single configured instance)
- **State Management**: React Context API (AuthContext for user session)
- **Styling**: Vanilla CSS (no Tailwind, no Bootstrap)
- **Font**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Notifications**: react-hot-toast (or custom Toast component)
- **Form Handling**: Controlled components with manual validation mirroring backend Joi rules

---

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with base URL + auth interceptor
├── context/
│   └── AuthContext.jsx       # Global auth state (user, userType, token)
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── Pagination.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── EmptyState.jsx
│   │   └── ConfirmDialog.jsx
│   ├── jobs/
│   │   ├── JobCard.jsx
│   │   ├── JobForm.jsx
│   │   └── JobFilters.jsx
│   ├── applications/
│   │   ├── ApplicationCard.jsx
│   │   └── ApplicationForm.jsx
│   ├── shifts/
│   │   ├── ShiftCard.jsx
│   │   └── ShiftForm.jsx
│   └── attendance/
│       └── AttendanceCard.jsx
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx
│   │   ├── JobListingsPage.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── EmployerSignupPage.jsx
│   │   └── ApplicantSignupPage.jsx
│   ├── employer/
│   │   ├── EmployerDashboard.jsx
│   │   ├── MyJobsPage.jsx
│   │   ├── CreateJobPage.jsx
│   │   ├── EditJobPage.jsx
│   │   ├── JobApplicationsPage.jsx
│   │   ├── MyShiftsPage.jsx
│   │   ├── CreateShiftPage.jsx
│   │   ├── AttendanceRecordsPage.jsx
│   │   └── EmployerProfilePage.jsx
│   ├── applicant/
│   │   ├── ApplicantDashboard.jsx
│   │   ├── BrowseJobsPage.jsx
│   │   ├── MyApplicationsPage.jsx
│   │   ├── MyShiftsPage.jsx
│   │   ├── AttendanceHistoryPage.jsx
│   │   └── ApplicantProfilePage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── ManageEmployersPage.jsx
│       ├── ManageApplicantsPage.jsx
│       └── ModerateJobsPage.jsx
├── index.css
└── App.jsx
```

---

## 🔌 Backend API — Complete Reference

**Base URL**: `http://localhost:5000/api`  
**Auth Header**: `Authorization: Bearer <token>`  
All responses follow: `{ success, message, data }` or `{ success, message, error }`

---

### AUTH ENDPOINTS

| Method | URL | Body | Auth | Used In |
|--------|-----|------|------|---------|
| POST | `/auth/employer/signup` | `{ storeName, ownerName, email, phone, password, address: {street?, city, state, pincode}, businessType, businessDescription? }` | No | EmployerSignupPage |
| POST | `/auth/applicant/signup` | `{ name, phone, email?, password, skills?, experience?, preferredJobType? }` | No | ApplicantSignupPage |
| POST | `/auth/login` | `{ identifier, password, userType }` | No | LoginPage |
| GET | `/auth/me` | — | Yes | AuthContext (on app load) |
| PUT | `/auth/update-password` | `{ currentPassword, newPassword }` | Yes | ProfilePages |
| POST | `/auth/logout` | — | Yes | Navbar |

**`userType` values**: `"employer"` · `"applicant"` · `"admin"`  
**`businessType` values**: `"restaurant"` · `"retail"` · `"logistics"` · `"healthcare"` · `"hospitality"` · `"other"`  
**`preferredJobType` values**: `"full-time"` · `"part-time"` · `"shift"` · `"contract"`

---

### JOB ENDPOINTS

| Method | URL | Query Params / Body | Auth | Used In |
|--------|-----|---------------------|------|---------|
| GET | `/jobs` | `?jobType=&city=&state=&minSalary=&maxSalary=&skills=&search=&page=&limit=` | No | JobListingsPage, BrowseJobsPage, HomePage |
| GET | `/jobs/:id` | — | No | JobDetailPage |
| POST | `/jobs` | `{ title, description, jobType, salary:{amount,period}, workingHours?:{hoursPerDay?,daysPerWeek?,shiftTiming?}, location:{address?,city,state,pincode,coordinates?}, requirements?:{minimumExperience?,skills?,education?,otherRequirements?}, benefits?, expiryDate? }` | Employer (Approved) | CreateJobPage |
| GET | `/jobs/employer/my-jobs` | `?status=&page=&limit=` | Employer | MyJobsPage |
| PUT | `/jobs/:id` | Same fields as POST (partial) | Employer (own) | EditJobPage |
| DELETE | `/jobs/:id` | — | Employer (own) | EditJobPage, MyJobsPage |
| PUT | `/jobs/:id/close` | — | Employer (own) | MyJobsPage, JobDetailPage |
| PUT | `/jobs/:id/reopen` | — | Employer (own) | MyJobsPage, JobDetailPage |

**`jobType` values**: `"full-time"` · `"part-time"` · `"shift"` · `"contract"`  
**`salary.period` values**: `"hourly"` · `"daily"` · `"weekly"` · `"monthly"` · `"yearly"`

---

### APPLICATION ENDPOINTS

| Method | URL | Body | Auth | Used In |
|--------|-----|------|------|---------|
| POST | `/applications/:jobId` | `{ coverLetter? }` | Applicant | JobDetailPage |
| GET | `/applications/my-applications` | `?status=&page=&limit=` | Applicant | MyApplicationsPage |
| PUT | `/applications/:id/withdraw` | — | Applicant | MyApplicationsPage |
| GET | `/applications/job/:jobId` | `?status=&page=&limit=` | Employer | JobApplicationsPage |
| PUT | `/applications/:id/accept` | — | Employer | JobApplicationsPage |
| PUT | `/applications/:id/reject` | — | Employer | JobApplicationsPage |
| GET | `/applications/:id` | — | Employer/Applicant | JobApplicationsPage |

**`status` filter values**: `"pending"` · `"accepted"` · `"rejected"` · `"withdrawn"`

---

### SHIFT ENDPOINTS

| Method | URL | Body | Auth | Used In |
|--------|-----|------|------|---------|
| POST | `/shifts` | `{ jobId, applicantId, date, startTime, endTime, location, instructions?, paymentAmount? }` | Employer | CreateShiftPage |
| GET | `/shifts/employer/my-shifts` | `?status=&page=&limit=` | Employer | MyShiftsPage (Employer) |
| PUT | `/shifts/:id` | `{ date?, startTime?, endTime?, location?, instructions?, paymentAmount? }` | Employer | MyShiftsPage (Employer) |
| DELETE | `/shifts/:id` | — | Employer | MyShiftsPage (Employer) |
| GET | `/shifts/applicant/my-shifts` | `?status=&page=&limit=` | Applicant | MyShiftsPage (Applicant) |
| PUT | `/shifts/:id/confirm` | — | Applicant | MyShiftsPage (Applicant) |
| GET | `/shifts/:id` | — | Employer/Applicant | ShiftDetailModal |
| PUT | `/shifts/:id/cancel` | — | Employer/Applicant | MyShiftsPage |

**`startTime` / `endTime` format**: `"HH:MM"` (24-hour)  
**Shift `status` values**: `"assigned"` · `"confirmed"` · `"completed"` · `"cancelled"`

---

### ATTENDANCE ENDPOINTS

| Method | URL | Body | Auth | Used In |
|--------|-----|------|------|---------|
| POST | `/attendance/:shiftId/checkin` | — | Applicant | MyShiftsPage (Applicant) |
| POST | `/attendance/:shiftId/checkout` | — | Applicant | MyShiftsPage (Applicant) |
| GET | `/attendance/applicant/history` | `?page=&limit=` | Applicant | AttendanceHistoryPage |
| GET | `/attendance/employer/records` | `?page=&limit=` | Employer | AttendanceRecordsPage |
| PUT | `/attendance/:id/approve` | — | Employer | AttendanceRecordsPage |
| POST | `/attendance/manual` | `{ shiftId, applicantId, checkInTime, checkOutTime, notes? }` | Employer | AttendanceRecordsPage |
| GET | `/attendance/shift/:shiftId` | — | Employer/Applicant | AttendanceRecordsPage |

**Attendance `status` values**: `"present"` · `"absent"` · `"late"` · `"pending-approval"`

---

### ADMIN ENDPOINTS

| Method | URL | Query / Body | Auth | Used In |
|--------|-----|--------------|------|---------|
| GET | `/admin/dashboard/stats` | — | Admin | AdminDashboard |
| GET | `/admin/employers` | `?status=&search=&page=&limit=` | Admin | ManageEmployersPage |
| PUT | `/admin/employers/:id/approve` | — | Admin | ManageEmployersPage |
| PUT | `/admin/employers/:id/block` | — | Admin | ManageEmployersPage |
| PUT | `/admin/employers/:id/unblock` | — | Admin | ManageEmployersPage |
| GET | `/admin/applicants` | `?search=&page=&limit=` | Admin | ManageApplicantsPage |
| PUT | `/admin/applicants/:id/deactivate` | — | Admin | ManageApplicantsPage |
| DELETE | `/admin/jobs/:id` | — | Admin | ModerateJobsPage |

---

## 🔐 Authentication & State

### AuthContext
Store and expose:
```js
{
  user,        // full user object from /auth/me
  userType,    // "employer" | "applicant" | "admin"
  token,       // JWT string (stored in localStorage)
  login(token, userType),   // saves token, fetches /auth/me
  logout(),                 // clears token + user
  isAuthenticated,          // boolean
  loading                   // boolean (initial auth check)
}
```

### Axios Instance (`src/api/axios.js`)
```js
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
// Request interceptor: attach token from localStorage
// Response interceptor: on 401, call logout() and redirect to /login
```

### ProtectedRoute
- Checks `isAuthenticated` — redirects to `/login` if false
- Checks `userType` against allowed roles — redirects to `/` if wrong role
- Shows `<Loader />` while `loading` is true

---

## 📄 Pages — Detailed Specification

---

### PUBLIC PAGES

---

#### 1. Home Page (`/`)

**Sections**:

1. **Hero Section**
   - Heading: "Find Your Perfect Shift"
   - Subheading: "Connect with top employers for shift-based and full-time opportunities"
   - Button: "Browse Jobs" → navigates to `/jobs`
   - Button: "Post a Job" → navigates to `/signup/employer`

2. **Featured Jobs Section**
   - Calls: `GET /jobs?limit=6`
   - Renders 6 `<JobCard />` components
   - Button: "View All Jobs" → `/jobs`

3. **How It Works Section**
   - 3 static step cards: "Create Account" → "Apply for Jobs" → "Start Working"

4. **For Employers Section**
   - Static feature list (4 items)
   - Button: "Get Started" → `/signup/employer`

5. **Footer**

**No additional API calls beyond the featured jobs fetch.**

---

#### 2. Job Listings Page (`/jobs`)

**API**: `GET /jobs` with query params

**State**:
- `jobs[]`, `totalPages`, `currentPage`, `loading`
- Filter state: `search`, `jobType`, `city`, `state`, `minSalary`, `maxSalary`

**Elements**:
- Filter panel with inputs for all supported query params
- "Apply Filters" button triggers API call with current filter state
- "Clear Filters" resets all filters and re-fetches
- Job cards grid (10 per page)
- `<Pagination />` component
- "Showing X results" count from API response

**JobCard displays**:
- `title`, `employer.storeName`, `location.city + location.state`, `salary.amount + salary.period`, `jobType` badge, `requirements.skills[]` (max 3 tags), `createdAt` (posted date), `status` badge

---

#### 3. Job Detail Page (`/jobs/:id`)

**API**: `GET /jobs/:id`

**Displays all job fields**:
- `title`, `description`, `jobType`, `salary.amount + salary.period`
- `workingHours.hoursPerDay`, `workingHours.daysPerWeek`, `workingHours.shiftTiming`
- `requirements.minimumExperience`, `requirements.skills[]`, `requirements.education`, `requirements.otherRequirements`
- `benefits[]`
- `location.address`, `location.city`, `location.state`, `location.pincode`
- `employer.storeName`, `employer.businessType`
- `status` badge, `createdAt`

**Conditional Action Buttons** (based on `userType` and ownership):
- Guest: "Login to Apply" → `/login`
- Applicant (active): "Apply Now" → calls `POST /applications/:jobId` with optional cover letter textarea
- Employer (own job): "Edit Job" → `/employer/jobs/:id/edit`, "Close Job" → `PUT /jobs/:id/close`, "Delete Job" → `DELETE /jobs/:id` with confirm dialog
- Employer (own job, closed): "Reopen Job" → `PUT /jobs/:id/reopen`

**Similar Jobs**: `GET /jobs?jobType=<same>&limit=4` (exclude current job)

---

#### 4. Login Page (`/login`)

**API**: `POST /auth/login`

**Form Fields**:
- Radio group: userType — "Job Seeker" (`applicant`) | "Employer" (`employer`) | "Admin" (`admin`)
- Input: `identifier` (email or phone)
- Input: `password` (with show/hide toggle)
- Button: "Login"

**On success**: store token → call `GET /auth/me` → redirect based on `userType`:
- `employer` → `/employer/dashboard`
- `applicant` → `/applicant/dashboard`
- `admin` → `/admin/dashboard`

**Links**: "Sign up as Job Seeker" → `/signup/applicant`, "Sign up as Employer" → `/signup/employer`

---

#### 5. Employer Signup Page (`/signup/employer`)

**API**: `POST /auth/employer/signup`

**Form Fields** (all validated client-side to match backend Joi schema):
- `storeName` — required string
- `ownerName` — required string
- `email` — required valid email
- `phone` — required, exactly 10 digits
- `password` — required, min 6 chars
- Confirm Password — must match password (client-side only)
- `address.street` — optional
- `address.city` — required
- `address.state` — required
- `address.pincode` — required, exactly 6 digits
- `businessType` — required dropdown: `restaurant` | `retail` | `logistics` | `healthcare` | `hospitality` | `other`
- `businessDescription` — optional textarea

**Info notice**: "Your account will be reviewed by an admin before you can post jobs."

**On success**: auto-login with returned token → redirect to `/employer/dashboard`

---

#### 6. Applicant Signup Page (`/signup/applicant`)

**API**: `POST /auth/applicant/signup`

**Form Fields** (validated to match backend Joi schema):
- `name` — required string
- `phone` — required, exactly 10 digits
- `email` — optional, valid email if provided
- `password` — required, min 6 chars
- Confirm Password — must match (client-side only)
- `experience` — optional number (min 0)
- `preferredJobType` — optional dropdown: `full-time` | `part-time` | `shift` | `contract`
- `skills[]` — optional: text input + "Add" button → renders removable tags

**On success**: auto-login with returned token → redirect to `/applicant/dashboard`

---

### EMPLOYER PAGES (all behind `ProtectedRoute` for `userType === "employer"`)

---

#### 7. Employer Dashboard (`/employer/dashboard`)

**APIs called on mount**:
- `GET /jobs/employer/my-jobs?limit=100` — to count total, active jobs
- `GET /shifts/employer/my-shifts?limit=100` — to count upcoming shifts
- `GET /admin/...` — **NOT available to employer**; derive stats from employer's own data only

**Elements**:
- Approval status alert if `user.isApproved === false`:
  - "Your account is pending admin approval. You cannot post jobs until approved."
- Stats cards (derived from fetched data):
  - Total Jobs Posted
  - Active (open) Jobs
  - Upcoming Shifts (status: assigned/confirmed, date >= today)
- Recent Applications: `GET /applications/job/:jobId` for each active job — show last 5 across all jobs
- Upcoming Shifts: from shifts data, filter next 7 days
- Quick Actions: "Post New Job" → `/employer/jobs/create`, "Create Shift" → `/employer/shifts/create`, "View Attendance" → `/employer/attendance`

---

#### 8. My Jobs Page (`/employer/jobs`)

**API**: `GET /jobs/employer/my-jobs?page=&limit=10`

**Tabs**: All | Open | Closed (filter client-side by `status`)

**Each job row/card shows**:
- `title`, `status` badge, `createdAt`, `jobType`

**Actions per job**:
- "View Details" → `/jobs/:id`
- "Edit Job" → `/employer/jobs/:id/edit`
- "View Applications" → `/employer/jobs/:id/applications`
- "Close Job" → `PUT /jobs/:id/close` (if status is `open`)
- "Reopen Job" → `PUT /jobs/:id/reopen` (if status is `closed`)
- "Delete Job" → `DELETE /jobs/:id` with confirm dialog

**Empty state**: "No jobs posted yet" + "Post Your First Job" button

---

#### 9. Create Job Page (`/employer/jobs/create`)

**API**: `POST /jobs`

**Form sections** (all fields must match backend `jobCreationSchema`):

**Section 1 — Basic Info**:
- `title` — required text
- `description` — required textarea
- `jobType` — required dropdown: `full-time` | `part-time` | `shift` | `contract`

**Section 2 — Salary** (required object):
- `salary.amount` — required number (min 0)
- `salary.period` — required dropdown: `hourly` | `daily` | `weekly` | `monthly` | `yearly`

**Section 3 — Location** (required object):
- `location.address` — optional text
- `location.city` — required text
- `location.state` — required text
- `location.pincode` — required, 6 digits

**Section 4 — Working Hours** (optional object):
- `workingHours.hoursPerDay` — optional number
- `workingHours.daysPerWeek` — optional number (0–7)
- `workingHours.shiftTiming` — optional text

**Section 5 — Requirements** (optional object):
- `requirements.minimumExperience` — optional number
- `requirements.skills[]` — optional tag input
- `requirements.education` — optional text
- `requirements.otherRequirements` — optional textarea

**Section 6 — Benefits**:
- `benefits[]` — optional tag input

**Buttons**: "Create Job" (submit), "Cancel" → back to `/employer/jobs`

**Guard**: If `user.isApproved === false`, show warning banner and disable submit button.

---

#### 10. Edit Job Page (`/employer/jobs/:id/edit`)

**APIs**:
- `GET /jobs/:id` — pre-fill form on mount
- `PUT /jobs/:id` — on submit

**Same form as Create Job** but:
- Heading: "Edit Job"
- Pre-filled with existing job data
- Submit button: "Update Job"
- Additional "Delete Job" danger button → `DELETE /jobs/:id` with confirm dialog → redirect to `/employer/jobs`

---

#### 11. Job Applications Page (`/employer/jobs/:id/applications`)

**APIs**:
- `GET /jobs/:id` — show job title in header
- `GET /applications/job/:jobId?status=&page=&limit=10`

**Tabs**: All | Pending | Accepted | Rejected (filter by `status` query param)

**Each application card shows**:
- `applicant.name`, `applicant.phone`, `applicant.email`, `applicant.experience`, `applicant.skills[]`
- `status` badge, `createdAt` (applied date)
- `coverLetter` (if present)

**Actions per application**:
- "Accept" → `PUT /applications/:id/accept` (only if status is `pending`)
- "Reject" → `PUT /applications/:id/reject` (only if status is `pending`)
- "View Full Details" → `GET /applications/:id` → show in modal

**After accept/reject**: refresh the list

---

#### 12. My Shifts Page — Employer (`/employer/shifts`)

**API**: `GET /shifts/employer/my-shifts?page=&limit=10`

**Each shift card shows**:
- `applicant.name`, `job.title`, `date`, `startTime`, `endTime`, `location`, `status` badge, `paymentAmount`

**Actions per shift**:
- "View Details" → `GET /shifts/:id` → modal
- "Cancel Shift" → `PUT /shifts/:id/cancel` with confirm dialog
- "Delete Shift" → `DELETE /shifts/:id` with confirm dialog

**Button**: "Create Shift" → `/employer/shifts/create`

---

#### 13. Create Shift Page (`/employer/shifts/create`)

**APIs**:
- `GET /jobs/employer/my-jobs` — populate Job dropdown
- `GET /applications/job/:jobId?status=accepted` — populate Applicant dropdown (filtered by selected job)
- `POST /shifts` — on submit

**Form Fields** (all must match backend `shiftCreationSchema`):
- `jobId` — required dropdown (from employer's jobs)
- `applicantId` — required dropdown (accepted applicants for selected job, loaded after job selection)
- `date` — required date picker
- `startTime` — required time input, format `HH:MM`
- `endTime` — required time input, format `HH:MM`
- `location` — required text
- `instructions` — optional textarea
- `paymentAmount` — optional number (min 0)

**On success**: redirect to `/employer/shifts`

---

#### 14. Attendance Records Page (`/employer/attendance`)

**APIs**:
- `GET /attendance/employer/records?page=&limit=10`
- `PUT /attendance/:id/approve` — approve a record
- `POST /attendance/manual` — mark manual attendance
- `GET /attendance/shift/:shiftId` — view details for a specific shift

**Table columns**:
- `applicant.name`, `job.title` (via shift), `shift.date`, `checkInTime`, `checkOutTime`, `hoursWorked`, `status` badge, approval status

**Actions per record**:
- "Approve" → `PUT /attendance/:id/approve` (only if not yet approved)
- "View Details" → modal showing full attendance record

**Manual Attendance Modal** (triggered by "Mark Manual Attendance" button):
- Dropdown: Select Shift (from employer's shifts)
- Dropdown: Select Applicant (accepted applicants for that shift)
- DateTime: `checkInTime`
- DateTime: `checkOutTime`
- Textarea: `notes`
- Submit → `POST /attendance/manual`

---

#### 15. Employer Profile Page (`/employer/profile`)

**APIs**:
- Data from `AuthContext` (`user` object)
- `PUT /auth/update-password` — change password

**Displays** (read-only):
- `storeName`, `ownerName`, `email`, `phone`, `businessType`, `businessDescription`
- `address.street`, `address.city`, `address.state`, `address.pincode`
- `isApproved` status badge, `isBlocked` status badge
- `createdAt` (Member Since)

**Update Password Card**:
- Input: `currentPassword`
- Input: `newPassword` (min 6 chars)
- Input: Confirm New Password (client-side match check)
- Button: "Update Password" → `PUT /auth/update-password`

---

### APPLICANT PAGES (all behind `ProtectedRoute` for `userType === "applicant"`)

---

#### 16. Applicant Dashboard (`/applicant/dashboard`)

**APIs called on mount**:
- `GET /applications/my-applications?limit=100` — derive stats
- `GET /shifts/applicant/my-shifts?limit=100` — derive upcoming shifts

**Stats cards** (derived from fetched data):
- Total Applications
- Accepted Applications (status === "accepted")
- Upcoming Shifts (status: assigned/confirmed, date >= today)
- Completed Shifts (status === "completed")

**Upcoming Shifts section**: next 5 shifts sorted by date
- Each card: `employer.storeName`, `job.title`, `date`, `startTime`, `endTime`, `location`, `status` badge
- "Check In" button → `POST /attendance/:shiftId/checkin` (only if date is today and status is "confirmed")

**Recent Applications section**: last 5 applications
- Each card: `job.title`, `employer.storeName`, `createdAt`, `status` badge

**Recommended Jobs**: `GET /jobs?preferredJobType=<user.preferredJobType>&limit=4`

**Quick Actions**: "Browse Jobs" → `/applicant/jobs`, "My Applications" → `/applicant/applications`, "My Shifts" → `/applicant/shifts`

---

#### 17. Browse Jobs Page (`/applicant/jobs`)

**Same as public Job Listings Page** (`/jobs`) but:
- "Apply Now" button on each job card → navigates to `/jobs/:id`
- Jobs already applied to show "Applied" badge (check against `my-applications` data)

---

#### 18. My Applications Page (`/applicant/applications`)

**API**: `GET /applications/my-applications?status=&page=&limit=10`

**Tabs**: All | Pending | Accepted | Rejected | Withdrawn

**Each application card shows**:
- `job.title` (clickable → `/jobs/:id`), `employer.storeName`, `createdAt`, `status` badge, `coverLetter` preview

**Actions per application**:
- "Withdraw" → `PUT /applications/:id/withdraw` with confirm dialog (only if status is `pending`)
- "View Job Details" → `/jobs/:id`

**Empty state**: "No applications yet" + "Browse Jobs" button

---

#### 19. My Shifts Page — Applicant (`/applicant/shifts`)

**API**: `GET /shifts/applicant/my-shifts?page=&limit=10`

**Each shift card shows**:
- `employer.storeName`, `job.title`, `date`, `startTime`, `endTime`, `location`, `paymentAmount`, `status` badge, `instructions`

**Actions per shift** (conditional on status and date):
- "Confirm Shift" → `PUT /shifts/:id/confirm` (if status is `assigned`)
- "Check In" → `POST /attendance/:shiftId/checkin` (if status is `confirmed` and date is today)
- "Check Out" → `POST /attendance/:shiftId/checkout` (if checked in today)
- "Cancel Shift" → `PUT /shifts/:id/cancel` with confirm dialog
- "View Attendance" → `GET /attendance/shift/:shiftId` → modal

---

#### 20. Attendance History Page (`/applicant/attendance`)

**API**: `GET /attendance/applicant/history?page=&limit=10`

**Stats cards** (derived from fetched data):
- Total Shifts Worked
- Total Hours (sum of `hoursWorked`)
- Pending Approvals (count where not approved)

**Each record shows**:
- `employer.storeName`, `job.title` (via shift), `shift.date`, `checkInTime`, `checkOutTime`, `hoursWorked`, `status` badge, approval status

**"View Details" button** → modal showing full record including `notes`

---

#### 21. Applicant Profile Page (`/applicant/profile`)

**APIs**:
- Data from `AuthContext` (`user` object)
- `PUT /auth/update-password` — change password

**Displays** (read-only):
- `name`, `phone`, `email`, `experience`, `preferredJobType`, `skills[]` (as tags), `isActive` status, `createdAt`

**Update Password Card**:
- Input: `currentPassword`
- Input: `newPassword` (min 6 chars)
- Input: Confirm New Password
- Button: "Update Password" → `PUT /auth/update-password`

---

### ADMIN PAGES (all behind `ProtectedRoute` for `userType === "admin"`)

---

#### 22. Admin Dashboard (`/admin/dashboard`)

**API**: `GET /admin/dashboard/stats`

**Display all stats returned by the API**:
- Total Employers, Pending Approvals, Approved Employers, Blocked Employers
- Total Applicants, Active Applicants
- Total Jobs, Open Jobs
- Total Applications, Accepted, Rejected, Withdrawn
- Total Shifts, Total Attendance Records

**Render as stat cards** — do not fabricate data not in the API response.

**Quick Actions**:
- "Approve Employers" → `/admin/employers`
- "Manage Applicants" → `/admin/applicants`
- "Moderate Jobs" → `/admin/jobs`

---

#### 23. Manage Employers Page (`/admin/employers`)

**API**: `GET /admin/employers?status=&search=&page=&limit=10`

**Tabs**: All | Pending | Approved | Blocked (pass `status` query param)

**Filter**: search input (by name/email/phone)

**Table columns**:
- `storeName`, `ownerName`, `email`, `phone`, `businessType`, `createdAt`, `isApproved` + `isBlocked` status badge

**Actions per employer**:
- "Approve" → `PUT /admin/employers/:id/approve` (if `isApproved === false`)
- "Block" → `PUT /admin/employers/:id/block` (if not blocked) with confirm dialog
- "Unblock" → `PUT /admin/employers/:id/unblock` (if blocked) with confirm dialog

**Employer Details Modal** (on "View Details"):
- Show all employer fields from the API response
- Action buttons: Approve / Block / Unblock (same as table actions)

---

#### 24. Manage Applicants Page (`/admin/applicants`)

**API**: `GET /admin/applicants?search=&page=&limit=10`

**Tabs**: All | Active | Inactive (filter client-side by `isActive`)

**Filter**: search input

**Table columns**:
- `name`, `phone`, `email`, `experience`, `preferredJobType`, `createdAt`, `isActive` status badge

**Actions per applicant**:
- "Deactivate" → `PUT /admin/applicants/:id/deactivate` (if `isActive === true`) with confirm dialog

**Applicant Details Modal** (on "View Details"):
- Show all applicant fields: `name`, `phone`, `email`, `experience`, `preferredJobType`, `skills[]`, `isActive`, `createdAt`
- Action button: "Deactivate" (if active)

---

#### 25. Moderate Jobs Page (`/admin/jobs`)

**API**: `GET /jobs?page=&limit=10&search=&jobType=&status=`

**Filter bar**: search, jobType dropdown, status dropdown

**Table columns**:
- `title`, `employer.storeName`, `jobType`, `location.city + location.state`, `salary.amount + salary.period`, `createdAt`, `status` badge

**Actions per job**:
- "View Details" → `GET /jobs/:id` → modal showing full job info
- "Delete Job" → `DELETE /admin/jobs/:id` with confirm dialog

---

## 🎨 Design System

### Colors
```css
--color-primary:     #3b82f6;   /* Blue — primary actions */
--color-success:     #22c55e;   /* Green — accept, approve, active */
--color-warning:     #eab308;   /* Yellow — pending, reviewing */
--color-danger:      #ef4444;   /* Red — delete, block, reject */
--color-gray-50:     #f9fafb;
--color-gray-100:    #f3f4f6;
--color-gray-200:    #e5e7eb;
--color-gray-400:    #9ca3af;
--color-gray-600:    #4b5563;
--color-gray-800:    #1f2937;
--color-gray-900:    #111827;
--color-white:       #ffffff;
--color-bg:          #f9fafb;
```

### Typography
```css
font-family: 'Inter', sans-serif;
/* Headings: font-weight 700 */
/* Body: font-weight 400 */
/* Small/labels: font-weight 300 or 500 */
```

### Spacing Scale
`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px`

### Border Radius
`4px (small) · 8px (medium) · 12px (large) · 9999px (pill badges)`

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## 🏷️ Status Badge Color Mapping

| Status | Color |
|--------|-------|
| `open` | Green |
| `closed` | Gray |
| `pending` | Yellow |
| `accepted` | Green |
| `rejected` | Red |
| `withdrawn` | Gray |
| `assigned` | Blue |
| `confirmed` | Green |
| `completed` | Green |
| `cancelled` | Red |
| `present` | Green |
| `absent` | Red |
| `late` | Yellow |
| `pending-approval` | Yellow |
| `isApproved: true` | Green |
| `isApproved: false` | Yellow |
| `isBlocked: true` | Red |
| `isActive: true` | Green |
| `isActive: false` | Gray |

---

## 🧩 Reusable Components Specification

### `<Navbar />`
- Logo: "ShiftMaster"
- Guest links: "Browse Jobs", "Login", "Sign Up"
- Employer links: "Dashboard", "My Jobs", "Shifts", "Attendance", "Profile", "Logout"
- Applicant links: "Dashboard", "Browse Jobs", "Applications", "Shifts", "Attendance", "Profile", "Logout"
- Admin links: "Dashboard", "Employers", "Applicants", "Jobs", "Logout"
- Logout calls `POST /auth/logout` then clears AuthContext

### `<Pagination />`
Props: `currentPage`, `totalPages`, `onPageChange`
- Renders Previous, page numbers, Next
- Disables Previous on page 1, Next on last page

### `<StatusBadge />`
Props: `status` (string)
- Maps status string to color using the table above
- Renders as a pill span

### `<ConfirmDialog />`
Props: `isOpen`, `message`, `onConfirm`, `onCancel`, `confirmLabel`, `confirmVariant`
- Modal overlay with message, Confirm button (danger/success), Cancel button

### `<EmptyState />`
Props: `icon`, `message`, `actionLabel`, `onAction`

### `<Loader />`
Props: `size` (`sm` | `md` | `lg`), `fullScreen` (boolean)

### `<Modal />`
Props: `isOpen`, `onClose`, `title`, `children`, `footer`
- Click outside or X button closes

### `<Toast />`
- Global toast system using react-hot-toast or custom context
- Types: `success`, `error`, `warning`, `info`

---

## ✅ Form Validation Rules (Client-Side — Must Match Backend)

| Field | Rule |
|-------|------|
| `storeName` | Required, non-empty string |
| `ownerName` | Required, non-empty string |
| `email` | Required for employer; optional for applicant; must be valid email format |
| `phone` | Required, exactly 10 digits, numeric only |
| `password` | Required, minimum 6 characters |
| Confirm Password | Must exactly match `password` field |
| `address.city` | Required |
| `address.state` | Required |
| `address.pincode` | Required, exactly 6 digits, numeric only |
| `businessType` | Required, must be one of the 6 valid values |
| `salary.amount` | Required, number, min 0 |
| `salary.period` | Required, must be one of the 5 valid values |
| `location.city` | Required |
| `location.state` | Required |
| `location.pincode` | Required, exactly 6 digits |
| `jobId` | Required for shift creation |
| `applicantId` | Required for shift creation |
| `date` | Required for shift creation |
| `startTime` | Required, format `HH:MM` |
| `endTime` | Required, format `HH:MM` |
| `location` (shift) | Required string |

---

## 🚦 Routing Table

```
/                              → HomePage (public)
/jobs                          → JobListingsPage (public)
/jobs/:id                      → JobDetailPage (public)
/login                         → LoginPage (public, redirect if already logged in)
/signup/employer               → EmployerSignupPage (public)
/signup/applicant              → ApplicantSignupPage (public)

/employer/dashboard            → EmployerDashboard (employer only)
/employer/jobs                 → MyJobsPage (employer only)
/employer/jobs/create          → CreateJobPage (employer only)
/employer/jobs/:id/edit        → EditJobPage (employer only)
/employer/jobs/:id/applications → JobApplicationsPage (employer only)
/employer/shifts               → MyShiftsPage Employer (employer only)
/employer/shifts/create        → CreateShiftPage (employer only)
/employer/attendance           → AttendanceRecordsPage (employer only)
/employer/profile              → EmployerProfilePage (employer only)

/applicant/dashboard           → ApplicantDashboard (applicant only)
/applicant/jobs                → BrowseJobsPage (applicant only)
/applicant/applications        → MyApplicationsPage (applicant only)
/applicant/shifts              → MyShiftsPage Applicant (applicant only)
/applicant/attendance          → AttendanceHistoryPage (applicant only)
/applicant/profile             → ApplicantProfilePage (applicant only)

/admin/dashboard               → AdminDashboard (admin only)
/admin/employers               → ManageEmployersPage (admin only)
/admin/applicants              → ManageApplicantsPage (admin only)
/admin/jobs                    → ModerateJobsPage (admin only)

*                              → 404 Not Found page
```

---

## ⚠️ Critical Implementation Rules

1. **Never call an endpoint that doesn't exist in the backend.** Every `axios` call must map to a documented endpoint above.
2. **Never add a UI feature that requires a non-existent API.** For example: do not add a "messaging" feature, "ratings" feature, or "resume upload" feature — the backend has no endpoints for these.
3. **Token storage**: Use `localStorage` key `"shiftmaster_token"`.
4. **Error handling**: Every API call must have a `try/catch`. Show error messages from `error.response.data.message` in a toast notification.
5. **Loading states**: Show `<Loader />` while any API call is in progress.
6. **Employer approval guard**: On all employer pages that require posting/creating, check `user.isApproved` and show a warning banner if false. Disable the "Create Job" submit button.
7. **Blocked employer guard**: If `user.isBlocked === true`, show a full-page blocked message and prevent all actions.
8. **Deactivated applicant guard**: If `user.isActive === false`, show a full-page deactivated message.
9. **Pagination**: Default `limit=10` for all paginated endpoints.
10. **Date formatting**: Display all dates in human-readable format (e.g., "Feb 18, 2026"). Store/send dates in ISO format to the API.
11. **Time format**: `startTime` and `endTime` must be sent as `"HH:MM"` strings (24-hour format).
12. **Skills input**: Implement as a tag input — user types a skill and presses Enter or clicks "Add" to add it to an array; each tag has an X button to remove it.
13. **Confirm before destructive actions**: Always show `<ConfirmDialog />` before DELETE, block, deactivate, withdraw, or cancel operations.
14. **Responsive design**: Support mobile (< 640px), tablet (640–1024px), desktop (> 1024px) breakpoints.

---

## 📊 Summary

| Category | Count |
|----------|-------|
| Total Pages | 23 |
| Public Pages | 6 |
| Employer Pages | 9 |
| Applicant Pages | 6 |
| Admin Pages | 4 |
| Reusable Components | 12+ |
| API Endpoints Used | 35 |
| Route Definitions | 23 |

---

*This prompt is derived strictly from the ShiftMaster backend source code.
All features, fields, and validations correspond 1:1 to existing backend implementations.*
