// Resume Preview Page Functionality

// Check authentication
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load resume data from localStorage or API
async function loadResumeData() {
    try {
        const resumeId = localStorage.getItem('currentResumeId');
        if (!resumeId) {
            toast.error('No resume data found. Please upload a resume first.');
            setTimeout(() => {
                window.location.href = 'upload.html';
            }, 2000);
            return;
        }

        // Show loader
        loader.show('Loading resume data...');

        // Backend team will replace this with actual API call
        const resumeData = await fakeResumeParseAPI(resumeId);

        // Display resume data
        displayPersonalInfo(resumeData.personal);
        displaySkills(resumeData.skills);
        displayExperience(resumeData.experience);
        displayEducation(resumeData.education);
        displayCertifications(resumeData.certifications);
        displayProjects(resumeData.projects);

        loader.hide();
        toast.success('Resume loaded successfully!');

    } catch (error) {
        console.error('Error loading resume:', error);
        loader.hide();
        toast.error('Failed to load resume data. Please try again.');
    }
}

// Display personal information
function displayPersonalInfo(personal) {
    document.getElementById('userName').textContent = personal.name || 'Not provided';
    document.getElementById('userEmail').textContent = personal.email || 'Not provided';
    document.getElementById('userPhone').textContent = personal.phone || 'Not provided';
    document.getElementById('userLocation').textContent = personal.location || 'Not provided';
}

// Display skills
function displaySkills(skills) {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';

    if (!skills || skills.length === 0) {
        skillsList.innerHTML = '<p class="no-data">No skills found in resume</p>';
        return;
    }

    skills.forEach(skill => {
        const chip = createSkillChip(skill, 'default');
        skillsList.appendChild(chip);
    });
}

// Display experience
function displayExperience(experiences) {
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';

    if (!experiences || experiences.length === 0) {
        experienceList.innerHTML = '<p class="no-data">No work experience found</p>';
        return;
    }

    experiences.forEach(exp => {
        const expCard = document.createElement('div');
        expCard.className = 'experience-item';
        expCard.innerHTML = `
            <div class="experience-header">
                <h4>${exp.title}</h4>
                <span class="experience-duration">${exp.duration}</span>
            </div>
            <div class="experience-company">${exp.company}</div>
            ${exp.description ? `<p class="experience-description">${exp.description}</p>` : ''}
            ${exp.achievements && exp.achievements.length > 0 ? `
                <ul class="experience-achievements">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        experienceList.appendChild(expCard);
    });
}

// Display education
function displayEducation(education) {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';

    if (!education || education.length === 0) {
        educationList.innerHTML = '<p class="no-data">No education found</p>';
        return;
    }

    education.forEach(edu => {
        const eduCard = document.createElement('div');
        eduCard.className = 'education-item';
        eduCard.innerHTML = `
            <div class="education-header">
                <h4>${edu.degree}</h4>
                <span class="education-year">${edu.year}</span>
            </div>
            <div class="education-institution">${edu.institution}</div>
            ${edu.gpa ? `<div class="education-gpa">GPA: ${edu.gpa}</div>` : ''}
        `;
        educationList.appendChild(eduCard);
    });
}

// Display certifications
function displayCertifications(certifications) {
    const certificationList = document.getElementById('certificationList');
    certificationList.innerHTML = '';

    if (!certifications || certifications.length === 0) {
        certificationList.innerHTML = '<p class="no-data">No certifications found</p>';
        return;
    }

    const certUl = document.createElement('ul');
    certUl.className = 'certification-list-items';
    certifications.forEach(cert => {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#059669" stroke-width="1.5"/>
                <path d="M5.5 9.5L4.5 15l3.5-2 3.5 2-1-5.5" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${cert}</span>
        `;
        certUl.appendChild(li);
    });
    certificationList.appendChild(certUl);
}

// Display projects
function displayProjects(projects) {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';

    if (!projects || projects.length === 0) {
        projectList.innerHTML = '<p class="no-data">No projects found</p>';
        return;
    }

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-item';
        projectCard.innerHTML = `
            <div class="project-header">
                <h4>${project.name}</h4>
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View →</a>` : ''}
            </div>
            ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
            ${project.technologies && project.technologies.length > 0 ? `
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
        `;
        projectList.appendChild(projectCard);
    });
}

// Continue to job description button
document.getElementById('continueToJobBtn')?.addEventListener('click', () => {
    window.location.href = 'job-description.html';
});

// Fake API for resume parsing (Backend team will replace)
async function fakeResumeParseAPI(resumeId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                personal: {
                    name: 'John Doe',
                    email: 'john.doe@email.com',
                    phone: '+1 (555) 123-4567',
                    location: 'San Francisco, CA'
                },
                skills: [
                    'JavaScript', 'React', 'Node.js', 'Python', 'AWS',
                    'Docker', 'MongoDB', 'TypeScript', 'Git', 'REST APIs'
                ],
                experience: [
                    {
                        title: 'Senior Software Engineer',
                        company: 'Tech Corp',
                        duration: '2021 - Present',
                        description: 'Leading development of cloud-native applications',
                        achievements: [
                            'Improved system performance by 40%',
                            'Led a team of 5 developers',
                            'Implemented CI/CD pipelines'
                        ]
                    },
                    {
                        title: 'Software Engineer',
                        company: 'StartupXYZ',
                        duration: '2019 - 2021',
                        description: 'Full-stack development with React and Node.js',
                        achievements: [
                            'Built 3 major features from scratch',
                            'Reduced API response time by 60%'
                        ]
                    }
                ],
                education: [
                    {
                        degree: 'Bachelor of Science in Computer Science',
                        institution: 'Stanford University',
                        year: '2019',
                        gpa: '3.8/4.0'
                    }
                ],
                certifications: [
                    'AWS Certified Solutions Architect',
                    'Google Cloud Professional',
                    'MongoDB Certified Developer'
                ],
                projects: [
                    {
                        name: 'E-commerce Platform',
                        description: 'Built a scalable e-commerce platform handling 10K+ daily users',
                        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
                        link: 'https://github.com/johndoe/ecommerce'
                    },
                    {
                        name: 'Real-time Chat Application',
                        description: 'WebSocket-based chat with end-to-end encryption',
                        technologies: ['Socket.io', 'Express', 'MongoDB'],
                        link: 'https://github.com/johndoe/chat-app'
                    }
                ]
            });
        }, 1500);
    });
}

// Initialize
if (checkAuth()) {
    document.addEventListener('DOMContentLoaded', () => {
        loadResumeData();
    });
}

console.log('📄 Resume Preview module initialized');
