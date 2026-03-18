# ShiftMaster Test Data Summary

## Overview
Test data has been successfully created in the ShiftMaster database via API calls.

## Test Accounts Created

### Employers (2)

#### 1. The Grand Restaurant
- **Owner:** John Smith
- **Email:** john@grandrestaurant.com
- **Password:** password123
- **Phone:** 9876543210
- **Business Type:** Restaurant
- **Location:** 123 MG Road, Mumbai, Maharashtra - 400001
- **Description:** Fine dining restaurant specializing in continental cuisine
- **Status:** Registered (needs admin approval to post jobs)

#### 2. Quick Bites Cafe
- **Owner:** Sarah Johnson
- **Email:** sarah@quickbites.com
- **Password:** password123
- **Phone:** 9876543211
- **Business Type:** Cafe
- **Location:** 456 Brigade Road, Bangalore, Karnataka - 560001
- **Description:** Fast casual cafe with fresh sandwiches and coffee
- **Status:** Registered (needs admin approval to post jobs)

### Applicants (3)

#### 1. Priya Sharma
- **Email:** priya.sharma@email.com
- **Password:** password123
- **Phone:** 9123456780
- **Skills:** customer service, communication, teamwork
- **Experience:** 2 years
- **Preferred Job Type:** Shift
- **Status:** Active

#### 2. Rahul Kumar
- **Email:** rahul.kumar@email.com
- **Password:** password123
- **Phone:** 9123456781
- **Skills:** cooking, food preparation, kitchen management
- **Experience:** 3 years
- **Preferred Job Type:** Full-time
- **Status:** Active

#### 3. Anita Patel
- **Email:** anita.patel@email.com
- **Password:** password123
- **Phone:** 9123456782
- **Skills:** sales, customer service, inventory management
- **Experience:** 1 year
- **Preferred Job Type:** Part-time
- **Status:** Active

## Quick Login Reference

### For Testing Employer Features:
```
Email: john@grandrestaurant.com
Password: password123
User Type: employer
```

### For Testing Applicant Features:
```
Email: priya.sharma@email.com
Password: password123
User Type: applicant
```

## API Testing Examples

### 1. Login as Employer
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "john@grandrestaurant.com",
  "password": "password123",
  "userType": "employer"
}
```

### 2. Login as Applicant
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "priya.sharma@email.com",
  "password": "password123",
  "userType": "applicant"
}
```

### 3. Create a Job (as Employer)
First login as employer, then use the token:

```bash
POST http://localhost:5000/api/jobs
Authorization: Bearer {employer_token}
Content-Type: application/json

{
  "title": "Waiter Position",
  "description": "Looking for experienced waiters",
  "jobType": "shift",
  "salary": {
    "amount": 500,
    "period": "daily"
  },
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

### 4. Browse Jobs (Public)
```bash
GET http://localhost:5000/api/jobs?city=Mumbai&jobType=shift
```

### 5. Apply for a Job (as Applicant)
First login as applicant, then use the token:

```bash
POST http://localhost:5000/api/applications
Authorization: Bearer {applicant_token}
Content-Type: application/json

{
  "jobId": "{job_id}",
  "coverLetter": "I am very interested in this position..."
}
```

## Next Steps

1. **Approve Employers** (requires admin account)
   - Run `node createAdmin.js` to create admin account
   - Login as admin
   - Approve employers via: `PUT /api/admin/employers/{employerId}/approve`

2. **Create Jobs**
   - Login as employer
   - Create job postings

3. **Apply for Jobs**
   - Login as applicant
   - Browse and apply for jobs

4. **Test Full Workflow**
   - Use the Postman collection: `ShiftMaster.postman_collection.json`
   - Import it into Postman for comprehensive API testing

## Notes

- All passwords are set to `password123` for easy testing
- **Change passwords in production!**
- Employers need admin approval before they can post jobs
- Email and SMS notifications are disabled (credentials not configured)
- File uploads (Cloudinary) are not configured yet

## Troubleshooting

If you encounter issues:
1. Ensure the server is running: `npm start` or `npm run dev`
2. Check MongoDB connection in `.env` file
3. Verify the API is accessible at `http://localhost:5000`
4. Check server logs for errors

## Re-running Test Data

To create fresh test data:
```powershell
powershell -ExecutionPolicy Bypass -File CreateTestData_Clean.ps1
```

Note: This will create new accounts. If accounts already exist, you'll see warnings but the script will continue.
