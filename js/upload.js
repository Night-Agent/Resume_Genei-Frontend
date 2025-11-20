// Upload Page Functionality
let uploadedFile = null;

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadContent = uploadArea?.querySelector('.upload-content');
const uploadPreview = document.getElementById('uploadPreview');
const removeBtn = document.getElementById('removeBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');

// Browse Button Click
if (browseBtn) {
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

// Upload Area Click
if (uploadArea) {
    uploadArea.addEventListener('click', (e) => {
        if (!uploadPreview.style.display || uploadPreview.style.display === 'none') {
            fileInput.click();
        }
    });
}

// Drag and Drop Events
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// File Input Change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

// Handle File Selection
function handleFileSelect(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        return;
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 10MB.');
        return;
    }
    
    uploadedFile = file;
    
    // Update file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Show preview, hide upload content
    uploadContent.style.display = 'none';
    uploadPreview.style.display = 'block';
    
    // Add success animation
    uploadArea.style.borderColor = '#10b981';
    setTimeout(() => {
        uploadArea.style.borderColor = '';
    }, 1000);
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Remove File
if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        uploadedFile = null;
        fileInput.value = '';
        
        // Hide preview, show upload content
        uploadPreview.style.display = 'none';
        uploadContent.style.display = 'block';
    });
}

// Analyze Resume
if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        if (!uploadedFile) {
            if (typeof toast !== 'undefined') {
                toast.warning('Please upload a resume first.');
            } else {
                alert('Please upload a resume first.');
            }
            return;
        }
        
        // Show analyzing animation
        analyzeBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                <path d="M10 2V6M10 14V18M18 10H14M6 10H2M15.657 4.343L13.828 6.172M6.172 13.828L4.343 15.657M15.657 15.657L13.828 13.828M6.172 6.172L4.343 4.343" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Uploading & Parsing...
        `;
        analyzeBtn.disabled = true;
        
        try {
            // Backend team will replace this with actual API call
            // POST /api/resume/upload (multipart/form-data)
            // Then POST /api/resume/parse
            
            const formData = new FormData();
            formData.append('file', uploadedFile);
            
            // Simulate upload and parsing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Store resume ID for next page
            const resumeId = 'resume-' + Date.now();
            localStorage.setItem('currentResumeId', resumeId);
            
            // Show success message
            if (typeof toast !== 'undefined') {
                toast.success('Resume uploaded and parsed successfully!');
            }
            
            // Redirect to parsed resume page
            setTimeout(() => {
                window.location.href = 'parsed-resume.html';
            }, 500);
            
        } catch (error) {
            console.error('Error uploading resume:', error);
            
            if (typeof toast !== 'undefined') {
                toast.error('Failed to upload resume. Please try again.');
            } else {
                alert('Failed to upload resume. Please try again.');
            }
            
            // Reset button
            analyzeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
                </svg>
                Analyze with AI
            `;
            analyzeBtn.disabled = false;
        }
    });
}

// Prevent default drag behavior on document
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('📁 Upload module initialized');
