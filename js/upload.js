// Upload Page JavaScript
// Note: This file depends on utils.js being loaded first

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const photoUpload = document.getElementById('photoUpload');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removePreview = document.getElementById('removePreview');
    const uploadStatus = document.getElementById('uploadStatus');
    const memberSelect = document.getElementById('memberSelect');

    // Get member file map from config or use fallback
    const memberFileMap = window.CONFIG?.MEMBER_FILE_MAP || {
        'jack': 'JACK G',
        'michael': 'Michael Koch',
        'alexander': 'Alex',
        'oliver': 'Fenghao Hu Oliver',
        'elena': 'Elena Luquero',
        'ain': 'Ain Kyell',
        'enrico': 'Enrico Spera',
        'tina': 'Tina',
        'rin': 'Rin Arakaki',
        'jarad': 'Jarad',
        'anna': 'Anna',
        'dominik': 'dominik-nikolic',
        'haokai': 'Haokai',
        'shot': 'Shot',
        'sam': 'Sam',
        'david': 'David',
        'mahdi': 'Mahdi',
        'rico': 'Rico'
    };

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', async function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFileSelect(files[0]);
        }
    });

    // File input change handler
    photoUpload.addEventListener('change', async function(e) {
        if (e.target.files.length > 0) {
            await handleFileSelect(e.target.files[0]);
        }
    });

    // Handle file selection
    async function handleFileSelect(file) {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isHeic = isHeicFile(file);

        if (!isImage && !isHeic) {
            showStatus('Please select an image file (PNG, JPG, JPEG, HEIC)', 'error');
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showStatus('File size must be less than 10MB', 'error');
            return;
        }

        // No client-side conversion; server will convert HEIC to JPG

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadPreview.style.display = 'block';
            document.querySelector('.upload-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
        
        // Store the converted file for upload
        photoUpload.convertedFile = null;
    }

    // Remove preview
    removePreview.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadPreview.style.display = 'none';
        document.querySelector('.upload-placeholder').style.display = 'flex';
        photoUpload.value = '';
        photoUpload.convertedFile = null;
        previewImage.src = '';
        uploadStatus.style.display = 'none';
    });

    // Form submission
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const member = memberSelect.value;
        const originalFile = photoUpload.files[0];
        const file = photoUpload.convertedFile || originalFile;

        if (!member) {
            showStatus('Please select a team member', 'error');
            return;
        }

        if (!file) {
            showStatus('Please select a photo file', 'error');
            return;
        }

        // Disable submit button
        const submitBtn = uploadForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';

        // Upload file
        await uploadFile(member, file);
    });

    // Upload file function
    async function uploadFile(member, file) {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('member', member);
        formData.append('filename', memberFileMap[member] || member);

        // Check if we're using a server endpoint
        const uploadEndpoint = '/api/upload';

        fetch(uploadEndpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Upload failed - server not available');
            }
            return response.json();
        })
        .then(data => {
            showStatus(`Photo uploaded successfully! File saved as: ${data.filename}`, 'success');
            resetForm();
        })
        .catch(error => {
            console.log('Server not available, using fallback method:', error);
            // Fallback: Download file with correct name
            downloadFileWithName(file, member);
        })
        .finally(() => {
            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Upload Photo';
        });
    }

    // Fallback: Download file with correct name (for local use)
    function downloadFileWithName(file, member) {
        const fileName = memberFileMap[member] || member;
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${fileName}.${fileExtension}`;

        // Create download link
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = newFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus(
            `File ready to download. Please save it as "${newFileName}" in the folder: Pics/PFP TEAM KOAS - 2025 (nov.)/`,
            'info'
        );
    }

    // Show status message
    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = `upload-status ${type}`;
        uploadStatus.style.display = 'block';

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                uploadStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Reset form
    function resetForm() {
        uploadForm.reset();
        uploadPreview.style.display = 'none';
        document.querySelector('.upload-placeholder').style.display = 'flex';
        previewImage.src = '';
        photoUpload.convertedFile = null;
    }
});

