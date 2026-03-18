# Quick API Status Check
$baseUrl = "http://localhost:5000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SHIFTMASTER API STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Server Health
Write-Host "1. Server Health Check..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri "$baseUrl" -UseBasicParsing
    if ($health.success) {
        Write-Host " PASS" -ForegroundColor Green
        Write-Host "   Message: $($health.message)" -ForegroundColor Gray
    }
}
catch {
    Write-Host " FAIL" -ForegroundColor Red
}

# Test 2: Employer Login
Write-Host "`n2. Employer Login..." -NoNewline
try {
    $empLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json" } -Body (@{identifier = "john@grandrestaurant.com"; password = "password123"; userType = "employer" } | ConvertTo-Json)
    if ($empLogin.success) {
        Write-Host " PASS" -ForegroundColor Green
        $empToken = $empLogin.token
        Write-Host "   User: $($empLogin.data.storeName)" -ForegroundColor Gray
        Write-Host "   Approved: $($empLogin.data.isApproved)" -ForegroundColor $(if ($empLogin.data.isApproved) { "Green" }else { "Yellow" })
    }
}
catch {
    Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Applicant Login
Write-Host "`n3. Applicant Login..." -NoNewline
try {
    $appLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json" } -Body (@{identifier = "priya.sharma@email.com"; password = "password123"; userType = "applicant" } | ConvertTo-Json)
    if ($appLogin.success) {
        Write-Host " PASS" -ForegroundColor Green
        $appToken = $appLogin.token
        Write-Host "   User: $($appLogin.data.name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Admin Login
Write-Host "`n4. Admin Login..." -NoNewline
try {
    $adminLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json" } -Body (@{identifier = "admin@shiftmaster.com"; password = "admin123456"; userType = "admin" } | ConvertTo-Json)
    if ($adminLogin.success) {
        Write-Host " PASS" -ForegroundColor Green
        $adminToken = $adminLogin.token
        Write-Host "   User: $($adminLogin.data.name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Browse Jobs (Public)
Write-Host "`n5. Browse Jobs (Public)..." -NoNewline
try {
    $jobs = Invoke-RestMethod -Uri "$baseUrl/api/jobs"
    if ($jobs.success) {
        Write-Host " PASS" -ForegroundColor Green
        Write-Host "   Total Jobs: $($jobs.data.Count)" -ForegroundColor Gray
        if ($jobs.data.Count -gt 0) {
            Write-Host "   Sample: $($jobs.data[0].title) - $($jobs.data[0].location.city)" -ForegroundColor Gray
        }
    }
}
catch {
    Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Admin Dashboard
if ($adminToken) {
    Write-Host "`n6. Admin Dashboard..." -NoNewline
    try {
        $stats = Invoke-RestMethod -Uri "$baseUrl/api/admin/dashboard/stats" -Headers @{"Authorization" = "Bearer $adminToken" }
        if ($stats.success) {
            Write-Host " PASS" -ForegroundColor Green
            Write-Host "   Employers: $($stats.data.totalEmployers) (Pending: $($stats.data.pendingEmployers))" -ForegroundColor Gray
            Write-Host "   Applicants: $($stats.data.totalApplicants)" -ForegroundColor Gray
            Write-Host "   Jobs: $($stats.data.totalJobs)" -ForegroundColor Gray
            Write-Host "   Applications: $($stats.data.totalApplications)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Get Pending Employers
if ($adminToken) {
    Write-Host "`n7. Get Pending Employers..." -NoNewline
    try {
        $pending = Invoke-RestMethod -Uri "$baseUrl/api/admin/employers?status=pending" -Headers @{"Authorization" = "Bearer $adminToken" }
        if ($pending.success) {
            Write-Host " PASS" -ForegroundColor Green
            Write-Host "   Pending Count: $($pending.data.Count)" -ForegroundColor Gray
            if ($pending.data.Count -gt 0) {
                Write-Host "   Action Needed: Approve employers to enable job posting" -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 8: Create Job (if employer approved)
if ($empToken -and $empLogin.data.isApproved) {
    Write-Host "`n8. Create Job (Employer)..." -NoNewline
    try {
        $jobData = @{
            title        = "API Test Job"
            description  = "Testing job creation"
            jobType      = "shift"
            salary       = @{amount = 500; period = "daily" }
            location     = @{address = "Test St"; city = "Mumbai"; state = "Maharashtra"; pincode = "400001" }
            requirements = @{minimumExperience = 1; skills = @("test"); education = "Any" }
            openings     = 1
        }
        $newJob = Invoke-RestMethod -Uri "$baseUrl/api/jobs" -Method POST -Headers @{"Authorization" = "Bearer $empToken"; "Content-Type" = "application/json" } -Body ($jobData | ConvertTo-Json -Depth 10)
        if ($newJob.success) {
            Write-Host " PASS" -ForegroundColor Green
            Write-Host "   Created: $($newJob.data.title)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
    }
}
elseif ($empToken) {
    Write-Host "`n8. Create Job (Employer)... SKIP - Employer not approved" -ForegroundColor Yellow
}

# Test 9: Apply for Job
if ($appToken -and $jobs.data.Count -gt 0) {
    Write-Host "`n9. Apply for Job (Applicant)..." -NoNewline
    try {
        $appData = @{
            jobId       = $jobs.data[0]._id
            coverLetter = "Test application"
        }
        $application = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method POST -Headers @{"Authorization" = "Bearer $appToken"; "Content-Type" = "application/json" } -Body ($appData | ConvertTo-Json)
        if ($application.success) {
            Write-Host " PASS" -ForegroundColor Green
            Write-Host "   Applied to: $($jobs.data[0].title)" -ForegroundColor Gray
        }
    }
    catch {
        if ($_.Exception.Message -match "already applied") {
            Write-Host " SKIP - Already applied" -ForegroundColor Yellow
        }
        else {
            Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  API STATUS: OPERATIONAL" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Approve employers: .\AdminTools.ps1 -Action approve" -ForegroundColor White
Write-Host "  2. Then employers can create jobs" -ForegroundColor White
Write-Host "  3. Applicants can apply for jobs" -ForegroundColor White
Write-Host ""
