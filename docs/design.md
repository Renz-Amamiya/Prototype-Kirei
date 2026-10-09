# Design System & Panduan Desain Kirei

> **Kirei - Sistem Reservasi Ruangan Bengkel Koding (FIK UDINUS)**  
> Dokumen ini adalah acuan resmi desain UI/UX dan implementasi styling untuk seluruh modul aplikasi Kirei (Ormawa, Dosen, Operator, Admin, dan Portal).

---

## 1. Filosofi & Identitas Desain

- **Karakter & Mood**: Akademik modern, bersih, andal, terstruktur, dan efisien.
- **Prinsip Utama**:
  1. **Purpose-Driven**: Setiap komponen, warna, dan dekorasi memiliki fungsi navigasi dan hierarki informasi yang jelas.
  2. **Konsistensi Lintas Peran**: Seluruh peran (Ormawa, Dosen, Operator, Admin) berbagi kerangka tata letak, warna aksen utama, dan komponen tombol/tabel yang seragam.
  3. **Aksesibilitas & Keterbacaan**: Mematuhi rasio kontras WCAG AA, target sentuh interaktif minimal **44px × 44px**, dan indikator fokus yang tegas (`:focus-visible`).
  4. **Responsif**: Beralih mulus dari desktop (sidebar statis) ke tablet/mobile (sidebar drawer).

---

## 2. Palet Warna (Color Palette)

Seluruh token warna didefinisikan sebagai CSS Custom Properties di `:root` pada file `styles.css`.

### 2.1 Warna Utama (Brand Colors)
| Token CSS | Kode Hex | Peruntukan / Penggunaan |
| :--- | :--- | :--- |
| `--color-primary` | `#0B3272` | Warna utama identitas Bengkel Koding, navbar active, tombol utama, judul penting |
| `--color-primary-hover` | `#082452` | State hover tombol utama dan interaksi primer |
| `--color-primary-light` | `#EFF6FF` | Background aksen subtle, kartu highlight, state terpilih |
| `--color-primary-border` | `#BFDBFE` | Border container highlight atau badge informasi |
| `--color-secondary-btn` | `#6C86A3` | Tombol aksi netral/sekunder |
| `--color-secondary-btn-hover` | `#5A728C` | State hover tombol sekunder |

### 2.2 Warna Latar (Backgrounds)
| Token CSS | Kode Hex | Peruntukan |
| :--- | :--- | :--- |
| `--color-bg-page` | `#FFFFFF` | Latar belakang halaman aplikasi |
| `--color-bg-subtle` | `#F8FAFC` | Latar belakang section sekunder, hover list/tabel |
| `--color-bg-card` | `#FFFFFF` | Latar belakang modul kartu dan container form |
| `--color-bg-table-header` | `#E6EEF5` | Latar belakang header kolom tabel (`thead th`) |
| `--color-bg-pill` | `#F1F5F9` | Latar badge netral, tab filter, counter chip |

### 2.3 Tipografi & Teks (Text Colors)
| Token CSS | Kode Hex | Peruntukan |
| :--- | :--- | :--- |
| `--color-text-main` | `#0F172A` | Teks judul utama, isi data tabel, heading (Slate 900) |
| `--color-text-label` | `#334155` | Label form, link sidebar non-aktif (Slate 700) |
| `--color-text-muted` | `#64748B` | Subtitle, keterangan pembantu, placeholder (Slate 500) |
| `--color-text-light` | `#94A3B8` | Divider, border non-fokus, teks non-aktif (Slate 400) |

### 2.4 Garis Batas (Border Colors)
| Token CSS | Kode Hex | Peruntukan |
| :--- | :--- | :--- |
| `--color-border-subtle` | `#E2E8F0` | Garis pembatas header, sidebar, card, baris tabel |
| `--color-border-input` | `#334155` / `#CBD5E1` | Garis tepi kontrol input form |
| `--color-border-dashed` | `#CBD5E1` | Garis putus-putus area dropzone file upload |

### 2.5 Status & Notifikasi (Semantic Colors)
| Status | Latar (Badge) | Teks / Ikon | Border |
| :--- | :--- | :--- | :--- |
| **Disetujui / Approved** | `#DCFCE7` | `#15803D` (`--status-approved-bg`) | `#BBF7D0` |
| **Menunggu / Pending** | `#FEF3C7` / `#596573` | `#B45309` / `#FFFFFF` | `#FDE68A` |
| **Ditolak / Rejected** | `#FEE2E2` | `#B91C1C` (`--status-rejected-bg`) | `#FECACA` |
| **Info / Progres** | `#DBEAFE` | `#1E40AF` | `#BFDBFE` |

### 2.6 Aksen Indikator Peran (Role Badges)
Dipasang di header berdampingan dengan logo:
- **Ormawa**: Background `#E2E8F0`, Teks `#334155` (Netral Slate)
- **Dosen**: Background `#E0E7FF`, Teks `#3730A3` (Indigo Akademik)
- **Operator**: Background `#DBEAFE`, Teks `#1E40AF` (Biru Operasional)
- **Admin**: Background `#DBEAFE`, Teks `#1E40AF`, Border `#BFDBFE` (`.admin-header-badge`)

---

## 3. Tipografi & Hierarki Teks

### 3.1 Font Family
```css
font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
Memuat weight: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold), `800` (Extra Bold).

### 3.2 Skala Tipografi
| Tingkat | Ukuran Font | Weight | Line Height | Contoh Pemakaian |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `2.35rem` (37.6px) | 800 | 1.2 | Heading halaman Portal Role Switcher |
| **Page Title** (`.page-title`) | `1.85rem` (29.6px) | 800 | 1.25 | Judul utama setiap modul halaman |
| **Section Title** | `1.25rem` - `1.4rem` | 700 | 1.3 | Judul kartu besar / header grup tabel |
| **Card Header** | `1.10rem` (17.6px) | 700 | 1.35 | Judul kartu ruangan / reservasi |
| **Body Standard** | `0.95rem` - `1rem` | 400 / 500 | 1.5 | Teks konten, nilai data, deskripsi form |
| **Label Form** (`.form-label`)| `0.90rem` (14.4px) | 600 | 1.4 | Label input formulir |
| **Caption / Meta** | `0.80rem` - `0.85rem` | 500 / 600 | 1.4 | Badge status, breadcrumb, info pelengkap |
| **Overline / Tag** | `0.725rem` - `0.75rem`| 700 / 800 | 1.2 | Label kategori kapital, nama seksi sidebar |

---

## 4. Spacing, Radius, & Elevasi

### 4.1 Sudut Lengkung (Border Radii)
- `--radius-sm: 6px`: Tag kecil, tombol mikro, dropdown list item.
- `--radius-md: 10px`: Input field, tombol standar (`.btn`), alert banner.
- `--radius-lg: 16px`: Container kartu (`.card-container`), panel dialog modal.
- `--radius-full: 9999px`: Navigasi pill sidebar (`.nav-link`), pill badge status, avatar profil.

### 4.2 Elevasi & Bayangan (Shadows)
- `--shadow-subtle`: `0 1px 3px rgba(15, 23, 42, 0.06)` (Border kartu standar).
- `--shadow-card`: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)` (Hover kartu interaktif).
- `--shadow-dropdown`: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)` (Menu popup, modal dialog).

---

## 5. Struktur Layout Aplikasi

Struktur layout standar terdiri dari 3 blok utama:
```html
<div class="app-layout">
  <!-- 1. Header Topbar (Sticky) -->
  <header class="app-header">...</header>

  <!-- 2. Kontainer Utama -->
  <div class="app-body">
    <!-- Sidebar Kiri (Navigasi) -->
    <aside class="app-sidebar">...</aside>

    <!-- Konten Halaman -->
    <main class="main-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb-container">...</nav>
      <!-- Page Header -->
      <h1 class="page-title">...</h1>
      <p class="page-subtitle">...</p>

      <!-- Grid / Kartu Konten -->
      ...
    </main>
  </div>
</div>
```

### 5.1 Spesifikasi Layout
- **Header (`.app-header`)**:
  - Tinggi: `72px` (`--topbar-height`).
  - Posisi: `sticky; top: 0; z-index: 40;`.
  - Border bawah: `1px solid var(--color-border-subtle)`.
  - Padding: `0 28px`.
  - Elemen: Brand Logo + Teks "Bengkel Koding", Role Badge, Profil Pengguna (opsional), Tombol "Ganti Role" (`.btn-outline`), Hamburger toggle untuk mobile (`.mobile-nav-toggle`).
- **Sidebar (`.app-sidebar`)**:
  - Lebar desktop: `240px` (`--sidebar-width`).
  - Border kanan: `1px solid var(--color-border-subtle)`.
  - Padding: `24px 16px`.
  - Menu Navigasi: Pill radius penuh (`border-radius: 9999px`), min-height `44px`.
  - State aktif: background `#0B3272`, teks putih, bayangan biru halus.
- **Area Konten (`.main-content`)**:
  - Flex: `1`.
  - Lebar maksimum: `1300px` (`margin: 0 auto;`).
  - Padding: `32px 40px` di desktop, `20px 16px` di layar sempit (<768px).

---

## 6. Komponen Antarmuka (UI Components)

### 6.1 Tombol (Buttons)
Kelas dasar: `.btn` (selalu memiliki `min-height: 44px`, `border-radius: 10px`, font-weight `600`).
- `.btn-primary`: Latar `#0B3272`, teks putih (Aksi utama simpan / submit).
- `.btn-secondary`: Latar `#6C86A3`, teks putih (Aksi alternatif / sekunder).
- `.btn-outline`: Latar transparan, border `1.5px solid #CBD5E1`, teks `#334155` (Batal / Kembali / Ganti Role).
- `.btn-danger`: Latar `#DC2626`, teks putih (Tolak / Batalkan Reservasi).
- `.btn-success`: Latar `#16A34A`, teks putih (Setujui Permintaan).
- Ukuran Ringkas (`.btn-sm`): Tinggi `36px`, padding `6px 14px`, teks `0.85rem`.

### 6.2 Kartu (Cards)
- `.card-container`: Latar putih, border `1px solid #E2E8F0`, radius `16px`, padding `28px`.
- Kartu Interaktif / Pilihan Ruangan: Efek hover `transform: translateY(-2px); border-color: var(--color-primary); box-shadow: var(--shadow-card);`.

### 6.3 Formulir & Kontrol Masukan (Forms)
- Label: `.form-label` (weight `600`, color `#334155`, margin-bottom `8px`).
- Input Field (`input`, `select`, `textarea`):
  - Tinggi minimal: `44px`.
  - Border: `1px solid #CBD5E1` (atau `#334155` untuk kontras tinggi).
  - Border-radius: `10px`.
  - Padding: `10px 14px`.
  - Focus: Border `#0B3272` dengan `outline: none` dan `box-shadow: 0 0 0 3px rgba(11, 50, 114, 0.15)`.
- Dropzone File Upload: Border putus-putus (`border: 2px dashed #CBD5E1`), radius `12px`, padding `24px`, background `#F8FAFC`.

### 6.4 Tabel Data (Data Tables)
- Wrapper: Container responsive dengan `overflow-x: auto; border: 1px solid #E2E8F0; border-radius: 12px;`.
- Kolom Header (`thead th`): Background `#E6EEF5`, teks `#0B3272` atau `#334155`, font-weight `700`, padding `12px 16px`.
- Baris Isi (`tbody tr`): Border bawah `1px solid #E2E8F0`, padding cell `14px 16px`, hover background `#F8FAFC`.
- Aksi di Tabel: Tombol `.btn-sm` atau ikon aksi berjarak minimal 8px.

### 6.5 Badge Status
Komponen pill bulat (`border-radius: 9999px`), padding `4px 12px`, teks bold `0.80rem`:
- `.status-approved`: Latar `#DCFCE7`, teks `#15803D`.
- `.status-pending`: Latar `#FEF3C7`, teks `#92400E` (atau netral slate).
- `.status-rejected`: Latar `#FEE2E2`, teks `#B91C1C`.

### 6.6 Dialog Modal
- Overlay: `.modal-overlay` (`position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); z-index: 50; display: none;`).
- Modal aktif: Ditambahkan kelas `.open` (`display: flex; align-items: center; justify-content: center;`).
- Panel Dialog: `.modal-container` (background putih, radius `16px`, padding `28px`, lebar max `560px`).
- Interaktivitas keyboard: Wajib mendukung penutupan melalui tombol `Escape` dan click-outside backdrop.

---

## 7. Responsivitas & Perilaku Mobile

| Breakpoint | Penyesuaian Layout |
| :--- | :--- |
| **Desktop (>1024px)** | Sidebar statis berdampingan dengan konten (`240px` + `flex: 1`). |
| **Tablet (768px - 1024px)** | Layout grid admin beralih ke 1 kolom, padding konten disesuaikan menjadi `24px`. |
| **Mobile (<768px)** | Sidebar beralih ke drawer off-canvas (`transform: translateX(-100%)`). Muncul saat tombol `.mobile-nav-toggle` diklik (kelas `.mobile-open`). Nama profil ringkas di topbar disembunyikan. Tabel data dapat di-scroll horizontal secara aman. |

---

## 8. Panduan Menulis Kode & Penamaan

1. **CSS Modular**:
   - Seluruh style global dan basis komponen wajib ditempatkan di `styles.css`.
   - Modul khusus (seperti operasi Admin yang memiliki dashboard analitik terpisah) menggunakan stylesheet ekstensi seperti `admin/admin.css` setelah me-load `styles.css`.
   - Hindari inline styling berlebihan pada file HTML kecuali untuk konfigurasi layout ad-hoc kecil (misalnya `display: flex; gap: ...`).
2. **Penamaan Kelas (Naming Convention)**:
   - Menggunakan format `kebab-case` semantik yang konsisten (contoh: `.card-container`, `.nav-link`, `.page-title`, `.btn-primary`, `.status-badge`).
3. **JavaScript Interaktivitas**:
   - File `app.js` digunakan bersama untuk fungsi umum: pembuka drawer menu mobile, sistem modal popup (termasuk handler ESC), pratinjau file upload, dan toast notifikasi.
   - Setiap elemen interaktif wajib menyertakan atribut ARIA yang valid (`aria-label`, `aria-expanded`, `aria-current`).
