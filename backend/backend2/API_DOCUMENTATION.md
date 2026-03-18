# ShiftMaster - Complete API & Features Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Features by User Role](#features-by-user-role)
6. [Authentication & Authorization](#authentication--authorization)
7. [Notification System](#notification-system)
8. [Business Rules](#business-rules)
9. [Security Features](#security-features)

---

## 📊 Project Overview

**ShiftMaster** is a comprehensive job management platform that connects employers with applicants for shift-based and full-time jobs. The platform includes:

- **40+ API Endpoints**
- **7 Database Models**
- **3 User Roles** (Employer, Applicant, Admin)
- **Email & SMS Notifications**
- **File Upload Support**
- **Location Tracking**
- **Attendance Management**

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB with Mongoose ODM v8.1.0

### Authentication & Security
- **JWT**: jsonwebtoken v9.0.2
- **Password Hashing**: bcryptjs v2.4.3
- **Security Headers**: helmet v7.1.0
- **CORS**: cors v2.8.5
- **Validation**: joi v17.12.0

### External Services
- **Email**: nodemailer v6.9.8 (Gmail SMTP)
- **SMS**: twilio v4.20.0
- **File Upload**: cloudinary v1.41.0 + multer v1.4.5

### Development Tools
- **Auto-reload**: nodemon v3.0.3
- **HTTP Logger**: morgan v1.10.0
- **Environment Variables**: dotenv v16.4.1

---

## 🗄️ Database Models

### 1. **Employer Model**
Represents business owners who post jobs.

**Fields:**
- `storeName` (String, required) - Business name
- `ownerName` (String, required) - Owner's full name
- `email` (String, required, unique) - Email address
- `phone` (String, required, unique) - 10-digit phone number
- `password` (String, required, hashed) - Minimum 6 characters
- `address` (Object)
  - `street` (String)
  - `city` (String, required)
  - `state` (String, required)
  - `pincode` (String, required) - 6-digit pincode
- `businessType` (String, enum) - restaurant, retail, logistics, healthcare, hospitality, other
- `businessDescription` (String)
- `isApproved` (Boolean, default: false) - Admin approval status
- `isBlocked` (Boolean, default: false) - Admin block status
- `approvedBy` (ObjectId, ref: Admin)
- `approvedAt` (Date)
- `totalJobsPosted` (Number, default: 0)
- `activeJobs` (Number, default: 0)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `comparePassword(candidatePassword)` - Verify password

**Hooks:**
- Pre-save: Hash password with bcrypt

---

### 2. **Applicant Model**
Represents job seekers.

**Fields:**
- `name` (String, required) - Full name
- `phone` (String, required, unique) - 10-digit phone number
- `email` (String, unique, sparse) - Optional email
- `password` (String, required, hashed) - Minimum 6 characters
- `skills` (Array of Strings) - List of skills
- `experience` (Number, default: 0) - Years of experience
- `preferredJobType` (String, enum) - full-time, part-time, shift, contract
- `availability` (Object)
  - `days` (Array) - Monday-Sunday
  - `timeSlots` (Array) - morning, afternoon, evening, night
- `resume` (Object)
  - `url` (String) - Cloudinary URL
  - `publicId` (String) - Cloudinary public ID
- `isActive` (Boolean, default: true) - Account status
- `totalApplications` (Number, default: 0)
- `acceptedApplications` (Number, default: 0)
- `completedShifts` (Number, default: 0)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `comparePassword(candidatePassword)` - Verify password

**Hooks:**
- Pre-save: Hash password with bcrypt

---

### 3. **Job Model**
Represents job postings.

**Fields:**
- `employer` (ObjectId, ref: Employer, required)
- `title` (String, required) - Job title
- `description` (String, required) - Job description
- `jobType` (String, enum, required) - full-time, part-time, shift, contract
- `salary` (Object, required)
  - `amount` (Number, required, min: 0)
  - `period` (String, enum) - hourly, daily, weekly, monthly, yearly
- `workingHours` (Object)
  - `hoursPerDay` (Number, min: 0)
  - `daysPerWeek` (Number, min: 0, max: 7)
  - `shiftTiming` (String)
- `location` (Object)
  - `address` (String)
  - `city` (String, required)
  - `state` (String, required)
  - `pincode` (String, required) - 6-digit
  - `coordinates` (Object)
    - `latitude` (Number)
    - `longitude` (Number)
- `requirements` (Object)
  - `minimumExperience` (Number, default: 0)
  - `skills` (Array of Strings)
  - `education` (String)
  - `otherRequirements` (String)
- `benefits` (Array of Strings)
- `status` (String, enum, default: 'open') - open, closed, filled
- `totalApplications` (Number, default: 0)
- `acceptedApplicants` (Number, default: 0)
- `views` (Number, default: 0)
- `expiryDate` (Date)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `isAcceptingApplications()` - Check if job is open and not expired

**Indexes:**
- Text search on title and description
- Location index (city, state)
- Job type and status index

---

### 4. **Application Model**
Represents job applications.

**Fields:**
- `job` (ObjectId, ref: Job, required)
- `applicant` (ObjectId, ref: Applicant, required)
- `employer` (ObjectId, ref: Employer, required)
- `coverLetter` (String)
- `expectedSalary` (Number, min: 0)
- `status` (String, enum, default: 'applied') - applied, reviewing, accepted, rejected, withdrawn
- `statusHistory` (Array of Objects)
  - `status` (String, required)
  - `updatedBy` (ObjectId, refPath)
  - `updatedByModel` (String, enum) - Employer, Applicant, Admin
  - `note` (String)
  - `timestamp` (Date, default: now)
- `rejectionReason` (String)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `updateStatus(newStatus, updatedBy, model, note)` - Update status with history tracking

**Indexes:**
- Compound unique index on (job, applicant) - Prevents duplicate applications

---

### 5. **Shift Model**
Represents work shifts.

**Fields:**
- `job` (ObjectId, ref: Job, required)
- `employer` (ObjectId, ref: Employer, required)
- `applicant` (ObjectId, ref: Applicant, required)
- `date` (Date, required) - Shift date
- `startTime` (String, required) - HH:MM format
- `endTime` (String, required) - HH:MM format
- `location` (String, required)
- `instructions` (String)
- `status` (String, enum, default: 'scheduled') - scheduled, confirmed, in-progress, completed, cancelled, no-show
- `confirmedByApplicant` (Boolean, default: false)
- `confirmedAt` (Date)
- `cancelledBy` (ObjectId, refPath)
- `cancelledByModel` (String, enum) - Employer, Applicant
- `cancellationReason` (String)
- `cancelledAt` (Date)
- `completedAt` (Date)
- `paymentAmount` (Number, min: 0)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `canBeCancelled()` - Check if shift can be cancelled (scheduled or confirmed status)

**Indexes:**
- Employer and date
- Applicant and date
- Status and date

---

### 6. **Attendance Model**
Represents attendance records.

**Fields:**
- `shift` (ObjectId, ref: Shift, required, unique)
- `applicant` (ObjectId, ref: Applicant, required)
- `employer` (ObjectId, ref: Employer, required)
- `job` (ObjectId, ref: Job, required)
- `checkIn` (Object)
  - `time` (Date)
  - `location` (Object)
    - `latitude` (Number)
    - `longitude` (Number)
  - `method` (String, enum, default: 'app') - app, manual
- `checkOut` (Object)
  - `time` (Date)
  - `location` (Object)
    - `latitude` (Number)
    - `longitude` (Number)
  - `method` (String, enum, default: 'app') - app, manual
- `totalHours` (Number, min: 0)
- `status` (String, enum, default: 'present') - present, absent, late, half-day
- `isLate` (Boolean, default: false)
- `lateByMinutes` (Number, default: 0, min: 0)
- `isApproved` (Boolean, default: false)
- `approvedBy` (ObjectId, ref: Employer)
- `approvedAt` (Date)
- `applicantRemarks` (String)
- `employerRemarks` (String)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

**Methods:**
- `calculateTotalHours()` - Calculate hours between check-in and check-out
- `checkIfLate(expectedStartTime)` - Check if check-in was late (>15 min = late status)

**Indexes:**
- Applicant and createdAt (descending)
- Employer and createdAt (descending)
- Shift

---

### 7. **Admin Model**
Represents platform administrators.

**Fields:**
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum, default: 'admin') - admin, super-admin
- `permissions` (Array of Strings)
- `isActive` (Boolean, default: true)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. **Employer Signup**
- **Endpoint**: `POST /api/auth/employer/signup`
- **Access**: Public
- **Description**: Register a new employer account
- **Request Body**:
```json
{
  "storeName": "ABC Store",
  "ownerName": "John Doe",
  "email": "employer@example.com",
  "phone": "9876543210",
  "password": "password123",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "businessType": "retail",
  "businessDescription": "Electronics retail store"
}
```
- **Response**: User object + JWT token
- **Note**: Account requires admin approval before posting jobs

#### 2. **Applicant Signup**
- **Endpoint**: `POST /api/auth/applicant/signup`
- **Access**: Public
- **Description**: Register a new applicant account
- **Request Body**:
```json
{
  "name": "Jane Smith",
  "phone": "9876543211",
  "email": "applicant@example.com",
  "password": "password123",
  "skills": ["customer service", "sales"],
  "experience": 2,
  "preferredJobType": "part-time"
}
```
- **Response**: User object + JWT token

#### 3. **Login**
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Login for all user types
- **Request Body**:
```json
{
  "identifier": "email@example.com or 9876543210",
  "password": "password123",
  "userType": "employer | applicant | admin"
}
```
- **Response**: User object + JWT token

#### 4. **Get Current User**
- **Endpoint**: `GET /api/auth/me`
- **Access**: Protected (All authenticated users)
- **Description**: Get current logged-in user details
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

#### 5. **Update Password**
- **Endpoint**: `PUT /api/auth/update-password`
- **Access**: Protected (All authenticated users)
- **Description**: Update user password
- **Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### 6. **Logout**
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Protected (All authenticated users)
- **Description**: Logout user (client-side token removal)

---

### Job Routes (`/api/jobs`)

#### 1. **Get All Jobs**
- **Endpoint**: `GET /api/jobs`
- **Access**: Public
- **Description**: Get all jobs with filtering and pagination
- **Query Parameters**:
  - `page` (Number, default: 1)
  - `limit` (Number, default: 10)
  - `jobType` (String) - full-time, part-time, shift, contract
  - `city` (String)
  - `state` (String)
  - `minSalary` (Number)
  - `maxSalary` (Number)
  - `search` (String) - Text search in title/description
  - `status` (String, default: 'open')
- **Response**: Array of jobs + pagination info

#### 2. **Get Single Job**
- **Endpoint**: `GET /api/jobs/:id`
- **Access**: Public
- **Description**: Get detailed job information
- **Response**: Job object with employer details

#### 3. **Create Job**
- **Endpoint**: `POST /api/jobs`
- **Access**: Protected (Employer, Approved, Not Blocked)
- **Description**: Create a new job posting
- **Request Body**:
```json
{
  "title": "Sales Associate",
  "description": "Looking for experienced sales associate",
  "jobType": "full-time",
  "salary": {
    "amount": 25000,
    "period": "monthly"
  },
  "workingHours": {
    "hoursPerDay": 8,
    "daysPerWeek": 6,
    "shiftTiming": "9 AM - 6 PM"
  },
  "location": {
    "address": "123 Market St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "requirements": {
    "minimumExperience": 1,
    "skills": ["sales", "communication"],
    "education": "12th Pass"
  },
  "benefits": ["PF", "Health Insurance"]
}
```

#### 4. **Get Employer's Jobs**
- **Endpoint**: `GET /api/jobs/employer/my-jobs`
- **Access**: Protected (Employer)
- **Description**: Get all jobs posted by the employer
- **Query Parameters**: `page`, `limit`, `status`

#### 5. **Update Job**
- **Endpoint**: `PUT /api/jobs/:id`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Update job details
- **Request Body**: Same as create job (partial updates allowed)

#### 6. **Delete Job**
- **Endpoint**: `DELETE /api/jobs/:id`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Delete a job posting

#### 7. **Close Job**
- **Endpoint**: `PUT /api/jobs/:id/close`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Close job to new applications

#### 8. **Reopen Job**
- **Endpoint**: `PUT /api/jobs/:id/reopen`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Reopen a closed job

---

### Application Routes (`/api/applications`)

#### 1. **Apply for Job**
- **Endpoint**: `POST /api/applications/:jobId`
- **Access**: Protected (Applicant, Active)
- **Description**: Submit job application
- **Request Body**:
```json
{
  "coverLetter": "I am interested in this position...",
  "expectedSalary": 30000
}
```
- **Note**: One application per job per applicant

#### 2. **Get My Applications**
- **Endpoint**: `GET /api/applications/my-applications`
- **Access**: Protected (Applicant)
- **Description**: Get all applications submitted by applicant
- **Query Parameters**: `page`, `limit`, `status`

#### 3. **Get Job Applications**
- **Endpoint**: `GET /api/applications/job/:jobId`
- **Access**: Protected (Employer)
- **Description**: Get all applications for a specific job
- **Query Parameters**: `page`, `limit`, `status`

#### 4. **Get Application Details**
- **Endpoint**: `GET /api/applications/:id`
- **Access**: Protected (Employer or Applicant)
- **Description**: Get detailed application information

#### 5. **Accept Application**
- **Endpoint**: `PUT /api/applications/:id/accept`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Accept an application
- **Request Body**:
```json
{
  "note": "Welcome aboard!"
}
```
- **Triggers**: Email + SMS notification to applicant

#### 6. **Reject Application**
- **Endpoint**: `PUT /api/applications/:id/reject`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Reject an application
- **Request Body**:
```json
{
  "rejectionReason": "Position filled",
  "note": "Thank you for applying"
}
```
- **Triggers**: Email notification to applicant

#### 7. **Withdraw Application**
- **Endpoint**: `PUT /api/applications/:id/withdraw`
- **Access**: Protected (Applicant)
- **Description**: Withdraw a submitted application

---

### Shift Routes (`/api/shifts`)

#### 1. **Create Shift**
- **Endpoint**: `POST /api/shifts`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Create a work shift for accepted applicant
- **Request Body**:
```json
{
  "jobId": "job_id",
  "applicantId": "applicant_id",
  "date": "2024-02-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "location": "Store Address",
  "instructions": "Report to manager on arrival",
  "paymentAmount": 1000
}
```
- **Triggers**: Email + SMS notification to applicant

#### 2. **Get Employer Shifts**
- **Endpoint**: `GET /api/shifts/employer/my-shifts`
- **Access**: Protected (Employer)
- **Description**: Get all shifts created by employer
- **Query Parameters**: `page`, `limit`, `status`, `date`

#### 3. **Get Applicant Shifts**
- **Endpoint**: `GET /api/shifts/applicant/my-shifts`
- **Access**: Protected (Applicant)
- **Description**: Get all shifts assigned to applicant
- **Query Parameters**: `page`, `limit`, `status`, `date`

#### 4. **Get Shift Details**
- **Endpoint**: `GET /api/shifts/:id`
- **Access**: Protected (Employer or Applicant)
- **Description**: Get detailed shift information

#### 5. **Update Shift**
- **Endpoint**: `PUT /api/shifts/:id`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Update shift details
- **Request Body**: Partial shift object

#### 6. **Confirm Shift**
- **Endpoint**: `PUT /api/shifts/:id/confirm`
- **Access**: Protected (Applicant, Active)
- **Description**: Confirm shift attendance

#### 7. **Cancel Shift**
- **Endpoint**: `PUT /api/shifts/:id/cancel`
- **Access**: Protected (Employer or Applicant)
- **Description**: Cancel a shift
- **Request Body**:
```json
{
  "cancellationReason": "Personal emergency"
}
```

#### 8. **Delete Shift**
- **Endpoint**: `DELETE /api/shifts/:id`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Delete a shift

---

### Attendance Routes (`/api/attendance`)

#### 1. **Check In**
- **Endpoint**: `POST /api/attendance/:shiftId/checkin`
- **Access**: Protected (Applicant, Active)
- **Description**: Check in for a shift
- **Request Body**:
```json
{
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "remarks": "Arrived on time"
}
```
- **Note**: Only allowed on shift date

#### 2. **Check Out**
- **Endpoint**: `POST /api/attendance/:shiftId/checkout`
- **Access**: Protected (Applicant, Active)
- **Description**: Check out from a shift
- **Request Body**:
```json
{
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "remarks": "Completed all tasks"
}
```
- **Note**: Requires prior check-in

#### 3. **Get Shift Attendance**
- **Endpoint**: `GET /api/attendance/shift/:shiftId`
- **Access**: Protected (Employer or Applicant)
- **Description**: Get attendance record for a shift

#### 4. **Get Employer Attendance Records**
- **Endpoint**: `GET /api/attendance/employer/records`
- **Access**: Protected (Employer)
- **Description**: Get all attendance records for employer's shifts
- **Query Parameters**: `page`, `limit`, `status`, `isApproved`

#### 5. **Get Applicant Attendance History**
- **Endpoint**: `GET /api/attendance/applicant/history`
- **Access**: Protected (Applicant)
- **Description**: Get applicant's attendance history
- **Query Parameters**: `page`, `limit`, `status`

#### 6. **Approve Attendance**
- **Endpoint**: `PUT /api/attendance/:id/approve`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Approve an attendance record
- **Request Body**:
```json
{
  "remarks": "Good work"
}
```

#### 7. **Mark Manual Attendance**
- **Endpoint**: `POST /api/attendance/manual`
- **Access**: Protected (Employer, Not Blocked)
- **Description**: Manually mark attendance for an applicant
- **Request Body**:
```json
{
  "shiftId": "shift_id",
  "checkInTime": "2024-02-15T09:00:00Z",
  "checkOutTime": "2024-02-15T17:00:00Z",
  "status": "present",
  "remarks": "Manually marked"
}
```

---

### Admin Routes (`/api/admin`)

All admin routes require authentication and admin role.

#### 1. **Get Dashboard Stats**
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Access**: Protected (Admin)
- **Description**: Get platform statistics
- **Response**:
```json
{
  "totalEmployers": 150,
  "pendingEmployers": 25,
  "approvedEmployers": 120,
  "blockedEmployers": 5,
  "totalApplicants": 500,
  "activeApplicants": 480,
  "totalJobs": 300,
  "openJobs": 150,
  "totalApplications": 1200,
  "totalShifts": 800,
  "completedShifts": 600
}
```

#### 2. **Get All Employers**
- **Endpoint**: `GET /api/admin/employers`
- **Access**: Protected (Admin)
- **Description**: Get all employers with filters
- **Query Parameters**: `page`, `limit`, `isApproved`, `isBlocked`

#### 3. **Approve Employer**
- **Endpoint**: `PUT /api/admin/employers/:id/approve`
- **Access**: Protected (Admin)
- **Description**: Approve an employer account
- **Triggers**: Email notification to employer

#### 4. **Block Employer**
- **Endpoint**: `PUT /api/admin/employers/:id/block`
- **Access**: Protected (Admin)
- **Description**: Block an employer account
- **Request Body**:
```json
{
  "reason": "Violation of terms"
}
```

#### 5. **Unblock Employer**
- **Endpoint**: `PUT /api/admin/employers/:id/unblock`
- **Access**: Protected (Admin)
- **Description**: Unblock an employer account

#### 6. **Get All Applicants**
- **Endpoint**: `GET /api/admin/applicants`
- **Access**: Protected (Admin)
- **Description**: Get all applicants with filters
- **Query Parameters**: `page`, `limit`, `isActive`

#### 7. **Deactivate Applicant**
- **Endpoint**: `PUT /api/admin/applicants/:id/deactivate`
- **Access**: Protected (Admin)
- **Description**: Deactivate an applicant account
- **Request Body**:
```json
{
  "reason": "Violation of terms"
}
```

#### 8. **Delete Job (Moderation)**
- **Endpoint**: `DELETE /api/admin/jobs/:id`
- **Access**: Protected (Admin)
- **Description**: Delete a job posting (content moderation)
- **Request Body**:
```json
{
  "reason": "Inappropriate content"
}
```

---

## 🎯 Features by User Role

### 👔 Employer Features

1. **Account Management**
   - Register with business details
   - Wait for admin approval
   - Update profile information
   - Change password

2. **Job Management**
   - Post new job listings (after approval)
   - Update job details
   - Close/reopen jobs
   - Delete jobs
   - View job statistics (applications, views)

3. **Application Management**
   - View all applications for jobs
   - Filter applications by status
   - Accept/reject applications
   - View applicant profiles

4. **Shift Management**
   - Create shifts for accepted applicants
   - Update shift details
   - Cancel shifts
   - View all scheduled shifts
   - Track shift status

5. **Attendance Management**
   - View attendance records
   - Approve attendance
   - Mark manual attendance
   - View attendance statistics
   - Add remarks to attendance

6. **Notifications**
   - Email notifications for new applications
   - SMS notifications for shift confirmations

---

### 👤 Applicant Features

1. **Account Management**
   - Register with personal details
   - Upload resume (Cloudinary)
   - Update profile and skills
   - Set availability preferences
   - Change password

2. **Job Search & Application**
   - Browse all open jobs
   - Filter jobs by type, location, salary
   - Search jobs by keywords
   - View job details
   - Apply for jobs with cover letter
   - Track application status
   - Withdraw applications

3. **Shift Management**
   - View assigned shifts
   - Confirm shift attendance
   - Cancel shifts (with reason)
   - View shift history

4. **Attendance**
   - Check in with location tracking
   - Check out with location tracking
   - View attendance history
   - Add remarks to attendance
   - Track total hours worked

5. **Notifications**
   - Email for application status updates
   - SMS for application acceptance
   - Email + SMS for shift assignments

---

### 🛡️ Admin Features

1. **Dashboard**
   - View platform statistics
   - Monitor user activity
   - Track job postings
   - View application metrics

2. **Employer Management**
   - View all employers
   - Approve pending employers
   - Block/unblock employers
   - View employer details

3. **Applicant Management**
   - View all applicants
   - Deactivate applicants
   - View applicant details

4. **Content Moderation**
   - Delete inappropriate jobs
   - Monitor platform content

5. **Platform Analytics**
   - Total users by type
   - Job posting trends
   - Application statistics
   - Shift completion rates

---

## 🔐 Authentication & Authorization

### JWT Token System

**Token Generation:**
- Issued on successful login/signup
- Contains: userId, userType, role
- Expiration: 7 days (configurable)
- Algorithm: HS256

**Token Usage:**
```
Authorization: Bearer <jwt_token>
```

### Middleware Chain

1. **`protect`** - Verify JWT token
2. **`authorize(roles)`** - Check user role
3. **`checkEmployerApproval`** - Verify employer is approved
4. **`checkEmployerBlocked`** - Verify employer is not blocked
5. **`checkApplicantActive`** - Verify applicant is active

### Role-Based Access Control

| Route | Employer | Applicant | Admin |
|-------|----------|-----------|-------|
| POST /jobs | ✅ (Approved) | ❌ | ❌ |
| POST /applications/:jobId | ❌ | ✅ (Active) | ❌ |
| POST /shifts | ✅ (Not Blocked) | ❌ | ❌ |
| POST /attendance/:shiftId/checkin | ❌ | ✅ (Active) | ❌ |
| GET /admin/dashboard/stats | ❌ | ❌ | ✅ |

---

## 📧 Notification System

### Email Notifications

**Templates:**
1. **Employer Signup** - Pending approval message
2. **Employer Approval** - Account approved notification
3. **Applicant Signup** - Welcome message
4. **Application Status** - Status change notifications
5. **Shift Assignment** - New shift notification

**Configuration:**
- Service: Gmail SMTP
- Port: 587
- Security: STARTTLS
- From: ShiftMaster <noreply@shiftmaster.com>

### SMS Notifications

**Triggers:**
1. Application accepted
2. Shift assigned
3. Shift reminders (can be implemented)

**Configuration:**
- Service: Twilio
- Format: Plain text
- Character limit: 160

### Notification Service

**File**: `src/services/notificationService.js`

**Methods:**
- `sendApplicationAcceptedNotification(application)`
- `sendShiftAssignedNotification(shift)`
- `sendEmployerApprovalNotification(employer)`

---

## 📜 Business Rules

### Critical Rules

1. **Employer Approval Workflow**
   - New employers: `isApproved = false`
   - Cannot post jobs until approved
   - Admin must manually approve
   - Email sent on approval

2. **Application Uniqueness**
   - One application per job per applicant
   - Enforced by compound unique index
   - Prevents duplicate applications

3. **Shift Creation**
   - Only for accepted applications
   - Requires valid job, employer, applicant
   - Date must be in the future

4. **Attendance Rules**
   - Check-in only on shift date
   - Check-out requires prior check-in
   - Late detection: >15 minutes = "late" status
   - Total hours auto-calculated

5. **Status Transitions**
   - All status changes tracked in history
   - History includes: status, updatedBy, timestamp, note
   - Immutable history (append-only)

6. **Blocking & Deactivation**
   - Blocked employers cannot post jobs or manage applications
   - Inactive applicants cannot apply or check-in
   - Existing shifts/applications remain

### Validation Rules

**Email:**
- Format: `user@domain.com`
- Unique for employers and applicants

**Phone:**
- Format: 10-digit number
- Unique for employers and applicants

**Password:**
- Minimum: 6 characters
- Hashed with bcrypt (10 rounds)

**Pincode:**
- Format: 6-digit number

**Time:**
- Format: HH:MM (24-hour)

**Salary:**
- Minimum: 0 (non-negative)

---

## 🔒 Security Features

### Implemented

1. **Helmet.js**
   - Sets security HTTP headers
   - XSS protection
   - Content Security Policy
   - DNS prefetch control

2. **CORS**
   - Configured for frontend origin
   - Credentials support
   - Method restrictions

3. **Password Security**
   - bcrypt hashing (10 rounds)
   - Never returned in API responses
   - `select: false` in schema

4. **JWT Security**
   - Token expiration (7 days)
   - Secret key from environment
   - Signature verification

5. **Input Validation**
   - Joi schemas for all inputs
   - Type checking
   - Format validation
   - Required field enforcement

6. **MongoDB Security**
   - Mongoose ODM (prevents SQL injection)
   - Schema validation
   - Type casting

7. **Error Handling**
   - Global error handler
   - Sanitized error messages in production
   - Stack traces only in development

### Recommended (Not Implemented)

1. **Rate Limiting**
   - Use `express-rate-limit`
   - Prevent brute force attacks

2. **Redis Caching**
   - Cache frequently accessed data
   - Improve performance

3. **API Versioning**
   - `/api/v1/...`
   - Backward compatibility

4. **Comprehensive Testing**
   - Unit tests (Jest/Mocha)
   - Integration tests
   - E2E tests

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [ ... ],
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

---

## 🚀 Quick Start

### Environment Variables

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shiftmaster

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ShiftMaster <noreply@shiftmaster.com>

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000

# Security
BCRYPT_SALT_ROUNDS=10
```

### Running the Server

```bash
# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

---

## 📝 Notes

### Performance Optimizations

- Database indexes on frequently queried fields
- Pagination on all list endpoints (default: 10 items)
- Selective field population
- Efficient query building
- Connection pooling

### Code Quality

- Clean architecture (MVC pattern)
- Separation of concerns
- DRY principle
- Comprehensive error handling
- Inline documentation
- Consistent naming conventions

---

**Built with ❤️ for ShiftMaster**  
*Version 1.0.0*  
*Last Updated: February 2024*
