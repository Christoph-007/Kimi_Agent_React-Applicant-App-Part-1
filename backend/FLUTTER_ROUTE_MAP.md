# ShiftMaster - Flutter Route Map
> **Generated:** 2026-03-04 | **Purpose:** Complete navigation and routing structure for Flutter app

---

## 🗺️ Navigation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUTTER NAVIGATION STRUCTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   AuthRouter    │    │  ApplicantFlow  │    │   EmployerFlow  │         │
│  │   (Public)      │    │   (Protected)   │    │   (Protected)   │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                  │
│           ▼                      ▼                      ▼                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  SplashScreen   │    │  MainNavigator  │    │  MainNavigator  │         │
│  │  LoginScreen    │    │  (Bottom Nav)   │    │  (Bottom Nav)   │         │
│  │  SignupScreens  │    │                 │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                │                      │                     │
│                                ▼                      ▼                     │
│                       ┌─────────────────┐    ┌─────────────────┐            │
│                       │  Nested Routers │    │  Nested Routers │            │
│                       │  - JobsRouter   │    │  - JobsRouter   │            │
│                       │  - ShiftsRouter │    │  - ShiftsRouter │            │
│                       │  - ProfileRouter│    │  - ProfileRouter│            │
│                       └─────────────────┘    └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Route Constants

```dart
// lib/core/routes/route_names.dart

class RouteNames {
  // Root Routes
  static const String splash = '/';
  static const String login = '/login';
  static const String unauthorized = '/unauthorized';
  
  // Applicant Auth Routes
  static const String applicantSignup = '/signup/applicant';
  static const String applicantRegister = '/register/applicant';
  
  // Employer Auth Routes
  static const String employerSignup = '/signup/employer';
  static const String employerRegister = '/register/employer';
  
  // Admin Auth Routes
  static const String adminLogin = '/admin/login';
  
  // Applicant Main Routes (Bottom Nav)
  static const String applicantHome = '/home';
  static const String applicantBrowse = '/jobs';
  static const String applicantMyJobs = '/my-jobs';
  static const String applicantProfile = '/profile';
  
  // Applicant Detail Routes
  static const String jobDetail = '/jobs/:id';
  static const String jobRequestDetail = '/job-requests/:id';
  static const String myShifts = '/shifts';
  static const String shiftDetail = '/shifts/:id';
  static const String attendanceHistory = '/attendance';
  static const String notifications = '/notifications';
  static const String editProfile = '/profile/edit';
  static const String changePassword = '/profile/change-password';
  
  // Employer Main Routes (Bottom Nav)
  static const String employerDashboard = '/employer/dashboard';
  static const String employerJobs = '/employer/jobs';
  static const String employerApplicants = '/employer/applicants';
  static const String employerMore = '/employer/more';
  
  // Employer Detail Routes
  static const String employerPostJob = '/employer/jobs/create';
  static const String employerEditJob = '/employer/jobs/:id/edit';
  static const String employerJobApplications = '/employer/jobs/:id/applications';
  static const String employerApplicantProfile = '/employer/applicants/:id';
  static const String employerSendRequest = '/employer/requests/create';
  static const String employerRequests = '/employer/requests';
  static const String employerShortlist = '/employer/shortlist';
  static const String employerShifts = '/employer/shifts';
  static const String employerCreateShift = '/employer/shifts/create';
  static const String employerAttendance = '/employer/attendance';
  static const String employerEditProfile = '/employer/profile/edit';
  
  // Admin Routes
  static const String adminDashboard = '/admin/dashboard';
  static const String adminEmployers = '/admin/employers';
  static const String adminApplicants = '/admin/applicants';
  static const String adminJobs = '/admin/jobs';
  static const String adminAnalytics = '/admin/analytics';
  
  // Admin Detail Routes
  static const String adminEmployerDetail = '/admin/employers/:id';
  static const String adminApplicantDetail = '/admin/applicants/:id';
  static const String adminJobDetail = '/admin/jobs/:id';
}
```

---

## 🧭 Route Configuration

### Main Router Setup

```dart
// lib/core/routes/app_router.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'route_names.dart';
import 'route_guards.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _applicantNavigatorKey = GlobalKey<NavigatorState>();
  static final _employerNavigatorKey = GlobalKey<NavigatorState>();
  static final _adminNavigatorKey = GlobalKey<NavigatorState>();
  
  static GoRouter get router => _router;
  
  static final _router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: RouteNames.splash,
    debugLogDiagnostics: true,
    redirect: RouteGuards.handleRedirect,
    routes: [
      // Splash & Auth Routes (Shared)
      ..._authRoutes,
      
      // Applicant Routes (Protected)
      ..._applicantRoutes,
      
      // Employer Routes (Protected)
      ..._employerRoutes,
      
      // Admin Routes (Protected)
      ..._adminRoutes,
    ],
    errorBuilder: (context, state) => const NotFoundScreen(),
  );
}
```

---

## 🔓 Auth Routes (Public)

```dart
// lib/core/routes/app_router.dart (continued)

static List<RouteBase> get _authRoutes => [
  // Splash Screen
  GoRoute(
    path: RouteNames.splash,
    builder: (context, state) => const SplashScreen(),
  ),
  
  // Login
  GoRoute(
    path: RouteNames.login,
    builder: (context, state) => const LoginScreen(),
  ),
  
  // Applicant Signup Flow
  GoRoute(
    path: RouteNames.applicantSignup,
    builder: (context, state) => const ApplicantSignupScreen(),
  ),
  GoRoute(
    path: RouteNames.applicantRegister,
    builder: (context, state) => const ApplicantRegistrationScreen(),
  ),
  
  // Employer Signup Flow
  GoRoute(
    path: RouteNames.employerSignup,
    builder: (context, state) => const EmployerSignupScreen(),
  ),
  GoRoute(
    path: RouteNames.employerRegister,
    builder: (context, state) => const EmployerRegistrationScreen(),
  ),
  
  // Admin Login
  GoRoute(
    path: RouteNames.adminLogin,
    builder: (context, state) => const AdminLoginScreen(),
  ),
  
  // Unauthorized
  GoRoute(
    path: RouteNames.unauthorized,
    builder: (context, state) => const UnauthorizedScreen(),
  ),
];
```

---

## 👤 Applicant Routes (Protected)

```dart
// lib/core/routes/app_router.dart (continued)

static List<RouteBase> get _applicantRoutes => [
  StatefulShellRoute.indexedStack(
    builder: (context, state, navigationShell) {
      return ApplicantMainScreen(navigationShell: navigationShell);
    },
    branches: [
      // Home Branch
      StatefulShellBranch(
        navigatorKey: _applicantNavigatorKey,
        routes: [
          GoRoute(
            path: RouteNames.applicantHome,
            builder: (context, state) => const HomeScreen(),
            routes: [
              // Nested routes within Home tab
              GoRoute(
                path: 'notifications',
                builder: (context, state) => const NotificationsScreen(),
              ),
            ],
          ),
        ],
      ),
      
      // Browse Jobs Branch
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.applicantBrowse,
            builder: (context, state) => const BrowseJobsScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final jobId = state.pathParameters['id']!;
                  return JobDetailScreen(jobId: jobId);
                },
              ),
            ],
          ),
        ],
      ),
      
      // My Jobs Branch
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.applicantMyJobs,
            builder: (context, state) => const MyJobsScreen(),
            routes: [
              GoRoute(
                path: 'requests/:id',
                builder: (context, state) {
                  final requestId = state.pathParameters['id']!;
                  return JobRequestDetailScreen(requestId: requestId);
                },
              ),
              GoRoute(
                path: 'shifts',
                builder: (context, state) => const MyShiftsScreen(),
                routes: [
                  GoRoute(
                    path: ':id',
                    builder: (context, state) {
                      final shiftId = state.pathParameters['id']!;
                      return ShiftDetailScreen(shiftId: shiftId);
                    },
                  ),
                ],
              ),
              GoRoute(
                path: 'attendance',
                builder: (context, state) => const AttendanceHistoryScreen(),
              ),
            ],
          ),
        ],
      ),
      
      // Profile Branch
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.applicantProfile,
            builder: (context, state) => const ProfileScreen(),
            routes: [
              GoRoute(
                path: 'edit',
                builder: (context, state) => const EditProfileScreen(),
              ),
              GoRoute(
                path: 'change-password',
                builder: (context, state) => const ChangePasswordScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  ),
];
```

---

## 🏢 Employer Routes (Protected)

```dart
// lib/core/routes/app_router.dart (continued)

static List<RouteBase> get _employerRoutes => [
  StatefulShellRoute.indexedStack(
    builder: (context, state, navigationShell) {
      return EmployerMainScreen(navigationShell: navigationShell);
    },
    branches: [
      // Dashboard Branch
      StatefulShellBranch(
        navigatorKey: _employerNavigatorKey,
        routes: [
          GoRoute(
            path: RouteNames.employerDashboard,
            builder: (context, state) => const EmployerDashboardScreen(),
          ),
        ],
      ),
      
      // My Jobs Branch
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.employerJobs,
            builder: (context, state) => const EmployerJobsScreen(),
            routes: [
              GoRoute(
                path: 'create',
                builder: (context, state) => const PostJobScreen(),
              ),
              GoRoute(
                path: ':id/edit',
                builder: (context, state) {
                  final jobId = state.pathParameters['id']!;
                  return EditJobScreen(jobId: jobId);
                },
              ),
              GoRoute(
                path: ':id/applications',
                builder: (context, state) {
                  final jobId = state.pathParameters['id']!;
                  return JobApplicationsScreen(jobId: jobId);
                },
              ),
            ],
          ),
        ],
      ),
      
      // Browse Applicants Branch
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.employerApplicants,
            builder: (context, state) => const BrowseApplicantsScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final applicantId = state.pathParameters['id']!;
                  return ApplicantProfileScreen(applicantId: applicantId);
                },
              ),
              GoRoute(
                path: 'send-request',
                builder: (context, state) {
                  final applicant = state.extra as Applicant?;
                  return SendJobRequestScreen(applicant: applicant);
                },
              ),
            ],
          ),
        ],
      ),
      
      // More Branch (Profile & Settings)
      StatefulShellBranch(
        routes: [
          GoRoute(
            path: RouteNames.employerMore,
            builder: (context, state) => const EmployerMoreScreen(),
            routes: [
              // Job Requests
              GoRoute(
                path: 'requests',
                builder: (context, state) => const JobRequestsSentScreen(),
              ),
              // Shortlist
              GoRoute(
                path: 'shortlist',
                builder: (context, state) => const ShortlistScreen(),
              ),
              // Shifts
              GoRoute(
                path: 'shifts',
                builder: (context, state) => const EmployerShiftsScreen(),
                routes: [
                  GoRoute(
                    path: 'create',
                    builder: (context, state) => const CreateShiftScreen(),
                  ),
                ],
              ),
              // Attendance
              GoRoute(
                path: 'attendance',
                builder: (context, state) => const AttendanceRecordsScreen(),
              ),
              // Profile
              GoRoute(
                path: 'profile/edit',
                builder: (context, state) => const EmployerEditProfileScreen(),
              ),
              // Notifications
              GoRoute(
                path: 'notifications',
                builder: (context, state) => const EmployerNotificationsScreen(),
              ),
              // Change Password
              GoRoute(
                path: 'change-password',
                builder: (context, state) => const ChangePasswordScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  ),
];
```

---

## 👨‍💼 Admin Routes (Protected)

```dart
// lib/core/routes/app_router.dart (continued)

static List<RouteBase> get _adminRoutes => [
  ShellRoute(
    builder: (context, state, child) {
      return AdminMainScreen(child: child);
    },
    routes: [
      // Dashboard
      GoRoute(
        path: RouteNames.adminDashboard,
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      
      // Manage Employers
      GoRoute(
        path: RouteNames.adminEmployers,
        builder: (context, state) => const ManageEmployersScreen(),
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final employerId = state.pathParameters['id']!;
              return EmployerDetailScreen(employerId: employerId);
            },
          ),
        ],
      ),
      
      // Manage Applicants
      GoRoute(
        path: RouteNames.adminApplicants,
        builder: (context, state) => const ManageApplicantsScreen(),
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final applicantId = state.pathParameters['id']!;
              return AdminApplicantDetailScreen(applicantId: applicantId);
            },
          ),
        ],
      ),
      
      // Moderate Jobs
      GoRoute(
        path: RouteNames.adminJobs,
        builder: (context, state) => const ModerateJobsScreen(),
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final jobId = state.pathParameters['id']!;
              return AdminJobDetailScreen(jobId: jobId);
            },
          ),
        ],
      ),
      
      // Analytics
      GoRoute(
        path: RouteNames.adminAnalytics,
        builder: (context, state) => const AdminAnalyticsScreen(),
      ),
    ],
  ),
];
```

---

## 🛡️ Route Guards

```dart
// lib/core/routes/route_guards.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';
import 'route_names.dart';

class RouteGuards {
  static String? handleRedirect(BuildContext context, GoRouterState state) {
    final authService = AuthService.instance;
    final isAuthenticated = authService.isAuthenticated;
    final userType = authService.userType;
    final isApproved = authService.currentUser?.isApproved ?? false;
    
    final currentPath = state.matchedLocation;
    
    // Public routes that don't require authentication
    final publicRoutes = [
      RouteNames.splash,
      RouteNames.login,
      RouteNames.applicantSignup,
      RouteNames.applicantRegister,
      RouteNames.employerSignup,
      RouteNames.employerRegister,
      RouteNames.adminLogin,
      RouteNames.unauthorized,
    ];
    
    // Check if current route is public
    final isPublicRoute = publicRoutes.any((route) => 
      currentPath.startsWith(route) || currentPath == route
    );
    
    // Allow public routes
    if (isPublicRoute) {
      // If authenticated and on login/splash, redirect to appropriate home
      if (isAuthenticated && 
          (currentPath == RouteNames.login || currentPath == RouteNames.splash)) {
        return _getHomeRouteForUserType(userType);
      }
      return null;
    }
    
    // Protected routes - must be authenticated
    if (!isAuthenticated) {
      return RouteNames.login;
    }
    
    // Check role-based access
    final allowed = _checkRoleAccess(currentPath, userType);
    if (!allowed) {
      return RouteNames.unauthorized;
    }
    
    // Check employer approval for employer routes
    if (userType == UserType.employer && 
        currentPath.startsWith('/employer') &&
        !isApproved &&
        currentPath != RouteNames.employerDashboard) {
      // Allow dashboard but show pending approval banner
      // Other features are restricted
    }
    
    return null;
  }
  
  static String _getHomeRouteForUserType(UserType? userType) {
    switch (userType) {
      case UserType.applicant:
        return RouteNames.applicantHome;
      case UserType.employer:
        return RouteNames.employerDashboard;
      case UserType.admin:
        return RouteNames.adminDashboard;
      default:
        return RouteNames.login;
    }
  }
  
  static bool _checkRoleAccess(String path, UserType? userType) {
    if (path.startsWith('/home') || 
        path.startsWith('/jobs') || 
        path.startsWith('/my-jobs') || 
        path.startsWith('/profile') ||
        path.startsWith('/shifts') ||
        path.startsWith('/attendance')) {
      return userType == UserType.applicant;
    }
    
    if (path.startsWith('/employer')) {
      return userType == UserType.employer;
    }
    
    if (path.startsWith('/admin')) {
      return userType == UserType.admin;
    }
    
    return true;
  }
}
```

---

## 📱 Navigation Examples

### Basic Navigation

```dart
// Navigate to a route
context.push(RouteNames.applicantBrowse);

// Navigate with parameters
context.push('/jobs/123');
// OR
context.pushNamed('jobDetail', pathParameters: {'id': '123'});

// Navigate with query parameters
context.push('/jobs?category=food&city=Mumbai');

// Navigate with extra data
context.push('/employer/applicants/send-request', 
  extra: applicantObject);

// Replace current route
context.replace(RouteNames.applicantHome);

// Go back
context.pop();

// Go to specific route (clear stack)
context.go(RouteNames.applicantHome);
```

### Navigation with Result

```dart
// Navigate and wait for result
final result = await context.push<bool>('/jobs/123/apply');

if (result == true) {
  // Show success message
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Application submitted!')),
  );
}

// Return result
context.pop(true);
```

### Deep Linking

```dart
// Handle deep links
// URL: shiftmaster://jobs/123
// Universal Link: https://shiftmaster.app/jobs/123

// Configure in AndroidManifest.xml and Info.plist
// Then handle in GoRouter

// For custom URL scheme
goRouter.namedLocation('jobDetail', pathParameters: {'id': '123'});
```

---

## 🧩 Widgets

### Applicant Main Screen (Bottom Navigation)

```dart
// lib/features/applicant/screens/applicant_main_screen.dart

class ApplicantMainScreen extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  
  const ApplicantMainScreen({
    super.key,
    required this.navigationShell,
  });
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Browse',
          ),
          NavigationDestination(
            icon: Icon(Icons.work_outline),
            selectedIcon: Icon(Icons.work),
            label: 'My Jobs',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
```

### Employer Main Screen (Bottom Navigation)

```dart
// lib/features/employer/screens/employer_main_screen.dart

class EmployerMainScreen extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  
  const EmployerMainScreen({
    super.key,
    required this.navigationShell,
  });
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.work_outline),
            selectedIcon: Icon(Icons.work),
            label: 'Jobs',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people),
            label: 'Applicants',
          ),
          NavigationDestination(
            icon: Icon(Icons.more_horiz),
            selectedIcon: Icon(Icons.more_horiz),
            label: 'More',
          ),
        ],
      ),
    );
  }
}
```

### Admin Main Screen (Side Navigation)

```dart
// lib/features/admin/screens/admin_main_screen.dart

class AdminMainScreen extends StatelessWidget {
  final Widget child;
  
  const AdminMainScreen({
    super.key,
    required this.child,
  });
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Panel'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Show notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              AuthService.instance.logout();
              context.go(RouteNames.adminLogin);
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Text(
                'ShiftMaster Admin',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Dashboard'),
              onTap: () => context.go(RouteNames.adminDashboard),
            ),
            ListTile(
              leading: const Icon(Icons.business),
              title: const Text('Manage Employers'),
              onTap: () => context.go(RouteNames.adminEmployers),
            ),
            ListTile(
              leading: const Icon(Icons.people),
              title: const Text('Manage Applicants'),
              onTap: () => context.go(RouteNames.adminApplicants),
            ),
            ListTile(
              leading: const Icon(Icons.work),
              title: const Text('Moderate Jobs'),
              onTap: () => context.go(RouteNames.adminJobs),
            ),
            ListTile(
              leading: const Icon(Icons.analytics),
              title: const Text('Analytics'),
              onTap: () => context.go(RouteNames.adminAnalytics),
            ),
          ],
        ),
      ),
      body: child,
    );
  }
}
```

---

## 🔄 Navigation State Management

### Auth Service

```dart
// lib/core/services/auth_service.dart

import 'package:flutter/foundation.dart';

enum UserType { applicant, employer, admin }

class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._internal();
  static AuthService get instance => _instance;
  
  AuthService._internal();
  
  User? _currentUser;
  String? _token;
  
  User? get currentUser => _currentUser;
  String? get token => _token;
  
  bool get isAuthenticated => _token != null && _currentUser != null;
  
  UserType? get userType {
    if (_currentUser == null) return null;
    if (_currentUser is Applicant) return UserType.applicant;
    if (_currentUser is Employer) return UserType.employer;
    if (_currentUser is Admin) return UserType.admin;
    return null;
  }
  
  Future<void> login(String identifier, String password, UserType type) async {
    // API call to login
    final response = await ApiService.instance.post('/auth/login', body: {
      'identifier': identifier,
      'password': password,
      'userType': type.name,
    });
    
    _token = response['token'];
    _currentUser = User.fromJson(response['user']);
    
    // Save to secure storage
    await SecureStorage.saveToken(_token!);
    
    notifyListeners();
  }
  
  Future<void> logout() async {
    await ApiService.instance.post('/auth/logout');
    
    _token = null;
    _currentUser = null;
    
    await SecureStorage.deleteToken();
    
    notifyListeners();
  }
  
  Future<void> tryAutoLogin() async {
    final token = await SecureStorage.getToken();
    if (token == null) return;
    
    // Verify token and get user
    try {
      final response = await ApiService.instance.get('/auth/me');
      _token = token;
      _currentUser = User.fromJson(response['data']);
      notifyListeners();
    } catch (e) {
      await SecureStorage.deleteToken();
    }
  }
}
```

---

## 🎯 Route Transitions

```dart
// Custom page transitions

CustomTransitionPage buildPageWithDefaultTransition<T>({
  required BuildContext context,
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage<T>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: child,
      );
    },
  );
}

// Usage in GoRoute
GoRoute(
  path: RouteNames.jobDetail,
  pageBuilder: (context, state) => buildPageWithDefaultTransition(
    context: context,
    state: state,
    child: JobDetailScreen(jobId: state.pathParameters['id']!),
  ),
)
```

---

## 📝 URL Strategy

```dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:url_strategy/url_strategy.dart';

void main() {
  // Remove # from URLs (for web)
  setPathUrlStrategy();
  
  runApp(const MyApp());
}
```

---

## 🔗 Deep Linking Configuration

### Android (AndroidManifest.xml)

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <!-- Custom URL scheme -->
    <data android:scheme="shiftmaster" />
    
    <!-- HTTPS links -->
    <data android:scheme="https" 
          android:host="shiftmaster.app" />
</intent-filter>
```

### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.shiftmaster.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>shiftmaster</string>
        </array>
    </dict>
</array>
```

---

## 🧪 Testing Navigation

```dart
// Test navigation
testWidgets('navigates to job detail', (tester) async {
  await tester.pumpWidget(
    MaterialApp.router(
      routerConfig: AppRouter.router,
    ),
  );
  
  // Tap on job card
  await tester.tap(find.text('Software Engineer'));
  await tester.pumpAndSettle();
  
  // Verify navigation
  expect(find.text('Job Details'), findsOneWidget);
});
```

---

**End of Route Map Documentation**
