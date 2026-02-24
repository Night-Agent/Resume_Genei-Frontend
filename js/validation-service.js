// Form Validation Utilities

const ValidationService = (() => {
    /**
     * Validate email format
     */
    function validateEmail(email) {
        const result = {
            isValid: CONFIG.REGEX.EMAIL.test(email),
            errors: []
        };

        if (!email) {
            result.errors.push('Email is required');
            result.isValid = false;
        } else if (!result.isValid) {
            result.errors.push('Please enter a valid email address');
        }

        return result;
    }

    /**
     * Validate password strength
     */
    function validatePassword(password) {
        const result = {
            isValid: CONFIG.REGEX.PASSWORD.test(password),
            errors: [],
            strength: 'weak'
        };

        if (!password) {
            result.errors.push('Password is required');
            result.isValid = false;
        } else {
            // Check length
            if (password.length < 8) {
                result.errors.push('Password must be at least 8 characters long');
                result.strength = 'weak';
            }

            // Check for uppercase
            if (!/[A-Z]/.test(password)) {
                result.errors.push('Password must contain at least one uppercase letter');
                result.strength = 'weak';
            }

            // Check for lowercase
            if (!/[a-z]/.test(password)) {
                result.errors.push('Password must contain at least one lowercase letter');
                result.strength = 'weak';
            }

            // Check for numbers
            if (!/\d/.test(password)) {
                result.errors.push('Password must contain at least one number');
                result.strength = 'weak';
            }

            // Determine strength
            if (result.errors.length === 0) {
                result.strength = 'strong';
                result.isValid = true;
            } else if (result.errors.length === 1) {
                result.strength = 'medium';
            }
        }

        return result;
    }

    /**
     * Validate if passwords match
     */
    function validatePasswordMatch(password, confirmPassword) {
        const result = {
            isValid: password === confirmPassword,
            errors: []
        };

        if (!confirmPassword) {
            result.errors.push('Please confirm your password');
        } else if (password !== confirmPassword) {
            result.errors.push('Passwords do not match');
        }

        return result;
    }

    /**
     * Validate name (first or last)
     */
    function validateName(name, fieldName = 'Name') {
        const result = {
            isValid: true,
            errors: []
        };

        if (!name || name.trim().length === 0) {
            result.errors.push(`${fieldName} is required`);
            result.isValid = false;
        } else if (name.trim().length < 2) {
            result.errors.push(`${fieldName} must be at least 2 characters long`);
            result.isValid = false;
        } else if (name.length > 50) {
            result.errors.push(`${fieldName} is too long`);
            result.isValid = false;
        }

        return result;
    }

    /**
     * Validate phone number
     */
    function validatePhone(phone) {
        const result = {
            isValid: CONFIG.REGEX.PHONE.test(phone) && phone.replace(/\D/g, '').length >= 10,
            errors: []
        };

        if (!phone) {
            result.errors.push('Phone number is required');
            result.isValid = false;
        } else if (!result.isValid) {
            result.errors.push('Please enter a valid phone number');
        }

        return result;
    }

    /**
     * Validate URL
     */
    function validateUrl(url) {
        const result = {
            isValid: CONFIG.REGEX.URL.test(url) || url.length === 0, // Empty is ok for optional fields
            errors: []
        };

        if (url && !result.isValid) {
            result.errors.push('Please enter a valid URL');
        }

        return result;
    }

    /**
     * Validate file upload
     */
    function validateFile(file) {
        const result = {
            isValid: true,
            errors: []
        };

        if (!file) {
            result.errors.push('Please select a file');
            result.isValid = false;
            return result;
        }

        // Check file type
        if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
            result.errors.push(CONFIG.ERROR_MESSAGES.INVALID_FILE_TYPE);
            result.isValid = false;
        }

        // Check file size
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            result.errors.push(CONFIG.ERROR_MESSAGES.FILE_TOO_LARGE);
            result.isValid = false;
        }

        return result;
    }

    /**
     * Validate textarea input (job description, etc.)
     */
    function validateTextarea(text, minLength = 10, maxLength = 10000) {
        const result = {
            isValid: true,
            errors: [],
            charCount: text ? text.length : 0
        };

        if (!text || text.trim().length === 0) {
            result.errors.push('This field is required');
            result.isValid = false;
        } else if (text.length < minLength) {
            result.errors.push(`Please enter at least ${minLength} characters`);
            result.isValid = false;
        } else if (text.length > maxLength) {
            result.errors.push(`Maximum ${maxLength} characters allowed`);
            result.isValid = false;
        }

        return result;
    }

    /**
     * Validate required field
     */
    function validateRequired(value, fieldName = 'This field') {
        const result = {
            isValid: value && value.toString().trim().length > 0,
            errors: []
        };

        if (!result.isValid) {
            result.errors.push(`${fieldName} is required`);
        }

        return result;
    }

    /**
     * Validate entire login form
     */
    function validateLoginForm(email, password) {
        const errors = {};

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            errors.email = emailValidation.errors[0];
        }

        const passwordValidation = validateRequired(password, 'Password');
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate entire signup form
     */
    function validateSignupForm(firstName, lastName, email, password, confirmPassword) {
        const errors = {};

        const firstNameValidation = validateName(firstName, 'First Name');
        if (!firstNameValidation.isValid) {
            errors.firstName = firstNameValidation.errors[0];
        }

        const lastNameValidation = validateName(lastName, 'Last Name');
        if (!lastNameValidation.isValid) {
            errors.lastName = lastNameValidation.errors[0];
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            errors.email = emailValidation.errors[0];
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        const matchValidation = validatePasswordMatch(password, confirmPassword);
        if (!matchValidation.isValid) {
            errors.confirmPassword = matchValidation.errors[0];
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
            passwordStrength: passwordValidation.strength
        };
    }

    /**
     * Sanitize user input to prevent XSS
     */
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * Validate and sanitize input
     */
    function validateAndSanitize(input, pattern = null) {
        if (pattern && !pattern.test(input)) {
            return {
                isValid: false,
                value: null
            };
        }

        return {
            isValid: true,
            value: sanitizeInput(input)
        };
    }

    return {
        validateEmail,
        validatePassword,
        validatePasswordMatch,
        validateName,
        validatePhone,
        validateUrl,
        validateFile,
        validateTextarea,
        validateRequired,
        validateLoginForm,
        validateSignupForm,
        sanitizeInput,
        validateAndSanitize
    };
})();
