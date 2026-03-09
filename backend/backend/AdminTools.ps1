# ShiftMaster Admin Tools
# Quick admin operations for ShiftMaster platform

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("menu", "stats", "approve", "employers", "applicants", "login")]
    [string]$Action = "menu",
    
    [Parameter(Mandatory = $false)]
    [string]$AdminEmail = "admin@shiftmaster.com",
    
    [Parameter(Mandatory = $false)]
    [string]$AdminPassword = "admin123456"
)

$baseUrl = "http://localhost:5000/api"
$script:adminToken = $null

# Colors
function Write-Success { param([string]$Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Warning { param([string]$Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host $Message -ForegroundColor Red }

# Login and get admin token
function Get-AdminToken {
    Write-Info "`nLogging in as admin..."
    
    try {
        $body = @{
            identifier = $AdminEmail
            password   = $AdminPassword
            userType   = "admin"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Headers @{"Content-Type" = "application/json" } -Body $body
        
        if ($response.success) {
            Write-Success "✓ Logged in successfully as $($response.data.name)"
            return $response.token
        }
        else {
            Write-Error "Login failed: $($response.message)"
            return $null
        }
    }
    catch {
        Write-Error "Login error: $($_.Exception.Message)"
        Write-Warning "`nMake sure you've created an admin account first:"
        Write-Host "  node createAdmin.js"
        return $null
    }
}

# Get dashboard statistics
function Get-DashboardStats {
    param([string]$Token)
    
    Write-Info "`nFetching dashboard statistics..."
    
    try {
        $headers = @{ "Authorization" = "Bearer $Token" }
        $stats = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Headers $headers
        
        if ($stats.success) {
            Write-Host "`n========================================" -ForegroundColor Cyan
            Write-Host "  SHIFTMASTER PLATFORM STATISTICS" -ForegroundColor Cyan
            Write-Host "========================================`n" -ForegroundColor Cyan
            
            Write-Host "EMPLOYERS:" -ForegroundColor Yellow
            Write-Host "  Total:    $($stats.data.totalEmployers)"
            Write-Host "  Active:   $($stats.data.activeEmployers)" -ForegroundColor Green
            Write-Host "  Pending:  $($stats.data.pendingEmployers)" -ForegroundColor Yellow
            
            Write-Host "`nAPPLICANTS:" -ForegroundColor Yellow
            Write-Host "  Total:    $($stats.data.totalApplicants)"
            Write-Host "  Active:   $($stats.data.activeApplicants)" -ForegroundColor Green
            
            Write-Host "`nJOBS:" -ForegroundColor Yellow
            Write-Host "  Total:    $($stats.data.totalJobs)"
            Write-Host "  Active:   $($stats.data.activeJobs)" -ForegroundColor Green
            
            Write-Host "`nAPPLICATIONS:" -ForegroundColor Yellow
            Write-Host "  Total:    $($stats.data.totalApplications)"
            Write-Host "  Pending:  $($stats.data.pendingApplications)" -ForegroundColor Yellow
            
            Write-Host "`nSHIFTS:" -ForegroundColor Yellow
            Write-Host "  Total:    $($stats.data.totalShifts)"
            Write-Host "  Upcoming: $($stats.data.upcomingShifts)" -ForegroundColor Cyan
            
            Write-Host "`n========================================`n" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Error "Error fetching stats: $($_.Exception.Message)"
    }
}

# Get all employers
function Get-AllEmployers {
    param([string]$Token, [string]$Status = "")
    
    Write-Info "`nFetching employers..."
    
    try {
        $headers = @{ "Authorization" = "Bearer $Token" }
        $url = "$baseUrl/admin/employers"
        if ($Status) { $url += "?status=$Status" }
        
        $response = Invoke-RestMethod -Uri $url -Headers $headers
        
        if ($response.success -and $response.data.Count -gt 0) {
            Write-Host "`nEMPLOYERS ($($response.pagination.totalItems)):" -ForegroundColor Cyan
            Write-Host ("=" * 80) -ForegroundColor Cyan
            
            foreach ($emp in $response.data) {
                $statusIcon = if ($emp.isApproved) { "✓" } else { "⏳" }
                $statusColor = if ($emp.isApproved) { "Green" } else { "Yellow" }
                
                Write-Host "`n$statusIcon " -NoNewline -ForegroundColor $statusColor
                Write-Host "$($emp.storeName)" -ForegroundColor White
                Write-Host "   ID:       $($emp._id)"
                Write-Host "   Owner:    $($emp.ownerName)"
                Write-Host "   Email:    $($emp.email)"
                Write-Host "   Type:     $($emp.businessType)"
                Write-Host "   Location: $($emp.address.city), $($emp.address.state)"
                Write-Host "   Approved: $($emp.isApproved)" -ForegroundColor $statusColor
                Write-Host "   Jobs:     $($emp.jobsPosted)"
            }
            Write-Host "`n" + ("=" * 80) + "`n" -ForegroundColor Cyan
        }
        else {
            Write-Warning "No employers found."
        }
    }
    catch {
        Write-Error "Error fetching employers: $($_.Exception.Message)"
    }
}

# Approve all pending employers
function Approve-AllEmployers {
    param([string]$Token)
    
    Write-Info "`nFetching pending employers..."
    
    try {
        $headers = @{ "Authorization" = "Bearer $Token" }
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/employers?status=pending" -Headers $headers
        
        if ($response.success -and $response.data.Count -gt 0) {
            Write-Host "`nFound $($response.data.Count) pending employer(s):`n" -ForegroundColor Yellow
            
            foreach ($emp in $response.data) {
                Write-Host "Approving: $($emp.storeName) ($($emp.email))..." -NoNewline
                
                try {
                    $approveResult = Invoke-RestMethod -Uri "$baseUrl/admin/employers/$($emp._id)/approve" -Method PUT -Headers $headers
                    
                    if ($approveResult.success) {
                        Write-Success " ✓ Approved!"
                    }
                    else {
                        Write-Error " ✗ Failed: $($approveResult.message)"
                    }
                }
                catch {
                    Write-Error " ✗ Error: $($_.Exception.Message)"
                }
            }
            
            Write-Success "`nAll pending employers have been processed!"
        }
        else {
            Write-Info "No pending employers to approve."
        }
    }
    catch {
        Write-Error "Error: $($_.Exception.Message)"
    }
}

# Get all applicants
function Get-AllApplicants {
    param([string]$Token)
    
    Write-Info "`nFetching applicants..."
    
    try {
        $headers = @{ "Authorization" = "Bearer $Token" }
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/applicants" -Headers $headers
        
        if ($response.success -and $response.data.Count -gt 0) {
            Write-Host "`nAPPLICANTS ($($response.pagination.totalItems)):" -ForegroundColor Cyan
            Write-Host ("=" * 80) -ForegroundColor Cyan
            
            foreach ($app in $response.data) {
                $statusIcon = if ($app.isActive) { "✓" } else { "✗" }
                $statusColor = if ($app.isActive) { "Green" } else { "Red" }
                
                Write-Host "`n$statusIcon " -NoNewline -ForegroundColor $statusColor
                Write-Host "$($app.name)" -ForegroundColor White
                Write-Host "   ID:          $($app._id)"
                Write-Host "   Email:       $($app.email)"
                Write-Host "   Phone:       $($app.phone)"
                Write-Host "   Experience:  $($app.experience) years"
                Write-Host "   Skills:      $($app.skills -join ', ')"
                Write-Host "   Job Type:    $($app.preferredJobType)"
                Write-Host "   Applications: $($app.applicationsCount)"
                Write-Host "   Active:      $($app.isActive)" -ForegroundColor $statusColor
            }
            Write-Host "`n" + ("=" * 80) + "`n" -ForegroundColor Cyan
        }
        else {
            Write-Warning "No applicants found."
        }
    }
    catch {
        Write-Error "Error fetching applicants: $($_.Exception.Message)"
    }
}

# Show menu
function Show-Menu {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  SHIFTMASTER ADMIN TOOLS" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Available Actions:" -ForegroundColor Yellow
    Write-Host "  1. stats      - View dashboard statistics"
    Write-Host "  2. approve    - Approve all pending employers"
    Write-Host "  3. employers  - List all employers"
    Write-Host "  4. applicants - List all applicants"
    Write-Host "  5. login      - Test admin login"
    
    Write-Host "`nUsage Examples:" -ForegroundColor Yellow
    Write-Host "  .\AdminTools.ps1 -Action stats"
    Write-Host "  .\AdminTools.ps1 -Action approve"
    Write-Host "  .\AdminTools.ps1 -Action employers"
    
    Write-Host "`nCustom Admin Credentials:" -ForegroundColor Yellow
    Write-Host "  .\AdminTools.ps1 -Action stats -AdminEmail 'your@email.com' -AdminPassword 'yourpass'"
    
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

# Main execution
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "  SHIFTMASTER ADMIN CONTROL PANEL" -ForegroundColor Cyan
Write-Host ("=" * 60) + "`n" -ForegroundColor Cyan

# Execute action
switch ($Action) {
    "login" {
        $token = Get-AdminToken
        if ($token) {
            Write-Success "`nToken obtained successfully!"
            Write-Host "Token: $token`n"
        }
    }
    "stats" {
        $token = Get-AdminToken
        if ($token) {
            Get-DashboardStats -Token $token
        }
    }
    "approve" {
        $token = Get-AdminToken
        if ($token) {
            Approve-AllEmployers -Token $token
        }
    }
    "employers" {
        $token = Get-AdminToken
        if ($token) {
            Get-AllEmployers -Token $token
        }
    }
    "applicants" {
        $token = Get-AdminToken
        if ($token) {
            Get-AllApplicants -Token $token
        }
    }
    default {
        Show-Menu
    }
}

Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""
