// Job Description Analysis Page Functionality

// Character count
const jobDescriptionTextarea = document.getElementById('jobDescription');
const charCount = document.getElementById('charCount');

if (jobDescriptionTextarea && charCount) {
    jobDescriptionTextarea.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
    });
}

// Analyze Job Description button
document.getElementById('analyzeJdBtn')?.addEventListener('click', async () => {
    const jobDescription = document.getElementById('jobDescription').value.trim();

    if (!jobDescription) {
        toast.warning('Please paste a job description first');
        return;
    }

    if (jobDescription.length < 100) {
        toast.warning('Job description seems too short. Please provide more details.');
        return;
    }

    try {
        loader.show('Analyzing job description...');

        // Backend team will replace this with actual API call
        // POST /api/job/parse with body: { jobDescription }
        const analysis = await fakeJobParseAPI(jobDescription);

        // Store analysis in localStorage for match report
        localStorage.setItem('jobAnalysis', JSON.stringify(analysis));

        // Display analysis
        displayJobAnalysis(analysis);

        // Show analysis preview card
        document.getElementById('analysisPreview').style.display = 'block';

        // Scroll to analysis
        document.getElementById('analysisPreview').scrollIntoView({ behavior: 'smooth' });

        loader.hide();
        toast.success('Job description analyzed successfully!');

    } catch (error) {
        console.error('Error analyzing job description:', error);
        loader.hide();
        toast.error('Failed to analyze job description. Please try again.');
    }
});

// Display job analysis
function displayJobAnalysis(analysis) {
    // Job Title
    document.getElementById('jobTitle').textContent = analysis.title || 'Not specified';

    // Required Skills
    renderSkillChips(analysis.skills || [], 'requiredSkills', 'default');

    // Experience Required
    document.getElementById('experienceRequired').textContent = analysis.experienceRequired || 'Not specified';

    // Responsibilities
    const responsibilitiesList = document.getElementById('responsibilities');
    responsibilitiesList.innerHTML = '';
    if (analysis.responsibilities && analysis.responsibilities.length > 0) {
        analysis.responsibilities.forEach(resp => {
            const li = document.createElement('li');
            li.textContent = resp;
            responsibilitiesList.appendChild(li);
        });
    } else {
        responsibilitiesList.innerHTML = '<li class="no-data">No responsibilities extracted</li>';
    }

    // Keywords
    const keywordsContainer = document.getElementById('keywords');
    keywordsContainer.innerHTML = '';
    if (analysis.keywords && analysis.keywords.length > 0) {
        analysis.keywords.forEach(keyword => {
            const keywordTag = document.createElement('span');
            keywordTag.className = 'keyword-tag';
            keywordTag.textContent = keyword;
            keywordsContainer.appendChild(keywordTag);
        });
    } else {
        keywordsContainer.innerHTML = '<p class="no-data">No keywords extracted</p>';
    }
}

// Edit Job Description button
document.getElementById('editJdBtn')?.addEventListener('click', () => {
    document.getElementById('analysisPreview').style.display = 'none';
    document.getElementById('jobDescription').focus();
});

// Generate Match Report button
document.getElementById('generateReportBtn')?.addEventListener('click', async () => {
    try {
        loader.show('Generating match report...');

        const resumeId = localStorage.getItem('currentResumeId');
        const jobAnalysis = localStorage.getItem('jobAnalysis');

        if (!resumeId || !jobAnalysis) {
            toast.error('Missing resume or job data. Please start over.');
            loader.hide();
            return;
        }

        // Backend team will replace this with actual API call
        // POST /api/match/score with body: { resumeId, jobDescription }
        const matchReport = await fakeMatchScoreAPI(resumeId, JSON.parse(jobAnalysis));

        // Store match report
        localStorage.setItem('matchReport', JSON.stringify(matchReport));

        loader.hide();
        toast.success('Match report generated!');

        // Redirect to match report page
        setTimeout(() => {
            window.location.href = 'match-report.html';
        }, 500);

    } catch (error) {
        console.error('Error generating match report:', error);
        loader.hide();
        toast.error('Failed to generate match report. Please try again.');
    }
});

// Fake Job Parse API (Backend team will replace)
async function fakeJobParseAPI(jobDescription) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate AI extraction
            resolve({
                title: 'Senior Software Engineer',
                skills: [
                    'JavaScript', 'React', 'Node.js', 'Python',
                    'AWS', 'Docker', 'Kubernetes', 'MongoDB',
                    'TypeScript', 'REST APIs', 'GraphQL'
                ],
                experienceRequired: '5+ years in software development',
                responsibilities: [
                    'Design and develop scalable web applications',
                    'Collaborate with cross-functional teams',
                    'Mentor junior developers',
                    'Write clean, maintainable code',
                    'Participate in code reviews',
                    'Implement CI/CD pipelines'
                ],
                keywords: [
                    'Agile', 'Microservices', 'Cloud', 'DevOps',
                    'TDD', 'API Design', 'Performance Optimization',
                    'Team Leadership', 'Problem Solving'
                ]
            });
        }, 2000);
    });
}

// Fake Match Score API (Backend team will replace)
async function fakeMatchScoreAPI(resumeId, jobAnalysis) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                overallScore: 78,
                experienceMatch: {
                    level: 'high',
                    details: 'Your 4 years of experience aligns well with the 3-5 years requirement.'
                },
                matchedSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'REST APIs'],
                missingSkills: ['Kubernetes', 'GraphQL'],
                extraSkills: ['Redis', 'PostgreSQL', 'Socket.io'],
                keywordAnalysis: {
                    found: ['Agile', 'Microservices', 'Cloud', 'API Design', 'Team Leadership'],
                    missing: ['DevOps', 'TDD', 'Performance Optimization'],
                    matchRate: 63
                },
                suggestions: [
                    {
                        title: 'Add Kubernetes Experience',
                        description: 'The job requires Kubernetes knowledge. Consider adding any container orchestration experience.',
                        priority: 'high',
                        action: 'Add a project or mention Kubernetes usage in your experience section'
                    },
                    {
                        title: 'Include GraphQL Projects',
                        description: 'GraphQL is mentioned as a required skill. Highlight any GraphQL implementation.',
                        priority: 'high',
                        action: 'Update your projects section with GraphQL-related work'
                    },
                    {
                        title: 'Mention DevOps Practices',
                        description: 'Add keywords related to DevOps, CI/CD, and automation.',
                        priority: 'medium',
                        action: 'Update job descriptions to include DevOps-related tasks'
                    },
                    {
                        title: 'Quantify Achievements',
                        description: 'Add more metrics to show impact (e.g., "Improved performance by 40%").',
                        priority: 'low',
                        action: 'Review each role and add measurable accomplishments'
                    }
                ]
            });
        }, 2500);
    });
}

console.log('📝 Job Analysis module initialized');
