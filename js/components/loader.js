// Loader Component

class Loader {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create loader overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'loader-overlay';
        this.overlay.className = 'loader-overlay';
        this.overlay.innerHTML = `
            <div class="loader-container">
                <div class="loader-spinner">
                    <svg viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
                    </svg>
                </div>
                <div class="loader-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    /**
     * Shows the loader with optional message
     * @param {string} message - Loading message
     */
    show(message = 'Loading...') {
        const textElement = this.overlay.querySelector('.loader-text');
        if (textElement) {
            textElement.textContent = message;
        }
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hides the loader
     */
    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Updates the loader message
     * @param {string} message - New loading message
     */
    updateMessage(message) {
        const textElement = this.overlay.querySelector('.loader-text');
        if (textElement) {
            textElement.textContent = message;
        }
    }
}

/**
 * Creates an inline spinner element
 * @param {number} size - Size in pixels
 * @param {string} color - Spinner color
 * @returns {HTMLElement} - The spinner element
 */
function createInlineSpinner(size = 24, color = '#059669') {
    const spinner = document.createElement('div');
    spinner.className = 'inline-spinner';
    spinner.style.width = `${size}px`;
    spinner.style.height = `${size}px`;
    
    spinner.innerHTML = `
        <svg viewBox="0 0 50 50">
            <circle 
                cx="25" 
                cy="25" 
                r="20" 
                fill="none" 
                stroke="${color}" 
                stroke-width="4"
                stroke-dasharray="80, 200"
                stroke-dashoffset="0"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    `;
    
    return spinner;
}

/**
 * Creates a skeleton loader for content
 * @param {string} type - Skeleton type: 'text', 'card', 'avatar', 'image'
 * @returns {HTMLElement} - The skeleton element
 */
function createSkeleton(type = 'text') {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;
    
    switch(type) {
        case 'text':
            skeleton.style.height = '16px';
            skeleton.style.width = '100%';
            skeleton.style.marginBottom = '8px';
            break;
        case 'card':
            skeleton.innerHTML = `
                <div class="skeleton-header"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            `;
            break;
        case 'avatar':
            skeleton.style.width = '48px';
            skeleton.style.height = '48px';
            skeleton.style.borderRadius = '50%';
            break;
        case 'image':
            skeleton.style.width = '100%';
            skeleton.style.height = '200px';
            skeleton.style.borderRadius = '8px';
            break;
    }
    
    return skeleton;
}

/**
 * Creates a progress bar
 * @param {number} progress - Progress value (0-100)
 * @returns {HTMLElement} - The progress bar element
 */
function createProgressBar(progress = 0) {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressBar.innerHTML = `
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-bar-text">${progress}%</div>
    `;
    
    return progressBar;
}

/**
 * Updates a progress bar
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {number} progress - New progress value (0-100)
 */
function updateProgressBar(progressBar, progress) {
    const fill = progressBar.querySelector('.progress-bar-fill');
    const text = progressBar.querySelector('.progress-bar-text');
    
    if (fill) {
        fill.style.width = `${progress}%`;
    }
    if (text) {
        text.textContent = `${progress}%`;
    }
}

// Create global loader instance
const loader = new Loader();

console.log('⏳ Loader component loaded');
