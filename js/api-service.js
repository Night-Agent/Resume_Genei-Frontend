// Centralized API Service for all backend calls

const ApiService = (() => {
    const API_BASE_URL = CONFIG.API_BASE_URL;
    const REQUEST_TIMEOUT = CONFIG.REQUEST_TIMEOUT;

    /**
     * Generic fetch wrapper with error handling
     */
    async function request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: REQUEST_TIMEOUT
        };

        // Add auth token if available
        const token = StorageService.getAuthToken();
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), finalOptions.timeout);

            const response = await fetch(url, {
                ...finalOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new ApiError(
                    `API Error: ${response.status}`,
                    response.status,
                    await response.json().catch(() => ({}))
                );
            }

            return await response.json();
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }

    /**
     * Authentication APIs
     */
    const Auth = {
        login: (email, password, remember = false) => {
            return request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, remember })
            });
        },

        signup: (firstName, lastName, email, password) => {
            return request('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ firstName, lastName, email, password })
            });
        },

        logout: () => {
            return request('/auth/logout', { method: 'POST' });
        },

        validateToken: () => {
            return request('/auth/validate', { method: 'POST' });
        }
    };

    /**
     * Resume APIs
     */
    const Resume = {
        upload: (formData) => {
            return request('/resume/upload', {
                method: 'POST',
                body: formData,
                headers: {} // Remove Content-Type for FormData
            });
        },

        parse: (resumeId) => {
            return request(`/resume/parse/${resumeId}`, { method: 'POST' });
        },

        getParsed: (resumeId) => {
            return request(`/resume/${resumeId}`);
        },

        list: () => {
            return request('/resume/list');
        },

        delete: (resumeId) => {
            return request(`/resume/${resumeId}`, { method: 'DELETE' });
        }
    };

    /**
     * Job Description APIs
     */
    const JobDescription = {
        analyze: (jobDescription) => {
            return request('/job/analyze', {
                method: 'POST',
                body: JSON.stringify({ jobDescription })
            });
        },

        getAnalyzed: (jobId) => {
            return request(`/job/${jobId}`);
        }
    };

    /**
     * Match Report APIs
     */
    const MatchReport = {
        generate: (resumeId, jobId) => {
            return request('/match/generate', {
                method: 'POST',
                body: JSON.stringify({ resumeId, jobId })
            });
        },

        getReport: (reportId) => {
            return request(`/match/report/${reportId}`);
        },

        downloadPDF: (reportId) => {
            return request(`/match/report/${reportId}/download`, {
                headers: { 'Accept': 'application/pdf' }
            });
        },

        getHistory: (limit = 10) => {
            return request(`/match/history?limit=${limit}`);
        }
    };

    /**
     * User APIs
     */
    const User = {
        getProfile: () => {
            return request('/user/profile');
        },

        updateProfile: (data) => {
            return request('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        getDashboardStats: () => {
            return request('/user/stats');
        }
    };

    /**
     * Error handling
     */
    function handleApiError(error) {
        if (error instanceof ApiError) {
            const status = error.status;
            if (status === 401) {
                // Unauthorized - redirect to login
                StorageService.clearAuth();
                window.location.href = 'pages/login.html';
            } else if (status === 403) {
                // Forbidden
                showErrorNotification('You do not have permission to perform this action');
            } else if (status === 404) {
                // Not found
                showErrorNotification('Resource not found');
            } else if (status >= 500) {
                // Server error
                showErrorNotification('Server error. Please try again later.');
            }
        } else if (error.name === 'AbortError') {
            showErrorNotification('Request timeout. Please try again.');
        }
    }

    function showErrorNotification(message) {
        // Use your toast notification system
        if (window.Toast) {
            Toast.error(message);
        } else {
            console.error(message);
        }
    }

    return {
        Auth,
        Resume,
        JobDescription,
        MatchReport,
        User,
        request
    };
})();

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}
