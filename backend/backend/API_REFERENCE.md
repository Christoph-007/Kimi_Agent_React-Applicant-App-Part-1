# ShiftMaster API Reference

Complete API endpoint reference with request/response examples.

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Employer Signup
**POST** `/api/auth/employer/signup`

**Request Body:**
```json
{
  "storeName": "Test Restaurant",
  "ownerName": "John Doe",
  "email": "restaurant@example.com",
  "phone": "9876543210",
  "password": "password123",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "businessType": "restaurant",
  "businessDescription": "A fine dining restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "storeName": "Test Restaurant",
    "ownerName": "John Doe",
    "email": "restaurant@example.com",
    "isApproved": false
  }
}
```

### 2. Applicant Signup
**POST** `/api/auth/applicant/signup`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "9876543211",
  "email": "jane@example.com",
  "password": "password123",
  "skills": ["cooking", "customer service"],
  "experience": 2,
  "preferredJobType": "shift"
}
```

### 3. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "identifier": "admin@shiftmaster.com",
  "password": "admin123456",
  "userType": "admin"
}
```

**User Types:** `employer`, `applicant`, `admin`

---

## 💼 Job Endpoints

### 1. Get All Jobs (Public)
**GET** `/api/jobs`

**Query Parameters:**
- `jobType` - Filter by job type (full-time, part-time, shift, contract)
- `city` - Filter by city
- `state` - Filter by state
- `minSalary` - Minimum salary
- `maxSalary` - Maximum salary
- `search` - Search in title/description
- `status` - Job status (open, closed, filled)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order (asc, desc)

**Example:**
```
GET /api/jobs?city=Mumbai&jobType=shift&minSalary=400&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "Waiter Position",
      "description": "Looking for experienced waiters",
      "jobType": "shift",
      "salary": {
        "amount": 500,
        "period": "daily"
      },
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "employer": {
        "storeName": "Test Restaurant"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Create Job (Employer Only)
**POST** `/api/jobs`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body:**
```json
{
  "title": "Waiter Position",
  "description": "Looking for experienced waiters for evening shifts",
  "jobType": "shift",
  "salary": {
    "amount": 500,
    "period": "daily"
  },
  "workingHours": {
    "hoursPerDay": 8,
    "daysPerWeek": 6,
    "shiftTiming": "6 PM - 2 AM"
  },
  "location": {
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "requirements": {
    "minimumExperience": 1,
    "skills": ["customer service", "communication"],
    "education": "High School",
    "otherRequirements": "Must be available on weekends"
  },
  "benefits": ["Food provided", "Tips", "Transportation"],
  "expiryDate": "2026-03-31"
}
```

### 3. Get Employer's Jobs
**GET** `/api/jobs/employer/my-jobs`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Query Parameters:**
- `status` - Filter by status
- `page`, `limit`, `sortBy`, `order`

---

## 📝 Application Endpoints

### 1. Apply for Job (Applicant Only)
**POST** `/api/applications/:jobId`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

**Request Body:**
```json
{
  "coverLetter": "I am very interested in this position...",
  "expectedSalary": 550
}
```

### 2. Get My Applications (Applicant)
**GET** `/api/applications/my-applications`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

**Query Parameters:**
- `status` - Filter by status (applied, reviewing, accepted, rejected, withdrawn)
- `page`, `limit`, `sortBy`, `order`

### 3. Get Job Applications (Employer)
**GET** `/api/applications/job/:jobId`

**Headers:**
```
Authorization: Bearer <employer_token>
```

### 4. Accept Application (Employer)
**PUT** `/api/applications/:id/accept`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body (Optional):**
```json
{
  "note": "Welcome to our team!"
}
```

### 5. Reject Application (Employer)
**PUT** `/api/applications/:id/reject`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body:**
```json
{
  "rejectionReason": "Position already filled"
}
```

---

## 📅 Shift Endpoints

### 1. Create Shift (Employer Only)
**POST** `/api/shifts`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body:**
```json
{
  "jobId": "...",
  "applicantId": "...",
  "date": "2026-02-15",
  "startTime": "18:00",
  "endTime": "02:00",
  "location": "Test Restaurant, 123 Main St, Mumbai",
  "instructions": "Please arrive 15 minutes early",
  "paymentAmount": 500
}
```

### 2. Get My Shifts (Applicant)
**GET** `/api/shifts/applicant/my-shifts`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

**Query Parameters:**
- `status` - Filter by status (scheduled, confirmed, in-progress, completed, cancelled, no-show)
- `date` - Filter by specific date (YYYY-MM-DD)
- `page`, `limit`, `sortBy`, `order`

### 3. Confirm Shift (Applicant)
**PUT** `/api/shifts/:id/confirm`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

### 4. Cancel Shift (Employer/Applicant)
**PUT** `/api/shifts/:id/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cancellationReason": "Emergency - unable to attend"
}
```

---

## ⏰ Attendance Endpoints

### 1. Check In (Applicant Only)
**POST** `/api/attendance/:shiftId/checkin`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

**Request Body:**
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "_id": "...",
    "shift": "...",
    "checkIn": {
      "time": "2026-02-15T18:05:00.000Z",
      "location": {
        "latitude": 19.0760,
        "longitude": 72.8777
      },
      "method": "app"
    },
    "isLate": true,
    "lateByMinutes": 5,
    "status": "present"
  }
}
```

### 2. Check Out (Applicant Only)
**POST** `/api/attendance/:shiftId/checkout`

**Headers:**
```
Authorization: Bearer <applicant_token>
```

**Request Body:**
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "remarks": "Completed all assigned tasks"
}
```

### 3. Get Attendance Records (Employer)
**GET** `/api/attendance/employer/records`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Query Parameters:**
- `status` - Filter by status
- `isApproved` - Filter by approval status (true/false)
- `page`, `limit`, `sortBy`, `order`

### 4. Approve Attendance (Employer)
**PUT** `/api/attendance/:id/approve`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body (Optional):**
```json
{
  "employerRemarks": "Good work today"
}
```

### 5. Mark Manual Attendance (Employer)
**POST** `/api/attendance/manual`

**Headers:**
```
Authorization: Bearer <employer_token>
```

**Request Body:**
```json
{
  "shiftId": "...",
  "checkInTime": "2026-02-15T18:00:00.000Z",
  "checkOutTime": "2026-02-16T02:00:00.000Z",
  "status": "present",
  "employerRemarks": "Manually marked - forgot to check in"
}
```

---

## 👨‍💼 Admin Endpoints

### 1. Get Dashboard Stats
**GET** `/api/admin/dashboard/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "employers": {
      "total": 150,
      "pending": 25,
      "approved": 120,
      "blocked": 5
    },
    "applicants": {
      "total": 1500,
      "active": 1450
    },
    "jobs": {
      "total": 500,
      "open": 350,
      "closed": 150
    },
    "applications": {
      "total": 5000,
      "pending": 1200,
      "accepted": 2500
    },
    "shifts": {
      "total": 10000,
      "upcoming": 500
    },
    "recentJobs": [...],
    "recentApplications": [...]
  }
}
```

### 2. Get All Employers
**GET** `/api/admin/employers`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `isApproved` - Filter by approval status (true/false)
- `isBlocked` - Filter by blocked status (true/false)
- `businessType` - Filter by business type
- `search` - Search in storeName, ownerName, email
- `page`, `limit`, `sortBy`, `order`

### 3. Approve Employer
**PUT** `/api/admin/employers/:id/approve`

**Headers:**
```
Authorization: Bearer <admin_token>
```

### 4. Block Employer
**PUT** `/api/admin/employers/:id/block`

**Headers:**
```
Authorization: Bearer <admin_token>
```

### 5. Get All Applicants
**GET** `/api/admin/applicants`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `isActive` - Filter by active status (true/false)
- `search` - Search in name, email, phone
- `page`, `limit`, `sortBy`, `order`

---

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔒 Common Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Phone number is required, Password must be at least 6 characters"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login."
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "User type 'applicant' is not authorized to access this route"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

## 📝 Notes

1. **Date Format**: Use ISO 8601 format (YYYY-MM-DD or full ISO string)
2. **Time Format**: Use HH:MM (24-hour format)
3. **Phone Format**: 10-digit number without country code
4. **Pincode Format**: 6-digit number
5. **Pagination**: Default page=1, limit=10, max limit=100

---

**For more details, see the complete README.md**
