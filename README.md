# ResumeAI - Backend Integration Guide

## 📁 Project Structure

```
Project- Frontend/
│
├── index.html                     # Main homepage (landing page)
├── styles.css                     # Main stylesheet (1223 lines)
├── styles-additional.css          # Additional styles for new features (2000+ lines)
├── script.js                      # Legacy script (deprecated)
├── README.md                      # Backend integration guide (this file)
├── IMPLEMENTATION_SUMMARY.md      # Complete feature documentation
├── FILE_STRUCTURE.md              # File organization guide
│
├── components/                    # Reusable UI components
│   ├── header.html               # Navigation header (used on all pages)
│   └── footer.html               # Footer (used on all pages)
│
├── pages/                        # Individual application pages
│   ├── login.html                # User authentication page
│   ├── signup.html               # ✨ NEW: User registration
│   ├── dashboard.html            # User dashboard (protected route)
│   ├── upload.html               # Resume upload interface
│   ├── parsed-resume.html        # ✨ NEW: Resume preview after parsing
│   ├── job-description.html      # ✨ NEW: Job description input & analysis
│   ├── match-report.html         # ✨ NEW: Comprehensive match report
│   └── previous-reports.html     # ✨ NEW: Historical reports view
│
└── js/                           # Modular JavaScript files
    ├── loader.js                 # Component loading system
    ├── main.js                   # Homepage functionality
    ├── auth.js                   # Authentication logic
    ├── upload.js                 # File upload handling (updated)
    ├── dashboard.js              # Dashboard functionality (updated)
    ├── resume-preview.js         # ✨ NEW: Resume preview controller
    ├── job-analysis.js           # ✨ NEW: Job description analysis
    ├── match-report.js           # ✨ NEW: Match report rendering
    ├── previous-reports.js       # ✨ NEW: Reports history management
    │
    └── components/               # UI component modules
        ├── skill-chip.js         # ✨ NEW: Skill badge component
        ├── score-circle.js       # ✨ NEW: Circular progress indicator
        ├── suggestions-card.js   # ✨ NEW: Suggestion cards
        ├── toast.js              # ✨ NEW: Toast notifications
        └── loader.js             # ✨ NEW: Loading overlays & spinners
```

---

## 🔌 Backend Integration Points

### 1. Authentication API

**File:** `js/auth.js`  
**Function to Replace:** `fakeLoginAPI(email, password)`

#### Current Implementation (Placeholder)
```javascript
async function fakeLoginAPI(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                token: 'fake-jwt-token-12345',
                user: {
                    name: 'John Doe',
                    email: email
                }
            });
        }, 1000);
    });
}
```

#### Expected Backend Endpoint
- **POST** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "token": "jwt-token-here",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
  ```
- **Error Response (401):**
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

#### Frontend Storage
- Token stored in `localStorage.getItem('authToken')`
- Email stored in `localStorage.getItem('userEmail')`

---

### 2. Resume Upload API

**File:** `js/upload.js`  
**Function to Replace:** Inside `analyzeBtn.addEventListener('click', async () => {...})`

#### Current Implementation (Placeholder)
```javascript
// Simulate API call
await new Promise(resolve => setTimeout(resolve, 2000));
alert('Resume analyzed successfully! Backend will provide actual analysis.');
```

#### Expected Backend Endpoint
- **POST** `/api/resume/upload`
- **Request:** `multipart/form-data`
  ```
  file: [Binary File Data]
  userId: "user-uuid" (from auth token)
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "resumeId": "resume-uuid",
    "analysisId": "analysis-uuid",
    "message": "Resume uploaded successfully",
    "nextStep": "/api/resume/analyze/{analysisId}"
  }
  ```
- **Error Response (400):**
  ```json
  {
    "success": false,
    "message": "Invalid file format. Only PDF, DOC, DOCX allowed"
  }
  ```

#### File Validation (Frontend)
- **Allowed formats:** `.pdf`, `.doc`, `.docx`
- **Max size:** 10 MB (10,485,760 bytes)
- Validation happens before upload in `handleFileSelect()` function

---

### 3. Resume Analysis API

**Expected Endpoint:** `/api/resume/analyze/{analysisId}`  
**Method:** POST or GET (depending on design)

#### Expected Response
```json
{
  "success": true,
  "analysis": {
    "score": 8.5,
    "strengths": [
      "Strong technical skills section",
      "Quantified achievements",
      "Clear job progression"
    ],
    "improvements": [
      "Add more action verbs",
      "Include metrics in project descriptions",
      "Optimize for ATS keywords"
    ],
    "keywords": {
      "matched": ["JavaScript", "React", "Node.js"],
      "missing": ["Docker", "CI/CD", "Kubernetes"]
    },
    "formatting": {
      "score": 9.0,
      "issues": []
    }
  }
}
```

---

### 4. Dashboard Data API

**File:** `js/dashboard.js`  
**Function to Replace:** `fakeUserDataAPI()`

#### Current Implementation (Placeholder)
```javascript
async function fakeUserDataAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'John Doe',
                email: 'john.doe@example.com',
                stats: { resumesAnalyzed: 12, avgScore: '8.5/10', activeVersions: 5 },
                resumes: [...]
            });
        }, 500);
    });
}
```

#### Expected Backend Endpoint
- **GET** `/api/user/dashboard`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://cdn.example.com/avatars/user.jpg"
    },
    "stats": {
      "resumesAnalyzed": 12,
      "avgScore": "8.5/10",
      "activeVersions": 5
    },
    "resumes": [
      {
        "id": "resume-uuid-1",
        "name": "Software Engineer Resume",
        "score": "9.2",
        "updatedAt": "2025-01-20T14:30:00Z",
        "status": "analyzed"
      },
      {
        "id": "resume-uuid-2",
        "name": "Product Manager CV",
        "score": "8.7",
        "updatedAt": "2025-01-13T10:15:00Z",
        "status": "analyzed"
      }
    ]
  }
  ```

---

### 5. Resume Details API

**File:** `js/dashboard.js`  
**Function:** `viewResumeDetails(resumeId)`

#### Expected Backend Endpoint
- **GET** `/api/resume/{resumeId}`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "resume": {
      "id": "resume-uuid",
      "name": "Software Engineer Resume",
      "fileName": "resume.pdf",
      "fileUrl": "https://storage.example.com/resumes/...",
      "uploadedAt": "2025-01-20T14:30:00Z",
      "score": 9.2,
      "analysis": {
        "strengths": [...],
        "improvements": [...],
        "keywords": {...}
      }
    }
  }
  ```

---

### 6. Resume Parsing API (NEW)

**File:** `js/resume-preview.js`  
**Function to Replace:** `fakeResumeParseAPI()`

#### Expected Backend Endpoint
- **POST** `/api/resume/parse`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Request Body:**
  ```json
  {
    "resumeId": "resume-uuid"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "personal": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "location": "San Francisco, CA"
      },
      "skills": ["JavaScript", "Python", "React", "Node.js"],
      "experience": [
        {
          "title": "Senior Software Engineer",
          "company": "Tech Corp",
          "duration": "2021 - Present",
          "description": "Led development of microservices...",
          "achievements": ["Improved performance by 40%"]
        }
      ],
      "education": [
        {
          "degree": "BS Computer Science",
          "institution": "Stanford University",
          "year": "2019",
          "gpa": "3.8"
        }
      ],
      "certifications": ["AWS Certified Solutions Architect"],
      "projects": [
        {
          "name": "E-commerce Platform",
          "description": "Built scalable e-commerce platform",
          "technologies": ["React", "Node.js", "MongoDB"],
          "link": "https://github.com/..."
        }
      ]
    }
  }
  ```

---

### 7. Job Description Analysis API (NEW)

**File:** `js/job-analysis.js`  
**Function to Replace:** `fakeJobParseAPI()`

#### Expected Backend Endpoint
- **POST** `/api/job/parse`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Request Body:**
  ```json
  {
    "jobDescription": "Full job posting text..."
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "analysis": {
      "title": "Senior Software Engineer",
      "skills": ["JavaScript", "React", "AWS", "Docker"],
      "experienceRequired": "5+ years",
      "responsibilities": [
        "Design and develop scalable microservices",
        "Mentor junior developers",
        "Lead technical architecture decisions"
      ],
      "keywords": ["Agile", "Microservices", "Cloud", "CI/CD"]
    }
  }
  ```

---

### 8. Match Score API (NEW)

**File:** `js/job-analysis.js`  
**Function to Replace:** `fakeMatchScoreAPI()`

#### Expected Backend Endpoint
- **POST** `/api/match/score`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Request Body:**
  ```json
  {
    "resumeId": "resume-uuid",
    "jobAnalysis": {
      "title": "Senior Software Engineer",
      "skills": ["JavaScript", "React", "AWS"],
      "experienceRequired": "5+ years"
    }
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "report": {
      "overallScore": 78,
      "experienceMatch": {
        "level": "high",
        "details": "Your 6 years of experience aligns well with the 5+ requirement"
      },
      "matchedSkills": ["JavaScript", "React", "Python"],
      "missingSkills": ["Kubernetes", "GraphQL"],
      "extraSkills": ["Docker", "MongoDB", "TypeScript"],
      "keywordAnalysis": {
        "found": ["Agile", "Cloud", "Microservices"],
        "missing": ["DevOps", "TDD"],
        "matchRate": 67
      },
      "suggestions": [
        {
          "title": "Add Kubernetes Experience",
          "description": "The job requires Kubernetes expertise...",
          "priority": "high",
          "action": "Add container orchestration projects to your resume"
        },
        {
          "title": "Highlight GraphQL Experience",
          "description": "GraphQL is listed as a key skill...",
          "priority": "medium",
          "action": "Include GraphQL in your tech stack"
        }
      ]
    }
  }
  ```

---

### 9. Previous Reports API (NEW)

**File:** `js/previous-reports.js`  
**Function to Replace:** `fakeReportsAPI()`

#### Expected Backend Endpoint
- **GET** `/api/reports`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Query Parameters:** `?page=1&limit=10&sort=recent` (optional)
- **Success Response (200):**
  ```json
  {
    "success": true,
    "reports": [
      {
        "id": "report-uuid-1",
        "jobTitle": "Senior Software Engineer",
        "resumeName": "John_Resume_v3.pdf",
        "score": 78,
        "matchedSkills": 9,
        "missingSkills": 2,
        "createdAt": "2025-11-18T10:30:00Z"
      },
      {
        "id": "report-uuid-2",
        "jobTitle": "Full Stack Developer",
        "resumeName": "John_Resume_v2.pdf",
        "score": 82,
        "matchedSkills": 11,
        "missingSkills": 1,
        "createdAt": "2025-11-15T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalReports": 25
    }
  }
  ```

---

### 10. Get Single Report API (NEW)

**File:** `js/previous-reports.js`  
**Function:** `viewReport(reportId)`

#### Expected Backend Endpoint
- **GET** `/api/reports/{reportId}`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Success Response (200):** Same as Match Score API response

---

### 11. Download Report PDF API (NEW)

**File:** `js/match-report.js` and `js/previous-reports.js`  
**Function:** `downloadReport(reportId)`

#### Expected Backend Endpoint
- **GET** `/api/reports/{reportId}/download`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Success Response (200):** Binary PDF file
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="match-report-{reportId}.pdf"`

---

### 12. Delete Report API (NEW)

**File:** `js/previous-reports.js`  
**Function:** `deleteReport(reportId)`

#### Expected Backend Endpoint
- **DELETE** `/api/reports/{reportId}`
- **Headers:** `Authorization: Bearer {jwt-token}`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Report deleted successfully"
  }
  ```

---

### 13. User Signup API (NEW)

**File:** `pages/signup.html` (inline script)  
**Function to Replace:** `fakeSignupAPI()`

#### Expected Backend Endpoint
- **POST** `/api/auth/signup`
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "success": true,
    "token": "jwt-token-here",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "message": "Account created successfully"
  }
  ```
- **Error Response (400):**
  ```json
  {
    "success": false,
    "message": "Email already exists"
  }
  ```

---

## 🔐 Authentication Flow

1. **User Login:** `pages/login.html` → `js/auth.js`
2. **User Signup:** `pages/signup.html` → POST `/api/auth/signup`
3. **Token Storage:** Stored in `localStorage.authToken`
4. **Protected Routes:** `dashboard.html` checks for token in `checkAuth()` function
5. **Token Expiry:** Backend should return 401 on expired tokens → Frontend redirects to login
6. **Logout:** Clears localStorage and redirects to `login.html`

---

## 🚀 Component Loading System

All pages use dynamic header/footer loading via `js/loader.js`:

```javascript
// Automatically loads components on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header-placeholder', '../components/header.html');
    await loadComponent('footer-placeholder', '../components/footer.html');
});
```

### Path Resolution
- **Root pages** (index.html): Use `components/header.html`
- **Nested pages** (/pages/): Use `../components/header.html`

---

## 📊 Status Codes & Error Handling

### Expected HTTP Status Codes
- `200` - Success
- `201` - Resource created (e.g., new resume uploaded)
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal server error

### Frontend Error Handling Pattern
```javascript
try {
    const response = await fetch('/api/endpoint', {...});
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    
    // Success handling
} catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
}
```

---

## 🎨 Design System (Colors)

The frontend uses a **green (emerald)** color scheme:

```css
:root {
    --primary: #059669;      /* Primary green */
    --primary-dark: #047857; /* Darker green for hover */
    --secondary: #10b981;    /* Secondary green */
    --accent: #34d399;       /* Accent green */
    --bg-light: #d1fae5;     /* Light green background */
    --bg-dark: #ecfdf5;      /* Very light green */
}
```

---

## 📝 Next Steps for Backend Team

### Phase 1: Core Authentication & User Management
1. **Set up CORS:** Allow frontend origin `http://localhost:3000` (or production domain)
2. **JWT Authentication:** Implement token-based auth with expiry (recommended: 24h)
3. **Implement APIs:**
   - POST `/api/auth/signup` - User registration
   - POST `/api/auth/login` - User login
   - GET `/api/user/dashboard` - Dashboard data

### Phase 2: Resume Upload & Parsing (AI/ML Integration)
4. **File Storage:** Set up cloud storage (AWS S3, Cloudinary, etc.) for resume uploads
5. **Resume Parser:** Integrate AI/ML service to extract:
   - Personal information (name, email, phone, location)
   - Skills array
   - Work experience (title, company, duration, achievements)
   - Education (degree, institution, GPA, year)
   - Certifications
   - Projects (name, description, technologies, links)
6. **Implement APIs:**
   - POST `/api/resume/upload` - File upload (multipart/form-data)
   - POST `/api/resume/parse` - Extract structured data from resume

### Phase 3: Job Description Analysis (AI/ML Integration)
7. **Job Parser:** Implement NLP to extract:
   - Job title
   - Required skills
   - Experience requirements
   - Key responsibilities
   - Important keywords
8. **Implement API:**
   - POST `/api/job/parse` - Analyze job description

### Phase 4: Matching Algorithm (Core AI Feature)
9. **Scoring Algorithm:** Develop matching logic to calculate:
   - Overall match score (0-100)
   - Experience match level (high/medium/low)
   - Skill comparison (matched/missing/extra)
   - Keyword analysis (found/missing/match rate)
   - AI-generated suggestions with priorities
10. **Implement API:**
    - POST `/api/match/score` - Generate comprehensive match report

### Phase 5: Reports Management
11. **Database Schema:**
    - Users table (id, name, email, password_hash, created_at)
    - Resumes table (id, user_id, file_name, file_url, parsed_data, created_at)
    - Job_Analyses table (id, user_id, job_description, parsed_data, created_at)
    - Match_Reports table (id, user_id, resume_id, job_analysis_id, score, report_data, created_at)
12. **Implement APIs:**
    - GET `/api/reports` - List all user reports (with pagination)
    - GET `/api/reports/{id}` - Get single report details
    - GET `/api/reports/{id}/download` - Download PDF report
    - DELETE `/api/reports/{id}` - Delete report
13. **PDF Generation:** Implement PDF export for match reports

### Additional Features
14. **Rate Limiting:** Implement rate limits (e.g., 100 requests/hour per user)
15. **API Documentation:** Create OpenAPI/Swagger docs for all endpoints
16. **Webhooks (Optional):** Notify frontend when AI analysis completes (if async processing)
17. **Email Service:** Send report summaries via email (optional)

### Estimated Timeline
- **Phase 1:** 2-3 days
- **Phase 2:** 3-5 days (depends on AI integration complexity)
- **Phase 3:** 2-3 days
- **Phase 4:** 4-7 days (core ML work)
- **Phase 5:** 3-4 days
- **Total:** 14-22 days for complete backend implementation

---

## 🧪 Testing the Integration

### Manual Testing
1. **Start backend server:** Ensure it's running on `http://localhost:5000` (or update frontend API base URL)
2. **Update API URLs:** Replace `fakeLoginAPI` with `fetch('http://localhost:5000/api/auth/login', {...})`
3. **Test login flow:** Try valid/invalid credentials
4. **Test file upload:** Upload a PDF resume
5. **Test dashboard:** Verify user data loads correctly

### Frontend API Configuration
Add this to `js/auth.js` and other modules:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Update for production

async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}
```

---

## 📞 Questions or Issues?

Contact the frontend team if you need:
- Changes to expected response formats
- Additional frontend validation
- New UI components
- WebSocket integration for real-time updates

---

**Last Updated:** November 21, 2025  
**Frontend Version:** 2.0 - Complete Resume Screening & Job Match System  
**Maintained By:** Frontend Team

---

## 🎉 Frontend Implementation Status

✅ **Complete Features:**
- Authentication system (login, signup)
- Dashboard with quick actions
- Resume upload with drag-and-drop
- Resume parsing and preview
- Job description input and analysis
- Comprehensive match report with:
  - Animated score circle (0-100)
  - Experience match badge
  - Skills comparison (matched/missing/extra)
  - Keyword analysis
  - AI-generated suggestions
- Previous reports management (view/download/delete)
- 5 reusable UI components (SkillChip, ScoreCircle, SuggestionsCard, Toast, Loader)
- Mobile responsive design
- Modern, professional UI with emerald green theme

✅ **All placeholder APIs documented** - Backend team can search for:
- `fakeLoginAPI()` in `js/auth.js`
- `fakeSignupAPI()` in `pages/signup.html`
- `fakeResumeParseAPI()` in `js/resume-preview.js`
- `fakeJobParseAPI()` in `js/job-analysis.js`
- `fakeMatchScoreAPI()` in `js/job-analysis.js`
- `fakeReportsAPI()` in `js/previous-reports.js`
- `fakeUserDataAPI()` in `js/dashboard.js`

📚 **Additional Documentation:**
- See `IMPLEMENTATION_SUMMARY.md` for complete feature overview
- See `FILE_STRUCTURE.md` for detailed file organization

---