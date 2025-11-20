// Score Circle Component

/**
 * Animates a circular progress indicator
 * @param {string} circleId - ID of the SVG circle element
 * @param {number} score - Score value (0-100)
 * @param {number} duration - Animation duration in milliseconds
 */
function animateScoreCircle(circleId, score, duration = 2000) {
    const circle = document.querySelector(`#${circleId} .score-progress`);
    const scoreNumber = document.getElementById('scoreNumber');
    
    if (!circle || !scoreNumber) return;
    
    const radius = 85;
    const circumference = 2 * Math.PI * radius; // ≈ 534.07
    
    // Set initial state
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    // Calculate target offset
    const targetOffset = circumference - (score / 100) * circumference;
    
    // Animate circle
    const startTime = performance.now();
    
    function updateCircle(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentOffset = circumference - (eased * (circumference - targetOffset));
        circle.style.strokeDashoffset = currentOffset;
        
        // Update number
        const currentScore = Math.floor(eased * score);
        scoreNumber.textContent = currentScore;
        
        if (progress < 1) {
            requestAnimationFrame(updateCircle);
        }
    }
    
    requestAnimationFrame(updateCircle);
}

/**
 * Updates score circle color based on score value
 * @param {number} score - Score value (0-100)
 */
function updateScoreCircleColor(score) {
    const circle = document.querySelector('.score-progress');
    if (!circle) return;
    
    let gradient;
    if (score >= 80) {
        // Green gradient for high scores
        gradient = 'url(#scoreGradientGreen)';
    } else if (score >= 60) {
        // Yellow gradient for medium scores
        gradient = 'url(#scoreGradientYellow)';
    } else {
        // Red gradient for low scores
        gradient = 'url(#scoreGradientRed)';
    }
    
    circle.setAttribute('stroke', gradient);
}

/**
 * Creates a mini score circle (for cards/thumbnails)
 * @param {number} score - Score value (0-100)
 * @param {number} size - Size of the circle in pixels
 * @returns {HTMLElement} - The score circle container
 */
function createMiniScoreCircle(score, size = 60) {
    const container = document.createElement('div');
    container.className = 'mini-score-circle';
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    
    const strokeWidth = size * 0.15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    // Determine color based on score
    let color;
    if (score >= 80) color = '#059669';
    else if (score >= 60) color = '#eab308';
    else color = '#dc2626';
    
    container.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle 
                cx="${size/2}" 
                cy="${size/2}" 
                r="${radius}" 
                fill="none" 
                stroke="#ecfdf5" 
                stroke-width="${strokeWidth}"
            />
            <circle 
                cx="${size/2}" 
                cy="${size/2}" 
                r="${radius}" 
                fill="none" 
                stroke="${color}" 
                stroke-width="${strokeWidth}" 
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 ${size/2} ${size/2})"
            />
            <text 
                x="50%" 
                y="50%" 
                text-anchor="middle" 
                dy="0.3em" 
                font-size="${size * 0.35}" 
                font-weight="bold" 
                fill="${color}"
            >${score}</text>
        </svg>
    `;
    
    return container;
}

/**
 * Gets interpretation text based on score
 * @param {number} score - Score value (0-100)
 * @returns {object} - Interpretation with text and color
 */
function getScoreInterpretation(score) {
    if (score >= 90) {
        return {
            text: 'Excellent Match! Your resume aligns perfectly with the job requirements.',
            level: 'excellent',
            color: '#059669'
        };
    } else if (score >= 75) {
        return {
            text: 'Great Match! Your resume shows strong alignment with most requirements.',
            level: 'great',
            color: '#10b981'
        };
    } else if (score >= 60) {
        return {
            text: 'Good Match. Consider adding a few more relevant skills and keywords.',
            level: 'good',
            color: '#eab308'
        };
    } else if (score >= 40) {
        return {
            text: 'Partial Match. Your resume needs significant improvements to meet requirements.',
            level: 'partial',
            color: '#f59e0b'
        };
    } else {
        return {
            text: 'Low Match. Consider updating your resume with relevant skills and experience.',
            level: 'low',
            color: '#dc2626'
        };
    }
}

console.log('⭕ Score Circle component loaded');
