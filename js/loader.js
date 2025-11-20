// Component Loader - Loads header and footer dynamically
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Load header and footer on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Determine the correct path based on current page location
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../components/' : 'components/';
    
    await loadComponent('header-placeholder', `${basePath}header.html`);
    await loadComponent('footer-placeholder', `${basePath}footer.html`);
    
    // Initialize navigation after loading
    initializeNavigation();
});

function initializeNavigation() {
    // Login button handler
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const isInPages = window.location.pathname.includes('/pages/');
            const loginPath = isInPages ? 'login.html' : 'pages/login.html';
            window.location.href = loginPath;
        });
    }

    // Dashboard button handler
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            const isInPages = window.location.pathname.includes('/pages/');
            const dashboardPath = isInPages ? 'dashboard.html' : 'pages/dashboard.html';
            window.location.href = dashboardPath;
        });
    }
}

// Smooth Scrolling for Navigation Links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Keyboard Shortcuts - Escape to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
});

console.log('✨ Resume Genie loaded successfully!');
