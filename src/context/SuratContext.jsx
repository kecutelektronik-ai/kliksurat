import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  mapRowToSuratMasuk,
  mapRowToSuratKeluar,
  mapSuratMasukToRow,
  mapSuratKeluarToRow,
} from '../lib/suratMapper';
import {
  formatAgendaSuratMasuk,
  formatAgendaSuratKeluar,
} from '../constants/suratOptions';

const SuratContext = createContext();

export const USERS = {
  petugas: {
    id: 'usr-1',
    name: 'Ahmad Fauzi, S.H.',
    role: 'Petugas Persuratan',
    roleKey: 'petugas',
    nip: '19880412 201101 1 003',
    department: 'Subbag Umum & Keuangan (Tata Usaha)',
    initials: 'AF',
    avatarColor: 'bg-primary text-white',
    badge: 'Petugas Persuratan',
    permissions: ['all_letters', 'register_in', 'number_out', 'distribute', 'archive', 'settings']
  },
  sekretaris: {
    id: 'usr-2',
    name: 'Bpk. H. M. Ridwan, S.H.',
    role: 'Sekretaris',
    roleKey: 'sekretaris',
    nip: '19750824 200212 1 001',
    department: 'Kesekretariatan',
    initials: 'MR',
    avatarColor: 'bg-success text-white',
    badge: 'Sekretaris Pengadilan',
    permissions: ['view_all', 'receive_disposisi', 'approve_sekretariat', 'reports']
  },
  panitera: {
    id: 'usr-3',
    name: 'Ibu Dra. Hj. Nurjanah, M.H.',
    role: 'Panitera',
    roleKey: 'panitera',
    nip: '19780315 200501 2 002',
    department: 'Kepaniteraan Perkara',
    initials: 'NJ',
    avatarColor: 'bg-accent-dark text-white',
    badge: 'Panitera Pengadilan',
    permissions: ['view_all', 'receive_disposisi', 'approve_kepaniteraan', 'reports']
  },
  ketua: {
    id: 'usr-4',
    name: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
    role: 'Ketua',
    roleKey: 'ketua',
    nip: '19690110 199403 1 002',
    department: 'Pimpinan Pengadilan',
    initials: 'AZ',
    avatarColor: 'bg-primary-dark text-white',
    badge: 'Ketua Pengadilan Agama',
    permissions: ['view_all', 'disposisi', 'final_approval', 'pimpinan_dashboard', 'reports']
  },
  wakil_ketua: {
    id: 'usr-5',
    name: 'Drs. H. Syamsul Hadi, M.H.',
    role: 'Wakil Ketua',
    roleKey: 'wakil_ketua',
    nip: '19720516 199803 1 004',
    department: 'Pimpinan & Pengawasan',
    initials: 'SH',
    avatarColor: 'bg-warning-dark text-white',
    badge: 'Wakil Ketua Pengadilan Agama',
    permissions: ['view_all', 'disposisi', 'final_approval', 'pimpinan_dashboard', 'reports']
  },
  hakim_senior: {
    id: 'usr-6',
    name: 'Drs. H. M. Arifin, S.H., M.Hum.',
    role: 'Hakim Senior / Hakim Pengawas',
    roleKey: 'hakim_senior',
    nip: '19700612 199603 1 001',
    department: 'Kepaniteraan & Hakim Peradilan',
    initials: 'MA',
    avatarColor: 'bg-indigo-700 text-white',
    badge: 'Hakim yang Ditunjuk',
    permissions: ['view_all', 'disposisi', 'receive_disposisi', 'final_approval', 'pimpinan_dashboard', 'reports']
  },
  kasubag_umum: {
    id: 'usr-7',
    name: 'Budi Santoso, S.Kom.',
    role: 'Kepala Subbagian Umum dan Keuangan',
    roleKey: 'kasubag_umum',
    nip: '19820719 200801 1 005',
    department: 'Subbag Umum & Keuangan (Tata Usaha & Kearsipan)',
    initials: 'BS',
    avatarColor: 'bg-teal-700 text-white',
    badge: 'Kasubag Umum & Keuangan',
    permissions: ['view_all', 'receive_disposisi', 'archive', 'reports']
  }
};

const INITIAL_SURAT_MASUK = [
  {
    id: 'SM-001',
    nomorSurat: '012/PA.Lmg/X/2026',
    agenda: '0001/SM/X/2026',
    asalSurat: 'PTA Surabaya (Pengadilan Tinggi Agama)',
    perihal: 'Undangan Rapat Koordinasi Pembinaan Wilayah Hukum Pengadilan Tinggi Agama Surabaya Semester II',
    jenisSurat: 'Surat Undangan',
    prioritas: 'Segera',
    sifatSurat: 'Biasa',
    pejabatPenerima: 'Sekretaris',
    tanggalSurat: '2026-10-18',
    tanggalTerima: '2026-10-19T08:30',
    sifat: 'segera',
    status: 'Dalam Tindak Lanjut',
    lampiran: '1 Berkas (18 Lembar PDF)',
    fileScan: 'Undangan_Rakor_PTA_Surabaya_2026.pdf',
    fileSize: '2.4 MB',
    tujuanAwal: 'Sekretaris',
    prioritasTinggi: true,
  },
  {
    id: 'SM-002',
    nomorSurat: '047/UM.01/X/2026',
    agenda: '0002/SM/X/2026',
    asalSurat: 'Pengadilan Tinggi Jawa Timur',
    perihal: 'Pemberitahuan Kegiatan Sosialisasi Standar Pelayanan Terpadu Satu Pintu (PTSP) Ramah Disabilitas',
    jenisSurat: 'Surat Dinas',
    prioritas: 'Sangat Segera',
    sifatSurat: 'Terbatas',
    pejabatPenerima: 'Sekretaris',
    tanggalSurat: '2026-10-19',
    tanggalTerima: '2026-10-20T09:15',
    sifat: 'sangat_segera',
    status: 'Menunggu Disposisi',
    lampiran: '1 Berkas (4 Dokumen Juknis)',
    fileScan: 'Sosialisasi_PTSP_Ramah_Disabilitas.pdf',
    fileSize: '3.1 MB',
    tujuanAwal: 'Sekretaris',
    prioritasTinggi: true,
  },
  {
    id: 'SM-003',
    nomorSurat: '042/KP.02/X/2026',
    agenda: '0003/SM/X/2026',
    asalSurat: 'Biro Kepegawaian & Ortala Mahkamah Agung RI',
    perihal: 'Verifikasi Berkas Usulan Kenaikan Pangkat Hakim & Aparatur Pegawai Negeri Sipil Periode April 2027',
    jenisSurat: 'Surat Dinas',
    prioritas: 'Segera',
    sifatSurat: 'Rahasia',
    pejabatPenerima: 'Sekretaris',
    tanggalSurat: '2026-10-16',
    tanggalTerima: '2026-10-18T11:00',
    sifat: 'segera',
    status: 'Dalam Tindak Lanjut',
    lampiran: '2 Berkas Excel & SK Formasi',
    fileScan: 'Verifikasi_Kenaikan_Pangkat_April2027.pdf',
    fileSize: '4.8 MB',
    tujuanAwal: 'Sekretaris',
    prioritasTinggi: true,
  },
  {
    id: 'SM-004',
    nomorSurat: '013/MA/HK.01/X/2026',
    agenda: '0004/SM/X/2026',
    asalSurat: 'Kepaniteraan Mahkamah Agung RI',
    perihal: 'Petunjuk Teknis Audit Kepatuhan Aksesibilitas Layanan Peradilan Elektronik Tahun Anggaran 2026',
    jenisSurat: 'Surat Edaran',
    prioritas: 'Segera',
    sifatSurat: 'Biasa',
    pejabatPenerima: 'Panitera',
    tanggalSurat: '2026-10-14',
    tanggalTerima: '2026-10-16T10:00',
    sifat: 'segera',
    status: 'Telah Didisposisi',
    lampiran: '1 Berkas PDF (Pedoman Mutu)',
    fileScan: 'Juknis_Audit_Aksesibilitas_MARI.pdf',
    fileSize: '1.9 MB',
    tujuanAwal: 'Panitera',
    prioritasTinggi: false,
  },
  {
    id: 'SM-005',
    nomorSurat: '014/PA.Jbr/X/2026',
    agenda: '0005/SM/X/2026',
    asalSurat: 'Pengadilan Agama Jember Kelas I-A',
    perihal: 'Permohonan Bantuan Delegasi Panggilan Sidang Perkara Nomor 1245/Pdt.G/2026/PA.Jbr',
    jenisSurat: 'Surat Dinas',
    prioritas: 'Segera',
    sifatSurat: 'Biasa',
    pejabatPenerima: 'Panitera Muda Gugatan',
    tanggalSurat: '2026-10-17',
    tanggalTerima: '2026-10-18T13:45',
    sifat: 'segera',
    status: 'Selesai Ditindaklanjuti',
    lampiran: '1 Lembar Relaas Panggilan',
    fileScan: 'Delegasi_Panggilan_PA_Jember.pdf',
    fileSize: '820 KB',
    tujuanAwal: 'Panitera Muda Gugatan',
    prioritasTinggi: false,
  }
];

const INITIAL_SURAT_KELUAR = [
  {
    id: 'SK-001',
    nomorSurat: 'W13-A12/1042/HK.01/X/2026',
    agenda: '0001/SK/X/2026',
    unitPengusul: 'Kepaniteraan Perkara',
    pembuat: 'Ibu Dra. Hj. Nurjanah, M.H. (Panitera)',
    tujuanSurat: 'Mahkamah Agung Republik Indonesia',
    perihal: 'Penyampaian Laporan Triwulan III Kinerja Perkara Elektronik (e-Court) & Mediasi Yudisial',
    tanggalSurat: '2026-10-19',
    sifat: 'biasa',
    status: 'Disetujui & Diterbitkan Nomor',
    disetujuiOleh: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
    waktuPersetujuan: '2026-10-19T14:20',
    nomorUrut: 1042,
    kodeKlasifikasi: 'HK.01',
    lampiran: '1 Berkas Laporan',
  },
  {
    id: 'SK-002',
    nomorSurat: 'W13-A12/1043/PL.01/X/2026',
    agenda: '0002/SK/X/2026',
    unitPengusul: 'Kesekretariatan (Subbag Perencanaan)',
    pembuat: 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
    tujuanSurat: 'Badan Urusan Administrasi Mahkamah Agung RI',
    perihal: 'Usulan Alokasi Anggaran Tambahan Pemeliharaan Gedung & Pengadaan Ruang Server TA 2027',
    tanggalSurat: '2026-10-19',
    sifat: 'segera',
    status: 'Disetujui & Diterbitkan Nomor',
    disetujuiOleh: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
    waktuPersetujuan: '2026-10-19T15:45',
    nomorUrut: 1043,
    kodeKlasifikasi: 'PL.01',
    lampiran: 'RAB & Proposal Teknis',
  },
  {
    id: 'SK-003',
    nomorSurat: 'Draft (Menunggu Nomor)',
    agenda: '0003/SK/X/2026',
    unitPengusul: 'Kepaniteraan (Panmud Hukum)',
    pembuat: 'Ahmad Fauzi, S.H. (Panmud Hukum)',
    tujuanSurat: 'Pengadilan Tinggi Agama Surabaya',
    perihal: 'Surat Tugas Delegasi Pendampingan Rapat Koordinasi Pembinaan Wilayah Semester II',
    tanggalSurat: '2026-10-21',
    sifat: 'segera',
    status: 'Menunggu Persetujuan Atasan',
    disetujuiOleh: null,
    waktuPersetujuan: null,
    nomorUrut: null,
    kodeKlasifikasi: 'UM.01',
    lampiran: 'Daftar Pejabat Ditugaskan',
  },
  {
    id: 'SK-004',
    nomorSurat: 'Draft (Menunggu Paraf)',
    agenda: '0004/SK/X/2026',
    unitPengusul: 'Kesekretariatan (Subbag TI & Pelaporan)',
    pembuat: 'Staf Subbag TI',
    tujuanSurat: 'Penyedia Layanan Jaringan Internet Telkom',
    perihal: 'Permohonan Peningkatan Bandwidth VPN Peradilan Terintegrasi Mahkamah Agung',
    tanggalSurat: '2026-10-18',
    sifat: 'biasa',
    status: 'Menunggu Paraf Sekretaris',
    disetujuiOleh: null,
    waktuPersetujuan: null,
    nomorUrut: null,
    kodeKlasifikasi: 'PL.01',
    lampiran: 'Spesifikasi Teknis',
  }
];

const INITIAL_DISPOSISI = {
  'SM-001': {
    id: 'DISP-001',
    nomorLembar: 'LK-012',
    suratId: 'SM-001',
    alurTahap: 3,
    
    // Tahap 1: Registrasi Petugas
    petugasRegistrasi: 'Ahmad Fauzi, S.H.',
    disposisiAwalKe: 'Sekretaris',
    tanggalRegistrasi: '2026-10-19',

    // Tahap 2: Telaah & Catatan Sekretaris
    catatanSekretaris: 'Telah diteliti kelengkapan naskah dinas sesuai tata persuratan. Diajukan kepada Yth. Ketua Pengadilan untuk arahan dan petunjuk tindak lanjut.',
    penelaahSekretaris: 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
    tanggalTelaahSekretaris: '19/10/2026',
    tujuanPimpinan: 'Ketua Pengadilan',

    // Tahap 3: Arahan Perintah Pimpinan (Ketua)
    pemberiDisposisi: 'Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua Pengadilan Agama)',
    tanggalDisposisi: '2026-10-20T10:15',
    sifatDisposisi: 'segera',
    diteruskanKepada: ['Sekretaris', 'Panitera'],
    instruksiPilihan: ['Tanggapi & tindak lanjuti', 'Harap dihadiri/diwakili', 'Selesaikan sesuai ketentuan yang berlaku'],
    isiArahan: '1. Hadiri dan wakili pimpinan dalam agenda Rapat Koordinasi Wilayah PTA Surabaya tanggal 24 Oktober 2026.\n2. Siapkan rekapitulasi data perkara e-Court dan serapan anggaran DIPA 01 & 04 untuk bahan pemaparan resmi.',
    catatanKhusus: 'Laporkan hasil rakor segera setelah kegiatan selesai dan koordinasikan penerbitan Surat Tugas (ST).',

    // Tahap 4: Disposisi Pengarsipan Sekretaris ke Kasubag Umum & Keuangan
    disposisiKeArsip: 'Kepala Subbagian Umum dan Keuangan',
    catatanPengarsipan: '',
    tanggalArsip: '',
    isArchived: false,

    tandaTanganElektronik: {
      status: 'TERVERIFIKASI',
      penandatangan: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
      jabatan: 'Ketua Pengadilan Agama Lumajang Kelas I-A',
      sha256: '9F8A...2026-MARI-ID',
      waktuSertifikasi: '20 Okt 2026 10:15:32 WIB'
    }
  }
};

const INITIAL_TRACKING = {
  'SM-001': [
    {
      waktu: '19 Okt 2026, 08:30 WIB',
      petugas: 'Ahmad Fauzi, S.H. (Petugas Persuratan)',
      tahap: 'Penerimaan & Registrasi Agenda',
      status: 'Surat fisik & PDF diterima, dicatat ke buku agenda AGD-2026/X/SM-0012',
      icon: 'inbox',
      badge: 'Registrasi Selesai',
      badgeColor: 'bg-primary-light text-primary'
    },
    {
      waktu: '19 Okt 2026, 09:40 WIB',
      petugas: 'Ahmad Fauzi, S.H.',
      tahap: 'Penerusan ke Meja Pimpinan',
      status: 'Berkas digital diteruskan ke sistem naskah dinas Ketua Pengadilan Agama',
      icon: 'send',
      badge: 'Diteruskan ke Ketua',
      badgeColor: 'bg-secondary-light text-secondary-dark'
    },
    {
      waktu: '20 Okt 2026, 10:15 WIB',
      petugas: 'Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua)',
      tahap: 'Pemberian Disposisi Pimpinan',
      status: 'Lembar disposisi LK-012 disahkan secara digital. Instruksi: Hadiri & Tindak Lanjuti kepada Sekretaris & Panitera',
      icon: 'assignment_turned_in',
      badge: 'Disposisi Sah',
      badgeColor: 'bg-success-light text-success'
    },
    {
      waktu: '20 Okt 2026, 10:18 WIB',
      petugas: 'Gateway WhatsApp Fonnte',
      tahap: 'Notifikasi Otomatis WhatsApp',
      status: 'Pesan notifikasi disposisi terkirim ke WhatsApp Sekretaris & Panitera (+62 812-XXXX-XXXX)',
      icon: 'chat',
      badge: 'WA Terkirim',
      badgeColor: 'bg-success-light text-success border border-success/30'
    }
  ]
};

const INITIAL_NOMOR_CONFIG = {
  kodePrefix: 'W13-A12',
  tahun: 2026,
  format: '[PREFIX]/[NO]/[KODE]/[BULAN]/[TAHUN]',
  klasifikasi: [
    { kode: 'HK.01', nama: 'Kepaniteraan Perkara / Administrasi Hukum', counter: 1043 },
    { kode: 'PL.01', nama: 'Perencanaan, TI & Pelaporan', counter: 215 },
    { kode: 'UM.01', nama: 'Umum & Tata Persuratan Kedinasan', counter: 531 },
    { kode: 'KP.02', nama: 'Kepegawaian, Organisasi & Tata Laksana', counter: 189 },
    { kode: 'KU.01', nama: 'Keuangan & Pengelolaan DIPA', counter: 304 },
  ]
};

const INITIAL_PLH_CONFIG = {
  isActive: true,
  tipePelimpahan: 'wakil_ketua', // 'wakil_ketua' | 'hakim_ditunjuk'
  alasanKetiadaan: 'cuti_ketua', // 'cuti_ketua' | 'dinas_ketua' | 'keduanya_cuti' | 'keduanya_dinas_luar' | 'cuti_dan_dinas'
  pejabatAsal: {
    name: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
    role: 'Ketua Pengadilan Agama',
    nip: '19690110 199403 1 002',
    jabatan: 'Ketua Pengadilan Agama Lumajang Kelas I-A'
  },
  pejabatWakil: {
    name: 'Drs. H. Syamsul Hadi, M.H.',
    role: 'Wakil Ketua (Selaku Plh. Ketua)',
    nip: '19720516 199803 1 004',
    jabatan: 'Wakil Ketua Pengadilan Agama Lumajang Kelas I-A'
  },
  pejabatHakim: {
    name: 'Drs. H. M. Arifin, S.H., M.Hum.',
    role: 'Hakim Senior / Hakim Pengawas (Selaku Plh. Ketua)',
    nip: '19700612 199603 1 001',
    jabatan: 'Hakim Tingkat Pertama PA Lumajang Kelas I-A'
  },
  pejabatPlh: {
    name: 'Drs. H. Syamsul Hadi, M.H.',
    role: 'Wakil Ketua (Selaku Plh. Ketua)',
    nip: '19720516 199803 1 004',
    jabatan: 'Wakil Ketua Pengadilan Agama Lumajang Kelas I-A'
  },
  nomorSK: 'W13-A12/128/KP.04.1/XI/2026',
  jenisCuti: 'Cuti Tahunan',
  tanggalMulai: '2026-11-03',
  tanggalSelesai: '2026-11-17',
  dasarHukum: 'SEMA No. 2 Tahun 2020 & Perma No. 7 Tahun 2016 tentang Penunjukan Pelaksana Harian (Plh) Pimpinan Pengadilan',
  keterangan: 'Ketua Pengadilan Agama Lumajang melaksanakan Cuti Tahunan. Segala wewenang pimpinan kedinasan, disposisi surat masuk, dan persetujuan surat keluar dilimpahkan kepada Pelaksana Harian (Plh. Ketua).',
  wewenang: [
    'Pemberian Instruksi & Pengesahan Lembar Disposisi Surat Masuk',
    'Persetujuan & Penerbitan Nomor Resmi Surat Keluar',
    'Sertifikasi & Tanda Tangan Elektronik (TTE) Naskah Dinas',
    'Koordinasi Pembagian Tugas Kepaniteraan & Kesekretariatan'
  ],
  riwayat: [
    {
      id: 'PLH-2026-01',
      nomorSK: 'W13-A12/084/KP.04.1/VI/2026',
      tipePelimpahan: 'wakil_ketua',
      jenisCuti: 'Cuti Alasan Penting',
      tanggalMulai: '2026-06-10',
      tanggalSelesai: '2026-06-15',
      pejabatPlh: 'Drs. H. Syamsul Hadi, M.H.',
      status: 'Selesai',
      keterangan: 'Pelimpahan wewenang cuti alasan penting keluarga.'
    }
  ]
};

export function SuratProvider({ children }) {
  // Current user & authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('surat_current_user');
    return saved ? JSON.parse(saved) : USERS.petugas;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Active navigation view
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeLetterId, setActiveLetterId] = useState('SM-001');

  // Supabase Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Main collections (initialized with local cache or fallback)
  const [suratMasuk, setSuratMasuk] = useState(() => {
    const saved = localStorage.getItem('surat_masuk_data');
    return saved ? JSON.parse(saved) : INITIAL_SURAT_MASUK;
  });

  const [suratKeluar, setSuratKeluar] = useState(() => {
    const saved = localStorage.getItem('surat_keluar_data');
    return saved ? JSON.parse(saved) : INITIAL_SURAT_KELUAR;
  });

  const [disposisiList, setDisposisiList] = useState(() => {
    const saved = localStorage.getItem('surat_disposisi_data');
    return saved ? JSON.parse(saved) : INITIAL_DISPOSISI;
  });

  const [trackingList, setTrackingList] = useState(() => {
    const saved = localStorage.getItem('surat_tracking_data');
    return saved ? JSON.parse(saved) : INITIAL_TRACKING;
  });

  const [nomorConfig, setNomorConfig] = useState(() => {
    const saved = localStorage.getItem('surat_nomor_config');
    return saved ? JSON.parse(saved) : INITIAL_NOMOR_CONFIG;
  });

  // Pelimpahan Kewenangan (Plh Ketua saat Cuti / Dinas Luar)
  const [plhConfig, setPlhConfig] = useState(() => {
    const saved = localStorage.getItem('surat_plh_config');
    return saved ? JSON.parse(saved) : INITIAL_PLH_CONFIG;
  });

  // WhatsApp Gateway Settings
  const [waSettings, setWaSettings] = useState(() => {
    const saved = localStorage.getItem('surat_wa_settings');
    return saved ? JSON.parse(saved) : {
      token: 'fn_live_89a7f3429188bc89471abdfc9320e81b',
      senderPhone: '+62 812-3456-7890',
      status: 'Terhubung & Aktif',
      serverStatus: 'Online',
      dailyQuota: { used: 180, total: 5000 },
      triggers: {
        suratMasuk: true,
        distribusi: true,
        disposisi: true,
        tindakLanjut: true,
      },
      messageLogs: [
        {
          id: 'log-1',
          time: '20 Okt 2026, 10:18 WIB',
          recipient: 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
          type: 'Disposisi Surat',
          nomorSurat: '012/PA.Lmg/X/2026',
          text: 'Yth. Bpk. H. M. Ridwan, S.H., terdapat Disposisi Baru dari Ketua PA Lumajang untuk surat No. 012/PA.Lmg/X/2026. Arahan: Hadiri dan wakili pimpinan dalam Rakor PTA Surabaya.',
          status: 'Terkirim (Centang Dua)'
        },
        {
          id: 'log-2',
          time: '20 Okt 2026, 10:18 WIB',
          recipient: 'Ibu Dra. Hj. Nurjanah, M.H. (Panitera)',
          type: 'Disposisi Surat',
          nomorSurat: '012/PA.Lmg/X/2026',
          text: 'Yth. Ibu Dra. Hj. Nurjanah, M.H., terdapat Disposisi Baru dari Ketua PA Lumajang untuk surat No. 012/PA.Lmg/X/2026. Arahan: Siapkan bahan pemaparan e-Court.',
          status: 'Terkirim (Centang Dua)'
        },
        {
          id: 'log-3',
          time: '20 Okt 2026, 09:15 WIB',
          recipient: 'Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua)',
          type: 'Surat Masuk Baru',
          nomorSurat: '047/UM.01/X/2026',
          text: 'Pemberitahuan Surat Masuk Baru: No. 047/UM.01/X/2026 dari Pengadilan Tinggi perihal Sosialisasi PTSP Disabilitas. Sifat: Sangat Segera.',
          status: 'Terkirim (Centang Dua)'
        }
      ]
    };
  });

  // Global Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch letters directly from Supabase
  const fetchSurat = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from('kliksurat')
        .select('*')
        .order('tanggal_surat', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const masuk = [];
        const keluar = [];
        const disposisiMap = {};
        const trackingMap = {};

        data.forEach(row => {
          if (row.jenis_surat === 'masuk') {
            masuk.push(mapRowToSuratMasuk(row));
          } else if (row.jenis_surat === 'keluar') {
            keluar.push(mapRowToSuratKeluar(row));
          }

          if (row.disposisi) {
            disposisiMap[row.id] = row.disposisi;
          }

          if (row.tracking && Array.isArray(row.tracking)) {
            trackingMap[row.id] = row.tracking;
          }
        });

        setSuratMasuk(masuk);
        setSuratKeluar(keluar);
        setDisposisiList(disposisiMap);
        setTrackingList(trackingMap);

        // Update local cache
        localStorage.setItem('surat_masuk_data', JSON.stringify(masuk));
        localStorage.setItem('surat_keluar_data', JSON.stringify(keluar));
        localStorage.setItem('surat_disposisi_data', JSON.stringify(disposisiMap));
        localStorage.setItem('surat_tracking_data', JSON.stringify(trackingMap));
      }
    } catch (err) {
      console.error('Koneksi Supabase gagal:', err);
      setFetchError(err.message || 'Gagal terhubung ke database');
    } finally {
      setIsLoading(false);
    }
  };

  // Load from Supabase on mount and listen to Realtime changes
  useEffect(() => {
    fetchSurat();

    const channel = supabase
      .channel('kliksurat_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kliksurat' },
        () => {
          fetchSurat();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('surat_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('surat_wa_settings', JSON.stringify(waSettings));
  }, [waSettings]);

  useEffect(() => {
    localStorage.setItem('surat_nomor_config', JSON.stringify(nomorConfig));
  }, [nomorConfig]);

  useEffect(() => {
    localStorage.setItem('surat_plh_config', JSON.stringify(plhConfig));
  }, [plhConfig]);

  // Actions Plh (Mendukung pelimpahan ke Wakil Ketua ATAU Hakim yang Ditunjuk saat keduanya berhalangan)
  const aktifkanPlh = (form) => {
    const tipePelimpahan = form.tipePelimpahan || plhConfig.tipePelimpahan || 'wakil_ketua';
    const targetPejabat = tipePelimpahan === 'hakim_ditunjuk'
      ? (form.pejabatHakim || plhConfig.pejabatHakim)
      : (form.pejabatWakil || plhConfig.pejabatWakil);

    const updated = {
      ...plhConfig,
      isActive: true,
      tipePelimpahan,
      alasanKetiadaan: form.alasanKetiadaan || plhConfig.alasanKetiadaan || (tipePelimpahan === 'hakim_ditunjuk' ? 'keduanya_dinas_luar' : 'cuti_ketua'),
      pejabatPlh: targetPejabat,
      pejabatHakim: form.pejabatHakim || plhConfig.pejabatHakim,
      pejabatWakil: form.pejabatWakil || plhConfig.pejabatWakil,
      nomorSK: form.nomorSK || plhConfig.nomorSK,
      jenisCuti: form.jenisCuti || plhConfig.jenisCuti,
      tanggalMulai: form.tanggalMulai || plhConfig.tanggalMulai,
      tanggalSelesai: form.tanggalSelesai || plhConfig.tanggalSelesai,
      keterangan: form.keterangan || plhConfig.keterangan,
      wewenang: form.wewenang || plhConfig.wewenang,
    };
    setPlhConfig(updated);

    const namaPlh = targetPejabat.name;
    const penerimaLabel = tipePelimpahan === 'hakim_ditunjuk'
      ? 'Hakim yang Ditunjuk (Hakim Senior)'
      : 'Wakil Ketua';

    if (waSettings.triggers.disposisi) {
      triggerWhatsApp(
        'Pelimpahan Kewenangan (Plh)',
        'Seluruh Pejabat & Aparatur Pengadilan',
        updated.nomorSK,
        `Pemberitahuan Resmi: ${tipePelimpahan === 'hakim_ditunjuk' ? 'Ketua dan Wakil Ketua sedang cuti/dinas luar bersamaan.' : 'Ketua Pengadilan Agama sedang melaksanakan ' + updated.jenisCuti + '.'} Berdasarkan SK No. ${updated.nomorSK}, seluruh kewenangan pimpinan dilimpahkan kepada ${namaPlh} (${penerimaLabel}) selaku Pelaksana Harian (Plh. Ketua).`
      );
    }

    showToast(`Pelimpahan Kewenangan Plh. Ketua kepada ${penerimaLabel} berhasil DIAKTIFKAN berdasarkan SK No. ${updated.nomorSK}`, 'success');
  };

  const nonaktifkanPlh = () => {
    const riwayatBaru = {
      id: `PLH-${Date.now()}`,
      nomorSK: plhConfig.nomorSK,
      tipePelimpahan: plhConfig.tipePelimpahan || 'wakil_ketua',
      jenisCuti: plhConfig.jenisCuti,
      tanggalMulai: plhConfig.tanggalMulai,
      tanggalSelesai: plhConfig.tanggalSelesai,
      pejabatPlh: plhConfig.pejabatPlh.name,
      status: 'Selesai',
      keterangan: plhConfig.keterangan
    };

    setPlhConfig(prev => ({
      ...prev,
      isActive: false,
      riwayat: [riwayatBaru, ...(prev.riwayat || [])]
    }));

    if (waSettings.triggers.disposisi) {
      triggerWhatsApp(
        'Pencabutan Plh / Pimpinan Aktif',
        'Seluruh Pejabat & Staf Pengadilan',
        plhConfig.nomorSK,
        `Pemberitahuan Resmi: Masa cuti / dinas luar pimpinan telah selesai. Wewenang kedinasan dan disposisi naskah kembali diampu penuh oleh Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua Pengadilan Agama).`
      );
    }

    showToast(`Status Plh. Ketua telah dinonaktifkan. Kewenangan kembali penuh ke Ketua Pengadilan.`, 'info');
  };

  // Actions User & Navigasi
  const switchUser = (roleKey) => {
    if (USERS[roleKey]) {
      setCurrentUser(USERS[roleKey]);
      showToast(`Beralih peran sebagai: ${USERS[roleKey].name} (${USERS[roleKey].role})`, 'info');
    }
  };

  const login = (roleKey = 'petugas') => {
    setIsLoggedIn(true);
    switchUser(roleKey);
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const navigateTo = (page, letterId = null) => {
    setCurrentPage(page);
    if (letterId) {
      setActiveLetterId(letterId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to send WhatsApp notification
  const triggerWhatsApp = (type, recipientName, nomorSurat, customText) => {
    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      recipient: recipientName,
      type,
      nomorSurat,
      text: customText,
      status: 'Terkirim (Centang Dua)'
    };
    setWaSettings(prev => ({
      ...prev,
      dailyQuota: {
        ...prev.dailyQuota,
        used: prev.dailyQuota.used + 1
      },
      messageLogs: [newLog, ...prev.messageLogs]
    }));
  };

  // Add new Surat Masuk -> Simpan ke Supabase
  const addSuratMasuk = async (formData) => {
    const count = suratMasuk.length + 1;
    const newId = `SM-${String(count).padStart(3, '0')}`;
    const agendaNo = formatAgendaSuratMasuk(count, formData.tanggalSurat || formData.tanggalTerima || new Date());
    const currentStatus = formData.status || 'Diregistrasi';
    const prioritasNorm = formData.prioritas || (formData.sifat === 'sangat_segera' ? 'Sangat Segera' : 'Segera');
    const sifatSuratNorm = formData.sifatSurat || 'Biasa';
    const sifatNorm = formData.sifat || sifatSuratNorm.toLowerCase().replace(/ /g, '_');
    const targetPejabat = formData.pejabatPenerima || 'Ketua Pengadilan';

    const newLetter = {
      id: newId,
      nomorSurat: formData.nomorSurat,
      jenisSurat: formData.jenisSurat || 'Surat Dinas',
      prioritas: prioritasNorm,
      sifatSurat: sifatSuratNorm,
      pejabatPenerima: targetPejabat,
      agenda: agendaNo,
      asalSurat: formData.asalSurat,
      perihal: formData.perihal,
      tanggalSurat: formData.tanggalSurat,
      tanggalTerima: formData.tanggalTerima || new Date().toISOString().slice(0, 16),
      sifat: sifatNorm,
      status: currentStatus,
      lampiran: formData.lampiran || '1 Berkas PDF',
      fileScan: formData.fileScan || 'Naskah_Surat_Masuk.pdf',
      fileSize: '2.1 MB',
      tujuanAwal: targetPejabat,
      prioritasTinggi: true,
    };

    const initialTrack = [
      {
        waktu: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        petugas: `${currentUser.name} (${currentUser.role})`,
        tahap: `Registrasi Surat Masuk (${currentStatus})`,
        status: `Surat dicatat dengan nomor agenda ${agendaNo} dan status '${currentStatus}'`,
        icon: 'inbox',
        badge: currentStatus,
        badgeColor: 'bg-primary-light text-primary'
      }
    ];

    // Optimistic local state update
    setSuratMasuk(prev => [newLetter, ...prev]);
    setTrackingList(prev => ({
      ...prev,
      [newId]: initialTrack
    }));

    // Insert ke Supabase tabel 'kliksurat'
    try {
      const dbRow = mapSuratMasukToRow(newLetter, initialTrack);
      const { error } = await supabase.from('kliksurat').insert(dbRow);
      if (error) throw error;
      showToast(`Surat Masuk ${newLetter.nomorSurat} tersimpan di Supabase.`);
    } catch (err) {
      console.error('Gagal simpan surat masuk ke Supabase:', err);
      showToast(`Tersimpan lokal (Sinkronisasi database: ${err.message})`, 'warning');
    }

    // Trigger WhatsApp notification if enabled
    if (waSettings.triggers.suratMasuk) {
      triggerWhatsApp(
        'Surat Masuk Baru',
        'Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua)',
        newLetter.nomorSurat,
        `Terdapat Surat Masuk Baru No. ${newLetter.nomorSurat} dari ${newLetter.asalSurat} perihal "${newLetter.perihal}". Sifat: ${newLetter.sifat.toUpperCase()}. Mohon ditinjau.`
      );
    }

    return newId;
  };

  // Add Surat Keluar Draft -> Simpan ke Supabase
  const addSuratKeluarDraft = async (draftData) => {
    const count = suratKeluar.length + 1;
    const newId = `SK-${String(count).padStart(3, '0')}`;
    const agendaNo = formatAgendaSuratKeluar(count, draftData.tanggalSurat || new Date());

    const newDraft = {
      id: newId,
      nomorSurat: 'Draft (Menunggu Persetujuan Atasan)',
      agenda: agendaNo,
      unitPengusul: draftData.unitPengusul || currentUser.department,
      pembuat: `${currentUser.name} (${currentUser.role})`,
      tujuanSurat: draftData.tujuanSurat,
      perihal: draftData.perihal,
      tanggalSurat: draftData.tanggalSurat || new Date().toISOString().slice(0, 10),
      sifat: draftData.sifat || 'biasa',
      status: 'Menunggu Persetujuan Atasan',
      disetujuiOleh: null,
      waktuPersetujuan: null,
      nomorUrut: null,
      kodeKlasifikasi: draftData.kodeKlasifikasi || 'HK.01',
      lampiran: draftData.lampiran || '1 Berkas',
    };

    setSuratKeluar(prev => [newDraft, ...prev]);

    try {
      const dbRow = mapSuratKeluarToRow(newDraft);
      const { error } = await supabase.from('kliksurat').insert(dbRow);
      if (error) throw error;
      showToast(`Draf surat keluar berhasil diajukan dan tersimpan di database.`);
    } catch (err) {
      console.error('Gagal simpan draf surat keluar ke Supabase:', err);
      showToast(`Draf tersimpan lokal (Sinkronisasi database: ${err.message})`, 'warning');
    }

    return newId;
  };

  // Roman numeral helper
  const getRomanMonth = (monthNumber) => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return roman[monthNumber] || 'X';
  };

  // Approve Surat Keluar & generate official number -> Update Supabase
  const approveAndNumberSuratKeluar = async (letterId) => {
    const targetKlasifikasi = suratKeluar.find(s => s.id === letterId)?.kodeKlasifikasi || 'HK.01';
    
    // Increment counter in config
    let nextNum = 1044;
    setNomorConfig(prev => {
      const updated = prev.klasifikasi.map(k => {
        if (k.kode === targetKlasifikasi) {
          nextNum = k.counter + 1;
          return { ...k, counter: nextNum };
        }
        return k;
      });
      return { ...prev, klasifikasi: updated };
    });

    const romanMonth = getRomanMonth(new Date().getMonth());
    const generatedNo = `${nomorConfig.kodePrefix}/${nextNum}/${targetKlasifikasi}/${romanMonth}/${nomorConfig.tahun}`;
    
    // Penentuan nama pejabat yang menyetujui (Ketua / Plh Wakil Ketua / Plh Hakim Ditunjuk)
    let approvedByName = currentUser.name;
    if (plhConfig.isActive) {
      if (plhConfig.tipePelimpahan === 'hakim_ditunjuk') {
        if (currentUser.roleKey === 'hakim_senior' || currentUser.roleKey === 'wakil_ketua' || currentUser.roleKey === 'ketua') {
          approvedByName = `${plhConfig.pejabatPlh.name} (Plh. Ketua / Hakim Ditunjuk)`;
        }
      } else {
        if (currentUser.roleKey === 'wakil_ketua' || currentUser.roleKey === 'ketua') {
          approvedByName = `${USERS.wakil_ketua.name} (Plh. Ketua)`;
        }
      }
    }

    const waktuPersetujuanIso = new Date().toISOString();

    setSuratKeluar(prev => prev.map(item => {
      if (item.id === letterId) {
        return {
          ...item,
          nomorSurat: generatedNo,
          status: 'Disetujui & Diterbitkan Nomor',
          disetujuiOleh: approvedByName,
          waktuPersetujuan: waktuPersetujuanIso,
          nomorUrut: nextNum,
        };
      }
      return item;
    }));

    try {
      const { error } = await supabase
        .from('kliksurat')
        .update({
          nomor_surat: generatedNo,
          status: 'Disetujui & Diterbitkan Nomor',
          disetujui_oleh: approvedByName,
          waktu_persetujuan: waktuPersetujuanIso,
          nomor_urut: nextNum,
        })
        .eq('id', letterId);

      if (error) throw error;
      showToast(`Surat keluar berhasil disetujui & diterbitkan dengan nomor: ${generatedNo}`);
    } catch (err) {
      console.error('Gagal update persetujuan ke Supabase:', err);
      showToast(`Disetujui lokal (Sinkronisasi database: ${err.message})`, 'warning');
    }

    if (waSettings.triggers.suratMasuk) {
      triggerWhatsApp(
        'Surat Keluar Diterbitkan',
        'Petugas Persuratan & Pembuat Naskah',
        generatedNo,
        `Surat keluar telah disetujui oleh ${approvedByName} dan diterbitkan dengan nomor resmi: ${generatedNo}.`
      );
    }
  };

  // Save Disposisi -> Update Supabase & Multi-step Workflow
  const saveDisposisi = async (suratId, formDisposisi) => {
    const existing = disposisiList[suratId];
    const nomorLembar = existing?.nomorLembar || `LK-${suratId.replace('SM-', '')}`;

    let pemberiName = currentUser.name;
    let pemberiRole = currentUser.role;
    let penandatanganName = currentUser.name;
    let jabatanTte = `${currentUser.role} Pengadilan Agama Lumajang Kelas I-A`;

    // Pelimpahan ke Plh (Wakil Ketua ATAU Hakim yang Ditunjuk)
    if (plhConfig.isActive) {
      if (plhConfig.tipePelimpahan === 'hakim_ditunjuk') {
        if (currentUser.roleKey === 'hakim_senior' || currentUser.roleKey === 'wakil_ketua' || currentUser.roleKey === 'ketua') {
          pemberiName = `${plhConfig.pejabatPlh.name} (Plh. Ketua)`;
          pemberiRole = 'Hakim yang Ditunjuk selaku Plh. Ketua Pengadilan';
          penandatanganName = plhConfig.pejabatPlh.name;
          jabatanTte = `Hakim Senior selaku Plh. Ketua PA Lumajang (SK No. ${plhConfig.nomorSK})`;
        }
      } else {
        if (currentUser.roleKey === 'wakil_ketua' || currentUser.roleKey === 'ketua') {
          pemberiName = `${USERS.wakil_ketua.name} (Plh. Ketua)`;
          pemberiRole = 'Plh. Ketua Pengadilan Agama';
          penandatanganName = USERS.wakil_ketua.name;
          jabatanTte = `Plh. Ketua Pengadilan Agama Lumajang (SK No. ${plhConfig.nomorSK})`;
        }
      }
    }

    const tahapSaatIni = formDisposisi.alurTahap || (formDisposisi.tahapAksi ? formDisposisi.tahapAksi : 3);
    
    let targetStatus = 'Telah Didisposisi';
    let tahapTrackLabel = 'Pengesahan Disposisi';
    let trackStatusMsg = '';
    let trackIcon = 'assignment_turned_in';

    if (tahapSaatIni === 2) {
      // Tahap 2: Sekretaris/Plh memberi catatan & meneruskan ke Ketua/Wakil Ketua/Plh
      targetStatus = 'Telah Didisposisi';
      tahapTrackLabel = 'Telaah & Catatan Pengelola Surat';
      const tujuan = formDisposisi.tujuanPimpinan || 'Ketua Pengadilan';
      trackStatusMsg = `Sekretaris menelaah dan meneruskan lembar disposisi ke ${tujuan}. Catatan: "${(formDisposisi.catatanSekretaris || '').slice(0, 100)}"`;
      trackIcon = 'rate_review';
    } else if (tahapSaatIni === 3) {
      // Tahap 3: Ketua/Wakil/Plh memberi perintah tindak lanjut ke Sekretaris/Panitera/Keduanya
      targetStatus = 'Dalam Tindak Lanjut';
      tahapTrackLabel = 'Perintah Tindak Lanjut Pimpinan';
      const recipients = formDisposisi.diteruskanKepada || ['Sekretaris', 'Panitera'];
      trackStatusMsg = `Pimpinan menerbitkan arahan tindak lanjut kepada: ${recipients.join(' & ')}. Perintah: "${(formDisposisi.isiArahan || '').slice(0, 100)}"`;
      trackIcon = 'assignment_turned_in';
    } else if (tahapSaatIni === 4) {
      // Tahap 4: Sekretaris mendisposisi ke Kasubag Umum & Keuangan untuk arsip
      targetStatus = 'Diarsipkan';
      tahapTrackLabel = 'Disposisi Pengarsipan Surat';
      trackStatusMsg = `Sekretaris mendisposisikan surat kepada Kasubag Umum & Keuangan untuk pengarsipan warkat dinas. Status: Diarsipkan.`;
      trackIcon = 'inventory_2';
    }

    if (formDisposisi.statusSurat) {
      targetStatus = formDisposisi.statusSurat;
    }

    const newDisposisi = {
      id: existing?.id || `DISP-${Date.now()}`,
      nomorLembar,
      suratId,
      ...existing,
      ...formDisposisi,
      alurTahap: Math.max(tahapSaatIni, existing?.alurTahap || 1),
      pemberiDisposisi: formDisposisi.pemberiDisposisi || existing?.pemberiDisposisi || `${pemberiName} (${pemberiRole})`,
      tanggalDisposisi: formDisposisi.tanggalDisposisi || existing?.tanggalDisposisi || new Date().toISOString(),
      sifatDisposisi: formDisposisi.sifatDisposisi || existing?.sifatDisposisi || 'segera',
      diteruskanKepada: formDisposisi.diteruskanKepada || existing?.diteruskanKepada || ['Sekretaris', 'Panitera'],
      instruksiPilihan: formDisposisi.instruksiPilihan || existing?.instruksiPilihan || ['Selesaikan sesuai ketentuan yang berlaku'],
      isiArahan: formDisposisi.isiArahan !== undefined ? formDisposisi.isiArahan : (existing?.isiArahan || ''),
      catatanKhusus: formDisposisi.catatanKhusus !== undefined ? formDisposisi.catatanKhusus : (existing?.catatanKhusus || ''),
      
      // Catatan Sekretaris (Tahap 2)
      catatanSekretaris: formDisposisi.catatanSekretaris !== undefined ? formDisposisi.catatanSekretaris : (existing?.catatanSekretaris || ''),
      penelaahSekretaris: formDisposisi.penelaahSekretaris || existing?.penelaahSekretaris || 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
      tanggalTelaahSekretaris: formDisposisi.tanggalTelaahSekretaris || existing?.tanggalTelaahSekretaris || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      tujuanPimpinan: formDisposisi.tujuanPimpinan || existing?.tujuanPimpinan || 'Ketua Pengadilan',

      // Pengarsipan ke Kasubag Umum & Keuangan (Tahap 4)
      disposisiKeArsip: formDisposisi.disposisiKeArsip || existing?.disposisiKeArsip || 'Kepala Subbagian Umum dan Keuangan',
      catatanPengarsipan: formDisposisi.catatanPengarsipan !== undefined ? formDisposisi.catatanPengarsipan : (existing?.catatanPengarsipan || ''),
      tanggalArsip: formDisposisi.tanggalArsip || existing?.tanggalArsip || (tahapSaatIni === 4 ? new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''),
      petugasArsip: formDisposisi.petugasArsip || existing?.petugasArsip || 'Kepala Subbagian Umum dan Keuangan',
      isArchived: tahapSaatIni === 4 ? true : Boolean(existing?.isArchived),

      tandaTanganElektronik: existing?.tandaTanganElektronik || {
        status: 'TERVERIFIKASI',
        penandatangan: penandatanganName,
        jabatan: jabatanTte,
        sha256: `9F8A...${Math.random().toString(36).substring(2, 8).toUpperCase()}-ID`,
        waktuSertifikasi: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }
    };

    const newTrack = {
      waktu: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      petugas: `${currentUser.name} (${currentUser.role})`,
      tahap: tahapTrackLabel,
      status: trackStatusMsg || `Lembar Disposisi ${nomorLembar} diproses.`,
      icon: trackIcon,
      badge: targetStatus,
      badgeColor: targetStatus === 'Diarsipkan' ? 'bg-zinc-100 text-zinc-800' : targetStatus === 'Dalam Tindak Lanjut' ? 'bg-orange-100 text-orange-900' : 'bg-success-light text-success'
    };

    const updatedTracking = [...(trackingList[suratId] || []), newTrack];

    // Optimistic local state update
    setDisposisiList(prev => ({
      ...prev,
      [suratId]: newDisposisi
    }));

    setSuratMasuk(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: targetStatus };
      }
      return s;
    }));

    setTrackingList(prev => ({
      ...prev,
      [suratId]: updatedTracking
    }));

    // Update Supabase
    try {
      const { error } = await supabase
        .from('kliksurat')
        .update({
          disposisi: newDisposisi,
          status: targetStatus,
          tracking: updatedTracking,
        })
        .eq('id', suratId);

      if (error) throw error;
      showToast(`Alur Disposisi ${nomorLembar} berhasil diperbarui (Status: ${targetStatus}).`);
    } catch (err) {
      console.error('Gagal simpan disposisi ke Supabase:', err);
      showToast(`Disposisi tersimpan lokal (Sinkronisasi database: ${err.message})`, 'warning');
    }

    // Trigger WhatsApp notification to recipients
    if (waSettings.triggers.disposisi) {
      const targetPenerima = tahapSaatIni === 2
        ? [newDisposisi.tujuanPimpinan]
        : tahapSaatIni === 4
        ? ['Kepala Subbagian Umum dan Keuangan']
        : newDisposisi.diteruskanKepada;

      targetPenerima.forEach(penerima => {
        triggerWhatsApp(
          'Alur Disposisi Surat',
          penerima,
          suratMasuk.find(s => s.id === suratId)?.nomorSurat || suratId,
          `Yth. ${penerima}, pembaruan alur disposisi surat ${suratMasuk.find(s => s.id === suratId)?.nomorSurat} dari ${currentUser.name}. Status: ${targetStatus}.`
        );
      });
    }
  };

  // Update status surat masuk dinamis (8 status sesuai pedoman)
  const updateSuratMasukStatus = async (suratId, newStatus) => {
    const newTrack = {
      waktu: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      petugas: `${currentUser.name} (${currentUser.role})`,
      tahap: `Pembaruan Status Naskah`,
      status: `Status surat masuk diperbarui menjadi '${newStatus}'`,
      icon: 'sync_alt',
      badge: newStatus,
      badgeColor: 'bg-primary-light text-primary'
    };

    const updatedTracking = [...(trackingList[suratId] || []), newTrack];

    setSuratMasuk(prev => prev.map(s => {
      if (s.id === suratId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));

    setTrackingList(prev => ({
      ...prev,
      [suratId]: updatedTracking
    }));

    try {
      const { error } = await supabase
        .from('kliksurat')
        .update({
          status: newStatus,
          tracking: updatedTracking
        })
        .eq('id', suratId);

      if (error) throw error;
      showToast(`Status surat ${suratId} berhasil diubah ke: ${newStatus}`);
    } catch (err) {
      console.error('Gagal update status di Supabase:', err);
      showToast(`Status diperbarui lokal (${err.message})`, 'info');
    }
  };

  return (
    <SuratContext.Provider
      value={{
        USERS,
        currentUser,
        switchUser,
        isLoggedIn,
        login,
        logout,
        currentPage,
        navigateTo,
        activeLetterId,
        setActiveLetterId,
        suratMasuk,
        suratKeluar,
        disposisiList,
        trackingList,
        nomorConfig,
        setNomorConfig,
        waSettings,
        setWaSettings,
        addSuratMasuk,
        updateSuratMasukStatus,
        addSuratKeluarDraft,
        approveAndNumberSuratKeluar,
        saveDisposisi,
        plhConfig,
        setPlhConfig,
        aktifkanPlh,
        nonaktifkanPlh,
        toast,
        showToast,
        isLoading,
        fetchError,
        fetchSurat,
      }}
    >
      {children}
    </SuratContext.Provider>
  );
}

export function useSurat() {
  const context = useContext(SuratContext);
  if (!context) {
    throw new Error('useSurat must be used within a SuratProvider');
  }
  return context;
}
