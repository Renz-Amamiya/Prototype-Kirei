/**
 * Bengkel Koding - Kirei Sistem Reservasi Ruangan
 * Admin Operational Interactivity & Dynamic UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminNavigation();
  initPindahJadwalFilter();
  initDetailPindahActions();
  initBuatReservasiInteractions();
  initMonitoringMatriks();
  initActivityLogFilter();
  initModalsSystem();
  initDashboardQueueTabs();
  initDetailReservasiActions();
  initPersetujuanReservasiFilter();
  initHistoriHandlers();
});

// Mobile Sidebar Navigation
function initAdminNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.app-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

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

// Persetujuan Pindah Jadwal - Filtering
function initPindahJadwalFilter() {
  const searchInput = document.getElementById('searchMutasi');
  const roleSelect = document.getElementById('filterRole');
  const jenisSelect = document.getElementById('filterJenis');
  const statusSelect = document.getElementById('filterStatus');
  const table = document.getElementById('tabelPindahJadwal');
  const resetBtn = document.getElementById('btnResetFilter');

  if (!table) return;

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const roleVal = roleSelect?.value || 'all';
    const jenisVal = jenisSelect?.value || 'all';
    const statusVal = statusSelect?.value || 'all';

    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const role = row.getAttribute('data-role') || '';
      const jenis = row.getAttribute('data-jenis') || '';
      const status = row.getAttribute('data-status') || '';

      const matchQ = !q || text.includes(q);
      const matchRole = roleVal === 'all' || role === roleVal;
      const matchJenis = jenisVal === 'all' || jenis === jenisVal;
      const matchStatus = statusVal === 'all' || status === statusVal;

      if (matchQ && matchRole && matchJenis && matchStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    const counter = document.getElementById('antreanCountDisplay');
    if (counter) counter.textContent = visibleCount;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (roleSelect) roleSelect.addEventListener('change', applyFilters);
  if (jenisSelect) jenisSelect.addEventListener('change', applyFilters);
  if (statusSelect) statusSelect.addEventListener('change', applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (roleSelect) roleSelect.value = 'all';
      if (jenisSelect) jenisSelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      applyFilters();
      showToast('Parameter filter berhasil direset.', 'info');
    });
  }

  // Batch Approval
  const btnBatchApprove = document.getElementById('btnBatchApprove');
  if (btnBatchApprove) {
    btnBatchApprove.addEventListener('click', () => {
      if (confirm('Konfirmasi: Setujui semua permohonan mutasi sementara yang berstatus Menunggu Review?')) {
        const rows = table.querySelectorAll('tbody tr[data-jenis="sementara"]');
        rows.forEach(row => {
          const badge = row.querySelector('.status-col-badge');
          if (badge) {
            badge.className = 'status-col-badge badge-decision-approved';
            badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Disetujui';
          }
          row.setAttribute('data-status', 'disetujui');
        });
        showToast('4 permohonan sementara berhasil disetujui secara massal dan tersinkron ke SIAKAD.', 'success');
      }
    });
  }
}

// Detail Persetujuan Pindah Jadwal - Decision Actions
function initDetailPindahActions() {
  const btnApprove = document.getElementById('btnApprovePindah');
  const btnReject = document.getElementById('btnRejectPindah');
  const notesInput = document.getElementById('adminDecisionNotes');
  const statusPill = document.getElementById('detailStatusBadge');

  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      if (confirm('Konfirmasi: Setujui permohonan perpindahan jadwal Ruang H.1.2 ke Ruang H.1.5?')) {
        if (statusPill) {
          statusPill.textContent = 'Status: Disetujui (Tersinkron SIAKAD)';
          statusPill.style.background = '#dcfce7';
          statusPill.style.color = '#15803d';
        }
        btnApprove.disabled = true;
        btnReject.disabled = true;
        btnApprove.textContent = 'Perpindahan Telah Disetujui';
        showToast('Permohonan #PR-2026-0042 berhasil disetujui. Notifikasi WhatsApp & SIAKAD telah dikirim.', 'success');
      }
    });
  }

  if (btnReject) {
    btnReject.addEventListener('click', () => {
      const reason = notesInput ? notesInput.value.trim() : '';
      if (!reason) {
        alert('Harap tuliskan alasan penolakan pada kolom catatan di atas sebelum menolak permohonan.');
        if (notesInput) notesInput.focus();
        return;
      }
      if (confirm('Konfirmasi: Tolak permohonan perpindahan jadwal ini?')) {
        if (statusPill) {
          statusPill.textContent = 'Status: Ditolak Admin';
          statusPill.style.background = '#fee2e2';
          statusPill.style.color = '#b91c1c';
        }
        btnApprove.disabled = true;
        btnReject.disabled = true;
        showToast('Permohonan #PR-2026-0042 telah ditolak dengan catatan teknis.', 'info');
      }
    });
  }
}

// Buat Reservasi Form Handler
function initBuatReservasiInteractions() {
  const form = document.getElementById('formBuatReservasi');
  const roomSelect = document.getElementById('selectRuangKampus');
  const previewRoomName = document.getElementById('previewRoomTitle');
  const previewRoomSub = document.getElementById('previewRoomSub');
  const charCounter = document.getElementById('descCharCounter');
  const descTextarea = document.getElementById('inputAgendaKegiatan');
  const typeCards = document.querySelectorAll('.type-radio-card');

  // Radio Type Switcher
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Dynamic Room Preview Update
  if (roomSelect && previewRoomName) {
    roomSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val.includes('H.1.3')) {
        previewRoomName.textContent = 'Ruang H.1.3 - Lantai 1';
        if (previewRoomSub) previewRoomSub.textContent = 'Kapasitas 45 Kursi Kuliah • AC, Proyektor';
      } else if (val.includes('H.1.5')) {
        previewRoomName.textContent = 'Ruang H.1.5 - Lantai 1';
        if (previewRoomSub) previewRoomSub.textContent = 'Kapasitas 50 Kursi Kuliah • Multimedia Lengkap';
      } else if (val.includes('Lab 5.1')) {
        previewRoomName.textContent = 'Lab Komputer 5.1 - Lantai 5';
        if (previewRoomSub) previewRoomSub.textContent = 'Kapasitas 36 Komputer PC • Gigabit LAN';
      }
      showToast('Ruangan diperbarui pada pratinjau.', 'info');
    });
  }

  // Character Counter
  if (descTextarea && charCounter) {
    descTextarea.addEventListener('input', () => {
      const len = descTextarea.value.length;
      charCounter.textContent = `${len} / 250 karakter`;
    });
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pemesan = document.getElementById('selectPemesan')?.value || 'Pemohon';
      showToast(`Reservasi berhasil dibuat atas nama ${pemesan}! Slot terkunci di SIAKAD.`, 'success');
      setTimeout(() => {
        window.location.href = 'kondisi-ruangan.html';
      }, 1500);
    });

    const resetBtn = document.getElementById('btnResetFormReservasi');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        if (charCounter) charCounter.textContent = '0 / 250 karakter';
        showToast('Formulir berhasil dikosongkan.', 'info');
      });
    }
  }
}

// Monitoring Matriks Ruangan
function initMonitoringMatriks() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const datePills = document.querySelectorAll('.date-strip-pill');
  const slotButtons = document.querySelectorAll('.matrix-slot-btn');
  const drawer = document.getElementById('matrixDetailDrawer');

  // Category Tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');
      showToast(`Menampilkan kategori: ${tab.textContent.trim()}`, 'info');
    });
  });

  // Date strip
  datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const dateText = pill.querySelector('.date-strip-num')?.textContent || '';
      showToast(`Jadwal diubah ke tanggal ${dateText} Oktober 2026`, 'info');
    });
  });

  // Slot click to populate drawer
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.getAttribute('data-room') || 'Ruang H.1.3';
      const status = btn.getAttribute('data-status') || 'Available';
      const time = btn.getAttribute('data-time') || '09.00 - 10.00 WIB';
      const title = btn.getAttribute('data-title') || 'Tidak ada agenda';
      const person = btn.getAttribute('data-person') || '-';

      if (drawer) {
        const titleEl = drawer.querySelector('#drawerRoomTitle');
        const statusEl = drawer.querySelector('#drawerStatusBadge');
        const activityEl = drawer.querySelector('#drawerActivityTitle');
        const timeEl = drawer.querySelector('#drawerTimeDisplay');
        const personEl = drawer.querySelector('#drawerPersonDisplay');

        if (titleEl) titleEl.textContent = room;
        if (statusEl) {
          statusEl.textContent = status;
          statusEl.className = `drawer-badge ${status === 'Available' ? 'green' : 'blue'}`;
        }
        if (activityEl) activityEl.textContent = title;
        if (timeEl) timeEl.textContent = time;
        if (personEl) personEl.textContent = person;

        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  const closeDrawerBtn = document.getElementById('btnCloseDrawer');
  if (closeDrawerBtn && drawer) {
    closeDrawerBtn.addEventListener('click', () => {
      drawer.style.display = 'none';
    });
  }
}

// Activity Log Filter
function initActivityLogFilter() {
  const searchInput = document.getElementById('searchAuditInput');
  const actorSelect = document.getElementById('filterActorSelect');
  const actionSelect = document.getElementById('filterActionSelect');
  const moduleSelect = document.getElementById('filterModuleSelect');
  const table = document.getElementById('auditTrailTable');
  const resetBtn = document.getElementById('btnResetAuditFilter');
  const downloadBtn = document.getElementById('btnDownloadAuditLog');

  if (!table) return;

  function filterLogs() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const actorVal = actorSelect?.value || 'all';
    const actionVal = actionSelect?.value || 'all';
    const moduleVal = moduleSelect?.value || 'all';

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const actor = row.getAttribute('data-actor') || '';
      const action = row.getAttribute('data-action') || '';
      const mod = row.getAttribute('data-module') || '';

      const matchQ = !q || text.includes(q);
      const matchActor = actorVal === 'all' || actor === actorVal;
      const matchAction = actionVal === 'all' || action === actionVal;
      const matchModule = moduleVal === 'all' || mod === moduleVal;

      if (matchQ && matchActor && matchAction && matchModule) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterLogs);
  if (actorSelect) actorSelect.addEventListener('change', filterLogs);
  if (actionSelect) actionSelect.addEventListener('change', filterLogs);
  if (moduleSelect) moduleSelect.addEventListener('change', filterLogs);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (actorSelect) actorSelect.value = 'all';
      if (actionSelect) actionSelect.value = 'all';
      if (moduleSelect) moduleSelect.value = 'all';
      filterLogs();
      showToast('Parameter audit trail berhasil direset.', 'info');
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Mengunduh berkas rekaman audit log (audit_trail_20261010.csv)...', 'info');
      setTimeout(() => {
        showToast('Unduhan audit log selesai.', 'success');
      }, 1200);
    });
  }

  // Row Details Click
  const detailButtons = table.querySelectorAll('.btn-audit-detail');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target') || 'Target';
      const actor = btn.getAttribute('data-actor-name') || 'Aktor';
      const time = btn.getAttribute('data-time') || 'Waktu';
      const action = btn.getAttribute('data-action-name') || 'Aksi';

      const modal = document.getElementById('modalAuditDetail');
      if (modal) {
        document.getElementById('modalAuditTarget').textContent = target;
        document.getElementById('modalAuditActor').textContent = actor;
        document.getElementById('modalAuditTime').textContent = time;
        document.getElementById('modalAuditAction').textContent = action;
        modal.classList.add('open');
      }
    });
  });
}

// Modal Handlers
function initModalsSystem() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });

    const closeBtns = overlay.querySelectorAll('.modal-close-btn, [data-close-modal]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.classList.remove('open');
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        openModal.classList.remove('open');
      }
    }
  });
}

// Toast Alert
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
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// Dashboard Queue Switcher Tabs
function initDashboardQueueTabs() {
  const tabPeminjaman = document.getElementById('tabQueuePeminjaman');
  const tabPindah = document.getElementById('tabQueuePindah');
  const tbody = document.getElementById('tbodyQueueRows');

  if (!tabPeminjaman || !tabPindah || !tbody) return;

  const peminjamanData = `
    <tr>
      <td><strong>07.00 - 07.40</strong></td>
      <td><span style="font-weight: 800; color: #0b3272;">H.3.2</span></td>
      <td>Budiono Siregar (Teknik Industri)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Pending</span></td>
      <td style="text-align: right;"><a href="detail-reservasi.html" class="btn btn-outline" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Proses</a></td>
    </tr>
    <tr>
      <td><strong>07.40 - 08.20</strong></td>
      <td><span style="font-weight: 800; color: #0b3272;">H.3.3</span></td>
      <td>Sarah Johnson (Sastra Inggris)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Pending</span></td>
      <td style="text-align: right;"><a href="detail-reservasi.html" class="btn btn-outline" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Proses</a></td>
    </tr>
    <tr>
      <td><strong>08.20 - 09.00</strong></td>
      <td><span style="font-weight: 800; color: #0b3272;">H.3.4</span></td>
      <td>Michael Wong (Teknik Komputer)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Pending</span></td>
      <td style="text-align: right;"><a href="detail-reservasi.html" class="btn btn-outline" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Proses</a></td>
    </tr>
    <tr>
      <td><strong>09.00 - 09.40</strong></td>
      <td><span style="font-weight: 800; color: #0b3272;">H.3.5</span></td>
      <td>Linda Martinez (Ilmu Komunikasi)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Pending</span></td>
      <td style="text-align: right;"><a href="detail-reservasi.html" class="btn btn-outline" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Proses</a></td>
    </tr>
    <tr>
      <td><strong>09.40 - 10.20</strong></td>
      <td><span style="font-weight: 800; color: #0b3272;">H.3.6</span></td>
      <td>James Smith (Manajemen)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Pending</span></td>
      <td style="text-align: right;"><a href="detail-reservasi.html" class="btn btn-outline" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Proses</a></td>
    </tr>
  `;

  const pindahData = `
    <tr>
      <td><strong>13.00 - 15.00</strong></td>
      <td><span style="font-weight: 800; color: #2563eb;">H.1.2 → H.1.5</span></td>
      <td>Dr. Ir. Hendra Gunawan (Teknik Elektro)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Review</span></td>
      <td style="text-align: right;"><a href="detail-pindah.html" class="btn btn-primary" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Tinjau</a></td>
    </tr>
    <tr>
      <td><strong>08.00 - 10.00</strong></td>
      <td><span style="font-weight: 800; color: #2563eb;">H.2.1 → H.2.3</span></td>
      <td>Prof. Joko Susilo (Teknik Informatika)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Review</span></td>
      <td style="text-align: right;"><a href="detail-pindah.html" class="btn btn-primary" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Tinjau</a></td>
    </tr>
    <tr>
      <td><strong>14.00 - 17.00</strong></td>
      <td><span style="font-weight: 800; color: #2563eb;">H.1.4 → H.1.1</span></td>
      <td>BEM Fakultas Teknik (Ormawa)</td>
      <td><span style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Review</span></td>
      <td style="text-align: right;"><a href="detail-pindah.html" class="btn btn-primary" style="min-height: 28px; padding: 2px 10px; font-size: 0.75rem;">Tinjau</a></td>
    </tr>
  `;

  tabPeminjaman.addEventListener('click', () => {
    tabPeminjaman.classList.add('active');
    tabPindah.classList.remove('active');
    tbody.innerHTML = peminjamanData;
    showToast('Menampilkan 8 antrean peminjaman ruang', 'info');
  });

  tabPindah.addEventListener('click', () => {
    tabPindah.classList.add('active');
    tabPeminjaman.classList.remove('active');
    tbody.innerHTML = pindahData;
    showToast('Menampilkan 3 antrean mutasi jadwal kuliah', 'info');
  });
}

// Detail Reservasi Decision
function initDetailReservasiActions() {
  const btnApprove = document.getElementById('btnApproveReservasi');
  const btnReject = document.getElementById('btnRejectReservasi');
  const badge = document.getElementById('reservationStatusBadge');

  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      if (confirm('Konfirmasi: Setujui permohonan reservasi Ruang H.1.3 & H.1.4 atas nama UKM Robotika?')) {
        if (badge) {
          badge.innerHTML = '• Disetujui (Tersinkron SIAKAD)';
          badge.style.background = '#dcfce7';
          badge.style.color = '#15803d';
          badge.style.borderColor = '#bbf7d0';
        }
        btnApprove.disabled = true;
        btnReject.disabled = true;
        btnApprove.textContent = 'Reservasi Telah Disetujui';
        showToast('Permohonan #RSV-2026-1008 berhasil disetujui. Bukti izin dengan QR Code telah diterbitkan.', 'success');
      }
    });
  }

  if (btnReject) {
    btnReject.addEventListener('click', () => {
      const reason = prompt('Tuliskan alasan penolakan reservasi:', 'Kapasitas melebihi batas atau konflik agenda fakultas');
      if (reason) {
        if (badge) {
          badge.innerHTML = '• Ditolak Admin';
          badge.style.background = '#fee2e2';
          badge.style.color = '#b91c1c';
          badge.style.borderColor = '#fecaca';
        }
        btnApprove.disabled = true;
        btnReject.disabled = true;
        showToast('Permohonan #RSV-2026-1008 ditolak. Notifikasi dikirim ke pemohon.', 'info');
      }
    });
  }
}

// Persetujuan Reservasi Table Filter
function initPersetujuanReservasiFilter() {
  const searchInput = document.getElementById('searchReservasi');
  const roleSelect = document.getElementById('filterRoleReservasi');
  const roomSelect = document.getElementById('filterRuanganReservasi');
  const statusSelect = document.getElementById('filterStatusReservasi');
  const table = document.getElementById('tabelPersetujuanReservasi');
  const resetBtn = document.getElementById('btnResetReservasiFilter');

  if (!table) return;

  function filter() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const roleVal = roleSelect?.value || 'all';
    const roomVal = roomSelect?.value || 'all';
    const statusVal = statusSelect?.value || 'all';

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const role = row.getAttribute('data-role') || '';
      const room = row.getAttribute('data-room') || '';
      const status = row.getAttribute('data-status') || '';

      const matchQ = !q || text.includes(q);
      const matchRole = roleVal === 'all' || role === roleVal;
      const matchRoom = roomVal === 'all' || room.includes(roomVal);
      const matchStatus = statusVal === 'all' || status === statusVal;

      row.style.display = (matchQ && matchRole && matchRoom && matchStatus) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filter);
  if (roleSelect) roleSelect.addEventListener('change', filter);
  if (roomSelect) roomSelect.addEventListener('change', filter);
  if (statusSelect) statusSelect.addEventListener('change', filter);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (roleSelect) roleSelect.value = 'all';
      if (roomSelect) roomSelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      filter();
      showToast('Filter reservasi berhasil direset', 'info');
    });
  }
}

// Histori Peminjaman & Export
function initHistoriHandlers() {
  const searchInput = document.getElementById('searchHistoriInput');
  const roleSelect = document.getElementById('filterRoleHistori');
  const tipeSelect = document.getElementById('filterTipeHistori');
  const statusSelect = document.getElementById('filterStatusHistori');
  const table = document.getElementById('tabelHistoriLogistik');
  const resetBtn = document.getElementById('btnResetHistoriFilter');
  const btnXLS = document.getElementById('btnExportXLS');
  const btnPDF = document.getElementById('btnExportPDF');

  if (btnXLS) {
    btnXLS.addEventListener('click', () => {
      showToast('Mengunduh arsip histori_logistik_sarpras.xlsx...', 'info');
      setTimeout(() => showToast('Ekspor berkas Excel selesai.', 'success'), 1200);
    });
  }

  if (btnPDF) {
    btnPDF.addEventListener('click', () => {
      showToast('Mencetak rekap laporan arsip logistik (PDF)...', 'info');
      setTimeout(() => showToast('Ekspor Rekap PDF selesai.', 'success'), 1200);
    });
  }

  if (!table) return;

  function filter() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const roleVal = roleSelect?.value || 'all';
    const tipeVal = tipeSelect?.value || 'all';
    const statusVal = statusSelect?.value || 'all';

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const role = row.getAttribute('data-role') || '';
      const tipe = row.getAttribute('data-tipe') || '';
      const status = row.getAttribute('data-status') || '';

      const matchQ = !q || text.includes(q);
      const matchRole = roleVal === 'all' || role === roleVal;
      const matchTipe = tipeVal === 'all' || tipe === tipeVal;
      const matchStatus = statusVal === 'all' || status === statusVal;

      row.style.display = (matchQ && matchRole && matchTipe && matchStatus) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filter);
  if (roleSelect) roleSelect.addEventListener('change', filter);
  if (tipeSelect) tipeSelect.addEventListener('change', filter);
  if (statusSelect) statusSelect.addEventListener('change', filter);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (roleSelect) roleSelect.value = 'all';
      if (tipeSelect) tipeSelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      filter();
      showToast('Parameter histori berhasil direset', 'info');
    });
  }

  // Detail Button Popup
  const detailBtns = table.querySelectorAll('.btn-detail-histori');
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Kegiatan';
      const room = btn.getAttribute('data-room') || 'Ruang';
      const date = btn.getAttribute('data-date') || 'Tanggal';
      const status = btn.getAttribute('data-status') || 'Status';

      const modal = document.getElementById('modalHistoriDetail');
      if (modal) {
        document.getElementById('modalHistoriItemTitle').textContent = title;
        document.getElementById('modalHistoriItemRoom').textContent = room;
        document.getElementById('modalHistoriItemDate').textContent = date;
        document.getElementById('modalHistoriItemStatus').textContent = status;
        modal.classList.add('open');
      }
    });
  });
}

