/* =============================================
   sync.js — Public Site Data Bridge
   Reads admin-managed data from localStorage
   and dynamically updates public page content.
   ============================================= */

const SyncStore = {
    defaults: {
        dns_announcements: [
            { id: '1', text: 'Admissions open for 2026-27. Apply online now!', active: true, createdAt: '2026-01-15' },
            { id: '2', text: 'ICSE Results 2025 — Outstanding performance with 98.4% top score!', active: true, createdAt: '2025-05-15' },
            { id: '3', text: 'Annual Day Celebration on March 15, 2026. All are welcome.', active: true, createdAt: '2026-03-01' }
        ],
        dns_contact: {
            email: 'principal.maithon@denobili.in',
            phone: '7631998027',
            address: 'Koradih, Maithon',
            city: 'Dhanbad',
            state: 'Jharkhand',
            pincode: '828207',
            feePaymentUrl: 'https://www.parentsalarm.com/',
            admissionUrl: 'https://app.schoolcanvas.com/admission/DNSMaithon',
            facebook: '#', instagram: '#', youtube: '#', twitter: '#'
        },
        dns_stats: { students: 2000, faculty: 100, years: 50, acres: 12 },
        dns_faculty: [],
        dns_governing: [],
        dns_photos: [
            { id: '1', title: 'School Campus', url: 'images/hero.jpg', category: 'Campus', caption: 'Main building' },
            { id: '2', title: 'Library', url: 'images/academics.jpg', category: 'Academics', caption: 'School Library' },
            { id: '3', title: 'Sports', url: 'images/activities.jpg', category: 'Sports', caption: 'Sports activities' },
            { id: '4', title: 'Science Lab', url: 'images/laboratory.jpg', category: 'Academics', caption: 'Science laboratory' }
        ],
        dns_videos: [],
        dns_posts: [],
        dns_downloads: [],
        dns_toppers: [],
        dns_leadership: {
            principal: { name: 'The Principal', role: 'Principal', photo: '', signature: '', description: 'The Principal provides visionary leadership to the school, guiding academic programmes, character formation, and the overall direction of the institution.', active: true },
            vp: { name: '', role: 'Vice Principal', photo: '', signature: '', description: '', active: false },
            coordinator: { name: '', role: 'Coordinator', photo: '', signature: '', description: '', active: false }
        }
    },

    get(key) {
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        // Return defaults and save them
        if (this.defaults[key]) {
            localStorage.setItem(key, JSON.stringify(this.defaults[key]));
            return this.defaults[key];
        }
        return null;
    }
};

/* --- Sync Functions --- */

function syncAnnouncementsTicker() {
    const ticker = document.querySelector('.announcements-track');
    if (!ticker) return;
    const items = SyncStore.get('dns_announcements').filter(a => a.active);
    if (items.length === 0) return;
    ticker.innerHTML = items.map(a =>
        '<div class="announcement-item"><i class="fas fa-bullhorn"></i> ' + a.text + '</div>'
    ).join('') + items.map(a =>
        '<div class="announcement-item"><i class="fas fa-bullhorn"></i> ' + a.text + '</div>'
    ).join(''); // duplicate for seamless scroll
}

function syncContactInfo() {
    const c = SyncStore.get('dns_contact');
    if (!c) return;

    // Top bar email
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.href = 'mailto:' + c.email;
        const span = el.querySelector('span');
        if (span) span.textContent = c.email;
    });

    // Top bar phone
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.href = 'tel:' + c.phone;
        const span = el.querySelector('span');
        if (span) span.textContent = c.phone;
        else if (el.childNodes.length && !el.querySelector('i')) el.textContent = c.phone;
    });

    // Fee payment URL
    document.querySelectorAll('a[href*="parentsalarm"]').forEach(el => {
        if (c.feePaymentUrl) el.href = c.feePaymentUrl;
    });

    // Admission URL
    document.querySelectorAll('a[href*="schoolcanvas"]').forEach(el => {
        if (c.admissionUrl) el.href = c.admissionUrl;
    });

    // Footer contact
    const footerContact = document.querySelector('.footer-contact');
    if (footerContact) {
        const items = footerContact.querySelectorAll('li');
        items.forEach(li => {
            const icon = li.querySelector('i');
            if (!icon) return;
            if (icon.classList.contains('fa-map-marker-alt')) {
                const span = li.querySelector('span');
                if (span) span.innerHTML = c.address + ',<br>' + c.city + '-' + c.pincode + ', ' + c.state;
            }
        });
    }

    // Social links
    if (c.facebook) document.querySelectorAll('a[aria-label="Facebook"]').forEach(el => el.href = c.facebook);
    if (c.instagram) document.querySelectorAll('a[aria-label="Instagram"]').forEach(el => el.href = c.instagram);
    if (c.youtube) document.querySelectorAll('a[aria-label="YouTube"]').forEach(el => el.href = c.youtube);

    // Contact page info cards
    document.querySelectorAll('.contact-info-card').forEach(card => {
        const icon = card.querySelector('.contact-info-card-icon i');
        if (!icon) return;
        if (icon.classList.contains('fa-map-marker-alt')) {
            const p = card.querySelector('p');
            if (p) p.innerHTML = 'De Nobili School, ' + c.address + ',<br>' + c.city + '-' + c.pincode + ',<br>' + c.state + ', India';
        } else if (icon.classList.contains('fa-phone')) {
            const p = card.querySelector('p');
            if (p) p.innerHTML = '<a href="tel:' + c.phone + '">' + c.phone + '</a>';
        } else if (icon.classList.contains('fa-envelope')) {
            const p = card.querySelector('p');
            if (p) p.innerHTML = '<a href="mailto:' + c.email + '">' + c.email + '</a>';
        }
    });
}

function syncHeroStats() {
    const stats = SyncStore.get('dns_stats');
    if (!stats) return;
    document.querySelectorAll('[data-count]').forEach(el => {
        const label = el.closest('.hero-stat')?.querySelector('.hero-stat-label')?.textContent?.toLowerCase() || '';
        if (label.includes('student')) el.setAttribute('data-count', stats.students);
        else if (label.includes('faculty')) el.setAttribute('data-count', stats.faculty);
        else if (label.includes('year')) el.setAttribute('data-count', stats.years);
        else if (label.includes('acre')) el.setAttribute('data-count', stats.acres);
    });
}

function syncFacultyPage() {
    const faculty = SyncStore.get('dns_faculty');
    if (!faculty || faculty.length === 0) return;

    // Detect page type
    var pageTitle = document.querySelector('.page-banner h1');
    if (!pageTitle) return;
    var title = pageTitle.textContent;
    var section = '';
    if (title.includes('School Faculty')) section = '';
    else if (title.includes('Administrative')) section = 'Administrative';
    else if (title.includes('Office')) section = 'Office';
    else if (title.includes('Maintenance')) section = '';
    else return;

    var filtered = section ? faculty.filter(function(f) { return f.section === section; }) : faculty;
    if (filtered.length === 0) return;

    // Find the page-content section
    var pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    // Remove ALL static content (principal card, staff grids, placeholders)
    var container = pageContent.querySelector('.container') || pageContent;
    var staticElements = container.querySelectorAll('.principal-card, .staff-grid, .staff-category, h3');
    staticElements.forEach(function(el) { el.remove(); });

    // Separate principals from regular staff
    var principals = filtered.filter(function(f) { return f.isPrincipal; });
    var regular = filtered.filter(function(f) { return !f.isPrincipal; });

    var html = '';

    // Leadership section (Principal, VP, Coordinator)
    if (principals.length > 0) {
        html += '<div style="margin-bottom:2rem;">';
        principals.forEach(function(m) {
            html += '<div class="principal-card" data-animate="fade-up" style="display:flex;gap:1.5rem;align-items:flex-start;background:linear-gradient(135deg,#f8fafc,#eff6ff);border:1px solid #dbeafe;border-radius:1rem;padding:1.5rem;margin-bottom:1rem;box-shadow:0 4px 15px rgba(37,99,235,0.08);">';
            html += '<div style="width:120px;height:120px;border-radius:50%;overflow:hidden;flex-shrink:0;border:4px solid #3b82f6;background:#dbeafe;display:flex;align-items:center;justify-content:center;">';
            html += m.photo ? '<img src="' + m.photo + '" style="width:100%;height:100%;object-fit:cover;" alt="' + m.name + '">' : '<i class="fas fa-user" style="font-size:2.5rem;color:#3b82f6;"></i>';
            html += '</div><div style="flex:1;">';
            html += '<h3 style="font-size:1.2rem;font-weight:700;color:#1e293b;margin-bottom:0.25rem;">' + m.name + '</h3>';
            html += '<span class="role" style="display:inline-flex;align-items:center;gap:0.25rem;color:#2563eb;font-weight:600;font-size:0.9rem;"><i class="fas fa-crown"></i> ' + m.role + '</span>';
            if (m.department) html += '<div style="font-size:0.85rem;color:#64748b;margin-top:0.25rem;">' + m.department + '</div>';
            if (m.qualification) html += '<div style="font-size:0.8rem;color:#94a3b8;">' + m.qualification + '</div>';
            if (m.subject) html += '<div style="font-size:0.85rem;color:#475569;margin-top:0.25rem;"><i class="fas fa-book" style="color:#3b82f6;margin-right:0.25rem;"></i>Subject: ' + m.subject + '</div>';
            if (m.classTeacher) html += '<div style="font-size:0.85rem;color:#475569;"><i class="fas fa-chalkboard-teacher" style="color:#22c55e;margin-right:0.25rem;"></i>Class Teacher: ' + m.classTeacher + '</div>';
            if (m.description) html += '<p style="font-size:0.9rem;color:#475569;margin-top:0.5rem;line-height:1.5;border-top:1px solid #dbeafe;padding-top:0.5rem;">' + m.description + '</p>';
            if (m.email) html += '<div style="font-size:0.8rem;margin-top:0.5rem;"><a href="mailto:' + m.email + '" style="color:#3b82f6;text-decoration:none;"><i class="fas fa-envelope" style="margin-right:0.25rem;"></i>' + m.email + '</a></div>';
            html += '</div></div>';
        });
        html += '</div>';
    }

    // Regular staff - group by section
    if (section) {
        html += '<div class="staff-grid">' + regular.map(function(m) { return staffCardHTML(m); }).join('') + '</div>';
    } else {
        var sections = ['Administrative', 'Primary', 'Middle', 'Senior', 'Office'];
        sections.forEach(function(s) {
            var members = regular.filter(function(f) { return f.section === s; });
            if (members.length === 0) return;
            html += '<div class="staff-category"><h3>' + s + ' Section</h3></div>';
            html += '<div class="staff-grid">' + members.map(function(m) { return staffCardHTML(m); }).join('') + '</div>';
        });
    }

    container.innerHTML = html;
}

function staffCardHTML(m) {
    var photo = m.photo
        ? '<img src="' + m.photo + '" alt="' + m.name + '" style="width:100%;height:100%;object-fit:cover;">'
        : '<div class="photo-placeholder"><i class="fas fa-user"></i><span>Photo</span></div>';
    var extra = '';
    if (m.subject) extra += '<div style="font-size:0.75rem;color:#475569;margin-top:0.25rem;"><i class="fas fa-book" style="color:#3b82f6;margin-right:0.2rem;font-size:0.65rem;"></i>' + m.subject + '</div>';
    if (m.classTeacher) extra += '<div style="font-size:0.75rem;color:#16a34a;margin-top:0.125rem;"><i class="fas fa-chalkboard-teacher" style="margin-right:0.2rem;font-size:0.65rem;"></i>CT: ' + m.classTeacher + '</div>';
    if (m.qualification) extra += '<p style="font-size:0.7rem;color:#94a3b8;margin-top:0.25rem;">' + m.qualification + '</p>';
    return '<div class="staff-card"><div class="staff-card-photo">' + photo + '</div><div class="staff-card-info"><h4>' + m.name + '</h4><div class="staff-role"><i class="fas fa-briefcase"></i> ' + m.role + '</div><div class="staff-dept">' + (m.department || '') + '</div>' + extra + '</div></div>';
}

function syncGoverningBody() {
    const page = document.querySelector('.page-banner h1');
    if (!page || !page.textContent.includes('Governing')) return;
    const members = SyncStore.get('dns_governing');
    if (!members || members.length === 0) return;

    const table = document.querySelector('.data-table tbody');
    if (table) {
        table.innerHTML = members.map((m, i) => {
            const photo = m.photo ? '<img src="' + m.photo + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">' : '';
            return '<tr><td>' + (i + 1) + '</td><td>' + photo + ' ' + m.name + '</td><td>' + m.role + '</td><td>Member</td></tr>';
        }).join('');
    }
}



/* === LIKE SYSTEM (localStorage-based with spam prevention) === */
function getLikeCount(type, id) {
    try { var data = JSON.parse(localStorage.getItem('dns_likes') || '{}'); return (data[type + '_' + id] || 0); } catch(e) { return 0; }
}
function hasUserLiked(type, id) {
    try { var data = JSON.parse(localStorage.getItem('dns_user_likes') || '{}'); return !!data[type + '_' + id]; } catch(e) { return false; }
}
function toggleLike(type, id, btnEl) {
    var key = type + '_' + id;
    var userLikes = {}; try { userLikes = JSON.parse(localStorage.getItem('dns_user_likes') || '{}'); } catch(e) {}
    var allLikes = {}; try { allLikes = JSON.parse(localStorage.getItem('dns_likes') || '{}'); } catch(e) {}

    if (userLikes[key]) {
        delete userLikes[key];
        allLikes[key] = Math.max(0, (allLikes[key] || 1) - 1);
    } else {
        userLikes[key] = Date.now();
        allLikes[key] = (allLikes[key] || 0) + 1;
    }
    localStorage.setItem('dns_user_likes', JSON.stringify(userLikes));
    localStorage.setItem('dns_likes', JSON.stringify(allLikes));

    if (btnEl) {
        var icon = btnEl.querySelector('i');
        var count = btnEl.querySelector('.like-count');
        var liked = !!userLikes[key];
        if (icon) { icon.className = 'fa' + (liked ? 's' : 'r') + ' fa-heart'; icon.style.color = liked ? '#ef4444' : '#fff'; }
        if (count) count.textContent = allLikes[key] || 0;
        if (liked && icon) { icon.style.transform = 'scale(1.4)'; setTimeout(function(){ icon.style.transform = 'scale(1)'; }, 200); }
    }
    // Update lightbox like button if open
    var lbLikeBtn = document.querySelector('#dns-lightbox .like-btn');
    if (lbLikeBtn && lbLikeBtn !== btnEl) {
        var lbIcon = lbLikeBtn.querySelector('i');
        var lbCount = lbLikeBtn.querySelector('.like-count');
        var lbLiked = !!userLikes[key];
        if (lbIcon) { lbIcon.className = 'fa' + (lbLiked ? 's' : 'r') + ' fa-heart'; lbIcon.style.color = lbLiked ? '#ef4444' : 'rgba(255,255,255,0.9)'; }
        if (lbCount) lbCount.textContent = allLikes[key] || 0;
    }
}

function likeBtnHTML(type, id, style) {
    var likes = getLikeCount(type, id);
    var liked = hasUserLiked(type, id);
    var s = style || 'background:rgba(0,0,0,0.3);backdrop-filter:blur(4px);';
    return '<button class="like-btn" onclick="event.stopPropagation();toggleLike(\'' + type + '\',\'' + id + '\',this)" style="border:none;cursor:pointer;display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:20px;transition:all 0.2s;' + s + '">' +
        '<i class="fa' + (liked ? 's' : 'r') + ' fa-heart" style="color:' + (liked ? '#ef4444' : '#fff') + ';font-size:0.85rem;transition:all 0.2s;"></i>' +
        '<span class="like-count" style="color:#fff;font-size:0.7rem;font-weight:600;">' + likes + '</span></button>';
}

/* === PHOTO GALLERY === */
function syncPhotoGallery() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    var photos = SyncStore.get('dns_photos');
    if (!photos || photos.length === 0) return;

    window._galleryPhotos = photos;

    // Filter pills
    var filterBox = document.getElementById('gallery-filters');
    if (filterBox) {
        var cats = ['All'];
        photos.forEach(function(p) {
            var c = p.category || '';
            if (c && cats.indexOf(c) === -1) cats.push(c);
        });
        filterBox.innerHTML = cats.map(function(c) {
            var isActive = c === 'All';
            return '<button onclick="filterGallery(\'' + c.toLowerCase() + '\')" style="padding:0.4rem 1rem;border-radius:9999px;border:1.5px solid ' + (isActive ? '#1a237e' : '#cbd5e1') + ';background:' + (isActive ? 'linear-gradient(135deg,#1a237e,#3f51b5)' : '#fff') + ';color:' + (isActive ? '#fff' : '#334155') + ';font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s;" class="gallery-filter-btn' + (isActive ? ' active' : '') + '">' + c + '</button>';
        }).join('');
    }

    // Group by batchTitle
    var groups = {};
    var groupOrder = [];
    photos.forEach(function(p) {
        var key = p.batchTitle || p.date || p.title || 'Gallery';
        if (!groups[key]) { groups[key] = { date: p.date || '', photos: [] }; groupOrder.push(key); }
        groups[key].photos.push(p);
    });

    var html = '';
    var globalIdx = 0;
    groupOrder.forEach(function(title) {
        var group = groups[title];
        html += '<div style="margin-bottom:2.5rem;">';
        html += '<div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:1rem;">';
        html += '<i class="fas fa-folder-open" style="color:#1a237e;font-size:1.1rem;"></i>';
        html += '<span style="font-size:1rem;font-weight:700;color:#1e293b;">' + title + '</span>';
        if (group.date) html += '<span style="font-size:0.8rem;color:#94a3b8;">' + group.date + '</span>';
        html += '<span style="background:linear-gradient(135deg,#dbeafe,#c7d2fe);color:#1a237e;font-size:0.72rem;font-weight:600;padding:2px 10px;border-radius:9999px;">' + group.photos.length + ' photo' + (group.photos.length !== 1 ? 's' : '') + '</span>';
        html += '</div>';

        html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;">';
        group.photos.forEach(function(p) {
            html += '<div class="gallery-page-item" data-idx="' + globalIdx + '" data-category="' + (p.category || '').toLowerCase() + '" style="border-radius:0.625rem;overflow:hidden;position:relative;aspect-ratio:4/3;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform=\'scale(1.02)\';this.style.boxShadow=\'0 6px 20px rgba(0,0,0,0.15)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(0,0,0,0.08)\'">';
            html += '<img src="' + p.url + '" alt="' + p.title + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">';
            html += '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.8));padding:0.75rem 0.625rem 0.5rem;display:flex;align-items:flex-end;justify-content:space-between;">';
            html += '<div><div style="font-size:0.8rem;color:#fff;font-weight:600;line-height:1.2;">' + p.title + '</div>';
            html += '<div style="font-size:0.65rem;color:rgba(255,255,255,0.7);margin-top:0.125rem;">' + (p.category || '') + '</div></div>';
            html += likeBtnHTML('photo', p.id);
            html += '</div></div>';
            globalIdx++;
        });
        html += '</div></div>';
    });

    if (!document.getElementById('gallery-responsive-css')) {
        var style = document.createElement('style');
        style.id = 'gallery-responsive-css';
        style.textContent = '@media(max-width:900px){#gallery-grid [style*="grid-template-columns:repeat(4"]{grid-template-columns:repeat(3,1fr)!important}}@media(max-width:640px){#gallery-grid [style*="grid-template-columns:repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}';
        document.head.appendChild(style);
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.gallery-page-item').forEach(function(item) {
        item.addEventListener('click', function() { openGalleryLightbox(parseInt(item.dataset.idx)); });
    });

    window.filterGallery = function(cat) {
        document.querySelectorAll('.gallery-filter-btn').forEach(function(b) {
            var isActive = b.textContent.toLowerCase() === cat || (cat === 'all' && b.textContent === 'All');
            b.style.background = isActive ? 'linear-gradient(135deg,#1a237e,#3f51b5)' : '#fff';
            b.style.color = isActive ? '#fff' : '#334155';
            b.style.borderColor = isActive ? '#1a237e' : '#cbd5e1';
        });
        grid.querySelectorAll('.gallery-page-item').forEach(function(i) {
            i.style.display = (cat === 'all' || i.dataset.category === cat) ? '' : 'none';
        });
    };
}

/* === LIGHTBOX with LIKES + NAVIGATION === */
function openGalleryLightbox(idx) {
    var photos = window._galleryPhotos;
    if (!photos || photos.length === 0) return;
    var old = document.getElementById('dns-lightbox');
    if (old) old.remove();

    var lb = document.createElement('div');
    lb.id = 'dns-lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:10001;display:flex;align-items:center;justify-content:center;animation:popFadeIn 0.3s ease;';

    function renderLB(i) {
        var p = photos[i];
        var likes = getLikeCount('photo', p.id);
        var liked = hasUserLiked('photo', p.id);
        lb.innerHTML =
            '<button onclick="closeGalleryLB()" style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.15);border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1.1rem;z-index:2;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>' +
            '<button onclick="navGalleryLB(-1)" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:1.1rem;z-index:2;display:flex;align-items:center;justify-content:center;"><i class="fas fa-chevron-left"></i></button>' +
            '<button onclick="navGalleryLB(1)" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:1.1rem;z-index:2;display:flex;align-items:center;justify-content:center;"><i class="fas fa-chevron-right"></i></button>' +
            '<div style="text-align:center;max-width:90%;max-height:90%;">' +
            '<img src="' + p.url + '" alt="' + p.title + '" style="max-width:100%;max-height:75vh;border-radius:0.5rem;box-shadow:0 8px 40px rgba(0,0,0,0.5);">' +
            '<div style="color:#fff;margin-top:0.75rem;display:flex;align-items:center;justify-content:center;gap:1.25rem;">' +
            '<div><h4 style="font-size:1rem;font-weight:600;">' + p.title + '</h4>' +
            '<span style="font-size:0.8rem;color:#94a3b8;">' + (i + 1) + ' / ' + photos.length + (p.category ? ' · ' + p.category : '') + '</span></div>' +
            '<button class="like-btn" onclick="toggleLike(\'photo\',\'' + p.id + '\',this);event.stopPropagation();" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);cursor:pointer;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:24px;transition:all 0.2s;backdrop-filter:blur(4px);">' +
            '<i class="fa' + (liked ? 's' : 'r') + ' fa-heart" style="color:' + (liked ? '#ef4444' : 'rgba(255,255,255,0.9)') + ';font-size:1rem;transition:all 0.2s;"></i>' +
            '<span class="like-count" style="color:#fff;font-size:0.85rem;font-weight:600;">' + likes + '</span></button>' +
            '</div></div>';
    }

    window._lbIdx = idx;
    renderLB(idx);
    lb.addEventListener('click', function(e) { if (e.target === lb) closeGalleryLB(); });
    document.body.appendChild(lb);

    window._lbKeyHandler = function(e) {
        if (e.key === 'ArrowLeft') navGalleryLB(-1);
        else if (e.key === 'ArrowRight') navGalleryLB(1);
        else if (e.key === 'Escape') closeGalleryLB();
    };
    document.addEventListener('keydown', window._lbKeyHandler);

    window.navGalleryLB = function(dir) {
        window._lbIdx = (window._lbIdx + dir + photos.length) % photos.length;
        renderLB(window._lbIdx);
    };
    window.closeGalleryLB = function() {
        var el = document.getElementById('dns-lightbox');
        if (el) el.remove();
        if (window._lbKeyHandler) document.removeEventListener('keydown', window._lbKeyHandler);
    };
}

/* === VIDEO GALLERY with LIKES === */
function syncVideoGallery() {
    var page = document.querySelector('.page-banner h1');
    if (!page || !page.textContent.includes('Video')) return;
    var videos = SyncStore.get('dns_videos');
    if (!videos || videos.length === 0) return;

    var container = document.querySelector('.video-grid') || document.querySelector('.page-content .container') || document.querySelector('.page-content');
    if (!container) return;

    var groups = {};
    videos.forEach(function(v) {
        var key = v.date || 'Videos';
        if (!groups[key]) groups[key] = [];
        groups[key].push(v);
    });
    var sortedDates = Object.keys(groups).sort(function(a, b) { return b.localeCompare(a); });

    var html = '';
    sortedDates.forEach(function(date) {
        html += '<div style="margin-bottom:1.5rem;">';
        html += '<h3 style="font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:2px solid;border-image:linear-gradient(135deg,#7c3aed,#3b82f6) 1;"><i class="fas fa-calendar" style="color:#7c3aed;margin-right:0.5rem;"></i>' + date + ' <span style="font-size:0.75rem;color:#94a3b8;font-weight:400;">(' + groups[date].length + ' video' + (groups[date].length !== 1 ? 's' : '') + ')</span></h3>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">';
        groups[date].forEach(function(v) {
            var isUploaded = v.url && v.url.startsWith('data:');
            var thumbStyle = v.thumbnail ? 'background-image:url(' + v.thumbnail + ');background-size:cover;background-position:center;' : '';
            html += '<div class="video-card" style="border-radius:0.75rem;overflow:hidden;border:1px solid #e2e8f0;transition:transform 0.2s;" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'none\'">';
            html += '<div style="aspect-ratio:16/9;background:#1e293b;position:relative;display:flex;align-items:center;justify-content:center;' + thumbStyle + '">';
            if (isUploaded) {
                html += '<div onclick="var m=document.createElement(\'div\');m.style.cssText=\'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;\';m.innerHTML=\'<video src=&quot;' + v.url.replace(/'/g, "\\'") + '&quot; controls autoplay style=&quot;max-width:90%;max-height:90%;border-radius:0.75rem;&quot;></video>\';m.addEventListener(\'click\',function(e){if(e.target===m)m.remove();});document.body.appendChild(m);" style="width:56px;height:56px;background:rgba(255,255,255,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;"><i class="fas fa-play" style="font-size:1.25rem;color:#1e293b;margin-left:3px;"></i></div>';
            } else {
                html += '<a href="' + v.url + '" target="_blank" style="width:56px;height:56px;background:rgba(255,255,255,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;"><i class="fas fa-play" style="font-size:1.25rem;color:#1e293b;margin-left:3px;"></i></a>';
            }
            // Like button on video thumbnail
            html += '<div style="position:absolute;bottom:0.5rem;right:0.5rem;">' + likeBtnHTML('video', v.id) + '</div>';
            html += '</div><div style="padding:1rem;display:flex;align-items:center;justify-content:space-between;"><div><h4 style="font-size:0.9rem;font-weight:600;">' + v.title + '</h4>';
            if (v.description) html += '<p style="font-size:0.8rem;color:#64748b;margin-top:0.25rem;">' + v.description + '</p>';
            html += '</div></div></div>';
        });
        html += '</div></div>';
    });

    container.innerHTML = html;
}

function syncNewsPosts() {
    const section = document.querySelector('.announcements-content');
    if (!section) return;
    const posts = SyncStore.get('dns_posts').filter(p => p.published);
    if (posts.length === 0) return;

    const recent = posts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    section.innerHTML = recent.map(p =>
        '<div class="announcement-card" data-animate="fade-up"><div class="announcement-date"><span class="announcement-day">' +
        new Date(p.date).getDate() + '</span><span class="announcement-month">' +
        new Date(p.date).toLocaleString('en', { month: 'short' }) + '</span></div>' +
        '<div class="announcement-info"><span class="announcement-tag">' + p.category + '</span>' +
        '<h4>' + p.title + '</h4><p>' + (p.content || '').substring(0, 100) + '</p></div></div>'
    ).join('');
}

/* === Inject admin access bar === */
function injectAdminAccess() {
    if (window.location.pathname.includes('/admin/')) return;

    const footer = document.querySelector('footer') || document.body;
    const bar = document.createElement('div');
    bar.style.cssText = 'text-align:center;padding:10px 16px;background:linear-gradient(135deg,#050a14,#0f1847);border-top:1px solid #111827;display:flex;align-items:center;justify-content:center;gap:8px;';
    bar.innerHTML = '<i class="fas fa-lock" style="color:#475569;font-size:10px;"></i>' +
        '<span style="color:#475569;font-size:11px;">Administrator?</span>' +
        '<a href="admin/index.html" style="color:#94a3b8;font-size:11px;text-decoration:none;background:linear-gradient(135deg,#111827,#1e293b);padding:4px 14px;border-radius:20px;font-weight:500;transition:all 0.3s;border:1px solid #1e293b;" ' +
        'onmouseover="this.style.background=\'#1e293b\';this.style.color=\'#e2e8f0\'" ' +
        'onmouseout="this.style.background=\'linear-gradient(135deg,#111827,#1e293b)\';this.style.color=\'#94a3b8\'">' +
        '<i class="fas fa-sign-in-alt" style="margin-right:4px;"></i>Admin Login</a>';

    if (footer.tagName === 'FOOTER') {
        footer.parentNode.insertBefore(bar, footer.nextSibling);
    } else {
        document.body.appendChild(bar);
    }
}

/* === Homepage News Popup === */
function showNewsPopup() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    if (!isHome) return;

    var posts = SyncStore.get('dns_posts');
    if (!posts || posts.length === 0) return;
    var latest = posts.filter(function(p) { return p.published; }).sort(function(a, b) { return b.date.localeCompare(a.date); })[0];
    if (!latest) return;

    // Don't show if already dismissed in this session
    if (sessionStorage.getItem('dns_popup_dismissed_' + latest.id)) return;

    setTimeout(function() {
        var overlay = document.createElement('div');
        overlay.id = 'news-popup-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;animation:popFadeIn 0.3s ease;';

        var popup = document.createElement('div');
        popup.style.cssText = 'background:#fff;border-radius:1rem;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 25px 50px rgba(0,0,0,0.25);position:relative;';

        var header = '<div style="background:linear-gradient(135deg,#1a237e,#3f51b5);padding:1.5rem;border-radius:1rem 1rem 0 0;display:flex;align-items:center;gap:0.75rem;">' +
            '<div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;"><i class="fas fa-newspaper" style="color:#fff;"></i></div>' +
            '<div style="flex:1;"><h3 style="color:#fff;font-size:1rem;font-weight:700;">Latest News</h3>' +
            '<span style="color:rgba(255,255,255,0.7);font-size:0.75rem;">' + latest.date + '</span></div>' +
            '<button onclick="document.getElementById(\'news-popup-overlay\').remove();sessionStorage.setItem(\'dns_popup_dismissed_' + latest.id + '\',1);" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button></div>';

        var body = '<div style="padding:1.5rem;">';
        if (latest.image) body += '<img src="' + latest.image + '" style="width:100%;border-radius:0.5rem;margin-bottom:1rem;max-height:200px;object-fit:cover;">';
        body += '<span style="background:#eff6ff;color:#1e40af;font-size:0.75rem;font-weight:600;padding:0.25rem 0.75rem;border-radius:9999px;">' + (latest.category || 'News') + '</span>';
        body += '<h4 style="font-size:1.1rem;font-weight:700;margin:0.75rem 0 0.5rem;">' + latest.title + '</h4>';
        body += '<p style="font-size:0.9rem;color:#475569;line-height:1.6;">' + (latest.content || '').substring(0, 300) + '</p>';
        body += '</div>';

        popup.innerHTML = header + body;
        overlay.appendChild(popup);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
                sessionStorage.setItem('dns_popup_dismissed_' + latest.id, 1);
            }
        });
        document.body.appendChild(overlay);
    }, 12000);
}

/* === Sync Downloads Page === */
function syncDownloadsPage() {
    var page = document.querySelector('.page-banner h1');
    if (!page || !page.textContent.includes('Download')) return;
    var downloads = SyncStore.get('dns_downloads');
    if (!downloads || downloads.length === 0) return;

    var container = document.querySelector('.page-content .container') || document.querySelector('.page-content');
    if (!container) return;

    // Group by category
    var groups = {};
    downloads.forEach(function(d) {
        var cat = d.category || 'General';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(d);
    });

    var html = '';
    Object.keys(groups).forEach(function(cat) {
        html += '<div style="margin-bottom:2rem;"><h3 style="font-size:1.1rem;font-weight:700;color:#1e293b;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:2px solid;border-image:linear-gradient(135deg,#1a237e,#3f51b5) 1;"><i class="fas fa-folder" style="color:#1a237e;margin-right:0.5rem;"></i>' + cat + '</h3>';
        html += '<div style="display:grid;gap:0.75rem;">';
        groups[cat].forEach(function(d) {
            var fileUrl = d.fileData || d.url || '';
            html += '<div style="display:flex;align-items:center;gap:1rem;background:#fff;border:1px solid #e2e8f0;border-radius:0.75rem;padding:1rem;transition:box-shadow 0.2s;" onmouseover="this.style.boxShadow=\'0 4px 15px rgba(0,0,0,0.08)\'" onmouseout="this.style.boxShadow=\'none\'">';
            html += '<div style="width:48px;height:48px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:0.5rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-file-pdf" style="color:#ef4444;font-size:1.25rem;"></i></div>';
            html += '<div style="flex:1;"><h4 style="font-size:0.9rem;font-weight:600;color:#1e293b;">' + d.title + '</h4>';
            if (d.description) html += '<p style="font-size:0.8rem;color:#64748b;margin-top:0.125rem;">' + d.description + '</p>';
            html += '</div>';
            if (fileUrl) {
                if (fileUrl.startsWith('data:')) {
                    html += '<a href="' + fileUrl + '" download="' + d.title + '.pdf" style="background:linear-gradient(135deg,#1a237e,#3f51b5);color:#fff;padding:0.5rem 1rem;border-radius:0.5rem;text-decoration:none;font-size:0.8rem;font-weight:600;white-space:nowrap;"><i class="fas fa-download" style="margin-right:0.25rem;"></i>Download</a>';
                } else {
                    html += '<a href="' + fileUrl + '" target="_blank" style="background:linear-gradient(135deg,#1a237e,#3f51b5);color:#fff;padding:0.5rem 1rem;border-radius:0.5rem;text-decoration:none;font-size:0.8rem;font-weight:600;white-space:nowrap;"><i class="fas fa-download" style="margin-right:0.25rem;"></i>Download</a>';
                }
            }
            html += '</div>';
        });
        html += '</div></div>';
    });

    container.innerHTML = html;
}

function syncTwitterLink() {
    const c = SyncStore.get('dns_contact');
    if (!c || !c.twitter) return;
    document.querySelectorAll('a[aria-label="Twitter"]').forEach(el => el.href = c.twitter);
}

function syncToppersPage() {
    var container = document.getElementById('toppers-grid') || document.querySelector('.toppers-grid');
    if (!container) return;
    var toppers = SyncStore.get('dns_toppers');
    if (!toppers || toppers.length === 0) return;

    // Detect page type from title to filter ICSE vs ISC
    var pageTitle = document.title || '';
    var filterExam = '';
    if (pageTitle.indexOf('ICSE') !== -1) filterExam = 'ICSE';
    else if (pageTitle.indexOf('ISC') !== -1) filterExam = 'ISC';

    // Filter toppers by exam type if on a specific page
    var filtered = filterExam ? toppers.filter(function(t) {
        var exam = (t.exam || '').toUpperCase();
        return exam.indexOf(filterExam) !== -1;
    }) : toppers;

    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8;"><i class="fas fa-trophy" style="font-size:2rem;margin-bottom:1rem;"></i><p>No ' + (filterExam || '') + ' toppers added yet. Add them from the admin panel.</p></div>';
        return;
    }

    // Group by exam + year
    var groups = {};
    var groupOrder = [];
    filtered.forEach(function(t) {
        var key = t.exam || 'Other';
        if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
        groups[key].push(t);
    });

    var html = '<div style="display:grid;gap:2rem;">';
    groupOrder.forEach(function(exam) {
        var list = groups[exam].sort(function(a, b) { return (a.rank || 99) - (b.rank || 99); });
        html += '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">';
        // Header bar matching reference image style
        html += '<div style="background:linear-gradient(135deg,#1a237e,#3f51b5);padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;">';
        html += '<i class="fas fa-th-list" style="color:#fff;font-size:1rem;"></i>';
        html += '<h3 style="color:#fff;font-size:1rem;font-weight:700;">' + exam + '</h3>';
        html += '<span style="background:rgba(255,255,255,0.25);color:#fff;font-size:0.7rem;font-weight:600;padding:3px 12px;border-radius:9999px;margin-left:0.5rem;">' + list.length + ' student' + (list.length !== 1 ? 's' : '') + '</span></div>';
        // Topper rows — clean list matching reference image
        list.forEach(function(t, i) {
            var rankColors = { 1: 'background:linear-gradient(135deg,#fef3c7,#fde68a);color:#b45309;border:2px solid #f59e0b', 2: 'background:linear-gradient(135deg,#f1f5f9,#e2e8f0);color:#475569;border:2px solid #94a3b8', 3: 'background:linear-gradient(135deg,#fef2f2,#fecaca);color:#b91c1c;border:2px solid #f87171' };
            var rankStyle = rankColors[t.rank] || 'background:#f8fafc;color:#64748b;border:1px solid #e2e8f0';
            html += '<div style="display:flex;align-items:center;gap:1rem;padding:0.875rem 1.25rem;border-bottom:1px solid #f1f5f9;' + (i === 0 && t.rank === 1 ? 'background:#fffbeb;' : '') + '">';
            // Rank circle
            html += '<div style="min-width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.9rem;' + rankStyle + ';flex-shrink:0;">' + (t.rank || '-') + '</div>';
            // Photo circle
            html += '<div style="width:48px;height:48px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">';
            html += t.photo ? '<img src="' + t.photo + '" style="width:100%;height:100%;object-fit:cover;">' : '<i class="fas fa-user-graduate" style="color:#3b82f6;font-size:1.1rem;"></i>';
            // Name + marks
            html += '</div><div style="flex:1;"><h4 style="font-size:0.95rem;font-weight:600;color:#1e293b;">' + t.name + '</h4>';
            html += '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.25rem;"><span style="background:linear-gradient(135deg,#dcfce7,#bbf7d0);color:#166534;font-size:0.75rem;font-weight:600;padding:2px 8px;border-radius:9999px;">% ' + t.marks + '</span>';
            if (t.stream) html += '<span style="background:linear-gradient(135deg,#f3e8ff,#e9d5ff);color:#6b21a8;font-size:0.75rem;font-weight:600;padding:2px 8px;border-radius:9999px;">' + t.stream + '</span>';
            html += '</div>';
            if (t.subjects) html += '<p style="font-size:0.8rem;color:#94a3b8;margin-top:0.25rem;">' + t.subjects + '</p>';
            html += '</div></div>';
        });
        html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function injectHomepageAnnouncements() {
    var ticker = document.querySelector('.announcements-track');
    if (!ticker) return;
    // Already handled by syncAnnouncementsTicker
}

/* === INITIALIZE === */
document.addEventListener('DOMContentLoaded', function() {
    syncContactInfo();
    syncTwitterLink();
    syncHeroStats();
    syncAnnouncementsTicker();
    syncFacultyPage();
    syncGoverningBody();
    syncPhotoGallery();
    syncVideoGallery();
    syncNewsPosts();
    syncDownloadsPage();
    syncToppersPage();
    syncLeadershipPage();
    syncAnnouncementsPublicPage();
    injectAnnouncementsNav();
    injectLogo();
    injectAdminAccess();
    injectHomepageAnnouncements();
    showNewsPopup();
});

/* === LEADERSHIP CARDS (Full-width horizontal) === */
function syncLeadershipPage() {
    var container = document.querySelector('.staff-grid');
    if (!container) return;
    if (document.title.indexOf('Administrative') === -1) return;

    var data = SyncStore.get('dns_leadership');
    if (!data) return;

    // Override the grid layout on this specific page to block for full-width cards
    container.style.display = 'block';
    container.style.width = '100%';

    // Remove gap from the content-card heading above
    var headingCard = container.previousElementSibling;
    if (headingCard && headingCard.classList.contains('content-card')) {
        headingCard.style.marginBottom = '1rem';
        headingCard.style.paddingBottom = '1rem';
    }

    var roles = [
        { key: 'principal', badge: '#d97706', badgeBg: 'linear-gradient(135deg,#fef3c7,#fde68a)', icon: 'fa-crown', accent: '#b45309' },
        { key: 'vp', badge: '#2563eb', badgeBg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', icon: 'fa-star', accent: '#1d4ed8' },
        { key: 'coordinator', badge: '#16a34a', badgeBg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', icon: 'fa-shield-alt', accent: '#15803d' }
    ];

    var html = '';
    var hasAny = false;

    roles.forEach(function(r) {
        var d = data[r.key];
        if (!d || !d.active || !d.name) return;
        hasAny = true;

        var descId = 'leader-desc-' + r.key;
        var moreId = 'leader-more-' + r.key;

        // FULL-WIDTH HORIZONTAL BAR — photo left, info right
        html += '<div class="leadership-card" style="width:100%;background:#fff;border-radius:1rem;box-shadow:0 4px 24px rgba(0,0,0,0.07);overflow:hidden;border:1px solid #e2e8f0;margin-bottom:1.5rem;">';
        html += '<div style="display:flex;flex-wrap:wrap;">';

        // LEFT — Photo
        html += '<div style="width:220px;min-height:240px;flex-shrink:0;background:linear-gradient(135deg,#f8fafc,#eef2ff);display:flex;align-items:center;justify-content:center;overflow:hidden;">';
        if (d.photo) {
            html += '<img src="' + d.photo + '" alt="' + d.name + '" style="width:100%;height:100%;object-fit:cover;">';
        } else {
            html += '<div style="text-align:center;color:#94a3b8;"><i class="fas fa-user" style="font-size:3.5rem;"></i></div>';
        }
        html += '</div>';

        // RIGHT — Info (word-wrap enforced)
        html += '<div style="flex:1;padding:1.75rem 2rem;min-width:0;overflow:hidden;">';
        html += '<h2 style="font-size:1.3rem;font-weight:800;color:#1e293b;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.5px;">' + d.name + '</h2>';
        html += '<div style="margin-bottom:0.75rem;"><span style="display:inline-flex;align-items:center;gap:0.375rem;background:' + r.badgeBg + ';color:' + r.badge + ';font-size:0.7rem;font-weight:700;padding:0.35rem 0.75rem;border-radius:0.375rem;text-transform:uppercase;letter-spacing:0.5px;">';
        html += '<i class="fas ' + r.icon + '"></i> ' + d.role + '</span></div>';

        // Description — with proper word wrapping
        if (d.description) {
            var isLong = d.description.length > 200;
            var shortDesc = isLong ? d.description.substring(0, 200) + '...' : d.description;
            html += '<p id="' + descId + '" style="font-size:0.88rem;line-height:1.7;color:#475569;margin-bottom:0.75rem;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;">' + shortDesc + '</p>';
            if (isLong) {
                html += '<a href="javascript:void(0)" id="' + moreId + '" style="color:' + r.accent + ';font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px;cursor:pointer;" data-key="' + r.key + '"><i class="fas fa-chevron-down" style="font-size:0.6rem;"></i> Read more</a>';
            }
        }

        // Signature
        if (d.signature) {
            html += '<div style="margin-top:1rem;display:flex;justify-content:flex-end;"><img src="' + d.signature + '" alt="Signature" style="height:40px;"></div>';
        }
        html += '</div></div></div>';
    });

    if (hasAny) {
        container.innerHTML = html;
        // Bind Read More click handlers after DOM is populated
        roles.forEach(function(r) {
            var btn = document.getElementById('leader-more-' + r.key);
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    dnsToggleDesc(r.key);
                });
            }
        });
    } else {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8;"><i class="fas fa-users" style="font-size:2.5rem;margin-bottom:1rem;"></i><p>Leadership information will be updated soon.</p></div>';
    }

    // Store descriptions for toggle
    window._leaderData = data;

    // Responsive CSS for mobile stacking
    if (!document.getElementById('leadership-responsive-css')) {
        var style = document.createElement('style');
        style.id = 'leadership-responsive-css';
        style.textContent = '@media(max-width:640px){.leadership-card>div{flex-direction:column!important;}.leadership-card>div>div:first-child{width:100%!important;max-height:280px;}}';
        document.head.appendChild(style);
    }
}

/* Toggle Read More / Show Less for leadership descriptions */
function dnsToggleDesc(key) {
    var data = window._leaderData;
    if (!data || !data[key]) return;
    var descEl = document.getElementById('leader-desc-' + key);
    var btnEl = document.getElementById('leader-more-' + key);
    if (!descEl || !btnEl) return;
    var full = data[key].description || '';
    var short = full.length > 200 ? full.substring(0, 200) + '...' : full;
    if (descEl.dataset.expanded === 'true') {
        descEl.textContent = short;
        descEl.dataset.expanded = 'false';
        btnEl.innerHTML = '<i class="fas fa-chevron-down" style="font-size:0.6rem;"></i> Read more';
    } else {
        descEl.textContent = full;
        descEl.dataset.expanded = 'true';
        btnEl.innerHTML = '<i class="fas fa-chevron-up" style="font-size:0.6rem;"></i> Show less';
    }
}

/* === Sync Announcements Public Page === */
function syncAnnouncementsPublicPage() {
    var container = document.getElementById('announcements-list');
    if (!container) return;

    var data = SyncStore.get('dns_announcements');
    if (!data) return;
    var active = data.filter(function(a) { return a.active; });

    if (active.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8;"><i class="fas fa-bullhorn" style="font-size:2rem;margin-bottom:1rem;"></i><p>No announcements at this time.</p></div>';
        return;
    }

    container.innerHTML = active.map(function(a) {
        var html = '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:0.75rem;padding:1.25rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.04);display:flex;gap:1rem;align-items:flex-start;">';
        if (a.photo) {
            html += '<img src="' + a.photo + '" alt="" style="width:100px;height:80px;object-fit:cover;border-radius:0.5rem;flex-shrink:0;">';
        }
        html += '<div style="flex:1;"><i class="fas fa-bullhorn" style="color:#f59e0b;margin-right:0.5rem;"></i>';
        html += '<span style="font-size:0.95rem;font-weight:500;color:#1e293b;">' + a.text + '</span>';
        html += '<div style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;"><i class="fas fa-calendar" style="margin-right:0.25rem;"></i>' + (a.createdAt || '') + '</div>';
        html += '</div></div>';
        return html;
    }).join('');
}

/* === Inject Announcements link into School dropdown === */
function injectAnnouncementsNav() {
    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
        var isSchoolDropdown = false;
        dropdown.querySelectorAll('a').forEach(function(link) {
            if (link.textContent.indexOf('School Time') > -1 || link.textContent.indexOf('School Prayer') > -1) {
                isSchoolDropdown = true;
            }
        });
        if (!isSchoolDropdown) return;
        var exists = false;
        dropdown.querySelectorAll('a').forEach(function(link) {
            if (link.textContent.indexOf('Announcements') > -1) exists = true;
        });
        if (exists) return;
        var li = document.createElement('li');
        li.innerHTML = '<a href="announcements.html"><i class="fas fa-bullhorn"></i> Announcements</a>';
        dropdown.appendChild(li);
    });
}

/* === Inject School Logo === */
function injectLogo() {
    document.querySelectorAll('.logo-emblem').forEach(function(el) {
        if (el.textContent.trim() === 'DN') {
            el.innerHTML = '<img src="images/logo.jpg" alt="De Nobili School" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">';
            el.style.padding = '0';
            el.style.overflow = 'hidden';
        }
    });
}
