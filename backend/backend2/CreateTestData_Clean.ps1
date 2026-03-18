# ShiftMaster Test Data Creation Script
# This PowerShell script creates test data using the API

$baseUrl = "http://localhost:5000/api"

Write-Host "`nShiftMaster Test Data Creation" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Function to make API requests
function Invoke-APIRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null
    )
    
    $url = "$baseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -Body $jsonBody
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Step 1: Register Employers
Write-Host "`n Step 1: Creating Employers..." -ForegroundColor Yellow

$employer1 = @{
    storeName = "The Grand Restaurant"
    ownerName = "John Smith"
    email = "john@grandrestaurant.com"
    phone = "9876543210"
    password = "password123"
    address = @{
        street = "123 MG Road"
        city = "Mumbai"
        state = "Maharashtra"
        pincode = "400001"
    }
    businessType = "restaurant"
    businessDescription = "Fine dining restaurant specializing in continental cuisine"
}

$result1 = Invoke-APIRequest -Method POST -Endpoint "/auth/employer/signup" -Body $employer1
if ($result1 -and $result1.success) {
    Write-Host "    Employer 1 created: john@grandrestaurant.com" -ForegroundColor Green
} else {
    Write-Host "     Employer 1 may already exist or failed to create" -ForegroundColor Yellow
}

$employer2 = @{
    storeName = "Quick Bites Cafe"
    ownerName = "Sarah Johnson"
    email = "sarah@quickbites.com"
    phone = "9876543211"
    password = "password123"
    address = @{
        street = "456 Brigade Road"
        city = "Bangalore"
        state = "Karnataka"
        pincode = "560001"
    }
    businessType = "cafe"
    businessDescription = "Fast casual cafe with fresh sandwiches and coffee"
}

$result2 = Invoke-APIRequest -Method POST -Endpoint "/auth/employer/signup" -Body $employer2
if ($result2 -and $result2.success) {
    Write-Host "    Employer 2 created: sarah@quickbites.com" -ForegroundColor Green
} else {
    Write-Host "     Employer 2 may already exist or failed to create" -ForegroundColor Yellow
}

# Step 2: Register Applicants
Write-Host "`n Step 2: Creating Applicants..." -ForegroundColor Yellow

$applicant1 = @{
    name = "Priya Sharma"
    phone = "9123456780"
    email = "priya.sharma@email.com"
    password = "password123"
    skills = @("customer service", "communication", "teamwork")
    experience = 2
    preferredJobType = "shift"
}

$result3 = Invoke-APIRequest -Method POST -Endpoint "/auth/applicant/signup" -Body $applicant1
if ($result3 -and $result3.success) {
    Write-Host "    Applicant 1 created: priya.sharma@email.com" -ForegroundColor Green
} else {
    Write-Host "     Applicant 1 may already exist or failed to create" -ForegroundColor Yellow
}

$applicant2 = @{
    name = "Rahul Kumar"
    phone = "9123456781"
    email = "rahul.kumar@email.com"
    password = "password123"
    skills = @("cooking", "food preparation", "kitchen management")
    experience = 3
    preferredJobType = "full-time"
}

$result4 = Invoke-APIRequest -Method POST -Endpoint "/auth/applicant/signup" -Body $applicant2
if ($result4 -and $result4.success) {
    Write-Host "    Applicant 2 created: rahul.kumar@email.com" -ForegroundColor Green
} else {
    Write-Host "     Applicant 2 may already exist or failed to create" -ForegroundColor Yellow
}

$applicant3 = @{
    name = "Anita Patel"
    phone = "9123456782"
    email = "anita.patel@email.com"
    password = "password123"
    skills = @("sales", "customer service", "inventory management")
    experience = 1
    preferredJobType = "part-time"
}

$result5 = Invoke-APIRequest -Method POST -Endpoint "/auth/applicant/signup" -Body $applicant3
if ($result5 -and $result5.success) {
    Write-Host "    Applicant 3 created: anita.patel@email.com" -ForegroundColor Green
} else {
    Write-Host "     Applicant 3 may already exist or failed to create" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host " TEST DATA CREATION COMPLETED!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n Login Credentials:" -ForegroundColor Cyan

Write-Host "`n   EMPLOYERS:" -ForegroundColor Yellow
Write-Host "   1. john@grandrestaurant.com / password123"
Write-Host "   2. sarah@quickbites.com / password123"

Write-Host "`n   APPLICANTS:" -ForegroundColor Yellow
Write-Host "   1. priya.sharma@email.com / password123"
Write-Host "   2. rahul.kumar@email.com / password123"
Write-Host "   3. anita.patel@email.com / password123"

Write-Host "`n Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Login as employer to create jobs"
Write-Host "   2. Login as applicant to apply for jobs"
Write-Host "   3. Use Postman collection for more detailed testing"

Write-Host "`n You can now test the API with this data!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
