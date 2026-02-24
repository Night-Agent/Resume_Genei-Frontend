// Main Homepage Functionality - Enhanced with Services

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    initScrollAnimations();
    initStatCounters();
    initSmoothScrolling();
    initMobileMenu();
    initScrollToTop();
});

/**
 * Check authentication status and update UI
 */
function checkAuthStatus() {
    const isAuthenticated = StorageService.isAuthenticated();
    const loginBtn = document.querySelector('.login-btn');
    const dashboardBtn = document.querySelector('.dashboard-btn');
    
    if (isAuthenticated) {
        // User is logged in - show dashboard button
        if (loginBtn) loginBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'flex';
    } else {
        // User is logged out - show login button
        if (loginBtn) loginBtn.style.display = 'flex';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
    }
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const selectorsToObserve = [
        '.feature-card',
        '.step-card',
        '.testimonial-card',
        '.stat-card',
        '.about-stat-card'
    ];

    selectorsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
    });
}

/**
 * Initialize animated stat counters
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, suffix = '') => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // Parse the number and suffix
                if (text.includes('K+')) {
                    const num = parseInt(text.replace('K+', ''));
                    animateCounter(element, num, 'K+');
                } else if (text.includes('%')) {
                    const num = parseInt(text.replace('%', ''));
                    animateCounter(element, num, '%');
                } else if (text.includes('+')) {
                    const num = parseInt(text.replace('+', ''));
                    animateCounter(element, num, '+');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                Utils.smoothScroll(target);
            }
        });
    });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        });
    }
}

/**
 * Initialize scroll-to-top button
 */
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('title', 'Back to top');
    scrollBtn.style.display = 'none';
    document.body.appendChild(scrollBtn);
    
    const throttledScroll = Utils.throttle(() => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    }, 200);
    
    window.addEventListener('scroll', throttledScroll);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Handle CTA button clicks
 */
document.addEventListener('click', (e) => {
    if (e.target.closest('.cta-button')) {
        const uploadSection = document.querySelector('.upload-section');
        if (uploadSection) {
            Utils.smoothScroll(uploadSection);
        }
    }
});

console.log('🏠 Main homepage module initialized');
