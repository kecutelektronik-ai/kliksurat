/**
 * Standar Klasifikasi Jenis Naskah Dinas & Status Surat Masuk
 * Sesuai Pedoman Tata Naskah Dinas Mahkamah Agung RI
 */

export const JENIS_SURAT_OPTIONS = [
  'Surat Dinas',
  'Nota Dinas',
  'Memorandum',
  'Surat Undangan',
  'Surat Tugas',
  'Surat Perintah',
  'Surat Edaran',
  'Surat Keterangan',
  'Surat Pengantar',
  'Berita Acara',
  'Laporan',
  'Lainnya',
];

export const STATUS_SURAT_MASUK_OPTIONS = [
  'Diterima',
  'Diverifikasi',
  'Diregistrasi',
  'Menunggu Disposisi',
  'Telah Didisposisi',
  'Dalam Tindak Lanjut',
  'Selesai Ditindaklanjuti',
  'Diarsipkan',
];

/**
 * Pilihan Prioritas Surat Masuk Resmi:
 * 1. Sangat Segera (Maksimal 24 Jam)
 * 2. Segera (24 - 48 Jam)
 */
export const PRIORITAS_SURAT_OPTIONS = [
  'Sangat Segera',
  'Segera',
];

export function getPrioritasBadge(prioritas) {
  const norm = String(prioritas || '').toLowerCase().replace(/_/g, ' ');
  if (norm.includes('sangat') || norm === 'sangat segera') {
    return {
      bg: 'bg-danger text-white border-danger shadow-2xs font-bold',
      badgeClass: 'bg-danger text-white font-bold',
      icon: 'bolt',
      label: 'Sangat Segera',
      sla: 'Maksimal 24 Jam',
      desc: 'Wajib ditindaklanjuti segera dalam waktu 24 jam'
    };
  }
  return {
    bg: 'bg-warning-light text-amber-950 border border-warning/60 font-bold',
    badgeClass: 'bg-warning-light text-amber-950 border border-warning/60 font-bold',
    icon: 'schedule',
    label: 'Segera',
    sla: '24 - 48 Jam',
    desc: 'Wajib ditindaklanjuti dalam waktu 24 sampai 48 jam'
  };
}

export function getStatusBadge(status) {
  switch (status) {
    case 'Diterima':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
        icon: 'mark_email_read'
      };
    case 'Diverifikasi':
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-300 font-semibold',
        icon: 'verified'
      };
    case 'Diregistrasi':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold',
        icon: 'app_registration'
      };
    case 'Menunggu Disposisi':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
        icon: 'hourglass_top'
      };
    case 'Telah Didisposisi':
    case 'Didisposisi':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-300 font-semibold',
        icon: 'send'
      };
    case 'Dalam Tindak Lanjut':
    case 'Diproses':
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-300 font-semibold',
        icon: 'pending_actions'
      };
    case 'Selesai Ditindaklanjuti':
    case 'Selesai':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        icon: 'check_circle'
      };
    case 'Diarsipkan':
      return {
        bg: 'bg-zinc-100 text-zinc-800 border-zinc-300 font-medium',
        icon: 'inventory_2'
      };
    default:
      return {
        bg: 'bg-surface text-on-surface border-outline-subtle font-medium',
        icon: 'info'
      };
  }
}

/**
 * Konversi Angka Bulan ke Angka Romawi
 */
export const ROMAN_MONTHS = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII',
};

export function getRomanMonth(dateInput) {
  if (!dateInput) return 'XI';
  let month = 11;
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts.length >= 2) {
      month = parseInt(parts[1], 10);
    }
  } else {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      month = d.getMonth() + 1;
    }
  }
  return ROMAN_MONTHS[month] || 'XI';
}

export function getYearFromDate(dateInput) {
  if (!dateInput) return '2026';
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts.length >= 1 && parts[0].length === 4) {
      return parts[0];
    }
  }
  const d = new Date(dateInput);
  if (!isNaN(d.getTime())) {
    return String(d.getFullYear());
  }
  return '2026';
}

/**
 * Rumus Agenda Surat Masuk:
 * {Nomor Urut 4 Digit}/SM/{Bulan Romawi}/{Tahun}
 * Contoh: 0001/SM/XI/2026
 */
export function formatAgendaSuratMasuk(counter, dateInput = new Date()) {
  const numStr = String(counter || 1).padStart(4, '0');
  const roman = getRomanMonth(dateInput);
  const year = getYearFromDate(dateInput);
  return `${numStr}/SM/${roman}/${year}`;
}

/**
 * Rumus Agenda Surat Keluar:
 * {Nomor Urut 4 Digit}/SK/{Bulan Romawi}/{Tahun}
 * Contoh: 0001/SK/XI/2026
 */
export function formatAgendaSuratKeluar(counter, dateInput = new Date()) {
  const numStr = String(counter || 1).padStart(4, '0');
  const roman = getRomanMonth(dateInput);
  const year = getYearFromDate(dateInput);
  return `${numStr}/SK/${roman}/${year}`;
}


