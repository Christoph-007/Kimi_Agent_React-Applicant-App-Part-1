# ShiftMaster Backend — Complete Features & Functions Reference

> **Generated:** February 18, 2026  
> **Stack:** Node.js · Express.js · MongoDB (Mongoose) · JWT Auth  
> **Base URL:** `/api`  
> **User Roles:** `employer` · `applicant` · `admin`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Models](#2-database-models)
3. [Authentication Module](#3-authentication-module)
4. [Job Management Module](#4-job-management-module)
5. [Application Management Module](#5-application-management-module)
6. [Shift Management Module](#6-shift-management-module)
7. [Attendance Management Module](#7-attendance-management-module)
8. [Admin Panel Module](#8-admin-panel-module)
9. [Middlewares](#9-middlewares)
10. [Notification Services](#10-notification-services)
11. [Input Validation Schemas](#11-input-validation-schemas)
12. [Summary Statistics](#12-summary-statistics)

---

## 1. Architecture Overview

```
backend/
├── server.js                    # Entry point
└── src/
    ├── config/                  # DB & environment config
    ├── controllers/             # Business logic (7 files)
    ├── middlewares/             # Auth, validation, error handling (3 files)
    ├── models/                  # Mongoose schemas (7 files)
    ├── routes/                  # Express routers (6 files)
    ├── services/                # Email & SMS services (3 files)
    └── utils/                   # Helpers, validators, templates (4 files)
```

| Property        | Detail                                      |
| --------------- | ------------------------------------------- |
| Framework       | Express.js                                  |
| Database        | MongoDB via Mongoose                        |
| Authentication  | JWT (Bearer Token in Authorization header)  |
| Validation      | Joi schema validation                       |
| Notifications   | Email (Nodemailer) + SMS                    |
| Password Hashing| bcrypt                                      |

---

## 2. Database Models

### 2.1 Admin
| Field       | Type    | Notes                        |
| ----------- | ------- | ---------------------------- |
| name        | String  | Required                     |
| email       | String  | Required, unique             |
| password    | String  | Hashed, hidden by default    |
| role        | String  | e.g. `superadmin`            |
| isActive    | Boolean | Default: true                |
| lastLogin   | Date    | Updated on each login        |

---

### 2.2 Employer
| Field               | Type    | Notes                                                              |
| ------------------- | ------- | ------------------------------------------------------------------ |
| storeName           | String  | Required                                                           |
| ownerName           | String  | Required                                                           |
| email               | String  | Required, unique                                                   |
| phone               | String  | Required, unique, 10 digits                                        |
| password            | String  | Hashed, hidden by default                                          |
| address             | Object  | `{ street, city, state, pincode }`                                 |
| businessType        | String  | `restaurant` · `retail` · `logistics` · `healthcare` · `hospitality` · `other` |
| businessDescription | String  | Optional                                                           |
| isApproved          | Boolean | Default: false — must be approved by admin before posting jobs     |
| isBlocked           | Boolean | Default: false — blocked employers cannot perform actions          |

---

### 2.3 Applicant
| Field            | Type     | Notes                                              |
| ---------------- | -------- | -------------------------------------------------- |
| name             | String   | Required                                           |
| phone            | String   | Required, unique, 10 digits                        |
| email            | String   | Optional, unique                                   |
| password         | String   | Hashed, hidden by default                          |
| skills           | [String] | Array of skill tags                                |
| experience       | Number   | Years of experience (min 0)                        |
| preferredJobType | String   | `full-time` · `part-time` · `shift` · `contract`  |
| isActive         | Boolean  | Default: true — deactivated by admin if needed     |

---

### 2.4 Job
| Field        | Type     | Notes                                                        |
| ------------ | -------- | ------------------------------------------------------------ |
| title        | String   | Required                                                     |
| description  | String   | Required                                                     |
| jobType      | String   | `full-time` · `part-time` · `shift` · `contract`            |
| salary       | Object   | `{ amount: Number, period: hourly/daily/weekly/monthly/yearly }` |
| workingHours | Object   | `{ hoursPerDay, daysPerWeek, shiftTiming }`                  |
| location     | Object   | `{ address, city, state, pincode, coordinates: {lat, lng} }` |
| requirements | Object   | `{ minimumExperience, skills[], education, otherRequirements }` |
| benefits     | [String] | Array of benefit tags                                        |
| status       | String   | `open` · `closed` · `expired`                                |
| expiryDate   | Date     | Optional expiry                                              |
| employer     | ObjectId | Reference to Employer                                        |

---

### 2.5 Application
| Field       | Type     | Notes                                                  |
| ----------- | -------- | ------------------------------------------------------ |
| job         | ObjectId | Reference to Job                                       |
| applicant   | ObjectId | Reference to Applicant                                 |
| status      | String   | `pending` · `accepted` · `rejected` · `withdrawn`      |
| coverLetter | String   | Optional message from applicant                        |
| appliedAt   | Date     | Auto-set on creation                                   |

---

### 2.6 Shift
| Field         | Type     | Notes                                                   |
| ------------- | -------- | ------------------------------------------------------- |
| job           | ObjectId | Reference to Job                                        |
| applicant     | ObjectId | Reference to Applicant                                  |
| employer      | ObjectId | Reference to Employer                                   |
| date          | Date     | Shift date                                              |
| startTime     | String   | Format: `HH:MM`                                         |
| endTime       | String   | Format: `HH:MM`                                         |
| location      | String   | Shift location                                          |
| status        | String   | `assigned` · `confirmed` · `completed` · `cancelled`    |
| instructions  | String   | Optional notes from employer                            |
| paymentAmount | Number   | Optional payment for this shift                         |

---

### 2.7 Attendance
| Field        | Type     | Notes                                                     |
| ------------ | -------- | --------------------------------------------------------- |
| shift        | ObjectId | Reference to Shift                                        |
| applicant    | ObjectId | Reference to Applicant                                    |
| employer     | ObjectId | Reference to Employer                                     |
| checkInTime  | Date     | Recorded when applicant checks in                         |
| checkOutTime | Date     | Recorded when applicant checks out                        |
| hoursWorked  | Number   | Auto-calculated on checkout                               |
| status       | String   | `present` · `absent` · `late` · `pending-approval`        |
| isManual     | Boolean  | True if marked manually by employer                       |
| notes        | String   | Optional employer notes                                   |

---

## 3. Authentication Module

**Base Route:** `/api/auth`

| Method | Endpoint              | Access  | Controller Function | Description                                      |
| ------ | --------------------- | ------- | ------------------- | ------------------------------------------------ |
| POST   | `/employer/signup`    | Public  | `employerSignup`    | Register a new employer account                  |
| POST   | `/applicant/signup`   | Public  | `applicantSignup`   | Register a new applicant account                 |
| POST   | `/login`              | Public  | `login`             | Login for employer / applicant / admin           |
| GET    | `/me`                 | Private | `getMe`             | Get the currently authenticated user's profile   |
| PUT    | `/update-password`    | Private | `updatePassword`    | Change the authenticated user's password         |
| POST   | `/logout`             | Private | `logout`            | Logout (client removes token; server confirms)   |

### Business Rules
- Employers are created with `isApproved: false` — admin must approve before they can post jobs.
- Login supports **email or phone** as the identifier.
- Blocked employers and deactivated applicants receive a `403` error on login.
- Admin's `lastLogin` timestamp is updated on every successful login.

---

## 4. Job Management Module

**Base Route:** `/api/jobs`

| Method | Endpoint              | Access                   | Controller Function | Description                              |
| ------ | --------------------- | ------------------------ | ------------------- | ---------------------------------------- |
| GET    | `/`                   | Public                   | `getAllJobs`         | List all open jobs with filters          |
| GET    | `/:id`                | Public                   | `getJobById`         | Get full details of a single job         |
| POST   | `/`                   | Employer (Approved only) | `createJob`          | Post a new job listing                   |
| GET    | `/employer/my-jobs`   | Employer                 | `getEmployerJobs`    | View all jobs posted by this employer    |
| PUT    | `/:id`                | Employer (own jobs)      | `updateJob`          | Edit an existing job listing             |
| DELETE | `/:id`                | Employer (own jobs)      | `deleteJob`          | Permanently delete a job listing         |
| PUT    | `/:id/close`          | Employer (own jobs)      | `closeJob`           | Close a job to stop new applications     |
| PUT    | `/:id/reopen`         | Employer (own jobs)      | `reopenJob`          | Reopen a previously closed job           |

### Supported Filters for `GET /`
`jobType` · `city` · `state` · `minSalary` · `maxSalary` · `skills` · `search` (keyword) · `page` · `limit`

### Business Rules
- Only **approved** employers can create jobs (`checkEmployerApproval` middleware).
- Blocked employers cannot create, update, delete, close, or reopen jobs.
- Employers can only modify their **own** job listings.

---

## 5. Application Management Module

**Base Route:** `/api/applications`

| Method | Endpoint              | Access              | Controller Function    | Description                                     |
| ------ | --------------------- | ------------------- | ---------------------- | ----------------------------------------------- |
| POST   | `/:jobId`             | Applicant           | `applyForJob`          | Submit an application for a job                 |
| GET    | `/my-applications`    | Applicant           | `getMyApplications`    | View all of the applicant's own applications    |
| PUT    | `/:id/withdraw`       | Applicant           | `withdrawApplication`  | Withdraw a pending application                  |
| GET    | `/job/:jobId`         | Employer            | `getJobApplications`   | View all applications received for a job        |
| PUT    | `/:id/accept`         | Employer            | `acceptApplication`    | Accept an applicant for the job                 |
| PUT    | `/:id/reject`         | Employer            | `rejectApplication`    | Reject an applicant for the job                 |
| GET    | `/:id`                | Employer/Applicant  | `getApplicationById`   | View full details of a specific application     |

### Business Rules
- An applicant **cannot apply twice** to the same job.
- Only applications with status `pending` can be withdrawn.
- Accepting/rejecting triggers an **email + SMS notification** to the applicant.
- Deactivated applicants cannot apply (`checkApplicantActive` middleware).

---

## 6. Shift Management Module

**Base Route:** `/api/shifts`

| Method | Endpoint                  | Access             | Controller Function  | Description                                     |
| ------ | ------------------------- | ------------------ | -------------------- | ----------------------------------------------- |
| POST   | `/`                       | Employer           | `createShift`        | Assign a shift to an accepted applicant         |
| GET    | `/employer/my-shifts`     | Employer           | `getEmployerShifts`  | View all shifts created by this employer        |
| PUT    | `/:id`                    | Employer           | `updateShift`        | Edit shift date, time, location, or payment     |
| DELETE | `/:id`                    | Employer           | `deleteShift`        | Delete a shift                                  |
| GET    | `/applicant/my-shifts`    | Applicant          | `getApplicantShifts` | View all shifts assigned to this applicant      |
| PUT    | `/:id/confirm`            | Applicant          | `confirmShift`       | Applicant confirms they will attend the shift   |
| GET    | `/:id`                    | Employer/Applicant | `getShiftById`       | View full details of a specific shift           |
| PUT    | `/:id/cancel`             | Employer/Applicant | `cancelShift`        | Cancel a shift (either party can cancel)        |

### Business Rules
- Shifts can only be created for applicants whose application has been **accepted**.
- Creating a shift triggers an **email + SMS notification** to the applicant.
- Both employer and applicant can cancel a shift.

---

## 7. Attendance Management Module

**Base Route:** `/api/attendance`

| Method | Endpoint                  | Access             | Controller Function              | Description                                         |
| ------ | ------------------------- | ------------------ | -------------------------------- | --------------------------------------------------- |
| POST   | `/:shiftId/checkin`       | Applicant          | `checkIn`                        | Clock in at the start of a shift                    |
| POST   | `/:shiftId/checkout`      | Applicant          | `checkOut`                       | Clock out at the end of a shift                     |
| GET    | `/applicant/history`      | Applicant          | `getApplicantAttendanceHistory`  | View own full attendance history                    |
| GET    | `/employer/records`       | Employer           | `getEmployerAttendanceRecords`   | View attendance records for all staff               |
| PUT    | `/:id/approve`            | Employer           | `approveAttendance`              | Approve a submitted attendance record               |
| POST   | `/manual`                 | Employer           | `markManualAttendance`           | Manually log attendance on behalf of an applicant   |
| GET    | `/shift/:shiftId`         | Employer/Applicant | `getShiftAttendance`             | View attendance record for a specific shift         |

### Business Rules
- `hoursWorked` is **automatically calculated** on checkout.
- Employers can **manually mark** attendance if an applicant forgot to check in/out.
- Attendance records can be approved by the employer after review.
- Deactivated applicants cannot check in/out.

---

## 8. Admin Panel Module

**Base Route:** `/api/admin`  
> ⚠️ All routes require a valid **Admin JWT token**.

| Method | Endpoint                       | Controller Function    | Description                                          |
| ------ | ------------------------------ | ---------------------- | ---------------------------------------------------- |
| GET    | `/dashboard/stats`             | `getDashboardStats`    | Platform-wide statistics (users, jobs, applications) |
| GET    | `/employers`                   | `getAllEmployers`       | List all employers with filters & pagination         |
| PUT    | `/employers/:id/approve`       | `approveEmployer`      | Approve an employer account                          |
| PUT    | `/employers/:id/block`         | `blockEmployer`        | Block an employer from the platform                  |
| PUT    | `/employers/:id/unblock`       | `unblockEmployer`      | Restore a blocked employer's access                  |
| GET    | `/applicants`                  | `getAllApplicants`      | List all applicants with filters & pagination        |
| PUT    | `/applicants/:id/deactivate`   | `deactivateApplicant`  | Deactivate an applicant account                      |
| DELETE | `/jobs/:id`                    | `deleteJob`            | Delete any job listing (content moderation)          |

### Dashboard Stats Include
- Total employers (pending / approved / blocked)
- Total applicants (active / deactivated)
- Total jobs (open / closed)
- Total applications (by status)
- Total shifts & attendance records

---

## 9. Middlewares

### 9.1 Auth Middleware (`authMiddleware.js`)

| Function                | Purpose                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `protect`               | Verifies JWT Bearer token; attaches `req.user` and `req.userType` to the request    |
| `authorize(...roles)`   | Restricts route to specified roles; returns `403` if role doesn't match             |
| `checkEmployerApproval` | Returns `403` if employer's account is not yet approved by admin                    |
| `checkEmployerBlocked`  | Returns `403` if employer's account has been blocked                                |
| `checkApplicantActive`  | Returns `403` if applicant's account has been deactivated                           |

### 9.2 Validation Middleware (`validationMiddleware.js`)

| Function          | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `validate(schema)`| Runs Joi schema validation on `req.body`; returns `400` on failure  |

### 9.3 Error Middleware (`errorMiddleware.js`)

| Function         | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Global handler   | Catches unhandled errors and returns a consistent JSON error format  |

---

## 10. Notification Services

**File:** `src/services/notificationService.js`  
**Channels:** Email (via `emailService.js`) + SMS (via `smsService.js`)

| Function                  | Trigger Event                         | Channels     |
| ------------------------- | ------------------------------------- | ------------ |
| `notifyEmployerSignup`    | Employer registers                    | Email        |
| `notifyEmployerApproval`  | Admin approves employer               | Email        |
| `notifyApplicantSignup`   | Applicant registers (if email given)  | Email        |
| `notifyApplicationStatus` | Application accepted or rejected      | Email + SMS  |
| `notifyShiftAssignment`   | Shift assigned to applicant           | Email + SMS  |

### Email Templates (`src/utils/emailTemplates.js`)
- `employerSignupTemplate` — Welcome email for new employers
- `employerApprovalTemplate` — Approval confirmation for employers
- `applicantSignupTemplate` — Welcome email for new applicants
- `applicationStatusTemplate` — Status update (accepted/rejected)
- `shiftAssignmentTemplate` — Shift details notification

---

## 11. Input Validation Schemas

**File:** `src/utils/validators.js` (using **Joi**)

### 11.1 `employerSignupSchema`
| Field               | Rules                                                              |
| ------------------- | ------------------------------------------------------------------ |
| storeName           | String, required                                                   |
| ownerName           | String, required                                                   |
| email               | Valid email, required                                              |
| phone               | 10-digit number, required                                          |
| password            | Min 6 characters, required                                         |
| address             | Object: `{ street?, city*, state*, pincode* (6 digits) }`         |
| businessType        | One of: `restaurant`, `retail`, `logistics`, `healthcare`, `hospitality`, `other` |
| businessDescription | String, optional                                                   |

### 11.2 `applicantSignupSchema`
| Field            | Rules                                                   |
| ---------------- | ------------------------------------------------------- |
| name             | String, required                                        |
| phone            | 10-digit number, required                               |
| email            | Valid email, optional                                   |
| password         | Min 6 characters, required                              |
| skills           | Array of strings, optional                              |
| experience       | Number (min 0), optional                                |
| preferredJobType | One of: `full-time`, `part-time`, `shift`, `contract`  |

### 11.3 `loginSchema`
| Field      | Rules                                              |
| ---------- | -------------------------------------------------- |
| identifier | String (email or phone), required                  |
| password   | String, required                                   |
| userType   | One of: `employer`, `applicant`, `admin`, required |

### 11.4 `jobCreationSchema`
| Field        | Rules                                                                      |
| ------------ | -------------------------------------------------------------------------- |
| title        | String, required                                                           |
| description  | String, required                                                           |
| jobType      | One of: `full-time`, `part-time`, `shift`, `contract`, required           |
| salary       | Object: `{ amount* (min 0), period* (hourly/daily/weekly/monthly/yearly) }` |
| workingHours | Object: `{ hoursPerDay?, daysPerWeek?, shiftTiming? }`, optional          |
| location     | Object: `{ address?, city*, state*, pincode* (6 digits), coordinates? }`, required |
| requirements | Object: `{ minimumExperience?, skills[]?, education?, otherRequirements? }`, optional |
| benefits     | Array of strings, optional                                                 |
| expiryDate   | Date, optional                                                             |

### 11.5 `shiftCreationSchema`
| Field         | Rules                                     |
| ------------- | ----------------------------------------- |
| jobId         | String (ObjectId), required               |
| applicantId   | String (ObjectId), required               |
| date          | Date, required                            |
| startTime     | String in `HH:MM` format, required        |
| endTime       | String in `HH:MM` format, required        |
| location      | String, required                          |
| instructions  | String, optional                          |
| paymentAmount | Number (min 0), optional                  |

---

## 12. Summary Statistics

| Category                  | Count |
| ------------------------- | :---: |
| Database Models            |   7   |
| Controllers                |   7   |
| Route Files                |   6   |
| **Total API Endpoints**    | **35**|
| Middleware Functions       |   6   |
| Notification Functions     |   5   |
| Email Templates            |   5   |
| Joi Validation Schemas     |   5   |
| Services (email/sms/notify)|   3   |
| Utility Files              |   4   |

---

*Document auto-generated from source code analysis of the ShiftMaster backend.*
