import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';
import {
  JENIS_SURAT_OPTIONS,
  STATUS_SURAT_MASUK_OPTIONS,
  getStatusBadge,
  formatAgendaSuratMasuk,
} from '../constants/suratOptions';

export default function SuratMasuk() {
  const { suratMasuk, addSuratMasuk, updateSuratMasukStatus, navigateTo, showToast } = useSurat();

  const [form, setForm] = useState({
    jenisSurat: 'Surat Dinas',
    jenisSuratLainnya: '',
    status: 'Diregistrasi',
    nomorSurat: '',
    asalSurat: '',
    perihal: '',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    tanggalTerima: new Date().toISOString().slice(0, 16),
    lampiran: '1 Berkas (12 Lembar PDF)',
    sifat: 'segera',
    fileScan: 'Scan_Dokumen_Resmi.pdf'
  });

  const [searchFilter, setSearchFilter] = useState('');
  const [filterJenis, setFilterJenis] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nomorSurat || !form.asalSurat || !form.perihal) {
      showToast('Harap lengkapi semua kolom bertanda bintang (*)', 'warning');
      return;
    }

    if (form.jenisSurat === 'Lainnya' && !form.jenisSuratLainnya.trim()) {
      showToast('Harap sebutkan nama jenis surat untuk pilihan Lainnya (*)', 'warning');
      return;
    }

    const finalJenisSurat = form.jenisSurat === 'Lainnya' && form.jenisSuratLainnya.trim()
      ? form.jenisSuratLainnya.trim()
      : form.jenisSurat;

    addSuratMasuk({
      ...form,
      jenisSurat: finalJenisSurat,
      status: form.status || 'Diregistrasi'
    });

    setForm({
      jenisSurat: 'Surat Dinas',
      jenisSuratLainnya: '',
      status: 'Diregistrasi',
      nomorSurat: '',
      asalSurat: '',
      perihal: '',
      tanggalSurat: new Date().toISOString().slice(0, 10),
      tanggalTerima: new Date().toISOString().slice(0, 16),
      lampiran: '1 Berkas PDF',
      sifat: 'biasa',
      fileScan: 'Scan_Dokumen_Resmi.pdf'
    });
  };

  const filteredSurat = suratMasuk.filter(s => {
    const q = searchFilter.toLowerCase();
    const matchSearch =
      s.nomorSurat.toLowerCase().includes(q) ||
      s.asalSurat.toLowerCase().includes(q) ||
      s.perihal.toLowerCase().includes(q) ||
      (s.jenisSurat && s.jenisSurat.toLowerCase().includes(q)) ||
      (s.status && s.status.toLowerCase().includes(q));

    const matchJenis = filterJenis === 'semua' || (s.jenisSurat || 'Surat Dinas') === filterJenis;
    const matchStatus = filterStatus === 'semua' || s.status === filterStatus;
    return matchSearch && matchJenis && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Surat Masuk</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Registrasi Baru</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Registrasi Surat Masuk</h2>
          <p className="text-xs md:text-sm text-outline">
            Pencatatan agenda penerimaan dan digitalisasi warkat arsip surat masuk peradilan resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('laporan')}
            className="h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-primary hover:bg-surface text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Buka buku agenda rekapitulasi surat masuk per bulan dan per kode surat"
          >
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            <span>Rekap Bulanan & Kode</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showForm ? 'expand_less' : 'add'}
            </span>
            <span>{showForm ? 'Sembunyikan Formulir' : '+ Tambah Surat Masuk'}</span>
          </button>
        </div>
      </div>

      {/* Formulir Registrasi Surat Masuk */}
      {showForm && (
        <div className="bg-white rounded-card border border-outline-subtle shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-4 border-b border-outline-subtle flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-[20px]">drafts</span>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">
                  Formulir Pencatatan Surat Masuk Baru
                </h3>
                <p className="text-xs text-outline">
                  Isi kelengkapan metadata warkat fisik atau naskah dinas elektronik resmi
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Mode Registrasi Aktif
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Grid 2 Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Jenis Surat (Sesuai Lampiran 2 & 3) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Jenis Surat <span className="text-danger">*</span></span>
                  <span className="text-[11px] font-normal text-outline">Tata Naskah Dinas MA-RI</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.jenisSurat}
                    onChange={(e) => setForm({ ...form, jenisSurat: e.target.value })}
                    className="w-full h-10 pl-9 pr-8 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {JENIS_SURAT_OPTIONS.map((opsi) => (
                      <option key={opsi} value={opsi}>
                        {opsi}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-primary pointer-events-none">
                    article
                  </span>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                {form.jenisSurat === 'Lainnya' && (
                  <div className="pt-1 animate-in fade-in">
                    <input
                      type="text"
                      required
                      value={form.jenisSuratLainnya}
                      onChange={(e) => setForm({ ...form, jenisSuratLainnya: e.target.value })}
                      placeholder="Sebutkan jenis surat (misal: Surat Kuasa, Maklumat)..."
                      className="w-full h-9 px-3 rounded-btn bg-surface border border-primary/40 text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                )}
                <p className="text-[11px] text-outline">Pilih kategori tata naskah dinas resmi sesuai fisik surat.</p>
              </div>

              {/* Nomor Surat Asal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Nomor Surat Asal <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.nomorSurat}
                    onChange={(e) => setForm({ ...form, nomorSurat: e.target.value })}
                    placeholder="Contoh: 048/UM.01/X/2026 atau nomor naskah pengirim"
                    className="w-full h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline">
                    tag
                  </span>
                </div>
                <p className="text-[11px] text-outline">Sesuaikan persis dengan nomor pada stempel atau tajuk warkat pengirim.</p>
              </div>

              {/* Asal Surat */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Asal Surat (Instansi / Lembaga) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.asalSurat}
                    onChange={(e) => setForm({ ...form, asalSurat: e.target.value })}
                    placeholder="Contoh: Pengadilan Tinggi Agama Surabaya / MARI"
                    className="w-full h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline">
                    account_balance
                  </span>
                </div>
              </div>

              {/* Tanggal Surat */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Tanggal Surat <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.tanggalSurat}
                  onChange={(e) => setForm({ ...form, tanggalSurat: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Tanggal & Waktu Diterima */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Tanggal & Waktu Diterima di Loket <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.tanggalTerima}
                  onChange={(e) => setForm({ ...form, tanggalTerima: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Jumlah Lampiran */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Jumlah Lampiran Berkas
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.lampiran}
                    onChange={(e) => setForm({ ...form, lampiran: e.target.value })}
                    placeholder="Contoh: 1 Berkas (3 Eksemplar)"
                    className="w-full h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline">
                    attach_file
                  </span>
                </div>
              </div>

              {/* Perihal Surat (Full span) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant">
                  Perihal / Urusan Naskah Dinas <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={form.perihal}
                  onChange={(e) => setForm({ ...form, perihal: e.target.value })}
                  placeholder="Tuliskan ringkasan pokok perihal naskah dinas masuk..."
                  className="w-full p-3 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all leading-relaxed"
                ></textarea>
              </div>

              {/* Nomor Agenda Otomatis */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Nomor Agenda Sistem (Otomatis)</span>
                  <span className="text-[11px] font-normal text-primary">0001/SM/XI/2026</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formatAgendaSuratMasuk(
                      suratMasuk.length + 1,
                      form.tanggalSurat || form.tanggalTerima || new Date()
                    )}
                    className="w-full h-10 px-3.5 rounded-btn bg-surface border border-outline-subtle text-xs font-code font-bold text-primary cursor-not-allowed"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline">
                    lock
                  </span>
                </div>
                <p className="text-[11px] text-outline">Rumus: Nomor Urut / Surat Masuk / Bulan / Tahun</p>
              </div>

              {/* Status Surat Masuk (Sesuai Lampiran) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Status Surat <span className="text-danger">*</span></span>
                  <span className="text-[11px] font-normal text-outline">Alur Tata Naskah</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 pl-9 pr-8 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {STATUS_SURAT_MASUK_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-primary pointer-events-none">
                    flag
                  </span>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                <p className="text-[11px] text-outline">Pilih tahapan status awal surat masuk saat registrasi warkat.</p>
              </div>
            </div>

            {/* Tingkat Kerahasiaan & Prioritas Radio Buttons */}
            <div className="space-y-2 pt-2 border-t border-outline-subtle">
              <label className="block text-xs font-bold text-on-surface-variant">
                Sifat / Tingkat Kerahasiaan Surat <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Biasa */}
                <label
                  className={`p-3 rounded-btn border cursor-pointer flex items-center justify-between transition-all ${
                    form.sifat === 'biasa'
                      ? 'border-primary bg-primary-light text-primary font-bold shadow-2xs'
                      : 'border-outline-subtle bg-white hover:bg-surface text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sifat"
                      value="biasa"
                      checked={form.sifat === 'biasa'}
                      onChange={() => setForm({ ...form, sifat: 'biasa' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Biasa</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Normal</span>
                </label>

                {/* Segera */}
                <label
                  className={`p-3 rounded-btn border cursor-pointer flex items-center justify-between transition-all ${
                    form.sifat === 'segera'
                      ? 'border-warning bg-warning-light text-amber-900 font-bold shadow-2xs'
                      : 'border-outline-subtle bg-white hover:bg-surface text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sifat"
                      value="segera"
                      checked={form.sifat === 'segera'}
                      onChange={() => setForm({ ...form, sifat: 'segera' })}
                      className="text-warning-dark focus:ring-warning"
                    />
                    <span>Segera</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning text-amber-950 font-bold">24 Jam</span>
                </label>

                {/* Sangat Segera */}
                <label
                  className={`p-3 rounded-btn border cursor-pointer flex items-center justify-between transition-all ${
                    form.sifat === 'sangat_segera'
                      ? 'border-danger bg-danger-light text-danger font-bold shadow-2xs'
                      : 'border-outline-subtle bg-white hover:bg-surface text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sifat"
                      value="sangat_segera"
                      checked={form.sifat === 'sangat_segera'}
                      onChange={() => setForm({ ...form, sifat: 'sangat_segera' })}
                      className="text-danger focus:ring-danger"
                    />
                    <span>Sangat Segera</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-danger text-white">Prioritas</span>
                </label>

                {/* Rahasia */}
                <label
                  className={`p-3 rounded-btn border cursor-pointer flex items-center justify-between transition-all ${
                    form.sifat === 'rahasia'
                      ? 'border-primary bg-primary-light text-primary font-bold shadow-2xs'
                      : 'border-outline-subtle bg-white hover:bg-surface text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sifat"
                      value="rahasia"
                      checked={form.sifat === 'rahasia'}
                      onChange={() => setForm({ ...form, sifat: 'rahasia' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Rahasia</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </label>
              </div>
            </div>

            {/* Unggah Dokumen Scan PDF */}
            <div className="space-y-2 pt-2 border-t border-outline-subtle">
              <label className="block text-xs font-bold text-on-surface-variant">
                Warkat Digital / Berkas Pindaian (Scan Dokumen PDF) <span className="text-danger">*</span>
              </label>
              <div className="border-2 border-dashed border-primary/40 rounded-card p-6 text-center bg-surface hover:bg-primary-light/20 transition-colors cursor-pointer group">
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">Tarik berkas PDF atau klik untuk unggah</p>
                  <p className="text-xs text-outline mt-0.5">Format dokumen PDF standar ISO/PDF-A (Maksimal ukuran file 15 MB)</p>
                </div>
              </div>

              {/* Preview File Chip */}
              <div className="p-3 bg-white border border-outline-subtle rounded-btn flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-danger-light text-danger flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">{form.fileScan}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary-light text-primary">
                        Terenkripsi SHA-256
                      </span>
                    </div>
                    <span className="text-[11px] text-outline">2.4 MB • Diperiksa Bebas Virus</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => showToast('Pratinjau dokumen PDF terbuka.', 'info')}
                    className="w-8 h-8 rounded-lg text-outline hover:text-primary hover:bg-surface flex items-center justify-center transition-colors"
                    title="Pratinjau PDF"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-outline-subtle flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 px-5 rounded-btn border border-outline-subtle text-on-surface-variant font-semibold text-xs md:text-sm hover:bg-surface transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-btn bg-success hover:bg-success-dark text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Simpan Surat Masuk</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel: Daftar Surat Masuk Terkini */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        {/* Header Tabel & Search Filter */}
        <div className="p-5 border-b border-outline-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">Daftar Buku Register Surat Masuk</h3>
            <p className="text-xs text-outline">Buku agenda kendali persuratan masuk pada kepaniteraan peradilan resmi</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-56 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter nomor, perihal, asal..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-outline-subtle text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {/* Filter Dropdown Jenis Surat */}
            <div className="relative">
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
              >
                <option value="semua">Semua Jenis Surat</option>
                {JENIS_SURAT_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Filter Dropdown Status Surat (8 Pilihan Sesuai Pedoman) */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
              >
                <option value="semua">Semua Status Surat</option>
                {STATUS_SURAT_MASUK_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>
            <button
              onClick={() => showToast('Filter tanggal aktif.', 'info')}
              className="h-9 px-3 rounded-md border border-outline-subtle text-on-surface-variant text-xs font-semibold flex items-center gap-1.5 hover:bg-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filter Tanggal</span>
            </button>
            <button
              onClick={() => showToast('Ekspor Rekapitulasi berhasil diunduh.', 'success')}
              className="h-9 px-3 rounded-md border border-primary/40 text-primary text-xs font-bold flex items-center gap-1.5 hover:bg-primary-light transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Ekspor Rekap</span>
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nomor & Agenda</th>
                <th className="py-3 px-4">Jenis Surat</th>
                <th className="py-3 px-4">Asal Surat</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Tanggal Diterima</th>
                <th className="py-3 px-4">Sifat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredSurat.map((item) => {
                const isMenunggu = item.status === 'Menunggu Disposisi';
                return (
                  <tr key={item.id} className="hover:bg-surface/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface font-code text-xs">{item.nomorSurat}</div>
                      <div className="text-[11px] text-outline font-code">{item.agenda}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-light text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[15px]">article</span>
                        <span>{item.jenisSurat || 'Surat Dinas'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-on-surface">{item.asalSurat}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate font-medium text-on-surface" title={item.perihal}>
                        {item.perihal}
                      </p>
                      <span className="text-[11px] text-outline">{item.lampiran}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant font-medium">
                      {item.tanggalTerima ? item.tanggalTerima.replace('T', ' ') : item.tanggalSurat}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          item.sifat === 'sangat_segera'
                            ? 'bg-danger text-white'
                            : item.sifat === 'segera'
                            ? 'bg-warning-light text-amber-900 border border-warning/40 font-bold'
                            : item.sifat === 'rahasia'
                            ? 'bg-primary-light text-primary border border-primary/30'
                            : 'bg-primary-light text-primary border border-primary/20'
                        }`}
                      >
                        {item.sifat.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {(() => {
                        const badge = getStatusBadge(item.status);
                        const isEditing = editingStatusId === item.id;
                        return (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setEditingStatusId(isEditing ? null : item.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${badge.bg} hover:shadow-2xs cursor-pointer`}
                              title="Klik untuk mengubah status surat masuk"
                            >
                              <span className="material-symbols-outlined text-[15px]">{badge.icon}</span>
                              <span>{item.status || 'Diregistrasi'}</span>
                              <span className="material-symbols-outlined text-[13px] opacity-60">arrow_drop_down</span>
                            </button>

                            {/* Dropdown Menu Cepat Pengubah Status (8 Pilihan) */}
                            {isEditing && (
                              <div className="absolute left-0 mt-1 w-52 bg-white border border-outline-subtle rounded-lg shadow-lg z-30 py-1.5 text-xs animate-in fade-in">
                                <div className="px-3 py-1 font-bold text-outline text-[10px] uppercase tracking-wider border-b border-outline-subtle mb-1 flex items-center justify-between">
                                  <span>Ubah Status Surat:</span>
                                  <span className="material-symbols-outlined text-[14px]">flag</span>
                                </div>
                                {STATUS_SURAT_MASUK_OPTIONS.map((st) => {
                                  const stBadge = getStatusBadge(st);
                                  const isCurrent = item.status === st;
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        updateSuratMasukStatus(item.id, st);
                                        setEditingStatusId(null);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                                        isCurrent
                                          ? 'font-bold text-primary bg-primary-light/60'
                                          : 'text-on-surface hover:bg-surface'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">{stBadge.icon}</span>
                                        <span>{st}</span>
                                      </span>
                                      {isCurrent && (
                                        <span className="material-symbols-outlined text-[15px] text-primary">check</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => navigateTo('pelacakan', item.id)}
                          className="h-8 px-2.5 rounded-md text-xs text-on-surface-variant hover:bg-surface border border-outline-subtle transition-colors font-medium"
                        >
                          Lacak
                        </button>
                        <button
                          onClick={() => navigateTo('disposisi', item.id)}
                          className="h-8 px-2.5 rounded-md text-xs text-primary font-bold hover:bg-primary-light border border-primary/30 transition-colors"
                        >
                          Disposisi
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-white border-t border-outline-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline">
          <div>
            Menampilkan <strong className="text-on-surface">{filteredSurat.length}</strong> dari{' '}
            <strong className="text-on-surface">{suratMasuk.length}</strong> surat masuk terdaftar
          </div>
          <div className="flex items-center gap-1.5">
            <button className="h-8 px-3 rounded-md border border-outline-subtle text-outline disabled:opacity-50" disabled>
              Sebelumnya
            </button>
            <span className="w-8 h-8 rounded-md bg-primary text-white font-bold flex items-center justify-center">
              1
            </span>
            <button className="h-8 px-3 rounded-md border border-outline-subtle text-on-surface hover:bg-surface">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
