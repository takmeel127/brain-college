/* ============================================================
   THE BRAIN COLLEGE BHAKKAR — Auth System
   localStorage-based authentication
   ============================================================ */

'use strict';

const BC_AUTH = {

  // ── Storage Keys ──
  KEYS: {
    USERS:        'bc_users',
    CURRENT_USER: 'bc_current_user',
    POSTS:        'bc_posts',
    RESULTS:      'bc_results',
    ADMISSIONS:   'bc_admissions',
    MEDIA:        'bc_media',
  },

  // ── Seed admin + demo data on first load ──
  init() {
    // Admin account
    if (!this.getUserByEmail('admin123@gmail.com')) {
      const users = this.getAllUsers();
      users.push({
        id:        'admin-001',
        name:      'Administrator',
        email:     'admin123@gmail.com',
        password:  'admin123',
        role:      'admin',
        phone:     '0333-8044574',
        createdAt: new Date().toISOString(),
        avatar:    'A',
      });
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    // Demo student account
    if (!this.getUserByEmail('student@brain.com')) {
      const users = this.getAllUsers();
      users.push({
        id:          'stu-001',
        name:        'Muhammad Ali',
        email:       'student@brain.com',
        password:    'student123',
        role:        'student',
        phone:       '0333-1234567',
        rollNo:      'BRAIN-2026-10125',
        course:      'Computer Application',
        createdAt:   new Date().toISOString(),
        avatar:      'M',
      });
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    // Seed demo posts
    if (!localStorage.getItem(this.KEYS.POSTS)) {
      const posts = [
        {
          id:        'post-001',
          title:     'Admissions Open 2026 — Apply Today!',
          content:   'New batch admissions are now open for all courses. Limited seats are available. Apply online or visit our campus at Darya Khan Road, Bhakkar.',
          category:  'Announcement',
          image:     '',
          published: true,
          author:    'Administrator',
          createdAt: '2026-08-27T10:00:00.000Z',
          updatedAt: '2026-08-27T10:00:00.000Z',
        },
        {
          id:        'post-002',
          title:     'New Batch for Typing Course Starting September 2026',
          content:   'Registration for Typing English & Urdu course is now open. Classes start in September 2026. Contact us for more information.',
          category:  'News',
          image:     '',
          published: true,
          author:    'Administrator',
          createdAt: '2026-08-20T09:00:00.000Z',
          updatedAt: '2026-08-20T09:00:00.000Z',
        },
        {
          id:        'post-003',
          title:     'Certificate Distribution Ceremony 2026',
          content:   'Annual certificate distribution ceremony was held for students who completed their courses. Congratulations to all graduates!',
          category:  'Event',
          image:     '',
          published: true,
          author:    'Administrator',
          createdAt: '2026-08-10T08:00:00.000Z',
          updatedAt: '2026-08-10T08:00:00.000Z',
        },
      ];
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
    }

    // Seed demo results
    if (!localStorage.getItem(this.KEYS.RESULTS)) {
      const results = [
        { id:'res-001', rollNo:'BRAIN-2026-10125', studentName:'Muhammad Ali',   course:'Computer Application', batch:'2026', marks:88,  total:100, grade:'A',  percentage:'88%', status:'Pass', publishedAt:'2026-08-27' },
        { id:'res-002', rollNo:'BRAIN-2026-20200', studentName:'Ahmad Raza',      course:'MS Office',            batch:'2026', marks:75,  total:100, grade:'B',  percentage:'75%', status:'Pass', publishedAt:'2026-08-27' },
        { id:'res-003', rollNo:'BRAIN-2026-30088', studentName:'Fatima Tariq',    course:'Typing English & Urdu',batch:'2026', marks:92,  total:100, grade:'A+', percentage:'92%', status:'Pass', publishedAt:'2026-08-27' },
        { id:'res-004', rollNo:'BRAIN-2026-40301', studentName:'Usman Khan',      course:'ACIT',                 batch:'2026', marks:65,  total:100, grade:'C',  percentage:'65%', status:'Pass', publishedAt:'2026-08-27' },
        { id:'res-005', rollNo:'BRAIN-2026-50045', studentName:'Zara Bibi',       course:'Shorthand',            batch:'2026', marks:78,  total:100, grade:'B+', percentage:'78%', status:'Pass', publishedAt:'2026-08-27' },
        { id:'res-006', rollNo:'BRAIN-2026-60112', studentName:'Sajid Hussain',   course:'Computer Application', batch:'2026', marks:45,  total:100, grade:'D',  percentage:'45%', status:'Fail', publishedAt:'2026-08-27' },
        { id:'res-007', rollNo:'BRAIN-2026-70089', studentName:'Nadia Bano',      course:'MS Office',            batch:'2026', marks:95,  total:100, grade:'A+', percentage:'95%', status:'Pass', publishedAt:'2026-08-27' },
      ];
      localStorage.setItem(this.KEYS.RESULTS, JSON.stringify(results));
    }
  },

  // ── User Helpers ──
  getAllUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
  },

  getMedia(type) {
    const media = JSON.parse(localStorage.getItem(this.KEYS.MEDIA) || '{}');
    return Array.isArray(media[type]) ? media[type] : [];
  },

  saveMedia(type, item) {
    const media = JSON.parse(localStorage.getItem(this.KEYS.MEDIA) || '{}');
    media[type] = this.getMedia(type).filter(existing => existing.id !== item.id);
    media[type].push(item);
    localStorage.setItem(this.KEYS.MEDIA, JSON.stringify(media));
    return item;
  },

  deleteMedia(type, id) {
    const media = JSON.parse(localStorage.getItem(this.KEYS.MEDIA) || '{}');
    media[type] = this.getMedia(type).filter(item => item.id !== id);
    localStorage.setItem(this.KEYS.MEDIA, JSON.stringify(media));
  },

  getUserByEmail(email) {
    return this.getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById(id) {
    return this.getAllUsers().find(u => u.id === id) || null;
  },

  // ── Auth Actions ──
  login(email, password) {
    const user = this.getUserByEmail(email);
    if (!user) return { ok: false, msg: 'Email not found. Please sign up first.' };
    if (user.password !== password) return { ok: false, msg: 'Incorrect password. Please try again.' };
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    return { ok: true, user };
  },

  signup(data) {
    if (this.getUserByEmail(data.email)) {
      return { ok: false, msg: 'This email is already registered. Please login.' };
    }
    const newUser = {
      id:          'stu-' + Date.now(),
      name:        data.name,
      email:       data.email,
      password:    data.password,
      role:        'student',
      phone:       data.phone || '',
      rollNo:      'BRAIN-2026-' + (Math.floor(Math.random() * 90000) + 10000),
      course:      data.course || '',
      createdAt:   new Date().toISOString(),
      avatar:      data.name.charAt(0).toUpperCase(),
    };
    const users = this.getAllUsers();
    users.push(newUser);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { ok: true, user: newUser };
  },

  logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    window.location.href = this.getBaseUrl() + 'get-started.html';
  },

  currentUser() {
    return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER) || 'null');
  },

  isLoggedIn() {
    return !!this.currentUser();
  },

  isAdmin() {
    const u = this.currentUser();
    return u && u.role === 'admin';
  },

  updateUser(updatedData) {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === updatedData.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(users[idx]));
      return true;
    }
    return false;
  },

  // ── Posts ──
  getPosts(onlyPublished = true) {
    const posts = JSON.parse(localStorage.getItem(this.KEYS.POSTS) || '[]');
    return onlyPublished ? posts.filter(p => p.published) : posts;
  },

  getPostById(id) {
    return this.getPosts(false).find(p => p.id === id) || null;
  },

  savePost(post) {
    const posts = this.getPosts(false);
    if (post.id) {
      const idx = posts.findIndex(p => p.id === post.id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...post, updatedAt: new Date().toISOString() };
      } else {
        posts.push({ ...post, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
    } else {
      post.id = 'post-' + Date.now();
      post.createdAt = new Date().toISOString();
      post.updatedAt = new Date().toISOString();
      post.author = this.currentUser()?.name || 'Admin';
      posts.push(post);
    }
    localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
    return post;
  },

  deletePost(id) {
    const posts = this.getPosts(false).filter(p => p.id !== id);
    localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
  },

  togglePostPublish(id) {
    const posts = this.getPosts(false);
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx].published = !posts[idx].published;
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
      return posts[idx].published;
    }
    return null;
  },

  // ── Results ──
  getAllResults() {
    return JSON.parse(localStorage.getItem(this.KEYS.RESULTS) || '[]');
  },

  getResultByRollNo(rollNo) {
    return this.getAllResults().find(r => r.rollNo.toLowerCase() === rollNo.toLowerCase()) || null;
  },

  saveResult(result) {
    const results = this.getAllResults();
    if (result.id) {
      const idx = results.findIndex(r => r.id === result.id);
      if (idx !== -1) results[idx] = result;
      else results.push(result);
    } else {
      result.id = 'res-' + Date.now();
      result.publishedAt = new Date().toISOString().split('T')[0];
      results.push(result);
    }
    localStorage.setItem(this.KEYS.RESULTS, JSON.stringify(results));
    return result;
  },

  deleteResult(id) {
    const results = this.getAllResults().filter(r => r.id !== id);
    localStorage.setItem(this.KEYS.RESULTS, JSON.stringify(results));
  },

  // ── Admissions ──
  getAllAdmissions() {
    return JSON.parse(localStorage.getItem(this.KEYS.ADMISSIONS) || '[]');
  },

  saveAdmission(app) {
    const apps = this.getAllAdmissions();
    if (!app.id) {
      app.id = 'BRAIN-2026-' + (Math.floor(Math.random() * 90000) + 10000);
      app.createdAt = new Date().toISOString();
      app.status = 'pending';
    }
    apps.push(app);
    localStorage.setItem(this.KEYS.ADMISSIONS, JSON.stringify(apps));
    return app;
  },

  updateAdmissionStatus(id, status) {
    const apps = this.getAllAdmissions();
    const idx = apps.findIndex(a => a.id === id);
    if (idx !== -1) {
      apps[idx].status = status;
      localStorage.setItem(this.KEYS.ADMISSIONS, JSON.stringify(apps));
      return true;
    }
    return false;
  },

  // ── Utility ──
  getBaseUrl() {
    const path = window.location.pathname;
    if (path.includes('/admin/')) return '../';
    return '';
  },

  formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  requireLogin(redirectTo) {
    if (!this.isLoggedIn()) {
      window.location.href = this.getBaseUrl() + 'login.html?redirect=' + encodeURIComponent(redirectTo || window.location.href);
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = this.getBaseUrl() + 'login.html?redirect=admin/dashboard.html';
      return false;
    }
    return true;
  },
};

// Auto-init
BC_AUTH.init();

// ── Inject Navbar Auth UI on every page ──
document.addEventListener('DOMContentLoaded', () => {
  BC_AUTH.injectNavbarAuth();
});

BC_AUTH.injectNavbarAuth = function() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  const applyBtn = navActions.querySelector('.nav-apply-btn');
  const user = this.currentUser();
  const mobileLinks = document.querySelector('.mobile-nav-links');

  if (user) {
    // Remove old "Get Started" if present
    const oldGs = navActions.querySelector('.nav-getstarted-btn');
    if (oldGs) oldGs.remove();

    // Build profile dropdown
    if (!navActions.querySelector('.nav-profile-wrap')) {
      const isAdm = user.role === 'admin';
      const wrap = document.createElement('div');
      wrap.className = 'nav-profile-wrap';
      wrap.innerHTML = `
        <button class="nav-profile-btn" id="navProfileBtn">
          <div class="nav-profile-avatar">${user.avatar || user.name.charAt(0)}</div>
          <span class="nav-profile-name">${user.name.split(' ')[0]}</span>
          <i class="fas fa-chevron-down" style="font-size:0.6rem;margin-left:4px;"></i>
        </button>
        <div class="nav-profile-dropdown" id="navProfileDropdown">
          <div class="npd-header">
            <div class="npd-avatar">${user.avatar || user.name.charAt(0)}</div>
            <div>
              <div class="npd-name">${user.name}</div>
              <div class="npd-email">${user.email}</div>
              <div class="npd-role">${isAdm ? '🛡️ Admin' : '🎓 Student'}</div>
            </div>
          </div>
          <div class="npd-divider"></div>
          ${isAdm ? `
          <a href="${BC_AUTH.getBaseUrl()}admin/dashboard.html" class="npd-item"><i class="fas fa-tachometer-alt"></i> Admin Dashboard</a>
          <a href="${BC_AUTH.getBaseUrl()}admin/posts.html" class="npd-item"><i class="fas fa-pen-nib"></i> Write Post</a>
          <a href="${BC_AUTH.getBaseUrl()}admin/results.html" class="npd-item"><i class="fas fa-poll"></i> Upload Results</a>
          <a href="${BC_AUTH.getBaseUrl()}admin/admissions.html" class="npd-item"><i class="fas fa-file-alt"></i> Admissions</a>
          <div class="npd-divider"></div>
          ` : `
          <a href="${BC_AUTH.getBaseUrl()}user-dashboard.html" class="npd-item"><i class="fas fa-user"></i> My Dashboard</a>
          <a href="${BC_AUTH.getBaseUrl()}results.html" class="npd-item"><i class="fas fa-poll"></i> Check Result</a>
          <a href="${BC_AUTH.getBaseUrl()}admission-status.html" class="npd-item"><i class="fas fa-search"></i> Admission Status</a>
          <div class="npd-divider"></div>
          `}
          <button class="npd-item npd-logout" onclick="BC_AUTH.logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      `;
      // Insert before apply btn
      if (applyBtn) navActions.insertBefore(wrap, applyBtn);
      else navActions.appendChild(wrap);

      // Toggle dropdown
      document.getElementById('navProfileBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('navProfileDropdown').classList.toggle('open');
      });
      document.addEventListener('click', () => {
        const dd = document.getElementById('navProfileDropdown');
        if (dd) dd.classList.remove('open');
      });
    }

    if (mobileLinks && !mobileLinks.querySelector('.mobile-account-link')) {
      const accountLink = document.createElement('a');
      accountLink.href = this.getBaseUrl() + (user.role === 'admin' ? 'admin/dashboard.html' : 'user-dashboard.html');
      accountLink.className = 'mobile-nav-link mobile-account-link';
      accountLink.innerHTML = `<i class="fas ${user.role === 'admin' ? 'fa-tachometer-alt' : 'fa-user'}"></i> ${user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}`;
      mobileLinks.appendChild(accountLink);
    }
  } else {
    // Show "Get Started" button
    if (!navActions.querySelector('.nav-getstarted-btn')) {
      const btn = document.createElement('a');
      btn.href = BC_AUTH.getBaseUrl() + 'get-started.html';
      btn.className = 'nav-getstarted-btn';
      btn.innerHTML = '<i class="fas fa-rocket"></i> Get Started';
      if (applyBtn) navActions.insertBefore(btn, applyBtn);
      else navActions.appendChild(btn);
    }
  }
};
