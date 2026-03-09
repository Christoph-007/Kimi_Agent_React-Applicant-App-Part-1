const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDatabase = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorMiddleware');

// Initialize express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ShiftMaster API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/jobs', require('./src/routes/jobRoutes'));
app.use('/api/applications', require('./src/routes/applicationRoutes'));
app.use('/api/shifts', require('./src/routes/shiftRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// ── NEW ROUTES (additive) ────────────────────────────────────────────────────
app.use('/api/employer', require('./src/routes/employerApplicantRoutes'));
app.use('/api/job-requests', require('./src/routes/jobRequestRoutes'));
app.use('/api/shortlist', require('./src/routes/shortlistRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/resume', require('./src/routes/resumeRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
// ── END NEW ROUTES ───────────────────────────────────────────────────────────

// Seed route (for development only)
const { seedDatabase } = require('./src/controllers/seedController');
app.post('/api/seed', seedDatabase);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
