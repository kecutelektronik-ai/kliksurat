import React, { useState, useEffect } from 'react';
import { useSurat } from '../context/SuratContext';
import {
  JENIS_SURAT_OPTIONS,
  STATUS_SURAT_MASUK_OPTIONS,
  PRIORITAS_SURAT_OPTIONS,
  SIFAT_SURAT_OPTIONS,
  PEJABAT_PENERIMA_DISPOSISI_OPTIONS,
  getStatusBadge,
  getPrioritasBadge,
  getSifatBadge,
  formatAgendaSuratMasuk,
} from '../constants/suratOptions';

// Helper blangko kosong registrasi surat masuk
const getBlankForm = () => ({
  jenisSurat: 'Surat Dinas',
  jenisSuratLainnya: '',
  status: 'Diregistrasi',
  prioritas: 'Segera',
  sifatSurat: 'Biasa',
  pejabatPenerima: 'Sekretaris',
  nomorSurat: '',
  asalSurat: '',
  perihal: '',
  tanggalSurat: new Date().toISOString().slice(0, 10),
  tanggalTerima: new Date().toISOString().slice(0, 16),
  lampiran: '',
  sifat: 'biasa',
  fileScan: ''
});

export default function SuratMasuk() {
  const { suratMasuk, addSuratMasuk, updateSuratMasukStatus, navigateTo, showToast } = useSurat();

  const [form, setForm] = useState(getBlankForm);
  const [successNotice, setSuccessNotice] = useState(null);

  const [searchFilter, setSearchFilter] = useState('');
  const [filterJenis, setFilterJenis] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterPrioritas, setFilterPrioritas] = useState('semua');
  const [filterSifatSurat, setFilterSifatSurat] = useState('semua');
  const [filterPejabatPenerima, setFilterPejabatPenerima] = useState('semua');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  // Auto-dismiss notifikasi sukses setelah 10 detik
  useEffect(() => {
    if (successNotice) {
      const timer = setTimeout(() => {
        setSuccessNotice(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [successNotice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nomorSurat.trim() || !form.asalSurat.trim() || !form.perihal.trim()) {
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

    const prioritasFinal = form.prioritas || 'Segera';
    const sifatSuratFinal = form.sifatSurat || 'Biasa';
    const sifatFinal = sifatSuratFinal.toLowerCase().replace(/ /g, '_');
    const pejabatFinal = form.pejabatPenerima || 'Sekretaris';

    const savedNomor = form.nomorSurat;
    const savedAgenda = formatAgendaSuratMasuk(
      suratMasuk.length + 1,
      form.tanggalSurat || form.tanggalTerima || new Date()
    );

    addSuratMasuk({
      ...form,
      lampiran: form.lampiran.trim() || '1 Berkas',
      fileScan: form.fileScan || 'Scan_Warkat_Resmi.pdf',
      prioritas: prioritasFinal,
      sifatSurat: sifatSuratFinal,
      sifat: sifatFinal,
      pejabatPenerima: pejabatFinal,
      jenisSurat: finalJenisSurat,
      status: form.status || 'Diregistrasi'
    });

    // 1. Notifikasi di layar bahwa surat masuk berhasil disimpan
    setSuccessNotice({
      nomorSurat: savedNomor,
      agenda: savedAgenda,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    });
    showToast('Surat masuk berhasil disimpan! Menampilkan blangko registrasi baru.', 'success');

    // 2. Layar menampilkan blangko kosong registrasi surat masuk
    setForm(getBlankForm());
    setShowForm(true);

    // 3. Gulir layar ke atas menuju blangko kosong
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSurat = suratMasuk.filter(s => {
    const q = searchFilter.toLowerCase();
    const itemPrioritas = s.prioritas || (s.sifat === 'sangat_segera' ? 'Sangat Segera' : 'Segera');
    const itemSifat = s.sifatSurat || 'Biasa';
    const itemPejabat = s.pejabatPenerima || s.tujuanAwal || 'Ketua Pengadilan';
    const matchSearch =
      s.nomorSurat.toLowerCase().includes(q) ||
      s.asalSurat.toLowerCase().includes(q) ||
      s.perihal.toLowerCase().includes(q) ||
      (s.jenisSurat && s.jenisSurat.toLowerCase().includes(q)) ||
      (s.status && s.status.toLowerCase().includes(q)) ||
      itemPrioritas.toLowerCase().includes(q) ||
      itemSifat.toLowerCase().includes(q) ||
      itemPejabat.toLowerCase().includes(q);

    const matchJenis = filterJenis === 'semua' || (s.jenisSurat || 'Surat Dinas') === filterJenis;
    const matchStatus = filterStatus === 'semua' || s.status === filterStatus;
    const matchPrioritas = filterPrioritas === 'semua' || itemPrioritas === filterPrioritas;
    const matchSifat = filterSifatSurat === 'semua' || itemSifat === filterSifatSurat;
    const matchPejabat = filterPejabatPenerima === 'semua' || itemPejabat === filterPejabatPenerima;

    return matchSearch && matchJenis && matchStatus && matchPrioritas && matchSifat && matchPejabat;
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

      {/* Notifikasi Sukses Simpan Surat Masuk */}
      {successNotice && (
        <div className="p-4 md:p-5 rounded-card bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-sm flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm md:text-base font-bold text-emerald-950">
                  Surat Masuk Berhasil Disimpan!
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-code font-bold">
                  Agenda: {successNotice.agenda}
                </span>
                <span className="text-[11px] text-emerald-700">
                  {successNotice.waktu}
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Naskah dinas nomor <strong>{successNotice.nomorSurat}</strong> telah sukses diregistrasi ke dalam sistem. Di bawah ini ditampilkan <strong>blangko kosong registrasi</strong> yang siap untuk pencatatan surat masuk berikutnya.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            className="p-1 rounded-md text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            title="Tutup notifikasi"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

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
                  Blangko Formulir Registrasi Surat Masuk
                </h3>
                <p className="text-xs text-outline">
                  Formulir pendaftaran naskah dinas resmi siap diisi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm(getBlankForm());
                  showToast('Blangko formulir telah dikosongkan.', 'info');
                }}
                className="text-xs font-semibold text-outline hover:text-danger flex items-center gap-1 px-2.5 py-1 rounded hover:bg-surface border border-outline-subtle transition-colors cursor-pointer"
                title="Kosongkan seluruh isian formulir"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Kosongkan Blangko</span>
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Blangko Siap Diisi
              </span>
            </div>
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

              {/* Pejabat Penerima Disposisi Surat (Sesuai Referensi Pengguna) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
                    <span>Pejabat Penerima Disposisi Surat <span className="text-danger">*</span></span>
                  </span>
                  <span className="text-[11px] font-normal text-outline">Pilih pejabat pengadilan penerima disposisi naskah</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.pejabatPenerima}
                    onChange={(e) => setForm({ ...form, pejabatPenerima: e.target.value })}
                    className="w-full h-10 pl-9 pr-8 rounded-btn bg-white border border-outline-subtle text-sm text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {PEJABAT_PENERIMA_DISPOSISI_OPTIONS.map((pj, idx) => (
                      <option key={pj} value={pj}>
                        {idx + 1}. {pj}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-primary pointer-events-none">
                    assignment_ind
                  </span>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                {/* Shortcut tombol cepat untuk pejabat utama sesuai alur persuratan */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-outline font-medium mr-1">Pilihan Cepat:</span>
                  {['Sekretaris', 'Ketua Pengadilan', 'Wakil Ketua Pengadilan', 'Panitera'].map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => setForm({ ...form, pejabatPenerima: rec })}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        form.pejabatPenerima === rec
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-surface text-on-surface-variant hover:bg-primary-light hover:text-primary border border-outline-subtle'
                      }`}
                    >
                      {rec === 'Sekretaris' ? 'Sekretaris (Penanggung Jawab Surat)' : rec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* A. Prioritas Surat Masuk: Sangat Segera vs Segera */}
            <div className="space-y-2 pt-2 border-t border-outline-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span className="text-primary font-bold">A.</span> Prioritas Surat <span className="text-danger">*</span>
                  </h4>
                  <p className="text-xs text-outline mt-0.5">
                    Menentukan tingkat urgensi dan batas waktu tindak lanjut naskah dinas.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {/* 1. Sangat Segera */}
                <label
                  onClick={() => setForm({ ...form, prioritas: 'Sangat Segera' })}
                  className={`p-3.5 rounded-card border-2 cursor-pointer flex items-center justify-between transition-all ${
                    form.prioritas === 'Sangat Segera'
                      ? 'border-danger bg-danger-light/40 shadow-xs'
                      : 'border-outline-subtle bg-white hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="prioritas"
                      value="Sangat Segera"
                      checked={form.prioritas === 'Sangat Segera'}
                      onChange={() => setForm({ ...form, prioritas: 'Sangat Segera' })}
                      className="text-danger focus:ring-danger w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-sm text-danger flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span>Sangat Segera</span>
                      </div>
                      <p className="text-[11px] text-outline mt-0.5">Wajib segera ditindaklanjuti pimpinan (Maksimal 24 Jam)</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-danger text-white font-bold whitespace-nowrap shadow-2xs">
                    Maks. 24 Jam
                  </span>
                </label>

                {/* 2. Segera */}
                <label
                  onClick={() => setForm({ ...form, prioritas: 'Segera' })}
                  className={`p-3.5 rounded-card border-2 cursor-pointer flex items-center justify-between transition-all ${
                    form.prioritas === 'Segera'
                      ? 'border-warning bg-warning-light/40 shadow-xs'
                      : 'border-outline-subtle bg-white hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="prioritas"
                      value="Segera"
                      checked={form.prioritas === 'Segera'}
                      onChange={() => setForm({ ...form, prioritas: 'Segera' })}
                      className="text-warning-dark focus:ring-warning w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <span>Segera</span>
                      </div>
                      <p className="text-[11px] text-outline mt-0.5">Disposisi & tindak lanjut standar (24 - 48 Jam)</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-warning-light text-amber-950 border border-warning/60 font-bold whitespace-nowrap">
                    24 - 48 Jam
                  </span>
                </label>
              </div>
            </div>

            {/* B. Sifat Surat (Sesuai Referensi Gambar Pengguna) */}
            <div className="space-y-2.5 pt-3 border-t border-outline-subtle">
              <div>
                <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="text-primary font-bold">B.</span> Sifat Surat <span className="text-danger">*</span>
                </h4>
                <p className="text-xs text-outline mt-0.5">
                  Menentukan tingkat kerahasiaan atau pembatasan akses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                {SIFAT_SURAT_OPTIONS.map((opt) => {
                  const isChecked = (form.sifatSurat || 'Biasa') === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setForm({ ...form, sifatSurat: opt, sifat: opt.toLowerCase().replace(/ /g, '_') })}
                      className={`p-3.5 rounded-card border-2 cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-primary bg-primary-light/40 shadow-xs'
                          : 'border-outline-subtle bg-white hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="sifatSurat"
                          value={opt}
                          checked={isChecked}
                          onChange={() => setForm({ ...form, sifatSurat: opt, sifat: opt.toLowerCase().replace(/ /g, '_') })}
                          className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span className={`text-sm ${isChecked ? 'text-primary font-bold' : 'text-on-surface font-medium'}`}>
                          {opt}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        {opt === 'Sangat Rahasia' ? 'lock' : opt === 'Rahasia' ? 'lock_clock' : opt === 'Terbatas' ? 'shield' : 'public'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Unggah Dokumen Scan PDF */}
            <div className="space-y-2 pt-2 border-t border-outline-subtle">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center justify-between">
                <span>Warkat Digital / Berkas Pindaian (Scan Dokumen PDF) <span className="text-danger">*</span></span>
                <span className="text-[11px] font-normal text-outline">Format PDF Resmi</span>
              </label>
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf';
                  input.onchange = (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setForm(prev => ({ ...prev, fileScan: f.name }));
                      showToast(`Berkas warkat '${f.name}' siap dilampirkan.`, 'info');
                    }
                  };
                  input.click();
                }}
                className="border-2 border-dashed border-primary/40 rounded-card p-5 text-center bg-surface hover:bg-primary-light/20 transition-colors cursor-pointer group"
              >
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-primary-light text-primary flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">Klik untuk pilih berkas PDF atau tarik berkas ke sini</p>
                  <p className="text-xs text-outline mt-0.5">Format dokumen PDF standar ISO/PDF-A (Maksimal ukuran file 15 MB)</p>
                </div>
              </div>

              {/* Preview File Chip */}
              {form.fileScan ? (
                <div className="p-3 bg-white border border-outline-subtle rounded-btn flex items-center justify-between shadow-2xs animate-in fade-in">
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
                      <span className="text-[11px] text-outline">Berkas terunggah • Siap disimpan</span>
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
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, fileScan: '' }))}
                      className="w-8 h-8 rounded-lg text-outline hover:text-danger hover:bg-danger-light flex items-center justify-center transition-colors"
                      title="Lepas Berkas"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-surface/50 border border-dashed border-outline-subtle rounded-btn flex flex-wrap items-center justify-between gap-2 text-xs text-outline">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    <span>Blangko belum memuat berkas pindaian (klik kotak di atas untuk memilih file PDF).</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, fileScan: 'Scan_Dokumen_Resmi.pdf' }))}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Lampirkan Berkas Standar
                  </button>
                </div>
              )}
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

            {/* Filter Dropdown Prioritas Surat (Sangat Segera & Segera) */}
            <div className="relative">
              <select
                value={filterPrioritas}
                onChange={(e) => setFilterPrioritas(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
              >
                <option value="semua">Semua Prioritas</option>
                {PRIORITAS_SURAT_OPTIONS.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Filter Dropdown Sifat Surat (B. Sifat Surat: Biasa, Terbatas, Rahasia, Sangat Rahasia) */}
            <div className="relative">
              <select
                value={filterSifatSurat}
                onChange={(e) => setFilterSifatSurat(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
              >
                <option value="semua">Semua Sifat Surat</option>
                {SIFAT_SURAT_OPTIONS.map((sf) => (
                  <option key={sf} value={sf}>
                    {sf}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-[16px] text-outline pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Filter Dropdown Pejabat Penerima Disposisi (10 Pejabat Resmi) */}
            <div className="relative">
              <select
                value={filterPejabatPenerima}
                onChange={(e) => setFilterPejabatPenerima(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-md bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none max-w-[210px] truncate"
              >
                <option value="semua">Semua Penerima Disposisi</option>
                {PEJABAT_PENERIMA_DISPOSISI_OPTIONS.map((pj) => (
                  <option key={pj} value={pj}>
                    {pj}
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
                <th className="py-3 px-3.5 whitespace-nowrap">Nomor Surat Dinas</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Surat Dinas</th>
                <th className="py-3 px-3 whitespace-nowrap">Lampiran</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 whitespace-nowrap">Sifat</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis</th>
                <th className="py-3 px-3 whitespace-nowrap">Diterima Tanggal</th>
                <th className="py-3 px-3 whitespace-nowrap">Nomor Agenda</th>
                <th className="py-3 px-3 whitespace-nowrap">Dari / Asal Surat</th>
                <th className="py-3 px-4 min-w-[200px]">Hal / Perihal</th>
                <th className="py-3 px-3 whitespace-nowrap">Prioritas Surat</th>
                <th className="py-3 px-3 whitespace-nowrap">Disposisi Kepada</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">
                      inbox
                    </span>
                    Belum ada data surat masuk. Klik tombol "+ Catat Surat Masuk" untuk menambahkan surat baru.
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item) => {
                const isMenunggu = item.status === 'Menunggu Disposisi';
                return (
                  <tr key={item.id} className="hover:bg-surface/60 transition-colors">
                    {/* 1. Nomor Surat Dinas */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap font-bold text-on-surface font-code text-xs">
                      {item.nomorSurat}
                    </td>

                    {/* 2. Tanggal Surat Dinas */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-on-surface font-medium text-xs">
                      {item.tanggalSurat || '-'}
                    </td>

                    {/* 3. Lampiran */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-on-surface-variant font-medium">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-outline">attach_file</span>
                        <span>{item.lampiran || '-'}</span>
                      </span>
                    </td>

                    {/* 4. Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
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

                    {/* 5. Sifat */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {(() => {
                        const sBadge = getSifatBadge(item.sifatSurat || item.sifat);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${sBadge.badgeClass}`}
                            title={`Sifat: ${sBadge.label} (${sBadge.desc})`}
                          >
                            <span className="material-symbols-outlined text-[14px]">{sBadge.icon}</span>
                            <span>{sBadge.label}</span>
                          </span>
                        );
                      })()}
                    </td>

                    {/* 6. Jenis */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-light text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[15px]">article</span>
                        <span>{item.jenisSurat || 'Surat Dinas'}</span>
                      </span>
                    </td>

                    {/* 7. Diterima Tanggal */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-on-surface-variant font-medium text-xs">
                      {item.tanggalTerima ? item.tanggalTerima.replace('T', ' ') : item.tanggalSurat}
                    </td>

                    {/* 8. Nomor Agenda */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-code font-bold text-xs text-primary bg-primary-light/60 px-2 py-0.5 rounded border border-primary/20">
                        {item.agenda}
                      </span>
                    </td>

                    {/* 9. Dari / Asal Surat */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-xs text-on-surface">{item.asalSurat}</div>
                    </td>

                    {/* 10. Hal / Perihal */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="truncate font-medium text-xs text-on-surface" title={item.perihal}>
                        {item.perihal}
                      </p>
                    </td>

                    {/* 11. Prioritas Surat */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {(() => {
                        const prio = item.prioritas || (item.sifat === 'sangat_segera' ? 'Sangat Segera' : 'Segera');
                        const pBadge = getPrioritasBadge(prio);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${pBadge.badgeClass}`}
                            title={`Prioritas: ${pBadge.label} (${pBadge.sla})`}
                          >
                            <span className="material-symbols-outlined text-[15px]">{pBadge.icon}</span>
                            <span>{pBadge.label}</span>
                          </span>
                        );
                      })()}
                    </td>

                    {/* 12. Disposisi Kepada */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
                        <span className="material-symbols-outlined text-[15px] text-indigo-700">account_circle</span>
                        <span>{item.pejabatPenerima || item.tujuanAwal || 'Ketua Pengadilan'}</span>
                      </span>
                    </td>

                    {/* 13. Aksi */}
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
              })
            )}
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
