// Match Report Page Functionality

let skillsDistChart = null;
let salaryChart = null;
let skillsGapChart = null;

// Salary data by skill (industry averages)
const skillSalaryData = {
    'JavaScript': { min: 70000, max: 120000 },
    'React': { min: 75000, max: 130000 },
    'Python': { min: 80000, max: 140000 },
    'Node.js': { min: 75000, max: 125000 },
    'AWS': { min: 90000, max: 150000 },
    'Docker': { min: 85000, max: 135000 },
    'Kubernetes': { min: 95000, max: 160000 },
    'GraphQL': { min: 80000, max: 130000 },
    'TypeScript': { min: 75000, max: 130000 },
    'MongoDB': { min: 70000, max: 120000 },
    'PostgreSQL': { min: 75000, max: 125000 },
    'Redis': { min: 80000, max: 130000 },
    'Jenkins': { min: 85000, max: 135000 },
    'Git': { min: 65000, max: 110000 },
    'CI/CD': { min: 85000, max: 140000 },
    'Microservices': { min: 90000, max: 150000 },
    'REST API': { min: 70000, max: 120000 },
    'Agile': { min: 70000, max: 120000 },
    'TDD': { min: 75000, max: 125000 },
    'DevOps': { min: 90000, max: 145000 }
};

// Calculate salary estimates
function calculateSalaryEstimate(skills) {
    let totalMin = 60000; // Base salary
    let totalMax = 90000;
    
    skills.forEach(skill => {
        if (skillSalaryData[skill]) {
            totalMin += skillSalaryData[skill].min * 0.1;
            totalMax += skillSalaryData[skill].max * 0.1;
        }
    });
    
    return {
        min: Math.round(totalMin),
        max: Math.round(totalMax)
    };
}

// Load match report data
async function loadMatchReport() {
    try {
        const matchReportData = localStorage.getItem('matchReport');

        if (!matchReportData) {
            toast.error('No match report found. Please generate a report first.');
            setTimeout(() => {
                window.location.href = 'job-description.html';
            }, 2000);
            return;
        }

        const report = JSON.parse(matchReportData);

        // Display report date
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Display overall score with animation
        displayOverallScore(report.overallScore);

        // Display experience match
        displayExperienceMatch(report.experienceMatch);

        // Display skills comparison
        displaySkillsComparison(report);

        // Display keyword analysis
        displayKeywordAnalysis(report.keywordAnalysis);

        // Render charts
        renderCharts(report);

        // Display suggestions
        renderSuggestions(report.suggestions, 'suggestionsList');

        // Update suggestion count
        document.getElementById('suggestionCount').textContent = report.suggestions.length;

    } catch (error) {
        console.error('Error loading match report:', error);
        toast.error('Failed to load match report. Please try again.');
    }
}

// Display overall score
function displayOverallScore(score) {
    // Animate score circle
    animateScoreCircle('scoreCircle', score, 2000);

    // Display interpretation
    const interpretation = getScoreInterpretation(score);
    const interpretationEl = document.getElementById('scoreInterpretation');
    interpretationEl.textContent = interpretation.text;
    interpretationEl.style.color = interpretation.color;
}

// Display experience match
function displayExperienceMatch(experienceMatch) {
    const badge = document.getElementById('experienceBadge');
    const details = document.getElementById('experienceDetails');

    // Set badge
    badge.className = `match-badge match-badge-${experienceMatch.level}`;
    badge.innerHTML = `
        <span class="badge-dot"></span>
        <span class="badge-text">${experienceMatch.level.toUpperCase()} MATCH</span>
    `;

    // Set details
    details.innerHTML = `<p>${experienceMatch.details}</p>`;
}

// Display skills comparison
function displaySkillsComparison(report) {
    // Matched skills
    renderSkillChips(report.matchedSkills, 'matchedSkills', 'matched');
    document.getElementById('matchedCount').textContent = report.matchedSkills.length;

    // Missing skills
    renderSkillChips(report.missingSkills, 'missingSkills', 'missing');
    document.getElementById('missingCount').textContent = report.missingSkills.length;

    // Extra skills
    renderSkillChips(report.extraSkills, 'extraSkills', 'extra');
    document.getElementById('extraCount').textContent = report.extraSkills.length;
}

// Display keyword analysis
function displayKeywordAnalysis(keywordAnalysis) {
    document.getElementById('keywordsFound').textContent = keywordAnalysis.found.length;
    document.getElementById('keywordsMissing').textContent = keywordAnalysis.missing.length;
    document.getElementById('keywordMatchRate').textContent = `${keywordAnalysis.matchRate}%`;

    const keywordList = document.getElementById('keywordList');
    keywordList.innerHTML = '';

    // Found keywords
    if (keywordAnalysis.found.length > 0) {
        const foundSection = document.createElement('div');
        foundSection.className = 'keyword-section';
        foundSection.innerHTML = `
            <h4 class="keyword-section-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 4L6 11L3 8" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Keywords Found
            </h4>
            <div class="keyword-tags">
                ${keywordAnalysis.found.map(kw => `<span class="keyword-tag keyword-found">${kw}</span>`).join('')}
            </div>
        `;
        keywordList.appendChild(foundSection);
    }

    // Missing keywords
    if (keywordAnalysis.missing.length > 0) {
        const missingSection = document.createElement('div');
        missingSection.className = 'keyword-section';
        missingSection.innerHTML = `
            <h4 class="keyword-section-title">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Keywords to Add
            </h4>
            <div class="keyword-tags">
                ${keywordAnalysis.missing.map(kw => `<span class="keyword-tag keyword-missing">${kw}</span>`).join('')}
            </div>
        `;
        keywordList.appendChild(missingSection);
    }
}

// Render all charts
function renderCharts(report) {
    // Skills Distribution Pie Chart
    renderSkillsDistributionChart(report);
    
    // Salary Impact Chart
    renderSalaryImpactChart(report);
    
    // Skills Gap Bar Chart
    renderSkillsGapChart(report);
}

// Render skills distribution pie chart
function renderSkillsDistributionChart(report) {
    const ctx = document.getElementById('skillsDistributionChart');
    if (!ctx) return;

    // Destroy existing chart
    if (skillsDistChart) {
        skillsDistChart.destroy();
    }

    const matchedCount = report.matchedSkills.length;
    const missingCount = report.missingSkills.length;
    const extraCount = report.extraSkills.length;

    skillsDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Matched Skills', 'Missing Skills', 'Additional Skills'],
            datasets: [{
                data: [matchedCount, missingCount, extraCount],
                backgroundColor: [
                    '#059669', // Green for matched
                    '#dc2626', // Red for missing
                    '#2563eb'  // Blue for extra
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Render salary impact chart
function renderSalaryImpactChart(report) {
    const ctx = document.getElementById('salaryImpactChart');
    if (!ctx) return;

    // Destroy existing chart
    if (salaryChart) {
        salaryChart.destroy();
    }

    // Calculate current salary based on matched skills
    const currentSalary = calculateSalaryEstimate(report.matchedSkills);
    
    // Calculate potential salary with missing skills added
    const allSkills = [...report.matchedSkills, ...report.missingSkills];
    const potentialSalary = calculateSalaryEstimate(allSkills);

    // Calculate increase
    const increaseMin = potentialSalary.min - currentSalary.min;
    const increaseMax = potentialSalary.max - currentSalary.max;
    const increaseAvg = Math.round((increaseMin + increaseMax) / 2);
    const increasePercent = Math.round((increaseAvg / ((currentSalary.min + currentSalary.max) / 2)) * 100);

    // Update salary legend
    document.getElementById('currentSalary').textContent = 
        `$${currentSalary.min.toLocaleString()} - $${currentSalary.max.toLocaleString()}`;
    document.getElementById('potentialSalary').textContent = 
        `$${potentialSalary.min.toLocaleString()} - $${potentialSalary.max.toLocaleString()}`;
    document.getElementById('salaryIncrease').textContent = 
        `+$${increaseAvg.toLocaleString()} (+${increasePercent}%)`;

    salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current Skills', 'With Missing Skills'],
            datasets: [
                {
                    label: 'Min Salary',
                    data: [currentSalary.min, potentialSalary.min],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 2
                },
                {
                    label: 'Max Salary',
                    data: [currentSalary.max, potentialSalary.max],
                    backgroundColor: '#34d399',
                    borderColor: '#10b981',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        },
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    },
                    grid: {
                        color: '#e5e7eb'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: '600'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Render skills gap bar chart
function renderSkillsGapChart(report) {
    const ctx = document.getElementById('skillsGapChart');
    if (!ctx) return;

    // Destroy existing chart
    if (skillsGapChart) {
        skillsGapChart.destroy();
    }

    // Get top 10 missing skills with demand scores
    const missingSkillsWithDemand = report.missingSkills
        .map(skill => ({
            name: skill,
            demand: skillSalaryData[skill] ? 
                Math.round((skillSalaryData[skill].max - skillSalaryData[skill].min) / 1000) : 
                50 + Math.random() * 30
        }))
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 10);

    const labels = missingSkillsWithDemand.map(s => s.name);
    const demandData = missingSkillsWithDemand.map(s => s.demand);

    skillsGapChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Market Demand Score',
                data: demandData,
                backgroundColor: demandData.map((value, index) => {
                    // Color gradient based on demand
                    if (value > 70) return '#dc2626'; // High demand - red
                    if (value > 50) return '#f59e0b'; // Medium demand - orange
                    return '#3b82f6'; // Low demand - blue
                }),
                borderColor: '#374151',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    },
                    grid: {
                        color: '#e5e7eb'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: '600',
                            size: 11
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x;
                            let priority = 'Low';
                            if (value > 70) priority = 'High';
                            else if (value > 50) priority = 'Medium';
                            return `Demand Score: ${value} (${priority} Priority)`;
                        }
                    }
                }
            }
        }
    });
}

// Download PDF report
document.getElementById('downloadReportBtn')?.addEventListener('click', async () => {
    try {
        loader.show('Generating PDF report...');

        // Backend team will implement this
        // GET /api/reports/:id/pdf or POST /api/reports/generate-pdf
        await new Promise(resolve => setTimeout(resolve, 2000));

        loader.hide();
        toast.success('PDF report downloaded successfully!');

        // Simulate download
        // In production, this would be:
        // window.location.href = `${API_BASE_URL}/reports/${reportId}/download`;

    } catch (error) {
        console.error('Error downloading report:', error);
        loader.hide();
        toast.error('Failed to download report. Please try again.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMatchReport();
});

console.log('📊 Match Report module initialized');
