// Suggestions Card Component

/**
 * Creates a suggestion card element
 * @param {object} suggestion - Suggestion object with title, description, priority
 * @returns {HTMLElement} - The suggestion card element
 */
function createSuggestionCard(suggestion) {
    const card = document.createElement('div');
    card.className = `suggestion-card suggestion-priority-${suggestion.priority || 'medium'}`;
    
    const priorityIcons = {
        high: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L5 9h10l-5-6Z" fill="#dc2626"/>
                    <path d="M10 11v5" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
                </svg>`,
        medium: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3v14M3 10h14" stroke="#eab308" stroke-width="2" stroke-linecap="round"/>
                </svg>`,
        low: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7" stroke="#3b82f6" stroke-width="2"/>
                    <path d="M10 7v6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                </svg>`
    };
    
    const priorityLabels = {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority'
    };
    
    card.innerHTML = `
        <div class="suggestion-header">
            <div class="suggestion-icon">
                ${priorityIcons[suggestion.priority || 'medium']}
            </div>
            <div class="suggestion-title-group">
                <h4>${suggestion.title}</h4>
                <span class="suggestion-priority-label">${priorityLabels[suggestion.priority || 'medium']}</span>
            </div>
        </div>
        <div class="suggestion-body">
            <p>${suggestion.description}</p>
            ${suggestion.action ? `<div class="suggestion-action">${suggestion.action}</div>` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Renders multiple suggestion cards
 * @param {Array<object>} suggestions - Array of suggestion objects
 * @param {string} containerId - ID of the container element
 */
function renderSuggestions(suggestions, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!suggestions || suggestions.length === 0) {
        container.innerHTML = `
            <div class="no-suggestions">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="35" fill="#d1fae5"/>
                    <path d="M28 40l8 8 16-16" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Great Job!</h3>
                <p>Your resume looks excellent. No critical improvements needed at this time.</p>
            </div>
        `;
        return;
    }
    
    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedSuggestions = suggestions.sort((a, b) => {
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    });
    
    sortedSuggestions.forEach(suggestion => {
        const card = createSuggestionCard(suggestion);
        container.appendChild(card);
    });
}

/**
 * Creates a compact suggestion item (for lists)
 * @param {string} text - Suggestion text
 * @param {string} icon - Icon type ('add', 'edit', 'remove')
 * @returns {HTMLElement} - The suggestion item element
 */
function createSuggestionItem(text, icon = 'add') {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    
    const icons = {
        add: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3v10M3 8h10" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
            </svg>`,
        edit: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667l-8.667 8.666-3.666.667.666-3.667L11.333 2Z" stroke="#eab308" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        remove: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4l8 8M12 4l-8 8" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
            </svg>`
    };
    
    item.innerHTML = `
        <div class="suggestion-item-icon">${icons[icon]}</div>
        <div class="suggestion-item-text">${text}</div>
    `;
    
    return item;
}

/**
 * Creates a suggestion category section
 * @param {string} category - Category name
 * @param {Array<string>} items - Array of suggestion texts
 * @returns {HTMLElement} - The category section element
 */
function createSuggestionCategory(category, items) {
    const section = document.createElement('div');
    section.className = 'suggestion-category';
    
    section.innerHTML = `
        <h3 class="suggestion-category-title">${category}</h3>
        <div class="suggestion-category-items"></div>
    `;
    
    const itemsContainer = section.querySelector('.suggestion-category-items');
    
    items.forEach(item => {
        const suggestionItem = createSuggestionItem(item.text, item.icon || 'add');
        itemsContainer.appendChild(suggestionItem);
    });
    
    return section;
}

console.log('💡 Suggestions Card component loaded');
