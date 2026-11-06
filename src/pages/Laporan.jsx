import React, { useState, useMemo, useEffect } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';
import KopSurat from '../components/KopSurat';

export default function Laporan() {
  const {
    suratMasuk,
    suratKeluar,
    disposisiList,
    nomorConfig,
    plhConfig,
    laporanTab,
    setLaporanTab,
    showToast,
  } = useSurat();

  // Active Tab: 'masuk' | 'keluar' | 'kode_matriks' | 'gabungan'
  const [activeTab, setActiveTab] = useState(laporanTab || 'masuk');

  useEffect(() => {
    if (laporanTab) {
      setActiveTab(laporanTab);
    }
  }, [laporanTab]);

  // Filter Utama: Pilihan Bulan, Tahun, dan Kode Surat
  const [selectedMonth, setSelectedMonth] = useState('10'); // '01' - '12' or 'all'
  const [selectedYear, setSelectedYear] = useState('2026'); // '2024' - '2027'
  const [selectedKodeSurat, setSelectedKodeSurat] = useState('all'); // 'all' or e.g. 'HK.01'
  const [filterSifat, setFilterSifat] = useState('semua');
  const [searchKeyword, setSearchKeyword] = useState('');

  const MONTHS = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const YEARS = ['2024', '2025', '2026', '2027'];

  // Daftar Kode Klasifikasi Surat (diambil dinamis dari pengaturan sistem)
  const classificationList = useMemo(() => {
    const list = nomorConfig?.klasifikasi || [
      { kode: 'HK.01', nama: 'Kepaniteraan Perkara / Administrasi Hukum' },
      { kode: 'PL.01', nama: 'Perencanaan, TI & Pelaporan' },
      { kode: 'UM.01', nama: 'Umum & Tata Persuratan Kedinasan' },
      { kode: 'KP.02', nama: 'Kepegawaian, Organisasi & Tata Laksana' },
      { kode: 'KU.01', nama: 'Keuangan & Pengelolaan DIPA' },
    ];
    return list;
  }, [nomorConfig]);

  // Helper untuk menentukan / mengekstrak Kode Surat naskah dinas
  const getKodeSurat = (surat) => {
    if (surat.kodeKlasifikasi) return surat.kodeKlasifikasi.toUpperCase();
    const no = surat.nomorSurat || '';

    // Deteksi pola kode seperti HK.01, PL.01, UM.01, dsb
    const match = no.match(/\b([A-Z]{2}\.[0-9]{2})\b/i);
    if (match) return match[1].toUpperCase();

    // Deteksi kode singkatan umum
    const matchSimple = no.match(/\b(HK|PL|UM|KP|KU|OT|HM|TI)\b/i);
    if (matchSimple) {
      const code = matchSimple[1].toUpperCase();
      if (code === 'HK') return 'HK.01';
      if (code === 'PL') return 'PL.01';
      if (code === 'UM') return 'UM.01';
      if (code === 'KP') return 'KP.02';
      if (code === 'KU') return 'KU.01';
      return `${code}.01`;
    }

    // Klasifikasi berbasis kata kunci perihal naskah
    const p = (surat.perihal || '').toLowerCase();
    if (p.includes('perkara') || p.includes('sidang') || p.includes('e-court') || p.includes('hukum')) return 'HK.01';
    if (p.includes('kepegawaian') || p.includes('pangkat') || p.includes('cuti') || p.includes('disiplin')) return 'KP.02';
    if (p.includes('anggaran') || p.includes('dipa') || p.includes('keuangan')) return 'KU.01';
    if (p.includes('ti') || p.includes('sarana') || p.includes('server') || p.includes('internet') || p.includes('pengadaan')) return 'PL.01';
    return 'UM.01';
  };

  // Helper pengecekan bulan dan tahun (YYYY-MM-DD)
  const matchesMonthYear = (dateStr) => {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    if (parts.length < 2) return false;
    const yr = parts[0];
    const mo = parts[1];

    if (selectedYear !== 'all' && yr !== selectedYear) return false;
    if (selectedMonth !== 'all' && mo !== selectedMonth) return false;
    return true;
  };

  // Filtered Surat Masuk (Berdasarkan Bulan, Tahun, dan Kode Surat)
  const filteredSuratMasuk = useMemo(() => {
    return suratMasuk.filter((s) => {
      // Filter Bulan & Tahun (cek tgl surat atau tgl terima)
      if (!matchesMonthYear(s.tanggalSurat) && !matchesMonthYear(s.tanggalTerima?.slice(0, 10))) {
        return false;
      }
      // Filter Kode Surat
      const kode = getKodeSurat(s);
      if (selectedKodeSurat !== 'all' && kode !== selectedKodeSurat) {
        return false;
      }
      // Filter Sifat Surat
      if (filterSifat !== 'semua' && s.sifat !== filterSifat) {
        return false;
      }
      // Filter Pencarian Teks
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const no = (s.nomorSurat || '').toLowerCase();
        const agenda = (s.agenda || '').toLowerCase();
        const asal = (s.asalSurat || '').toLowerCase();
        const perihal = (s.perihal || '').toLowerCase();
        if (!no.includes(q) && !agenda.includes(q) && !asal.includes(q) && !perihal.includes(q) && !kode.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [suratMasuk, selectedMonth, selectedYear, selectedKodeSurat, filterSifat, searchKeyword]);

  // Filtered Surat Keluar (Berdasarkan Bulan, Tahun, dan Kode Surat)
  const filteredSuratKeluar = useMemo(() => {
    return suratKeluar.filter((s) => {
      // Filter Bulan & Tahun
      if (!matchesMonthYear(s.tanggalSurat)) {
        return false;
      }
      // Filter Kode Surat
      const kode = getKodeSurat(s);
      if (selectedKodeSurat !== 'all' && kode !== selectedKodeSurat) {
        return false;
      }
      // Filter Sifat Surat
      if (filterSifat !== 'semua' && s.sifat !== filterSifat) {
        return false;
      }
      // Filter Pencarian Teks
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const no = (s.nomorSurat || '').toLowerCase();
        const perihal = (s.perihal || '').toLowerCase();
        const tujuan = (s.tujuanSurat || '').toLowerCase();
        const unit = (s.unitPengusul || '').toLowerCase();
        if (!no.includes(q) && !perihal.includes(q) && !tujuan.includes(q) && !unit.includes(q) && !kode.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [suratKeluar, selectedMonth, selectedYear, selectedKodeSurat, filterSifat, searchKeyword]);

  // Rekapitulasi Matriks Per Kode Surat (Statistik distribusi kode naskah)
  const kodeMatrixData = useMemo(() => {
    // Ambil semua surat pada periode bulan & tahun yang dipilih
    const periodMasuk = suratMasuk.filter(s => matchesMonthYear(s.tanggalSurat) || matchesMonthYear(s.tanggalTerima?.slice(0, 10)));
    const periodKeluar = suratKeluar.filter(s => matchesMonthYear(s.tanggalSurat));

    return classificationList.map((item) => {
      const countMasuk = periodMasuk.filter(s => getKodeSurat(s) === item.kode).length;
      const countKeluar = periodKeluar.filter(s => getKodeSurat(s) === item.kode).length;
      const total = countMasuk + countKeluar;
      return {
        ...item,
        countMasuk,
        countKeluar,
        total,
      };
    });
  }, [classificationList, suratMasuk, suratKeluar, selectedMonth, selectedYear]);

  // Combined Reports untuk Tab Gabungan
  const combinedReports = useMemo(() => {
    const masuk = filteredSuratMasuk.map((s) => ({
      tipe: 'Surat Masuk',
      kodeSurat: getKodeSurat(s),
      nomorSurat: s.nomorSurat,
      agenda: s.agenda,
      pihak: s.asalSurat,
      perihal: s.perihal,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      status: s.status,
      raw: s,
    }));
    const keluar = filteredSuratKeluar.map((s) => ({
      tipe: 'Surat Keluar',
      kodeSurat: getKodeSurat(s),
      nomorSurat: s.nomorSurat,
      agenda: `SK-${s.nomorUrut || 'DRAFT'}`,
      pihak: s.tujuanSurat,
      perihal: s.perihal,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      status: s.status,
      raw: s,
    }));
    return [...masuk, ...keluar].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
  }, [filteredSuratMasuk, filteredSuratKeluar]);

  // Label Periode & Kode Terpilih
  const monthLabel =
    selectedMonth === 'all'
      ? 'Seluruh Bulan'
      : MONTHS.find((m) => m.value === selectedMonth)?.label || 'Bulan Terpilih';
  const kodeLabel =
    selectedKodeSurat === 'all'
      ? 'Semua Kode Surat'
      : `${selectedKodeSurat} - ${classificationList.find((c) => c.kode === selectedKodeSurat)?.nama || ''}`;
  const periodeLabel = `${monthLabel} ${selectedYear}`;

  // Cetak Dokumen Rekapitulasi (A4 Clean Print)
  const handlePrint = () => {
    window.print();
  };

  // Unduh Berkas CSV Excel Nyata
  const handleExportCsv = () => {
    let rows = [];
    let filename = '';

    if (activeTab === 'masuk') {
      filename = `Rekap_Surat_Masuk_${selectedKodeSurat}_${monthLabel}_${selectedYear}.csv`;
      rows.push([
        'No',
        'Kode Klasifikasi',
        'Jenis Naskah',
        'No Agenda',
        'Nomor Surat Asal',
        'Instansi Pengirim',
        'Tanggal Naskah',
        'Tanggal Diterima',
        'Perihal Naskah',
        'Sifat',
        'Status Disposisi',
        'Diteruskan Kepada',
      ]);

      filteredSuratMasuk.forEach((s, idx) => {
        const disp = disposisiList[s.id];
        const penerima = disp?.diteruskanKepada?.join('; ') || '-';
        rows.push([
          idx + 1,
          getKodeSurat(s),
          s.jenisSurat || 'Surat Dinas',
          s.agenda || '-',
          s.nomorSurat,
          s.asalSurat,
          s.tanggalSurat,
          s.tanggalTerima ? s.tanggalTerima.replace('T', ' ') : '-',
          s.perihal,
          s.sifat,
          s.status,
          penerima,
        ]);
      });
    } else if (activeTab === 'keluar') {
      filename = `Rekap_Surat_Keluar_${selectedKodeSurat}_${monthLabel}_${selectedYear}.csv`;
      rows.push([
        'No',
        'Kode Klasifikasi',
        'No Agenda Surat Keluar',
        'Nomor Surat Resmi',
        'Tujuan Surat',
        'Tanggal Surat',
        'Perihal',
        'Sifat',
        'Unit Pengusul',
        'Disetujui Oleh',
        'Status',
      ]);

      filteredSuratKeluar.forEach((s, idx) => {
        rows.push([
          idx + 1,
          getKodeSurat(s),
          s.agenda || (s.nomorUrut ? String(s.nomorUrut).padStart(4, '0') + '/SK/X/2026' : '-'),
          s.nomorSurat,
          s.tujuanSurat,
          s.tanggalSurat,
          s.perihal,
          s.sifat,
          s.unitPengusul || '-',
          s.disetujuiOleh || '-',
          s.status,
        ]);
      });
    } else if (activeTab === 'kode_matriks') {
      filename = `Rekap_Distribusi_Kode_Surat_${monthLabel}_${selectedYear}.csv`;
      rows.push([
        'No',
        'Kode Surat',
        'Klasifikasi Urusan',
        'Surat Masuk',
        'Surat Keluar',
        'Total Naskah',
      ]);

      kodeMatrixData.forEach((item, idx) => {
        rows.push([
          idx + 1,
          item.kode,
          item.nama,
          item.countMasuk,
          item.countKeluar,
          item.total,
        ]);
      });
    } else {
      filename = `Rekap_Persuratan_Gabungan_${monthLabel}_${selectedYear}.csv`;
      rows.push([
        'No',
        'Jenis Naskah',
        'Kode Surat',
        'No Agenda/Urut',
        'Nomor Surat',
        'Pihak / Instansi',
        'Tanggal',
        'Perihal',
        'Sifat',
        'Status',
      ]);

      combinedReports.forEach((c, idx) => {
        rows.push([
          idx + 1,
          c.tipe,
          c.kodeSurat,
          c.agenda,
          c.nomorSurat,
          c.pihak,
          c.tanggal,
          c.perihal,
          c.sifat,
          c.status,
        ]);
      });
    }

    // Bangun string CSV dengan UTF-8 BOM
    const processRow = (row) =>
      row
        .map((val) => {
          let v = val === null || val === undefined ? '' : String(val);
          v = v.replace(/"/g, '""');
          if (v.search(/("|,|\n)/g) >= 0) {
            v = `"${v}"`;
          }
          return v;
        })
        .join(',');

    const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Rekapitulasi ${filename} berhasil diunduh.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header & Aksi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Laporan & Rekapitulasi</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Buku Agenda Bulanan & Kode Surat</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Rekapitulasi Persuratan Bulanan & Kode Surat
          </h2>
          <p className="text-xs md:text-sm text-outline">
            Filter naskah dinas masuk & keluar per bulan, per kode surat klasifikasi perkara, ekspor Excel (CSV), dan cetak buku agenda resmi A4.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-on-surface hover:bg-surface text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-[0.98] transition-all"
            title="Unduh data tabel dalam format CSV Excel"
          >
            <span className="material-symbols-outlined text-[18px] text-success">file_download</span>
            <span>Ekspor Excel (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs active:scale-[0.98] transition-all"
            title="Cetak format buku agenda kearsipan A4"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Buku Agenda</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher: Rekap Surat Masuk, Surat Keluar, Matriks Kode Surat, dan Gabungan */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-subtle pb-3 no-print">
        <button
          onClick={() => setActiveTab('masuk')}
          className={`h-10 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'masuk'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-on-surface border border-outline-subtle hover:bg-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inbox</span>
          <span>Rekap Surat Masuk</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'masuk' ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
            }`}
          >
            {filteredSuratMasuk.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('keluar')}
          className={`h-10 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'keluar'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-on-surface border border-outline-subtle hover:bg-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">outbox</span>
          <span>Rekap Surat Keluar</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'keluar' ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
            }`}
          >
            {filteredSuratKeluar.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kode_matriks')}
          className={`h-10 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'kode_matriks'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-on-surface border border-outline-subtle hover:bg-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">pin</span>
          <span>Distribusi Per Kode Surat</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'kode_matriks' ? 'bg-white/20 text-white' : 'bg-surface text-outline'
            }`}
          >
            {classificationList.length} Kode
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gabungan')}
          className={`h-10 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
            activeTab === 'gabungan'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-on-surface border border-outline-subtle hover:bg-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
          <span>Semua Naskah (Gabungan)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'gabungan' ? 'bg-white/20 text-white' : 'bg-surface text-outline'
            }`}
          >
            {combinedReports.length}
          </span>
        </button>
      </div>

      {/* FILTER BAR UTAMA: BULAN, TAHUN, DAN KODE SURAT */}
      <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Sisi Kiri: 3 Dropdown Utama (Bulan, Tahun, Kode Surat) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Pemilih Bulan */}
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-outline-subtle">
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                Bulan:
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  showToast(
                    `Periode bulan diubah: ${MONTHS.find((m) => m.value === e.target.value)?.label}`
                  );
                }}
                className="bg-transparent text-on-surface font-bold text-xs outline-none cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Pemilih Tahun */}
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-outline-subtle">
              <span className="text-xs font-bold text-primary">Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  showToast(`Tahun persuratan: ${e.target.value}`);
                }}
                className="bg-transparent text-on-surface font-bold text-xs outline-none cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Pemilih Kode Surat (Klasifikasi Perkara / Urusan) */}
            <div className="flex items-center gap-2 bg-primary-light/70 px-3 py-1.5 rounded-lg border border-primary/30">
              <span className="text-xs font-extrabold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">pin</span>
                Kode Surat:
              </span>
              <select
                value={selectedKodeSurat}
                onChange={(e) => {
                  setSelectedKodeSurat(e.target.value);
                  showToast(
                    e.target.value === 'all'
                      ? 'Menampilkan seluruh kode surat'
                      : `Filter kode surat: ${e.target.value}`
                  );
                }}
                className="bg-transparent text-primary font-extrabold text-xs outline-none cursor-pointer"
              >
                <option value="all">Semua Kode Surat</option>
                {classificationList.map((c) => (
                  <option key={c.kode} value={c.kode}>
                    {c.kode} — {c.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Filter Sifat Surat */}
            <div className="flex items-center gap-2 bg-surface px-2.5 py-1.5 rounded-lg border border-outline-subtle">
              <span className="text-xs font-semibold text-outline">Sifat:</span>
              <select
                value={filterSifat}
                onChange={(e) => setFilterSifat(e.target.value)}
                className="bg-transparent text-on-surface text-xs font-medium outline-none cursor-pointer"
              >
                <option value="semua">Semua Sifat</option>
                <option value="sangat_segera">Sangat Segera</option>
                <option value="segera">Segera</option>
                <option value="biasa">Biasa</option>
                <option value="rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          {/* Sisi Kanan: Pintasan Cepat Waktu */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-outline font-semibold mr-1">Pintasan:</span>
            <button
              onClick={() => {
                setSelectedMonth('10');
                setSelectedYear('2026');
                setSelectedKodeSurat('all');
                setFilterSifat('semua');
                setSearchKeyword('');
                showToast('Periode diatur: Oktober 2026 (Semua Kode)');
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-surface hover:bg-surface-low border border-outline-subtle font-semibold text-primary transition-colors"
            >
              Oktober 2026
            </button>
            <button
              onClick={() => {
                setSelectedMonth('all');
                setSelectedYear('2026');
                showToast('Periode diatur: Sepanjang Tahun 2026');
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-surface hover:bg-surface-low border border-outline-subtle font-semibold text-on-surface transition-colors"
            >
              Setahun 2026
            </button>
          </div>
        </div>

        {/* Baris Pintasan Cepat Kode Surat (Quick Filter Badges) */}
        <div className="pt-3 border-t border-outline-subtle/60 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-outline font-semibold mr-1 text-[11px]">Pilih Cepat Kode:</span>
          <button
            onClick={() => setSelectedKodeSurat('all')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
              selectedKodeSurat === 'all'
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-surface text-on-surface hover:bg-surface-low border border-outline-subtle'
            }`}
          >
            Semua Kode
          </button>
          {classificationList.map((c) => {
            const isSelected = selectedKodeSurat === c.kode;
            return (
              <button
                key={c.kode}
                onClick={() => setSelectedKodeSurat(c.kode)}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface text-on-surface hover:bg-surface-low border border-outline-subtle'
                }`}
                title={c.nama}
              >
                <span>{c.kode}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                  }`}
                >
                  {c.nama.split('/')[0].slice(0, 14)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pencarian Kata Kunci */}
        <div className="pt-2 border-t border-outline-subtle/60 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-outline">search</span>
          <input
            type="text"
            placeholder="Cari nomor naskah, perihal, instansi pengirim / tujuan dalam rekapitulasi ini..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full text-xs bg-transparent text-on-surface placeholder:text-outline outline-none"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="text-xs text-outline hover:text-on-surface font-semibold"
            >
              Hapus Filter Pencarian
            </button>
          )}
        </div>
      </div>

      {/* 4 Kartu Metrik Rekapitulasi Sesuai Pilihan Bulan & Kode Surat */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs no-print">
        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1 flex items-center justify-between">
            <span>Surat Masuk Terpilih</span>
            <span className="material-symbols-outlined text-[16px] text-primary">inbox</span>
          </div>
          <div className="text-2xl font-extrabold text-primary">
            {filteredSuratMasuk.length}{' '}
            <span className="text-xs font-semibold text-outline">Naskah</span>
          </div>
          <div className="text-success text-[11px] font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Buku Agenda Penerimaan</span>
          </div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1 flex items-center justify-between">
            <span>Surat Keluar Terpilih</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface">outbox</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface">
            {filteredSuratKeluar.length}{' '}
            <span className="text-xs font-semibold text-outline">Naskah</span>
          </div>
          <div className="text-outline text-[11px] font-medium mt-1">
            Validasi Penomoran Otomatis
          </div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1 flex items-center justify-between">
            <span>Filter Kode Aktif</span>
            <span className="material-symbols-outlined text-[16px] text-primary">pin</span>
          </div>
          <div className="text-xl font-extrabold text-primary font-code truncate">
            {selectedKodeSurat === 'all' ? 'SEMUA KODE' : selectedKodeSurat}
          </div>
          <div className="text-outline text-[11px] font-medium mt-1 truncate">
            {selectedKodeSurat === 'all'
              ? 'Seluruh Urusan Naskah Dinas'
              : classificationList.find((c) => c.kode === selectedKodeSurat)?.nama || ''}
          </div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1 flex items-center justify-between">
            <span>Tingkat Disposisi</span>
            <span className="material-symbols-outlined text-[16px] text-success">task_alt</span>
          </div>
          <div className="text-2xl font-extrabold text-success">
            {filteredSuratMasuk.length > 0
              ? `${Math.round(
                  (filteredSuratMasuk.filter((s) => s.status === 'Didisposisi').length /
                    filteredSuratMasuk.length) *
                    100
                )}%`
              : '100%'}
          </div>
          <div className="text-success text-[11px] font-semibold mt-1">
            Tindak Lanjut Tuntas
          </div>
        </div>
      </div>

      {/* Tabel Rekapitulasi (Siap Cetak PDF Standar Mahkamah Agung) */}
      <div className="print-clean bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        {/* Kop Cetak PDF Resmi Pengadilan Agama Lumajang */}
        <div className="p-6 border-b border-outline-subtle text-center">
          <KopSurat />
          <h5 className="text-sm font-bold uppercase text-primary tracking-wider">
            {activeTab === 'masuk'
              ? 'BUKU AGENDA REKAPITULASI SURAT MASUK'
              : activeTab === 'keluar'
              ? 'BUKU AGENDA REKAPITULASI SURAT KELUAR'
              : activeTab === 'kode_matriks'
              ? 'REKAPITULASI DISTRIBUSI PER KODE KLASIFIKASI SURAT'
              : 'REKAPITULASI GABUNGAN PERSURATAN KEDINASAN'}
          </h5>
          <p className="text-xs text-outline mt-0.5">
            Periode: <strong className="text-on-surface">{periodeLabel}</strong>
            {' • '}Kode Naskah: <strong className="text-primary font-bold">{kodeLabel}</strong>
            {filterSifat !== 'semua' && (
              <span>
                {' '}
                • Sifat: <strong className="text-primary uppercase">{filterSifat}</strong>
              </span>
            )}
          </p>
        </div>

        {/* 1. TAMPILAN TABEL: REKAP SURAT MASUK */}
        {activeTab === 'masuk' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 text-center">Kode</th>
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Nomor Naskah</th>
                  <th className="py-3 px-4">Instansi Pengirim</th>
                  <th className="py-3 px-4">Tanggal Naskah</th>
                  <th className="py-3 px-4">Tgl Terima</th>
                  <th className="py-3 px-4 min-w-[200px]">Perihal & Arahan</th>
                  <th className="py-3 px-3 text-center">Sifat</th>
                  <th className="py-3 px-4">Status & Disposisi</th>
                  <th className="py-3 px-3 text-center no-print">Warkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle text-on-surface">
                {filteredSuratMasuk.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined text-[36px] block text-outline/50 mb-1">
                        inbox
                      </span>
                      Tidak ada data Surat Masuk pada periode {periodeLabel} untuk kode {selectedKodeSurat}.
                    </td>
                  </tr>
                ) : (
                  filteredSuratMasuk.map((s, index) => {
                    const disp = disposisiList[s.id];
                    const kode = getKodeSurat(s);
                    return (
                      <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-3 text-center text-outline font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-code text-xs px-2 py-0.5 bg-primary-light text-primary rounded font-bold">
                            {kode}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-code text-xs font-bold text-primary whitespace-nowrap">
                          {s.agenda || '-'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-code font-bold text-on-surface">{s.nomorSurat}</div>
                          <div className="text-[10px] font-sans font-semibold text-primary">
                            {s.jenisSurat || 'Surat Dinas'}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                          {s.asalSurat}
                        </td>
                        <td className="py-3 px-4 text-outline whitespace-nowrap">
                          {s.tanggalSurat}
                        </td>
                        <td className="py-3 px-4 text-outline whitespace-nowrap">
                          {s.tanggalTerima?.slice(0, 10) || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-on-surface line-clamp-2" title={s.perihal}>
                            {s.perihal}
                          </div>
                          {disp?.isiArahan && (
                            <div className="text-[11px] text-primary italic mt-0.5 line-clamp-1">
                              Arahan: {disp.isiArahan}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              s.sifat === 'sangat_segera'
                                ? 'bg-danger-light text-danger border border-danger/30'
                                : s.sifat === 'segera'
                                ? 'bg-warning-light text-amber-900 border border-warning/40'
                                : 'bg-surface text-outline'
                            }`}
                          >
                            {s.sifat}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-xs text-on-surface">
                            {s.status}
                          </div>
                          {disp?.diteruskanKepada && disp.diteruskanKepada.length > 0 && (
                            <div className="text-[10.5px] text-outline">
                              Kepada: {disp.diteruskanKepada.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center no-print whitespace-nowrap">
                          <button
                            onClick={() => openWarkatPreview(s)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors"
                            title="Buka pindaian warkat di tab baru"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              picture_as_pdf
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. TAMPILAN TABEL: REKAP SURAT KELUAR */}
        {activeTab === 'keluar' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 text-center">Kode</th>
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Nomor Naskah Keluar</th>
                  <th className="py-3 px-4">Tujuan Surat</th>
                  <th className="py-3 px-4">Tanggal Naskah</th>
                  <th className="py-3 px-4 min-w-[200px]">Perihal</th>
                  <th className="py-3 px-4">Unit Pengusul</th>
                  <th className="py-3 px-4">Status & Pengesahan</th>
                  <th className="py-3 px-3 text-center no-print">Naskah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle text-on-surface">
                {filteredSuratKeluar.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined text-[36px] block text-outline/50 mb-1">
                        outbox
                      </span>
                      Tidak ada data Surat Keluar pada periode {periodeLabel} untuk kode {selectedKodeSurat}.
                    </td>
                  </tr>
                ) : (
                  filteredSuratKeluar.map((s, index) => {
                    const kode = getKodeSurat(s);
                    return (
                      <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-3 text-center text-outline font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-code text-xs px-2 py-0.5 bg-primary-light text-primary rounded font-bold">
                            {kode}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-code text-xs font-bold text-primary whitespace-nowrap">
                          {s.agenda || (s.nomorUrut ? String(s.nomorUrut).padStart(4, '0') + '/SK/X/2026' : '-')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-code font-bold text-on-surface">{s.nomorSurat}</div>
                          <div className="text-[10px] font-sans font-semibold text-primary">
                            {s.jenisSurat || 'Surat Dinas'}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                          {s.tujuanSurat}
                        </td>
                        <td className="py-3 px-4 text-outline whitespace-nowrap">
                          {s.tanggalSurat}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-on-surface line-clamp-2" title={s.perihal}>
                            {s.perihal}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-outline whitespace-nowrap">
                          <div className="font-medium text-on-surface">{s.unitPengusul || '-'}</div>
                          <div className="text-[10px]">{s.pembuat || ''}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status.includes('Disetujui')
                                ? 'bg-success-light text-success border border-success/30'
                                : 'bg-warning-light text-amber-900 border border-warning/40'
                            }`}
                          >
                            {s.status}
                          </span>
                          {s.disetujuiOleh && (
                            <div className="text-[10px] text-outline mt-0.5">
                              Oleh: {s.disetujuiOleh}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center no-print whitespace-nowrap">
                          <button
                            onClick={() => openWarkatPreview(s)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors"
                            title="Buka naskah surat di tab baru"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              picture_as_pdf
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. TAMPILAN TABEL: MATRIKS DISTRIBUSI PER KODE SURAT */}
        {activeTab === 'kode_matriks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-4">Kode Surat</th>
                  <th className="py-3 px-4">Urusan / Klasifikasi Naskah Dinas</th>
                  <th className="py-3 px-4 text-center">Surat Masuk</th>
                  <th className="py-3 px-4 text-center">Surat Keluar</th>
                  <th className="py-3 px-4 text-center">Total Naskah</th>
                  <th className="py-3 px-4 text-center no-print">Aksi Filter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle text-on-surface">
                {kodeMatrixData.map((item, index) => (
                  <tr key={item.kode} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-3 text-center text-outline font-semibold">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-code text-sm font-bold text-primary whitespace-nowrap">
                      {item.kode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface">
                      {item.nama}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-primary">
                      {item.countMasuk}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-on-surface">
                      {item.countKeluar}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-sm text-primary">
                      {item.total}
                    </td>
                    <td className="py-3 px-4 text-center no-print whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedKodeSurat(item.kode);
                          setActiveTab('masuk');
                          showToast(`Menampilkan Rekap Surat Masuk kode ${item.kode}`);
                        }}
                        className="px-2.5 py-1 rounded bg-primary-light hover:bg-primary/20 text-primary font-bold text-xs mr-1 transition-colors"
                      >
                        Lihat Masuk
                      </button>
                      <button
                        onClick={() => {
                          setSelectedKodeSurat(item.kode);
                          setActiveTab('keluar');
                          showToast(`Menampilkan Rekap Surat Keluar kode ${item.kode}`);
                        }}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-low border border-outline-subtle text-on-surface font-bold text-xs transition-colors"
                      >
                        Lihat Keluar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. TAMPILAN TABEL: GABUNGAN PERSURATAN */}
        {activeTab === 'gabungan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3">Jenis</th>
                  <th className="py-3 px-3 text-center">Kode</th>
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Nomor Naskah</th>
                  <th className="py-3 px-4">Pihak / Instansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 min-w-[200px]">Perihal</th>
                  <th className="py-3 px-3 text-center">Sifat</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle text-on-surface">
                {combinedReports.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-outline">
                      Tidak ada naskah dinas pada periode {periodeLabel} untuk kode {selectedKodeSurat}.
                    </td>
                  </tr>
                ) : (
                  combinedReports.map((item, index) => (
                    <tr key={index} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3 px-3 text-center text-outline font-semibold">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.tipe === 'Surat Masuk'
                              ? 'bg-primary-light text-primary'
                              : 'bg-success-light text-success border border-success/30'
                          }`}
                        >
                          {item.tipe}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="font-code text-xs px-2 py-0.5 bg-surface text-on-surface rounded font-bold">
                          {item.kodeSurat}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-code text-xs font-bold text-primary whitespace-nowrap">
                        {item.agenda}
                      </td>
                      <td className="py-3 px-4 font-code font-bold text-on-surface whitespace-nowrap">
                        {item.nomorSurat}
                      </td>
                      <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap">
                        {item.pihak}
                      </td>
                      <td className="py-3 px-4 text-outline whitespace-nowrap">{item.tanggal}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={item.perihal}>
                        {item.perihal}
                      </td>
                      <td className="py-3 px-3 text-center uppercase text-[10px] font-bold whitespace-nowrap">
                        {item.sifat}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-xs whitespace-nowrap">
                        {item.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tanda Tangan Pengesahan Buku Agenda Standar Mahkamah Agung */}
        <div className="p-6 border-t border-outline-subtle flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div className="text-outline text-[11px] space-y-1">
            <div>
              Dicetak melalui aplikasi resmi: <strong>KlikSurat (Sistem Persuratan & Disposisi Peradilan)</strong>
            </div>
            <div>
              Basis Data: <strong>Supabase Cloud PostgreSQL</strong> (Sinkronisasi Realtime Terverifikasi)
            </div>
            <div>
              Waktu Unduh / Cetak:{' '}
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              WIB
            </div>
          </div>

          <div className="text-center w-64 shrink-0">
            <p className="font-semibold text-on-surface">Mengetahui & Mengesahkan,</p>
            <p className="font-bold text-on-surface">
              {plhConfig?.isActive
                ? plhConfig.tipePelimpahan === 'hakim_ditunjuk'
                  ? 'Plh. Ketua (Hakim yang Ditunjuk)'
                  : 'Plh. Ketua (Wakil Ketua)'
                : 'Sekretaris Pengadilan Agama Lumajang'}
            </p>
            <div className="h-14 flex items-center justify-center text-primary text-[10px] font-semibold italic">
              [Tanda Tangan Elektronik Sah Mahkamah Agung]
            </div>
            <p className="font-bold underline text-on-surface">
              {plhConfig?.isActive
                ? plhConfig.pejabatPlh.name
                : 'H. M. Ridwan, S.H.'}
            </p>
            <p className="text-[10px] text-outline">
              NIP. {plhConfig?.isActive ? plhConfig.pejabatPlh.nip : '19750824 200212 1 001'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
