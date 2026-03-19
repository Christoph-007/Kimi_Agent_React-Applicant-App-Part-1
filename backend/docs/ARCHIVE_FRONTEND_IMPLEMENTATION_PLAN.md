# ShiftMaster — Frontend Implementation Plan
> **Generated:** 2026-02-18 | **Backend:** Node.js + Express + MongoDB (fully built)
> **Frontend Stack:** React (Vite) + React Router + Axios + TailwindCSS

---

## 📌 Quick Reference

| Portal | Users | Screens | API Base |
|--------|-------|---------|----------|
| Public | Anyone | 6 | `/api/auth`, `/api/jobs` |
| Applicant | Job seekers | 10 | `/api/auth`, `/api/jobs`, `/api/applications`, `/api/shifts`, `/api/attendance`, `/api/job-requests`, `/api/notifications`, `/api/resume` |
| Employer | Business owners | 14 | `/api/auth`, `/api/jobs`, `/api/applications`, `/api/shifts`, `/api/attendance`, `/api/employer`, `/api/job-requests`, `/api/shortlist`, `/api/notifications` |
| Admin | Platform admins | 5 | `/api/admin` |
| **Total** | | **35 screens** | |

---

## 🗺️ Site Map

```
ShiftMaster
│
├── PUBLIC (no login required)
│   ├── /                          → Home / Landing Page
│   ├── /login                     → Login (all user types)
│   ├── /signup/applicant          → Applicant Registration
│   ├── /signup/employer           → Employer Registration
│   ├── /jobs                      → Browse All Jobs
│   └── /jobs/:id                  → Job Detail (public view)
│
├── APPLICANT PORTAL  /applicant/*
│   ├── /applicant/dashboard       → Dashboard (home)
│   ├── /applicant/jobs            → Browse Jobs (authenticated)
│   ├── /applicant/applications    → My Applications
│   ├── /applicant/shifts          → My Shifts
│   ├── /applicant/attendance      → Attendance History
│   ├── /applicant/job-requests    → Job Requests from Employers
│   ├── /applicant/notifications   → Notifications Inbox
│   ├── /applicant/profile         → My Profile & Preferences
│   ├── /applicant/resume          → Resume Management
│   └── /applicant/settings        → Account Settings
│
├── EMPLOYER PORTAL  /employer/*
│   ├── /employer/dashboard        → Dashboard (home)
│   ├── /employer/jobs             → My Job Postings
│   ├── /employer/jobs/create      → Create New Job
│   ├── /employer/jobs/:id/edit    → Edit Job
│   ├── /employer/jobs/:id/applicants → Applications for a Job
│   ├── /employer/applicants       → Browse All Applicants
│   ├── /employer/applicants/:id   → Applicant Full Profile
│   ├── /employer/shortlist        → My Shortlisted Applicants
│   ├── /employer/job-requests     → Sent Job Requests
│   ├── /employer/shifts           → My Shifts
│   ├── /employer/shifts/create    → Create Shift
│   ├── /employer/attendance       → Attendance Records
│   ├── /employer/notifications    → Notifications Inbox
│   └── /employer/profile          → Business Profile & Settings
│
└── ADMIN PORTAL  /admin/*
    ├── /admin/dashboard           → Platform Overview
    ├── /admin/employers           → Manage Employers (approve/block)
    ├── /admin/applicants          → Manage Applicants
    ├── /admin/jobs                → Moderate Job Listings
    └── /admin/analytics           → Platform Analytics
```

---

## 🔵 PUBLIC SCREENS (6 screens)

---

### Screen 1: Home / Landing Page
**Route:** `/`
**Purpose:** Marketing page — converts visitors into signups

#### Layout Sections
| Section | Content |
|---------|---------|
| Hero | Headline, sub-headline, two CTA buttons |
| Stats Bar | Total jobs, applicants, employers, shifts completed |
| How It Works | 3-step process cards |
| Featured Jobs | 6 latest open job cards |
| Testimonials | 3 quote cards |
| Footer | Links, copyright |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Find Jobs" CTA | `btn-hero-find-jobs` | Navigate → `/jobs` |
| "Post a Job" CTA | `btn-hero-post-job` | Navigate → `/signup/employer` |
| "Get Started as Applicant" | `btn-hero-applicant-signup` | Navigate → `/signup/applicant` |
| Job Card (×6) | `job-card-{index}` | Navigate → `/jobs/:id` |
| "View All Jobs" | `btn-view-all-jobs` | Navigate → `/jobs` |
| Navbar: Login | `nav-login` | Navigate → `/login` |
| Navbar: Sign Up | `nav-signup` | Opens dropdown (Employer / Applicant) |

#### API Calls
- `GET /api/jobs?limit=6&status=open` — featured jobs
- `GET /api/` (health check) — platform stats (or hardcoded)

---

### Screen 2: Login Page
**Route:** `/login`
**Purpose:** Unified login for all 3 user types

#### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| User Type | Radio group (3 options) | Required |
| Email or Phone | Text input | Required |
| Password | Password input (toggle visibility) | Required, min 6 chars |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Job Seeker" radio | `radio-applicant` | Sets userType = applicant |
| "Employer" radio | `radio-employer` | Sets userType = employer |
| "Admin" radio | `radio-admin` | Sets userType = admin |
| Show/Hide password | `btn-toggle-password` | Toggles password visibility |
| "Login" submit | `btn-login-submit` | POST `/api/auth/login` → redirect by role |
| "Sign up as Applicant" link | `link-applicant-signup` | Navigate → `/signup/applicant` |
| "Sign up as Employer" link | `link-employer-signup` | Navigate → `/signup/employer` |

#### Post-Login Redirect Logic
```
employer  → /employer/dashboard
applicant → /applicant/dashboard
admin     → /admin/dashboard
```

#### API Calls
- `POST /api/auth/login` — `{ identifier, password, userType }`

---

### Screen 3: Applicant Registration
**Route:** `/signup/applicant`
**Purpose:** New applicant account creation

#### Form Fields (2-column grid)
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Full Name | Text | ✅ | Non-empty |
| Phone | Tel | ✅ | 10 digits |
| Email | Email | ❌ | Valid email format |
| Password | Password | ✅ | Min 6 chars |
| Confirm Password | Password | ✅ | Must match |
| Experience (years) | Number | ❌ | ≥ 0 |
| Preferred Job Type | Select | ❌ | full-time / part-time / shift / contract |
| Job Categories | Multi-checkbox | ❌ | retail, food-service, logistics, healthcare, hospitality, other |
| Preferred Shift Type | Select | ❌ | full-time / part-time / weekends-only / flexible |
| Preferred Work Location | Text | ❌ | Free text |
| Expected Hourly Rate (₹) | Number | ❌ | ≥ 0 |
| Available Days | Multi-checkbox | ❌ | Mon–Sun |
| Skills | Tag input (add/remove) | ❌ | Free text tags |
| Resume Upload | File input | ❌ | PDF/DOC/DOCX, max 5MB |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Add Skill | `btn-add-skill` | Appends tag to skills list |
| Remove Skill (×) | `btn-remove-skill-{tag}` | Removes skill tag |
| Choose Resume File | `btn-upload-resume` | Opens file picker |
| "Create Account" submit | `btn-applicant-signup-submit` | POST `/api/auth/applicant/signup` |
| "Already have account?" link | `link-login` | Navigate → `/login` |

#### API Calls
- `POST /api/auth/applicant/signup`
- `POST /api/resume/upload` (after account created, if file selected)

---

### Screen 4: Employer Registration
**Route:** `/signup/employer`
**Purpose:** New employer account creation

#### Form Fields (2-column grid)
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Store/Business Name | Text | ✅ | Non-empty |
| Owner Name | Text | ✅ | Non-empty |
| Email | Email | ✅ | Valid email |
| Phone | Tel | ✅ | 10 digits |
| Password | Password | ✅ | Min 6 chars |
| Confirm Password | Password | ✅ | Must match |
| Business Type | Select | ✅ | restaurant / retail / logistics / healthcare / hospitality / other |
| Business Description | Textarea | ❌ | Free text |
| Street Address | Text | ❌ | Free text |
| City | Text | ✅ | Non-empty |
| State | Text | ✅ | Non-empty |
| Pincode | Text | ✅ | 6 digits |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Create Employer Account" submit | `btn-employer-signup-submit` | POST `/api/auth/employer/signup` |
| "Already have account?" link | `link-login` | Navigate → `/login` |

#### Post-Signup Note
> ⚠️ Account requires admin approval before posting jobs. Show a pending-approval banner on the employer dashboard.

#### API Calls
- `POST /api/auth/employer/signup`

---

### Screen 5: Browse All Jobs (Public)
**Route:** `/jobs`
**Purpose:** Public job listings with search and filters

#### Layout
- Left sidebar: filter panel
- Right main area: job cards grid + pagination

#### Filter Panel Elements
| Filter | Type | Options |
|--------|------|---------|
| Search | Text input | Job title / keyword |
| Job Type | Checkbox group | full-time, part-time, shift, contract |
| Location (City) | Text input | Free text |
| Salary Min | Number | ₹ amount |
| Salary Max | Number | ₹ amount |
| Status | Select | open (default) |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Search input | `input-job-search` | Debounced filter |
| "Apply Filters" | `btn-apply-filters` | Re-fetch with params |
| "Clear Filters" | `btn-clear-filters` | Reset all filters |
| Job Card (×N) | `job-card-{id}` | Navigate → `/jobs/:id` |
| Pagination prev | `btn-page-prev` | Load previous page |
| Pagination next | `btn-page-next` | Load next page |
| Page number buttons | `btn-page-{n}` | Jump to page |

#### API Calls
- `GET /api/jobs?status=open&page=1&limit=10&search=&jobType=&city=`

---

### Screen 6: Job Detail (Public)
**Route:** `/jobs/:id`
**Purpose:** Full job description; CTA to apply (requires login)

#### Sections
| Section | Content |
|---------|---------|
| Header | Title, employer name, location, job type, salary, status badge |
| Description | Full job description |
| Requirements | Min experience, skills list, education, other |
| Benefits | Benefits list |
| Employer Info | Store name, business type, city |
| Apply CTA | Button (redirects to login if not authenticated) |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Apply Now" | `btn-apply-now` | If logged in → open apply modal; else → `/login` |
| Apply Modal: Cover Letter | `input-cover-letter` | Textarea |
| Apply Modal: Expected Salary | `input-expected-salary` | Number |
| Apply Modal: "Submit Application" | `btn-submit-application` | POST `/api/applications/:jobId` |
| Apply Modal: "Cancel" | `btn-cancel-apply` | Close modal |
| "← Back to Jobs" | `btn-back-to-jobs` | Navigate → `/jobs` |
| Share Job | `btn-share-job` | Copy URL to clipboard |

#### API Calls
- `GET /api/jobs/:id`
- `POST /api/applications/:jobId` (authenticated applicant only)

---

## 🟢 APPLICANT PORTAL (10 screens)

> All routes require: `isAuthenticated && userType === 'applicant'`
> Redirect to `/login` if not authenticated.

---

### Screen 7: Applicant Dashboard
**Route:** `/applicant/dashboard`
**Purpose:** Overview of applicant activity

#### Stat Cards (top row)
| Card | Data Source |
|------|------------|
| Total Applications | Count from applications API |
| Pending Applications | Status = applied/reviewing |
| Upcoming Shifts | Shifts with status = scheduled/confirmed |
| Unread Notifications | `/api/notifications/unread-count` |

#### Sections
| Section | Content |
|---------|---------|
| Recent Applications | Last 3 applications with status badges |
| Upcoming Shifts | Next 2 shifts with date/time |
| Recent Notifications | Last 3 unread notifications |
| Job Requests | Count of pending job requests from employers |
| Quick Actions | Shortcut buttons |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Browse Jobs" quick action | `btn-browse-jobs` | Navigate → `/applicant/jobs` |
| "View All Applications" | `btn-view-applications` | Navigate → `/applicant/applications` |
| "View All Shifts" | `btn-view-shifts` | Navigate → `/applicant/shifts` |
| "View Job Requests" | `btn-view-job-requests` | Navigate → `/applicant/job-requests` |
| "View Notifications" | `btn-view-notifications` | Navigate → `/applicant/notifications` |
| Application card (×3) | `app-card-{id}` | Navigate → application detail |
| Shift card (×2) | `shift-card-{id}` | Navigate → shift detail |
| Notification item (×3) | `notif-item-{id}` | Mark read + navigate |

#### API Calls
- `GET /api/applications/my-applications?limit=3`
- `GET /api/shifts/applicant/my-shifts?limit=2`
- `GET /api/notifications/unread-count`
- `GET /api/job-requests/applicant/received?status=sent&limit=1`

---

### Screen 8: Browse Jobs (Authenticated)
**Route:** `/applicant/jobs`
**Purpose:** Same as public job listing but with "Apply" button active

> Same layout as Screen 5 but with authenticated apply flow.

#### Additional Elements (vs public)
| Element | ID | Action |
|---------|-----|--------|
| "Apply" on each card | `btn-apply-{id}` | Opens apply modal inline |
| "Already Applied" badge | — | Shown if already applied |

---

### Screen 9: My Applications
**Route:** `/applicant/applications`
**Purpose:** Track all submitted applications

#### Filter Bar
| Filter | Type |
|--------|------|
| Status | Select: all / applied / reviewing / accepted / rejected / withdrawn |

#### Application Card Elements
| Element | Content |
|---------|---------|
| Job title | Link to job detail |
| Employer name | Text |
| Applied date | Formatted date |
| Status badge | Color-coded (applied=blue, reviewing=yellow, accepted=green, rejected=red, withdrawn=gray) |
| Status history | Expandable timeline |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Status filter | `select-app-status` | Re-fetch filtered list |
| "View Details" | `btn-view-app-{id}` | Expand/navigate to detail |
| "Withdraw" | `btn-withdraw-{id}` | PUT `/api/applications/:id/withdraw` + confirm dialog |
| Pagination | `btn-page-*` | Standard pagination |

#### API Calls
- `GET /api/applications/my-applications?status=&page=&limit=`
- `PUT /api/applications/:id/withdraw`

---

### Screen 10: My Shifts
**Route:** `/applicant/shifts`
**Purpose:** View and manage assigned shifts

#### Filter Bar
| Filter | Type | Options |
|--------|------|---------|
| Status | Select | scheduled, confirmed, in-progress, completed, cancelled |
| Date Range | Date pickers | From / To |

#### Shift Card Elements
| Element | Content |
|---------|---------|
| Job title | Text |
| Employer name | Text |
| Date | Formatted |
| Start/End time | HH:MM format |
| Location | Text |
| Status badge | Color-coded |
| Payment amount | ₹ amount |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Confirm Shift" | `btn-confirm-shift-{id}` | PUT `/api/shifts/:id/confirm` (only if status=scheduled) |
| "Cancel Shift" | `btn-cancel-shift-{id}` | PUT `/api/shifts/:id/cancel` + reason input |
| "Check In" | `btn-checkin-{id}` | POST `/api/attendance/:shiftId/checkin` with geolocation |
| "Check Out" | `btn-checkout-{id}` | POST `/api/attendance/:shiftId/checkout` with geolocation |
| Status filter | `select-shift-status` | Re-fetch |
| Date range pickers | `input-date-from`, `input-date-to` | Re-fetch |

#### API Calls
- `GET /api/shifts/applicant/my-shifts?status=&page=`
- `PUT /api/shifts/:id/confirm`
- `PUT /api/shifts/:id/cancel`
- `POST /api/attendance/:shiftId/checkin`
- `POST /api/attendance/:shiftId/checkout`

---

### Screen 11: Attendance History
**Route:** `/applicant/attendance`
**Purpose:** View personal check-in/check-out records

#### Table Columns
| Column | Content |
|--------|---------|
| Date | Formatted |
| Job / Shift | Text |
| Check-in time | HH:MM |
| Check-out time | HH:MM |
| Hours worked | Calculated |
| Status | approved / pending / disputed |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Date range filter | `input-att-from`, `input-att-to` | Re-fetch |
| "View Details" | `btn-att-detail-{id}` | Expand row / modal |
| Export CSV | `btn-export-attendance` | Download CSV |

#### API Calls
- `GET /api/attendance/applicant/history?page=&limit=`

---

### Screen 12: Job Requests (from Employers)
**Route:** `/applicant/job-requests`
**Purpose:** View and respond to direct job offers from employers

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / sent (pending) / accepted / declined / expired |

#### Job Request Card Elements
| Element | Content |
|---------|---------|
| Employer name + business type | Text |
| Job title | Bold text |
| Shift type | Badge |
| Location | Text |
| Offered hourly rate | ₹/hr |
| Message from employer | Expandable text |
| Expiry date | Countdown or date |
| Status badge | sent=yellow, accepted=green, declined=red, expired=gray |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Accept" | `btn-accept-request-{id}` | PUT `/api/job-requests/:id/accept` + confirm dialog |
| "Decline" | `btn-decline-request-{id}` | Opens decline modal with reason input |
| Decline modal: reason input | `input-decline-reason` | Textarea |
| Decline modal: "Confirm Decline" | `btn-confirm-decline-{id}` | PUT `/api/job-requests/:id/decline` |
| Decline modal: "Cancel" | `btn-cancel-decline` | Close modal |
| Status filter | `select-request-status` | Re-fetch |

#### API Calls
- `GET /api/job-requests/applicant/received?status=&page=`
- `PUT /api/job-requests/:id/accept`
- `PUT /api/job-requests/:id/decline` `{ declineReason }`

---

### Screen 13: Notifications (Applicant)
**Route:** `/applicant/notifications`
**Purpose:** In-app notification inbox

#### Notification Types & Icons
| Type | Icon | Description |
|------|------|-------------|
| `job_request_received` | 📋 | New job offer from employer |
| `job_match_alert` | 🎯 | New job matches your interests |
| `job_request_status_changed` | 🔔 | Your request status changed |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Mark All Read" | `btn-mark-all-read` | PUT `/api/notifications/read-all` |
| Notification item | `notif-{id}` | Mark as read on click |
| "Dismiss" (×) | `btn-dismiss-notif-{id}` | DELETE `/api/notifications/:id` |
| Unread filter toggle | `btn-filter-unread` | Toggle `?isRead=false` |
| Pagination | `btn-page-*` | Standard |

#### API Calls
- `GET /api/notifications?isRead=&page=`
- `PUT /api/notifications/read-all`
- `PUT /api/notifications/:id/read`
- `DELETE /api/notifications/:id`

---

### Screen 14: Applicant Profile
**Route:** `/applicant/profile`
**Purpose:** View and edit personal profile and job preferences

#### Sections
| Section | Fields |
|---------|--------|
| Personal Info | Name, phone, email |
| Job Preferences | Job categories (multi-select), preferred shift type, preferred work location, expected hourly rate |
| Weekly Availability | Day checkboxes (Mon–Sun), hours per week |
| Skills | Tag list (add/remove) |
| Experience | Number input |
| Availability Toggle | `isAvailable` on/off switch |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Edit Profile" | `btn-edit-profile` | Toggle edit mode |
| "Save Changes" | `btn-save-profile` | PUT `/api/auth/me` or applicant update endpoint |
| "Cancel" | `btn-cancel-edit` | Revert changes |
| Availability toggle | `toggle-is-available` | PATCH isAvailable field |
| Add Skill | `btn-add-skill` | Append tag |
| Remove Skill | `btn-remove-skill-{tag}` | Remove tag |
| Day checkboxes (×7) | `check-day-{day}` | Toggle availability day |

#### API Calls
- `GET /api/auth/me`
- `PUT /api/auth/me` (or dedicated profile update endpoint)

---

### Screen 15: Resume Management
**Route:** `/applicant/resume`
**Purpose:** Upload, view, and delete resume

#### Layout
| Section | Content |
|---------|---------|
| Current Resume | Preview link / filename, upload date |
| Upload Zone | Drag-and-drop or click-to-upload area |
| Instructions | Accepted formats, max size |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Upload zone | `zone-resume-upload` | Opens file picker |
| "Upload Resume" | `btn-upload-resume` | POST `/api/resume/upload` (multipart) |
| "View Resume" | `btn-view-resume` | Open Cloudinary URL in new tab |
| "Delete Resume" | `btn-delete-resume` | DELETE `/api/resume` + confirm dialog |
| Confirm delete: "Yes, Delete" | `btn-confirm-delete-resume` | Execute delete |
| Confirm delete: "Cancel" | `btn-cancel-delete-resume` | Close dialog |

#### API Calls
- `POST /api/resume/upload` (multipart/form-data, field: `resume`)
- `DELETE /api/resume`

---

### Screen 16: Account Settings (Applicant)
**Route:** `/applicant/settings`
**Purpose:** Change password, manage account

#### Sections
| Section | Fields |
|---------|--------|
| Change Password | Current password, new password, confirm new password |
| Danger Zone | Deactivate account option |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Update Password" | `btn-update-password` | PUT `/api/auth/update-password` |
| Show/hide password toggles (×3) | `btn-toggle-pw-{n}` | Toggle visibility |

#### API Calls
- `PUT /api/auth/update-password`

---

## 🟠 EMPLOYER PORTAL (14 screens)

> All routes require: `isAuthenticated && userType === 'employer'`
> Approved employers: all features. Unapproved: dashboard + profile only (with pending banner).

---

### Screen 17: Employer Dashboard
**Route:** `/employer/dashboard`
**Purpose:** Business overview and quick actions

#### Stat Cards
| Card | Data |
|------|------|
| Active Jobs | Count |
| Total Applications | Count |
| Pending Applications | Count |
| Upcoming Shifts | Count |
| Shortlisted Applicants | Count |
| Unread Notifications | Count |

#### Sections
| Section | Content |
|---------|---------|
| Approval Banner | Shown if `isApproved = false` |
| Recent Applications | Last 5 across all jobs |
| Recent Job Requests Sent | Last 3 with status |
| Upcoming Shifts | Next 3 |
| Quick Actions | Shortcut buttons |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Post New Job" | `btn-post-job` | Navigate → `/employer/jobs/create` |
| "Browse Applicants" | `btn-browse-applicants` | Navigate → `/employer/applicants` |
| "View Shortlist" | `btn-view-shortlist` | Navigate → `/employer/shortlist` |
| "View Notifications" | `btn-view-notifications` | Navigate → `/employer/notifications` |
| Application card (×5) | `app-card-{id}` | Navigate → application detail |
| Job request card (×3) | `jr-card-{id}` | Navigate → `/employer/job-requests` |

#### API Calls
- `GET /api/jobs/employer/my-jobs?limit=5`
- `GET /api/applications/employer/recent?limit=5`
- `GET /api/shifts/employer/my-shifts?limit=3`
- `GET /api/job-requests/employer/sent?limit=3`
- `GET /api/notifications/unread-count`
- `GET /api/shortlist?limit=1` (for count)

---

### Screen 18: My Job Postings
**Route:** `/employer/jobs`
**Purpose:** List, manage, and moderate own job postings

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / open / closed / filled |
| Search | Job title |

#### Job Row / Card Elements
| Element | Content |
|---------|---------|
| Job title | Bold link |
| Type badge | full-time / part-time / shift / contract |
| Location | City, State |
| Applications count | Number |
| Status badge | open=green, closed=gray, filled=blue |
| Posted date | Relative date |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Post New Job" | `btn-new-job` | Navigate → `/employer/jobs/create` |
| "Edit" | `btn-edit-job-{id}` | Navigate → `/employer/jobs/:id/edit` |
| "View Applications" | `btn-job-apps-{id}` | Navigate → `/employer/jobs/:id/applicants` |
| "Close Job" | `btn-close-job-{id}` | PUT `/api/jobs/:id/close` + confirm |
| "Reopen Job" | `btn-reopen-job-{id}` | PUT `/api/jobs/:id/reopen` |
| "Delete Job" | `btn-delete-job-{id}` | DELETE `/api/jobs/:id` + confirm |
| Status filter | `select-job-status` | Re-fetch |

#### API Calls
- `GET /api/jobs/employer/my-jobs?status=&page=`
- `PUT /api/jobs/:id/close`
- `PUT /api/jobs/:id/reopen`
- `DELETE /api/jobs/:id`

---

### Screen 19: Create Job
**Route:** `/employer/jobs/create`
**Purpose:** Post a new job listing

#### Form Fields
| Field | Type | Required | Options/Validation |
|-------|------|----------|--------------------|
| Job Title | Text | ✅ | Non-empty |
| Description | Textarea | ✅ | Non-empty |
| Job Type | Select | ✅ | full-time / part-time / shift / contract |
| Salary Amount | Number | ✅ | ≥ 0 |
| Salary Period | Select | ✅ | hourly / daily / weekly / monthly |
| Street Address | Text | ❌ | Free text |
| City | Text | ✅ | Non-empty |
| State | Text | ✅ | Non-empty |
| Pincode | Text | ✅ | 6 digits |
| Min Experience (years) | Number | ❌ | ≥ 0 |
| Required Skills | Tag input | ❌ | Free text tags |
| Education | Text | ❌ | Free text |
| Other Requirements | Textarea | ❌ | Free text |
| Benefits | Tag input | ❌ | Free text tags |
| Expiry Date | Date picker | ❌ | Future date |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Add Skill tag | `btn-add-skill` | Append to skills list |
| Remove Skill | `btn-remove-skill-{tag}` | Remove tag |
| Add Benefit tag | `btn-add-benefit` | Append to benefits list |
| Remove Benefit | `btn-remove-benefit-{tag}` | Remove tag |
| "Post Job" submit | `btn-post-job-submit` | POST `/api/jobs` |
| "Cancel" | `btn-cancel-job` | Navigate → `/employer/jobs` |

#### API Calls
- `POST /api/jobs`

---

### Screen 20: Edit Job
**Route:** `/employer/jobs/:id/edit`
**Purpose:** Edit an existing job posting

> Same form as Create Job, pre-populated with existing data.

#### Additional Elements
| Element | ID | Action |
|---------|-----|--------|
| "Save Changes" | `btn-save-job` | PUT `/api/jobs/:id` |
| "Discard Changes" | `btn-discard-job` | Navigate → `/employer/jobs` |

#### API Calls
- `GET /api/jobs/:id`
- `PUT /api/jobs/:id`

---

### Screen 21: Job Applications
**Route:** `/employer/jobs/:id/applicants`
**Purpose:** Review all applications for a specific job

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / applied / reviewing / accepted / rejected |

#### Application Card Elements
| Element | Content |
|---------|---------|
| Applicant name | Text |
| Applied date | Relative date |
| Expected salary | ₹ amount |
| Cover letter | Expandable text |
| Status badge | Color-coded |
| Status history | Timeline |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Accept" | `btn-accept-app-{id}` | PUT `/api/applications/:id/accept` |
| "Reject" | `btn-reject-app-{id}` | Opens reject modal with reason |
| Reject modal: reason | `input-reject-reason` | Textarea |
| Reject modal: "Confirm" | `btn-confirm-reject-{id}` | PUT `/api/applications/:id/reject` |
| "View Resume" | `btn-view-resume-{applicantId}` | GET `/api/resume/:applicantId` → open URL |
| "Shortlist" | `btn-shortlist-{applicantId}` | POST `/api/shortlist` |
| "Send Job Request" | `btn-send-jr-{applicantId}` | Opens job request modal |
| Status filter | `select-app-status` | Re-fetch |

#### API Calls
- `GET /api/applications/job/:jobId?status=&page=`
- `PUT /api/applications/:id/accept`
- `PUT /api/applications/:id/reject`
- `GET /api/resume/:applicantId`
- `POST /api/shortlist`
- `POST /api/job-requests`

---

### Screen 22: Browse Applicants
**Route:** `/employer/applicants`
**Purpose:** Discover and filter available applicants

#### Layout
- Left sidebar: filter panel + "Save Filters" button
- Right: applicant cards grid + pagination

#### Filter Panel Elements
| Filter | Type | Options |
|--------|------|---------|
| Search by name | Text | Free text |
| Job Category | Multi-checkbox | retail, food-service, logistics, healthcare, hospitality, other |
| Preferred Shift Type | Select | full-time / part-time / weekends-only / flexible |
| Preferred Location | Text | Free text |
| Min Hourly Rate (₹) | Number | ≥ 0 |
| Max Hourly Rate (₹) | Number | ≥ 0 |
| Available Day | Select | Mon–Sun |
| Sort By | Select | createdAt / expectedHourlyRate / experience |
| Order | Radio | Newest first / Oldest first |

#### Applicant Card Elements
| Element | Content |
|---------|---------|
| Name | Bold text |
| Job categories | Badges |
| Preferred shift type | Badge |
| Preferred location | Text with icon |
| Expected rate | ₹/hr |
| Skills | Tag list (first 3) |
| Experience | N years |
| Availability indicator | Green dot if isAvailable |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Apply Filters" | `btn-apply-filters` | Re-fetch with params |
| "Clear Filters" | `btn-clear-filters` | Reset all |
| "Save Filters" | `btn-save-filters` | PUT `/api/employer/saved-filters` |
| "Load Saved Filters" | `btn-load-filters` | GET `/api/employer/saved-filters` → populate |
| Applicant card | `applicant-card-{id}` | Navigate → `/employer/applicants/:id` |
| "Shortlist" ♥ | `btn-shortlist-{id}` | POST `/api/shortlist` (toggle) |
| "Send Job Request" | `btn-send-jr-{id}` | Opens job request modal |
| Pagination | `btn-page-*` | Standard |

#### Job Request Modal Fields
| Field | Type | Required |
|-------|------|----------|
| Job Title | Text | ✅ |
| Job Description | Textarea | ✅ |
| Shift Type | Select | ✅ |
| Location | Text | ✅ |
| Offered Hourly Rate (₹) | Number | ✅ |
| Message (optional) | Textarea | ❌ |

#### API Calls
- `GET /api/employer/applicants?jobCategory=&preferredShiftType=&...`
- `GET /api/employer/saved-filters`
- `PUT /api/employer/saved-filters`
- `POST /api/shortlist`
- `POST /api/job-requests`

---

### Screen 23: Applicant Full Profile (Employer View)
**Route:** `/employer/applicants/:id`
**Purpose:** Read-only detailed view of one applicant

#### Sections
| Section | Content |
|---------|---------|
| Header | Name, availability badge, expected rate |
| Job Preferences | Categories, shift type, location |
| Weekly Availability | Day grid |
| Skills | Tag list |
| Experience | N years |
| Resume | "View Resume" button |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "View Resume" | `btn-view-resume` | GET `/api/resume/:id` → open URL |
| "Shortlist / Remove" | `btn-toggle-shortlist` | POST/DELETE `/api/shortlist` |
| "Send Job Request" | `btn-send-job-request` | Opens job request modal |
| "← Back to Applicants" | `btn-back` | Navigate → `/employer/applicants` |
| Shortlist notes input | `input-shortlist-notes` | Shown when shortlisting |
| Shortlist label input | `input-shortlist-label` | Optional label |

#### API Calls
- `GET /api/employer/applicants/:id`
- `GET /api/resume/:id`
- `GET /api/shortlist/check/:id`
- `POST /api/shortlist`
- `DELETE /api/shortlist/:id`
- `POST /api/job-requests`

---

### Screen 24: My Shortlist
**Route:** `/employer/shortlist`
**Purpose:** View and manage saved/favourite applicants

#### Shortlist Card Elements
| Element | Content |
|---------|---------|
| Applicant name | Bold link |
| Job categories | Badges |
| Preferred shift | Badge |
| Expected rate | ₹/hr |
| Private notes | Editable text |
| Label | Editable tag |
| Shortlisted date | Relative date |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "View Profile" | `btn-view-profile-{id}` | Navigate → `/employer/applicants/:applicantId` |
| "Edit Notes" | `btn-edit-notes-{id}` | Toggle inline edit |
| "Save Notes" | `btn-save-notes-{id}` | PUT `/api/shortlist/:id` |
| "Remove from Shortlist" | `btn-remove-shortlist-{id}` | DELETE `/api/shortlist/:id` + confirm |
| "Send Job Request" | `btn-send-jr-{id}` | Opens job request modal |
| Pagination | `btn-page-*` | Standard |

#### API Calls
- `GET /api/shortlist?page=`
- `PUT /api/shortlist/:id`
- `DELETE /api/shortlist/:id`
- `POST /api/job-requests`

---

### Screen 25: Sent Job Requests
**Route:** `/employer/job-requests`
**Purpose:** Track all job requests sent to applicants

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / sent / accepted / declined / expired |

#### Job Request Card Elements
| Element | Content |
|---------|---------|
| Applicant name | Text |
| Job title | Bold |
| Shift type | Badge |
| Offered rate | ₹/hr |
| Sent date | Relative |
| Expiry date | Date or "Expired" |
| Status badge | Color-coded |
| Response (if any) | Accepted/Declined with timestamp |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Status filter | `select-jr-status` | Re-fetch |
| "View Applicant Profile" | `btn-view-applicant-{id}` | Navigate → profile |
| Pagination | `btn-page-*` | Standard |

#### API Calls
- `GET /api/job-requests/employer/sent?status=&page=`

---

### Screen 26: My Shifts (Employer)
**Route:** `/employer/shifts`
**Purpose:** Manage all shifts created by this employer

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / scheduled / confirmed / in-progress / completed / cancelled |
| Date range | From / To |

#### Shift Card Elements
| Element | Content |
|---------|---------|
| Job title | Text |
| Applicant name | Text |
| Date | Formatted |
| Start/End time | HH:MM |
| Location | Text |
| Status badge | Color-coded |
| Payment amount | ₹ |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Create Shift" | `btn-create-shift` | Navigate → `/employer/shifts/create` |
| "Edit Shift" | `btn-edit-shift-{id}` | Opens edit modal |
| "Cancel Shift" | `btn-cancel-shift-{id}` | PUT `/api/shifts/:id/cancel` + reason |
| "Delete Shift" | `btn-delete-shift-{id}` | DELETE `/api/shifts/:id` + confirm |
| "View Attendance" | `btn-view-attendance-{id}` | Navigate to attendance for this shift |

#### API Calls
- `GET /api/shifts/employer/my-shifts?status=&page=`
- `PUT /api/shifts/:id/cancel`
- `DELETE /api/shifts/:id`

---

### Screen 27: Create Shift
**Route:** `/employer/shifts/create`
**Purpose:** Assign a shift to an applicant

#### Form Fields
| Field | Type | Required |
|-------|------|----------|
| Job | Select (from employer's open jobs) | ✅ |
| Applicant | Select (from accepted applications) | ✅ |
| Date | Date picker | ✅ |
| Start Time | Time input (HH:MM) | ✅ |
| End Time | Time input (HH:MM) | ✅ |
| Location | Text | ✅ |
| Instructions | Textarea | ❌ |
| Payment Amount (₹) | Number | ❌ |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Create Shift" submit | `btn-create-shift-submit` | POST `/api/shifts` |
| "Cancel" | `btn-cancel-shift-form` | Navigate → `/employer/shifts` |

#### API Calls
- `GET /api/jobs/employer/my-jobs?status=open` (populate job select)
- `GET /api/applications/job/:jobId?status=accepted` (populate applicant select)
- `POST /api/shifts`

---

### Screen 28: Attendance Records (Employer)
**Route:** `/employer/attendance`
**Purpose:** Review and approve applicant check-in/check-out records

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / pending / approved / disputed |
| Date range | From / To |
| Applicant | Search by name |

#### Table Columns
| Column | Content |
|--------|---------|
| Applicant | Name |
| Job / Shift | Text |
| Date | Formatted |
| Check-in | Time + location |
| Check-out | Time + location |
| Hours | Calculated |
| Status | Badge |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Approve" | `btn-approve-att-{id}` | PUT `/api/attendance/:id/approve` |
| "Mark Manual" | `btn-manual-att` | Opens manual attendance modal |
| Manual modal: submit | `btn-submit-manual-att` | POST `/api/attendance/manual` |
| Export CSV | `btn-export-att` | Download |

#### API Calls
- `GET /api/attendance/employer/records?page=`
- `PUT /api/attendance/:id/approve`
- `POST /api/attendance/manual`

---

### Screen 29: Notifications (Employer)
**Route:** `/employer/notifications`
**Purpose:** In-app notification inbox for employer

#### Notification Types & Icons
| Type | Icon | Description |
|------|------|-------------|
| `job_request_response` | ✅/❌ | Applicant accepted/declined your request |
| `new_matching_applicant` | 👤 | New applicant matches your saved filters |

> Same layout and interactions as Screen 13 (Applicant Notifications).

#### API Calls
- Same as Screen 13 — same endpoints, scoped by JWT

---

### Screen 30: Business Profile & Settings (Employer)
**Route:** `/employer/profile`
**Purpose:** View and edit business profile; change password

#### Sections
| Section | Fields |
|---------|--------|
| Business Info | Store name, owner name, business type, description |
| Contact | Email, phone |
| Address | Street, city, state, pincode |
| Account Status | isApproved badge, isBlocked badge |
| Saved Filters | Preview of saved applicant search filters |
| Change Password | Current, new, confirm |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Edit Profile" | `btn-edit-profile` | Toggle edit mode |
| "Save Changes" | `btn-save-profile` | PUT employer profile endpoint |
| "Cancel" | `btn-cancel-edit` | Revert |
| "Update Password" | `btn-update-password` | PUT `/api/auth/update-password` |
| "Clear Saved Filters" | `btn-clear-saved-filters` | PUT `/api/employer/saved-filters` with empty values |

#### API Calls
- `GET /api/auth/me`
- `PUT /api/auth/update-password`
- `GET /api/employer/saved-filters`

---

## 🔴 ADMIN PORTAL (5 screens)

> All routes require: `isAuthenticated && userType === 'admin'`

---

### Screen 31: Admin Dashboard
**Route:** `/admin/dashboard`
**Purpose:** Platform-wide overview and key metrics

#### Stat Cards
| Card | Data |
|------|------|
| Total Employers | Count |
| Pending Approvals | Count |
| Total Applicants | Count |
| Total Jobs | Count |
| Active Jobs | Count |
| Total Applications | Count |
| Total Shifts | Count |

#### Sections
| Section | Content |
|---------|---------|
| Pending Employer Approvals | List of unapproved employers |
| Recent Jobs | Last 5 posted |
| Platform Activity Chart | Applications over time (recharts) |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Approve" (employer) | `btn-approve-emp-{id}` | PUT `/api/admin/employers/:id/approve` |
| "Reject" (employer) | `btn-reject-emp-{id}` | PUT with reason |
| "View All Employers" | `btn-view-employers` | Navigate → `/admin/employers` |
| "View All Jobs" | `btn-view-jobs` | Navigate → `/admin/jobs` |

#### API Calls
- `GET /api/admin/stats`
- `GET /api/admin/employers?isApproved=false&limit=5`
- `GET /api/admin/jobs?limit=5`

---

### Screen 32: Manage Employers
**Route:** `/admin/employers`
**Purpose:** Full employer management — approve, block, view

#### Filter Bar
| Filter | Options |
|--------|---------|
| Approval Status | all / pending / approved |
| Blocked | all / blocked / active |
| Search | Store name / email |

#### Employer Row Elements
| Element | Content |
|---------|---------|
| Store name | Bold |
| Owner name | Text |
| Email | Text |
| Business type | Badge |
| City | Text |
| Approval status | Badge |
| Blocked status | Badge |
| Joined date | Relative |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Approve" | `btn-approve-{id}` | PUT `/api/admin/employers/:id/approve` |
| "Block" | `btn-block-{id}` | PUT `/api/admin/employers/:id/block` |
| "Unblock" | `btn-unblock-{id}` | PUT `/api/admin/employers/:id/unblock` |
| "View Details" | `btn-view-emp-{id}` | Expand / modal |
| Search input | `input-emp-search` | Debounced filter |

#### API Calls
- `GET /api/admin/employers?page=&isApproved=&isBlocked=&search=`
- `PUT /api/admin/employers/:id/approve`
- `PUT /api/admin/employers/:id/block`
- `PUT /api/admin/employers/:id/unblock`

---

### Screen 33: Manage Applicants
**Route:** `/admin/applicants`
**Purpose:** View and manage applicant accounts

#### Filter Bar
| Filter | Options |
|--------|---------|
| Active Status | all / active / inactive |
| Search | Name / phone / email |

#### Applicant Row Elements
| Element | Content |
|---------|---------|
| Name | Bold |
| Phone | Text |
| Email | Text (if provided) |
| Skills | First 3 tags |
| Status | Active / Inactive badge |
| Joined date | Relative |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Deactivate" | `btn-deactivate-{id}` | PUT `/api/admin/applicants/:id/deactivate` |
| "Activate" | `btn-activate-{id}` | PUT `/api/admin/applicants/:id/activate` |
| "View Details" | `btn-view-app-{id}` | Expand / modal |
| Search input | `input-app-search` | Debounced filter |

#### API Calls
- `GET /api/admin/applicants?page=&isActive=&search=`
- `PUT /api/admin/applicants/:id/deactivate`
- `PUT /api/admin/applicants/:id/activate`

---

### Screen 34: Moderate Jobs
**Route:** `/admin/jobs`
**Purpose:** Review and manage all job postings

#### Filter Bar
| Filter | Options |
|--------|---------|
| Status | all / open / closed / filled |
| Search | Job title |

#### Job Row Elements
| Element | Content |
|---------|---------|
| Job title | Bold |
| Employer | Store name |
| Type | Badge |
| Location | City, State |
| Applications | Count |
| Status | Badge |
| Posted | Relative date |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| "Close Job" | `btn-close-job-{id}` | PUT `/api/admin/jobs/:id/close` |
| "Delete Job" | `btn-delete-job-{id}` | DELETE `/api/admin/jobs/:id` + confirm |
| "View Details" | `btn-view-job-{id}` | Navigate → `/jobs/:id` |
| Search input | `input-job-search` | Debounced filter |

#### API Calls
- `GET /api/admin/jobs?page=&status=&search=`
- `PUT /api/admin/jobs/:id/close`
- `DELETE /api/admin/jobs/:id`

---

### Screen 35: Platform Analytics
**Route:** `/admin/analytics`
**Purpose:** Charts and metrics for platform health

#### Charts
| Chart | Type | Data |
|-------|------|------|
| Applications over time | Line chart | Daily/weekly count |
| Jobs by type | Pie chart | full-time / part-time / shift / contract |
| Employer signups | Bar chart | Monthly |
| Applicant signups | Bar chart | Monthly |
| Shift completion rate | Donut chart | completed vs cancelled |

#### Buttons & Interactive Elements
| Element | ID | Action |
|---------|-----|--------|
| Date range picker | `input-analytics-range` | Re-fetch data |
| "Export Report" | `btn-export-report` | Download CSV/PDF |
| Period toggle | `btn-period-{daily/weekly/monthly}` | Change chart granularity |

#### API Calls
- `GET /api/admin/stats`
- `GET /api/admin/analytics` (if endpoint exists, else derive from stats)

---

## 🧩 Shared Components Inventory

| Component | Used In | Purpose |
|-----------|---------|---------|
| `Navbar` | All pages | Top navigation with role-based menu items |
| `Sidebar` | All portal pages | Left navigation for portal sections |
| `ProtectedRoute` | All portal routes | Auth guard + role check |
| `Loader` | All pages | Spinner for loading states |
| `ErrorBoundary` | App root | Catch render errors |
| `Pagination` | All list pages | Page controls |
| `Modal` | Many pages | Generic overlay modal |
| `ConfirmDialog` | Delete/cancel actions | "Are you sure?" dialog |
| `Toast` | All pages | Success/error/info toasts |
| `FilterPanel` | Job/applicant lists | Collapsible filter sidebar |
| `SearchBar` | List pages | Debounced search input |
| `StatusBadge` | Cards/tables | Color-coded status pill |
| `NotificationBell` | Navbar | Unread count badge + dropdown |
| `JobRequestModal` | Employer screens | Send job request form overlay |
| `ApplyModal` | Job detail | Application submission form |
| `ResumeUploadZone` | Resume screen | Drag-and-drop file upload |
| `SkillTagInput` | Profile/signup forms | Add/remove skill tags |
| `DayCheckboxGrid` | Availability fields | Mon–Sun checkbox grid |

---

## 🔗 API Services to Create

```
frontend/src/services/
├── api.js                    ← Axios instance + interceptors (EXISTS)
├── authService.js            ← Auth endpoints (EXISTS)
├── jobService.js             ← Job endpoints (EXISTS)
├── applicationService.js     ← Application endpoints (EXISTS)
├── shiftService.js           ← Shift endpoints (EXISTS)
├── attendanceService.js      ← Attendance endpoints (EXISTS)
├── adminService.js           ← Admin endpoints (EXISTS)
├── uploadService.js          ← Resume upload (EXISTS)
├── employerApplicantService.js  ← NEW: browse applicants, saved filters
├── jobRequestService.js         ← NEW: send/accept/decline job requests
├── shortlistService.js          ← NEW: shortlist CRUD
└── notificationService.js       ← NEW: in-app notifications
```

### New Service Methods

**`employerApplicantService.js`**
```
browseApplicants(params)       → GET /api/employer/applicants
getApplicantProfile(id)        → GET /api/employer/applicants/:id
saveFilters(data)              → PUT /api/employer/saved-filters
getSavedFilters()              → GET /api/employer/saved-filters
```

**`jobRequestService.js`**
```
sendJobRequest(data)           → POST /api/job-requests
getEmployerSentRequests(params)→ GET /api/job-requests/employer/sent
getApplicantReceived(params)   → GET /api/job-requests/applicant/received
getJobRequestById(id)          → GET /api/job-requests/:id
acceptJobRequest(id)           → PUT /api/job-requests/:id/accept
declineJobRequest(id, reason)  → PUT /api/job-requests/:id/decline
```

**`shortlistService.js`**
```
addToShortlist(data)           → POST /api/shortlist
getShortlist(params)           → GET /api/shortlist
checkShortlisted(applicantId)  → GET /api/shortlist/check/:applicantId
updateShortlistEntry(id, data) → PUT /api/shortlist/:id
removeFromShortlist(id)        → DELETE /api/shortlist/:id
```

**`notificationService.js`**
```
getNotifications(params)       → GET /api/notifications
getUnreadCount()               → GET /api/notifications/unread-count
markAsRead(id)                 → PUT /api/notifications/:id/read
markAllAsRead()                → PUT /api/notifications/read-all
dismissNotification(id)        → DELETE /api/notifications/:id
```

---

## 🏗️ Build Order (Recommended)

```
Phase 1 — Foundation (1 day)
  ✅ Project setup (Vite + React)
  ✅ TailwindCSS + design tokens
  ✅ Axios instance + interceptors
  ✅ AuthContext + useAuth hook
  ✅ ProtectedRoute component
  ✅ App routing skeleton

Phase 2 — Auth Screens (0.5 day)
  ✅ Login page (Screen 2)
  ✅ Applicant signup (Screen 3)
  ✅ Employer signup (Screen 4)

Phase 3 — Public Screens (0.5 day)
  ✅ Home / Landing (Screen 1)
  ✅ Browse Jobs public (Screen 5)
  ✅ Job Detail public (Screen 6)

Phase 4 — Applicant Portal (2 days)
  → Dashboard (Screen 7)
  → My Applications (Screen 9)
  → My Shifts + Attendance (Screens 10, 11)
  → Profile + Resume (Screens 14, 15)
  → Job Requests (Screen 12)
  → Notifications (Screen 13)
  → Settings (Screen 16)

Phase 5 — Employer Portal (3 days)
  → Dashboard (Screen 17)
  → Job CRUD (Screens 18, 19, 20)
  → Job Applications (Screen 21)
  → Browse Applicants (Screen 22)
  → Applicant Profile view (Screen 23)
  → Shortlist (Screen 24)
  → Job Requests sent (Screen 25)
  → Shifts + Attendance (Screens 26, 27, 28)
  → Notifications (Screen 29)
  → Business Profile (Screen 30)

Phase 6 — Admin Portal (1 day)
  → Dashboard (Screen 31)
  → Manage Employers (Screen 32)
  → Manage Applicants (Screen 33)
  → Moderate Jobs (Screen 34)
  → Analytics (Screen 35)

Phase 7 — Polish (1 day)
  → Responsive design (mobile)
  → Loading skeletons
  → Error states
  → Empty states
  → Accessibility (aria labels)
```

---

## 📊 Summary Totals

| Category | Count |
|----------|-------|
| Total Screens | **35** |
| Public Screens | 6 |
| Applicant Screens | 10 |
| Employer Screens | 14 |
| Admin Screens | 5 |
| Shared Components | 18 |
| API Service Files | 12 (8 existing + 4 new) |
| New API Service Methods | 16 |
| Total API Endpoints Used | ~45 |
