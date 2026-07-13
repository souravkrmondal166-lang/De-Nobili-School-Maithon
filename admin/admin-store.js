/* =============================================
   admin-store.js — Admin Data Management Layer
   Centralized CRUD for all localStorage data.
   ============================================= */

const AdminStore = {
    /* --- Default data schema --- */
    defaults: {
        dns_announcements: [
            { id: '1', text: 'Admissions open for 2026-27. Apply online now!', active: true, createdAt: '2026-01-15' },
            { id: '2', text: 'ICSE Results 2025 — Outstanding performance with 98.4% top score!', active: true, createdAt: '2025-05-15' },
            { id: '3', text: 'Annual Day Celebration on March 15, 2026.', active: true, createdAt: '2026-03-01' }
        ],
        dns_contact: {
            email: 'principal.maithon@denobili.in', phone: '7631998027',
            address: 'Koradih, Maithon', city: 'Dhanbad', state: 'Jharkhand', pincode: '828207',
            feePaymentUrl: 'https://www.parentsalarm.com/',
            admissionUrl: 'https://app.schoolcanvas.com/admission/DNSMaithon',
            facebook: '#', instagram: '#', youtube: '#', twitter: '#'
        },
        dns_stats: { students: 2000, faculty: 100, years: 50, acres: 12 },
        dns_faculty: [],
        dns_governing: [],
        dns_photos: [
            { id: '1', title: 'School Campus', url: '../images/hero.jpg', category: 'Campus', caption: 'Main building' },
            { id: '2', title: 'Library', url: '../images/academics.jpg', category: 'Academics', caption: 'School Library' },
            { id: '3', title: 'Sports Ground', url: '../images/activities.jpg', category: 'Sports', caption: 'Sports activities' },
            { id: '4', title: 'Science Lab', url: '../images/laboratory.jpg', category: 'Academics', caption: 'Modern lab' }
        ],
        dns_videos: [],
        dns_posts: [],
        dns_downloads: [],
        dns_toppers: [],
        dns_leadership: {
            principal: { name: '', role: 'Principal', photo: '', signature: '', description: '', active: true },
            vp: { name: '', role: 'Vice Principal', photo: '', signature: '', description: '', active: false },
            coordinator: { name: '', role: 'Coordinator', photo: '', signature: '', description: '', active: false }
        }
    },

    /* --- Core CRUD --- */
    get(key) {
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        if (this.defaults[key] !== undefined) {
            this.set(key, this.defaults[key]);
            return JSON.parse(JSON.stringify(this.defaults[key]));
        }
        return null;
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    genId() {
        return Date.now().toString() + Math.floor(Math.random() * 1000);
    },

    /* --- Auth --- */
    isLoggedIn() { return localStorage.getItem('admin_auth') === 'true'; },
    login(username, idNumber, password) {
        if (username === 'Denobili' && idNumber === '513085' && password === 'DeNobili2026') {
            localStorage.setItem('admin_auth', 'true');
            localStorage.setItem('admin_user', username);
            return true;
        }
        return false;
    },
    logout() {
        localStorage.removeItem('admin_auth');
        window.location.href = 'index.html';
    },
    checkAuth() {
        if (!this.isLoggedIn()) window.location.href = 'index.html';
    },

    /* --- Announcements --- */
    getAnnouncements() { return this.get('dns_announcements'); },
    saveAnnouncements(data) { this.set('dns_announcements', data); },

    /* --- Contact --- */
    getContact() { return this.get('dns_contact'); },
    saveContact(data) { this.set('dns_contact', data); },

    /* --- Stats --- */
    getStats() { return this.get('dns_stats'); },
    saveStats(data) { this.set('dns_stats', data); },

    /* --- Faculty --- */
    getFaculty() { return this.get('dns_faculty'); },
    saveFaculty(data) { this.set('dns_faculty', data); },

    /* --- Governing Body --- */
    getGoverning() { return this.get('dns_governing'); },
    saveGoverning(data) { this.set('dns_governing', data); },

    /* --- Photos --- */
    getPhotos() { return this.get('dns_photos'); },
    savePhotos(data) { this.set('dns_photos', data); },

    /* --- Videos --- */
    getVideos() { return this.get('dns_videos'); },
    saveVideos(data) { this.set('dns_videos', data); },

    /* --- Posts --- */
    getPosts() { return this.get('dns_posts'); },
    savePosts(data) { this.set('dns_posts', data); },

    /* --- Downloads --- */
    getDownloads() { return this.get('dns_downloads'); },
    saveDownloads(data) { this.set('dns_downloads', data); },

    /* --- Toppers --- */
    getToppers() { return this.get('dns_toppers'); },
    saveToppers(data) { this.set('dns_toppers', data); },

    /* --- Leadership (Principal/VP/Coordinator) --- */
    getLeadership() { return this.get('dns_leadership'); },
    saveLeadership(data) { this.set('dns_leadership', data); }
};

/* --- Sidebar & Layout Helpers --- */
function renderAdminSidebar(activePage) {
    const groups = {
        'Main': [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', href: 'dashboard.html' }
        ],
        'Content': [
            { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn', href: 'announcements.html' },
            { id: 'posts', label: 'News & Posts', icon: 'fa-newspaper', href: 'posts.html' },
            { id: 'downloads', label: 'Downloads', icon: 'fa-file-pdf', href: 'downloads.html' }
        ],
        'Media': [
            { id: 'photos', label: 'Photo Gallery', icon: 'fa-images', href: 'photos.html' },
            { id: 'videos', label: 'Video Gallery', icon: 'fa-video', href: 'videos.html' }
        ],
        'People': [
            { id: 'leadership', label: 'Leadership', icon: 'fa-crown', href: 'leadership.html' },
            { id: 'faculty', label: 'Faculty & Staff', icon: 'fa-user-graduate', href: 'faculty.html' },
            { id: 'governing', label: 'Governing Body', icon: 'fa-users', href: 'governing.html' }
        ],
        'Academics': [
            { id: 'toppers', label: 'ICSE/ISC Toppers', icon: 'fa-trophy', href: 'toppers.html' }
        ],
        'Settings': [
            { id: 'stats', label: 'School Stats', icon: 'fa-chart-bar', href: 'stats.html' },
            { id: 'contact', label: 'Contact Info', icon: 'fa-phone', href: 'contact-edit.html' }
        ]
    };

    let html = '<div class="admin-sidebar-logo"><div class="logo-emblem" style="padding:0;overflow:hidden;"><img src="../images/logo.jpg" alt="DN" style="width:100%;height:100%;object-fit:contain;"></div><span>Admin Panel</span></div>';

    for (const [group, items] of Object.entries(groups)) {
        html += '<div class="admin-nav-section">' + group + '</div><ul class="admin-nav">';
        for (const item of items) {
            const cls = item.id === activePage ? ' class="active"' : '';
            html += '<li><a href="' + item.href + '"' + cls + '><i class="fas ' + item.icon + '"></i> ' + item.label + '</a></li>';
        }
        html += '</ul>';
    }

    html += '<div class="admin-nav-section">Site</div><ul class="admin-nav"><li><a href="../index.html" target="_blank"><i class="fas fa-external-link-alt"></i> View Public Site</a></li></ul>';
    html += '<div class="admin-logout"><a href="#" onclick="AdminStore.logout();return false;"><i class="fas fa-sign-out-alt"></i> Sign Out</a></div>';

    return html;
}

/* --- Modal Helper --- */
function showModal(title, formHTML, onSave) {
    let backdrop = document.getElementById('admin-modal');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'admin-modal';
        backdrop.className = 'admin-modal-backdrop';
        document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = '<div class="admin-modal"><h3>' + title + '</h3><form id="modal-form">' + formHTML + '<div style="display:flex;gap:0.75rem;margin-top:1.25rem;"><button type="submit" class="admin-btn admin-btn-primary" style="flex:1;justify-content:center;padding:0.65rem;"><i class="fas fa-save"></i> Save</button><button type="button" class="admin-btn admin-btn-danger" style="flex:1;justify-content:center;padding:0.65rem;" onclick="closeModal()"><i class="fas fa-times"></i> Cancel</button></div></form></div>';
    backdrop.classList.add('active');
    document.getElementById('modal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        onSave();
    });
}

function closeModal() {
    const m = document.getElementById('admin-modal');
    if (m) m.classList.remove('active');
}

/* --- Toast Notification --- */
function showToast(msg, type) {
    const t = document.createElement('div');
    t.className = 'admin-toast ' + (type || 'success');
    t.innerHTML = '<i class="fas ' + (type === 'error' ? 'fa-times-circle' : 'fa-check-circle') + '"></i> ' + msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}

/* --- File to DataURL --- */
function fileToDataURL(input, callback) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) { callback(e.target.result); };
    reader.readAsDataURL(file);
}
