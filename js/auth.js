// Authentication Page Functionality - Enhanced with Services

document.addEventListener('DOMContentLoaded', initAuthPage);

function initAuthPage() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        initLoginForm();
    }
    
    if (signupForm) {
        initSignupForm();
    }

    // Check if user is already logged in
    if (StorageService.isAuthenticated() && !loginForm && !signupForm) {
        Utils.redirect(CONFIG.ROUTES.DASHBOARD);
    }
}

/**
 * Initialize Login Form
 */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const submitBtn = form.querySelector('[type="submit"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Add real-time validation feedback
    emailInput?.addEventListener('blur', () => {
        const validation = ValidationService.validateEmail(emailInput.value);
        updateFieldState(emailInput, validation.isValid, validation.errors[0]);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = document.getElementById('remember')?.checked || false;
        
        // Validate form
        const validation = ValidationService.validateLoginForm(email, password);
        if (!validation.isValid) {
            displayFormErrors(validation.errors);
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        try {
            // Call API service
            const response = await ApiService.Auth.login(email, password, remember);
            
            if (response && response.token) {
                // Store auth data
                StorageService.Auth.setAuthToken(response.token);
                StorageService.Auth.setUserData(
                    response.userId || '',
                    email,
                    response.name || email,
                    response.avatar || ''
                );
                StorageService.Auth.setRememberMe(remember);
                
                // Show success
                showSuccessNotification('Login successful! Redirecting...');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = CONFIG.ROUTES.DASHBOARD;
                }, 500);
            }
        } catch (error) {
            handleAuthError(error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Social login handler
    const socialBtn = form.querySelector('.btn-social');
    if (socialBtn) {
        socialBtn.addEventListener('click', () => {
            showErrorNotification('Social login is coming soon');
        });
    }
}

/**
 * Initialize Signup Form
 */
function initSignupForm() {
    const form = document.getElementById('signupForm');
    const submitBtn = form.querySelector('[type="submit"]');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthMeter = document.getElementById('passwordStrength');

    // Real-time password strength indicator
    if (passwordInput && passwordStrengthMeter) {
        passwordInput.addEventListener('input', () => {
            const validation = ValidationService.validatePassword(passwordInput.value);
            updatePasswordStrength(passwordStrengthMeter, validation.strength);
        });
    }

    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', () => {
            const validation = ValidationService.validatePasswordMatch(
                passwordInput.value,
                confirmPasswordInput.value
            );
            updateFieldState(confirmPasswordInput, validation.isValid, validation.errors[0]);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate form
        const validation = ValidationService.validateSignupForm(
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        );

        if (!validation.isValid) {
            displayFormErrors(validation.errors);
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        try {
            // Call API service
            const response = await ApiService.Auth.signup(firstName, lastName, email, password);
            
            if (response && response.token) {
                // Store auth data
                StorageService.Auth.setAuthToken(response.token);
                StorageService.Auth.setUserData(
                    response.userId || '',
                    email,
                    `${firstName} ${lastName}`,
                    response.avatar || ''
                );
                
                // Show success
                showSuccessNotification('Account created successfully! Redirecting...');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = CONFIG.ROUTES.DASHBOARD;
                }, 500);
            }
        } catch (error) {
            handleAuthError(error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Update field state with validation feedback
 */
function updateFieldState(input, isValid, errorMessage) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.error-message');
    
    if (isValid) {
        formGroup?.classList.remove('error');
        formGroup?.classList.add('success');
        if (errorElement) errorElement.textContent = '';
    } else {
        formGroup?.classList.remove('success');
        formGroup?.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage || 'Invalid input';
    }
}

/**
 * Update password strength meter
 */
function updatePasswordStrength(meter, strength) {
    const percentages = {
        weak: 33,
        medium: 66,
        strong: 100
    };

    const colors = {
        weak: '#ef4444',
        medium: '#f59e0b',
        strong: '#10b981'
    };

    if (meter) {
        meter.style.width = percentages[strength] + '%';
        meter.style.backgroundColor = colors[strength];
    }
}

/**
 * Display form errors
 */
function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
            updateFieldState(input, false, errors[fieldName]);
        }
    });
}

/**
 * Handle authentication errors
 */
function handleAuthError(error) {
    console.error('Auth error:', error);
    
    if (error instanceof ApiError) {
        if (error.status === 400) {
            if (error.data.field) {
                const input = document.getElementById(error.data.field);
                if (input) {
                    updateFieldState(input, false, error.message);
                }
            } else {
                showErrorNotification(error.message);
            }
        } else if (error.status === 401) {
            showErrorNotification('Invalid email or password');
        } else if (error.status === 409) {
            showErrorNotification('Email already registered. Please login.');
        } else {
            showErrorNotification(error.message);
        }
    } else {
        showErrorNotification('An error occurred. Please try again.');
    }
}

/**
 * Show error notification (using Toast if available, otherwise alert)
 */
function showErrorNotification(message) {
    if (window.Toast && Toast.error) {
        Toast.error(message);
    } else {
        alert('❌ ' + message);
    }
}

/**
 * Show success notification (using Toast if available, otherwise alert)
 */
function showSuccessNotification(message) {
    if (window.Toast && Toast.success) {
        Toast.success(message);
    } else {
        alert('✅ ' + message);
    }
}

console.log('🔐 Auth module initialized');
