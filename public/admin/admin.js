// Admin Dashboard JavaScript

let currentEditingId = null;
let uploadedPhotoPath = null;

// Check authentication on load
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            window.location.href = '/admin/login.html';
            return;
        }
        
        const data = await response.json();
        
        if (!data.authenticated || !data.user) {
            window.location.href = '/admin/login.html';
            return;
        }
        
        console.log('Authenticated as:', data.user.username);
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login.html';
    }
}

// Logout
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/admin/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Show alert
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Load team members
async function loadMembers() {
    try {
        const response = await fetch('/api/team-members', {
            credentials: 'include'
        });
        const members = await response.json();
        
        const list = document.getElementById('membersList');
        
        if (members.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary);">No team members yet. Add one to get started!</p>';
            return;
        }
        
        list.innerHTML = members.map(member => `
            <div class="member-item">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p><strong>Role:</strong> ${member.role || 'N/A'}</p>
                    <p><strong>Department:</strong> ${member.department || 'N/A'}</p>
                    ${member.summary ? `<p style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">${member.summary.substring(0, 100)}${member.summary.length > 100 ? '...' : ''}</p>` : ''}
                </div>
                <div class="member-actions">
                    <button class="btn btn-secondary btn-small" onclick="editMember(${member.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteMember(${member.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load members:', error);
        showAlert('Failed to load team members', 'error');
    }
}

// Edit member
async function editMember(id) {
    try {
        const response = await fetch(`/api/team-members/${id}`, {
            credentials: 'include'
        });
        const member = await response.json();
        
        currentEditingId = id;
        document.getElementById('memberId').value = id;
        document.getElementById('name').value = member.name || '';
        document.getElementById('role').value = member.role || '';
        document.getElementById('department').value = member.department || '';
        document.getElementById('summary').value = member.summary || '';
        document.getElementById('displayOrder').value = member.display_order || 0;
        document.getElementById('formTitle').textContent = 'Edit Team Member';
        
        if (member.photo_path) {
            uploadedPhotoPath = member.photo_path;
            const preview = document.getElementById('photoPreview');
            preview.src = member.photo_path.startsWith('/') ? member.photo_path : `/${member.photo_path}`;
            preview.style.display = 'block';
        }
        
        // Scroll to form
        document.querySelector('.admin-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to load member:', error);
        showAlert('Failed to load member details', 'error');
    }
}

// Delete member
async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this team member?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/team-members/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showAlert('Team member deleted successfully');
            loadMembers();
        } else {
            showAlert('Failed to delete team member', 'error');
        }
    } catch (error) {
        console.error('Failed to delete member:', error);
        showAlert('Failed to delete team member', 'error');
    }
}

// Reset form
function resetForm() {
    currentEditingId = null;
    uploadedPhotoPath = null;
    document.getElementById('memberForm').reset();
    document.getElementById('memberId').value = '';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Add New Team Member';
}

// Handle photo upload
document.getElementById('photo').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('photo', file);
    
    try {
        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            uploadedPhotoPath = data.relativePath;
            const preview = document.getElementById('photoPreview');
            preview.src = data.url;
            preview.style.display = 'block';
            showAlert('Photo uploaded successfully');
        } else {
            showAlert(data.error || 'Failed to upload photo', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Failed to upload photo', 'error');
    }
});

// Handle form submission
document.getElementById('memberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const memberData = {
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        department: document.getElementById('department').value,
        summary: document.getElementById('summary').value,
        display_order: parseInt(document.getElementById('displayOrder').value) || 0,
        photo_path: uploadedPhotoPath || null
    };
    
    try {
        const url = currentEditingId 
            ? `/api/team-members/${currentEditingId}`
            : '/api/team-members';
        
        const method = currentEditingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(memberData)
        });
        
        if (response.ok) {
            showAlert(`Team member ${currentEditingId ? 'updated' : 'created'} successfully`);
            resetForm();
            loadMembers();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Failed to save team member', 'error');
        }
    } catch (error) {
        console.error('Save error:', error);
        showAlert('Failed to save team member', 'error');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadMembers();
});

