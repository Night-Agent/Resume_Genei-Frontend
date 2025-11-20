// Skill Chip Component

/**
 * Creates a skill chip element
 * @param {string} skillName - The name of the skill
 * @param {string} type - Type of chip: 'matched', 'missing', 'extra', 'default'
 * @returns {HTMLElement} - The skill chip element
 */
function createSkillChip(skillName, type = 'default') {
    const chip = document.createElement('div');
    chip.className = `skill-chip skill-chip-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'matched':
            icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;
            break;
        case 'missing':
            icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;
            break;
        case 'extra':
            icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>`;
            break;
    }
    
    chip.innerHTML = icon ? `${icon}<span>${skillName}</span>` : `<span>${skillName}</span>`;
    
    return chip;
}

/**
 * Renders multiple skill chips into a container
 * @param {Array<string>} skills - Array of skill names
 * @param {string} containerId - ID of the container element
 * @param {string} type - Type of chips to create
 */
function renderSkillChips(skills, containerId, type = 'default') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="no-data">No skills found</p>';
        return;
    }
    
    skills.forEach(skill => {
        const chip = createSkillChip(skill, type);
        container.appendChild(chip);
    });
}

/**
 * Creates a skill chip with proficiency level
 * @param {string} skillName - The name of the skill
 * @param {number} level - Proficiency level (1-5)
 * @returns {HTMLElement} - The skill chip with level indicator
 */
function createSkillChipWithLevel(skillName, level) {
    const chip = document.createElement('div');
    chip.className = 'skill-chip skill-chip-level';
    
    const stars = Array(5).fill(0).map((_, i) => 
        `<span class="star ${i < level ? 'filled' : ''}">${i < level ? '★' : '☆'}</span>`
    ).join('');
    
    chip.innerHTML = `
        <span class="skill-name">${skillName}</span>
        <div class="skill-level">${stars}</div>
    `;
    
    return chip;
}

console.log('💎 Skill Chip component loaded');
