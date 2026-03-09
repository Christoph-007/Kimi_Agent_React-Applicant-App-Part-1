# ShiftMaster Admin Controls - Quick Reference

## 🎯 What Can You Do as Admin?

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN CONTROL PANEL                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 DASHBOARD                                               │
│     └─ View platform statistics                            │
│        • Total employers, applicants, jobs                 │
│        • Pending approvals                                 │
│        • Application & shift counts                        │
│                                                             │
│  👔 EMPLOYER MANAGEMENT                                     │
│     ├─ View all employers (with filters)                   │
│     ├─ ✅ Approve employers (REQUIRED for job posting)     │
│     ├─ 🚫 Block employers                                  │
│     └─ ✓ Unblock employers                                 │
│                                                             │
│  👤 APPLICANT MANAGEMENT                                    │
│     ├─ View all applicants (with filters)                  │
│     └─ Deactivate applicants                               │
│                                                             │
│  💼 JOB MODERATION                                          │
│     └─ Delete inappropriate jobs                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## ⚡ Quick Start (3 Steps)

### Step 1: Create Admin Account
```bash
node createAdmin.js
```
**Creates:** admin@shiftmaster.com / admin123456

### Step 2: Use Admin Tools
```powershell
# View menu
.\AdminTools.ps1

# View dashboard
.\AdminTools.ps1 -Action stats

# Approve all pending employers (IMPORTANT!)
.\AdminTools.ps1 -Action approve

# List employers
.\AdminTools.ps1 -Action employers

# List applicants
.\AdminTools.ps1 -Action applicants
```

### Step 3: Done!
Your employers can now post jobs! ✅

## 🔥 Most Important Action

### APPROVE EMPLOYERS
**Why?** Employers CANNOT post jobs until approved by admin.

**Quick Approve All:**
```powershell
.\AdminTools.ps1 -Action approve
```

**Manual Approve (via API):**
```powershell
# 1. Login
$body = @{
    identifier = "admin@shiftmaster.com"
    password = "admin123456"
    userType = "admin"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
$token = $login.token

# 2. Get pending employers
$headers = @{ "Authorization" = "Bearer $token" }
$employers = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers?status=pending" -Headers $headers

# 3. Approve each
foreach ($emp in $employers.data) {
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/employers/$($emp._id)/approve" -Method PUT -Headers $headers
    Write-Host "Approved: $($emp.storeName)" -ForegroundColor Green
}
```

## 📋 All Admin Endpoints

| Action | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| **Dashboard** | GET | `/api/admin/dashboard/stats` | Platform statistics |
| **List Employers** | GET | `/api/admin/employers` | View all employers |
| **Approve Employer** | PUT | `/api/admin/employers/:id/approve` | ✅ Enable job posting |
| **Block Employer** | PUT | `/api/admin/employers/:id/block` | 🚫 Disable account |
| **Unblock Employer** | PUT | `/api/admin/employers/:id/unblock` | ✓ Restore account |
| **List Applicants** | GET | `/api/admin/applicants` | View all applicants |
| **Deactivate Applicant** | PUT | `/api/admin/applicants/:id/deactivate` | Disable account |
| **Delete Job** | DELETE | `/api/admin/jobs/:id` | Remove job posting |

## 🎨 Filter Examples

### Filter Employers
```powershell
# Pending only
GET /api/admin/employers?status=pending

# Approved only
GET /api/admin/employers?status=approved

# Restaurants only
GET /api/admin/employers?businessType=restaurant

# Search by name
GET /api/admin/employers?search=grand

# Active only
GET /api/admin/employers?isActive=true
```

### Filter Applicants
```powershell
# By city
GET /api/admin/applicants?city=Mumbai

# By job type preference
GET /api/admin/applicants?preferredJobType=shift

# Search by name
GET /api/admin/applicants?search=priya

# Active only
GET /api/admin/applicants?isActive=true
```

## 🔐 Authentication

**All admin endpoints require:**
```
Authorization: Bearer {admin_token}
```

**Get token:**
```powershell
POST /api/auth/login
{
  "identifier": "admin@shiftmaster.com",
  "password": "admin123456",
  "userType": "admin"
}
```

## 💡 Common Workflows

### Workflow 1: Approve New Employers
```
1. Run: .\AdminTools.ps1 -Action employers
2. Check pending employers
3. Run: .\AdminTools.ps1 -Action approve
4. Done! Employers can now post jobs
```

### Workflow 2: Monitor Platform
```
1. Run: .\AdminTools.ps1 -Action stats
2. Review numbers
3. Check for unusual activity
4. Take action if needed
```

### Workflow 3: Handle Violations
```
1. Identify problematic employer/applicant
2. Use block/deactivate endpoints
3. Delete inappropriate jobs if needed
```

## 📁 Files Created

- `ADMIN_GUIDE.md` - Complete detailed guide
- `AdminTools.ps1` - PowerShell admin tools
- This file - Quick reference

## ⚠️ Remember

1. **Employers MUST be approved** to post jobs
2. **Keep admin credentials secure**
3. **Change default password** after first login
4. **Review before approving** employers
5. **Use moderation wisely** - actions have consequences

## 🚀 Next Steps

1. ✅ Create admin: `node createAdmin.js`
2. ✅ Approve employers: `.\AdminTools.ps1 -Action approve`
3. ✅ Monitor platform: `.\AdminTools.ps1 -Action stats`
4. ✅ Read full guide: `ADMIN_GUIDE.md`

---

**You're ready to manage your ShiftMaster platform!** 🎉
