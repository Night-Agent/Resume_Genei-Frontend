// Global Configuration and Constants

const CONFIG = {
    // API Configuration
    API_BASE_URL: localStorage.getItem('apiBaseUrl') || 'http://localhost:5000/api',
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_FILE_EXTENSIONS: ['pdf', 'doc', 'docx'],

    // UI Configuration
    TOAST_DURATION: 3000,
    ANIMATION_DURATION: 300,
    SPINNER_SIZE: 40,

    // Match Report Thresholds
    MATCH_SCORE_EXCELLENT: 90,
    MATCH_SCORE_GOOD: 75,
    MATCH_SCORE_FAIR: 50,
    MATCH_SCORE_POOR: 0,

    // Routes
    ROUTES: {
        HOME: '/',
        LOGIN: '/pages/login.html',
        SIGNUP: '/pages/signup.html',
        DASHBOARD: '/pages/dashboard.html',
        UPLOAD: '/pages/upload.html',
        PARSED_RESUME: '/pages/parsed-resume.html',
        JOB_DESCRIPTION: '/pages/job-description.html',
        MATCH_REPORT: '/pages/match-report.html',
        PREVIOUS_REPORTS: '/pages/previous-reports.html'
    },

    // Feature Flags
    FEATURES: {
        ENABLE_ANALYTICS: true,
        ENABLE_SOCIAL_LOGIN: false,
        ENABLE_PDF_DOWNLOAD: true,
        ENABLE_EMAIL_NOTIFICATIONS: false,
        ENABLE_DARK_MODE: false
    },

    // Error Messages
    ERROR_MESSAGES: {
        INVALID_FILE_TYPE: 'Please upload a PDF or Word document (.pdf, .doc, .docx)',
        FILE_TOO_LARGE: 'File size exceeds 10MB. Please choose a smaller file.',
        UPLOAD_FAILED: 'Failed to upload resume. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        UNAUTHORIZED: 'Your session has expired. Please login again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION_ERROR: 'Please check your input and try again.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
        PASSWORDS_DONT_MATCH: 'Passwords do not match.',
        EMAIL_ALREADY_EXISTS: 'Email already registered. Please login.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        REQUIRED_FIELD: 'This field is required.'
    },

    // Success Messages
    SUCCESS_MESSAGES: {
        LOGIN_SUCCESS: 'Login successful! Redirecting...',
        SIGNUP_SUCCESS: 'Account created! Logging you in...',
        UPLOAD_SUCCESS: 'Resume uploaded successfully!',
        UPDATE_SUCCESS: 'Changes saved successfully!',
        REPORT_GENERATED: 'Report generated successfully!',
        PDF_DOWNLOADED: 'PDF downloaded successfully!'
    },

    // Regular Expressions
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
        PHONE: /^[\d\s\-\+\(\)]+$/,
        URL: /^https?:\/\/.+\..+/,
        ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
        ONLY_LETTERS: /^[a-zA-Z\s]+$/,
        ONLY_NUMBERS: /^[0-9]+$/
    },

    // Skill Badges - Colors
    SKILL_COLORS: {
        MATCHED: '#10b981',      // Green
        MISSING: '#ef4444',      // Red
        ADDITIONAL: '#3b82f6',   // Blue
        RECOMMENDED: '#f59e0b'   // Amber
    },

    // Match Score Colors
    SCORE_COLORS: {
        EXCELLENT: '#10b981',    // Green
        GOOD: '#3b82f6',         // Blue
        FAIR: '#f59e0b',         // Amber
        POOR: '#ef4444'          // Red
    },

    // API Endpoints (keep for reference)
    ENDPOINTS: {
        AUTH_LOGIN: '/auth/login',
        AUTH_SIGNUP: '/auth/signup',
        AUTH_LOGOUT: '/auth/logout',
        AUTH_VALIDATE: '/auth/validate',
        RESUME_UPLOAD: '/resume/upload',
        RESUME_PARSE: '/resume/parse',
        RESUME_GET: '/resume/:id',
        RESUME_LIST: '/resume/list',
        RESUME_DELETE: '/resume/:id',
        JOB_ANALYZE: '/job/analyze',
        MATCH_GENERATE: '/match/generate',
        MATCH_GET: '/match/report/:id',
        MATCH_DOWNLOAD: '/match/report/:id/download',
        MATCH_HISTORY: '/match/history',
        USER_PROFILE: '/user/profile',
        USER_STATS: '/user/stats'
    }
};

// Utility function to set API base URL at runtime
function setApiBaseUrl(url) {
    CONFIG.API_BASE_URL = url;
    localStorage.setItem('apiBaseUrl', url);
}

// Utility function to check if we're in development mode
function isDevelopment() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Utility function to get error message
function getErrorMessage(key, defaultMessage = 'An error occurred') {
    return CONFIG.ERROR_MESSAGES[key] || defaultMessage;
}

// Utility function to get success message
function getSuccessMessage(key, defaultMessage = 'Success') {
    return CONFIG.SUCCESS_MESSAGES[key] || defaultMessage;
}
