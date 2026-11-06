import React, { useState, useEffect } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';
import {
  formatAgendaSuratKeluar,
  UNIT_PENGUSUL_OPTIONS,
  PENANDATANGAN_OPTIONS,
  formatNomorSuratKeluar,
  getPenandatanganByKode,
  getRomanMonth,
  getYearFromDate,
} from '../constants/suratOptions';

export default function SuratKeluar() {
  const {
    suratKeluar,
    addSuratKeluarDraft,
    approveAndNumberSuratKeluar,
    nomorConfig,
    currentUser,
    isAdmin,
    addKlasifikasi,
    updateKlasifikasi,
    deleteKlasifikasi,
    plhConfig,
    navigateTo,
    showToast,
  } = useSurat();

  const defaultUnit = currentUser.department?.toLowerCase().includes('kepaniteraan')
    ? 'Kepaniteraan'
    : 'Kesekretariatan';

  const getBlankForm = () => ({
    tujuanSurat: '',
    perihal: '',
    unitPengusul: defaultUnit,
    kodePenandatangan: 'KPA', // Default Ketua: KPA
    kodeKlasifikasi: 'HK.01',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    sifat: 'biasa',
    lampiran: '1 Berkas Lampiran',
  });

  const [form, setForm] = useState(getBlankForm());
  const [successNotice, setSuccessNotice] = useState(null);

  useEffect(() => {
    if (successNotice) {
      const timer = setTimeout(() => {
        setSuccessNotice(null);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [successNotice]);

  const [showForm, setShowForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('semua');

  // State Modal Admin Kelola Kode Klasifikasi
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingKode, setEditingKode] = useState(null); // kode string if editing, null if not
  const [modalForm, setModalForm] = useState({
    kode: '',
    nama: '',
    penjelasan: '',
    counter: 1,
  });

  const selectedKlasifikasi = (nomorConfig.klasifikasi || []).find(
    (k) => k.kode === form.kodeKlasifikasi
  ) || nomorConfig.klasifikasi?.[0];

  const selectedPenandatangan = getPenandatanganByKode(form.kodePenandatangan);
  const kodePa = nomorConfig.kodePa || nomorConfig.kodePrefix || 'W13-A8';

  // Perhitungan Pratinjau Nomor Surat Keluar Berdasarkan Rumus:
  // [Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun]
  const nextEstimatedNum = (selectedKlasifikasi?.counter || 0) + 1;
  const previewNomorSuratKeluar = formatNomorSuratKeluar(
    nextEstimatedNum,
    form.kodePenandatangan,
    form.kodeKlasifikasi,
    form.tanggalSurat,
    null,
    kodePa
  );

  const handleOpenAddKlasifikasi = () => {
    setEditingKode(null);
    setModalForm({
      kode: '',
      nama: '',
      penjelasan: '',
      counter: 1,
    });
    setShowAdminModal(true);
  };

  const handleOpenEditKlasifikasi = (item) => {
    setEditingKode(item.kode);
    setModalForm({
      kode: item.kode,
      nama: item.nama,
      penjelasan: item.penjelasan || '',
      counter: item.counter || 0,
    });
    setShowAdminModal(true);
  };

  const handleSaveModalKlasifikasi = (e) => {
    e.preventDefault();
    if (!modalForm.kode.trim() || !modalForm.nama.trim()) {
      showToast('Kode dan nama klasifikasi wajib diisi', 'warning');
      return;
    }

    if (editingKode) {
      const ok = updateKlasifikasi(editingKode, modalForm);
      if (ok) {
        if (form.kodeKlasifikasi === editingKode) {
          setForm((prev) => ({ ...prev, kodeKlasifikasi: modalForm.kode.toUpperCase().trim() }));
        }
        setShowAdminModal(false);
      }
    } else {
      const ok = addKlasifikasi(modalForm);
      if (ok) {
        setForm((prev) => ({ ...prev, kodeKlasifikasi: modalForm.kode.toUpperCase().trim() }));
        setShowAdminModal(false);
      }
    }
  };

  const handleDeleteItem = (targetKode) => {
    if (window.confirm(`Yakin ingin menghapus kode klasifikasi "${targetKode}"?`)) {
      const ok = deleteKlasifikasi(targetKode);
      if (ok && form.kodeKlasifikasi === targetKode) {
        const remaining = (nomorConfig.klasifikasi || []).filter((k) => k.kode !== targetKode);
        if (remaining.length > 0) {
          setForm((prev) => ({ ...prev, kodeKlasifikasi: remaining[0].kode }));
        }
      }
    }
  };

  const handleCreateDraft = (e) => {
    e.preventDefault();
    if (!form.tujuanSurat?.trim() || !form.perihal?.trim()) {
      showToast('Harap lengkapi tujuan dan perihal surat keluar (*)', 'warning');
      return;
    }

    const savedTujuan = form.tujuanSurat.trim();
    const savedPerihal = form.perihal.trim();
    const savedAgenda = formatAgendaSuratKeluar(
      suratKeluar.length + 1,
      form.tanggalSurat || new Date()
    );
    const savedEstimasiNomor = previewNomorSuratKeluar;
    const savedTtd = selectedPenandatangan.nama;
    const savedKodeTtd = form.kodePenandatangan;

    addSuratKeluarDraft(form);

    // 1. Notifikasi di layar: "Silakan draf diajukan ke atasan"
    setSuccessNotice({
      tujuan: savedTujuan,
      perihal: savedPerihal,
      agenda: savedAgenda,
      estimasiNomor: savedEstimasiNomor,
      penandatangan: savedTtd,
      kodeTtd: savedKodeTtd,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
    showToast('Draf surat keluar berhasil disimpan! Silakan draf diajukan ke atasan.', 'success');

    // 2. Munculkan blangko baru kosong untuk pengajuan naskah berikutnya
    setForm(getBlankForm());
    setShowForm(true);

    // 3. Gulir ke atas dengan mulus menuju blangko baru
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLeader =
    currentUser.roleKey === 'ketua' ||
    currentUser.roleKey === 'wakil_ketua' ||
    currentUser.roleKey === 'sekretaris' ||
    currentUser.roleKey === 'panitera' ||
    (currentUser.roleKey === 'hakim_senior' && plhConfig?.isActive && plhConfig?.tipePelimpahan === 'hakim_ditunjuk');

  const filteredSurat = suratKeluar.filter((s) => {
    const matchQuery =
      s.nomorSurat.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.kodePenandatangan || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.tujuanSurat.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.pembuat.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.unitPengusul || '').toLowerCase().includes(filterQuery.toLowerCase());
    const matchUnit =
      filterUnit === 'semua' ||
      (s.unitPengusul || '').toLowerCase().includes(filterUnit.toLowerCase());
    return matchQuery && matchUnit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Surat Keluar</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Penomoran & Register</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Manajemen Surat Keluar</h2>
          <p className="text-xs md:text-sm text-outline">
            Pengajuan naskah dinas, penomoran resmi rumus SOP MARI, pilihan pejabat penandatangan, dan register surat keluar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('laporan', null, 'keluar')}
            className="h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-primary hover:bg-surface text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Buka buku agenda rekapitulasi surat keluar per bulan dan per kode surat"
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
            <span>{showForm ? 'Tutup Formulir' : '+ Ajukan Surat Keluar'}</span>
          </button>
        </div>
      </div>

      {/* Information Banner: Rumus Baku Penomoran Surat Keluar & Kode Penandatangan */}
      <div className="p-4 rounded-card bg-primary-light/40 border border-primary/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[22px]">format_list_numbered</span>
          </div>
          <div>
            <div className="font-bold text-on-surface text-sm flex flex-wrap items-center gap-2">
              <span>SOP Rumus Penomoran Surat Keluar Resmi</span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-primary text-white font-bold">
                (No. Urut / TTD.{kodePa} / Klasifikasi / Bulan / Tahun)
              </span>
            </div>
            <p className="text-on-surface-variant text-xs mt-0.5">
              Rumus Baku: <code>[Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun]</code>
            </p>
          </div>
        </div>

        {/* Pilihan Kode Penandatangan Resmi & Kode PA */}
        <div className="flex flex-wrap items-center gap-1.5 self-stretch lg:self-auto">
          <span className="px-2 py-1 rounded bg-white text-primary border border-primary/30 font-mono font-bold text-[11px]" title="Kode Satuan Kerja Pengadilan Agama Lumajang">
            Kode PA: <strong>{kodePa}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold text-[11px]" title="Ketua Pengadilan Agama">
            Ketua: <strong>KPA</strong>
          </span>
          <span className="px-2 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 font-mono font-bold text-[11px]" title="Wakil Ketua Pengadilan Agama">
            Wakil Ketua: <strong>WKPA</strong>
          </span>
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[11px]" title="Panitera Pengadilan Agama">
            Panitera: <strong>PAN.PA</strong>
          </span>
          <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold text-[11px]" title="Sekretaris Pengadilan Agama">
            Sekretaris: <strong>SEK.PA</strong>
          </span>
        </div>
      </div>

      {/* Notifikasi Sukses Simpan Draf & Instruksi Ajukan ke Atasan */}
      {successNotice && (
        <div className="p-4 md:p-5 rounded-card bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-md flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">send_and_archive</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm md:text-base font-bold text-emerald-950">
                  Draf Berhasil Disimpan! Silakan Draf Diajukan ke Atasan
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-code font-bold">
                  Agenda: {successNotice.agenda}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {successNotice.waktu}
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Draf naskah dinas untuk tujuan <strong>{successNotice.tujuan}</strong> perihal <em>"{successNotice.perihal}"</em> berhasil disimpan ke dalam sistem dengan estimasi nomor: <strong className="font-code text-emerald-950 bg-emerald-100 px-1.5 py-0.5 rounded">{successNotice.estimasiNomor}</strong>. <strong>Silakan draf diajukan ke atasan ({successNotice.penandatangan})</strong> untuk proses telaah, persetujuan, dan penomoran resmi.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-emerald-900 border border-emerald-300 text-xs font-semibold mt-1 shadow-2xs">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">note_add</span>
                <span>Blangko baru kosong telah siap di bawah untuk pencatatan surat keluar berikutnya.</span>
              </div>
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

      {/* Form Pengajuan Draf Surat Keluar */}
      {showForm && (
        <div className="bg-white rounded-card border border-outline-subtle shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-outline-subtle pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
              <h3 className="text-sm md:text-base font-bold text-on-surface">
                Formulir Konsep Draf Surat Keluar
              </h3>
              {successNotice && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-300 animate-pulse">
                  <span className="material-symbols-outlined text-[14px]">add_circle</span>
                  Blangko Baru Siap Diisi
                </span>
              )}
            </div>
            <span className="text-xs text-outline">Status Awal: Menunggu Persetujuan Atasan</span>
          </div>

          <form onSubmit={handleCreateDraft} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              {/* Kolom 1: Instansi Tujuan */}
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Instansi / Pihak Tujuan Surat <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.tujuanSurat}
                  onChange={(e) => setForm({ ...form, tujuanSurat: e.target.value })}
                  placeholder="Contoh: Mahkamah Agung RI / PTA Surabaya"
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Kolom 2: Unit Kerja Pengusul */}
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Unit Kerja Pengusul <span className="text-danger">*</span></span>
                  <span className="text-[11px] font-normal text-outline">Kepaniteraan / Kesekretariatan</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.unitPengusul}
                    onChange={(e) => setForm({ ...form, unitPengusul: e.target.value })}
                    className="w-full h-10 pl-3 pr-8 rounded-btn bg-white border border-outline-subtle text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  >
                    {UNIT_PENGUSUL_OPTIONS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                {/* Pilihan Cepat Tombol Unit Pengusul */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {UNIT_PENGUSUL_OPTIONS.map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setForm({ ...form, unitPengusul: unit })}
                      className={`h-7 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        form.unitPengusul === unit
                          ? 'bg-primary text-white shadow-2xs font-bold'
                          : 'bg-surface text-on-surface hover:bg-primary-light hover:text-primary border border-outline-subtle'
                      }`}
                    >
                      <span>{form.unitPengusul === unit ? '☑' : '☐'}</span>
                      <span>{unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kolom 1 (Kiri): Kode Klasifikasi Tata Persuratan & Tombol Aksi Admin */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-on-surface-variant">
                    Kode Klasifikasi Tata Persuratan <span className="text-danger">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary-light border border-primary/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
                    Hak Akses Admin
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={form.kodeKlasifikasi}
                    onChange={(e) => setForm({ ...form, kodeKlasifikasi: e.target.value })}
                    className="w-full h-11 pl-3 pr-8 rounded-btn bg-white border-2 border-primary/30 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs md:text-sm shadow-2xs cursor-pointer"
                  >
                    {nomorConfig.klasifikasi.map((k) => (
                      <option key={k.kode} value={k.kode}>
                        {k.kode} - {k.nama} (No. Terakhir: {k.counter})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-[20px] text-primary pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Tombol Hak Akses Admin untuk Tambah, Edit, Hapus Kode Klasifikasi */}
                <div className="p-2 rounded-lg bg-surface border border-outline-subtle flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    Aksi Admin:
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenAddKlasifikasi}
                    className="px-2.5 py-1 rounded bg-primary text-white hover:bg-primary-dark text-xs font-bold shadow-2xs flex items-center gap-1 transition-all active:scale-95"
                    title="Tambah kode klasifikasi tata persuratan baru"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                    <span>Tambah Kode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedKlasifikasi && handleOpenEditKlasifikasi(selectedKlasifikasi)}
                    className="px-2.5 py-1 rounded bg-white hover:bg-primary-light hover:text-primary text-on-surface text-xs font-bold border border-outline-subtle flex items-center gap-1 transition-all active:scale-95"
                    title="Edit kode klasifikasi dan penjelasan peruntukan kode yang sedang dipilih"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    <span>Edit ({form.kodeKlasifikasi})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(form.kodeKlasifikasi)}
                    className="px-2.5 py-1 rounded bg-rose-50 hover:bg-danger hover:text-white text-danger text-xs font-bold border border-rose-200 flex items-center gap-1 transition-all active:scale-95"
                    title="Hapus kode klasifikasi yang sedang dipilih"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>Hapus ({form.kodeKlasifikasi})</span>
                  </button>
                </div>
              </div>

              {/* Kolom 2 (Kanan - "KOLOM LAIN"): Penjelasan Singkat Kode Klasifikasi (Cek Kesesuaian Kode) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">info</span>
                    <span>Penjelasan Singkat Kode Klasifikasi ({selectedKlasifikasi?.kode || form.kodeKlasifikasi})</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">sync</span>
                    Otomatis Menyesuaikan
                  </span>
                </div>

                <div className="p-3 rounded-card bg-primary-light/40 border-2 border-primary/30 flex flex-col justify-between shadow-2xs space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-primary/20 pb-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-primary text-white font-mono font-bold text-xs">
                          {selectedKlasifikasi?.kode || form.kodeKlasifikasi}
                        </span>
                        <span className="font-bold text-xs text-primary font-mono truncate max-w-[200px] sm:max-w-none">
                          {selectedKlasifikasi?.nama}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-primary/20 text-primary font-bold whitespace-nowrap">
                        No. Terakhir: <strong>{selectedKlasifikasi?.counter ?? 0}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed font-medium">
                      {selectedKlasifikasi?.penjelasan || (
                        <span className="text-outline italic">
                          Naskah dinas resmi terkait bidang administrasi {selectedKlasifikasi?.nama}.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Indikator Verifikasi Kesesuaian Kode dengan Penjelasan */}
                  <div className="pt-1.5 border-t border-primary/20 flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-btn border border-amber-200 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-amber-700 shrink-0">verified</span>
                    <span>
                      <strong>Tujuan Penjelasan:</strong> Pastikan perihal surat Anda sudah sesuai dengan ruang lingkup penjelasan kode di atas sebelum diajukan.
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Perihal Naskah Dinas Keluar */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-on-surface-variant">
                  Perihal Naskah Dinas Keluar <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={form.perihal}
                  onChange={(e) => setForm({ ...form, perihal: e.target.value })}
                  placeholder="Isi uraian ringkas perihal surat dinas..."
                  className="w-full p-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Unit Kerja Pengusul */}
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Unit Kerja Pengusul <span className="text-danger">*</span></span>
                  <span className="text-[11px] font-normal text-outline">Kepaniteraan / Kesekretariatan</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.unitPengusul}
                    onChange={(e) => setForm({ ...form, unitPengusul: e.target.value })}
                    className="w-full h-10 pl-3 pr-8 rounded-btn bg-white border border-outline-subtle text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  >
                    {UNIT_PENGUSUL_OPTIONS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                {/* Pilihan Cepat Tombol Unit Pengusul */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {UNIT_PENGUSUL_OPTIONS.map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setForm({ ...form, unitPengusul: unit })}
                      className={`h-8 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        form.unitPengusul === unit
                          ? 'bg-primary text-white shadow-2xs font-bold'
                          : 'bg-surface text-on-surface hover:bg-primary-light hover:text-primary border border-outline-subtle'
                      }`}
                    >
                      <span>{form.unitPengusul === unit ? '☑' : '☐'}</span>
                      <span>{unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pejabat Penandatangan Surat & Kode Penandatangan (KPA / WKPA / PAN.PA / SEK.PA) */}
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Pejabat Penandatangan Surat <span className="text-danger">*</span></span>
                  <span className="text-[11px] font-mono text-primary font-bold">
                    Kode TTD: {form.kodePenandatangan}
                  </span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.kodePenandatangan}
                    onChange={(e) => setForm({ ...form, kodePenandatangan: e.target.value })}
                    className="w-full h-10 pl-3 pr-8 rounded-btn bg-white border border-outline-subtle text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  >
                    {PENANDATANGAN_OPTIONS.map((p) => (
                      <option key={p.kode} value={p.kode}>
                        {p.nama} : {p.kode} ({p.deskripsi})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
                {/* Pilihan Cepat 4 Tombol Kode Penandatangan */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {PENANDATANGAN_OPTIONS.map((p) => (
                    <button
                      key={p.kode}
                      type="button"
                      onClick={() => setForm({ ...form, kodePenandatangan: p.kode })}
                      className={`h-8 px-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                        form.kodePenandatangan === p.kode
                          ? 'bg-primary text-white shadow-2xs font-bold border border-primary'
                          : 'bg-surface text-on-surface hover:bg-primary-light hover:text-primary border border-outline-subtle'
                      }`}
                      title={`${p.nama} (${p.kode})`}
                    >
                      <span>{form.kodePenandatangan === p.kode ? '☑' : '☐'}</span>
                      <span className="truncate">{p.nama}</span>
                      <span className="font-mono text-[10px] font-bold opacity-90">({p.kode})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal Surat & Lampiran */}
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Tanggal Surat Keluar</label>
                <input
                  type="date"
                  value={form.tanggalSurat}
                  onChange={(e) => setForm({ ...form, tanggalSurat: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Lampiran Berkas</label>
                <input
                  type="text"
                  value={form.lampiran}
                  onChange={(e) => setForm({ ...form, lampiran: e.target.value })}
                  placeholder="Contoh: 1 Berkas Proposal"
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* KOLOM NOMOR SURAT KELUAR DENGAN RUMUS:
                  [Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun] */}
              <div className="space-y-1 md:col-span-2">
                <div className="p-4 rounded-card bg-primary-light/50 border border-primary/30 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="font-bold text-primary text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[18px]">pin</span>
                      <span>Kolom Nomor Surat Keluar (Rumus Baku SOP MARI)</span>
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-primary border border-primary/20 font-bold">
                      Format Otomatis Sesuai Rumus
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-btn border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
                    <div className="text-center md:text-left">
                      <div className="text-[11px] text-outline font-medium">Estimasi Nomor Surat Keluar Resmi:</div>
                      <div className="font-code text-lg sm:text-2xl font-black text-primary tracking-wide">
                        {previewNomorSuratKeluar}
                      </div>
                    </div>

                    {/* Breakdown Parameter Rumus: No Urut / TTD.Kode PA / Klas / Bulan / Tahun */}
                    <div className="flex flex-wrap items-center justify-center gap-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-surface border border-outline-subtle font-mono text-on-surface" title="Nomor Urut Surat Keluar">
                        No: <strong>{nextEstimatedNum}</strong>
                      </span>
                      <span className="text-outline font-bold">/</span>
                      <span className="px-2 py-0.5 rounded bg-primary-light text-primary border border-primary/30 font-mono font-bold" title={`Kode Penandatangan & Kode PA Lumajang: ${selectedPenandatangan.nama}`}>
                        TTD: <strong>{form.kodePenandatangan}.{kodePa}</strong>
                      </span>
                      <span className="text-outline font-bold">/</span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-outline-subtle font-mono text-on-surface" title="Kode Klasifikasi Surat">
                        Klas: <strong>{form.kodeKlasifikasi}</strong>
                      </span>
                      <span className="text-outline font-bold">/</span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-outline-subtle font-mono text-on-surface" title="Bulan (Angka Romawi)">
                        Bulan: <strong>{getRomanMonth(form.tanggalSurat)}</strong>
                      </span>
                      <span className="text-outline font-bold">/</span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-outline-subtle font-mono text-on-surface" title="Tahun">
                        Tahun: <strong>{getYearFromDate(form.tanggalSurat)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-on-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">info</span>
                      <span><strong>Rumus:</strong> [Nomor Urut]/[Kode Penandatangan].[Kode PA Lumajang]/[Kode Klasifikasi]/[Bulan Romawi]/[Tahun] (Kode PA: {kodePa})</span>
                    </div>
                    <span className="text-[10px] text-outline italic">Diterbitkan otomatis saat naskah disetujui atasan</span>
                  </div>
                </div>
              </div>

              {/* Nomor Agenda Surat Keluar (Otomatis & Terkunci) */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Nomor Agenda Surat Keluar (Buku Register Harian)</span>
                  <span className="text-[11px] font-normal text-primary">Contoh: 0001/SK/XI/2026</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formatAgendaSuratKeluar(
                      suratKeluar.length + 1,
                      form.tanggalSurat || new Date()
                    )}
                    className="w-full h-10 px-3.5 rounded-btn bg-surface border border-outline-subtle text-xs font-code font-bold text-primary cursor-not-allowed"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline">
                    lock
                  </span>
                </div>
                <p className="text-[11px] text-outline">Rumus Agenda: {`{Nomor Urut 4 Digit}/SK/{Bulan Romawi}/{Tahun}`}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-subtle">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
              >
                Batal
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Ajukan Draf ke Atasan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Register Surat Keluar */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-outline-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">Buku Register Surat Keluar Resmi</h3>
            <p className="text-xs text-outline">
              Daftar naskah dinas keluar dengan penomoran resmi rumus (No. Urut / Kode TTD / Kode Klasifikasi / Bulan / Tahun).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Unit Kerja Pengusul */}
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="h-9 px-3 rounded-md bg-surface border border-outline-subtle text-xs text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="semua">Semua Unit Pengusul</option>
              {UNIT_PENGUSUL_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Cari nomor, TTD, perihal, tujuan..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-outline-subtle text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 min-w-[220px]">
                  <div>Nomor Surat Keluar</div>
                  <div className="text-[10px] text-outline font-normal font-sans normal-case tracking-normal">
                    (No. Urut / TTD.{kodePa} / Klasifikasi / Bulan / Tahun)
                  </div>
                </th>
                <th className="py-3 px-4 w-36">Penandatangan</th>
                <th className="py-3 px-4 min-w-[170px]">Tujuan Surat</th>
                <th className="py-3 px-4 min-w-[240px]">Perihal & Lampiran</th>
                <th className="py-3 px-4 min-w-[170px]">Pengusul & Pembuat</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-4 min-w-[150px]">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">
                      outbox
                    </span>
                    Belum ada data surat keluar. Klik tombol "+ Buat Usulan Surat Keluar" untuk membuat baru.
                  </td>
                </tr>
              ) : (
                filteredSurat.map((item, idx) => {
                const isApproved = item.status === 'Disetujui & Diterbitkan Nomor';
                const rawTtd = item.kodePenandatangan || (item.nomorSurat && item.nomorSurat.includes('/') ? item.nomorSurat.split('/')[1] : 'KPA');
                let ttdKode = 'KPA';
                if (rawTtd.includes('PAN.PA')) ttdKode = 'PAN.PA';
                else if (rawTtd.includes('SEK.PA')) ttdKode = 'SEK.PA';
                else if (rawTtd.includes('WKPA')) ttdKode = 'WKPA';
                else if (rawTtd.includes('KPA')) ttdKode = 'KPA';
                else ttdKode = rawTtd.split('.')[0] || 'KPA';

                const ttdInfo = getPenandatanganByKode(ttdKode);

                return (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                    {/* Kolom Nomor Surat Keluar (Rumus: No. Urut/TTD.W13-A8/Klasifikasi/Bulan/Tahun) */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      {isApproved ? (
                        <div>
                          <div className="font-bold text-primary font-code text-xs tracking-wide">
                            {item.nomorSurat}
                          </div>
                          <div className="text-[11px] text-outline font-code mt-0.5">
                            Agenda: {item.agenda || formatAgendaSuratKeluar(idx + 1, item.tanggalSurat)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-warning-light px-2 py-0.5 rounded border border-warning/40">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span className="font-code font-bold">
                              {formatNomorSuratKeluar(item.nomorUrut || '...', ttdKode, item.kodeKlasifikasi, item.tanggalSurat, null, kodePa)}
                            </span>
                          </div>
                          <div className="text-[11px] text-outline font-code mt-0.5">
                            Agenda: {item.agenda || formatAgendaSuratKeluar(idx + 1, item.tanggalSurat)}
                          </div>
                        </div>
                      )}
                      <div className="text-[10px] text-outline mt-0.5 font-medium">
                        Klasifikasi: <span className="font-mono font-bold text-on-surface">{item.kodeKlasifikasi}</span>
                      </div>
                    </td>

                    {/* Kolom Kode & Pejabat Penandatangan */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${
                        ttdKode === 'KPA'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : ttdKode === 'WKPA'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : ttdKode === 'PAN.PA'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">draw</span>
                        <span>{ttdKode}.{kodePa}</span>
                      </span>
                      <div className="text-[11px] text-outline mt-0.5 font-medium">
                        {ttdInfo.nama}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold whitespace-nowrap align-top">
                      {item.tujuanSurat}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs align-top">
                      <div className="font-medium text-on-surface truncate" title={item.perihal}>
                        {item.perihal}
                      </div>
                      <span className="text-[11px] text-outline">{item.lampiran}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs align-top">
                      <div className="font-semibold text-on-surface">{item.pembuat}</div>
                      <div className="text-[11px] text-outline">{item.unitPengusul}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant font-medium align-top">
                      {item.tanggalSurat}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      {isApproved ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/30">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Diterbitkan
                          </span>
                          <div className="text-[10px] text-outline mt-0.5">Oleh: {item.disetujuiOleh}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-warning-light text-amber-900 border border-warning/40">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {item.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right align-top">
                      {!isApproved ? (
                        <button
                          onClick={() => approveAndNumberSuratKeluar(item.id)}
                          className="h-8 px-3 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors"
                          title="Setujui dan beri nomor resmi sesuai rumus"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Setujui & Beri Nomor</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { showToast(`Membuka naskah dinas resmi: ${item.nomorSurat}...`, 'info'); openWarkatPreview(item); }}
                          className="h-8 px-3 rounded-btn bg-white border border-outline-subtle text-primary hover:bg-primary-light text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span>
                          <span>Cetak Surat</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modal Admin: Tambah & Edit Kode Klasifikasi Surat */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-card shadow-2xl border border-outline-subtle max-w-2xl w-full p-5 md:p-6 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">admin_panel_settings</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    {editingKode ? `Edit Kode Klasifikasi: ${editingKode}` : 'Kelola & Tambah Kode Klasifikasi Surat'}
                  </h3>
                  <p className="text-[11px] text-outline">
                    Hak Akses Admin: Tambah baru, edit nama & penjelasan ruang lingkup, serta hapus kode.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form Tambah / Edit */}
            <form onSubmit={handleSaveModalKlasifikasi} className="p-4 rounded-lg bg-surface/50 border border-outline-subtle space-y-3 text-xs">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">
                  {editingKode ? 'edit_note' : 'add_circle'}
                </span>
                <span>{editingKode ? 'Formulir Perubahan Kode Klasifikasi' : 'Formulir Tambah Kode Klasifikasi Baru'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Kode Klasifikasi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.kode}
                    onChange={(e) => setModalForm({ ...modalForm, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: OT.01"
                    className="w-full h-9 px-2.5 rounded border border-outline-subtle bg-white font-code font-bold uppercase text-on-surface"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-on-surface block mb-1">
                    Nama / Bidang Administrasi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.nama}
                    onChange={(e) => setModalForm({ ...modalForm, nama: e.target.value })}
                    placeholder="Contoh: Organisasi dan Tata Laksana"
                    className="w-full h-9 px-2.5 rounded border border-outline-subtle bg-white font-semibold text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Penjelasan Singkat & Ruang Lingkup Surat: <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalForm.penjelasan}
                  onChange={(e) => setModalForm({ ...modalForm, penjelasan: e.target.value })}
                  placeholder="Jelaskan jenis surat yang termasuk dalam kode ini agar pengguna dapat memastikan kecocokan kode..."
                  className="w-full p-2.5 text-xs rounded border border-outline-subtle bg-white text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Counter Nomor Urut Terakhir:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.counter}
                    onChange={(e) => setModalForm({ ...modalForm, counter: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded border border-outline-subtle bg-white font-code font-bold text-on-surface"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {editingKode && (
                    <button
                      type="button"
                      onClick={handleOpenAddKlasifikasi}
                      className="h-9 px-3 rounded border border-outline-subtle bg-white text-xs font-semibold hover:bg-surface"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="h-9 px-4 rounded bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>{editingKode ? 'Simpan Perubahan' : 'Tambahkan Kode'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Tabel Daftar Kode yang Ada dengan Aksi Edit & Hapus */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                <span>Daftar Kode Klasifikasi Terdaftar ({nomorConfig.klasifikasi.length}):</span>
                <span className="text-[10px] text-outline font-normal">Klik tombol Edit atau Hapus di setiap baris</span>
              </div>
              <div className="border border-outline-subtle rounded-lg max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface border-b border-outline-subtle font-bold text-outline sticky top-0">
                    <tr>
                      <th className="p-2">Kode</th>
                      <th className="p-2">Nama & Penjelasan Singkat</th>
                      <th className="p-2 text-center">Counter</th>
                      <th className="p-2 text-right">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-subtle">
                    {nomorConfig.klasifikasi.map((k) => (
                      <tr key={k.kode} className="hover:bg-surface/50">
                        <td className="p-2 font-bold font-code text-primary align-top whitespace-nowrap">
                          {k.kode}
                        </td>
                        <td className="p-2 align-top">
                          <div className="font-semibold text-on-surface">{k.nama}</div>
                          <div className="text-[11px] text-outline line-clamp-2 mt-0.5">
                            {k.penjelasan || '-'}
                          </div>
                        </td>
                        <td className="p-2 text-center font-code font-bold align-top">
                          {k.counter}
                        </td>
                        <td className="p-2 text-right align-top whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditKlasifikasi(k)}
                            className="px-2 py-1 rounded bg-surface hover:bg-primary-light hover:text-primary border border-outline-subtle text-[11px] font-semibold"
                            title="Edit kode klasifikasi ini"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(k.kode)}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-danger hover:text-white border border-rose-200 text-danger text-[11px] font-semibold transition-colors"
                            title="Hapus kode klasifikasi ini"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="h-9 px-4 rounded-btn bg-surface border border-outline-subtle text-xs font-semibold hover:bg-surface-low"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
