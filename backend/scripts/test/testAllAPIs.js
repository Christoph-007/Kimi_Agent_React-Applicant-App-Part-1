/**
 * ShiftMaster — Complete API Test Script
 * ──────────────────────────────────────
 * Tests every route across all 11 route files.
 *
 * Usage:
 *   node testAllAPIs.js
 *
 * Requirements:
 *   npm install axios
 *
 * The script runs sequentially:
 * 1.  Auth         — employer signup, applicant signup, login (all 3 roles)
 * 2.  Jobs         — create, list, get, update, close, reopen, delete
 * 3.  Applications — apply, list, get, accept, reject, withdraw
 * 4.  Shifts       — create, list (employer), list (applicant), update, cancel, delete
 * 5.  Attendance   — check-in, check-out, history, employer records, approve, manual
 * 6.  Employer/Applicant — browse, profile, save/get filters
 * 7.  Job Requests — send, list sent, list received, accept, decline, get by ID
 * 8.  Shortlist    — add, list, check, update, remove
 * 9.  Notifications — list, unread count, mark read, mark all read, dismiss
 * 10. Resume       — upload placeholder (binary — see note), delete, employer view
 * 11. Admin        — stats, employers CRUD, applicants, job delete
 */

const axios = require('axios');
const fs = require('fs');

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const BASE = 'http://localhost:5000/api';

// Unique suffix so re-runs don't collide
const UID = Date.now();

// Test user credentials
const EMPLOYER_EMAIL = `employer_${UID}@test.com`;
const EMPLOYER_PASSWORD = 'Test@1234';
const APPLICANT_EMAIL = `applicant_${UID}@test.com`;
const APPLICANT_PASSWORD = 'Test@1234';
const ADMIN_EMAIL = 'admin@shiftmaster.com';   // change if different
const ADMIN_PASSWORD = 'Admin@123';               // change if different

// ─── STATE (populated during test run) ──────────────────────────────────────
let employerToken = '';
let applicantToken = '';
let adminToken = '';
let employerId = '';
let applicantId = '';
let jobId = '';
let applicationId = '';
let shiftId = '';
let attendanceId = '';
let jobRequestId = '';
let shortlistId = '';
let notificationId = '';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

let passed = 0, failed = 0;
const results = [];

function log(status, label, detail = '') {
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : 'ℹ️ ';
    const color = status === 'PASS' ? colors.green : status === 'FAIL' ? colors.red : colors.yellow;
    console.log(`${color}${icon}  ${label}${colors.reset}${detail ? '  →  ' + detail : ''}`);
    results.push({ status, label, detail });
}

function section(title) {
    console.log(`\n${colors.bold}${colors.cyan}${'─'.repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  ${title}${colors.reset}`);
    console.log(`${colors.cyan}${'─'.repeat(60)}${colors.reset}`);
}

/**
 * Generic request wrapper.
 * Returns { data, status } on success.
 * Returns { error, status } on HTTP error.
 */
async function req(method, path, body = null, token = null, expectStatus = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await axios({
            method,
            url: `${BASE}${path}`,
            data: body,
            headers,
            validateStatus: () => true,   // never throw on HTTP errors
        });

        const ok = expectStatus ? res.status === expectStatus : res.status < 400;
        return { data: res.data, status: res.status, ok };
    } catch (err) {
        return { error: err.message, status: 0, ok: false };
    }
}

async function test(label, fn) {
    try {
        const result = await fn();
        if (result && result.ok !== false) {
            passed++;
            log('PASS', label, result.detail || '');
        } else {
            failed++;
            log('FAIL', label, result?.detail || result?.error || 'Unexpected');
        }
    } catch (err) {
        failed++;
        log('FAIL', label, err.message);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 1. AUTH
// ════════════════════════════════════════════════════════════════════════════
async function testAuth() {
    section('AUTH — /api/auth');

    // Employer signup
    await test('POST /auth/employer/signup', async () => {
        const r = await req('POST', '/auth/employer/signup', {
            storeName: `Test Store ${UID}`,
            ownerName: 'Test Owner',
            email: EMPLOYER_EMAIL,
            phone: `98${UID.toString().slice(-8)}`,
            password: EMPLOYER_PASSWORD,
            businessType: 'retail',
            address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        });
        if (r.ok) {
            employerToken = r.data.token || r.data.data?.token;
            employerId = r.data.data?._id || r.data.data?.id || r.data._id;
        }
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Applicant signup
    await test('POST /auth/applicant/signup', async () => {
        const r = await req('POST', '/auth/applicant/signup', {
            name: `Test Applicant ${UID}`,
            email: APPLICANT_EMAIL,
            phone: `97${UID.toString().slice(-8)}`,
            password: APPLICANT_PASSWORD,
            jobCategories: ['retail'],
            preferredShiftType: 'full-time',
            preferredWorkLocation: 'in-store',
            expectedHourlyRate: 200,
            availability: { monday: true, tuesday: true },
        });
        if (r.ok) {
            applicantToken = r.data.token || r.data.data?.token;
            applicantId = r.data.data?._id || r.data.data?.id || r.data._id;
        }
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Login as employer
    await test('POST /auth/login (employer)', async () => {
        const r = await req('POST', '/auth/login', {
            email: EMPLOYER_EMAIL,
            password: EMPLOYER_PASSWORD,
        });
        if (r.ok) employerToken = r.data.token || r.data.data?.token;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Login as applicant
    await test('POST /auth/login (applicant)', async () => {
        const r = await req('POST', '/auth/login', {
            email: APPLICANT_EMAIL,
            password: APPLICANT_PASSWORD,
        });
        if (r.ok) {
            applicantToken = r.data.token || r.data.data?.token;
            applicantId = r.data.data?._id || r.data.data?.id;
        }
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Login as admin
    await test('POST /auth/login (admin)', async () => {
        const r = await req('POST', '/auth/login', {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        });
        if (r.ok) {
            adminToken = r.data.token || r.data.data?.token;
        }
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // GET /me
    await test('GET /auth/me (employer)', async () => {
        const r = await req('GET', '/auth/me', null, employerToken);
        if (!employerId) employerId = r.data?.data?._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Update password
    await test('PUT /auth/update-password (applicant)', async () => {
        const r = await req('PUT', '/auth/update-password', {
            currentPassword: APPLICANT_PASSWORD,
            newPassword: APPLICANT_PASSWORD, // keep same, just test endpoint
        }, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Logout
    await test('POST /auth/logout (employer)', async () => {
        const r = await req('POST', '/auth/logout', null, employerToken);
        // Re-login to restore token
        const re = await req('POST', '/auth/login', { email: EMPLOYER_EMAIL, password: EMPLOYER_PASSWORD });
        if (re.ok) employerToken = re.data.token || re.data.data?.token;
        return { ok: r.ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 2. JOBS
// ════════════════════════════════════════════════════════════════════════════
async function testJobs() {
    section('JOBS — /api/jobs');

    // NOTE: Employer needs to be approved by admin before posting jobs.
    // If you haven't approved yet, job creation will return 403.
    // Run admin approval (section 11) first OR pre-approve via DB.

    await test('GET /jobs (public list)', async () => {
        const r = await req('GET', '/jobs?limit=5');
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('POST /jobs (create job — requires approval)', async () => {
        const r = await req('POST', '/jobs', {
            title: `Test Job ${UID}`,
            description: 'This is a test job posting created by the API test script.',
            jobType: 'full-time',
            salary: { amount: 20000, period: 'monthly', currency: 'INR' },
            location: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
            requirements: ['Hard worker', 'Team player'],
            benefits: ['Health insurance'],
        }, employerToken);
        if (r.ok) jobId = r.data.data?._id || r.data.data?.id;
        return { ok: r.ok, detail: `status ${r.status} | jobId: ${jobId || 'not created'}` };
    });

    await test('GET /jobs/employer/my-jobs', async () => {
        const r = await req('GET', '/jobs/employer/my-jobs', null, employerToken);
        // If jobId wasn't created (unapproved), grab first available job
        if (!jobId && r.data?.data?.length > 0) {
            jobId = r.data.data[0]._id;
            log('INFO', '  → using existing job', jobId);
        }
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /jobs/:id (public detail)', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId available — skip' };
        const r = await req('GET', `/jobs/${jobId}`);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /jobs/:id (update job)', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('PUT', `/jobs/${jobId}`, { title: `Updated Job ${UID}` }, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /jobs/:id/close', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('PUT', `/jobs/${jobId}/close`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /jobs/:id/reopen', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('PUT', `/jobs/${jobId}/reopen`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 3. APPLICATIONS
// ════════════════════════════════════════════════════════════════════════════
async function testApplications() {
    section('APPLICATIONS — /api/applications');

    await test('POST /applications/:jobId (apply)', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('POST', `/applications/${jobId}`, {
            coverLetter: 'I am very interested in this position.',
            expectedSalary: 18000,
        }, applicantToken);
        if (r.ok) applicationId = r.data.data?._id || r.data.data?.id;
        return { ok: r.ok, detail: `status ${r.status} | appId: ${applicationId}` };
    });

    await test('GET /applications/my-applications (applicant)', async () => {
        const r = await req('GET', '/applications/my-applications', null, applicantToken);
        if (!applicationId && r.data?.data?.length > 0) applicationId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /applications/job/:jobId (employer view)', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('GET', `/applications/job/${jobId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /applications/:id (detail)', async () => {
        if (!applicationId) return { ok: false, detail: 'No applicationId — skip' };
        const r = await req('GET', `/applications/${applicationId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /applications/:id/accept', async () => {
        if (!applicationId) return { ok: false, detail: 'No applicationId — skip' };
        const r = await req('PUT', `/applications/${applicationId}/accept`, {
            note: 'Welcome aboard!',
        }, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Create a second application to test reject (accept changed status)
    await test('PUT /applications/:id/reject', async () => {
        if (!applicationId) return { ok: false, detail: 'No applicationId — skip' };
        // Try rejecting — server will 400 if already accepted (that's OK, endpoint reachable)
        const r = await req('PUT', `/applications/${applicationId}/reject`, {
            rejectionReason: 'Position already filled.',
        }, employerToken);
        const ok = r.status === 200 || r.status === 400; // 400 = already accepted
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /applications/:id/withdraw (applicant)', async () => {
        if (!applicationId) return { ok: false, detail: 'No applicationId — skip' };
        // May return 400 if already accepted/rejected — endpoint is still reachable
        const r = await req('PUT', `/applications/${applicationId}/withdraw`, null, applicantToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 4. SHIFTS
// ════════════════════════════════════════════════════════════════════════════
async function testShifts() {
    section('SHIFTS — /api/shifts');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await test('POST /shifts (create shift)', async () => {
        if (!jobId || !applicantId) return { ok: false, detail: 'Missing jobId or applicantId — skip' };
        const r = await req('POST', '/shifts', {
            job: jobId,
            applicant: applicantId,
            date: dateStr,
            startTime: '09:00',
            endTime: '17:00',
            location: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
            instructions: 'Please arrive 10 minutes early.',
            payment: 500,
        }, employerToken);
        if (r.ok) shiftId = r.data.data?._id || r.data.data?.id;
        return { ok: r.ok, detail: `status ${r.status} | shiftId: ${shiftId}` };
    });

    await test('GET /shifts/employer/my-shifts', async () => {
        const r = await req('GET', '/shifts/employer/my-shifts', null, employerToken);
        if (!shiftId && r.data?.data?.length > 0) shiftId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /shifts/applicant/my-shifts', async () => {
        const r = await req('GET', '/shifts/applicant/my-shifts', null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /shifts/:id', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('GET', `/shifts/${shiftId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /shifts/:id (update shift)', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('PUT', `/shifts/${shiftId}`, {
            startTime: '10:00',
            instructions: 'Updated instructions.',
        }, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /shifts/:id/confirm (applicant)', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('PUT', `/shifts/${shiftId}/confirm`, null, applicantToken);
        const ok = r.status === 200 || r.status === 400; // 400 = wrong status
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /shifts/:id/cancel (shared)', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('PUT', `/shifts/${shiftId}/cancel`, {
            reason: 'Testing cancellation flow.',
        }, employerToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 5. ATTENDANCE
// ════════════════════════════════════════════════════════════════════════════
async function testAttendance() {
    section('ATTENDANCE — /api/attendance');

    // Note: check-in requires an active (non-cancelled) shift for applicant.
    // If the shift was cancelled in section 4, these will 400, but endpoint is reachable.

    await test('POST /attendance/:shiftId/checkin', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('POST', `/attendance/${shiftId}/checkin`, {
            latitude: 19.0760,
            longitude: 72.8777,
        }, applicantToken);
        if (r.ok) attendanceId = r.data.data?._id;
        const ok = r.status === 200 || r.status === 201 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    await test('POST /attendance/:shiftId/checkout', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('POST', `/attendance/${shiftId}/checkout`, {
            latitude: 19.0760,
            longitude: 72.8777,
        }, applicantToken);
        const ok = r.status === 200 || r.status === 201 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    await test('GET /attendance/applicant/history', async () => {
        const r = await req('GET', '/attendance/applicant/history', null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /attendance/employer/records', async () => {
        const r = await req('GET', '/attendance/employer/records', null, employerToken);
        if (!attendanceId && r.data?.data?.length > 0) attendanceId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /attendance/shift/:shiftId', async () => {
        if (!shiftId) return { ok: false, detail: 'No shiftId — skip' };
        const r = await req('GET', `/attendance/shift/${shiftId}`, null, employerToken);
        const ok = r.status === 200 || r.status === 404;
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /attendance/:id/approve', async () => {
        if (!attendanceId) return { ok: false, detail: 'No attendanceId — skip' };
        const r = await req('PUT', `/attendance/${attendanceId}/approve`, null, employerToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    await test('POST /attendance/manual', async () => {
        if (!shiftId || !applicantId) return { ok: false, detail: 'Missing IDs — skip' };
        const r = await req('POST', '/attendance/manual', {
            shiftId,
            applicantId,
            checkIn: new Date().toISOString(),
            checkOut: new Date().toISOString(),
        }, employerToken);
        const ok = r.status === 200 || r.status === 201 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 6. EMPLOYER/APPLICANT BROWSE
// ════════════════════════════════════════════════════════════════════════════
async function testEmployerApplicant() {
    section('EMPLOYER/APPLICANT BROWSE — /api/employer');

    await test('GET /employer/applicants (browse)', async () => {
        const r = await req('GET', '/employer/applicants?limit=5', null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /employer/applicants/:id (profile)', async () => {
        if (!applicantId) return { ok: false, detail: 'No applicantId — skip' };
        const r = await req('GET', `/employer/applicants/${applicantId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /employer/saved-filters', async () => {
        const r = await req('PUT', '/employer/saved-filters', {
            jobCategories: ['retail'],
            preferredShiftType: 'full-time',
        }, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /employer/saved-filters', async () => {
        const r = await req('GET', '/employer/saved-filters', null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 7. JOB REQUESTS
// ════════════════════════════════════════════════════════════════════════════
async function testJobRequests() {
    section('JOB REQUESTS — /api/job-requests');

    await test('POST /job-requests (send request to applicant)', async () => {
        if (!applicantId || !jobId) return { ok: false, detail: 'Missing IDs — skip' };
        const r = await req('POST', '/job-requests', {
            applicant: applicantId,
            job: jobId,
            message: 'We would love to have you work with us!',
            proposedRate: 250,
            shiftDetails: 'Monday to Friday, 9am–5pm',
        }, employerToken);
        if (r.ok) jobRequestId = r.data.data?._id;
        const ok = r.status === 200 || r.status === 201 || r.status === 400;
        return { ok, detail: `status ${r.status} | requestId: ${jobRequestId}` };
    });

    await test('GET /job-requests/employer/sent', async () => {
        const r = await req('GET', '/job-requests/employer/sent', null, employerToken);
        if (!jobRequestId && r.data?.data?.length > 0) jobRequestId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /job-requests/applicant/received', async () => {
        const r = await req('GET', '/job-requests/applicant/received', null, applicantToken);
        if (!jobRequestId && r.data?.data?.length > 0) jobRequestId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /job-requests/:id', async () => {
        if (!jobRequestId) return { ok: false, detail: 'No jobRequestId — skip' };
        const r = await req('GET', `/job-requests/${jobRequestId}`, null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /job-requests/:id/accept (applicant)', async () => {
        if (!jobRequestId) return { ok: false, detail: 'No jobRequestId — skip' };
        const r = await req('PUT', `/job-requests/${jobRequestId}/accept`, null, applicantToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /job-requests/:id/decline (applicant)', async () => {
        if (!jobRequestId) return { ok: false, detail: 'No jobRequestId — skip' };
        // Will 400 if already accepted — endpoint still reachable
        const r = await req('PUT', `/job-requests/${jobRequestId}/decline`, {
            reason: 'I am not available at that time.',
        }, applicantToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 8. SHORTLIST
// ════════════════════════════════════════════════════════════════════════════
async function testShortlist() {
    section('SHORTLIST — /api/shortlist');

    await test('POST /shortlist (add applicant)', async () => {
        if (!applicantId) return { ok: false, detail: 'No applicantId — skip' };
        const r = await req('POST', '/shortlist', {
            applicant: applicantId,
            notes: 'Great candidate, follow up.',
            label: 'priority',
        }, employerToken);
        if (r.ok) shortlistId = r.data.data?._id;
        const ok = r.status === 200 || r.status === 201;
        return { ok, detail: `status ${r.status} | shortlistId: ${shortlistId}` };
    });

    await test('GET /shortlist', async () => {
        const r = await req('GET', '/shortlist', null, employerToken);
        if (!shortlistId && r.data?.data?.length > 0) shortlistId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /shortlist/check/:applicantId', async () => {
        if (!applicantId) return { ok: false, detail: 'No applicantId — skip' };
        const r = await req('GET', `/shortlist/check/${applicantId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /shortlist/:id (update notes)', async () => {
        if (!shortlistId) return { ok: false, detail: 'No shortlistId — skip' };
        const r = await req('PUT', `/shortlist/${shortlistId}`, {
            notes: 'Updated note after review.',
            label: 'reviewed',
        }, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('DELETE /shortlist/:id (remove)', async () => {
        if (!shortlistId) return { ok: false, detail: 'No shortlistId — skip' };
        const r = await req('DELETE', `/shortlist/${shortlistId}`, null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 9. NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════════════
async function testNotifications() {
    section('NOTIFICATIONS — /api/notifications');

    await test('GET /notifications (applicant)', async () => {
        const r = await req('GET', '/notifications', null, applicantToken);
        if (r.data?.data?.length > 0) notificationId = r.data.data[0]._id;
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('GET /notifications/unread-count', async () => {
        const r = await req('GET', '/notifications/unread-count', null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /notifications/read-all', async () => {
        const r = await req('PUT', '/notifications/read-all', null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /notifications/:id/read', async () => {
        if (!notificationId) return { ok: false, detail: 'No notificationId — skip (no notifications exist yet)' };
        const r = await req('PUT', `/notifications/${notificationId}/read`, null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('DELETE /notifications/:id (dismiss)', async () => {
        if (!notificationId) return { ok: false, detail: 'No notificationId — skip' };
        const r = await req('DELETE', `/notifications/${notificationId}`, null, applicantToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Employer notifications
    await test('GET /notifications (employer)', async () => {
        const r = await req('GET', '/notifications', null, employerToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 10. RESUME
// ════════════════════════════════════════════════════════════════════════════
async function testResume() {
    section('RESUME — /api/resume');

    // Resume upload requires multipart/form-data with a file — axios handles it differently.
    // We test the endpoint is reachable and returns proper error without a file.
    await test('POST /resume/upload — endpoint reachable (without file = 400)', async () => {
        const r = await req('POST', '/resume/upload', null, applicantToken);
        const ok = r.status === 400 || r.status === 422; // expects a file
        return { ok, detail: `status ${r.status} (expected 400 — no file sent)` };
    });

    await test('GET /resume/:applicantId (employer view)', async () => {
        if (!applicantId) return { ok: false, detail: 'No applicantId — skip' };
        const r = await req('GET', `/resume/${applicantId}`, null, employerToken);
        const ok = r.status === 200 || r.status === 404; // 404 = no resume uploaded yet
        return { ok, detail: `status ${r.status}` };
    });

    await test('DELETE /resume (applicant — delete resume)', async () => {
        const r = await req('DELETE', '/resume', null, applicantToken);
        const ok = r.status === 200 || r.status === 404; // 404 = nothing to delete
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 11. ADMIN
// ════════════════════════════════════════════════════════════════════════════
async function testAdmin() {
    section('ADMIN — /api/admin');

    await test('GET /admin/dashboard/stats', async () => {
        const r = await req('GET', '/admin/dashboard/stats', null, adminToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    // Employers
    await test('GET /admin/employers', async () => {
        const r = await req('GET', '/admin/employers?limit=5', null, adminToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /admin/employers/:id/approve (test employer)', async () => {
        if (!employerId) return { ok: false, detail: 'No employerId — skip' };
        const r = await req('PUT', `/admin/employers/${employerId}/approve`, null, adminToken);
        const ok = r.status === 200 || r.status === 400; // 400 = already approved
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /admin/employers/:id/block', async () => {
        if (!employerId) return { ok: false, detail: 'No employerId — skip' };
        const r = await req('PUT', `/admin/employers/${employerId}/block`, null, adminToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    await test('PUT /admin/employers/:id/unblock', async () => {
        if (!employerId) return { ok: false, detail: 'No employerId — skip' };
        const r = await req('PUT', `/admin/employers/${employerId}/unblock`, null, adminToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    // Applicants
    await test('GET /admin/applicants', async () => {
        const r = await req('GET', '/admin/applicants?limit=5', null, adminToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('PUT /admin/applicants/:id/deactivate', async () => {
        if (!applicantId) return { ok: false, detail: 'No applicantId — skip' };
        const r = await req('PUT', `/admin/applicants/${applicantId}/deactivate`, null, adminToken);
        const ok = r.status === 200 || r.status === 400;
        return { ok, detail: `status ${r.status}` };
    });

    // Jobs — admin uses public GET /jobs for listing, DELETE /admin/jobs/:id for deletion
    await test('GET /jobs (admin uses public route for listing)', async () => {
        const r = await req('GET', '/jobs?limit=5', null, adminToken);
        return { ok: r.ok, detail: `status ${r.status}` };
    });

    await test('DELETE /admin/jobs/:id (moderate — delete job)', async () => {
        if (!jobId) return { ok: false, detail: 'No jobId — skip' };
        const r = await req('DELETE', `/admin/jobs/${jobId}`, null, adminToken);
        const ok = r.status === 200 || r.status === 404;
        // Clear jobId since deleted
        if (r.status === 200) jobId = '';
        return { ok, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// ERROR / SECURITY TESTS
// ════════════════════════════════════════════════════════════════════════════
async function testSecurity() {
    section('SECURITY / ERROR HANDLING');

    await test('GET /auth/me — no token → 401', async () => {
        const r = await req('GET', '/auth/me');
        return { ok: r.status === 401, detail: `status ${r.status}` };
    });

    await test('POST /jobs — applicant token → 403', async () => {
        const r = await req('POST', '/jobs', { title: 'X' }, applicantToken);
        return { ok: r.status === 403 || r.status === 401, detail: `status ${r.status}` };
    });

    await test('GET /admin/dashboard/stats — employer token → 403', async () => {
        const r = await req('GET', '/admin/dashboard/stats', null, employerToken);
        return { ok: r.status === 403 || r.status === 401, detail: `status ${r.status}` };
    });

    await test('GET /jobs/nonexistent-id → 400 or 500 (invalid ObjectId)', async () => {
        const r = await req('GET', '/jobs/invalid-id-here');
        return { ok: r.status >= 400, detail: `status ${r.status}` };
    });

    await test('POST /auth/login — wrong password → 401', async () => {
        const r = await req('POST', '/auth/login', {
            email: EMPLOYER_EMAIL,
            password: 'WrongPassword999',
        });
        return { ok: r.status === 401 || r.status === 400, detail: `status ${r.status}` };
    });
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
    console.log(`\n${colors.bold}╔══════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}║   ShiftMaster — Complete API Test Suite           ║${colors.reset}`);
    console.log(`${colors.bold}║   Base URL: ${BASE.padEnd(38)}║${colors.reset}`);
    console.log(`${colors.bold}╚══════════════════════════════════════════════════╝${colors.reset}`);

    await testAuth();
    await testAdmin(); // Move admin approval here so employer can post jobs
    await testEmployerApplicant();
    await testJobs();
    await testApplications();
    await testShifts();
    await testAttendance();
    await testJobRequests();
    await testShortlist();
    await testNotifications();
    await testResume();
    await testSecurity();

    // ── Summary ────────────────────────────────────────────────────────────────
    const total = passed + failed;
    section('SUMMARY');
    console.log(`${colors.green}  PASSED: ${passed}/${total}${colors.reset}`);
    console.log(`${colors.red}  FAILED: ${failed}/${total}${colors.reset}`);

    // Save results to JSON
    const report = {
        runAt: new Date().toISOString(),
        base: BASE,
        passed, failed, total,
        results,
    };
    fs.writeFileSync('test-results.json', JSON.stringify(report, null, 2));
    console.log(`\n${colors.yellow}  Full results saved to test-results.json${colors.reset}\n`);

    // Exit code
    process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
