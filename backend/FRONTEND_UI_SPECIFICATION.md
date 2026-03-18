# ShiftMaster Frontend - Complete UI/UX Specification

## 📊 Overview Statistics

### Total Pages: 23
- **Public Pages**: 6
- **Employer Pages**: 9
- **Applicant Pages**: 6
- **Admin Pages**: 4

### Total Components: 65+
- **Common Components**: 12
- **Authentication Components**: 4
- **Job Components**: 6
- **Application Components**: 5
- **Shift Components**: 6
- **Attendance Components**: 6
- **Admin Components**: 5
- **Page Components**: 23

### Total Buttons/Actions: 150+
### Total Forms: 15
### Total Tables/Lists: 18
### Total Modals/Dialogs: 12

---

## 📄 Complete Page Breakdown

### PUBLIC PAGES (6 Pages)

#### 1. **Home Page** (`/`)
**Purpose**: Landing page with platform overview and job highlights

**Elements**:
- Hero Section
  - Main heading: "Find Your Perfect Job Match"
  - Subheading: "Connect with top employers for shift-based and full-time opportunities"
  - CTA Button: "Browse Jobs" (Primary)
  - CTA Button: "Post a Job" (Secondary)
  - Background: Gradient with illustrations

- Featured Jobs Section
  - Heading: "Featured Opportunities"
  - Job Cards Grid (6 cards)
  - Button: "View All Jobs"

- How It Works Section
  - 3 Step Cards:
    1. "Create Account" - Icon + Description
    2. "Apply for Jobs" - Icon + Description
    3. "Start Working" - Icon + Description

- For Employers Section
  - Heading: "Hire Top Talent"
  - Features List (4 items with icons)
  - Button: "Get Started"

- Statistics Section
  - Counter: Total Jobs Posted
  - Counter: Active Applicants
  - Counter: Successful Hires
  - Counter: Companies Registered

- Footer
  - Links (4 columns)
  - Contact Information
  - Social Media Icons
  - Copyright

**Total Buttons**: 5
**Total Sections**: 6

---

#### 2. **Job Listings Page** (`/jobs`)
**Purpose**: Browse all available jobs with filters

**Elements**:
- Page Header
  - Title: "Browse Jobs"
  - Subtitle: "Find your next opportunity"

- Filter Panel (Card)
  - Search Input: Text search with icon
  - Filter: Job Type (Dropdown)
  - Filter: City (Text Input)
  - Filter: State (Text Input)
  - Filter: Min Salary (Number Input)
  - Button: "Apply Filters" (Primary)
  - Button: "Clear Filters" (Secondary)

- Results Header
  - Text: "Showing X results"
  - Sort Dropdown: "Sort by: Latest/Salary/Applications"

- Job Cards Grid
  - JobCard Component (repeated)
  - Each card shows:
    - Job Title (Clickable)
    - Company Name
    - Location (Icon + Text)
    - Salary (Icon + Text)
    - Job Type Badge
    - Skills Tags (max 3)
    - Views Count
    - Applications Count
    - Posted Date
    - Status Badge

- Pagination Component
  - Previous Button
  - Page Numbers (1, 2, 3, ..., Last)
  - Next Button

**Total Inputs**: 5
**Total Buttons**: 4 (+ pagination buttons)
**Total Cards**: Dynamic (10 per page)

---

#### 3. **Job Details Page** (`/jobs/:id`)
**Purpose**: View complete job information and apply

**Elements**:
- Breadcrumb Navigation
  - Home > Jobs > [Job Title]

- Job Header Card
  - Job Title (Large)
  - Company Name
  - Status Badge
  - Location (Icon + Text)
  - Posted Date
  - Views Count
  - Applications Count

- Job Details Card
  - Section: Description
    - Full description text
  
  - Section: Salary
    - Amount + Period
    - Icon display
  
  - Section: Working Hours
    - Hours per day
    - Days per week
    - Shift timing
  
  - Section: Requirements
    - Minimum Experience
    - Required Skills (Tags)
    - Education
    - Other Requirements
  
  - Section: Benefits
    - Benefits list (Tags)
  
  - Section: Location
    - Full address
    - City, State, Pincode

- Sidebar Card
  - Company Information
    - Business Type
    - Contact (if available)
  
  - Action Buttons:
    - "Apply Now" (Primary) - For Applicants
    - "Login to Apply" (Primary) - For Guests
    - "Edit Job" (Secondary) - For Job Owner
    - "Close Job" (Danger) - For Job Owner
    - "Delete Job" (Danger) - For Job Owner

- Similar Jobs Section
  - Heading: "Similar Opportunities"
  - Job Cards (3-4 cards)

**Total Buttons**: 3-5 (depending on user role)
**Total Sections**: 8

---

#### 4. **Login Page** (`/login`)
**Purpose**: User authentication

**Elements**:
- Page Container (Centered Card)
  - Logo/Brand
  - Heading: "Welcome Back"
  - Subheading: "Login to your account"

- LoginForm Component
  - Radio Group: User Type
    - Option: "Job Seeker"
    - Option: "Employer"
    - Option: "Admin"
  
  - Input: Email/Phone (with icon)
  - Input: Password (with icon, toggle visibility)
  - Button: "Login" (Primary, Full Width)
  
  - Link: "Forgot Password?"

- Divider: "OR"

- Sign Up Links
  - Text: "Don't have an account?"
  - Link: "Sign up as Job Seeker"
  - Link: "Sign up as Employer"

**Total Inputs**: 3 (including radio group)
**Total Buttons**: 1
**Total Links**: 3

---

#### 5. **Employer Signup Page** (`/signup/employer`)
**Purpose**: Employer registration

**Elements**:
- Page Header
  - Logo/Brand
  - Heading: "Create Employer Account"
  - Subheading: "Start hiring top talent today"

- EmployerSignupForm Component
  - Section: Business Information
    - Input: Store/Business Name *
    - Input: Owner Name *
    - Input: Email *
    - Input: Phone Number *
    - Dropdown: Business Type *
    - Textarea: Business Description
  
  - Section: Account Security
    - Input: Password *
    - Input: Confirm Password *
  
  - Section: Business Address
    - Input: Street Address
    - Input: City *
    - Input: State *
    - Input: Pincode *
  
  - Button: "Create Employer Account" (Primary, Full Width)
  
  - Info Text: "Your account will be reviewed by admin"

- Footer Links
  - Text: "Already have an account?"
  - Link: "Login here"

**Total Inputs**: 11
**Total Buttons**: 1
**Total Links**: 1

---

#### 6. **Applicant Signup Page** (`/signup/applicant`)
**Purpose**: Applicant registration

**Elements**:
- Page Header
  - Logo/Brand
  - Heading: "Create Job Seeker Account"
  - Subheading: "Find your dream job today"

- ApplicantSignupForm Component
  - Section: Personal Information
    - Input: Full Name *
    - Input: Phone Number *
    - Input: Email (Optional)
    - Input: Experience (Years)
    - Dropdown: Preferred Job Type
  
  - Section: Account Security
    - Input: Password *
    - Input: Confirm Password *
  
  - Section: Skills
    - Input: Add Skill (with Add button)
    - Skills Display: Tags (removable)
  
  - Section: Resume Upload
    - File Upload Area (Drag & Drop)
    - Button: "Choose File"
    - Accepted formats: PDF, DOC, DOCX
    - Max size: 5MB
    - Upload Progress Bar
    - Success Message
  
  - Button: "Create Applicant Account" (Primary, Full Width)

- Footer Links
  - Text: "Already have an account?"
  - Link: "Login here"

**Total Inputs**: 8
**Total Buttons**: 3 (Add Skill, Choose File, Submit)
**Total Links**: 1

---

### EMPLOYER PAGES (9 Pages)

#### 7. **Employer Dashboard** (`/employer/dashboard`)
**Purpose**: Overview of employer account and activities

**Elements**:
- Page Header
  - Heading: "Dashboard"
  - Greeting: "Welcome back, [Store Name]"

- Account Status Alert (if not approved)
  - Warning Icon
  - Message: "Your account is pending admin approval"
  - Description: "You can view jobs but cannot post until approved"

- Statistics Cards (4 Cards)
  - Card 1: Total Jobs Posted
    - Icon
    - Number (Large)
    - Label
    - Trend indicator
  
  - Card 2: Active Jobs
    - Icon
    - Number (Large)
    - Label
    - Button: "View All"
  
  - Card 3: Total Applications
    - Icon
    - Number (Large)
    - Label
    - Button: "Review"
  
  - Card 4: Upcoming Shifts
    - Icon
    - Number (Large)
    - Label
    - Button: "Manage"

- Recent Applications Section
  - Heading: "Recent Applications"
  - Table/List:
    - Columns: Applicant Name, Job Title, Applied Date, Status
    - Actions: View, Accept, Reject
  - Button: "View All Applications"

- Upcoming Shifts Section
  - Heading: "Upcoming Shifts (Next 7 Days)"
  - Calendar/List View Toggle
  - Shift Cards:
    - Applicant Name
    - Job Title
    - Date & Time
    - Status Badge
    - Button: "View Details"
  - Button: "View All Shifts"

- Quick Actions Card
  - Button: "Post New Job" (Primary)
  - Button: "Create Shift"
  - Button: "View Attendance"

**Total Cards**: 7
**Total Buttons**: 11
**Total Tables**: 1

---

#### 8. **My Jobs Page** (`/employer/jobs`)
**Purpose**: Manage all posted jobs

**Elements**:
- Page Header
  - Heading: "My Jobs"
  - Button: "Post New Job" (Primary)

- Tabs Navigation
  - Tab: "All Jobs"
  - Tab: "Open"
  - Tab: "Closed"
  - Tab: "Filled"

- Filter Bar
  - Search Input: "Search jobs..."
  - Sort Dropdown: "Sort by: Latest/Applications/Views"

- Jobs Table/Grid
  - Each Row/Card:
    - Job Title (Clickable)
    - Status Badge
    - Posted Date
    - Applications Count
    - Views Count
    - Actions Dropdown:
      - "View Details"
      - "Edit Job"
      - "View Applications"
      - "Close Job" / "Reopen Job"
      - "Delete Job"

- Pagination Component

- Empty State (if no jobs)
  - Icon
  - Message: "No jobs posted yet"
  - Button: "Post Your First Job"

**Total Buttons**: 2 (+ action buttons per job)
**Total Inputs**: 2
**Total Tabs**: 4

---

#### 9. **Create Job Page** (`/employer/jobs/create`)
**Purpose**: Post a new job

**Elements**:
- Page Header
  - Heading: "Post a New Job"
  - Breadcrumb: Dashboard > My Jobs > Create

- JobForm Component (Multi-section Form)
  
  - Card 1: Basic Information
    - Input: Job Title *
    - Textarea: Description *
    - Dropdown: Job Type *
  
  - Card 2: Salary
    - Input: Amount *
    - Dropdown: Period * (Hourly/Daily/Weekly/Monthly/Yearly)
  
  - Card 3: Location
    - Input: Address
    - Input: City *
    - Input: State *
    - Input: Pincode *
  
  - Card 4: Working Hours
    - Input: Hours Per Day
    - Input: Days Per Week
    - Input: Shift Timing
  
  - Card 5: Requirements
    - Input: Minimum Experience (Years)
    - Skills Input: Add Skill (with tags)
    - Input: Education
    - Textarea: Other Requirements
  
  - Card 6: Benefits
    - Benefits Input: Add Benefit (with tags)
  
  - Action Buttons:
    - Button: "Create Job" (Primary)
    - Button: "Save as Draft" (Secondary)
    - Button: "Cancel" (Secondary)

**Total Inputs**: 15+
**Total Buttons**: 3
**Total Cards**: 6

---

#### 10. **Edit Job Page** (`/employer/jobs/:id/edit`)
**Purpose**: Update existing job

**Elements**:
- Same as Create Job Page but:
  - Heading: "Edit Job"
  - Pre-filled form data
  - Button: "Update Job" instead of "Create Job"
  - Additional Button: "Delete Job" (Danger)

**Total Inputs**: 15+
**Total Buttons**: 4

---

#### 11. **Job Applications Page** (`/employer/jobs/:id/applications`)
**Purpose**: Review applications for a specific job

**Elements**:
- Page Header
  - Heading: "[Job Title] - Applications"
  - Breadcrumb: Dashboard > My Jobs > [Job] > Applications
  - Job Info Card (Summary)

- Filter Tabs
  - Tab: "All"
  - Tab: "Applied"
  - Tab: "Reviewing"
  - Tab: "Accepted"
  - Tab: "Rejected"

- Applications List
  - Each Application Card:
    - Applicant Photo/Avatar
    - Applicant Name
    - Applied Date
    - Status Badge
    - Expected Salary
    - Experience
    - Skills Tags
    - Button: "View Details" (Expands card)
    
    - Expanded View:
      - Cover Letter
      - Resume Link (Download)
      - Contact Information
      - Full Skills List
      - Action Buttons:
        - "Accept Application" (Success)
        - "Reject Application" (Danger)
        - "Mark as Reviewing" (Secondary)

- Bulk Actions (if multiple selected)
  - Checkbox: Select All
  - Button: "Accept Selected"
  - Button: "Reject Selected"

- Pagination Component

**Total Buttons**: 3-5 per application
**Total Tabs**: 5
**Total Cards**: Dynamic

---

#### 12. **My Shifts Page** (`/employer/shifts`)
**Purpose**: Manage all shifts

**Elements**:
- Page Header
  - Heading: "My Shifts"
  - Button: "Create Shift" (Primary)

- View Toggle
  - Button: "Calendar View"
  - Button: "List View"

- Filter Bar
  - Date Range Picker
  - Dropdown: Status Filter
  - Dropdown: Job Filter
  - Search: Applicant Name

- Calendar View (if selected)
  - Full Calendar Component
  - Shift markers on dates
  - Click to view details
  - Color coding by status

- List View (if selected)
  - Shift Cards Grid:
    - Applicant Name + Photo
    - Job Title
    - Date & Time
    - Location
    - Status Badge
    - Confirmed Badge (if confirmed)
    - Actions:
      - "View Details"
      - "Edit Shift"
      - "Cancel Shift"
      - "Delete Shift"

- Pagination Component

**Total Buttons**: 6+
**Total Views**: 2
**Total Inputs**: 4

---

#### 13. **Create Shift Page** (`/employer/shifts/create`)
**Purpose**: Assign shift to accepted applicant

**Elements**:
- Page Header
  - Heading: "Create Shift"
  - Breadcrumb: Dashboard > Shifts > Create

- ShiftForm Component
  - Section: Select Application
    - Dropdown: Job *
    - Dropdown: Accepted Applicant * (filtered by job)
    - Display: Applicant Details (after selection)
  
  - Section: Shift Details
    - Date Picker: Shift Date *
    - Time Input: Start Time * (HH:MM)
    - Time Input: End Time * (HH:MM)
    - Input: Location *
    - Textarea: Instructions
    - Input: Payment Amount
  
  - Action Buttons:
    - Button: "Create Shift" (Primary)
    - Button: "Cancel" (Secondary)

**Total Inputs**: 8
**Total Buttons**: 2

---

#### 14. **Attendance Records Page** (`/employer/attendance`)
**Purpose**: View and approve attendance

**Elements**:
- Page Header
  - Heading: "Attendance Records"

- Filter Bar
  - Date Range Picker
  - Dropdown: Status Filter (All/Present/Late/Absent)
  - Dropdown: Approval Status (All/Pending/Approved)
  - Dropdown: Job Filter
  - Search: Applicant Name

- Statistics Cards (3 Cards)
  - Total Attendance Records
  - Pending Approvals
  - Total Hours This Month

- Attendance Table
  - Columns:
    - Applicant Name
    - Job Title
    - Shift Date
    - Check-in Time
    - Check-out Time
    - Total Hours
    - Status Badge
    - Late Badge (if applicable)
    - Approval Status
    - Actions
  
  - Row Actions:
    - Button: "View Details"
    - Button: "Approve" (if pending)
    - Button: "View Location" (map icon)

- Attendance Details Modal (on View Details)
  - Applicant Information
  - Shift Information
  - Check-in Details:
    - Time
    - Location (Map)
    - Method (App/Manual)
    - Remarks
  - Check-out Details:
    - Time
    - Location (Map)
    - Method (App/Manual)
    - Remarks
  - Calculated Hours
  - Late Information (if applicable)
  - Input: Employer Remarks
  - Button: "Approve Attendance" (Success)
  - Button: "Close"

- Button: "Mark Manual Attendance" (Secondary)

- Pagination Component

**Total Buttons**: 4+ per record
**Total Inputs**: 5
**Total Modals**: 1

---

#### 15. **Employer Profile Page** (`/employer/profile`)
**Purpose**: View and update employer profile

**Elements**:
- Page Header
  - Heading: "My Profile"

- Profile Information Card
  - Display: Store Name
  - Display: Owner Name
  - Display: Email
  - Display: Phone
  - Display: Business Type
  - Display: Business Description
  - Display: Address
  - Display: Account Status Badge
  - Display: Approval Status
  - Display: Member Since
  - Button: "Edit Profile" (Secondary)

- Statistics Card
  - Total Jobs Posted
  - Active Jobs
  - Total Applications Received
  - Total Shifts Created

- Update Password Card
  - Input: Current Password
  - Input: New Password
  - Input: Confirm New Password
  - Button: "Update Password" (Primary)

- Account Actions
  - Button: "Download Data" (Secondary)
  - Button: "Deactivate Account" (Danger)

**Total Buttons**: 4
**Total Inputs**: 3
**Total Cards**: 3

---

### APPLICANT PAGES (6 Pages)

#### 16. **Applicant Dashboard** (`/applicant/dashboard`)
**Purpose**: Overview of applicant account and activities

**Elements**:
- Page Header
  - Heading: "Dashboard"
  - Greeting: "Welcome back, [Name]"

- Statistics Cards (4 Cards)
  - Total Applications
  - Accepted Applications
  - Upcoming Shifts
  - Completed Shifts

- Application Status Overview
  - Pie Chart or Progress Bars:
    - Applied
    - Reviewing
    - Accepted
    - Rejected

- Upcoming Shifts Section
  - Heading: "Upcoming Shifts"
  - Shift Cards (Next 5):
    - Company Name
    - Job Title
    - Date & Time
    - Location
    - Status Badge
    - Button: "View Details"
    - Button: "Check In" (if today)
  - Button: "View All Shifts"

- Recent Applications Section
  - Heading: "Recent Applications"
  - Application Cards:
    - Job Title
    - Company Name
    - Applied Date
    - Status Badge
    - Button: "View Details"
  - Button: "View All Applications"

- Recommended Jobs Section
  - Heading: "Recommended for You"
  - Job Cards (3-4)
  - Button: "Browse More Jobs"

- Quick Actions Card
  - Button: "Browse Jobs" (Primary)
  - Button: "My Applications"
  - Button: "My Shifts"

**Total Cards**: 11+
**Total Buttons**: 10+

---

#### 17. **Browse Jobs Page** (`/applicant/jobs`)
**Purpose**: Search and apply for jobs

**Elements**:
- Same as Public Job Listings Page (#2)
- Additional: "Apply" button on each job card
- Additional: Applied badge on jobs already applied to

---

#### 18. **My Applications Page** (`/applicant/applications`)
**Purpose**: Track all job applications

**Elements**:
- Page Header
  - Heading: "My Applications"

- Filter Tabs
  - Tab: "All"
  - Tab: "Applied"
  - Tab: "Reviewing"
  - Tab: "Accepted"
  - Tab: "Rejected"
  - Tab: "Withdrawn"

- Applications List
  - Each Application Card:
    - Job Title (Clickable)
    - Company Name
    - Applied Date
    - Status Badge with color coding
    - Expected Salary
    - Cover Letter Preview
    - Timeline/History:
      - Status changes with dates
    - Actions:
      - Button: "View Job Details"
      - Button: "Withdraw Application" (if not accepted/rejected)
      - Button: "View Details" (expand)

- Empty State
  - Icon
  - Message: "No applications yet"
  - Button: "Browse Jobs"

- Pagination Component

**Total Tabs**: 6
**Total Buttons**: 2-3 per application

---

#### 19. **My Shifts Page** (`/applicant/shifts`)
**Purpose**: View and manage assigned shifts

**Elements**:
- Page Header
  - Heading: "My Shifts"

- View Toggle
  - Button: "Calendar View"
  - Button: "List View"

- Filter Bar
  - Date Range Picker
  - Dropdown: Status Filter
  - Search: Job Title/Company

- Calendar View
  - Full Calendar Component
  - Shift markers
  - Color coding by status
  - Click to view details

- List View
  - Shift Cards:
    - Company Name
    - Job Title
    - Date & Time
    - Location (with map icon)
    - Payment Amount
    - Status Badge
    - Confirmation Status
    - Instructions (expandable)
    - Actions:
      - "Confirm Shift" (if not confirmed)
      - "Check In" (if today and confirmed)
      - "Check Out" (if checked in)
      - "View Attendance"
      - "Cancel Shift"
      - "View on Map"

- Pagination Component

**Total Buttons**: 5-6 per shift
**Total Views**: 2

---

#### 20. **Attendance History Page** (`/applicant/attendance`)
**Purpose**: View attendance records

**Elements**:
- Page Header
  - Heading: "Attendance History"

- Statistics Cards (4 Cards)
  - Total Shifts Worked
  - Total Hours
  - On-Time Percentage
  - Pending Approvals

- Filter Bar
  - Date Range Picker
  - Dropdown: Status Filter
  - Dropdown: Approval Status
  - Search: Job/Company

- Attendance Table/Cards
  - Each Record:
    - Company Name
    - Job Title
    - Shift Date
    - Check-in Time (with badge if late)
    - Check-out Time
    - Total Hours
    - Status Badge
    - Approval Status Badge
    - Actions:
      - Button: "View Details"

- Attendance Details Modal
  - Shift Information
  - Check-in Details:
    - Time
    - Location (Map)
    - Your Remarks
  - Check-out Details:
    - Time
    - Location (Map)
    - Your Remarks
  - Total Hours Worked
  - Late Information (if applicable)
  - Employer Remarks
  - Approval Status
  - Button: "Close"

- Export Button: "Download Report" (PDF/CSV)

- Pagination Component

**Total Cards**: 4+
**Total Buttons**: 2+
**Total Modals**: 1

---

#### 21. **Applicant Profile Page** (`/applicant/profile`)
**Purpose**: Manage applicant profile

**Elements**:
- Page Header
  - Heading: "My Profile"

- Profile Card
  - Avatar/Photo Upload
  - Display: Name
  - Display: Phone
  - Display: Email
  - Display: Experience
  - Display: Preferred Job Type
  - Display: Skills (Tags)
  - Display: Resume (Download link)
  - Display: Member Since
  - Button: "Edit Profile"

- Edit Profile Modal
  - Input: Name
  - Input: Email
  - Input: Experience
  - Dropdown: Preferred Job Type
  - Skills Manager (Add/Remove)
  - Availability Settings:
    - Days Checkboxes (Mon-Sun)
    - Time Slots Checkboxes (Morning/Afternoon/Evening/Night)
  - Resume Upload
  - Button: "Save Changes"
  - Button: "Cancel"

- Statistics Card
  - Total Applications
  - Acceptance Rate
  - Total Shifts Completed
  - Total Hours Worked
  - Average Rating (if implemented)

- Update Password Card
  - Input: Current Password
  - Input: New Password
  - Input: Confirm New Password
  - Button: "Update Password"

- Account Actions
  - Button: "Download Data"
  - Button: "Deactivate Account" (Danger)

**Total Buttons**: 5
**Total Inputs**: 6+
**Total Modals**: 1

---

### ADMIN PAGES (4 Pages)

#### 22. **Admin Dashboard** (`/admin/dashboard`)
**Purpose**: Platform overview and statistics

**Elements**:
- Page Header
  - Heading: "Admin Dashboard"
  - Subtitle: "Platform Overview"

- Key Metrics Cards (8 Cards in 2 rows)
  - Row 1:
    - Total Employers (with trend)
    - Pending Approvals (with alert badge)
    - Approved Employers
    - Blocked Employers
  
  - Row 2:
    - Total Applicants
    - Active Applicants
    - Total Jobs Posted
    - Open Jobs

- Charts Section
  - Chart 1: User Registration Trend (Line Chart)
    - Employers over time
    - Applicants over time
  
  - Chart 2: Job Statistics (Bar Chart)
    - Jobs by type
    - Jobs by status
  
  - Chart 3: Application Flow (Funnel Chart)
    - Total Applications
    - Accepted
    - Rejected
    - Withdrawn

- Recent Activity Feed
  - Heading: "Recent Platform Activity"
  - Activity Items:
    - New employer registrations
    - New job postings
    - Applications submitted
    - Shifts completed
  - Button: "View All Activity"

- Pending Actions Card
  - Heading: "Requires Attention"
  - List:
    - Pending Employer Approvals (count)
    - Reported Jobs (count)
    - Flagged Users (count)
  - Quick Action Buttons

- Quick Actions
  - Button: "Approve Employers"
  - Button: "Manage Users"
  - Button: "View Reports"

**Total Cards**: 11
**Total Charts**: 3
**Total Buttons**: 6

---

#### 23. **Manage Employers Page** (`/admin/employers`)
**Purpose**: Review and manage employer accounts

**Elements**:
- Page Header
  - Heading: "Manage Employers"

- Filter Tabs
  - Tab: "All"
  - Tab: "Pending Approval"
  - Tab: "Approved"
  - Tab: "Blocked"

- Filter Bar
  - Search Input: "Search by name, email, phone..."
  - Dropdown: Business Type Filter
  - Dropdown: Sort By

- Employers Table
  - Columns:
    - Store Name
    - Owner Name
    - Email
    - Phone
    - Business Type
    - Registration Date
    - Status Badge
    - Jobs Posted
    - Actions
  
  - Row Actions:
    - Button: "View Details"
    - Button: "Approve" (if pending)
    - Button: "Block" (if approved)
    - Button: "Unblock" (if blocked)
    - Button: "View Jobs"

- Employer Details Modal
  - Full employer information
  - Business details
  - Address
  - Registration date
  - Statistics:
    - Total jobs posted
    - Active jobs
    - Total applications received
  - Action Buttons:
    - "Approve Employer" (Success)
    - "Block Employer" (Danger)
    - "Send Message"
    - "Close"

- Block Employer Modal
  - Input: Reason for blocking
  - Checkbox: Notify employer via email
  - Button: "Confirm Block" (Danger)
  - Button: "Cancel"

- Pagination Component

**Total Tabs**: 4
**Total Buttons**: 4-5 per employer
**Total Modals**: 2

---

#### 24. **Manage Applicants Page** (`/admin/applicants`)
**Purpose**: View and manage applicant accounts

**Elements**:
- Page Header
  - Heading: "Manage Applicants"

- Filter Tabs
  - Tab: "All"
  - Tab: "Active"
  - Tab: "Inactive"

- Filter Bar
  - Search Input: "Search by name, email, phone..."
  - Dropdown: Preferred Job Type Filter
  - Dropdown: Experience Range
  - Dropdown: Sort By

- Applicants Table
  - Columns:
    - Name
    - Phone
    - Email
    - Experience
    - Preferred Job Type
    - Registration Date
    - Status Badge
    - Applications Count
    - Shifts Completed
    - Actions
  
  - Row Actions:
    - Button: "View Details"
    - Button: "Deactivate" (if active)
    - Button: "Activate" (if inactive)
    - Button: "View Applications"

- Applicant Details Modal
  - Personal information
  - Skills list
  - Experience
  - Resume link
  - Statistics:
    - Total applications
    - Accepted applications
    - Shifts completed
    - Total hours worked
  - Action Buttons:
    - "Deactivate Applicant" (Danger)
    - "Send Message"
    - "Close"

- Deactivate Applicant Modal
  - Input: Reason for deactivation
  - Checkbox: Notify applicant via email
  - Button: "Confirm Deactivate" (Danger)
  - Button: "Cancel"

- Pagination Component

**Total Tabs**: 3
**Total Buttons**: 3-4 per applicant
**Total Modals**: 2

---

#### 25. **Moderate Jobs Page** (`/admin/jobs`)
**Purpose**: Review and moderate job postings

**Elements**:
- Page Header
  - Heading: "Job Moderation"

- Filter Bar
  - Search Input: "Search jobs..."
  - Dropdown: Job Type Filter
  - Dropdown: Status Filter
  - Dropdown: Employer Filter
  - Date Range Picker

- Jobs Table
  - Columns:
    - Job Title
    - Employer Name
    - Job Type
    - Location
    - Salary
    - Posted Date
    - Status
    - Applications
    - Actions
  
  - Row Actions:
    - Button: "View Details"
    - Button: "Delete Job" (Danger)
    - Button: "Contact Employer"

- Job Details Modal
  - Complete job information
  - Employer details
  - Application statistics
  - Reported issues (if any)
  - Action Buttons:
    - "Delete Job" (Danger)
    - "Contact Employer"
    - "Close"

- Delete Job Modal
  - Warning message
  - Input: Reason for deletion
  - Checkbox: Notify employer
  - Button: "Confirm Delete" (Danger)
  - Button: "Cancel"

- Pagination Component

**Total Buttons**: 3 per job
**Total Modals**: 2
**Total Inputs**: 5

---

## 🎨 UI Components Breakdown

### Common Components (12)

1. **Navbar**
   - Logo
   - Navigation Links (dynamic based on user role)
   - User Dropdown Menu
   - Logout Button

2. **Footer**
   - 4 Column Layout
   - Links (20+)
   - Contact Information
   - Social Media Icons
   - Copyright

3. **Loader**
   - Spinner Animation
   - Sizes: Small, Medium, Large
   - Full-screen overlay option

4. **ProtectedRoute**
   - Authentication check
   - Role-based access
   - Redirect logic

5. **Pagination**
   - Previous Button
   - Page Numbers (dynamic)
   - Next Button
   - Current page highlight

6. **SearchBar**
   - Search Icon
   - Text Input
   - Clear Button
   - Submit on Enter

7. **FilterPanel**
   - Multiple filter inputs
   - Apply Button
   - Clear Button
   - Collapsible on mobile

8. **Modal**
   - Overlay
   - Close Button (X)
   - Header
   - Body
   - Footer with actions
   - Click outside to close

9. **Toast/Notification**
   - Success (Green)
   - Error (Red)
   - Warning (Yellow)
   - Info (Blue)
   - Auto-dismiss
   - Close Button

10. **ConfirmDialog**
    - Warning Icon
    - Message
    - Confirm Button
    - Cancel Button

11. **ErrorBoundary**
    - Error Display
    - Reload Button
    - Home Button

12. **EmptyState**
    - Icon
    - Message
    - Description
    - Action Button

---

### Status Badges (Color-coded)

**Job Status**:
- Open (Green)
- Closed (Gray)
- Filled (Blue)

**Application Status**:
- Applied (Blue)
- Reviewing (Yellow)
- Accepted (Green)
- Rejected (Red)
- Withdrawn (Gray)

**Shift Status**:
- Scheduled (Blue)
- Confirmed (Green)
- In-Progress (Yellow)
- Completed (Green)
- Cancelled (Red)
- No-Show (Red)

**Attendance Status**:
- Present (Green)
- Absent (Red)
- Late (Yellow)
- Half-Day (Orange)

**Approval Status**:
- Pending (Yellow)
- Approved (Green)
- Rejected (Red)

**Account Status**:
- Active (Green)
- Inactive (Gray)
- Blocked (Red)
- Pending (Yellow)

---

## 🔘 Button Types & Actions

### Primary Buttons (Blue)
- Login
- Sign Up
- Create Job
- Apply Now
- Create Shift
- Save Changes
- Update Password
- Approve

### Secondary Buttons (Gray)
- Cancel
- Close
- Edit
- View Details
- Filter
- Sort

### Success Buttons (Green)
- Accept Application
- Approve Attendance
- Confirm Shift
- Activate

### Danger Buttons (Red)
- Delete
- Block
- Reject
- Deactivate
- Withdraw
- Cancel Shift

### Icon Buttons
- Edit (Pencil)
- Delete (Trash)
- View (Eye)
- Download (Download)
- Upload (Upload)
- Map (Map Pin)
- Filter (Filter)
- Search (Search)
- Close (X)
- Menu (Hamburger)

---

## 📋 Form Elements

### Input Types Used
1. Text Input (30+)
2. Email Input (5)
3. Password Input (10)
4. Number Input (15)
5. Tel Input (5)
6. Textarea (10)
7. Dropdown/Select (25)
8. Radio Buttons (3)
9. Checkboxes (10)
10. Date Picker (8)
11. Time Picker (4)
12. File Upload (2)
13. Range Slider (Optional)

### Form Validation
- Required field indicators (*)
- Real-time validation
- Error messages (red text)
- Success indicators (green checkmark)
- Character count (for textareas)
- Format validation (email, phone, pincode)

---

## 📊 Data Display Components

### Tables (10)
- Employers Table
- Applicants Table
- Jobs Table
- Applications Table
- Shifts Table
- Attendance Table
- Activity Log Table
- Each with:
  - Sortable columns
  - Filterable rows
  - Action buttons
  - Pagination
  - Row selection (some)

### Cards (50+)
- Job Cards
- Application Cards
- Shift Cards
- Attendance Cards
- Statistics Cards
- Profile Cards
- Action Cards

### Lists (15)
- Job Lists
- Application Lists
- Shift Lists
- Activity Feeds
- Notification Lists

---

## 🗺️ Special Components

### Map Components (2)
- Location Display Map (Read-only)
- Location Picker Map (Interactive)
- Used for:
  - Check-in location
  - Check-out location
  - Job location display

### Calendar Components (2)
- Shift Calendar (Employer)
- Shift Calendar (Applicant)
- Features:
  - Month view
  - Day markers
  - Click to view details
  - Color coding

### Chart Components (3)
- Line Chart (Trends)
- Bar Chart (Comparisons)
- Pie Chart (Distribution)
- Used in Admin Dashboard

---

## 🎯 Interactive Elements

### Dropdowns (30+)
- User Menu
- Action Menus
- Filter Dropdowns
- Sort Dropdowns

### Tabs (20+)
- Status Tabs
- View Tabs
- Category Tabs

### Accordions (10)
- FAQ Sections
- Expandable Details
- Filter Panels

### Tooltips (50+)
- Icon explanations
- Button descriptions
- Status meanings

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Hamburger menu
- Stacked layouts
- Collapsible filters
- Bottom navigation (optional)
- Swipeable cards
- Touch-friendly buttons (min 44px)

---

## ♿ Accessibility Features

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)
- Alt text for images
- Form labels properly associated

---

## 🎨 Design System

### Colors
- Primary: Blue (#3b82f6)
- Secondary: Green (#22c55e)
- Success: Green (#22c55e)
- Warning: Yellow (#eab308)
- Danger: Red (#ef4444)
- Info: Blue (#3b82f6)
- Gray Scale: 50-900

### Typography
- Font Family: Inter
- Headings: 700 weight
- Body: 400 weight
- Small Text: 300 weight

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

### Shadows
- Small: 0 1px 2px rgba(0,0,0,0.05)
- Medium: 0 4px 6px rgba(0,0,0,0.1)
- Large: 0 10px 15px rgba(0,0,0,0.1)

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Full: 9999px (pills)

---

## 📊 Summary Statistics

**Total Pages**: 23
**Total Components**: 65+
**Total Buttons**: 150+
**Total Forms**: 15
**Total Inputs**: 100+
**Total Tables**: 10
**Total Cards**: 50+
**Total Modals**: 12
**Total Badges**: 30+
**Total Icons**: 100+

---

This specification covers every page, button, input, and UI element needed for the complete ShiftMaster frontend application!
