# ShiftMaster Backend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
Already done! ✅

### Step 2: Configure Environment Variables

Open the `.env` file and update these critical settings:

#### MongoDB (Required)
```env
MONGODB_URI=mongodb://localhost:27017/shiftmaster
```
- If using MongoDB Atlas, replace with your connection string
- If using local MongoDB, make sure MongoDB is running

#### JWT Secret (Required)
```env
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_change_this_in_production
```
- **IMPORTANT**: Change this to a random 32+ character string for security

#### Email Configuration (Optional for testing)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```
- For Gmail: Enable 2FA and create an App Password
- You can skip this initially and test without email notifications

#### SMS Configuration (Optional for testing)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```
- Sign up at Twilio.com
- You can skip this initially and test without SMS notifications

#### Cloudinary (Optional for testing)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Sign up at Cloudinary.com
- You can skip this initially if not testing file uploads

### Step 3: Start MongoDB

If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, skip this step.

### Step 4: Create Admin User

Run this command to create a default admin user:
```bash
node createAdmin.js
```

This will create:
- **Email**: admin@shiftmaster.com
- **Password**: admin123456

⚠️ **Change this password after first login!**

### Step 5: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Step 6: Test the API

Open your browser or Postman and visit:
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": "ShiftMaster API is running",
  "version": "1.0.0",
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

## 🧪 Testing the API

### 1. Login as Admin

**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Body**:
```json
{
  "identifier": "admin@shiftmaster.com",
  "password": "admin123456",
  "userType": "admin"
}
```

**Response**:
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

Copy the `token` value for subsequent requests.

### 2. Register an Employer

**Endpoint**: `POST http://localhost:5000/api/auth/employer/signup`

**Body**:
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

### 3. Approve Employer (as Admin)

**Endpoint**: `PUT http://localhost:5000/api/admin/employers/{employerId}/approve`

**Headers**:
```
Authorization: Bearer {admin_token}
```

### 4. Register an Applicant

**Endpoint**: `POST http://localhost:5000/api/auth/applicant/signup`

**Body**:
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

### 5. Create a Job (as Employer)

First, login as employer, then:

**Endpoint**: `POST http://localhost:5000/api/jobs`

**Headers**:
```
Authorization: Bearer {employer_token}
```

**Body**:
```json
{
  "title": "Waiter Position",
  "description": "Looking for experienced waiters",
  "jobType": "shift",
  "salary": {
    "amount": 500,
    "period": "daily"
  },
  "location": {
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "requirements": {
    "minimumExperience": 1,
    "skills": ["customer service"]
  }
}
```

### 6. Browse Jobs (Public)

**Endpoint**: `GET http://localhost:5000/api/jobs`

**Query Parameters**:
- `city=Mumbai`
- `jobType=shift`
- `minSalary=400`
- `maxSalary=600`
- `page=1`
- `limit=10`

## 📝 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution**: 
- Make sure MongoDB is running (`mongod`)
- Check `MONGODB_URI` in `.env`
- If using Atlas, check your IP whitelist

### Issue: Email/SMS not working
**Solution**: 
- These are optional for testing
- The API will log errors but continue working
- Configure them when you need notifications

### Issue: Port already in use
**Solution**: 
- Change `PORT` in `.env` to a different number (e.g., 5001)
- Or kill the process using port 5000

### Issue: JWT errors
**Solution**: 
- Make sure you're sending the token in the Authorization header
- Format: `Authorization: Bearer {token}`
- Token expires after 7 days (configurable in `.env`)

## 📚 Next Steps

1. ✅ Read the full API documentation in `README.md`
2. ✅ Test all endpoints with Postman/Thunder Client
3. ✅ Configure email/SMS for production
4. ✅ Set up proper environment variables for production
5. ✅ Deploy to your preferred hosting platform

## 🆘 Need Help?

- Check the main `README.md` for detailed documentation
- Review the code in `src/` folders for implementation details
- All routes are in `src/routes/`
- All business logic is in `src/controllers/`

## 🎉 You're All Set!

Your ShiftMaster backend is now running and ready to use!

Happy coding! 🚀
