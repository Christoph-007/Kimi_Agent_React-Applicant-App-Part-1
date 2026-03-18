# ShiftMaster - Flutter Implementation Guide
> **Generated:** 2026-03-04 | **Target:** Flutter 3.x+ with Material 3

---

## 📚 Table of Contents

1. [Project Setup](#-1-project-setup)
2. [Architecture](#-2-architecture)
3. [Folder Structure](#-3-folder-structure)
4. [Core Implementation](#-4-core-implementation)
5. [Feature Modules](#-5-feature-modules)
6. [State Management](#-6-state-management)
7. [UI Components](#-7-ui-components)
8. [Testing](#-8-testing)
9. [Build & Deploy](#-9-build--deploy)

---

## 🚀 1. Project Setup

### 1.1 Create Project
```bash
# Create Flutter project
flutter create --org com.shiftmaster shiftmaster_app

# Navigate to project
cd shiftmaster_app

# Add required dependencies
flutter pub add \
  go_router \
  flutter_bloc \
  dio \
  flutter_secure_storage \
  shared_preferences \
  equatable \
  freezed_annotation \
  json_annotation \
  intl \
  flutter_local_notifications \
  firebase_core \
  firebase_messaging \
  image_picker \
  file_picker \
  path_provider \
  open_filex \
  url_launcher \
  cached_network_image \
  shimmer \
  pull_to_refresh \
  infinite_scroll_pagination \
  badges

# Add dev dependencies
flutter pub add -d \
  build_runner \
  freezed \
  json_serializable \
  flutter_lints
```

### 1.2 pubspec.yaml
```yaml
name: shiftmaster_app
description: ShiftMaster - Job Portal Flutter App

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # Navigation
  go_router: ^13.0.0
  
  # State Management
  flutter_bloc: ^8.1.3
  
  # Networking
  dio: ^5.4.0
  
  # Storage
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.2
  
  # Utilities
  equatable: ^2.0.5
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1
  intl: ^0.18.1
  
  # Notifications
  flutter_local_notifications: ^16.3.0
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.0
  
  # File Handling
  image_picker: ^1.0.7
  file_picker: ^6.1.1
  path_provider: ^2.1.1
  open_filex: ^4.3.4
  
  # UI
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  infinite_scroll_pagination: ^4.0.0
  badges: ^3.1.2
  
  # Platform
  url_launcher: ^6.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.8
  freezed: ^2.4.5
  json_serializable: ^6.7.1

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
    - assets/fonts/
  
  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins-Regular.ttf
        - asset: assets/fonts/Poppins-Medium.ttf
          weight: 500
        - asset: assets/fonts/Poppins-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Poppins-Bold.ttf
          weight: 700
```

### 1.3 Environment Configuration
```dart
// lib/core/config/app_config.dart

class AppConfig {
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'development',
  );
  
  static String get baseUrl {
    switch (environment) {
      case 'production':
        return 'https://api.shiftmaster.app';
      case 'staging':
        return 'https://staging-api.shiftmaster.app';
      default:
        return 'http://localhost:5000';
    }
  }
  
  static const Duration apiTimeout = Duration(seconds: 30);
  static const String appName = 'ShiftMaster';
}
```

---

## 🏗️ 2. Architecture

### Clean Architecture + BLoC Pattern

```
lib/
├── core/                    # Shared, framework-agnostic code
│   ├── config/             # Configuration files
│   ├── constants/          # App constants
│   ├── routes/             # Navigation
│   ├── services/           # External services (API, Storage)
│   ├── utils/              # Utility functions
│   ├── theme/              # App theme
│   └── widgets/            # Shared widgets
│
├── features/               # Feature modules
│   ├── auth/              # Authentication
│   ├── applicant/         # Applicant portal
│   ├── employer/          # Employer portal
│   ├── admin/             # Admin portal
│   └── shared/            # Shared features
│
└── main.dart
```

### Data Flow
```
UI → BLoC → Repository → DataSource → API
  ↑                               ↓
  └────── State ← Model ←───────┘
```

---

## 📁 3. Folder Structure

### Feature-First Organization
```
lib/features/auth/
├── data/
│   ├── datasources/
│   │   ├── auth_remote_datasource.dart
│   │   └── auth_local_datasource.dart
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── applicant_model.dart
│   │   └── employer_model.dart
│   └── repositories/
│       └── auth_repository_impl.dart
│
├── domain/
│   ├── entities/
│   │   ├── user.dart
│   │   ├── applicant.dart
│   │   └── employer.dart
│   ├── repositories/
│   │   └── auth_repository.dart
│   └── usecases/
│       ├── login.dart
│       ├── signup.dart
│       ├── logout.dart
│       └── get_current_user.dart
│
├── presentation/
│   ├── bloc/
│   │   ├── auth_bloc.dart
│   │   ├── auth_event.dart
│   │   └── auth_state.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── applicant_signup_screen.dart
│   │   └── employer_signup_screen.dart
│   └── widgets/
│       ├── auth_form.dart
│       └── social_login_buttons.dart
│
└── auth.dart  # Barrel file
```

---

## 🔧 4. Core Implementation

### 4.1 API Service
```dart
// lib/core/services/api_service.dart

import 'package:dio/dio.dart';
import '../config/app_config.dart';

class ApiService {
  late final Dio _dio;
  static ApiService? _instance;
  
  factory ApiService() {
    _instance ??= ApiService._internal();
    return _instance!;
  }
  
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.baseUrl,
      connectTimeout: AppConfig.apiTimeout,
      receiveTimeout: AppConfig.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    _setupInterceptors();
  }
  
  void _setupInterceptors() {
    _dio.interceptors.addAll([
      // Auth interceptor
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await SecureStorage.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
      
      // Error interceptor
      InterceptorsWrapper(
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            // Handle token expiration
            _handleTokenExpiration();
          }
          handler.next(error);
        },
      ),
      
      // Logging interceptor
      LogInterceptor(
        requestBody: true,
        responseBody: true,
      ),
    ]);
  }
  
  void _handleTokenExpiration() {
    // Clear storage and navigate to login
    SecureStorage.clearAll();
    // Use navigator key to redirect
  }
  
  // HTTP Methods
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return await _dio.get(path, queryParameters: queryParameters);
  }
  
  Future<Response> post(
    String path, {
    dynamic data,
  }) async {
    return await _dio.post(path, data: data);
  }
  
  Future<Response> put(
    String path, {
    dynamic data,
  }) async {
    return await _dio.put(path, data: data);
  }
  
  Future<Response> delete(String path) async {
    return await _dio.delete(path);
  }
  
  Future<Response> uploadFile(
    String path,
    FormData formData, {
    ProgressCallback? onProgress,
  }) async {
    return await _dio.post(
      path,
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
      onSendProgress: onProgress,
    );
  }
}
```

### 4.2 Secure Storage
```dart
// lib/core/services/secure_storage.dart

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accountName: 'shiftmaster_app',
    ),
  );
  
  static const _tokenKey = 'auth_token';
  static const _userTypeKey = 'user_type';
  static const _userKey = 'user_data';
  
  // Token
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }
  
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }
  
  static Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }
  
  // User Type
  static Future<void> saveUserType(String userType) async {
    await _storage.write(key: _userTypeKey, value: userType);
  }
  
  static Future<String?> getUserType() async {
    return await _storage.read(key: _userTypeKey);
  }
  
  // Clear all
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
```

### 4.3 App Theme
```dart
// lib/core/theme/app_theme.dart

import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        error: AppColors.error,
        surface: Colors.white,
        background: AppColors.background,
      ),
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: 'Poppins',
      
      // AppBar
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
      ),
      
      // Cards
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      
      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      
      // Input
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
      ),
    );
  }
}
```

### 4.4 Colors
```dart
// lib/core/theme/app_colors.dart

import 'package:flutter/material.dart';

class AppColors {
  // Primary
  static const primary = Color(0xFF1976D2);
  static const primaryDark = Color(0xFF115293);
  static const primaryLight = Color(0xFF4791DB);
  static const secondary = Color(0xFF00BCD4);
  
  // Status
  static const success = Color(0xFF4CAF50);
  static const warning = Color(0xFFFFA726);
  static const error = Color(0xFFE53935);
  static const info = Color(0xFF29B6F6);
  
  // Background
  static const background = Color(0xFFF5F5F5);
  static const surface = Colors.white;
  
  // Text
  static const textPrimary = Color(0xFF212121);
  static const textSecondary = Color(0xFF757575);
  static const textHint = Color(0xFFBDBDBD);
  
  // Job Status
  static const jobOpen = Color(0xFF4CAF50);
  static const jobClosed = Color(0xFF9E9E9E);
  static const jobFilled = Color(0xFF2196F3);
  
  // Application Status
  static const applied = Color(0xFFFFA726);
  static const reviewing = Color(0xFF29B6F6);
  static const accepted = Color(0xFF4CAF50);
  static const rejected = Color(0xFFE53935);
  static const withdrawn = Color(0xFF9E9E9E);
  
  // Shift Status
  static const shiftScheduled = Color(0xFFFFA726);
  static const shiftConfirmed = Color(0xFF4CAF50);
  static const shiftInProgress = Color(0xFF2196F3);
  static const shiftCompleted = Color(0xFF9E27B0);
  static const shiftCancelled = Color(0xFFE53935);
}
```

---

## 📦 5. Feature Modules

### 5.1 Authentication Feature

```dart
// lib/features/auth/presentation/bloc/auth_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase _loginUseCase;
  final SignupUseCase _signupUseCase;
  final LogoutUseCase _logoutUseCase;
  final GetCurrentUserUseCase _getCurrentUserUseCase;
  
  AuthBloc({
    required LoginUseCase loginUseCase,
    required SignupUseCase signupUseCase,
    required LogoutUseCase logoutUseCase,
    required GetCurrentUserUseCase getCurrentUserUseCase,
  })  : _loginUseCase = loginUseCase,
        _signupUseCase = signupUseCase,
        _logoutUseCase = logoutUseCase,
        _getCurrentUserUseCase = getCurrentUserUseCase,
        super(const AuthState()) {
    on<AppStarted>(_onAppStarted);
    on<LoginRequested>(_onLoginRequested);
    on<ApplicantSignupRequested>(_onApplicantSignupRequested);
    on<EmployerSignupRequested>(_onEmployerSignupRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }
  
  Future<void> _onAppStarted(
    AppStarted event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading));
    
    final result = await _getCurrentUserUseCase();
    
    result.fold(
      (failure) => emit(state.copyWith(status: AuthStatus.unauthenticated)),
      (user) => emit(state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
      )),
    );
  }
  
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading));
    
    final result = await _loginUseCase(LoginParams(
      identifier: event.identifier,
      password: event.password,
      userType: event.userType,
    ));
    
    result.fold(
      (failure) => emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: failure.message,
      )),
      (user) => emit(state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
      )),
    );
  }
  
  // ... other handlers
}
```

```dart
// lib/features/auth/presentation/screens/login_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../bloc/auth_bloc.dart';
import '../../../../core/routes/route_names.dart';
import '../../../../core/theme/app_colors.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  UserType _selectedUserType = UserType.applicant;
  bool _obscurePassword = true;
  
  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
  
  void _onLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(LoginRequested(
        identifier: _identifierController.text.trim(),
        password: _passwordController.text,
        userType: _selectedUserType,
      ));
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state.status == AuthStatus.authenticated) {
            // Navigate based on user type
            final route = switch (state.user!.type) {
              UserType.applicant => RouteNames.applicantHome,
              UserType.employer => RouteNames.employerDashboard,
              UserType.admin => RouteNames.adminDashboard,
            };
            context.go(route);
          } else if (state.status == AuthStatus.error) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.errorMessage ?? 'Login failed')),
            );
          }
        },
        builder: (context, state) {
          return SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 48),
                    
                    // Logo
                    Icon(
                      Icons.work_outline,
                      size: 80,
                      color: AppColors.primary,
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Title
                    Text(
                      'Welcome Back',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Text(
                      'Sign in to continue',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // User Type Selector
                    SegmentedButton<UserType>(
                      segments: const [
                        ButtonSegment(
                          value: UserType.applicant,
                          label: Text('Applicant'),
                          icon: Icon(Icons.person),
                        ),
                        ButtonSegment(
                          value: UserType.employer,
                          label: Text('Employer'),
                          icon: Icon(Icons.business),
                        ),
                      ],
                      selected: {_selectedUserType},
                      onSelectionChanged: (selection) {
                        setState(() {
                          _selectedUserType = selection.first;
                        });
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Identifier Field
                    TextFormField(
                      controller: _identifierController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email or Phone',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Please enter email or phone';
                        }
                        return null;
                      },
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Password Field
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Please enter password';
                        }
                        if (value!.length < 6) {
                          return 'Password must be at least 6 characters';
                        }
                        return null;
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Login Button
                    ElevatedButton(
                      onPressed: state.status == AuthStatus.loading
                          ? null
                          : _onLogin,
                      child: state.status == AuthStatus.loading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Sign In'),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Signup Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("Don't have an account?"),
                        TextButton(
                          onPressed: () {
                            final route = _selectedUserType == UserType.employer
                                ? RouteNames.employerSignup
                                : RouteNames.applicantSignup;
                            context.push(route);
                          },
                          child: const Text('Sign Up'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

### 5.2 Jobs Feature

```dart
// lib/features/jobs/presentation/bloc/jobs_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

part 'jobs_event.dart';
part 'jobs_state.dart';

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final GetJobsUseCase _getJobsUseCase;
  
  JobsBloc({required GetJobsUseCase getJobsUseCase})
      : _getJobsUseCase = getJobsUseCase,
        super(const JobsState()) {
    on<LoadJobs>(_onLoadJobs);
    on<RefreshJobs>(_onRefreshJobs);
    on<ApplyFilters>(_onApplyFilters);
  }
  
  Future<void> _onLoadJobs(
    LoadJobs event,
    Emitter<JobsState> emit,
  ) async {
    if (state.hasReachedMax) return;
    
    emit(state.copyWith(status: JobsStatus.loading));
    
    final result = await _getJobsUseCase(GetJobsParams(
      page: event.page,
      limit: 10,
      filters: state.filters,
    ));
    
    result.fold(
      (failure) => emit(state.copyWith(
        status: JobsStatus.error,
        errorMessage: failure.message,
      )),
      (jobs) => emit(state.copyWith(
        status: JobsStatus.success,
        jobs: [...state.jobs, ...jobs],
        hasReachedMax: jobs.length < 10,
        currentPage: event.page,
      )),
    );
  }
  
  Future<void> _onRefreshJobs(
    RefreshJobs event,
    Emitter<JobsState> emit,
  ) async {
    emit(state.copyWith(
      status: JobsStatus.loading,
      jobs: [],
      currentPage: 1,
      hasReachedMax: false,
    ));
    
    add(const LoadJobs(page: 1));
  }
  
  void _onApplyFilters(
    ApplyFilters event,
    Emitter<JobsState> emit,
  ) {
    emit(state.copyWith(
      filters: event.filters,
      jobs: [],
      currentPage: 1,
      hasReachedMax: false,
    ));
    
    add(const LoadJobs(page: 1));
  }
}
```

```dart
// lib/features/jobs/presentation/screens/browse_jobs_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:go_router/go_router.dart';

import '../bloc/jobs_bloc.dart';
import '../../domain/entities/job.dart';
import '../widgets/job_card.dart';
import '../widgets/job_filters_sheet.dart';
import '../../../../core/routes/route_names.dart';

class BrowseJobsScreen extends StatefulWidget {
  const BrowseJobsScreen({super.key});
  
  @override
  State<BrowseJobsScreen> createState() => _BrowseJobsScreenState();
}

class _BrowseJobsScreenState extends State<BrowseJobsScreen> {
  final PagingController<int, Job> _pagingController =
      PagingController(firstPageKey: 1);
  
  @override
  void initState() {
    super.initState();
    _pagingController.addPageRequestListener((pageKey) {
      context.read<JobsBloc>().add(LoadJobs(page: pageKey));
    });
  }
  
  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }
  
  void _showFilters() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => const JobFiltersSheet(),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse Jobs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilters,
          ),
        ],
      ),
      body: BlocConsumer<JobsBloc, JobsState>(
        listener: (context, state) {
          if (state.status == JobsStatus.success) {
            if (state.hasReachedMax) {
              _pagingController.appendLastPage(state.jobs);
            } else {
              _pagingController.appendPage(
                state.jobs,
                state.currentPage + 1,
              );
            }
          } else if (state.status == JobsStatus.error) {
            _pagingController.error = state.errorMessage;
          }
        },
        builder: (context, state) {
          return RefreshIndicator(
            onRefresh: () async {
              context.read<JobsBloc>().add(const RefreshJobs());
            },
            child: PagedListView<int, Job>(
              pagingController: _pagingController,
              builderDelegate: PagedChildBuilderDelegate<Job>(
                itemBuilder: (context, job, index) => JobCard(
                  job: job,
                  onTap: () => context.push(
                    RouteNames.jobDetail.replaceAll(':id', job.id),
                  ),
                ),
                firstPageProgressIndicatorBuilder: (_) =>
                    const Center(child: CircularProgressIndicator()),
                newPageProgressIndicatorBuilder: (_) =>
                    const Center(child: CircularProgressIndicator()),
                firstPageErrorIndicatorBuilder: (context) => ErrorWidget(
                  message: _pagingController.error.toString(),
                  onRetry: () => _pagingController.refresh(),
                ),
                noItemsFoundIndicatorBuilder: (_) => const EmptyStateWidget(
                  title: 'No jobs found',
                  subtitle: 'Try adjusting your filters',
                  icon: Icons.search_off,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 🔄 6. State Management

### BLoC Pattern

```dart
// Example: Jobs State
part of 'jobs_bloc.dart';

enum JobsStatus { initial, loading, success, error }

class JobsState extends Equatable {
  final JobsStatus status;
  final List<Job> jobs;
  final int currentPage;
  final bool hasReachedMax;
  final JobFilters? filters;
  final String? errorMessage;
  
  const JobsState({
    this.status = JobsStatus.initial,
    this.jobs = const [],
    this.currentPage = 1,
    this.hasReachedMax = false,
    this.filters,
    this.errorMessage,
  });
  
  JobsState copyWith({
    JobsStatus? status,
    List<Job>? jobs,
    int? currentPage,
    bool? hasReachedMax,
    JobFilters? filters,
    String? errorMessage,
  }) {
    return JobsState(
      status: status ?? this.status,
      jobs: jobs ?? this.jobs,
      currentPage: currentPage ?? this.currentPage,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
      filters: filters ?? this.filters,
      errorMessage: errorMessage,
    );
  }
  
  @override
  List<Object?> get props => [
    status,
    jobs,
    currentPage,
    hasReachedMax,
    filters,
    errorMessage,
  ];
}
```

---

## 🎨 7. UI Components

### Reusable Widgets

```dart
// lib/core/widgets/loading_widget.dart

class LoadingWidget extends StatelessWidget {
  const LoadingWidget({super.key});
  
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }
}

// lib/core/widgets/error_widget.dart

class ErrorWidget extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  
  const ErrorWidget({
    super.key,
    required this.message,
    this.onRetry,
  });
  
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: AppColors.error.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: onRetry,
                child: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// lib/core/widgets/empty_state_widget.dart

class EmptyStateWidget extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback? onAction;
  final String? actionLabel;
  
  const EmptyStateWidget({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.onAction,
    this.actionLabel,
  });
  
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 64,
              color: AppColors.textHint,
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            if (onAction != null && actionLabel != null) ...[
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onAction,
                child: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

---

## 🧪 8. Testing

### Unit Test Example
```dart
// test/features/auth/domain/usecases/login_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:dartz/dartz.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late LoginUseCase useCase;
  late MockAuthRepository mockRepository;
  
  setUp(() {
    mockRepository = MockAuthRepository();
    useCase = LoginUseCase(mockRepository);
  });
  
  const tEmail = 'test@example.com';
  const tPassword = 'password123';
  const tUserType = UserType.applicant;
  
  final tUser = User(
    id: '1',
    name: 'Test User',
    email: tEmail,
    type: tUserType,
  );
  
  test('should login and return user', () async {
    // Arrange
    when(mockRepository.login(
      identifier: anyNamed('identifier'),
      password: anyNamed('password'),
      userType: anyNamed('userType'),
    )).thenAnswer((_) async => Right(tUser));
    
    // Act
    final result = await useCase(const LoginParams(
      identifier: tEmail,
      password: tPassword,
      userType: tUserType,
    ));
    
    // Assert
    expect(result, Right(tUser));
    verify(mockRepository.login(
      identifier: tEmail,
      password: tPassword,
      userType: tUserType,
    ));
    verifyNoMoreInteractions(mockRepository);
  });
}
```

### Widget Test Example
```dart
// test/features/auth/presentation/screens/login_screen_test.dart

void main() {
  testWidgets('login screen displays correctly', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: BlocProvider<AuthBloc>.value(
          value: MockAuthBloc(),
          child: const LoginScreen(),
        ),
      ),
    );
    
    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Email or Phone'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
  });
}
```

---

## 📱 9. Build & Deploy

### Android
```bash
# Debug
flutter run

# Release APK
flutter build apk --release

# Release App Bundle
flutter build appbundle --release

# With specific flavor
flutter build apk --release --flavor production
```

### iOS
```bash
# Debug
flutter run

# Release
flutter build ios --release

# Archive for App Store
flutter build ipa --release
```

### Environment-specific Builds
```bash
# Development
flutter run --dart-define=ENV=development

# Staging
flutter build apk --dart-define=ENV=staging

# Production
flutter build appbundle --dart-define=ENV=production
```

---

## 🚀 Quick Start Checklist

- [ ] Clone and setup Flutter project
- [ ] Add dependencies
- [ ] Create folder structure
- [ ] Implement API service
- [ ] Implement Auth feature
- [ ] Implement Jobs feature
- [ ] Setup navigation
- [ ] Create UI screens
- [ ] Add state management
- [ ] Test on devices
- [ ] Build and deploy

---

**End of Implementation Guide**
