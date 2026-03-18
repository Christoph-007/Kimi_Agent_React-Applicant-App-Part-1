# ShiftMaster - React Website Site Map
> **Backend Analysis Complete** | **Generated:** 2026-03-04
> **Purpose:** Complete visual site map for React frontend development

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SHIFTMASTER REACT WEBSITE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Three distinct portals with role-based access:                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   PUBLIC     │  │   EMPLOYER   │  │    ADMIN     │                      │
│  │  (Applicant) │  │   Portal     │  │   Portal     │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
│                                                                             │
│  Tech Stack: React 18 + TypeScript + Vite + React Router + TanStack Query  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 1. PUBLIC PORTAL (Applicant)

### 1.1 Auth Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│    Login    │◄───▶│   Signup    │
│    Page     │     │    Page     │     │    Page     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Applicant  │
                                        │ Registration│
                                        │    Form     │
                                        └─────────────┘
```

**Pages:**
| Page | Route | Key Features |
|------|-------|--------------|
| Landing | `/` | Hero section, features, testimonials, CTA |
| Login | `/login` | Phone/email + password, user type selector |
| Applicant Signup | `/signup/applicant` | Personal info, phone, password |
| Registration Form | `/register/applicant` | Full profile setup |

**Registration Form Fields:**
```typescript
// Required
interface ApplicantRegistration {
  name: string;
  phone: string; // 10 digits
  password: string; // min 6 chars
  
  // Optional but recommended
  email?: string;
  skills?: string[];
  experience?: number; // years
  preferredJobType?: 'full-time' | 'part-time' | 'shift' | 'contract';
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  weeklyAvailability?: {
    days: string[]; // Monday, Tuesday, etc.
    hoursPerWeek?: number;
  };
  expectedHourlyRate?: number;
  availabilityDays?: string[];
}
```

---

### 1.2 Main Layout (Sidebar + Content)
```
┌────────────────────────────────────────────────────────────────┐
│  🏠 ShiftMaster                                    [🔔] [👤]    │  ← Header
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  🏠 Home       │                                             │
│  🔍 Browse Jobs│        MAIN CONTENT AREA                   │
│  📋 My Jobs    │                                             │
│  📅 My Shifts  │        (changes based on route)            │
│  📊 Attendance │                                             │
│                │                                             │
│  ───────────── │                                             │
│                │                                             │
│  🔔 Notifications                                        │
│  👤 Profile        │                                             │
│  ⚙️ Settings       │                                             │
│                │                                             │
├────────────────┤                                             │
│  [🚪 Logout]   │                                             │
│                │                                             │
└────────────────┴─────────────────────────────────────────────┘
     Sidebar              Main Content Area
      (fixed)               (scrollable)
```

---

### 1.3 Home Dashboard Page
```
┌────────────────────────────────────────────────────────────────┐
│  Home Dashboard                                          🔔 12  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔍 Search Jobs Bar                                    │   │
│  │  [Enter job title, skills, or company...    ] [Search]│   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📊 Quick Stats (4 cards)                              │   │
│  │                                                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Applied  │ │ Upcoming │ │ Completed│ │   Pending│  │   │
│  │  │   12     │ │    3     │ │    8     │ │    5     │  │   │
│  │  │ Jobs     │ │  Shifts  │ │  Shifts  │ │  Requests│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔔 Recent Notifications                               │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  🔴 New job request from Tech Cafe                     │   │
│  │     2 hours ago                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ⚪ Your application was accepted!                     │   │
│  │     5 hours ago                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ⚪ New shift scheduled for tomorrow                   │   │
│  │     1 day ago                                          │   │
│  │                                                        │   │
│  │  [View All Notifications →]                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🎯 Recommended For You                                │   │
│  │                                                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │ Job Card 1  │ │ Job Card 2  │ │ Job Card 3  │      │   │
│  │  │             │ │             │ │             │      │   │
│  │  │ Chef Req... │ │ Delivery... │ │ Retail A... │      │   │
│  │  │ Tech Cafe   │ │ FastLogi... │ │ Fashion...  │      │   │
│  │  │ ₹200/day    │ │ ₹150/day    │ │ ₹180/day    │      │   │
│  │  │ [Apply]     │ │ [Apply]     │ │ [Apply]     │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  │                                                        │   │
│  │  [View All Jobs →]                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📅 Upcoming Shifts                                    │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Tomorrow, Jan 20                                      │   │
│  │  Chef at Tech Cafe | 9:00 AM - 5:00 PM                 │   │
│  │  Location: 123 Main St, Mumbai                         │   │
│  │  [View Details] [Check In]                             │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Wed, Jan 22                                           │   │
│  │  Delivery at FastLogistics | 10:00 AM - 6:00 PM        │   │
│  │  [View Details]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/auth/me` - User profile
- `GET /api/notifications/unread-count` - Badge count
- `GET /api/notifications?limit=5` - Recent notifications
- `GET /api/jobs?page=1&limit=5` - Recommended jobs
- `GET /api/shifts/applicant/my-shifts?limit=3` - Upcoming shifts

---

### 1.4 Browse Jobs Page
```
┌────────────────────────────────────────────────────────────────┐
│  Browse Jobs                                             🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔍 Search & Filter Toolbar                            │   │
│  │                                                        │   │
│  │  [Search jobs...                    ] [🔍] [Filters ▼]│   │
│  │                                                        │   │
│  │  Active Filters: [Full-time ✕] [Mumbai ✕] [Clear All] │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🏷️ Category Pills (horizontal scroll)                 │   │
│  │                                                        │   │
│  │  [All] [Food Service] [Retail] [Logistics] [Healthcare]│   │
│  │  [Hospitality] [Warehouse] [Security] [Driver]        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Sort by: [Relevance ▼]        Showing 1-10 of 48 jobs │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📋 JOB CARD                                           │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Chef Required                     [Full-time] │  │   │
│  │  │  Tech Cafe                                       │  │   │
│  │  │  📍 Mumbai, Maharashtra                          │  │   │
│  │  │                                                  │  │   │
│  │  │  💰 ₹200/day    🕐 8 hrs/day    📅 5 days/week  │  │   │
│  │  │                                                  │  │   │
│  │  │  Looking for an experienced chef...              │  │   │
│  │  │                                                  │  │   │
│  │  │  🏷️ Cooking 🏷️ Food Safety                        │  │   │
│  │  │                                                  │  │   │
│  │  │  Posted 2 days ago • 5 applications              │  │   │
│  │  │                                                  │  │   │
│  │  │  [     View Details     ] [ ♡ Save ]             │  │   │
│  │  │                                                  │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📋 JOB CARD 2                                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ...                                                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│                    [  Load More Jobs  ]                        │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📄 Pagination: [< Prev] 1  2  3  ... 5 [Next >]       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Filter Panel (Slide-out Drawer/Modal):**
```typescript
interface JobFilters {
  jobType?: 'full-time' | 'part-time' | 'shift' | 'contract';
  city?: string;
  state?: string;
  minSalary?: number;
  maxSalary?: number;
  search?: string;
  category?: string;
  status?: 'open' | 'closed' | 'filled';
  sortBy?: string;
  order?: 'asc' | 'desc';
}
```

**API Calls:**
- `GET /api/jobs?page=&limit=&jobType=&city=&minSalary=&maxSalary=&search=&category=`
- `GET /api/categories` - For category pills

---

### 1.5 Job Detail Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Jobs                                          🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB HEADER                                            │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Chef Required                                [Open]   │   │
│  │                                                        │   │
│  │  ┌──────┐ Tech Cafe                                    │   │
│  │  │ Logo │ Restaurant • Mumbai, Maharashtra              │   │
│  │  └──────┘ Posted 2 days ago • 45 views                 │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  QUICK INFO (4 columns)                                │   │
│  │                                                        │   │
│  │  💰 Salary          🕐 Job Type        📍 Location     │   │
│  │  ₹200/day           Part-time          Mumbai          │   │
│  │                                                        │   │
│  │  🎓 Experience      ⏰ Shift           📅 Posted       │   │
│  │  2+ years           Evening shift      Jan 15, 2024    │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  DESCRIPTION                                           │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  We are looking for an experienced chef to join our   │   │
│  │  team at Tech Cafe. The ideal candidate should have   │   │
│  │  experience in...                                      │   │
│  │                                                        │   │
│  │  Responsibilities:                                     │   │
│  │  • Prepare and cook meals according to recipes         │   │
│  │  • Maintain kitchen cleanliness and hygiene            │   │
│  │  • Manage inventory and order supplies                 │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  REQUIREMENTS                                          │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Minimum Experience: 2 years                           │   │
│  │  Education: High School or equivalent                  │   │
│  │                                                        │   │
│  │  Skills Required:                                      │   │
│  │  [Cooking] [Food Safety] [Kitchen Management]          │   │
│  │                                                        │   │
│  │  Other Requirements:                                   │   │
│  │  Must have food handler's certificate                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  WORKING CONDITIONS                                    │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Hours per Day: 8 hours                                │   │
│  │  Days per Week: 5 days (Mon-Fri)                       │   │
│  │  Shift Timing: 2:00 PM - 10:00 PM                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  BENEFITS                                              │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [Free Meals] [Transport Allowance] [Health Insurance] │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ABOUT EMPLOYER                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌──────┐ Tech Cafe                                    │   │
│  │  │ Logo │ Restaurant • 50+ employees                    │   │
│  │  └──────┘ Mumbai, Maharashtra                          │   │
│  │                                                        │   │
│  │  A cozy tech-themed cafe serving delicious food...     │   │
│  │                                                        │   │
│  │  [View Company Profile]                                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │        [        APPLY FOR THIS JOB        ]            │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SIMILAR JOBS                                          │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [Horizontal scroll of similar job cards]              │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/jobs/:id` - Job details
- `POST /api/applications/:jobId` - Apply (body: coverLetter, expectedSalary)

---

### 1.6 My Jobs Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Jobs                                                 🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [Applications] [Job Requests] [Saved Jobs]                    │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  FILTER & SEARCH BAR                                   │   │
│  │  [Search...] [Status: All ▼] [Date: Newest ▼]         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICATION CARD                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Chef Required                          [Applied]│  │   │
│  │  │  Tech Cafe                                       │  │   │
│  │  │                                                  │  │   │
│  │  │  📍 Mumbai, Maharashtra    💰 ₹200/day          │  │   │
│  │  │                                                  │  │   │
│  │  │  Applied on: Jan 15, 2024                        │  │   │
│  │  │  Expected Salary: ₹250/day                       │  │   │
│  │  │                                                  │  │   │
│  │  │  Status History:                                 │  │   │
│  │  │  ● Applied ─────○ Reviewing ─────○ Accepted      │  │   │
│  │  │                                                  │  │   │
│  │  │  [View Details] [Withdraw Application]           │  │   │
│  │  │                                                  │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICATION CARD 2 (Accepted)                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Delivery Partner at FastLogistics            [Accepted]   │
│  │  ...                                                   │   │
│  │  Status History:                                       │   │
│  │  ● Applied ─────● Reviewing ─────● Accepted ✓          │   │
│  │  [View Details] [Message Employer] [View Shifts]       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Tabs:**
1. **Applications** - Jobs the applicant applied to
2. **Job Requests** - Direct job offers from employers
3. **Saved Jobs** - Bookmarked jobs

**API Calls:**
- `GET /api/applications/my-applications?status=&page=`
- `GET /api/job-requests/applicant/received?status=&page=`
- `PUT /api/applications/:id/withdraw` - Withdraw application

---

### 1.7 Job Request Detail Page (Employer-initiated offer)
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Job Requests                                  🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  FROM EMPLOYER                                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌──────┐ Tech Cafe                                    │   │
│  │  │ Logo │ Restaurant • Mumbai                          │   │
│  │  └──────┘ techcafe@example.com                        │   │
│  │                                                        │   │
│  │  [View Company Profile]                                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB OFFER DETAILS                                     │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Weekend Chef Position                                 │   │
│  │                                                        │   │
│  │  We need an experienced chef for weekend service...    │   │
│  │                                                        │   │
│  │  Shift Type: Weekends-only                             │   │
│  │  Location: Mumbai, Bandra                              │   │
│  │  Offered Rate: ₹200/hour                               │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  MESSAGE FROM EMPLOYER                                 │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  "Would love to have you join our team! Your profile   │   │
│  │   looks like a great fit for our weekend service."     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  STATUS                                                │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Current Status: [Sent]                                │   │
│  │  Sent: Jan 15, 2024                                    │   │
│  │  Expires: Jan 22, 2024 (7 days left)                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │  [        ACCEPT OFFER        ]  [      DECLINE      ] │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/job-requests/:id`
- `PUT /api/job-requests/:id/accept`
- `PUT /api/job-requests/:id/decline` (body: declineReason optional)

---

### 1.8 My Shifts Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Shifts                                               🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [Upcoming] [In Progress] [Completed] [Cancelled] [All]        │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JANUARY 2024                                          │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Sat, Jan 20                                    │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │                                                 │  │   │
│  │  │  Chef at Tech Cafe                    [Scheduled]│ │   │
│  │  │  9:00 AM - 5:00 PM                              │  │   │
│  │  │  📍 123 Main St, Mumbai                         │  │   │
│  │  │                                                 │  │   │
│  │  │  Instructions: Please arrive 15 min early       │  │   │
│  │  │                                                 │  │   │
│  │  │  Status: Waiting for confirmation               │  │   │
│  │  │                                                 │  │   │
│  │  │  [Confirm Shift] [View Details] [Cancel]        │  │   │
│  │  │                                                 │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │                                                 │  │   │
│  │  │  Delivery at FastLogistics             [Confirmed]│  │   │
│  │  │  10:00 AM - 6:00 PM                             │  │   │
│  │  │  📍 Andheri East, Mumbai                        │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Details] [Check In]                      │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Wed, Jan 24                                           │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Retail Assistant at Fashion Store                    │   │
│  │  11:00 AM - 7:00 PM                          [Scheduled]   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/shifts/applicant/my-shifts?status=&page=`
- `PUT /api/shifts/:id/confirm`
- `PUT /api/shifts/:id/cancel` (body: cancellationReason)

---

### 1.9 Shift Detail Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Shifts                                        🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SHIFT INFORMATION                                     │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Chef at Tech Cafe                          [Confirmed]│   │
│  │                                                        │   │
│  │  📅 Saturday, January 20, 2024                         │   │
│  │  🕐 9:00 AM - 5:00 PM (8 hours)                        │   │
│  │  📍 Tech Cafe, 123 Main St, Mumbai                     │   │
│  │  💰 Payment: ₹1,600                                    │   │
│  │                                                        │   │
│  │  Instructions:                                         │   │
│  │  Please arrive 15 minutes early for briefing.          │   │
│  │  Wear the provided uniform.                            │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  EMPLOYER CONTACT                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Tech Cafe                                             │   │
│  │  📞 +91 98765 43210                                    │   │
│  │  ✉️ techcafe@example.com                               │   │
│  │  📍 123 Main St, Mumbai, Maharashtra                   │   │
│  │                                                        │   │
│  │  [Get Directions] [Message]                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ATTENDANCE                                            │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Status: Not checked in yet                            │   │
│  │                                                        │   │
│  │  [        CHECK IN        ]                            │   │
│  │  Only available on shift date                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ATTENDANCE RECORD                                     │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Check In: --:--                                       │   │
│  │  Check Out: --:--                                      │   │
│  │  Total Hours: --                                       │   │
│  │  Status: --                                            │   │
│  │  Approved: Pending                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/shifts/:id`
- `POST /api/attendance/:shiftId/checkin` (body: latitude, longitude)
- `POST /api/attendance/:shiftId/checkout` (body: latitude, longitude, remarks)
- `GET /api/attendance/shift/:shiftId`

---

### 1.10 Attendance History Page
```
┌────────────────────────────────────────────────────────────────┐
│  Attendance History                                      🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  FILTER BAR                                            │   │
│  │  [Date Range ▼] [Status: All ▼] [Export CSV]          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SUMMARY CARDS                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Total    │ │ Present  │ │   Late   │ │  Hours   │  │   │
│  │  │   24     │ │   20     │ │    2     │ │  186.5   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JANUARY 2024                                          │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Sat, Jan 20                                    │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │  Chef at Tech Cafe                    [Present] │  │   │
│  │  │  Check In: 9:05 AM    Check Out: 5:00 PM        │  │   │
│  │  │  Total Hours: 7.92      Late by: 5 min          │  │   │
│  │  │  Approved: ✓                                      │  │   │
│  │  │  [View Details]                                   │  │   │
│  │  │                                                 │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │                                                 │  │   │
│  │  │  Wed, Jan 17                                    │  │   │
│  │  │  Delivery at FastLogistics              [Late]  │  │   │
│  │  │  Check In: 10:20 AM   Check Out: 6:00 PM        │  │   │
│  │  │  Total Hours: 7.67    Late by: 20 min           │  │   │
│  │  │  Approved: ✓                                      │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/attendance/applicant/history?page=`

---

### 1.11 Profile Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Profile                                              🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PROFILE HEADER                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  ┌──────────┐                                          │   │
│  │  │          │  Jane Smith                              │   │
│  │  │  Avatar  │  jane@example.com                       │   │
│  │  │          │  📞 +91 98765 43211                     │   │
│  │  └──────────┘                                          │   │
│  │                                                        │   │
│  │  [Edit Profile] [Change Password] [Upload Photo]       │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  MY STATS                                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │Applications│ │ Accepted │ │ Completed│ │   Rating │  │   │
│  │  │     12     │ │     5    │ │    8     │ │   4.8 ⭐ │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PROFESSIONAL INFORMATION                              │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Skills: [Cooking] [Customer Service] [Management]     │   │
│  │  Experience: 3 years                                   │   │
│  │  Preferred Job Type: Part-time                         │   │
│  │  Categories: Food Service, Hospitality                 │   │
│  │  Preferred Shift: Evening                              │   │
│  │  Work Location: Mumbai                                 │   │
│  │  Expected Rate: ₹150/hour                              │   │
│  │  Availability: Mon, Tue, Wed, Thu, Fri                 │   │
│  │                                                        │   │
│  │  [Edit Information]                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  RESUME                                                │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  📄 Jane_Smith_Resume.pdf                              │   │
│  │  Uploaded: Jan 10, 2024                                │   │
│  │                                                        │   │
│  │  [View Resume] [Replace] [Delete]                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ACCOUNT SETTINGS                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [🔔 Notification Preferences]                         │   │
│  │  [🔒 Change Password]                                  │   │
│  │  [👤 Update Profile]                                   │   │
│  │  [🌙 Dark Mode: Off]                                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [🚪 Logout]                                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/auth/me`
- `PUT /api/auth/me` - Update profile
- `POST /api/resume/upload` - Multipart form data
- `DELETE /api/resume` - Delete resume
- `PUT /api/auth/update-password` - Change password
- `POST /api/auth/logout`

---

### 1.12 Notifications Page
```
┌────────────────────────────────────────────────────────────────┐
│  Notifications                                      [Mark All] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔴 UNREAD                    12 unread                │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ 🔴                                              │  │   │
│  │  │ New Job Request Received                        │  │   │
│  │  │ Tech Cafe has sent you a job request for        │  │   │
│  │  │ "Weekend Chef Position"                         │  │   │
│  │  │ 2 hours ago                                     │  │   │
│  │  │ [View Request]                                  │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ 🔴                                              │  │   │
│  │  │ Application Accepted!                           │  │   │
│  │  │ Your application for "Delivery Partner" at      │  │   │
│  │  │ FastLogistics has been accepted!                │  │   │
│  │  │ 5 hours ago                                     │  │   │
│  │  │ [View Details]                                  │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ⚪ READ (Last 7 days)                                 │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Shift Reminder                                     │   │
│  │  You have a shift tomorrow at 9:00 AM               │   │
│  │  1 day ago                                          │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  New Job Match                                      │   │
│  │  A new job matching your preferences was posted     │   │
│  │  2 days ago                                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  [Clear All Read Notifications]                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Notification Types:**
```typescript
enum ApplicantNotificationType {
  job_request_received = 'job_request_received',
  job_request_status_changed = 'job_request_status_changed',
  job_match_alert = 'job_match_alert',
  new_employer_match = 'new_employer_match',
}
```

**API Calls:**
- `GET /api/notifications?page=`
- `GET /api/notifications/unread-count`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/:id` (Dismiss)

---

## 🏢 2. EMPLOYER PORTAL

### 2.1 Employer Auth Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│    Login    │◄───▶│   Signup    │
│    Page     │     │    Page     │     │    Page     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Employer  │
                                        │ Registration│
                                        │    Form     │
                                        └─────────────┘
```

**Employer Registration Fields:**
```typescript
interface EmployerRegistration {
  // Required
  storeName: string;
  ownerName: string;
  email: string;
  phone: string; // 10 digits
  password: string; // min 6 chars
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string; // 6 digits
  };
  businessType: 'restaurant' | 'retail' | 'logistics' | 
                'healthcare' | 'hospitality' | 'other';
  
  // Optional
  businessDescription?: string;
}
```

---

### 2.2 Employer Dashboard Layout
```
┌────────────────────────────────────────────────────────────────┐
│  🏢 Tech Cafe Dashboard                          [🔔] [👤 ▼]  │  ← Header
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  📊 Dashboard  │                                             │
│  💼 My Jobs    │        MAIN CONTENT AREA                   │
│  👥 Applicants │                                             │
│  📅 Shifts     │        (changes based on route)            │
│  📊 Attendance │                                             │
│                │                                             │
│  ───────────── │                                             │
│                │                                             │
│  💌 Job Requests                                      │
│  ⭐ Shortlist        │                                             │
│  ⚙️ Settings         │                                             │
│                │                                             │
├────────────────┤                                             │
│  [🚪 Logout]   │                                             │
│                │                                             │
└────────────────┴─────────────────────────────────────────────┘
     Sidebar              Main Content Area
      (fixed)               (scrollable)
```

---

### 2.3 Employer Dashboard Page
```
┌────────────────────────────────────────────────────────────────┐
│  Dashboard                                               🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ACCOUNT STATUS ALERT                                  │   │
│  │  ⚠️ Your account is pending approval                   │   │
│  │     You can view your profile but cannot post jobs yet.│   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  QUICK STATS                                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Active  │ │   Total  │ │   Total  │ │ Upcoming │  │   │
│  │  │   Jobs   │ │Applicants│ │  Shifts  │ │  Shifts  │  │   │
│  │  │    5     │ │    28    │ │    45    │ │    8     │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  RECENT JOBS                                    [+ New]│   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Chef Required                           5 applications│   │
│  │  Posted: Jan 15, 2024 | Status: Open                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Delivery Partner                        3 applications│   │
│  │  Posted: Jan 14, 2024 | Status: Open                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [View All Jobs →]                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  RECENT APPLICATIONS                                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ⚠️ NOTE: Applications are shown per job               │   │
│  │                                                        │   │
│  │  Jane Smith applied to Chef Required                   │   │
│  │  2 hours ago | Experience: 3 years                     │   │
│  │  [View Profile] [Review Application]                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  John Doe applied to Delivery Partner                  │   │
│  │  5 hours ago | Experience: 2 years                     │   │
│  │  [View Profile] [Review Application]                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  UPCOMING SHIFTS                              [+ New]│   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Tomorrow, Jan 20                                      │   │
│  │  Chef shift with Jane Smith | 9:00 AM - 5:00 PM        │   │
│  │  [View Details]                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Wed, Jan 22                                           │   │
│  │  Delivery shift with John Doe | 10:00 AM - 6:00 PM     │   │
│  │  [View Details]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB REQUESTS SENT                              [+ New]│   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Sent to Jane Smith - Weekend Chef Position            │   │
│  │  Status: Pending | Sent: Jan 15, 2024                  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Sent to John Doe - Delivery Partner                   │   │
│  │  Status: Accepted | Sent: Jan 14, 2024                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SHORTLISTED APPLICANTS                         [View] │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Jane Smith | Top Pick | Food Service                  │   │
│  │  John Doe | Follow Up | Logistics                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/auth/me` - Employer profile (check isApproved, isBlocked)
- `GET /api/notifications/unread-count`
- `GET /api/jobs/employer/my-jobs?limit=5` - Recent jobs
- `GET /api/shifts/employer/my-shifts?limit=3` - Upcoming shifts
- `GET /api/job-requests/employer/sent?limit=3` - Sent requests
- `GET /api/shortlist?limit=3` - Shortlisted applicants
- `GET /api/applications/job/:jobId?limit=1` - Per-job applications (fetch for each job)

> **⚠️ IMPORTANT NOTE:** There is NO `/api/applications/employer/recent` endpoint. To show recent applications on dashboard, you must:
> 1. First fetch employer's jobs (`GET /api/jobs/employer/my-jobs`)
> 2. Then for each job, fetch applications (`GET /api/applications/job/:jobId?limit=1`)
> 3. Combine and sort client-side, take top 5

---

### 2.4 My Jobs Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Jobs                                          [+ Post Job] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [All Jobs] [Open] [Closed] [Filled]                           │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search jobs...] [Status ▼] [Date ▼] [Export CSV]    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB CARD                                              │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Chef Required                          [Open] │  │   │
│  │  │                                                 │  │   │
│  │  │  Posted: Jan 15, 2024                           │  │   │
│  │  │  Applications: 5 | Views: 45                    │  │   │
│  │  │                                                 │  │   │
│  │  │  💰 ₹200/day    🕐 Part-time    📍 Mumbai       │  │   │
│  │  │                                                 │  │   │
│  │  │  [View] [Edit] [Close] [Delete] [View Apps (5)] │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB CARD 2 (Closed)                                   │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Cashier at Retail Store                     [Closed]│   │
│  │  Posted: Jan 10, 2024 | Closed: Jan 14, 2024           │   │
│  │  Applications: 12                                      │   │
│  │  [View] [Reopen] [Delete]                              │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📄 Pagination                                         │   │
│  │  Showing 1-10 of 25 jobs                               │   │
│  │  [< Prev] 1  2  3 [Next >]                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/jobs/employer/my-jobs?status=&page=`
- `DELETE /api/jobs/:id`
- `PUT /api/jobs/:id/close`
- `PUT /api/jobs/:id/reopen`

---

### 2.5 Post/Edit Job Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Jobs                                          🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  POST NEW JOB / EDIT JOB                               │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Job Title *                                           │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Chef Required                                   │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Description *                                         │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Looking for an experienced chef...              │   │   │
│  │  │                                                 │   │   │
│  │  │                                                 │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Job Type *                                            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │   │
│  │  │ Full-time  │ │ Part-time  │ │   Shift    │       │   │
│  │  └────────────┘ └────────────┘ └────────────┘       │   │
│  │                                                        │   │
│  │  Salary *                                              │   │
│  │  Amount: ┌──────────┐ Period: ┌──────────────┐       │   │
│  │          │  200     │         │ Daily    ▼   │       │   │
│  │          └──────────┘         └──────────────┘       │   │
│  │                                                        │   │
│  │  Location *                                            │   │
│  │  City: ┌──────────┐ State: ┌──────────────┐          │   │
│  │        │ Mumbai   │        │ Maharashtra  │          │   │
│  │        └──────────┘        └──────────────┘          │   │
│  │  Pincode: ┌──────────┐                                │   │
│  │           │ 400001   │                                │   │
│  │           └──────────┘                                │   │
│  │                                                        │   │
│  │  Working Hours                                         │   │
│  │  Hours/Day: ┌────┐ Days/Week: ┌────┐                 │   │
│  │             │ 8  │            │ 5  │                 │   │
│  │             └────┘            └────┘                 │   │
│  │  Shift Timing: ┌──────────────────┐                  │   │
│  │                │ 9:00 AM - 5:00 PM │                  │   │
│  │                └──────────────────┘                  │   │
│  │                                                        │   │
│  │  Requirements                                          │   │
│  │  Min Experience: ┌────┐ years                          │   │
│  │                  │ 2  │                                │   │
│  │                  └────┘                                │   │
│  │  Skills: [Cooking ✕] [Food Safety ✕] [+ Add Skill]    │   │
│  │  Education: ┌──────────────────┐                      │   │
│  │             │ High School    ▼ │                      │   │
│  │             └──────────────────┘                      │   │
│  │                                                        │   │
│  │  Benefits: [Free Meals ✕] [Transport ✕] [+ Add]       │   │
│  │                                                        │   │
│  │  Job Expiry Date: ┌──────────────┐                    │   │
│  │                   │ 2024-02-15   │                    │   │
│  │                   └──────────────┘                    │   │
│  │                                                        │   │
│  │  [       POST JOB       ]  [Save as Draft]            │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job

**Request Body:**
```json
{
  "title": "String (required)",
  "description": "String (required)",
  "jobType": "Enum: full-time, part-time, shift, contract",
  "salary": {
    "amount": "Number (required)",
    "period": "Enum: hourly, daily, weekly, monthly, yearly"
  },
  "location": {
    "city": "String (required)",
    "state": "String (required)",
    "pincode": "String, 6 digits (required)",
    "address": "String"
  },
  "workingHours": {
    "hoursPerDay": "Number",
    "daysPerWeek": "Number",
    "shiftTiming": "String"
  },
  "requirements": {
    "minimumExperience": "Number",
    "skills": ["String"],
    "education": "String",
    "otherRequirements": "String"
  },
  "benefits": ["String"],
  "expiryDate": "Date"
}
```

---

### 2.6 Job Applications Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Jobs                                          🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICATIONS FOR: Chef Required                       │   │
│  │  Posted: Jan 15, 2024 | Total Applications: 5          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  [All] [Applied] [Reviewing] [Accepted] [Rejected]             │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search applicants...] [Experience ▼] [Date ▼]       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICATION CARD                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ ┌──────┐                                        │  │   │
│  │  │ │Avatar│  Jane Smith                            │  │   │
│  │  │ └──────┘  📞 +91 98765 43211                   │  │   │
│  │  │           ✉️ jane@example.com                   │  │   │
│  │  │                                                │  │   │
│  │  │  Applied: Jan 15, 2024 | Status: [Applied]     │  │   │
│  │  │                                                │  │   │
│  │  │  Skills: [Cooking] [Food Safety] [Management]  │  │   │
│  │  │  Experience: 3 years                           │  │   │
│  │  │  Expected Salary: ₹250/day                     │  │   │
│  │  │                                                │  │   │
│  │  │  Cover Letter:                                 │  │   │
│  │  │  "I am very interested in this position..."    │  │   │
│  │  │                                                │  │   │
│  │  │  [View Full Profile] [View Resume]             │  │   │
│  │  │                                                │  │   │
│  │  │  [     ACCEPT APPLICATION     ]                │  │   │
│  │  │  [        REJECT              ]                │  │   │
│  │  │                                                │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICATION CARD 2 (Reviewing)                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  John Doe | Applied: Jan 14 | Status: [Reviewing]      │   │
│  │  ...                                                   │   │
│  │  [View Full Profile] [View Resume]                     │   │
│  │  [Accept] [Reject]                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/applications/job/:jobId?status=&page=`
- `GET /api/applications/:id` - Single application details
- `PUT /api/applications/:id/accept`
- `PUT /api/applications/:id/reject` (body: rejectionReason)
- `GET /api/resume/:applicantId` - View resume

---

### 2.7 Browse Applicants Page
```
┌────────────────────────────────────────────────────────────────┐
│  Browse Applicants                                       🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🔍 SEARCH & FILTER BAR                                │   │
│  │                                                        │   │
│  │  [Search by name...] [Category ▼] [Location ▼]       │   │
│  │  [Shift Type ▼] [Rate Range ▼] [Availability ▼]      │   │
│  │  [Experience ▼]                                      │   │
│  │                                                        │   │
│  │  Active Filters: [Mumbai ✕] [Evening ✕] [Clear All]  │   │
│  │                                                        │   │
│  │  [💾 Save Filter] [📋 Saved Filters]                  │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Sort by: [Relevance ▼]    Showing 1-10 of 125         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICANT CARD                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ ┌──────┐                                        │  │   │
│  │  │ │Avatar│  Jane Smith                            │  │   │
│  │  │ └──────┘                                        │  │   │
│  │  │                                                 │  │   │
│  │  │  📍 Mumbai | 🕐 Evening Shift | 💰 ₹150/hr     │  │   │
│  │  │                                                 │  │   │
│  │  │  Categories: [Food Service] [Hospitality]        │  │   │
│  │  │  Experience: 3 years                             │  │   │
│  │  │  Skills: [Cooking] [Customer Service]            │  │   │
│  │  │                                                 │  │   │
│  │  │  Availability: Mon, Tue, Wed, Thu, Fri          │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Full Profile] [⭐ Shortlist]             │  │   │
│  │  │  [Send Job Request]                             │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICANT CARD 2                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  John Doe | 📍 Pune | 🕐 Flexible | 💰 ₹200/hr        │   │
│  │  ...                                                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📄 Pagination                                         │   │
│  │  [< Prev] 1  2  3  ... 13 [Next >]                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Filter Panel:**
```typescript
interface ApplicantFilters {
  jobCategory?: string;
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  availableDay?: string;
  search?: string;
  sortBy?: 'createdAt' | 'expectedHourlyRate' | 'experience';
  order?: 'asc' | 'desc';
}
```

**API Calls:**
- `GET /api/employer/applicants?filters...`
- `GET /api/employer/applicants/:id` - View profile
- `POST /api/shortlist` - Add to shortlist
- `GET /api/shortlist/check/:applicantId` - Check if shortlisted

---

### 2.8 Send Job Request Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Applicants                                    🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEND JOB REQUEST                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  To: Jane Smith                                        │   │
│  │  📍 Mumbai | Food Service | ₹150/hr                    │   │
│  │                                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Job Title *                                           │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Weekend Chef Position                           │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Description *                                         │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ We need an experienced chef for weekend        │   │   │
│  │  │ service at our restaurant...                    │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Shift Type *                                          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │   │
│  │  │ Full-time  │ │ Part-time  │ │ Weekends ▼ │        │   │
│  │  └────────────┘ └────────────┘ └────────────┘        │   │
│  │                                                        │   │
│  │  Location *                                            │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Mumbai, Bandra                                  │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Offered Hourly Rate *                                 │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ ₹ 200                                           │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Message (Optional)                                    │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Would love to have you join our team! Your      │   │   │
│  │  │ profile looks like a great fit...               │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Request will expire in: 7 days                        │   │
│  │                                                        │   │
│  │  [       SEND REQUEST       ]                          │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `POST /api/job-requests`

**Request Body:**
```json
{
  "applicantId": "String (MongoDB ObjectId)",
  "jobTitle": "String (required)",
  "jobDescription": "String (required)",
  "shiftType": "Enum: full-time, part-time, weekends-only, flexible",
  "location": "String (required)",
  "offeredHourlyRate": "Number (required)",
  "message": "String (optional)"
}
```

---

### 2.9 Shortlist Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Shortlist                                            🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search...] [Label ▼] [Category ▼]                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SHORTLIST CARD                                        │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ ┌──────┐                                        │  │   │
│  │  │ │Avatar│  Jane Smith              [⭐ Saved]    │  │   │
│  │  │ └──────┘                                        │  │   │
│  │  │                                                 │  │   │
│  │  │  📍 Mumbai | 💰 ₹150/hr | 3 years exp          │  │   │
│  │  │                                                 │  │   │
│  │  │  Label: [Top Pick ▼]                            │  │   │
│  │  │                                                 │  │   │
│  │  │  Private Notes:                                 │  │   │
│  │  │  ┌────────────────────────────────────────┐    │  │   │
│  │  │  │ Great communication skills, highly      │    │  │   │
│  │  │  │ recommended for customer-facing roles.  │    │  │   │
│  │  │  └────────────────────────────────────────┘    │  │   │
│  │  │                                                 │  │   │
│  │  │  Saved on: Jan 15, 2024                         │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Profile] [Send Request] [Remove]         │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SHORTLIST CARD 2                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  John Doe | Label: [Follow Up] | Pune | ₹200/hr       │   │
│  │  ...                                                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/shortlist?page=`
- `PUT /api/shortlist/:id` - Update notes/label
- `DELETE /api/shortlist/:id` - Remove

---

### 2.10 My Shifts (Employer) Page
```
┌────────────────────────────────────────────────────────────────┐
│  My Shifts                                       [+ Create] 🔍 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [Scheduled] [Confirmed] [In Progress] [Completed] [Cancelled] │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JANUARY 2024                                          │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Sat, Jan 20                                    │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │                                                 │  │   │
│  │  │  Chef at Tech Cafe                    [Scheduled]│  │   │
│  │  │  9:00 AM - 5:00 PM                              │  │   │
│  │  │  👤 Jane Smith                                  │  │   │
│  │  │  📍 123 Main St, Mumbai                         │  │   │
│  │  │                                                 │  │   │
│  │  │  Status: Waiting for applicant confirmation     │  │   │
│  │  │                                                 │  │   │
│  │  │  [Edit] [Cancel] [Delete] [View Attendance]     │  │   │
│  │  │                                                 │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │                                                 │  │   │
│  │  │  Delivery at FastLogistics             [Confirmed]│  │   │
│  │  │  10:00 AM - 6:00 PM                             │  │   │
│  │  │  👤 John Doe                                    │  │   │
│  │  │  📍 Andheri East, Mumbai                        │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Details] [View Attendance] [Cancel]      │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/shifts/employer/my-shifts?status=&page=`
- `POST /api/shifts` - Create shift
- `PUT /api/shifts/:id` - Edit shift
- `PUT /api/shifts/:id/cancel` (body: cancellationReason)
- `DELETE /api/shifts/:id`
- `GET /api/attendance/shift/:shiftId`

---

### 2.11 Create Shift Page
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Shifts                                        🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  CREATE NEW SHIFT                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │                                                        │   │
│  │  Select Job *                                          │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Chef Required                          ▼       │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │  Only jobs with accepted applicants are shown          │   │
│  │                                                        │   │
│  │  Select Applicant *                                    │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Jane Smith (Accepted Application)      ▼       │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │  Only accepted applicants for selected job             │   │
│  │                                                        │   │
│  │  Shift Date *                                          │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ 📅 2024-01-20                                   │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Start Time *                                          │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ 🕐 09:00                                        │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  End Time *                                            │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ 🕐 17:00                                        │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Location *                                            │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Tech Cafe, 123 Main St, Mumbai                  │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Instructions                                          │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ Please arrive 15 minutes early for briefing.    │   │   │
│  │  │ Wear the provided uniform.                      │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  Payment Amount                                        │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │ ₹ 1,600                                         │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │  [       CREATE SHIFT       ]                          │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/jobs/employer/my-jobs?status=open` - For job dropdown
- `POST /api/shifts` - Create

**Request Body:**
```json
{
  "jobId": "String (required)",
  "applicantId": "String (required)",
  "date": "Date (ISO string, required)",
  "startTime": "String, HH:MM format (required)",
  "endTime": "String, HH:MM format (required)",
  "location": "String (required)",
  "instructions": "String (optional)",
  "paymentAmount": "Number (optional)"
}
```

---

### 2.12 Attendance Records (Employer) Page
```
┌────────────────────────────────────────────────────────────────┐
│  Attendance Records                                      🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  FILTER BAR                                            │   │
│  │  [Date Range ▼] [Applicant ▼] [Status ▼] [Approved ▼] │   │
│  │  [Export CSV] [Mark Manual Attendance]                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SUMMARY CARDS                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Total   │ │  Present │ │   Late   │ │ Approved │  │   │
│  │  │   45     │ │   40     │ │    3     │ │    38    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ATTENDANCE RECORD                                     │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Sat, Jan 20 | Chef at Tech Cafe                │  │   │
│  │  │  ──────────────────────────────────────         │  │   │
│  │  │  👤 Jane Smith                                  │  │   │
│  │  │                                                 │  │   │
│  │  │  Check In: 9:05 AM    Check Out: 5:00 PM        │  │   │
│  │  │  Total Hours: 7.92      Late by: 5 min          │  │   │
│  │  │  Status: [Present]      Approved: ✓             │  │   │
│  │  │                                                 │  │   │
│  │  │  Applicant Remarks: "Completed all tasks"       │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Details] [Add/Edit Remarks]              │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ATTENDANCE RECORD 2 (Pending Approval)                │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Wed, Jan 17 | Delivery at FastLogistics               │   │
│  │  John Doe | Check In: 10:00 AM | Check Out: 6:00 PM    │   │
│  │  Total Hours: 8.00 | Status: [Present]                 │   │
│  │  Approved: ⏳ Pending                                   │   │
│  │  [Approve] [Add Remarks]                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/attendance/employer/records?page=`
- `PUT /api/attendance/:id/approve` (body: employerRemarks)
- `POST /api/attendance/manual` - Mark manual attendance

---

### 2.13 Settings Page (Employer)
```
┌────────────────────────────────────────────────────────────────┐
│  Settings                                                🔍    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  STORE PROFILE                                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌──────┐ Tech Cafe                                    │   │
│  │  │ Logo │ Restaurant                                   │   │
│  │  └──────┘ Mumbai, Maharashtra                          │   │
│  │  📧 techcafe@example.com                               │   │
│  │  📞 +91 98765 43210                                    │   │
│  │                                                        │   │
│  │  [Edit Profile] [Change Logo]                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SAVED FILTERS                                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Your default search filters for browsing applicants:  │   │
│  │  Categories: Food Service, Retail                      │   │
│  │  Shift Type: Any                                       │   │
│  │  Location: Mumbai                                      │   │
│  │  Rate Range: ₹100 - ₹300/hr                            │   │
│  │                                                        │   │
│  │  [Edit Filters]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ACCOUNT SETTINGS                                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [👤 Update Profile]                                   │   │
│  │  [🔒 Change Password]                                  │   │
│  │  [🔔 Notification Preferences]                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [🚪 Logout]                                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `PUT /api/auth/update-password`
- `POST /api/auth/logout`
- `GET /api/employer/saved-filters`
- `PUT /api/employer/saved-filters`

---

## 👨‍💼 3. ADMIN PORTAL

### 3.1 Admin Login Page
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                                                                │
│                     ┌──────────────────┐                       │
│                     │                  │                       │
│                     │   🛡️   │                       │
│                     │                  │                       │
│                     │  ADMIN LOGIN     │                       │
│                     │                  │                       │
│                     └──────────────────┘                       │
│                                                                │
│                     ShiftMaster Admin Panel                    │
│                                                                │
│                     ┌──────────────────┐                       │
│                     │ Email            │                       │
│                     │ admin@shiftmaster│                       │
│                     └──────────────────┘                       │
│                                                                │
│                     ┌──────────────────┐                       │
│                     │ Password         │                       │
│                     │ ••••••••         │                       │
│                     └──────────────────┘                       │
│                                                                │
│                     ┌──────────────────┐                       │
│                     │    SIGN IN       │                       │
│                     └──────────────────┘                       │
│                                                                │
│                     ← Back to Main Site                        │
│                                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Call:**
- `POST /api/auth/login` (body: identifier, password, userType: 'admin')

---

### 3.2 Admin Dashboard Page
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Admin Dashboard                                [🔔] [👤 ▼] │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PLATFORM OVERVIEW                                     │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │Employers │ │Applicants│ │   Jobs   │ │Applications│  │   │
│  │  │   150    │ │  1,250   │ │   420    │ │   2,100    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Shifts  │ │  Active  │ │ Pending  │ │ Blocked  │  │   │
│  │  │  1,560   │ │   380    │ │    12    │ │    5     │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ⚠️ PENDING APPROVALS                           [View] │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  12 employers are waiting for approval                 │   │
│  │                                                        │   │
│  │  Recent pending:                                       │   │
│  │  • QuickBites Restaurant - Applied: Jan 20, 2024       │   │
│  │  • SuperMart Retail - Applied: Jan 19, 2024            │   │
│  │  • HealthPlus Clinic - Applied: Jan 19, 2024           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  RECENT JOBS                                    [View] │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Chef Required | Tech Cafe | Posted: Jan 20            │   │
│  │  Delivery Partner | FastLogistics | Posted: Jan 19     │   │
│  │  Cashier | SuperMart | Posted: Jan 19                  │   │
│  │  Security Guard | SafeGuard | Posted: Jan 18           │   │
│  │  Nurse | HealthPlus | Posted: Jan 18                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  RECENT APPLICATIONS                            [View] │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Jane Smith → Chef Required (Tech Cafe)                │   │
│  │  John Doe → Delivery Partner (FastLogistics)           │   │
│  │  Alice → Cashier (SuperMart)                           │   │
│  │  Bob → Security Guard (SafeGuard)                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  QUICK ACTIONS                                         │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  [Approve Employers] [Manage Applicants] [Moderate Jobs]│  │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/admin/dashboard/stats` - Contains all stats + recentJobs + recentApplications

> **⚠️ NOTE:** Do NOT call separate endpoints for recent jobs/applications. They are embedded in the dashboard stats response.

---

### 3.3 Admin Navigation
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Admin Dashboard                                [🔔] [👤 ▼] │  ← Header
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │  ← Tab Nav
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    CONTENT AREA                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Manage Employers Page
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Manage Employers                                      🔍    │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search employers...] [Status ▼] [Type ▼] [Date ▼]   │   │
│  │                                                        │   │
│  │  [All] [Pending] [Approved] [Blocked]                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  EMPLOYER CARD (Pending Approval)                      │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ ┌──────┐                                        │  │   │
│  │  │ │ Logo │  QuickBites Restaurant                 │  │   │
│  │  │ └──────┘  Owner: Rahul Sharma                   │  │   │
│  │  │                                                 │  │   │
│  │  │  📧 quickbites@example.com                      │  │   │
│  │  │  📞 +91 98765 43210                             │  │   │
│  │  │  🏢 Restaurant | 📍 Mumbai, Maharashtra         │  │   │
│  │  │                                                 │  │   │
│  │  │  Registered: Jan 20, 2024                       │  │   │
│  │  │  Status: [Pending Approval]                     │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Full Profile] [Approve] [Block] [Delete] │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  EMPLOYER CARD (Approved)                              │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Tech Cafe                                             │   │
│  │  Owner: John Doe | Restaurant | Mumbai                 │   │
│  │  Status: [Approved] | 5 Jobs | 28 Applications         │   │
│  │  [View] [Block] [Delete]                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  EMPLOYER CARD (Blocked)                               │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  BadService Co.                                        │   │
│  │  Owner: Unknown | Retail | Delhi                       │   │
│  │  Status: [Blocked] | Blocked on: Jan 15, 2024          │   │
│  │  [View] [Unblock]                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📄 Pagination                                         │   │
│  │  Showing 1-10 of 150 employers                         │   │
│  │  [< Prev] 1  2  3  ... 15 [Next >]                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/admin/employers?isApproved=&isBlocked=&businessType=&search=&page=`
- `PUT /api/admin/employers/:id/approve`
- `PUT /api/admin/employers/:id/block`
- `PUT /api/admin/employers/:id/unblock`

---

### 3.5 Manage Applicants Page
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Manage Applicants                                     🔍    │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search applicants...] [Status ▼] [Date ▼] [Export]  │   │
│  │  [All] [Active] [Inactive]                                 │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICANT CARD (Active)                               │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ ┌──────┐                                        │  │   │
│  │  │ │Avatar│  Jane Smith                            │  │   │
│  │  │ └──────┘  📧 jane@example.com                   │  │   │
│  │  │           📞 +91 98765 43211                    │  │   │
│  │  │                                                 │  │   │
│  │  │  Status: [Active]                               │  │   │
│  │  │  Registered: Jan 15, 2024                       │  │   │
│  │  │                                                 │  │   │
│  │  │  Stats: 12 Applications | 5 Accepted | 8 Shifts │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Full Profile] [Deactivate]               │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  APPLICANT CARD (Inactive)                             │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  John Doe                                              │   │
│  │  Status: [Inactive] | Deactivated: Jan 10, 2024        │   │
│  │  ⚠️ WARNING: Admin CANNOT reactivate applicants        │   │
│  │  [View Profile]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/admin/applicants?isActive=&search=&page=`
- `PUT /api/admin/applicants/:id/deactivate`

> **⚠️ CRITICAL:** There is NO `PUT /api/admin/applicants/:id/activate` endpoint. Admin can only DEACTIVATE applicants, not reactivate them.

---

### 3.6 Moderate Jobs Page
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Moderate Jobs                                         🔍    │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTER                                       │   │
│  │  [Search jobs...] [Status ▼] [Category ▼] [Date ▼]    │   │
│  │  [Export]                                              │   │
│  │  [All] [Open] [Closed] [Filled]                            │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB CARD                                              │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │  Chef Required                          [Open] │  │   │
│  │  │  Tech Cafe                                       │  │   │
│  │  │                                                 │  │   │
│  │  │  Posted: Jan 15, 2024 | Applications: 5         │  │   │
│  │  │  💰 ₹200/day | 📍 Mumbai | 🕐 Part-time         │  │   │
│  │  │                                                 │  │   │
│  │  │  Description:                                   │  │   │
│  │  │  Looking for an experienced chef...             │  │   │
│  │  │                                                 │  │   │
│  │  │  [View Full Details] [Delete Job]               │  │   │
│  │  │                                                 │  │   │
│  │  │  ⚠️ Admin can DELETE jobs, not close them       │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ─────────────────────────────────────────────────     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  JOB CARD 2 (Closed by Employer)                       │   │
│  │  ─────────────────────────────────────────────────     │   │
│  │  Delivery Partner - FastLogistics                      │   │
│  │  Status: [Closed] | Posted: Jan 10 | Closed: Jan 14    │   │
│  │  [View] [Delete]                                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/jobs?status=&search=&page=` - Use public endpoint (no admin list route exists)
- `DELETE /api/admin/jobs/:id` - Delete job

> **⚠️ CRITICAL:** 
> - There is NO `GET /api/admin/jobs` endpoint - use the public `GET /api/jobs`
> - There is NO `PUT /api/admin/jobs/:id/close` - Admin can only DELETE jobs, not close them

---

### 3.7 Admin Analytics Page
```
┌────────────────────────────────────────────────────────────────┐
│  ☰ Analytics                                             🔍    │
├────────────────────────────────────────────────────────────────┤
│  [Dashboard] [Employers] [Applicants] [Jobs] [Analytics]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  TIME RANGE                                            │   │
│  │  [Today] [Last 7 Days] [Last 30 Days] [This Year] [Custom]│  │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📈 APPLICATIONS OVER TIME                             │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │                                                 │  │   │
│  │  │         LINE CHART                              │  │   │
│  │  │                                                 │  │   │
│  │  │  Applications over selected time period         │  │   │
│  │  │                                                 │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📊 JOBS BY CATEGORY                                   │   │
│  │  ┌────────────────┐  ┌─────────────────────────────┐  │   │
│  │  │                │  │                             │  │   │
│  │  │  PIE CHART     │  │  Food Service: 45%          │  │   │
│  │  │                │  │  Retail: 25%                │  │   │
│  │  │  Jobs by       │  │  Logistics: 15%             │  │   │
│  │  │  category      │  │  Healthcare: 10%            │  │   │
│  │  │                │  │  Other: 5%                  │  │   │
│  │  │                │  │                             │  │   │
│  │  └────────────────┘  └─────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📊 EMPLOYER STATUS                                    │   │
│  │  ┌────────────────┐  ┌─────────────────────────────┐  │   │
│  │  │                │  │  Approved: 135 (90%)        │  │   │
│  │  │  PIE CHART     │  │  Pending: 12 (8%)           │  │   │
│  │  │                │  │  Blocked: 3 (2%)            │  │   │
│  │  │  Employer      │  │                             │  │   │
│  │  │  approval      │  │                             │  │   │
│  │  │  status        │  │                             │  │   │
│  │  └────────────────┘  └─────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  📋 KEY METRICS                                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Total   │ │   New    │ │Conversion│ │ Avg Time │  │   │
│  │  │ Signups  │ │  Today   │ │   Rate   │ │  to Hire │  │   │
│  │  │  1,400   │ │    5     │ │  23.5%   │ │  4 days  │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**API Calls:**
- `GET /api/admin/dashboard/stats` - For key metrics

---

## 🔄 Shared Components

### Common Components Across All Portals

```typescript
// Common UI Components needed:

// Layout Components
- Layout (with sidebar/header)
- Sidebar
- Header
- Footer

// Navigation Components
- Breadcrumbs
- Tabs
- Pagination

// Data Display Components
- DataTable
- Card
- Badge
- Avatar
- Tooltip

// Form Components
- Input
- Select
- Checkbox
- Radio
- TextArea
- DatePicker
- FileUpload
- TagInput

// Feedback Components
- Alert
- Toast/Notification
- Modal/Dialog
- ConfirmDialog
- LoadingSpinner
- SkeletonLoader

// Utility Components
- EmptyState
- ErrorBoundary
- ProtectedRoute
```

---

## 📊 Complete Page Inventory

### Public Portal (Applicant) - 15 Pages
| # | Page | Route | Auth Required |
|---|------|-------|---------------|
| 1 | Landing | `/` | No |
| 2 | Login | `/login` | No |
| 3 | Applicant Signup | `/signup/applicant` | No |
| 4 | Registration Form | `/register/applicant` | No |
| 5 | Home Dashboard | `/home` | Yes |
| 6 | Browse Jobs | `/jobs` | Yes |
| 7 | Job Detail | `/jobs/:id` | Yes |
| 8 | My Jobs | `/my-jobs` | Yes |
| 9 | Job Request Detail | `/job-requests/:id` | Yes |
| 10 | My Shifts | `/shifts` | Yes |
| 11 | Shift Detail | `/shifts/:id` | Yes |
| 12 | Attendance History | `/attendance` | Yes |
| 13 | Profile | `/profile` | Yes |
| 14 | Notifications | `/notifications` | Yes |
| 15 | Edit Profile | `/profile/edit` | Yes |

### Employer Portal - 18 Pages
| # | Page | Route | Auth Required |
|---|------|-------|---------------|
| 1 | Landing | `/` | No |
| 2 | Login | `/login` | No |
| 3 | Employer Signup | `/signup/employer` | No |
| 4 | Registration Form | `/register/employer` | No |
| 5 | Dashboard | `/employer/dashboard` | Yes |
| 6 | My Jobs | `/employer/jobs` | Yes |
| 7 | Post Job | `/employer/jobs/create` | Yes |
| 8 | Edit Job | `/employer/jobs/:id/edit` | Yes |
| 9 | Job Applications | `/employer/jobs/:id/applications` | Yes |
| 10 | Browse Applicants | `/employer/applicants` | Yes |
| 11 | Applicant Profile | `/employer/applicants/:id` | Yes |
| 12 | Send Job Request | `/employer/requests/create` | Yes |
| 13 | Job Requests Sent | `/employer/requests` | Yes |
| 14 | Shortlist | `/employer/shortlist` | Yes |
| 15 | My Shifts | `/employer/shifts` | Yes |
| 16 | Create Shift | `/employer/shifts/create` | Yes |
| 17 | Attendance Records | `/employer/attendance` | Yes |
| 18 | Settings | `/employer/settings` | Yes |

### Admin Portal - 6 Pages
| # | Page | Route | Auth Required |
|---|------|-------|---------------|
| 1 | Admin Login | `/admin/login` | No |
| 2 | Dashboard | `/admin/dashboard` | Yes |
| 3 | Manage Employers | `/admin/employers` | Yes |
| 4 | Manage Applicants | `/admin/applicants` | Yes |
| 5 | Moderate Jobs | `/admin/jobs` | Yes |
| 6 | Analytics | `/admin/analytics` | Yes |

---

## 🎨 Design System

### CSS Variables / Theme
```css
:root {
  /* Primary Colors */
  --primary: #1976D2;
  --primary-dark: #115293;
  --primary-light: #4791DB;
  --secondary: #00BCD4;
  
  /* Status Colors */
  --success: #4CAF50;
  --warning: #FFA726;
  --error: #E53935;
  --info: #29B6F6;
  
  /* Background Colors */
  --background: #F5F5F5;
  --surface: #FFFFFF;
  --border: #E0E0E0;
  
  /* Text Colors */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-hint: #BDBDBD;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

## ⚠️ Critical Implementation Notes

### 1. Employer Dashboard - Recent Applications
```typescript
// ❌ WRONG - This endpoint does NOT exist
GET /api/applications/employer/recent?limit=5

// ✅ CORRECT - Must fetch applications per job
async function getRecentApplications() {
  // Step 1: Get employer jobs
  const jobsResponse = await api.get('/api/jobs/employer/my-jobs', {
    params: { limit: 5 }
  });
  const jobs = jobsResponse.data.data;
  
  // Step 2: Fetch applications for each job
  const allApplications = [];
  for (const job of jobs) {
    const appsResponse = await api.get(`/api/applications/job/${job._id}`, {
      params: { limit: 1 }
    });
    allApplications.push(...appsResponse.data.data);
  }
  
  // Step 3: Sort and limit
  allApplications.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt));
  return allApplications.slice(0, 5);
}
```

### 2. Admin Stats Endpoint
```typescript
// ❌ WRONG
GET /api/admin/stats

// ✅ CORRECT
GET /api/admin/dashboard/stats
```

### 3. Reject Application Body Field
```typescript
// ❌ WRONG
await api.put(`/api/applications/${id}/reject`, {
  rejectReason: 'Not a fit'
});

// ✅ CORRECT
await api.put(`/api/applications/${id}/reject`, {
  rejectionReason: 'Not a fit'
});
```

### 4. Admin Cannot Activate Applicants
```typescript
// ❌ WRONG - This does NOT exist
PUT /api/admin/applicants/${id}/activate

// ✅ CORRECT - Admin can only deactivate
PUT /api/admin/applicants/${id}/deactivate
```

### 5. Admin Cannot Close Jobs
```typescript
// ❌ WRONG - Admin CANNOT close jobs
PUT /api/admin/jobs/${id}/close

// ✅ CORRECT - Admin can only delete
DELETE /api/admin/jobs/${id}

// ❌ WRONG - No admin-specific job listing
GET /api/admin/jobs

// ✅ CORRECT - Use public endpoint
GET /api/jobs
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */

/* Mobile */
@media (max-width: 640px) {
  /* Stack layouts, hide sidebar, show bottom nav */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Collapsible sidebar, 2-column grids */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full sidebar, multi-column layouts */
}
```

---

**End of React Site Map Documentation**
