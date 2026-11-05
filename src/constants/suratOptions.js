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
