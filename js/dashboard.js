// Dashboard Page Functionality

// Check if user is authenticated
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load user data
async function loadUserData() {
    try {
        // Backend API call should replace this
        const userData = await fakeUserDataAPI();
        
        // Update user info in the page
        const userInfo = document.querySelector('.user-info h1');
        const userEmail = document.querySelector('.user-info p');
        
        if (userInfo) userInfo.textContent = userData.name;
        if (userEmail) userEmail.textContent = userData.email;
        
        // Update stats
        updateDashboardStats(userData.stats);
        
        // Load recent resumes
        loadRecentResumes(userData.resumes);
        
    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Failed to load user data. Please try again.');
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const statCards = document.querySelectorAll('.stat-card-value');
    if (statCards.length >= 3) {
        statCards[0].textContent = stats.resumesAnalyzed || '0';
        statCards[1].textContent = stats.avgScore || '0/10';
        statCards[2].textContent = stats.activeVersions || '0';
    }
}

// Load recent resumes
function loadRecentResumes(resumes) {
    const resumeList = document.querySelector('.resume-list');
    if (!resumeList || !resumes) return;
    
    // Clear existing items (except templates)
    resumeList.innerHTML = '';
    
    // Add resume items
    resumes.forEach(resume => {
        const resumeItem = createResumeItem(resume);
        resumeList.appendChild(resumeItem);
    });
}

// Create resume item element
function createResumeItem(resume) {
    const div = document.createElement('div');
    div.className = 'resume-item';
    div.innerHTML = `
        <div class="resume-item-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#d1fae5"/>
                <path d="M18 15H27L33 21V33H18V15Z" stroke="#059669" stroke-width="2"/>
                <path d="M27 15V21H33" stroke="#059669" stroke-width="2"/>
            </svg>
        </div>
        <div class="resume-item-info">
            <div class="resume-item-name">${resume.name}</div>
            <div class="resume-item-date">${resume.updatedAt}</div>
        </div>
        <div class="resume-item-score">${resume.score}</div>
    `;
    
    // Add click handler to view resume details
    div.addEventListener('click', () => {
        viewResumeDetails(resume.id);
    });
    
    return div;
}

// View resume details
function viewResumeDetails(resumeId) {
    // Backend team should implement this
    alert(`Viewing resume ${resumeId}. Backend will load resume details.`);
}

// Fake API function for user data (Backend team will replace this)
async function fakeUserDataAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'John Doe',
                email: localStorage.getItem('userEmail') || 'john.doe@example.com',
                stats: {
                    resumesAnalyzed: 12,
                    avgScore: '8.5/10',
                    activeVersions: 5
                },
                resumes: [
                    {
                        id: 1,
                        name: 'Software Engineer Resume',
                        updatedAt: 'Updated 2 days ago',
                        score: '9.2'
                    },
                    {
                        id: 2,
                        name: 'Product Manager CV',
                        updatedAt: 'Updated 1 week ago',
                        score: '8.7'
                    },
                    {
                        id: 3,
                        name: 'Data Analyst Resume',
                        updatedAt: 'Updated 2 weeks ago',
                        score: '7.9'
                    }
                ]
            });
        }, 500);
    });
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Initialize dashboard
if (checkAuth()) {
    document.addEventListener('DOMContentLoaded', () => {
        loadUserData();
    });
}

console.log('📊 Dashboard module initialized');
