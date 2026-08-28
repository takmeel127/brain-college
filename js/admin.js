/* ============================================================
   THE BRAIN COLLEGE BHAKKAR — Admin Panel JavaScript
   ============================================================ */

'use strict';

function initAdminPageTransitions() {
  const transitionLayer = document.createElement('div');
  transitionLayer.className = 'admin-page-transition';
  document.body.appendChild(transitionLayer);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

    link.addEventListener('click', event => {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault();
      transitionLayer.classList.add('active');
      window.setTimeout(() => { window.location.href = destination.href; }, 180);
    });
  });
}

initAdminPageTransitions();

/* ── Sidebar Toggle (Mobile) ── */
const sidebarToggle = document.querySelector('.topbar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

function openSidebar() {
  adminSidebar?.classList.add('open');
  sidebarOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  adminSidebar?.classList.remove('open');
  sidebarOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

sidebarToggle?.addEventListener('click', openSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

/* ── Active Sidebar Link ── */
function setActiveSidebarLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
    else link.classList.remove('active');
  });
}
setActiveSidebarLink();

/* ── Toast Notifications ── */
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info} toast-icon"></i><span class="toast-text">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

/* ── Modal System ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.openModal = openModal;
window.closeModal = closeModal;

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Close buttons
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Open modal buttons
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.openModal));
});

/* ── Table Search & Filter ── */
function initTableSearch() {
  const searchInput = document.querySelector('.search-input');
  const tbody = document.querySelector('tbody');
  if (!searchInput || !tbody) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const rows = tbody.querySelectorAll('tr');
    let visible = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const show = !query || text.includes(query);
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Update count
    const countEl = document.querySelector('.results-count');
    if (countEl) countEl.textContent = `${visible} results`;
  });
}
initTableSearch();

/* ── Filter Select ── */
function initFilterSelect() {
  const filterSelects = document.querySelectorAll('.filter-select[data-filter-col]');
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      applyFilters();
    });
  });

  function applyFilters() {
    const filters = [];
    filterSelects.forEach(s => {
      if (s.value) filters.push({ col: parseInt(s.dataset.filterCol), val: s.value.toLowerCase() });
    });

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let show = true;
      filters.forEach(f => {
        if (cells[f.col] && !cells[f.col].textContent.toLowerCase().includes(f.val)) {
          show = false;
        }
      });
      row.style.display = show ? '' : 'none';
    });
  }
}
initFilterSelect();

/* ── Status Update (Admissions) ── */
function updateApplicationStatus(id, newStatus) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  const statusCell = row.querySelector('.status-badge');
  if (!statusCell) return;

  const statusMap = {
    approved: { text: 'Approved', cls: 'badge-approved' },
    rejected: { text: 'Rejected', cls: 'badge-rejected' },
    pending: { text: 'Pending', cls: 'badge-pending' },
    review: { text: 'Under Review', cls: 'badge-review' },
    enrolled: { text: 'Enrolled', cls: 'badge-enrolled' },
  };

  const s = statusMap[newStatus];
  if (s) {
    statusCell.textContent = s.text;
    statusCell.className = `badge status-badge ${s.cls}`;
    showToast(`Application ${id} status updated to ${s.text}`, 'success');
  }
}
window.updateApplicationStatus = updateApplicationStatus;

/* ── Delete Confirmation ── */
function confirmDelete(message, callback) {
  if (window.confirm(message || 'Are you sure you want to delete this record?')) {
    callback();
  }
}
window.confirmDelete = confirmDelete;

/* ── Row Actions ── */
document.querySelectorAll('.btn-delete-row').forEach(btn => {
  btn.addEventListener('click', () => {
    confirmDelete('Delete this record? This cannot be undone.', () => {
      const row = btn.closest('tr');
      if (row) {
        row.style.opacity = '0';
        row.style.transition = 'opacity 0.3s ease';
        setTimeout(() => row.remove(), 300);
        showToast('Record deleted successfully.', 'success');
      }
    });
  });
});

/* ── Admin Forms ── */
function initAdminForms() {
  document.querySelectorAll('.admin-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        btn.style.background = 'var(--success)';
        showToast('Changes saved successfully!', 'success');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';

          // Close modal if inside one
          const modal = form.closest('.modal-overlay');
          if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
          }
        }, 1500);
      }, 900);
    });
  });
}
initAdminForms();

/* ── Counter animation for dashboard stats ── */
function animateAdminCounters() {
  document.querySelectorAll('.stat-card-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Run counter on load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateAdminCounters, 300);
});

/* ── Login Form ── */
const loginForm = document.getElementById('adminLoginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value?.trim();
    const btn = loginForm.querySelector('[type="submit"]');

    if (!username || !password) {
      showToast('Please enter username and password.', 'error');
      return;
    }

    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      if (username === 'admin' && password === 'brain2026') {
        btn.innerHTML = '<i class="fas fa-check"></i> Success!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        showToast('Welcome back, Admin!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      } else {
        btn.innerHTML = orig;
        btn.disabled = false;
        showToast('Invalid username or password.', 'error');
        const errEl = document.getElementById('loginError');
        if (errEl) { errEl.textContent = 'Invalid credentials. Try admin / brain2026'; errEl.style.display = 'block'; }
      }
    }, 1000);
  });
}

/* ── Toggle Password ── */
document.querySelectorAll('.login-toggle-pw').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      toggle.className = 'fas fa-eye-slash login-toggle-pw';
    } else {
      input.type = 'password';
      toggle.className = 'fas fa-eye login-toggle-pw';
    }
  });
});

/* ── Inline Status Approve/Reject ── */
document.querySelectorAll('[data-status-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.statusAction;
    const rowId = btn.closest('tr')?.dataset.id;
    if (action === 'approve') {
      btn.closest('tr').querySelector('.status-badge').textContent = 'Approved';
      btn.closest('tr').querySelector('.status-badge').className = 'badge status-badge badge-approved';
      showToast('Application approved!', 'success');
    } else if (action === 'reject') {
      btn.closest('tr').querySelector('.status-badge').textContent = 'Rejected';
      btn.closest('tr').querySelector('.status-badge').className = 'badge status-badge badge-rejected';
      showToast('Application rejected.', 'warning');
    }
  });
});

/* ── Course Toggle Active/Inactive ── */
document.querySelectorAll('[data-toggle-course]').forEach(btn => {
  btn.addEventListener('click', () => {
    const badge = btn.closest('.admin-course-card')?.querySelector('.badge');
    if (!badge) return;
    if (badge.classList.contains('badge-active')) {
      badge.classList.replace('badge-active', 'badge-inactive');
      badge.textContent = 'Inactive';
      btn.textContent = 'Activate';
      showToast('Course deactivated.', 'warning');
    } else {
      badge.classList.replace('badge-inactive', 'badge-active');
      badge.textContent = 'Available';
      btn.textContent = 'Deactivate';
      showToast('Course activated!', 'success');
    }
  });
});

/* ── Message Mark Read ── */
document.querySelectorAll('[data-mark-read]').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const badge = row?.querySelector('.status-badge');
    if (badge) {
      badge.textContent = 'Read';
      badge.className = 'badge status-badge badge-read';
      showToast('Message marked as read.', 'success');
    }
  });
});

/* ── Logout ── */
document.querySelectorAll('[data-logout]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = 'index.html';
    }
  });
});

/* ── Print application ── */
document.querySelectorAll('[data-print]').forEach(btn => {
  btn.addEventListener('click', () => window.print());
});

