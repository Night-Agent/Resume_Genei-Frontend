// Centralized Storage Service for localStorage management

const StorageService = (() => {
    const KEYS = {
        AUTH_TOKEN: 'authToken',
        USER_EMAIL: 'userEmail',
        USER_ID: 'userId',
        USER_NAME: 'userName',
        USER_AVATAR: 'userAvatar',
        REMEMBER_ME: 'rememberMe',
        CURRENT_RESUME_ID: 'currentResumeId',
        CURRENT_JOB_ID: 'currentJobId',
        PARSED_RESUME_DATA: 'parsedResumeData',
        JOB_ANALYSIS_DATA: 'jobAnalysisData',
        THEME_PREFERENCE: 'themePreference',
        LANGUAGE_PREFERENCE: 'languagePreference',
        LAST_SYNC: 'lastSync'
    };

    /**
     * Authentication related storage
     */
    const Auth = {
        setAuthToken: (token) => {
            localStorage.setItem(KEYS.AUTH_TOKEN, token);
        },

        getAuthToken: () => {
            return localStorage.getItem(KEYS.AUTH_TOKEN);
        },

        setUserData: (userId, email, name, avatar) => {
            localStorage.setItem(KEYS.USER_ID, userId);
            localStorage.setItem(KEYS.USER_EMAIL, email);
            localStorage.setItem(KEYS.USER_NAME, name);
            localStorage.setItem(KEYS.USER_AVATAR, avatar);
        },

        getUserData: () => {
            return {
                userId: localStorage.getItem(KEYS.USER_ID),
                email: localStorage.getItem(KEYS.USER_EMAIL),
                name: localStorage.getItem(KEYS.USER_NAME),
                avatar: localStorage.getItem(KEYS.USER_AVATAR)
            };
        },

        setRememberMe: (remember) => {
            localStorage.setItem(KEYS.REMEMBER_ME, JSON.stringify(remember));
        },

        getRememberMe: () => {
            return JSON.parse(localStorage.getItem(KEYS.REMEMBER_ME) || 'false');
        },

        clearAuth: () => {
            localStorage.removeItem(KEYS.AUTH_TOKEN);
            localStorage.removeItem(KEYS.USER_ID);
            localStorage.removeItem(KEYS.USER_EMAIL);
            localStorage.removeItem(KEYS.USER_NAME);
            localStorage.removeItem(KEYS.USER_AVATAR);
            localStorage.removeItem(KEYS.REMEMBER_ME);
        },

        isAuthenticated: () => {
            return !!localStorage.getItem(KEYS.AUTH_TOKEN);
        }
    };

    /**
     * Resume and Job related storage
     */
    const Document = {
        setCurrentResumeId: (resumeId) => {
            localStorage.setItem(KEYS.CURRENT_RESUME_ID, resumeId);
        },

        getCurrentResumeId: () => {
            return localStorage.getItem(KEYS.CURRENT_RESUME_ID);
        },

        setCurrentJobId: (jobId) => {
            localStorage.setItem(KEYS.CURRENT_JOB_ID, jobId);
        },

        getCurrentJobId: () => {
            return localStorage.getItem(KEYS.CURRENT_JOB_ID);
        },

        setParsedResumeData: (data) => {
            localStorage.setItem(KEYS.PARSED_RESUME_DATA, JSON.stringify(data));
        },

        getParsedResumeData: () => {
            const data = localStorage.getItem(KEYS.PARSED_RESUME_DATA);
            return data ? JSON.parse(data) : null;
        },

        setJobAnalysisData: (data) => {
            localStorage.setItem(KEYS.JOB_ANALYSIS_DATA, JSON.stringify(data));
        },

        getJobAnalysisData: () => {
            const data = localStorage.getItem(KEYS.JOB_ANALYSIS_DATA);
            return data ? JSON.parse(data) : null;
        },

        clearDocuments: () => {
            localStorage.removeItem(KEYS.CURRENT_RESUME_ID);
            localStorage.removeItem(KEYS.CURRENT_JOB_ID);
            localStorage.removeItem(KEYS.PARSED_RESUME_DATA);
            localStorage.removeItem(KEYS.JOB_ANALYSIS_DATA);
        }
    };

    /**
     * User preferences
     */
    const Preferences = {
        setTheme: (theme) => {
            localStorage.setItem(KEYS.THEME_PREFERENCE, theme);
        },

        getTheme: () => {
            return localStorage.getItem(KEYS.THEME_PREFERENCE) || 'light';
        },

        setLanguage: (language) => {
            localStorage.setItem(KEYS.LANGUAGE_PREFERENCE, language);
        },

        getLanguage: () => {
            return localStorage.getItem(KEYS.LANGUAGE_PREFERENCE) || 'en';
        },

        setLastSync: (timestamp) => {
            localStorage.setItem(KEYS.LAST_SYNC, timestamp);
        },

        getLastSync: () => {
            return localStorage.getItem(KEYS.LAST_SYNC);
        }
    };

    /**
     * Generic methods
     */
    function setItem(key, value) {
        const storageKey = KEYS[key] || key;
        localStorage.setItem(storageKey, JSON.stringify(value));
    }

    function getItem(key) {
        const storageKey = KEYS[key] || key;
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : null;
    }

    function removeItem(key) {
        const storageKey = KEYS[key] || key;
        localStorage.removeItem(storageKey);
    }

    function clear() {
        localStorage.clear();
    }

    // Expose shortcuts
    function getAuthToken() {
        return localStorage.getItem(KEYS.AUTH_TOKEN);
    }

    function clearAuth() {
        Auth.clearAuth();
    }

    function isAuthenticated() {
        return Auth.isAuthenticated();
    }

    return {
        Auth,
        Document,
        Preferences,
        setItem,
        getItem,
        removeItem,
        clear,
        getAuthToken,
        clearAuth,
        isAuthenticated,
        KEYS
    };
})();
