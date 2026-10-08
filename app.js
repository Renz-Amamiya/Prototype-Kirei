/**
 * Bengkel Koding - Kirei Sistem Reservasi Ruangan
 * Shared Application Interactivity & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFloorSelectors();
  initModals();
  initFileUploads();
});

// Mobile Sidebar Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.app-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('mobile-open') &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        sidebar.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Floor Selector Event
function initFloorSelectors() {
  const floorSelects = document.querySelectorAll('.floor-pill, #floorSelect');
  floorSelects.forEach((select) => {
    select.addEventListener('change', (e) => {
      const selectedFloor = e.target.value;
      showToast(`Menampilkan jadwal untuk ${selectedFloor}`, 'info');
    });
  });
}

// Modal System with Escape key support
function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });

    const closeBtns = overlay.querySelectorAll('.modal-close-btn, [data-close-modal]');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => closeModal(overlay));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea');
    if (firstFocusable) firstFocusable.focus();
  }
}

function closeModal(modalElement) {
  modalElement.classList.remove('open');
}

// File Upload Handler with Dynamic Label Update
function initFileUploads() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const statusElement = document.querySelector('.upload-status-sub');
      if (file && statusElement) {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Ukuran berkas melebihi 5 MB. Harap pilih berkas lain.', 'info');
          input.value = '';
          statusElement.textContent = 'Belum ada berkas yang dipilih';
          return;
        }
        statusElement.textContent = `Berkas dipilih: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        showToast(`Berkas ${file.name} siap diunggah`, 'success');
      }
    });
  });
}

// Accessible Toast Notification System
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}
