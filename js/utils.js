// Utility Functions and Helpers

const Utils = (() => {
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    /**
     * Throttle function to rate-limit function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Format bytes to human-readable size
     */
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Format date to readable format
     */
    function formatDate(date, format = 'MM/DD/YYYY') {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('MM', month)
            .replace('DD', day)
            .replace('YYYY', year);
    }

    /**
     * Format time difference (e.g., "2 hours ago")
     */
    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        
        return formatDate(date);
    }

    /**
     * Convert percentage to score color
     */
    function getScoreColor(score) {
        if (score >= CONFIG.MATCH_SCORE_EXCELLENT) return CONFIG.SCORE_COLORS.EXCELLENT;
        if (score >= CONFIG.MATCH_SCORE_GOOD) return CONFIG.SCORE_COLORS.GOOD;
        if (score >= CONFIG.MATCH_SCORE_FAIR) return CONFIG.SCORE_COLORS.FAIR;
        return CONFIG.SCORE_COLORS.POOR;
    }

    /**
     * Get score interpretation text
     */
    function getScoreInterpretation(score) {
        if (score >= CONFIG.MATCH_SCORE_EXCELLENT) return 'Excellent Match';
        if (score >= CONFIG.MATCH_SCORE_GOOD) return 'Good Match';
        if (score >= CONFIG.MATCH_SCORE_FAIR) return 'Fair Match';
        return 'Poor Match';
    }

    /**
     * Deep clone object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Check if object is empty
     */
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Merge two objects
     */
    function mergeObjects(obj1, obj2) {
        return { ...obj1, ...obj2 };
    }

    /**
     * Sort array of objects by property
     */
    function sortBy(array, property, ascending = true) {
        return array.sort((a, b) => {
            const aVal = a[property];
            const bVal = b[property];
            
            if (ascending) {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    /**
     * Group array by property
     */
    function groupBy(array, property) {
        return array.reduce((groups, item) => {
            const key = item[property];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }

    /**
     * Filter array by multiple criteria
     */
    function filterBy(array, criteria) {
        return array.filter(item => {
            return Object.keys(criteria).every(key => item[key] === criteria[key]);
        });
    }

    /**
     * Generate unique ID
     */
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Capitalize string
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Slugify string
     */
    function slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScroll(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Copy text to clipboard
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    /**
     * Get URL query parameters
     */
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    /**
     * Build query string from object
     */
    function buildQueryString(params) {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    /**
     * Redirect to URL
     */
    function redirect(url) {
        window.location.href = url;
    }

    /**
     * Safe navigation - redirect if not authenticated
     */
    function requireAuth(redirectUrl = CONFIG.ROUTES.LOGIN) {
        if (!StorageService.isAuthenticated()) {
            redirect(redirectUrl);
            return false;
        }
        return true;
    }

    /**
     * Parse JWT token (without verification)
     */
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Invalid token:', e);
            return null;
        }
    }

    /**
     * Check if JWT token is expired
     */
    function isTokenExpired(token) {
        try {
            const decoded = parseJwt(token);
            if (!decoded || !decoded.exp) return true;
            return decoded.exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    }

    return {
        debounce,
        throttle,
        formatBytes,
        formatDate,
        formatTimeAgo,
        getScoreColor,
        getScoreInterpretation,
        deepClone,
        isEmpty,
        mergeObjects,
        sortBy,
        groupBy,
        filterBy,
        generateId,
        capitalize,
        slugify,
        isInViewport,
        smoothScroll,
        copyToClipboard,
        getQueryParams,
        buildQueryString,
        redirect,
        requireAuth,
        parseJwt,
        isTokenExpired
    };
})();
