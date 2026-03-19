# ShiftMaster Sample Data - Successfully Created!

## Summary

Sample data has been successfully sent to the database via API calls.

## ✅ What Was Created

### Employers (3)
1. **The Grand Restaurant** - john@grandrestaurant.com / password123
   - Location: Mumbai, Maharashtra
   - Type: Restaurant
   - Status: ⚠️ Pending Approval

2. **Quick Bites Cafe** - sarah@quickbites.com / password123
   - Location: Bangalore, Karnataka
   - Type: Cafe
   - Status: ⚠️ Pending Approval

3. **Retail Paradise** - michael@retailparadise.com / password123
   - Location: Delhi
   - Type: Retail
   - Status: ⚠️ Pending Approval

### Applicants (5)
1. **Priya Sharma** - priya.sharma@email.com / password123
   - Skills: customer service, communication, teamwork
   - Experience: 2 years
   - ✅ Active

2. **Rahul Kumar** - rahul.kumar@email.com / password123
   - Skills: cooking, food preparation, kitchen management
   - Experience: 3 years
   - ✅ Active

3. **Anita Patel** - anita.patel@email.com / password123
   - Skills: sales, customer service, inventory management
   - Experience: 1 year
   - ✅ Active

4. **Vikram Singh** - vikram.singh@email.com / password123
   - Skills: delivery, driving, logistics
   - Experience: 4 years
   - ✅ Active

5. **Sneha Reddy** - sneha.reddy@email.com / password123
   - Skills: barista, coffee making, customer service
   - Experience: 1 year
   - ✅ Active

## 📋 Next Steps to Complete Setup

### Option 1: Create Admin and Approve Employers (Recommended)

To enable employers to post jobs, you need to:

1. **Create Admin Account** (if not already created):
   ```bash
   node createAdmin.js
   ```
   This creates: admin@shiftmaster.com / admin123456

2. **Login as Admin and Approve Employers**:
   - Login as admin via API
   - Approve each employer using: `PUT /api/admin/employers/{employerId}/approve`

### Option 2: Manually Approve in Database

Alternatively, you can manually set `isApproved: true` for employers in MongoDB.

### Option 3: Use the Seed Endpoint (If Fixed)

Once the MongoDB connection issue is resolved, you can use:
```bash
POST http://localhost:5000/api/seed
```
This will create all data including pre-approved employers.

## 🧪 Testing the Current Data

### Test Applicant Login
```powershell
$body = @{
    identifier = "priya.sharma@email.com"
    password = "password123"
    userType = "applicant"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

### Test Employer Login
```powershell
$body = @{
    identifier = "john@grandrestaurant.com"
    password = "password123"
    userType = "employer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

### Browse Jobs (Currently Empty)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method GET
```

## 📝 Sample Jobs to Create (After Employer Approval)

Once employers are approved, they can create jobs like:

**Waiter Position** (The Grand Restaurant):
```json
{
  "title": "Waiter/Waitress",
  "description": "Looking for experienced waiters",
  "jobType": "shift",
  "salary": { "amount": 500, "period": "daily" },
  "location": {
    "address": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "requirements": {
    "minimumExperience": 1,
    "skills": ["customer service"],
    "education": "High School"
  },
  "openings": 3
}
```

## 🔄 Re-running the Seed Script

To add more data or recreate:
```powershell
powershell -ExecutionPolicy Bypass -File SeedCompleteData.ps1
```

## 📚 Additional Resources

- **API Documentation**: See `API_REFERENCE.md`
- **Quick Start Guide**: See `QUICKSTART.md`
- **Postman Collection**: Import `ShiftMaster.postman_collection.json`

## ⚠️ Important Notes

1. **Employers need approval** before they can post jobs
2. All passwords are `password123` (change in production!)
3. Email and SMS services are disabled (not configured)
4. File uploads (Cloudinary) not configured yet

## 🎯 Current Database State

- ✅ Employers: 3 (all pending approval)
- ✅ Applicants: 5 (all active)
- ⏳ Jobs: 0 (waiting for employer approval)
- ⏳ Applications: 0 (no jobs yet)
- ⏳ Admin: 0 (needs to be created)

---

**Status**: Sample data successfully created! Employers need admin approval to post jobs.
