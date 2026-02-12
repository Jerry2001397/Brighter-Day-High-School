// Admin Dashboard JavaScript

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking menu item on mobile
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            }
        });
    });
}

// Navigation
document.querySelectorAll('.sidebar-menu a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        
        // Update active menu
        document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            news: 'Manage News Articles',
            notices: 'Manage Notices'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        
        // Load section data
        if (section === 'news') {
            loadNewsArticles();
        } else if (section === 'notices') {
            loadNotices();
        } else if (section === 'dashboard') {
            loadDashboardStats();
        }
    });
});

// Logout function
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await fetch('/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch('/admin/api/stats');
        const data = await response.json();
        
        document.getElementById('newsCount').textContent = data.newsCount || 0;
        document.getElementById('noticesCount').textContent = data.noticesCount || 0;
        document.getElementById('totalViews').textContent = data.totalViews || 0;
        
        // Load recent news
        const tbody = document.querySelector('#recentNewsTable tbody');
        if (data.recentNews && data.recentNews.length > 0) {
            tbody.innerHTML = data.recentNews.map(article => `
                <tr>
                    <td>${article.title}</td>
                    <td><span class="badge badge-success">${article.category}</span></td>
                    <td>${formatDate(article.published_date)}</td>
                    <td>${article.views || 0}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray);">No articles yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load News Articles
async function loadNewsArticles() {
    try {
        const response = await fetch('/news/api/admin/articles');
        const articles = await response.json();
        
        const tbody = document.getElementById('newsTableBody');
        if (articles.length > 0) {
            tbody.innerHTML = articles.map(article => `
                <tr>
                    <td>${article.title}</td>
                    <td><span class="badge badge-success">${article.category}</span></td>
                    <td>${formatDate(article.published_date)}</td>
                    <td>
                        ${article.is_published 
                            ? '<span class="badge badge-success">Published</span>' 
                            : '<span class="badge badge-warning">Draft</span>'}
                    </td>
                    <td>${article.views || 0}</td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="editNews(${article.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-sm btn-delete" onclick="deleteNews(${article.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray);">No articles yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// Load Notices
async function loadNotices() {
    try {
        const response = await fetch('/news/api/admin/notices');
        const notices = await response.json();
        
        const tbody = document.getElementById('noticesTableBody');
        if (notices.length > 0) {
            tbody.innerHTML = notices.map(notice => `
                <tr>
                    <td>${notice.title}</td>
                    <td><i class="fas ${notice.icon}"></i> ${notice.icon}</td>
                    <td>${getPriorityLabel(notice.priority)}</td>
                    <td>
                        ${notice.is_active 
                            ? '<span class="badge badge-success">Active</span>' 
                            : '<span class="badge badge-warning">Inactive</span>'}
                    </td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="editNotice(${notice.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-sm btn-delete" onclick="deleteNotice(${notice.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray);">No notices yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading notices:', error);
    }
}

// News Modal Functions
function openNewsModal(id = null) {
    document.getElementById('newsModal').classList.add('active');
    document.getElementById('newsForm').reset();
    document.getElementById('newsId').value = '';
    document.getElementById('newsModalTitle').textContent = 'Add News Article';
    document.getElementById('newsDate').value = new Date().toISOString().split('T')[0];
    
    if (id) {
        loadNewsForEdit(id);
    }
}

function closeNewsModal() {
    document.getElementById('newsModal').classList.remove('active');
}

async function loadNewsForEdit(id) {
    try {
        const response = await fetch(`/news/api/articles/${id}`);
        const article = await response.json();
        
        document.getElementById('newsId').value = article.id;
        document.getElementById('newsTitle').value = article.title;
        document.getElementById('newsCategory').value = article.category;
        document.getElementById('newsExcerpt').value = article.excerpt;
        document.getElementById('newsContent').value = article.content;
        document.getElementById('newsDate').value = article.published_date.split('T')[0];
        document.getElementById('newsPublished').checked = article.is_published;
        document.getElementById('existingImage').value = article.image_url || '';
        document.getElementById('newsModalTitle').textContent = 'Edit News Article';
    } catch (error) {
        console.error('Error loading article:', error);
        alert('Failed to load article for editing');
    }
}

// News Form Submit
document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('newsId').value;
    const formData = new FormData();
    
    formData.append('title', document.getElementById('newsTitle').value);
    formData.append('category', document.getElementById('newsCategory').value);
    formData.append('excerpt', document.getElementById('newsExcerpt').value);
    formData.append('content', document.getElementById('newsContent').value);
    formData.append('published_date', document.getElementById('newsDate').value);
    formData.append('is_published', document.getElementById('newsPublished').checked);
    
    const imageFile = document.getElementById('newsImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    } else {
        formData.append('existing_image', document.getElementById('existingImage').value);
    }
    
    try {
        const url = id ? `/news/api/admin/articles/${id}` : '/news/api/admin/articles';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success || response.ok) {
            showAlert('newsAlert', 'Article saved successfully!', 'success');
            closeNewsModal();
            loadNewsArticles();
        } else {
            alert('Failed to save article: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving article:', error);
        alert('Failed to save article');
    }
});

function editNews(id) {
    openNewsModal(id);
}

async function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
        const response = await fetch(`/news/api/admin/articles/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('newsAlert', 'Article deleted successfully!', 'success');
            loadNewsArticles();
        } else {
            alert('Failed to delete article');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
    }
}

// Notice Modal Functions
function openNoticeModal(id = null) {
    document.getElementById('noticeModal').classList.add('active');
    document.getElementById('noticeForm').reset();
    document.getElementById('noticeId').value = '';
    document.getElementById('noticeModalTitle').textContent = 'Add Notice';
    
    if (id) {
        loadNoticeForEdit(id);
    }
}

function closeNoticeModal() {
    document.getElementById('noticeModal').classList.remove('active');
}

async function loadNoticeForEdit(id) {
    try {
        const response = await fetch('/news/api/admin/notices');
        const notices = await response.json();
        const notice = notices.find(n => n.id === id);
        
        if (notice) {
            document.getElementById('noticeId').value = notice.id;
            document.getElementById('noticeTitle').value = notice.title;
            document.getElementById('noticeDescription').value = notice.description;
            document.getElementById('noticeIcon').value = notice.icon;
            document.getElementById('noticePriority').value = notice.priority;
            document.getElementById('noticeActive').checked = notice.is_active;
            document.getElementById('noticeModalTitle').textContent = 'Edit Notice';
        }
    } catch (error) {
        console.error('Error loading notice:', error);
        alert('Failed to load notice for editing');
    }
}

// Notice Form Submit
document.getElementById('noticeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('noticeId').value;
    const data = {
        title: document.getElementById('noticeTitle').value,
        description: document.getElementById('noticeDescription').value,
        icon: document.getElementById('noticeIcon').value,
        priority: parseInt(document.getElementById('noticePriority').value),
        is_active: document.getElementById('noticeActive').checked
    };
    
    try {
        const url = id ? `/news/api/admin/notices/${id}` : '/news/api/admin/notices';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('noticeAlert', 'Notice saved successfully!', 'success');
            closeNoticeModal();
            loadNotices();
        } else {
            alert('Failed to save notice');
        }
    } catch (error) {
        console.error('Error saving notice:', error);
        alert('Failed to save notice');
    }
});

function editNotice(id) {
    openNoticeModal(id);
}

async function deleteNotice(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
        const response = await fetch(`/news/api/admin/notices/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('noticeAlert', 'Notice deleted successfully!', 'success');
            loadNotices();
        } else {
            alert('Failed to delete notice');
        }
    } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Failed to delete notice');
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getPriorityLabel(priority) {
    const labels = { 0: 'Low', 1: 'Medium', 2: 'High' };
    return `<span class="badge ${priority > 1 ? 'badge-warning' : 'badge-success'}">${labels[priority] || 'Low'}</span>`;
}

function showAlert(elementId, message, type) {
    const alertEl = document.getElementById(elementId);
    alertEl.className = `alert alert-${type}`;
    alertEl.textContent = message;
    alertEl.style.display = 'block';
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}

// Initialize dashboard on load
window.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});
