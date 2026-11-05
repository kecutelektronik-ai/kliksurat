import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';

export default function Arsip() {
  const { suratMasuk, suratKeluar, showToast } = useSurat();

  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Combine into unified archive items
  const allArchives = [
    ...suratMasuk.map((s) => ({
      id: s.id,
      jenis: 'Surat Masuk',
      nomorSurat: s.nomorSurat,
      agenda: s.agenda,
      perihal: s.perihal,
      pihak: s.asalSurat,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      file: s.fileScan,
      fileSize: s.fileSize || '2.4 MB',
      boksArsip: 'BOKS-2026/SM-01',
      hashSha256: '9F8A7D...2026-ID',
    })),
    ...suratKeluar.map((s) => ({
      id: s.id,
      jenis: 'Surat Keluar',
      nomorSurat: s.nomorSurat,
      agenda: `REG-${s.nomorUrut || 'DRAFT'}`,
      perihal: s.perihal,
      pihak: s.tujuanSurat,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      file: `${s.nomorSurat.replace(/[\/\\:]/g, '_')}.pdf`,
      fileSize: '1.8 MB',
      boksArsip: 'BOKS-2026/SK-02',
      hashSha256: '3E14BC...2026-MARI',
    })),
  ];

  const filteredArchives = allArchives.filter((item) => {
    const matchType =
      activeTab === 'semua' ||
      (activeTab === 'masuk' && item.jenis === 'Surat Masuk') ||
      (activeTab === 'keluar' && item.jenis === 'Surat Keluar') ||
      (activeTab === 'rahasia' && (item.sifat === 'rahasia' || item.sifat === 'sangat_segera'));

    const matchQuery =
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pihak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agenda.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Arsip Surat</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Digital Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Repositori Arsip Warkat Digital</h2>
          <p className="text-xs md:text-sm text-outline">
            Penyimpanan terpusat dokumen naskah dinas, verifikasi integritas hash digital, dan temu kembali warkat perkara.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="2026">Tahun Arsip 2026</option>
            <option value="2025">Tahun Arsip 2025</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-card border border-outline-subtle p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg w-full md:w-auto text-xs">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex-1 md:flex-initial ${
              activeTab === 'semua' ? 'bg-white text-primary shadow-2xs' : 'text-outline hover:text-on-surface'
            }`}
          >
            Semua ({allArchives.length})
          </button>
          <button
            onClick={() => setActiveTab('masuk')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex-1 md:flex-initial ${
              activeTab === 'masuk' ? 'bg-white text-primary shadow-2xs' : 'text-outline hover:text-on-surface'
            }`}
          >
            Surat Masuk ({suratMasuk.length})
          </button>
          <button
            onClick={() => setActiveTab('keluar')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex-1 md:flex-initial ${
              activeTab === 'keluar' ? 'bg-white text-primary shadow-2xs' : 'text-outline hover:text-on-surface'
            }`}
          >
            Surat Keluar ({suratKeluar.length})
          </button>
          <button
            onClick={() => setActiveTab('rahasia')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex-1 md:flex-initial ${
              activeTab === 'rahasia' ? 'bg-white text-danger shadow-2xs' : 'text-outline hover:text-on-surface'
            }`}
          >
            Rahasia / Prioritas
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci arsip, nomor, pihak..."
            className="w-full h-9 pl-9 pr-3 rounded-btn border border-outline-subtle bg-surface text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Grid Arsip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredArchives.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-card bg-white border border-outline-subtle hover:border-primary/40 shadow-2xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    item.jenis === 'Surat Masuk'
                      ? 'bg-primary-light text-primary'
                      : 'bg-success-light text-success border border-success/30'
                  }`}
                >
                  {item.jenis}
                </span>
                <span className="text-outline font-code text-[11px]">{item.agenda}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold font-code text-on-surface">{item.nomorSurat}</h4>
                <p className="text-xs text-on-surface font-semibold line-clamp-2 mt-1 leading-snug">
                  {item.perihal}
                </p>
              </div>

              <div className="text-[11px] text-outline space-y-1 pt-1 border-t border-surface">
                <div>Pihak: <strong className="text-on-surface">{item.pihak}</strong></div>
                <div>Tanggal Naskah: <strong className="text-on-surface">{item.tanggal}</strong></div>
                <div>Lokasi Simpan: <span className="font-code text-primary font-semibold">{item.boksArsip}</span></div>
                <div className="text-[10px] text-gray-500 font-code truncate">
                  SHA-256: {item.hashSha256}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-surface flex items-center justify-between">
              <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-danger">picture_as_pdf</span>
                <span>{item.fileSize}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    showToast(`Membuka pindaian warkat ${item.nomorSurat}...`, 'info');
                    openWarkatPreview({
                      id: item.id,
                      nomorSurat: item.nomorSurat,
                      agenda: item.agenda,
                      asalSurat: item.pihak,
                      perihal: item.perihal,
                      tanggalSurat: item.tanggal,
                      sifat: item.sifat,
                      lampiran: item.lampiran || '1 Berkas',
                      fileScan: item.file,
                      fileSize: item.fileSize,
                      tujuanAwal: 'Ketua Pengadilan Agama Lamongan Kelas I-A'
                    });
                  }}
                  className="h-8 px-2.5 rounded-md bg-surface hover:bg-primary-light text-primary text-xs font-bold flex items-center gap-1 border border-outline-subtle active:scale-[0.98] transition-all"
                  title="Lihat pindaian warkat pada tab baru"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>Lihat</span>
                </button>
                <button
                  onClick={() => showToast(`Mengunduh warkat ${item.file}...`, 'success')}
                  className="h-8 px-2.5 rounded-md bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
