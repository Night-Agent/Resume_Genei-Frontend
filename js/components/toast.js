// Toast Notification Component

class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    /**
     * Shows a toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (0 = permanent)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-enter`;

        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#d1fae5"/>
                        <path d="M14 7l-5 5-3-3" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#fee2e2"/>
                        <path d="M7 7l6 6M13 7l-6 6" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L3 15h14L10 3Z" fill="#fef3c7"/>
                        <path d="M10 8v3" stroke="#eab308" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="10" cy="13" r="0.5" fill="#eab308"/>
                    </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#dbeafe"/>
                        <path d="M10 11v4M10 7h.01" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                    </svg>`
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Trigger entrance animation
        setTimeout(() => {
            toast.classList.remove('toast-enter');
        }, 10);

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * Hides a toast
     * @param {HTMLElement} toast - Toast element to hide
     */
    hide(toast) {
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Shows a success toast
     * @param {string} message - Toast message
     * @param {number} duration - Duration in milliseconds
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Shows an error toast
     * @param {string} message - Toast message
     * @param {number} duration - Duration in milliseconds
     */
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Shows a warning toast
     * @param {string} message - Toast message
     * @param {number} duration - Duration in milliseconds
     */
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Shows an info toast
     * @param {string} message - Toast message
     * @param {number} duration - Duration in milliseconds
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Clears all toasts
     */
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => this.hide(toast));
    }
}

// Create global toast instance
const toast = new Toast();

console.log('🍞 Toast component loaded');
