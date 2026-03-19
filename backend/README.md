# ShiftMaster Backend API

A comprehensive Node.js/Express backend API for ShiftMaster - a job management platform connecting employers with applicants for shift-based and full-time jobs.

## 🚀 Features

### For Employers
- ✅ Register and get admin approval
- ✅ Post and manage job listings
- ✅ Review and manage applications
- ✅ Create and assign shifts
- ✅ Track employee attendance
- ✅ Approve attendance records

### For Applicants
- ✅ Browse and search jobs
- ✅ Apply for jobs with cover letters
- ✅ Manage shift schedules
- ✅ Check-in/out with location tracking
- ✅ View attendance history

### For Admins
- ✅ Approve/block employers
- ✅ Manage applicants
- ✅ View platform analytics
- ✅ Moderate content

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **SMS**: Twilio
- **File Upload**: Cloudinary + Multer
- **Validation**: Joi
- **Security**: Helmet, CORS

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files (DB, Email, SMS, Cloudinary)
│   ├── models/           # Mongoose models
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middleware
│   ├── utils/            # Utility functions
│   └── services/         # Business logic services
├── server.js             # Entry point
├── package.json          # Dependencies
├── .env                  # Environment variables
└── .gitignore           # Git ignore rules
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)
- Twilio account (for SMS notifications)
- Cloudinary account (for file uploads)

### Steps

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit the `.env` file and replace placeholder values:

   ```env
   NODE_ENV=development
   PORT=5000

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/shiftmaster

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_change_this_in_production
   JWT_EXPIRE=7d

   # Email (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
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

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /employer/signup` - Register employer
- `POST /applicant/signup` - Register applicant
- `POST /login` - Login (all users)
- `GET /me` - Get current user (Protected)
- `PUT /update-password` - Update password (Protected)
- `POST /logout` - Logout (Protected)

### Jobs (`/api/jobs`)
- `GET /` - Get all jobs (Public, with filters)
- `GET /:id` - Get single job (Public)
- `POST /` - Create job (Employer, Approved)
- `GET /employer/my-jobs` - Get employer's jobs (Employer)
- `PUT /:id` - Update job (Employer)
- `DELETE /:id` - Delete job (Employer)
- `PUT /:id/close` - Close job (Employer)
- `PUT /:id/reopen` - Reopen job (Employer)

### Applications (`/api/applications`)
- `POST /:jobId` - Apply for job (Applicant)
- `GET /my-applications` - Get applicant's applications (Applicant)
- `GET /job/:jobId` - Get job applications (Employer)
- `GET /:id` - Get application details (Employer/Applicant)
- `PUT /:id/accept` - Accept application (Employer)
- `PUT /:id/reject` - Reject application (Employer)
- `PUT /:id/withdraw` - Withdraw application (Applicant)

### Shifts (`/api/shifts`)
- `POST /` - Create shift (Employer)
- `GET /employer/my-shifts` - Get employer shifts (Employer)
- `GET /applicant/my-shifts` - Get applicant shifts (Applicant)
- `GET /:id` - Get shift details (Employer/Applicant)
- `PUT /:id` - Update shift (Employer)
- `PUT /:id/confirm` - Confirm shift (Applicant)
- `PUT /:id/cancel` - Cancel shift (Employer/Applicant)
- `DELETE /:id` - Delete shift (Employer)

### Attendance (`/api/attendance`)
- `POST /:shiftId/checkin` - Check in (Applicant)
- `POST /:shiftId/checkout` - Check out (Applicant)
- `GET /shift/:shiftId` - Get shift attendance (Employer/Applicant)
- `GET /employer/records` - Get attendance records (Employer)
- `GET /applicant/history` - Get attendance history (Applicant)
- `PUT /:id/approve` - Approve attendance (Employer)
- `POST /manual` - Mark manual attendance (Employer)

### Admin (`/api/admin`)
- `GET /dashboard/stats` - Dashboard statistics
- `GET /employers` - List all employers
- `PUT /employers/:id/approve` - Approve employer
- `PUT /employers/:id/block` - Block employer
- `PUT /employers/:id/unblock` - Unblock employer
- `GET /applicants` - List all applicants
- `PUT /applicants/:id/deactivate` - Deactivate applicant
- `DELETE /jobs/:id` - Delete job (moderation)

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Response Format

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

## 🔑 Key Business Rules

1. **Employer Approval**: Employers cannot post jobs until admin approves (`isApproved: true`)
2. **Application Uniqueness**: One application per applicant per job (compound index)
3. **Shift Creation**: Only for accepted applications
4. **Attendance**: Check-in only on shift date, check-out only after check-in
5. **Status Transitions**: All status changes tracked in `statusHistory` arrays
6. **Notifications**: Email + SMS for critical events (application accepted, shift assigned)

## 📧 Email Configuration

To use Gmail for sending emails:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use this app password in `EMAIL_PASS` environment variable

## 📱 SMS Configuration

To use Twilio for SMS:

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the console
3. Get a Twilio phone number
4. Add credentials to `.env` file

## ☁️ Cloudinary Configuration

To use Cloudinary for file uploads:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add credentials to `.env` file

## 🧪 Testing

You can test the API using:
- **Postman**: Import the endpoints and test
- **Thunder Client** (VS Code extension)
- **cURL** commands

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "employer@example.com",
    "password": "password123",
    "userType": "employer"
  }'
```

## 🐛 Error Handling

The API includes comprehensive error handling:
- Mongoose validation errors
- Duplicate key errors
- JWT errors
- Custom business logic errors
- Global error handler middleware

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **bcryptjs**: Password hashing
- **JWT**: Stateless authentication
- **Input validation**: Joi schemas
- **Rate limiting**: Can be added with express-rate-limit

## 📊 Database Models

- **Employer**: Business owners posting jobs
- **Applicant**: Job seekers
- **Job**: Job postings
- **Application**: Job applications with status tracking
- **Shift**: Work shifts
- **Attendance**: Attendance records with check-in/out
- **Admin**: Platform administrators

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure production MongoDB URI
4. Set up production email/SMS services

### Recommended Platforms
- **Heroku**
- **Railway**
- **Render**
- **AWS EC2**
- **DigitalOcean**

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

ShiftMaster Development Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email support@shiftmaster.com

---

**Built with ❤️ using Node.js and Express**
