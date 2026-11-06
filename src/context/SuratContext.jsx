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

/**
 * Standar Matriks Hak Akses Aplikasi KlikDispos:
 * 1. Kasubag Umum & Sekretaris: Admin (melihat seluruh menu aplikasi, menambah, edit, hapus data)
 * 2. Petugas Surat: hanya melihat dashboard, surat masuk, surat keluar, distribusi surat, pelacakan surat, arsip surat
 * 3. Ketua, Wakil, Plh Ketua: hanya melihat dashboard, surat masuk, halaman pimpinan, arsip surat
 * 4. Panitera: hanya melihat dashboard, surat masuk, disposisi surat
 */
export function getAllowedMenusForRole(roleKey) {
  switch (roleKey) {
    case 'kasubag_umum':
    case 'sekretaris':
    case 'admin':
      return [
        'dashboard',
        'surat-masuk',
        'surat-keluar',
        'distribusi',
        'disposisi',
        'pelacakan',
        'arsip',
        'pengaturan-nomor',
        'laporan',
        'pimpinan',
        'kewenangan-plh',
        'whatsapp',
        'akun',
      ];
    case 'petugas':
      return [
        'dashboard',
        'surat-masuk',
        'surat-keluar',
        'distribusi',
        'pelacakan',
        'arsip',
      ];
    case 'ketua':
    case 'wakil_ketua':
    case 'hakim_senior':
    case 'plh_ketua':
      return [
        'dashboard',
        'surat-masuk',
        'pimpinan',
        'arsip',
      ];
    case 'panitera':
      return [
        'dashboard',
        'surat-masuk',
        'disposisi',
      ];
    default:
      return ['dashboard', 'surat-masuk'];
  }
}

export const INITIAL_USERS_LIST = [
  {
    id: 'usr-sekretaris',
    key: 'sekretaris',
    roleKey: 'sekretaris',
    jabatan: 'Sekretaris',
    role: 'Sekretaris (Admin)',
    name: 'Dr. Rozy Alifian Mukhtar, S.H., M.Kn.',
    username: 'sekretaris',
    email: 'sekretaris@peradilan.go.id',
    password: 'password123',
    nip: '19750824 200212 1 001',
    department: 'Kesekretariatan',
    initials: 'RM',
    avatarColor: 'bg-emerald-700 text-white',
    badge: 'Sekretaris (Admin)',
    status: 'Aktif',
    isAdmin: true,
    permissions: ['all_menus', 'create', 'read', 'update', 'delete'],
    accessSummary: 'Seluruh Menu Aplikasi (Admin CRUD Penuh)'
  },
  {
    id: 'usr-kasubag-umum',
    key: 'kasubag_umum',
    roleKey: 'kasubag_umum',
    jabatan: 'Kasubag Umum',
    role: 'Kasubag Umum (Admin)',
    name: 'Nindyra Ayu Sagita, S.Sos.',
    username: 'bendahara',
    email: 'kasubag.umum@peradilan.go.id',
    password: 'password123',
    nip: '19820719 200801 2 005',
    department: 'Subbag Umum & Keuangan (Tata Usaha)',
    initials: 'NS',
    avatarColor: 'bg-teal-700 text-white',
    badge: 'Kasubag Umum (Admin)',
    status: 'Aktif',
    isAdmin: true,
    permissions: ['all_menus', 'create', 'read', 'update', 'delete'],
    accessSummary: 'Seluruh Menu Aplikasi (Admin CRUD Penuh)'
  },
  {
    id: 'usr-petugas',
    key: 'petugas',
    roleKey: 'petugas',
    jabatan: 'Petugas Surat',
    role: 'Petugas Surat',
    name: 'Ahmad Fauzi, S.H.',
    username: 'petugas',
    email: 'ahmad.fauzi@peradilan.go.id',
    password: 'password123',
    nip: '19880412 201101 1 003',
    department: 'Subbag Umum & Tata Usaha (Persuratan)',
    initials: 'AF',
    avatarColor: 'bg-primary text-white',
    badge: 'Petugas Surat',
    status: 'Aktif',
    isAdmin: false,
    permissions: ['dashboard', 'surat-masuk', 'surat-keluar', 'distribusi', 'pelacakan', 'arsip'],
    accessSummary: 'Dashboard, Surat Masuk, Surat Keluar, Distribusi, Pelacakan, Arsip'
  },
  {
    id: 'usr-ketua',
    key: 'ketua',
    roleKey: 'ketua',
    jabatan: 'Ketua',
    role: 'Ketua Pengadilan Agama',
    name: 'Abdul Kodir, S.Ag., M.M.',
    username: 'ketua',
    email: 'ketua@peradilan.go.id',
    password: 'password123',
    nip: '19690110 199403 1 002',
    department: 'Pimpinan Pengadilan',
    initials: 'AK',
    avatarColor: 'bg-emerald-800 text-white',
    badge: 'Ketua Pengadilan Agama',
    status: 'Aktif',
    isAdmin: false,
    permissions: ['dashboard', 'surat-masuk', 'pimpinan', 'arsip'],
    accessSummary: 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat'
  },
  {
    id: 'usr-wakil-ketua',
    key: 'wakil_ketua',
    roleKey: 'wakil_ketua',
    jabatan: 'Wakil Ketua',
    role: 'Wakil Ketua (Pembina)',
    name: 'Fatkur Rosyad, S.Ag., M.H., M.HES.',
    username: 'pembina',
    email: 'wakil.ketua@peradilan.go.id',
    password: 'password123',
    nip: '19720516 199803 1 004',
    department: 'Pimpinan & Pengawasan',
    initials: 'FR',
    avatarColor: 'bg-amber-700 text-white',
    badge: 'Wakil Ketua',
    status: 'Aktif',
    isAdmin: false,
    permissions: ['dashboard', 'surat-masuk', 'pimpinan', 'arsip'],
    accessSummary: 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat'
  },
  {
    id: 'usr-plh-ketua',
    key: 'hakim_senior',
    roleKey: 'hakim_senior',
    jabatan: 'Plh. Ketua',
    role: 'Plh. Ketua / Pengawas',
    name: 'Samsul Bahri, S.H.I., M.H.',
    username: 'pengawas',
    email: 'plh.ketua@peradilan.go.id',
    password: 'password123',
    nip: '19700612 199603 1 001',
    department: 'Kepaniteraan & Hakim Peradilan',
    initials: 'SB',
    avatarColor: 'bg-indigo-700 text-white',
    badge: 'Plh. Ketua / Hakim Pengawas',
    status: 'Aktif',
    isAdmin: false,
    permissions: ['dashboard', 'surat-masuk', 'pimpinan', 'arsip'],
    accessSummary: 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat'
  },
  {
    id: 'usr-panitera',
    key: 'panitera',
    roleKey: 'panitera',
    jabatan: 'Panitera',
    role: 'Panitera Pengadilan',
    name: 'Ibu Dra. Hj. Nurjanah, M.H.',
    username: 'panitera',
    email: 'nurjanah.panitera@peradilan.go.id',
    password: 'password123',
    nip: '19780315 200501 2 002',
    department: 'Kepaniteraan Perkara',
    initials: 'NJ',
    avatarColor: 'bg-accent-dark text-white',
    badge: 'Panitera Pengadilan',
    status: 'Aktif',
    isAdmin: false,
    permissions: ['dashboard', 'surat-masuk', 'disposisi'],
    accessSummary: 'Dashboard, Surat Masuk, Disposisi Surat'
  }
];

export const USERS = INITIAL_USERS_LIST.reduce((acc, u) => {
  acc[u.key || u.roleKey] = u;
  return acc;
}, {});

const INITIAL_SURAT_MASUK = [];
const INITIAL_SURAT_KELUAR = [];
const INITIAL_DISPOSISI = {};
const INITIAL_TRACKING = {};

const INITIAL_NOMOR_CONFIG = {
  kodePrefix: 'W13-A8',
  kodePa: 'W13-A8',
  tahun: 2026,
  format: '[NO]/[KODE_PENANDATANGAN].[KODE_PA]/[KODE_KLASIFIKASI]/[BULAN]/[TAHUN]',
  rumus: '[Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun]',
  klasifikasi: [
    {
      kode: 'HK.01',
      nama: 'Kepaniteraan Perkara / Administrasi Hukum',
      penjelasan: 'Naskah dinas terkait administrasi perkara peradilan, pemanggilan para pihak, pemberitahuan putusan, delegasi sidang, permohonan kasasi/PK, dan laporan perkara.',
      counter: 0
    },
    {
      kode: 'PL.01',
      nama: 'Perencanaan, TI & Pelaporan',
      penjelasan: 'Naskah dinas terkait usulan rencana kerja operasional, anggaran DIPA, implementasi teknologi informasi, laporan kinerja instansi (LKjIP), SAKIP, dan evaluasi berkala.',
      counter: 0
    },
    {
      kode: 'UM.01',
      nama: 'Umum & Tata Persuratan Kedinasan',
      penjelasan: 'Naskah dinas urusan dinas umum, koordinasi lintas satker, permohonan fasilitas sarpras, pengadaan barang dan jasa, rumah tangga, serta tata persuratan dinas.',
      counter: 0
    },
    {
      kode: 'KP.02',
      nama: 'Kepegawaian, Organisasi & Tata Laksana',
      penjelasan: 'Naskah dinas usulan kenaikan pangkat/golongan, mutasi dan promosi jabatan, permohonan cuti dinas, disiplin pegawai/aparatur, dan pembaruan struktur organisasi.',
      counter: 0
    },
    {
      kode: 'KU.01',
      nama: 'Keuangan & Pengelolaan DIPA',
      penjelasan: 'Naskah dinas pertanggungjawaban realisasi anggaran, pengajuan SPM/SP2D ke KPPN, laporan bulanan bendahara, rekonsiliasi keuangan DIPA 01 & 04, dan urusan pajak.',
      counter: 0
    },
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
  // Dynamic Users List State (persisted in localStorage)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('surat_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS_LIST;
  });

  useEffect(() => {
    localStorage.setItem('surat_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // Current user & authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('surat_current_user');
    return saved ? JSON.parse(saved) : USERS.sekretaris;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    localStorage.setItem('surat_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Active navigation view
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeLetterId, setActiveLetterId] = useState(null);

  // Supabase Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Main collections (initialized with local cache or fallback)
  const [suratMasuk, setSuratMasuk] = useState(() => {
    const saved = localStorage.getItem('surat_masuk_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((s) => s.id === 'SM-001' || s.id === 'SM-002')) {
          localStorage.removeItem('surat_masuk_data');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_SURAT_MASUK;
  });

  const [suratKeluar, setSuratKeluar] = useState(() => {
    const saved = localStorage.getItem('surat_keluar_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((s) => s.id === 'SK-001' || s.id === 'SK-002')) {
          localStorage.removeItem('surat_keluar_data');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_SURAT_KELUAR;
  });

  const [disposisiList, setDisposisiList] = useState(() => {
    const saved = localStorage.getItem('surat_disposisi_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['SM-001'] || parsed['SM-002']) {
          localStorage.removeItem('surat_disposisi_data');
          return {};
        }
        return parsed;
      } catch {
        return {};
      }
    }
    return INITIAL_DISPOSISI;
  });

  const [trackingList, setTrackingList] = useState(() => {
    const saved = localStorage.getItem('surat_tracking_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['SM-001'] || parsed['SM-002']) {
          localStorage.removeItem('surat_tracking_data');
          return {};
        }
        return parsed;
      } catch {
        return {};
      }
    }
    return INITIAL_TRACKING;
  });

  const [nomorConfig, setNomorConfig] = useState(() => {
    const saved = localStorage.getItem('surat_nomor_config');
    if (!saved) return INITIAL_NOMOR_CONFIG;
    try {
      const parsed = JSON.parse(saved);
      const defaultMap = {};
      INITIAL_NOMOR_CONFIG.klasifikasi.forEach((k) => {
        defaultMap[k.kode] = k.penjelasan;
      });
      parsed.klasifikasi = (parsed.klasifikasi || []).map((k) => ({
        ...k,
        penjelasan: k.penjelasan || defaultMap[k.kode] || `Naskah dinas resmi terkait bidang ${k.nama}.`,
      }));
      return parsed;
    } catch {
      return INITIAL_NOMOR_CONFIG;
    }
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
      dailyQuota: { used: 0, total: 5000 },
      triggers: {
        suratMasuk: true,
        distribusi: true,
        disposisi: true,
        tindakLanjut: true,
      },
      messageLogs: []
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
      } else {
        // Data di Supabase kosong (0 baris)
        setSuratMasuk([]);
        setSuratKeluar([]);
        setDisposisiList({});
        setTrackingList({});
        localStorage.setItem('surat_masuk_data', JSON.stringify([]));
        localStorage.setItem('surat_keluar_data', JSON.stringify([]));
        localStorage.setItem('surat_disposisi_data', JSON.stringify({}));
        localStorage.setItem('surat_tracking_data', JSON.stringify({}));
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
  const switchUser = (roleKeyOrId) => {
    const found =
      usersList.find((u) => u.key === roleKeyOrId || u.roleKey === roleKeyOrId || u.id === roleKeyOrId || u.username === roleKeyOrId) ||
      USERS[roleKeyOrId];
    if (found) {
      setCurrentUser(found);
      const allowed = getAllowedMenusForRole(found.roleKey);
      if (!allowed.includes(currentPage)) {
        setCurrentPage('dashboard');
      }
      showToast(`Beralih peran sebagai: ${found.name} (${found.role})`, 'info');
    }
  };

  const login = (roleKey = 'sekretaris') => {
    setIsLoggedIn(true);
    switchUser(roleKey);
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const navigateTo = (page, letterId = null) => {
    const allowed = getAllowedMenusForRole(currentUser.roleKey);
    if (!allowed.includes(page) && !isAdmin) {
      showToast(`Akses menu "${page}" dibatasi untuk peran ${currentUser.role}.`, 'warning');
      setCurrentPage('dashboard');
      return;
    }
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
    const kodePenandatangan = draftData.kodePenandatangan || 'KPA';

    const newDraft = {
      id: newId,
      nomorSurat: 'Draft (Menunggu Persetujuan Atasan)',
      agenda: agendaNo,
      unitPengusul: draftData.unitPengusul || currentUser.department,
      kodePenandatangan: kodePenandatangan,
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
    return roman[monthNumber] || 'XI';
  };

  // Approve Surat Keluar & generate official number -> Update Supabase
  const approveAndNumberSuratKeluar = async (letterId) => {
    const targetItem = suratKeluar.find(s => s.id === letterId);
    const targetKlasifikasi = targetItem?.kodeKlasifikasi || 'HK.01';
    const kodePenandatangan = targetItem?.kodePenandatangan || 'KPA';
    
    // Increment counter in config
    let nextNum = 1044;
    setNomorConfig(prev => {
      const updated = prev.klasifikasi.map(k => {
        if (k.kode === targetKlasifikasi) {
          nextNum = (k.counter || 0) + 1;
          return { ...k, counter: nextNum };
        }
        return k;
      });
      return { ...prev, klasifikasi: updated };
    });

    const dateObj = targetItem?.tanggalSurat ? new Date(targetItem.tanggalSurat) : new Date();
    const monthIdx = isNaN(dateObj.getTime()) ? new Date().getMonth() : dateObj.getMonth();
    const romanMonth = getRomanMonth(monthIdx);
    const tahunSurat = isNaN(dateObj.getTime()) ? (nomorConfig.tahun || 2026) : dateObj.getFullYear();
    const kodePa = nomorConfig.kodePa || nomorConfig.kodePrefix || 'W13-A8';
    
    // Rumus: [Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun]
    const generatedNo = `${nextNum}/${kodePenandatangan}.${kodePa}/${targetKlasifikasi}/${romanMonth}/${tahunSurat}`;
    
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
          kodePenandatangan: kodePenandatangan,
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

  // Hak Akses Admin (Kasubag Umum dan Sekretaris menjadi Admin dapat melihat seluruh menu aplikasi, menambah, edit, hapus data)
  const isAdmin =
    currentUser.roleKey === 'kasubag_umum' ||
    currentUser.roleKey === 'sekretaris' ||
    currentUser.roleKey === 'admin';

  // CRUD Akun Pengelola (Fitur Manajemen Akun seperti Referensi)
  const addUser = (userData) => {
    const newId = `usr-${Date.now()}`;
    const roleKey = userData.roleKey || 'petugas';
    const initials = (userData.name || 'User')
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const created = {
      id: newId,
      key: roleKey,
      roleKey: roleKey,
      jabatan: userData.jabatan || 'Staf Persuratan',
      role: userData.role || userData.jabatan || 'Staf Persuratan',
      name: userData.name,
      username: userData.username?.toLowerCase().replace(/\s+/g, '') || `user${Date.now().toString().slice(-4)}`,
      email: userData.email || `${userData.name.toLowerCase().replace(/[\s,.]+/g, '')}@peradilan.go.id`,
      password: userData.password || 'password123',
      nip: userData.nip || '-',
      department: userData.department || 'Tata Usaha',
      initials: initials || 'ST',
      avatarColor: 'bg-teal-700 text-white',
      badge: userData.jabatan || 'Staf',
      status: userData.status || 'Aktif',
      isAdmin: roleKey === 'kasubag_umum' || roleKey === 'sekretaris' || roleKey === 'admin',
      permissions: getAllowedMenusForRole(roleKey),
      accessSummary:
        roleKey === 'kasubag_umum' || roleKey === 'sekretaris'
          ? 'Seluruh Menu Aplikasi (Admin CRUD Penuh)'
          : roleKey === 'petugas'
          ? 'Dashboard, Surat Masuk, Surat Keluar, Distribusi, Pelacakan, Arsip'
          : roleKey === 'panitera'
          ? 'Dashboard, Surat Masuk, Disposisi Surat'
          : 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat',
    };

    setUsersList((prev) => [created, ...prev]);
    showToast(`Akun pengelola "${created.name}" (${created.jabatan}) berhasil didaftarkan.`, 'success');
    return true;
  };

  const updateUser = (userId, updatedData) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const roleKey = updatedData.roleKey || u.roleKey;
          const updated = {
            ...u,
            ...updatedData,
            roleKey,
            isAdmin: roleKey === 'kasubag_umum' || roleKey === 'sekretaris' || roleKey === 'admin',
            permissions: getAllowedMenusForRole(roleKey),
            accessSummary:
              roleKey === 'kasubag_umum' || roleKey === 'sekretaris'
                ? 'Seluruh Menu Aplikasi (Admin CRUD Penuh)'
                : roleKey === 'petugas'
                ? 'Dashboard, Surat Masuk, Surat Keluar, Distribusi, Pelacakan, Arsip'
                : roleKey === 'panitera'
                ? 'Dashboard, Surat Masuk, Disposisi Surat'
                : 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat',
          };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('Data akun pengelola & kredensial berhasil diperbarui.', 'success');
    return true;
  };

  const deleteUser = (userId) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return false;

    if (currentUser.id === userId) {
      showToast('Tidak dapat menghapus akun yang sedang Anda gunakan saat ini.', 'warning');
      return false;
    }

    if (usersList.length <= 1) {
      showToast('Minimal harus ada satu akun pengelola aktif dalam sistem.', 'warning');
      return false;
    }

    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    showToast(`Akun pengelola "${target.name}" berhasil dihapus.`, 'info');
    return true;
  };

  const addKlasifikasi = (item) => {
    const code = item.kode?.toUpperCase().trim();
    if (!code || !item.nama?.trim()) {
      showToast('Kode dan nama klasifikasi wajib diisi', 'warning');
      return false;
    }
    const exists = (nomorConfig.klasifikasi || []).some((k) => k.kode === code);
    if (exists) {
      showToast(`Kode klasifikasi ${code} sudah terdaftar`, 'warning');
      return false;
    }
    const updated = [
      ...(nomorConfig.klasifikasi || []),
      {
        kode: code,
        nama: item.nama.trim(),
        penjelasan: item.penjelasan?.trim() || `Naskah dinas resmi terkait bidang ${item.nama.trim()}.`,
        counter: Number(item.counter) || 0,
      },
    ];
    setNomorConfig((prev) => ({ ...prev, klasifikasi: updated }));
    showToast(`Kode klasifikasi ${code} berhasil ditambahkan oleh Admin.`, 'success');
    return true;
  };

  const updateKlasifikasi = (oldKode, updatedItem) => {
    const newCode = updatedItem.kode ? updatedItem.kode.toUpperCase().trim() : oldKode;
    if (newCode !== oldKode) {
      const exists = (nomorConfig.klasifikasi || []).some((k) => k.kode === newCode);
      if (exists) {
        showToast(`Kode klasifikasi ${newCode} sudah digunakan`, 'warning');
        return false;
      }
    }
    const updated = (nomorConfig.klasifikasi || []).map((k) => {
      if (k.kode === oldKode) {
        return {
          ...k,
          kode: newCode,
          nama: updatedItem.nama ? updatedItem.nama.trim() : k.nama,
          penjelasan: updatedItem.penjelasan !== undefined ? updatedItem.penjelasan.trim() : k.penjelasan,
          counter: updatedItem.counter !== undefined ? Number(updatedItem.counter) : k.counter,
        };
      }
      return k;
    });
    setNomorConfig((prev) => ({ ...prev, klasifikasi: updated }));
    showToast(`Kode klasifikasi ${oldKode} berhasil diperbarui.`, 'success');
    return true;
  };

  const deleteKlasifikasi = (targetKode) => {
    if ((nomorConfig.klasifikasi || []).length <= 1) {
      showToast('Minimal harus ada satu kode klasifikasi aktif', 'warning');
      return false;
    }
    const updated = (nomorConfig.klasifikasi || []).filter((k) => k.kode !== targetKode);
    setNomorConfig((prev) => ({ ...prev, klasifikasi: updated }));
    showToast(`Kode klasifikasi ${targetKode} berhasil dihapus.`, 'info');
    return true;
  };

  return (
    <SuratContext.Provider
      value={{
        USERS,
        usersList,
        currentUser,
        isAdmin,
        getAllowedMenusForRole,
        addUser,
        updateUser,
        deleteUser,
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
        addKlasifikasi,
        updateKlasifikasi,
        deleteKlasifikasi,
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
