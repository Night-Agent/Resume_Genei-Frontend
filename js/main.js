// Main Homepage Functionality

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initStatCounters();
    initSmoothScrolling();
    checkAuthStatus();
});

// Check authentication status and update UI
function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    const loginBtn = document.querySelector('.login-btn');
    const dashboardBtn = document.querySelector('.dashboard-btn');
    
    if (authToken) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'flex';
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'flex';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
    }
}

// Initialize scroll animations
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

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Observe step cards
    document.querySelectorAll('.step-card').forEach(card => {
        observer.observe(card);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });

    // Observe stat cards
    document.querySelectorAll('.stat-card, .about-stat-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize stat counters with animation
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
                } else {
                    const num = parseInt(text.replace('+', ''));
                    animateCounter(element, num, '+');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu toggle (if needed in future)
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Scroll to top button (if needed)
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.display = 'none';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle CTA button clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.cta-button')) {
        const uploadSection = document.querySelector('.upload-section');
        if (uploadSection) {
            uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

console.log('🏠 Main homepage module initialized');
