# ShiftMaster - Complete API Documentation for React
> **Generated:** 2026-03-04 | **Base URL:** `https://api.shiftmaster.app` or `http://localhost:5000`
> **Authentication:** Bearer Token (JWT)

---

## 📋 Table of Contents

1. [Authentication](#-1-authentication)
2. [Jobs](#-2-jobs)
3. [Applications](#-3-applications)
4. [Shifts](#-4-shifts)
5. [Attendance](#-5-attendance)
6. [Job Requests](#-6-job-requests)
7. [Employer-Applicant](#-7-employer-applicant-browse)
8. [Shortlist](#-8-shortlist)
9. [Notifications](#-9-notifications)
10. [Resume](#-10-resume)
11. [Categories](#-11-categories)
12. [Admin](#-12-admin)
13. [Response Formats](#-13-response-formats)
14. [Error Handling](#-14-error-handling)
15. [React API Client](#-15-react-api-client)

---

## 🔑 1. Authentication

### 1.1 Employer Signup
```http
POST /api/auth/employer/signup
Content-Type: application/json
```

**Request Body:**
```json
{
  "storeName": "Tech Cafe",
  "ownerName": "John Doe",
  "email": "john@techcafe.com",
  "phone": "9876543210",
  "password": "securepassword",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "businessType": "restaurant",
  "businessDescription": "A cozy tech-themed cafe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb54f7e2d0015c8f882",
    "storeName": "Tech Cafe",
    "ownerName": "John Doe",
    "email": "john@techcafe.com",
    "phone": "9876543210",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "businessType": "restaurant",
    "isApproved": false,
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.2 Applicant Signup
```http
POST /api/auth/applicant/signup
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "9876543211",
  "email": "jane@example.com",
  "password": "securepassword",
  "skills": ["Cooking", "Customer Service"],
  "experience": 3,
  "preferredJobType": "part-time",
  "jobCategories": ["food-service", "hospitality"],
  "preferredShiftType": "evening",
  "preferredWorkLocation": "Mumbai",
  "weeklyAvailability": {
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "hoursPerWeek": 20
  },
  "expectedHourlyRate": 150
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb54f7e2d0015c8f883",
    "name": "Jane Smith",
    "phone": "9876543211",
    "email": "jane@example.com",
    "skills": ["Cooking", "Customer Service"],
    "experience": 3,
    "isActive": true,
    "isAvailable": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.3 Login (All User Types)
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "identifier": "john@techcafe.com",
  "password": "securepassword",
  "userType": "employer"
}
```

> **userType options:** `employer`, `applicant`, `admin`

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb54f7e2d0015c8f882",
    "storeName": "Tech Cafe",
    "email": "john@techcafe.com",
    "isApproved": true,
    "isBlocked": false
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account blocked/deactivated

---

### 1.4 Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54f7e2d0015c8f882",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "skills": ["Cooking"],
    "experience": 3,
    "isActive": true
  }
}
```

---

### 1.5 Update Profile
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Applicant):**
```json
{
  "name": "Jane Smith Updated",
  "skills": ["Cooking", "Baking", "Management"],
  "experience": 4,
  "expectedHourlyRate": 200,
  "isAvailable": true
}
```

**Request Body (Employer):**
```json
{
  "storeName": "Tech Cafe Updated",
  "ownerName": "John Doe Jr",
  "address": {
    "street": "456 New St",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001"
  }
}
```

---

### 1.6 Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

---

### 1.7 Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 💼 2. Jobs

### 2.1 Get All Jobs (Public)
```http
GET /api/jobs?page=1&limit=10&jobType=part-time&city=Mumbai&minSalary=100&maxSalary=500&search=chef&status=open
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number (default: 1) |
| limit | int | Items per page (default: 10) |
| jobType | string | full-time, part-time, shift, contract |
| city | string | City name |
| state | string | State name |
| minSalary | number | Minimum salary amount |
| maxSalary | number | Maximum salary amount |
| search | string | Search in title/description |
| category | string | Category search term |
| status | string | open, closed, filled (default: open) |
| sortBy | string | createdAt, salary, etc. |
| order | string | asc, desc |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [
    {
      "_id": "60d5ecb54f7e2d0015c8f890",
      "title": "Chef Required",
      "description": "Looking for an experienced chef...",
      "jobType": "part-time",
      "salary": {
        "amount": 200,
        "period": "daily"
      },
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001"
      },
      "employer": {
        "_id": "60d5ecb54f7e2d0015c8f882",
        "storeName": "Tech Cafe",
        "businessType": "restaurant"
      },
      "status": "open",
      "totalApplications": 5,
      "views": 45,
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2.2 Get Single Job
```http
GET /api/jobs/:id
Authorization: Bearer <token> (optional - for hasApplied flag)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job retrieved successfully",
  "data": {
    "_id": "60d5ecb54f7e2d0015c8f890",
    "title": "Chef Required",
    "description": "Looking for an experienced chef...",
    "jobType": "part-time",
    "salary": {
      "amount": 200,
      "period": "daily"
    },
    "workingHours": {
      "hoursPerDay": 8,
      "daysPerWeek": 5,
      "shiftTiming": "9 AM - 5 PM"
    },
    "location": {
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "requirements": {
      "minimumExperience": 2,
      "skills": ["Cooking", "Food Safety"],
      "education": "High School"
    },
    "benefits": ["Free Meals", "Transport"],
    "employer": {
      "_id": "60d5ecb54f7e2d0015c8f882",
      "storeName": "Tech Cafe",
      "ownerName": "John Doe",
      "businessType": "restaurant"
    },
    "status": "open",
    "totalApplications": 5,
    "views": 45,
    "hasApplied": true,
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

---

### 2.3 Create Job (Employer)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Chef Required",
  "description": "Looking for an experienced chef for evening shift",
  "jobType": "part-time",
  "salaryAmount": 200,
  "salaryPeriod": "daily",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "workingHours": {
    "hoursPerDay": 4,
    "daysPerWeek": 5,
    "shiftTiming": "5 PM - 9 PM"
  },
  "requirements": {
    "minimumExperience": 2,
    "skills": ["Cooking", "Food Safety"],
    "education": "High School"
  },
  "benefits": ["Free Meals"],
  "expiryDate": "2024-02-15T00:00:00.000Z"
}
```

---

### 2.4 Get Employer's Jobs
```http
GET /api/jobs/employer/my-jobs?status=open&page=1&limit=10
Authorization: Bearer <token>
```

---

### 2.5 Update Job
```http
PUT /api/jobs/:id
Authorization: Bearer <token>
Content-Type: application/json
```

---

### 2.6 Delete Job
```http
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

---

### 2.7 Close Job
```http
PUT /api/jobs/:id/close
Authorization: Bearer <token>
```

---

### 2.8 Reopen Job
```http
PUT /api/jobs/:id/reopen
Authorization: Bearer <token>
```

---

## 📝 3. Applications

### 3.1 Apply for Job (Applicant)
```http
POST /api/applications/:jobId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "coverLetter": "I am very interested in this position...",
  "expectedSalary": 250
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "60d5ecb54f7e2d0015c8f900",
    "job": {
      "_id": "60d5ecb54f7e2d0015c8f890",
      "title": "Chef Required"
    },
    "applicant": {
      "_id": "60d5ecb54f7e2d0015c8f883",
      "name": "Jane Smith"
    },
    "employer": {
      "_id": "60d5ecb54f7e2d0015c8f882",
      "storeName": "Tech Cafe"
    },
    "coverLetter": "I am very interested...",
    "expectedSalary": 250,
    "status": "applied",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3.2 Get My Applications (Applicant)
```http
GET /api/applications/my-applications?status=applied&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: applied, reviewing, accepted, rejected, withdrawn

---

### 3.3 Get Job Applications (Employer)
```http
GET /api/applications/job/:jobId?status=applied&page=1&limit=10
Authorization: Bearer <token>
```

---

### 3.4 Get Single Application
```http
GET /api/applications/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54f7e2d0015c8f900",
    "job": { ... },
    "applicant": {
      "_id": "60d5ecb54f7e2d0015c8f883",
      "name": "Jane Smith",
      "phone": "9876543211",
      "email": "jane@example.com",
      "skills": ["Cooking"],
      "experience": 3,
      "resume": {
        "url": "https://cloudinary.com/...",
        "publicId": "resume_123"
      }
    },
    "status": "applied",
    "statusHistory": [
      {
        "status": "applied",
        "updatedBy": "60d5ecb54f7e2d0015c8f883",
        "updatedByModel": "Applicant",
        "note": "Application submitted",
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3.5 Accept Application (Employer)
```http
PUT /api/applications/:id/accept
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "note": "Great profile, welcome aboard!"
}
```

---

### 3.6 Reject Application (Employer)
```http
PUT /api/applications/:id/reject
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rejectionReason": "Position has been filled"
}
```

> **⚠️ CRITICAL:** Field name is `rejectionReason`, NOT `rejectReason`

---

### 3.7 Withdraw Application (Applicant)
```http
PUT /api/applications/:id/withdraw
Authorization: Bearer <token>
```

---

## ⏰ 4. Shifts

### 4.1 Create Shift (Employer)
```http
POST /api/shifts
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobId": "60d5ecb54f7e2d0015c8f890",
  "applicantId": "60d5ecb54f7e2d0015c8f883",
  "date": "2024-01-20",
  "startTime": "09:00",
  "endTime": "17:00",
  "location": "Tech Cafe, 123 Main St, Mumbai",
  "instructions": "Please arrive 15 minutes early",
  "paymentAmount": 1600
}
```

**Validation:**
- `startTime` and `endTime` must be in `HH:MM` format (24-hour)
- Applicant must have an accepted application for the job

---

### 4.2 Get Employer Shifts
```http
GET /api/shifts/employer/my-shifts?status=scheduled&date=2024-01-20&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: scheduled, confirmed, in-progress, completed, cancelled
- `date`: Filter by specific date (YYYY-MM-DD)

---

### 4.3 Get Applicant Shifts
```http
GET /api/shifts/applicant/my-shifts?status=scheduled&page=1&limit=10
Authorization: Bearer <token>
```

---

### 4.4 Get Single Shift
```http
GET /api/shifts/:id
Authorization: Bearer <token>
```

---

### 4.5 Update Shift (Employer)
```http
PUT /api/shifts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2024-01-21",
  "startTime": "10:00",
  "endTime": "18:00",
  "instructions": "Updated instructions"
}
```

> Cannot update completed or cancelled shifts

---

### 4.6 Confirm Shift (Applicant)
```http
PUT /api/shifts/:id/confirm
Authorization: Bearer <token>
```

---

### 4.7 Cancel Shift (Employer/Applicant)
```http
PUT /api/shifts/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "cancellationReason": "Scheduling conflict"
}
```

---

### 4.8 Delete Shift (Employer)
```http
DELETE /api/shifts/:id
Authorization: Bearer <token>
```

> Can only delete scheduled or cancelled shifts

---

## 📍 5. Attendance

### 5.1 Check In (Applicant)
```http
POST /api/attendance/:shiftId/checkin
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

---

### 5.2 Check Out (Applicant)
```http
POST /api/attendance/:shiftId/checkout
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "remarks": "Completed all tasks"
}
```

---

### 5.3 Get Shift Attendance
```http
GET /api/attendance/shift/:shiftId
Authorization: Bearer <token>
```

---

### 5.4 Get Employer Attendance Records
```http
GET /api/attendance/employer/records?status=present&isApproved=false&page=1&limit=10
Authorization: Bearer <token>
```

---

### 5.5 Get Applicant Attendance History
```http
GET /api/attendance/applicant/history?page=1&limit=10
Authorization: Bearer <token>
```

---

### 5.6 Approve Attendance (Employer)
```http
PUT /api/attendance/:id/approve
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "employerRemarks": "Good work today!"
}
```

---

### 5.7 Mark Manual Attendance (Employer)
```http
POST /api/attendance/manual
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "shiftId": "60d5ecb54f7e2d0015c8f905",
  "checkInTime": "2024-01-20T09:00:00.000Z",
  "checkOutTime": "2024-01-20T17:00:00.000Z",
  "status": "present",
  "employerRemarks": "Manual entry"
}
```

---

## 📨 6. Job Requests

### 6.1 Send Job Request (Employer)
```http
POST /api/job-requests
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "applicantId": "60d5ecb54f7e2d0015c8f883",
  "jobTitle": "Weekend Chef",
  "jobDescription": "Need chef for weekend service",
  "shiftType": "weekends-only",
  "location": "Mumbai, Bandra",
  "offeredHourlyRate": 200,
  "message": "Would love to have you join our team!"
}
```

---

### 6.2 Get Employer Sent Requests
```http
GET /api/job-requests/employer/sent?status=sent&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: sent, accepted, declined, expired

---

### 6.3 Get Applicant Received Requests
```http
GET /api/job-requests/applicant/received?status=sent&page=1&limit=10
Authorization: Bearer <token>
```

---

### 6.4 Get Single Job Request
```http
GET /api/job-requests/:id
Authorization: Bearer <token>
```

---

### 6.5 Accept Job Request (Applicant)
```http
PUT /api/job-requests/:id/accept
Authorization: Bearer <token>
```

---

### 6.6 Decline Job Request (Applicant)
```http
PUT /api/job-requests/:id/decline
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "declineReason": "Not available on weekends"
}
```

---

## 🔍 7. Employer-Applicant Browse

### 7.1 Browse Applicants
```http
GET /api/employer/applicants?jobCategory=food-service&preferredShiftType=evening&preferredWorkLocation=Mumbai&minHourlyRate=100&maxHourlyRate=300&availableDay=Monday&search=John&page=1&limit=10&sortBy=experience&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| jobCategory | string | Filter by job category |
| preferredShiftType | string | Filter by shift preference |
| preferredWorkLocation | string | Filter by location |
| minHourlyRate | number | Minimum hourly rate |
| maxHourlyRate | number | Maximum hourly rate |
| availableDay | string | Single day filter |
| search | string | Search by name |
| sortBy | string | createdAt, expectedHourlyRate, experience |
| order | string | asc, desc |

---

### 7.2 Get Applicant Profile (Employer View)
```http
GET /api/employer/applicants/:id
Authorization: Bearer <token>
```

---

### 7.3 Save Employer Filters
```http
PUT /api/employer/saved-filters
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobCategories": ["food-service", "retail"],
  "preferredShiftType": "evening",
  "preferredWorkLocation": "Mumbai",
  "minHourlyRate": 100,
  "maxHourlyRate": 300,
  "availableDays": ["Monday", "Tuesday", "Wednesday"]
}
```

---

### 7.4 Get Saved Filters
```http
GET /api/employer/saved-filters
Authorization: Bearer <token>
```

---

## ⭐ 8. Shortlist

### 8.1 Add to Shortlist
```http
POST /api/shortlist
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "applicantId": "60d5ecb54f7e2d0015c8f883",
  "notes": "Great communication skills",
  "label": "Top Pick"
}
```

---

### 8.2 Get Shortlist
```http
GET /api/shortlist?page=1&limit=10
Authorization: Bearer <token>
```

---

### 8.3 Check if Shortlisted
```http
GET /api/shortlist/check/:applicantId
Authorization: Bearer <token>
```

---

### 8.4 Update Shortlist Entry
```http
PUT /api/shortlist/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Updated notes",
  "label": "Follow Up"
}
```

---

### 8.5 Remove from Shortlist
```http
DELETE /api/shortlist/:id
Authorization: Bearer <token>
```

---

## 🔔 9. Notifications

### 9.1 Get Notifications
```http
GET /api/notifications?isRead=false&page=1&limit=20
Authorization: Bearer <token>
```

---

### 9.2 Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

---

### 9.3 Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

---

### 9.4 Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

---

### 9.5 Dismiss Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

> Soft delete - sets `isDismissed: true`

---

## 📄 10. Resume

### 10.1 Upload Resume (Applicant)
```http
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
- File field name: `resume`
- Accepted types: PDF, DOC, DOCX
- Max size: 5MB

---

### 10.2 Delete Resume (Applicant)
```http
DELETE /api/resume
Authorization: Bearer <token>
```

---

### 10.3 Get Applicant Resume (Employer)
```http
GET /api/resume/:applicantId
Authorization: Bearer <token>
```

---

## 🏷️ 11. Categories

### 11.1 Get All Categories
```http
GET /api/categories
```

---

### 11.2 Create Category (Admin)
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json
```

### 11.3 Update Category (Admin)
```http
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json
```

### 11.4 Delete Category (Admin)
```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

---

## 👨‍💼 12. Admin

### 12.1 Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

> **⚠️ NOTE:** `recentJobs` and `recentApplications` are embedded in this response. Do NOT make separate API calls for them.

---

### 12.2 Get All Employers
```http
GET /api/admin/employers?isApproved=false&isBlocked=false&businessType=restaurant&search=tech&page=1&limit=10
Authorization: Bearer <token>
```

---

### 12.3 Approve Employer
```http
PUT /api/admin/employers/:id/approve
Authorization: Bearer <token>
```

---

### 12.4 Block Employer
```http
PUT /api/admin/employers/:id/block
Authorization: Bearer <token>
```

---

### 12.5 Unblock Employer
```http
PUT /api/admin/employers/:id/unblock
Authorization: Bearer <token>
```

---

### 12.6 Get All Applicants
```http
GET /api/admin/applicants?isActive=true&search=john&page=1&limit=10
Authorization: Bearer <token>
```

---

### 12.7 Deactivate Applicant
```http
PUT /api/admin/applicants/:id/deactivate
Authorization: Bearer <token>
```

> **⚠️ CRITICAL:** There is NO `activate` endpoint. Admin can only DEACTIVATE.

---

### 12.8 Delete Job (Admin)
```http
DELETE /api/admin/jobs/:id
Authorization: Bearer <token>
```

> **⚠️ CRITICAL:** Admin can only DELETE jobs, not close them. Use the public `GET /api/jobs` endpoint for listing jobs.

---

## 📊 13. Response Formats

### Success Response Structure
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Paginated Response Structure
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

---

## ⚠️ 14. Error Handling

### HTTP Status Codes
| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request body/params |
| 401 | Unauthorized | Token missing/invalid - redirect to login |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Retry or contact support |

---

## ⚛️ 15. React API Client

### Axios Setup

```typescript
// src/api/client.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        const errorMessage = error.response?.data?.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }

  // File upload
  async uploadFile<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    return this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export const apiClient = new ApiClient();
```

### API Hooks with TanStack Query

```typescript
// src/hooks/useJobs.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Types
interface Job {
  _id: string;
  title: string;
  description: string;
  jobType: string;
  salary: {
    amount: number;
    period: string;
  };
  location: {
    city: string;
    state: string;
  };
  employer: {
    storeName: string;
    businessType: string;
  };
  status: string;
  totalApplications: number;
  views: number;
  createdAt: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface JobFilters {
  page?: number;
  limit?: number;
  jobType?: string;
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  search?: string;
  category?: string;
  status?: string;
}

// Hook to fetch jobs
export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => apiClient.get<JobsResponse>('/jobs', { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch single job
export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => apiClient.get<{ success: boolean; data: Job }>(`/jobs/${id}`),
    enabled: !!id,
  });
}

// Hook to create job
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Job>) => apiClient.post('/jobs', data),
    onSuccess: () => {
      // Invalidate jobs list cache
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// Hook to apply for job
export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { coverLetter: string; expectedSalary: number } }) =>
      apiClient.post(`/applications/${jobId}`, data),
    onSuccess: (_, variables) => {
      // Invalidate job detail cache
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      // Invalidate applications cache
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

### API Service Modules

```typescript
// src/api/auth.ts

import { apiClient } from './client';

export const authApi = {
  login: (data: { identifier: string; password: string; userType: string }) =>
    apiClient.post<{ token: string; user: User }>('/auth/login', data),

  signup: (data: unknown, userType: 'applicant' | 'employer') =>
    apiClient.post<{ token: string; user: User }>(`/auth/${userType}/signup`, data),

  getMe: () => apiClient.get<{ success: boolean; data: User }>('/auth/me'),

  updateProfile: (data: unknown) =>
    apiClient.put<{ success: boolean; data: User }>('/auth/me', data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/update-password', data),

  logout: () => apiClient.post('/auth/logout'),

  getUnreadCount: () =>
    apiClient.get<{ success: boolean; data: { unreadCount: number } }>('/notifications/unread-count'),
};

// src/api/jobs.ts

export const jobsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<JobsResponse>('/jobs', { params }),

  getById: (id: string) =>
    apiClient.get<{ success: boolean; data: Job }>(`/jobs/${id}`),

  getEmployerJobs: (params?: Record<string, unknown>) =>
    apiClient.get<JobsResponse>('/jobs/employer/my-jobs', { params }),

  create: (data: Partial<Job>) =>
    apiClient.post('/jobs', data),

  update: (id: string, data: Partial<Job>) =>
    apiClient.put(`/jobs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/jobs/${id}`),

  close: (id: string) =>
    apiClient.put(`/jobs/${id}/close`),

  reopen: (id: string) =>
    apiClient.put(`/jobs/${id}/reopen`),
};
```

---

## ⚠️ Critical Implementation Notes

### 1. Employer Dashboard - Recent Applications
```typescript
// ❌ WRONG - This endpoint does NOT exist
const { data } = useQuery(['recent-applications'], () =>
  apiClient.get('/api/applications/employer/recent?limit=5')
);

// ✅ CORRECT - Fetch applications per job
const useRecentApplications = () => {
  const { data: jobs } = useJobs({ limit: 5 });
  
  return useQueries({
    queries: (jobs?.data || []).map(job => ({
      queryKey: ['applications', job._id],
      queryFn: () => apiClient.get(`/api/applications/job/${job._id}?limit=1`),
    })),
  });
};
```

### 2. Admin Stats Endpoint
```typescript
// ❌ WRONG
GET /api/admin/stats

// ✅ CORRECT
GET /api/admin/dashboard/stats
```

### 3. Reject Application Field Name
```typescript
// ❌ WRONG
await apiClient.put(`/api/applications/${id}/reject`, {
  rejectReason: 'Not a fit'
});

// ✅ CORRECT
await apiClient.put(`/api/applications/${id}/reject`, {
  rejectionReason: 'Not a fit'
});
```

### 4. Admin Cannot Activate Applicants
```typescript
// ❌ WRONG - This does NOT exist
PUT /api/admin/applicants/${id}/activate

// ✅ CORRECT - Admin can only deactivate
PUT /api/admin/applicants/${id}/deactivate
```

### 5. Admin Job Operations
```typescript
// ❌ WRONG - Admin CANNOT close jobs
await apiClient.put(`/api/admin/jobs/${id}/close`);

// ✅ CORRECT - Admin can only delete
await apiClient.delete(`/api/admin/jobs/${id}`);

// ❌ WRONG - No admin-specific job listing
await apiClient.get('/api/admin/jobs');

// ✅ CORRECT - Use public endpoint
await apiClient.get('/api/jobs');
```

---

**End of React API Documentation**
