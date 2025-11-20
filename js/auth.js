// Authentication Page Functionality
const loginForm = document.getElementById('loginForm');

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember')?.checked || false;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        try {
            // Backend API call should replace this
            const response = await fakeLoginAPI(email, password, remember);
            
            if (response.success) {
                // Store auth token (replace with actual backend response)
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userEmail', email);
                
                // Show success message
                alert('Login successful! Redirecting to dashboard...');
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Fake API function (Backend team will replace this)
async function fakeLoginAPI(email, password, remember) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful login
            resolve({
                success: true,
                token: 'fake-jwt-token-' + Date.now(),
                message: 'Login successful'
            });
        }, 1500);
    });
}

// Social Login Handler
const socialBtn = document.querySelector('.btn-social');
if (socialBtn) {
    socialBtn.addEventListener('click', () => {
        alert('Social login will be implemented by backend team');
        // Backend team should implement OAuth flow here
    });
}

console.log('🔐 Auth module initialized');
