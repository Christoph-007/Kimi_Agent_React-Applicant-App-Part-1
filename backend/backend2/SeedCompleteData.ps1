# Comprehensive Test Data Creation via API
$baseUrl = "http://localhost:5000/api"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SHIFTMASTER COMPREHENSIVE DATA SEEDING" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to make API requests
function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null
    )
    
    $url = "$baseUrl$Endpoint"
    $headers = @{ "Content-Type" = "application/json" }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -Body $jsonBody
        }
        else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers
        }
        return $response
    }
    catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Step 1: Create Employers
Write-Host "Step 1: Creating Employers..." -ForegroundColor Yellow

$employers = @(
    @{
        storeName           = "The Grand Restaurant"
        ownerName           = "John Smith"
        email               = "john@grandrestaurant.com"
        phone               = "9876543210"
        password            = "password123"
        address             = @{
            street  = "123 MG Road"
            city    = "Mumbai"
            state   = "Maharashtra"
            pincode = "400001"
        }
        businessType        = "restaurant"
        businessDescription = "Fine dining restaurant specializing in continental cuisine"
    },
    @{
        storeName           = "Quick Bites Cafe"
        ownerName           = "Sarah Johnson"
        email               = "sarah@quickbites.com"
        phone               = "9876543211"
        password            = "password123"
        address             = @{
            street  = "456 Brigade Road"
            city    = "Bangalore"
            state   = "Karnataka"
            pincode = "560001"
        }
        businessType        = "cafe"
        businessDescription = "Fast casual cafe with fresh sandwiches and coffee"
    },
    @{
        storeName           = "Retail Paradise"
        ownerName           = "Michael Brown"
        email               = "michael@retailparadise.com"
        phone               = "9876543212"
        password            = "password123"
        address             = @{
            street  = "789 Park Street"
            city    = "Delhi"
            state   = "Delhi"
            pincode = "110001"
        }
        businessType        = "retail"
        businessDescription = "Multi-brand retail store"
    }
)

$employerTokens = @{}
foreach ($emp in $employers) {
    $result = Invoke-API -Method POST -Endpoint "/auth/employer/signup" -Body $emp
    if ($result -and $result.success) {
        Write-Host "   Created: $($emp.email)" -ForegroundColor Green
        # Login to get token
        $login = Invoke-API -Method POST -Endpoint "/auth/login" -Body @{
            identifier = $emp.email
            password   = $emp.password
            userType   = "employer"
        }
        if ($login -and $login.success) {
            $employerTokens[$emp.email] = $login.token
        }
    }
    else {
        Write-Host "   Skipped: $($emp.email) (may already exist)" -ForegroundColor Yellow
        # Try to login anyway
        $login = Invoke-API -Method POST -Endpoint "/auth/login" -Body @{
            identifier = $emp.email
            password   = $emp.password
            userType   = "employer"
        }
        if ($login -and $login.success) {
            $employerTokens[$emp.email] = $login.token
        }
    }
}

# Step 2: Create Applicants
Write-Host "`nStep 2: Creating Applicants..." -ForegroundColor Yellow

$applicants = @(
    @{
        name             = "Priya Sharma"
        phone            = "9123456780"
        email            = "priya.sharma@email.com"
        password         = "password123"
        skills           = @("customer service", "communication", "teamwork")
        experience       = 2
        preferredJobType = "shift"
    },
    @{
        name             = "Rahul Kumar"
        phone            = "9123456781"
        email            = "rahul.kumar@email.com"
        password         = "password123"
        skills           = @("cooking", "food preparation", "kitchen management")
        experience       = 3
        preferredJobType = "full-time"
    },
    @{
        name             = "Anita Patel"
        phone            = "9123456782"
        email            = "anita.patel@email.com"
        password         = "password123"
        skills           = @("sales", "customer service", "inventory management")
        experience       = 1
        preferredJobType = "part-time"
    },
    @{
        name             = "Vikram Singh"
        phone            = "9123456783"
        email            = "vikram.singh@email.com"
        password         = "password123"
        skills           = @("delivery", "driving", "logistics")
        experience       = 4
        preferredJobType = "shift"
    },
    @{
        name             = "Sneha Reddy"
        phone            = "9123456784"
        email            = "sneha.reddy@email.com"
        password         = "password123"
        skills           = @("barista", "coffee making", "customer service")
        experience       = 1
        preferredJobType = "part-time"
    }
)

$applicantTokens = @{}
foreach ($app in $applicants) {
    $result = Invoke-API -Method POST -Endpoint "/auth/applicant/signup" -Body $app
    if ($result -and $result.success) {
        Write-Host "   Created: $($app.email)" -ForegroundColor Green
        # Login to get token
        $login = Invoke-API -Method POST -Endpoint "/auth/login" -Body @{
            identifier = $app.email
            password   = $app.password
            userType   = "applicant"
        }
        if ($login -and $login.success) {
            $applicantTokens[$app.email] = $login.token
        }
    }
    else {
        Write-Host "   Skipped: $($app.email) (may already exist)" -ForegroundColor Yellow
        # Try to login anyway
        $login = Invoke-API -Method POST -Endpoint "/auth/login" -Body @{
            identifier = $app.email
            password   = $app.password
            userType   = "applicant"
        }
        if ($login -and $login.success) {
            $applicantTokens[$app.email] = $login.token
        }
    }
}

# Step 3: Create Jobs
Write-Host "`nStep 3: Creating Jobs..." -ForegroundColor Yellow

$jobs = @(
    @{
        employer     = "john@grandrestaurant.com"
        title        = "Waiter/Waitress"
        description  = "Looking for experienced waiters to join our fine dining team"
        jobType      = "shift"
        salary       = @{ amount = 500; period = "daily" }
        location     = @{
            address = "123 MG Road"
            city    = "Mumbai"
            state   = "Maharashtra"
            pincode = "400001"
        }
        requirements = @{
            minimumExperience = 1
            skills            = @("customer service", "communication")
            education         = "High School"
        }
        openings     = 3
    },
    @{
        employer     = "john@grandrestaurant.com"
        title        = "Chef"
        description  = "Experienced chef needed for continental cuisine"
        jobType      = "full-time"
        salary       = @{ amount = 35000; period = "monthly" }
        location     = @{
            address = "123 MG Road"
            city    = "Mumbai"
            state   = "Maharashtra"
            pincode = "400001"
        }
        requirements = @{
            minimumExperience = 3
            skills            = @("cooking", "food preparation")
            education         = "Culinary Degree Preferred"
        }
        openings     = 1
    },
    @{
        employer     = "sarah@quickbites.com"
        title        = "Barista"
        description  = "Join our team as a barista!"
        jobType      = "part-time"
        salary       = @{ amount = 300; period = "daily" }
        location     = @{
            address = "456 Brigade Road"
            city    = "Bangalore"
            state   = "Karnataka"
            pincode = "560001"
        }
        requirements = @{
            minimumExperience = 0
            skills            = @("customer service", "coffee making")
            education         = "Any"
        }
        openings     = 2
    },
    @{
        employer     = "michael@retailparadise.com"
        title        = "Sales Associate"
        description  = "Help customers find products and manage inventory"
        jobType      = "full-time"
        salary       = @{ amount = 25000; period = "monthly" }
        location     = @{
            address = "789 Park Street"
            city    = "Delhi"
            state   = "Delhi"
            pincode = "110001"
        }
        requirements = @{
            minimumExperience = 1
            skills            = @("sales", "customer service")
            education         = "High School"
        }
        openings     = 4
    }
)

$createdJobs = @()
foreach ($job in $jobs) {
    $employerEmail = $job.employer
    $token = $employerTokens[$employerEmail]
    
    if ($token) {
        $jobData = $job.Clone()
        $jobData.Remove("employer")
        
        $result = Invoke-API -Method POST -Endpoint "/jobs" -Body $jobData -Token $token
        if ($result -and $result.success) {
            Write-Host "   Created: $($job.title) by $employerEmail" -ForegroundColor Green
            $createdJobs += $result.data
        }
        else {
            Write-Host "   Failed: $($job.title)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "   Skipped: $($job.title) (no employer token)" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DATA SEEDING COMPLETED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Login Credentials:`n" -ForegroundColor Cyan

Write-Host "EMPLOYERS:" -ForegroundColor Yellow
Write-Host "  1. john@grandrestaurant.com / password123"
Write-Host "  2. sarah@quickbites.com / password123"
Write-Host "  3. michael@retailparadise.com / password123"

Write-Host "`nAPPLICANTS:" -ForegroundColor Yellow
Write-Host "  1. priya.sharma@email.com / password123"
Write-Host "  2. rahul.kumar@email.com / password123"
Write-Host "  3. anita.patel@email.com / password123"
Write-Host "  4. vikram.singh@email.com / password123"
Write-Host "  5. sneha.reddy@email.com / password123"

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  - Browse jobs: GET http://localhost:5000/api/jobs"
Write-Host "  - Login and apply for jobs as applicants"
Write-Host "  - Use Postman collection for comprehensive testing"

Write-Host "`n========================================`n" -ForegroundColor Cyan
