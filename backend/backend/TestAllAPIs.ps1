# ShiftMaster API Testing Script
# Tests all major API endpoints

$baseUrl = "http://localhost:5000/api"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null,
        [bool]$ExpectSuccess = $true
    )
    
    Write-Host "`nTesting: $Name" -ForegroundColor Cyan
    Write-Host "  $Method $Endpoint" -ForegroundColor Gray
    
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $params = @{
            Uri     = "$baseUrl$Endpoint"
            Method  = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        
        if ($response.success -eq $ExpectSuccess) {
            Write-Host "  PASS" -ForegroundColor Green
            $script:testResults += @{ Test = $Name; Status = "PASS"; Response = $response }
            return $response
        }
        else {
            Write-Host "  FAIL - Unexpected success value" -ForegroundColor Red
            $script:testResults += @{ Test = $Name; Status = "FAIL"; Error = "Unexpected success value" }
            return $null
        }
    }
    catch {
        Write-Host "  FAIL - $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{ Test = $Name; Status = "FAIL"; Error = $_.Exception.Message }
        return $null
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SHIFTMASTER API TESTING SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n=== HEALTH CHECK ===" -ForegroundColor Yellow
Test-Endpoint -Name "API Health Check" -Method GET -Endpoint "/"

# Test 2: Authentication - Employer
Write-Host "`n=== AUTHENTICATION ===" -ForegroundColor Yellow

$employerLogin = Test-Endpoint -Name "Employer Login" -Method POST -Endpoint "/auth/login" -Body @{
    identifier = "john@grandrestaurant.com"
    password   = "password123"
    userType   = "employer"
}
$employerToken = if ($employerLogin) { $employerLogin.token } else { $null }

# Test 3: Authentication - Applicant
$applicantLogin = Test-Endpoint -Name "Applicant Login" -Method POST -Endpoint "/auth/login" -Body @{
    identifier = "priya.sharma@email.com"
    password   = "password123"
    userType   = "applicant"
}
$applicantToken = if ($applicantLogin) { $applicantLogin.token } else { $null }

# Test 4: Create Admin and Login
Write-Host "`n=== ADMIN SETUP ===" -ForegroundColor Yellow
Write-Host "Creating admin account..." -ForegroundColor Gray

# Run createAdmin.js
$createAdminOutput = node createAdmin.js 2>&1
if ($createAdminOutput -match "created successfully" -or $createAdminOutput -match "already exists") {
    Write-Host "  Admin account ready" -ForegroundColor Green
}

$adminLogin = Test-Endpoint -Name "Admin Login" -Method POST -Endpoint "/auth/login" -Body @{
    identifier = "admin@shiftmaster.com"
    password   = "admin123456"
    userType   = "admin"
}
$adminToken = if ($adminLogin) { $adminLogin.token } else { $null }

# Test 5: Admin - Dashboard Stats
Write-Host "`n=== ADMIN ENDPOINTS ===" -ForegroundColor Yellow
if ($adminToken) {
    Test-Endpoint -Name "Get Dashboard Stats" -Method GET -Endpoint "/admin/dashboard/stats" -Token $adminToken
    
    # Get employers for approval
    $employers = Test-Endpoint -Name "Get All Employers" -Method GET -Endpoint "/admin/employers?status=pending" -Token $adminToken
    
    # Approve employers
    if ($employers -and $employers.data -and $employers.data.Count -gt 0) {
        Write-Host "`nApproving employers..." -ForegroundColor Gray
        foreach ($emp in $employers.data) {
            Test-Endpoint -Name "Approve Employer: $($emp.storeName)" -Method PUT -Endpoint "/admin/employers/$($emp._id)/approve" -Token $adminToken
        }
        
        # Re-login employer to get updated token
        Start-Sleep -Seconds 1
        $employerLogin = Test-Endpoint -Name "Employer Re-Login (After Approval)" -Method POST -Endpoint "/auth/login" -Body @{
            identifier = "john@grandrestaurant.com"
            password   = "password123"
            userType   = "employer"
        }
        $employerToken = if ($employerLogin) { $employerLogin.token } else { $null }
    }
    
    Test-Endpoint -Name "Get All Applicants" -Method GET -Endpoint "/admin/applicants" -Token $adminToken
}
else {
    Write-Host "  Skipping admin tests (no token)" -ForegroundColor Yellow
}

# Test 6: Jobs - Public Browse
Write-Host "`n=== JOB ENDPOINTS (PUBLIC) ===" -ForegroundColor Yellow
Test-Endpoint -Name "Browse All Jobs" -Method GET -Endpoint "/jobs"
Test-Endpoint -Name "Browse Jobs (Filter by City)" -Method GET -Endpoint "/jobs?city=Mumbai"
Test-Endpoint -Name "Browse Jobs (Filter by Type)" -Method GET -Endpoint "/jobs?jobType=shift"

# Test 7: Jobs - Employer Create
Write-Host "`n=== JOB ENDPOINTS (EMPLOYER) ===" -ForegroundColor Yellow
if ($employerToken) {
    $newJob = Test-Endpoint -Name "Create Job" -Method POST -Endpoint "/jobs" -Token $employerToken -Body @{
        title        = "Test Waiter Position"
        description  = "Testing job creation via API"
        jobType      = "shift"
        salary       = @{
            amount = 500
            period = "daily"
        }
        location     = @{
            address = "123 Test Street"
            city    = "Mumbai"
            state   = "Maharashtra"
            pincode = "400001"
        }
        requirements = @{
            minimumExperience = 1
            skills            = @("customer service")
            education         = "High School"
        }
        openings     = 2
    }
    
    if ($newJob -and $newJob.data) {
        $jobId = $newJob.data._id
        
        Test-Endpoint -Name "Get My Jobs" -Method GET -Endpoint "/jobs/employer/my-jobs" -Token $employerToken
        Test-Endpoint -Name "Get Job Details" -Method GET -Endpoint "/jobs/$jobId"
        Test-Endpoint -Name "Update Job" -Method PUT -Endpoint "/jobs/$jobId" -Token $employerToken -Body @{
            openings = 3
        }
    }
}
else {
    Write-Host "  Skipping employer job tests (no token or not approved)" -ForegroundColor Yellow
}

# Test 8: Applications - Applicant
Write-Host "`n=== APPLICATION ENDPOINTS ===" -ForegroundColor Yellow
if ($applicantToken) {
    # Get available jobs first
    $jobs = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method GET
    
    if ($jobs.data -and $jobs.data.Count -gt 0) {
        $testJobId = $jobs.data[0]._id
        
        $newApplication = Test-Endpoint -Name "Apply for Job" -Method POST -Endpoint "/applications" -Token $applicantToken -Body @{
            jobId       = $testJobId
            coverLetter = "I am very interested in this position and believe I would be a great fit."
        }
        
        Test-Endpoint -Name "Get My Applications" -Method GET -Endpoint "/applications/applicant/my-applications" -Token $applicantToken
        
        if ($newApplication -and $newApplication.data) {
            $appId = $newApplication.data._id
            Test-Endpoint -Name "Get Application Details" -Method GET -Endpoint "/applications/$appId" -Token $applicantToken
        }
    }
    else {
        Write-Host "  No jobs available to apply for" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  Skipping application tests (no applicant token)" -ForegroundColor Yellow
}

# Test 9: Applications - Employer Review
Write-Host "`n=== APPLICATION MANAGEMENT (EMPLOYER) ===" -ForegroundColor Yellow
if ($employerToken) {
    $employerApps = Test-Endpoint -Name "Get Applications for My Jobs" -Method GET -Endpoint "/applications/employer/received" -Token $employerToken
    
    if ($employerApps -and $employerApps.data -and $employerApps.data.Count -gt 0) {
        $appId = $employerApps.data[0]._id
        
        Test-Endpoint -Name "Shortlist Application" -Method PUT -Endpoint "/applications/$appId/shortlist" -Token $employerToken
        Test-Endpoint -Name "Accept Application" -Method PUT -Endpoint "/applications/$appId/accept" -Token $employerToken
    }
}

# Test 10: Shifts
Write-Host "`n=== SHIFT ENDPOINTS ===" -ForegroundColor Yellow
if ($employerToken -and $newJob -and $newJob.data) {
    $jobId = $newJob.data._id
    
    # Get accepted applications for this job
    $acceptedApps = Invoke-RestMethod -Uri "$baseUrl/applications/employer/received?jobId=$jobId&status=accepted" -Headers @{"Authorization" = "Bearer $employerToken" } -ErrorAction SilentlyContinue
    
    if ($acceptedApps -and $acceptedApps.data -and $acceptedApps.data.Count -gt 0) {
        $applicantId = $acceptedApps.data[0].applicant._id
        
        $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
        
        $newShift = Test-Endpoint -Name "Create Shift" -Method POST -Endpoint "/shifts" -Token $employerToken -Body @{
            job       = $jobId
            applicant = $applicantId
            date      = $tomorrow
            startTime = "09:00"
            endTime   = "17:00"
            location  = @{
                address = "123 Test Street"
                city    = "Mumbai"
                state   = "Maharashtra"
                pincode = "400001"
            }
        }
        
        if ($newShift -and $newShift.data) {
            Test-Endpoint -Name "Get My Shifts (Employer)" -Method GET -Endpoint "/shifts/employer/my-shifts" -Token $employerToken
        }
    }
}

# Test 11: Attendance
Write-Host "`n=== ATTENDANCE ENDPOINTS ===" -ForegroundColor Yellow
if ($employerToken) {
    Test-Endpoint -Name "Get Attendance Records" -Method GET -Endpoint "/attendance" -Token $employerToken
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

if ($failCount -gt 0) {
    Write-Host "`nFailed Tests:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Test): $($_.Error)" -ForegroundColor Red
    }
}

$successRate = [math]::Round(($passCount / $totalCount) * 100, 2)
Write-Host "`nSuccess Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Export results
$testResults | ConvertTo-Json -Depth 10 | Out-File "test-results.json"
Write-Host "Detailed results saved to: test-results.json`n" -ForegroundColor Gray
