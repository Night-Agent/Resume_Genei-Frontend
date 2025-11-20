// Previous Reports Page Functionality

// Check authentication
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load previous reports
async function loadPreviousReports() {
    try {
        loader.show('Loading reports...');

        const authToken = localStorage.getItem('authToken');

        // Backend team will replace this with actual API call
        // GET /api/reports with Authorization header
        const reports = await fakeReportsAPI(authToken);

        displayReports(reports);

        loader.hide();

    } catch (error) {
        console.error('Error loading reports:', error);
        loader.hide();
        toast.error('Failed to load reports. Please try again.');
    }
}

// Display reports grid
function displayReports(reports) {
    const reportsGrid = document.getElementById('reportsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!reports || reports.length === 0) {
        reportsGrid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    reportsGrid.innerHTML = '';
    reportsGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    reports.forEach(report => {
        const reportCard = createReportCard(report);
        reportsGrid.appendChild(reportCard);
    });
}

// Create report card
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';

    // Score color
    let scoreClass = 'score-low';
    if (report.score >= 80) scoreClass = 'score-high';
    else if (report.score >= 60) scoreClass = 'score-medium';

    card.innerHTML = `
        <div class="report-card-header-row">
            <div class="report-score ${scoreClass}">
                ${report.score}
            </div>
            <div class="report-date">${formatDate(report.createdAt)}</div>
        </div>
        <div class="report-card-body">
            <h3 class="report-title">${report.jobTitle}</h3>
            <div class="report-meta">
                <span class="report-meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    ${formatTimeAgo(report.createdAt)}
                </span>
                <span class="report-meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M2 7h12" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    ${report.resumeName}
                </span>
            </div>
            <div class="report-skills-preview">
                <span class="skills-matched">✓ ${report.matchedSkills} skills matched</span>
                <span class="skills-missing">× ${report.missingSkills} skills missing</span>
            </div>
        </div>
        <div class="report-card-footer">
            <button class="btn-secondary btn-sm" onclick="viewReport('${report.id}')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                View Report
            </button>
            <button class="btn-icon" onclick="downloadReport('${report.id}')" title="Download PDF">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 10v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2M8 10V2M8 10l-3-3M8 10l3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="btn-icon" onclick="deleteReport('${report.id}')" title="Delete Report">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M5.5 4V2.5A1.5 1.5 0 0 1 7 1h2a1.5 1.5 0 0 1 1.5 1.5V4m2 0v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;

    return card;
}

// View report
function viewReport(reportId) {
    // Store report ID and redirect to match-report page
    localStorage.setItem('viewingReportId', reportId);
    window.location.href = 'match-report.html';
}

// Download report
async function downloadReport(reportId) {
    try {
        loader.show('Downloading report...');

        // Backend team will implement this
        // GET /api/reports/:id/download
        await new Promise(resolve => setTimeout(resolve, 1500));

        loader.hide();
        toast.success('Report downloaded successfully!');

    } catch (error) {
        console.error('Error downloading report:', error);
        loader.hide();
        toast.error('Failed to download report. Please try again.');
    }
}

// Delete report
async function deleteReport(reportId) {
    const confirmed = confirm('Are you sure you want to delete this report? This action cannot be undone.');

    if (!confirmed) return;

    try {
        loader.show('Deleting report...');

        // Backend team will implement this
        // DELETE /api/reports/:id
        await new Promise(resolve => setTimeout(resolve, 1000));

        loader.hide();
        toast.success('Report deleted successfully!');

        // Reload reports
        loadPreviousReports();

    } catch (error) {
        console.error('Error deleting report:', error);
        loader.hide();
        toast.error('Failed to delete report. Please try again.');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format time ago
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const reportCards = document.querySelectorAll('.report-card');

    reportCards.forEach(card => {
        const title = card.querySelector('.report-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Sort functionality
document.getElementById('sortSelect')?.addEventListener('change', async (e) => {
    const sortBy = e.target.value;
    // In production, this would trigger a new API call with sort parameter
    toast.info(`Sorting by: ${sortBy}`);
    // For now, just show a message
});

// Fake Reports API (Backend team will replace)
async function fakeReportsAPI(authToken) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'report-1',
                    jobTitle: 'Senior Software Engineer',
                    resumeName: 'John_Doe_Resume_v3.pdf',
                    score: 78,
                    matchedSkills: 9,
                    missingSkills: 2,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'report-2',
                    jobTitle: 'Full Stack Developer',
                    resumeName: 'John_Doe_Resume_v2.pdf',
                    score: 85,
                    matchedSkills: 12,
                    missingSkills: 1,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'report-3',
                    jobTitle: 'DevOps Engineer',
                    resumeName: 'John_Doe_Resume_v1.pdf',
                    score: 62,
                    matchedSkills: 6,
                    missingSkills: 5,
                    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]);
        }, 1500);
    });
}

// Initialize
if (checkAuth()) {
    document.addEventListener('DOMContentLoaded', () => {
        loadPreviousReports();
    });
}

console.log('📂 Previous Reports module initialized');
