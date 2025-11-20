# File Organization Guide

## 📋 Complete File Structure

```
Project- Frontend/
│
├── 📄 index.html                  # Main homepage (landing page with all sections)
├── 📄 styles.css                  # Complete stylesheet (1223 lines, responsive)
├── 📄 script.js                   # Legacy JavaScript (will be deprecated)
├── 📄 README.md                   # Backend integration documentation
├── 📄 FILE_STRUCTURE.md           # This file
│
├── 📁 components/                 # Reusable UI Components
│   ├── header.html               # Navigation header (logo, nav links, login/dashboard buttons)
│   └── footer.html               # Footer (brand, links, copyright)
│
├── 📁 pages/                      # Separate Application Pages
│   ├── upload.html               # Dedicated resume upload page
│   ├── login.html                # User authentication page
│   └── dashboard.html            # User dashboard (protected, requires auth)
│
└── 📁 js/                         # Modular JavaScript Files
    ├── loader.js                 # Component loading system (header/footer injection)
    ├── main.js                   # Homepage-specific functionality (animations, stats)
    ├── upload.js                 # File upload, drag-drop, validation
    ├── auth.js                   # Authentication logic (login, logout, token management)
    └── dashboard.js              # Dashboard data loading, resume list
```

---

## 📄 File Purposes & Responsibilities

### **Root Level Files**

#### `index.html` (825 lines)
**Purpose:** Main landing page  
**Contains:**
- Hero section with CTA
- Stats showcase (50K+ users, 98% success, etc.)
- Resume upload area
- 6 feature cards (AI Analysis, ATS Optimization, etc.)
- "How It Works" (3-step process with illustrations)
- About/Testimonials section (6 cards with avatars)
- 5 stats cards (resume analyzed, avg score, etc.)
- Login and Dashboard modals (deprecated, now separate pages)

**Dependencies:**
- `styles.css` - All styling
- `js/loader.js` - Loads header/footer components
- `js/main.js` - Homepage animations & interactions
- `js/upload.js` - File upload functionality
- `script.js` - Legacy code (to be removed)

**Backend Needs:**
- None (static landing page)

---

#### `styles.css` (1223 lines)
**Purpose:** Complete application styling  
**Contains:**
- CSS custom properties (color scheme)
- Global resets & base styles
- Header & navigation styles
- Hero section styles
- Feature cards with hover effects (scale 1.05)
- Upload area styling
- Testimonials grid (auto-fit minmax 350px)
- Stats cards layout (repeat 5, 1fr)
- Footer styles
- Modal styles (login, dashboard)
- Responsive breakpoints (1024px, 768px)

**Color Scheme:**
```css
--primary: #059669     (emerald green)
--secondary: #10b981   (lighter green)
--accent: #34d399      (mint green)
--bg-light: #d1fae5    (very light green)
```

**Backend Needs:**
- None (static CSS)

---

#### `script.js` (Legacy)
**Purpose:** Original monolithic JavaScript  
**Status:** Being deprecated/replaced by modular JS files  
**Contains:**
- Old upload logic
- Modal handlers
- Form validation

**Action Required:**
- ⚠️ Will be removed once all functionality is moved to modular files
- Currently still loaded for backward compatibility

---

### **Components Directory**

#### `components/header.html`
**Purpose:** Reusable navigation header  
**Used On:** All pages (index, upload, login, dashboard)  
**Contains:**
- Logo with SVG gradient
- Navigation links (Features, How It Works, About)
- Login button (redirects to `pages/login.html`)
- Dashboard button (redirects to `pages/dashboard.html`, shown when authenticated)

**Loading Method:**
```javascript
// From index.html
loadComponent('header-placeholder', 'components/header.html');

// From pages/*.html
loadComponent('header-placeholder', '../components/header.html');
```

**Backend Needs:**
- None (static component, auth state managed by JS)

---

#### `components/footer.html`
**Purpose:** Reusable footer  
**Used On:** All pages  
**Contains:**
- Brand section with logo
- Link columns (Product, Company, Support)
- Copyright text

**Backend Needs:**
- None (static component)

---

### **Pages Directory**

#### `pages/upload.html`
**Purpose:** Standalone resume upload page  
**Features:**
- Full-page upload interface
- Drag-and-drop area
- File validation display
- "Analyze Resume" button
- Feature highlights

**Dependencies:**
- `../styles.css`
- `../js/loader.js` (loads header/footer)
- `../js/upload.js` (handles file logic)

**Backend Integration:**
- **POST** `/api/resume/upload` (multipart/form-data)
- **POST** `/api/resume/analyze/{analysisId}`

**User Flow:**
1. User drags/selects file
2. Frontend validates (PDF/DOC/DOCX, <10MB)
3. File preview shown
4. Click "Analyze Resume"
5. Upload to backend
6. Redirect to results page (to be created)

---

#### `pages/login.html`
**Purpose:** User authentication  
**Features:**
- Email/password inputs
- "Remember me" checkbox
- "Forgot password?" link
- Social login option (Google)
- Sign up link

**Dependencies:**
- `../styles.css`
- `../js/loader.js`
- `../js/auth.js`

**Backend Integration:**
- **POST** `/api/auth/login`
- Request: `{ email, password }`
- Response: `{ success, token, user }`

**User Flow:**
1. User enters credentials
2. Frontend validates (email format, not empty)
3. Submit to backend
4. Store JWT in `localStorage.authToken`
5. Redirect to dashboard

---

#### `pages/dashboard.html`
**Purpose:** User profile & resume management  
**Features:**
- User info display (name, email, avatar)
- 3 stat cards (resumes analyzed, avg score, active versions)
- Resume list with scores
- "Upload New Resume" button

**Dependencies:**
- `../styles.css`
- `../js/loader.js`
- `../js/dashboard.js`

**Backend Integration:**
- **GET** `/api/user/dashboard` (requires auth token)
- **GET** `/api/resume/{resumeId}` (for viewing details)

**User Flow:**
1. Page loads, checks `localStorage.authToken`
2. If no token → redirect to login
3. Fetch user data from backend
4. Display stats and resume list
5. Click resume → view details

**Protected Route:**
```javascript
function checkAuth() {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
```

---

### **JavaScript Directory**

#### `js/loader.js`
**Purpose:** Dynamic component loading system  
**Functions:**
- `loadComponent(placeholderId, componentPath)` - Fetches and injects HTML
- `initializeNavigation()` - Sets up click handlers for nav links

**How It Works:**
```javascript
async function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    const response = await fetch(componentPath);
    const html = await response.text();
    placeholder.innerHTML = html;
}
```

**Auto-loads on every page:**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header-placeholder', detectPath('header.html'));
    await loadComponent('footer-placeholder', detectPath('footer.html'));
    initializeNavigation();
});
```

**Backend Needs:**
- None (client-side only)

---

#### `js/main.js`
**Purpose:** Homepage-specific functionality  
**Features:**
- Scroll animations (fade-in-up on scroll)
- Stat counter animations (50K+ → animated counting)
- Smooth scrolling for anchor links
- Auth status check (show/hide login vs dashboard button)

**Functions:**
- `initScrollAnimations()` - Observes elements entering viewport
- `initStatCounters()` - Animates numbers from 0 to target
- `initSmoothScrolling()` - Handles # anchor links
- `checkAuthStatus()` - Shows correct nav buttons based on login state

**Backend Needs:**
- None (UI animations only)

---

#### `js/upload.js`
**Purpose:** File upload & validation  
**Features:**
- Drag-and-drop file handling
- File type validation (PDF, DOC, DOCX only)
- File size validation (max 10MB)
- File preview display
- Analyze button handler

**Key Functions:**
```javascript
function handleFileSelect(file) {
    // Validates file
    // Shows preview with filename, size, icon
}

function formatFileSize(bytes) {
    // Converts bytes to KB/MB
}
```

**Backend Integration Point:**
```javascript
analyzeBtn.addEventListener('click', async () => {
    // TODO: Backend team replace this
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    
    const result = await response.json();
    // Handle response
});
```

**Backend Needs:**
- **POST** `/api/resume/upload` endpoint
- Accept multipart/form-data
- Return `{ success, resumeId, analysisId }`

---

#### `js/auth.js`
**Purpose:** Authentication logic  
**Features:**
- Login form submission
- Token storage
- OAuth preparation
- Loading states

**Key Functions:**
```javascript
// Placeholder - Backend team will replace
async function fakeLoginAPI(email, password) {
    return {
        success: true,
        token: 'fake-jwt-token',
        user: { name: 'John Doe', email }
    };
}
```

**Real Implementation:**
```javascript
async function loginUser(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        window.location.href = 'dashboard.html';
    }
}
```

**Backend Needs:**
- **POST** `/api/auth/login`
- **POST** `/api/auth/register` (for sign up)
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/oauth/google` (for social login)

---

#### `js/dashboard.js`
**Purpose:** Dashboard data management  
**Features:**
- Auth check on page load
- User data fetching
- Resume list display
- Stat updates
- Logout functionality

**Key Functions:**
```javascript
function checkAuth() {
    // Redirects to login if no token
}

async function loadUserData() {
    // Fetches from backend
    // Updates UI with user info, stats, resumes
}

async function fakeUserDataAPI() {
    // Placeholder - Backend replaces this
}
```

**Backend Needs:**
- **GET** `/api/user/dashboard`
- **GET** `/api/resume/{resumeId}`
- Header: `Authorization: Bearer {token}`

---

## 🔄 Component Relationships

```
┌─────────────┐
│ index.html  │ (Homepage)
├─────────────┤
│ Uses:       │
│ - styles.css│
│ - loader.js │───┐
│ - main.js   │   │
│ - upload.js │   ├──> Loads header.html, footer.html
│ - script.js │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│ login.html  │───┤
├─────────────┤   │
│ Uses:       │   │
│ - auth.js   │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│ upload.html │───┤
├─────────────┤   │
│ Uses:       │   │
│ - upload.js │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│dashboard.html───┘
├─────────────┤
│ Uses:       │
│ - dashboard.js
└─────────────┘
```

---

## 🎯 Quick Reference for Backend Team

### What to Replace
1. **js/auth.js** → `fakeLoginAPI()` function
2. **js/upload.js** → Analyze button click handler (line ~80)
3. **js/dashboard.js** → `fakeUserDataAPI()` function

### API Base URL
Add this to all JS files:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Change for production
```

### Testing Checklist
- [ ] Login works with real credentials
- [ ] Token stored in localStorage
- [ ] Dashboard loads user data
- [ ] File upload sends to backend
- [ ] Logout clears token and redirects
- [ ] Protected routes redirect if not authenticated

---

**Document Version:** 1.0  
**Last Updated:** January 2025
