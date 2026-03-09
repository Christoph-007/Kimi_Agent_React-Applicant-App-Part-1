# ShiftMaster Admin Control Panel - Complete Guide

## 🔐 Admin Access

### Step 1: Create Admin Account
First, create an admin account if you haven't already:

```bash
node createAdmin.js
```

**Default Credentials:**
- Email: `admin@shiftmaster.com`
- Password: `admin123456`
- Role: `super-admin`

⚠️ **Important:** Change this password after first login!

### Step 2: Login as Admin
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "admin@shiftmaster.com",
  "password": "admin123456",
  "userType": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "name": "Super Admin",
    "email": "admin@shiftmaster.com",
    "role": "super-admin"
  }
}
```

**Save the token!** You'll need it for all admin operations.

---

## 📊 Admin Control Features

All admin endpoints require:
- **Authorization Header:** `Bearer {admin_token}`
- **Base URL:** `http://localhost:5000/api/admin`

---

## 1️⃣ Dashboard Statistics

### Get Dashboard Stats
Get overview statistics of the entire platform.

**Endpoint:** `GET /api/admin/dashboard/stats`

**PowerShell Example:**
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard/stats" -Headers $headers
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployers": 10,
    "activeEmployers": 8,
    "pendingEmployers": 2,
    "totalApplicants": 50,
    "activeApplicants": 45,
    "totalJobs": 25,
    "activeJobs": 20,
    "totalApplications": 150,
    "pendingApplications": 30,
    "totalShifts": 100,
    "upcomingShifts": 20
  }
}
```

**What you can see:**
- Total number of employers, applicants, jobs
- How many are active vs pending
- Application and shift statistics

---

## 2️⃣ Employer Management

### A. Get All Employers
View all registered employers with filtering and pagination.

**Endpoint:** `GET /api/admin/employers`

**Query Parameters:**
- `status` - Filter by approval status: `pending`, `approved`, `rejected`
- `isActive` - Filter by active status: `true`, `false`
- `businessType` - Filter by type: `restaurant`, `cafe`, `retail`, etc.
- `search` - Search by store name, owner name, or email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**PowerShell Examples:**

Get all pending employers:
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers
```

Search for a specific employer:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?search=restaurant" -Headers $headers
```

Get restaurants only:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?businessType=restaurant" -Headers $headers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "storeName": "The Grand Restaurant",
      "ownerName": "John Smith",
      "email": "john@grandrestaurant.com",
      "phone": "9876543210",
      "businessType": "restaurant",
      "isApproved": false,
      "isActive": true,
      "address": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "createdAt": "2026-02-09T...",
      "jobsPosted": 0
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### B. Approve Employer
**Most Important!** Approve an employer so they can post jobs.

**Endpoint:** `PUT /api/admin/employers/:id/approve`

**PowerShell Example:**
```powershell
# First, get the employer ID from the list
$employers = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers
$employerId = $employers.data[0]._id

# Then approve
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$employerId/approve" -Method PUT -Headers $headers
```

**Quick Script to Approve All Pending Employers:**
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$headers = @{ "Authorization" = "Bearer $token" }

# Get all pending employers
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers

# Approve each one
foreach ($employer in $response.data) {
    Write-Host "Approving: $($employer.storeName)..."
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$($employer._id)/approve" -Method PUT -Headers $headers
    Write-Host "  ✓ Approved!" -ForegroundColor Green
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employer approved successfully",
  "data": {
    "_id": "...",
    "storeName": "The Grand Restaurant",
    "isApproved": true
  }
}
```

---

### C. Block Employer
Block an employer from posting jobs or accessing the platform.

**Endpoint:** `PUT /api/admin/employers/:id/block`

**When to use:**
- Employer violates terms of service
- Suspicious activity
- Spam or fraudulent job postings

**PowerShell Example:**
```powershell
$employerId = "EMPLOYER_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$employerId/block" -Method PUT -Headers $headers
```

**Response:**
```json
{
  "success": true,
  "message": "Employer blocked successfully"
}
```

---

### D. Unblock Employer
Restore access to a previously blocked employer.

**Endpoint:** `PUT /api/admin/employers/:id/unblock`

**PowerShell Example:**
```powershell
$employerId = "EMPLOYER_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$employerId/unblock" -Method PUT -Headers $headers
```

---

## 3️⃣ Applicant Management

### A. Get All Applicants
View all registered job seekers with filtering.

**Endpoint:** `GET /api/admin/applicants`

**Query Parameters:**
- `isActive` - Filter by status: `true`, `false`
- `preferredJobType` - Filter by preference: `shift`, `full-time`, `part-time`
- `city` - Filter by location
- `search` - Search by name, email, or phone
- `page` - Page number
- `limit` - Items per page

**PowerShell Examples:**

Get all applicants:
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/applicants" -Headers $headers
```

Search for specific applicant:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/applicants?search=priya" -Headers $headers
```

Get applicants in Mumbai:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/applicants?city=Mumbai" -Headers $headers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Priya Sharma",
      "email": "priya.sharma@email.com",
      "phone": "9123456780",
      "skills": ["customer service", "communication"],
      "experience": 2,
      "preferredJobType": "shift",
      "isActive": true,
      "applicationsCount": 5
    }
  ],
  "pagination": { ... }
}
```

---

### B. Deactivate Applicant
Deactivate an applicant account (soft delete).

**Endpoint:** `PUT /api/admin/applicants/:id/deactivate`

**When to use:**
- Violates terms of service
- Spam or fake profiles
- User request

**PowerShell Example:**
```powershell
$applicantId = "APPLICANT_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/applicants/$applicantId/deactivate" -Method PUT -Headers $headers
```

---

## 4️⃣ Job Moderation

### Delete Job
Remove inappropriate or spam job postings.

**Endpoint:** `DELETE /api/admin/jobs/:id`

**When to use:**
- Fraudulent job postings
- Inappropriate content
- Duplicate listings
- Spam

**PowerShell Example:**
```powershell
$jobId = "JOB_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/jobs/$jobId" -Method DELETE -Headers $headers
```

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## 🚀 Quick Start Workflow

### Complete Admin Setup (Step-by-Step)

**Step 1: Create Admin**
```bash
node createAdmin.js
```

**Step 2: Login and Get Token**
```powershell
$loginBody = @{
    identifier = "admin@shiftmaster.com"
    password = "admin123456"
    userType = "admin"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginBody

$token = $loginResponse.token
Write-Host "Admin Token: $token"
```

**Step 3: View Dashboard**
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard/stats" -Headers $headers
```

**Step 4: Approve All Pending Employers**
```powershell
# Get pending employers
$pendingEmployers = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers

# Approve each
foreach ($emp in $pendingEmployers.data) {
    Write-Host "Approving: $($emp.storeName)"
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$($emp._id)/approve" -Method PUT -Headers $headers
}

Write-Host "All employers approved!" -ForegroundColor Green
```

---

## 📝 Complete PowerShell Admin Script

Save this as `AdminTools.ps1`:

```powershell
# ShiftMaster Admin Tools
param(
    [string]$Action = "menu"
)

$baseUrl = "http://localhost:5000/api"

# Login and get token
function Get-AdminToken {
    $body = @{
        identifier = "admin@shiftmaster.com"
        password = "admin123456"
        userType = "admin"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    return $response.token
}

# Get dashboard stats
function Get-DashboardStats {
    param([string]$Token)
    $headers = @{ "Authorization" = "Bearer $Token" }
    Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Headers $headers
}

# Approve all pending employers
function Approve-AllEmployers {
    param([string]$Token)
    $headers = @{ "Authorization" = "Bearer $Token" }
    
    $employers = Invoke-RestMethod -Uri "$baseUrl/admin/employers?status=pending" -Headers $headers
    
    foreach ($emp in $employers.data) {
        Write-Host "Approving: $($emp.storeName)..." -ForegroundColor Yellow
        Invoke-RestMethod -Uri "$baseUrl/admin/employers/$($emp._id)/approve" -Method PUT -Headers $headers
        Write-Host "  ✓ Approved!" -ForegroundColor Green
    }
}

# Main
Write-Host "`nShiftMaster Admin Tools" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

$token = Get-AdminToken
Write-Host "✓ Logged in as admin`n" -ForegroundColor Green

switch ($Action) {
    "stats" {
        Get-DashboardStats -Token $token | ConvertTo-Json
    }
    "approve" {
        Approve-AllEmployers -Token $token
    }
    default {
        Write-Host "Available actions:"
        Write-Host "  .\AdminTools.ps1 -Action stats    # View dashboard"
        Write-Host "  .\AdminTools.ps1 -Action approve  # Approve all employers"
    }
}
```

**Usage:**
```powershell
# View dashboard
.\AdminTools.ps1 -Action stats

# Approve all pending employers
.\AdminTools.ps1 -Action approve
```

---

## 🎯 Common Admin Tasks

### Task 1: Approve Your Test Employers
```powershell
$token = "YOUR_TOKEN"
$headers = @{ "Authorization" = "Bearer $token" }

# Get all pending
$pending = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers

# Approve each
$pending.data | ForEach-Object {
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$($_._id)/approve" -Method PUT -Headers $headers
}
```

### Task 2: Monitor Platform Activity
```powershell
# Get stats
$stats = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard/stats" -Headers $headers

Write-Host "Platform Overview:"
Write-Host "  Employers: $($stats.data.totalEmployers) (Pending: $($stats.data.pendingEmployers))"
Write-Host "  Applicants: $($stats.data.totalApplicants)"
Write-Host "  Jobs: $($stats.data.totalJobs)"
Write-Host "  Applications: $($stats.data.totalApplications)"
```

### Task 3: Find and Block Suspicious Employer
```powershell
# Search
$results = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?search=suspicious" -Headers $headers

# Block
$employerId = $results.data[0]._id
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$employerId/block" -Method PUT -Headers $headers
```

---

## ⚠️ Important Notes

1. **All admin routes require authentication** - Always include the Bearer token
2. **Employers must be approved** before they can post jobs
3. **Blocking is reversible** - You can unblock employers later
4. **Deactivating applicants** prevents them from applying for jobs
5. **Deleting jobs** is permanent - use with caution

---

## 🔒 Security Best Practices

1. **Change the default admin password** immediately after first login
2. **Keep admin tokens secure** - Don't share or commit them
3. **Review pending employers** before approving
4. **Monitor dashboard stats** regularly for unusual activity
5. **Use moderation features** to maintain platform quality

---

**You're all set!** Use these admin controls to manage your ShiftMaster platform effectively. 🎉
