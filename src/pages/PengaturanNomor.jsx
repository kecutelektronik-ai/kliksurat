import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';
import { PENANDATANGAN_OPTIONS } from '../constants/suratOptions';

export default function PengaturanNomor() {
  const {
    nomorConfig,
    setNomorConfig,
    addKlasifikasi,
    updateKlasifikasi,
    deleteKlasifikasi,
    isAdmin,
    currentUser,
    showToast,
  } = useSurat();

  const [prefix, setPrefix] = useState(nomorConfig.kodePrefix || 'W13-A12');
  const [tahun, setTahun] = useState(nomorConfig.tahun || 2026);

  // New Classification State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newPenjelasan, setNewPenjelasan] = useState('');
  const [newCounter, setNewCounter] = useState(1);

  // Edit Classification State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKode, setEditingKode] = useState(null);
  const [editForm, setEditForm] = useState({
    kode: '',
    nama: '',
    penjelasan: '',
    counter: 0,
  });

  // Simulator State
  const klasifikasiList = nomorConfig.klasifikasi || [];
  const [simKode, setSimKode] = useState(klasifikasiList[0]?.kode || 'HK.01');
  const [simPenandatangan, setSimPenandatangan] = useState('KPA');
  const [simBulan, setSimBulan] = useState('X');

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setNomorConfig({
      ...nomorConfig,
      kodePrefix: prefix,
      tahun: Number(tahun),
    });
    showToast('Konfigurasi tata penomoran surat berhasil disimpan.', 'success');
  };

  const handleOpenAdd = () => {
    setNewKode('');
    setNewNama('');
    setNewPenjelasan('');
    setNewCounter(1);
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newKode || !newNama) {
      showToast('Harap lengkapi kode dan nama klasifikasi', 'warning');
      return;
    }
    const success = addKlasifikasi({
      kode: newKode,
      nama: newNama,
      penjelasan: newPenjelasan,
      counter: Number(newCounter) || 0,
    });
    if (success) {
      setShowAddModal(false);
      setNewKode('');
      setNewNama('');
      setNewPenjelasan('');
      setNewCounter(1);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingKode(item.kode);
    setEditForm({
      kode: item.kode,
      nama: item.nama,
      penjelasan: item.penjelasan || '',
      counter: item.counter ?? 0,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.kode || !editForm.nama) {
      showToast('Harap lengkapi kode dan nama klasifikasi', 'warning');
      return;
    }
    const success = updateKlasifikasi(editingKode, editForm);
    if (success) {
      setShowEditModal(false);
      setEditingKode(null);
    }
  };

  const handleDelete = (targetKode) => {
    if (!isAdmin) {
      showToast('Hanya Admin yang berhak menghapus kode klasifikasi.', 'error');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus kode klasifikasi "${targetKode}"? Nomor surat sebelumnya tidak akan terhapus.`)) {
      deleteKlasifikasi(targetKode);
      if (simKode === targetKode && klasifikasiList.length > 1) {
        const nextKode = klasifikasiList.find((k) => k.kode !== targetKode)?.kode;
        if (nextKode) setSimKode(nextKode);
      }
    }
  };

  const handleUpdateCounter = (item, delta) => {
    const updatedCounter = Math.max(0, (item.counter || 0) + delta);
    updateKlasifikasi(item.kode, {
      ...item,
      counter: updatedCounter,
    });
  };

  const simTarget = klasifikasiList.find((k) => k.kode === simKode) || klasifikasiList[0];
  // Rumus: (nomor urut surat keluar/kode penandatangan surat/kode klasifikasi surat/bulan (angka romawi)/tahun)
  const simGeneratedNumber = `${(simTarget?.counter || 0) + 1}/${simPenandatangan}/${simKode}/${simBulan}/${tahun}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Pengaturan Sistem</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Penomoran Otomatis & Klasifikasi</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Pengaturan Nomor & Klasifikasi Surat</h2>
          <p className="text-xs md:text-sm text-outline">
            Kelola kode klasifikasi tata persuratan dinas, penjelasan peruntukan kode, serta counter nomor urut otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={handleOpenAdd}
              className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Tambah Klasifikasi Baru (Admin)</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-btn bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Mode Lihat (Akses Admin Diperlukan untuk Mengubah)</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Access Status Banner */}
      <div className={`p-4 rounded-card border flex items-center justify-between gap-3 text-xs md:text-sm ${
        isAdmin ? 'bg-primary-light/40 border-primary/30 text-on-surface' : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isAdmin ? 'bg-primary text-white' : 'bg-amber-500 text-white'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {isAdmin ? 'admin_panel_settings' : 'shield_person'}
            </span>
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>{isAdmin ? 'Hak Akses Admin Aktif' : 'Hak Akses Terbatas'}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white font-mono font-semibold border border-outline-subtle">
                {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">
              {isAdmin
                ? 'Sebagai administrator, Anda memiliki hak penuh untuk menambah, mengedit penjelasan/kode, dan menghapus kode klasifikasi surat.'
                : 'Anda saat ini login dengan hak akses read-only pada pengaturan kode klasifikasi.'}
            </p>
          </div>
        </div>

        {isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-success bg-white px-2.5 py-1 rounded-md border border-success/30">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Akses Penuh Diizinkan
          </span>
        )}
      </div>

      {/* Simulator Penomoran Otomatis Live */}
      <div className="p-6 rounded-card bg-surface-low border border-primary/30 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">magic_button</span>
            <span>Simulasi Generator Penomoran Surat Keluar</span>
          </div>
          <div className="p-3 bg-white rounded-btn border border-primary/20 text-center">
            <span className="font-code text-lg sm:text-2xl font-extrabold text-primary tracking-wide">
              {simGeneratedNumber}
            </span>
          </div>
          <p className="text-xs text-outline">
            <strong>Rumus:</strong> (nomor urut surat keluar/kode penandatangan surat/kode klasifikasi surat/bulan (angka romawi)/tahun)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div>
            <label className="text-[11px] font-bold text-outline block mb-1">Penandatangan (TTD):</label>
            <select
              value={simPenandatangan}
              onChange={(e) => setSimPenandatangan(e.target.value)}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {PENANDATANGAN_OPTIONS.map((p) => (
                <option key={p.kode} value={p.kode}>
                  {p.nama} ({p.kode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-outline block mb-1">Pilih Klasifikasi:</label>
            <select
              value={simKode}
              onChange={(e) => setSimKode(e.target.value)}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {klasifikasiList.map((k) => (
                <option key={k.kode} value={k.kode}>
                  {k.kode} ({k.nama.slice(0, 24)}...)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-outline block mb-1">Bulan Romawi:</label>
            <select
              value={simBulan}
              onChange={(e) => setSimBulan(e.target.value)}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Settings Form Card */}
      <div className="bg-white rounded-card border border-outline-subtle p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Parameter Format Baku Penomoran Mahkamah Agung
            </h3>
            <p className="text-xs text-outline mt-0.5">
              Rumus: <code className="font-mono text-primary font-bold">(Nomor Urut / Kode Penandatangan / Kode Klasifikasi / Bulan Romawi / Tahun)</code>
            </p>
          </div>
          <span className="text-xs text-outline font-code">SOP MARI-2026</span>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">
                Kode Prefix Satuan Kerja <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Contoh: W13-A12"
                className={`w-full h-10 px-3 rounded-btn border border-outline-subtle font-code font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                  isAdmin ? 'bg-surface' : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
              <p className="text-[11px] text-outline">Kode unik pengadilan dari Mahkamah Agung RI</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Tahun Dinas Aktif</label>
              <input
                type="number"
                required
                disabled={!isAdmin}
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className={`w-full h-10 px-3 rounded-btn border border-outline-subtle font-code font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                  isAdmin ? 'bg-surface' : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Skema Reset Nomor</label>
              <select
                disabled
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-gray-100 text-outline text-xs font-semibold cursor-not-allowed"
              >
                <option>Tahunan (Reset setiap 1 Januari)</option>
              </select>
            </div>
          </div>

          {isAdmin && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-9 px-5 rounded-btn bg-success hover:bg-success-dark text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Simpan Parameter</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Tabel Klasifikasi & Counter Berjalan dengan Kolom Penjelasan & Aksi Admin */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-outline-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-on-surface">Daftar Kode Klasifikasi & Penjelasan Ruang Lingkup</h3>
            <p className="text-xs text-outline">
              Kode dan penjelasan ini digunakan pegawai saat memilih klasifikasi di formulir Surat Keluar.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="self-start sm:self-auto h-8 px-3 rounded-btn bg-primary-light text-primary hover:bg-primary hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Tambah Kode Baru</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase font-semibold">
                <th className="py-3 px-4 w-28">Kode</th>
                <th className="py-3 px-4 w-52">Uraian / Bidang</th>
                <th className="py-3 px-4 min-w-[280px]">Penjelasan Singkat & Ruang Lingkup Surat</th>
                <th className="py-3 px-4 text-center w-24">No. Terakhir</th>
                <th className="py-3 px-4 text-center w-24">Berikutnya</th>
                <th className="py-3 px-4 text-right w-40">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {klasifikasiList.map((k) => (
                <tr key={k.kode} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-code text-primary whitespace-nowrap align-top">
                    <span className="px-2 py-1 rounded bg-primary-light text-primary font-mono font-bold text-xs">
                      {k.kode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface align-top">
                    {k.nama}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant leading-relaxed align-top">
                    <div className="bg-surface/80 p-2.5 rounded-md border border-outline-subtle">
                      <p className="font-medium text-on-surface">
                        {k.penjelasan || <span className="text-outline italic">Belum ada penjelasan ringkas. Silakan klik Edit untuk melengkapi.</span>}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-code font-bold text-on-surface text-center align-top whitespace-nowrap">
                    {k.counter ?? 0}
                  </td>
                  <td className="py-3.5 px-4 font-code font-bold text-success text-center align-top whitespace-nowrap">
                    {(k.counter ?? 0) + 1}
                  </td>
                  <td className="py-3.5 px-4 text-right align-top whitespace-nowrap">
                    {isAdmin ? (
                      <div className="inline-flex items-center gap-1.5">
                        {/* Tombol Counter +/- */}
                        <div className="inline-flex items-center border border-outline-subtle rounded-md overflow-hidden bg-white mr-1 shadow-2xs">
                          <button
                            onClick={() => handleUpdateCounter(k, -1)}
                            className="w-6 h-7 hover:bg-surface flex items-center justify-center font-bold text-xs text-outline hover:text-on-surface"
                            title="Kurangi Counter 1"
                          >
                            -
                          </button>
                          <span className="px-1.5 text-[10px] font-mono text-outline">±</span>
                          <button
                            onClick={() => handleUpdateCounter(k, 1)}
                            className="w-6 h-7 hover:bg-surface flex items-center justify-center font-bold text-xs text-outline hover:text-on-surface"
                            title="Tambah Counter 1"
                          >
                            +
                          </button>
                        </div>

                        {/* Tombol Edit Admin */}
                        <button
                          onClick={() => handleOpenEdit(k)}
                          className="h-7 px-2.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
                          title={`Edit Kode ${k.kode} & Penjelasan`}
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Edit</span>
                        </button>

                        {/* Tombol Hapus Admin */}
                        <button
                          onClick={() => handleDelete(k.kode)}
                          className="h-7 px-2 rounded-md bg-danger-light hover:bg-danger text-danger hover:text-white border border-danger/30 font-bold text-xs flex items-center justify-center transition-colors"
                          title={`Hapus Kode ${k.kode}`}
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-outline italic">Hanya Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Klasifikasi (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-card shadow-xl border border-outline-subtle max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">add_box</span>
                <h3 className="text-base font-bold text-on-surface">Tambah Kode Klasifikasi Baru (Admin)</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Kode Klasifikasi <span className="text-danger">*</span> (misal: OT.01, HM.01)
                </label>
                <input
                  type="text"
                  required
                  value={newKode}
                  onChange={(e) => setNewKode(e.target.value.toUpperCase())}
                  placeholder="Contoh: OT.01"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Nama / Bidang Administrasi <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Contoh: Organisasi & Tata Laksana"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Penjelasan Singkat & Peruntukan Kode <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={newPenjelasan}
                  onChange={(e) => setNewPenjelasan(e.target.value)}
                  placeholder="Jelaskan jenis surat naskah dinas apa saja yang harus menggunakan kode ini (akan muncul saat pegawai memilih kode di Surat Keluar)..."
                  className="w-full p-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs leading-relaxed"
                />
                <p className="text-[11px] text-outline">
                  Penjelasan ini akan tampil otomatis di kolom bawah pilihan kode klasifikasi agar petugas dapat memverifikasi kesesuaian kode.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Counter Awal (Nomor Urut Terakhir)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCounter}
                  onChange={(e) => setNewCounter(e.target.value)}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-2xs"
                >
                  Simpan Kode Klasifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Klasifikasi (Admin) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-card shadow-xl border border-outline-subtle max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">edit_note</span>
                <h3 className="text-base font-bold text-on-surface">Edit Kode Klasifikasi: {editingKode}</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Kode Klasifikasi <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.kode}
                  onChange={(e) => setEditForm({ ...editForm, kode: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Nama / Bidang Administrasi <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Penjelasan Singkat & Peruntukan Kode <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={editForm.penjelasan}
                  onChange={(e) => setEditForm({ ...editForm, penjelasan: e.target.value })}
                  placeholder="Jelaskan cakupan naskah dinas untuk kode ini..."
                  className="w-full p-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs leading-relaxed"
                />
                <p className="text-[11px] text-outline">
                  Penjelasan ini akan tampil otomatis di formulir surat keluar saat pengguna memilih kode ini.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Counter Nomor Terakhir</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editForm.counter}
                  onChange={(e) => setEditForm({ ...editForm, counter: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    handleDelete(editingKode);
                  }}
                  className="h-9 px-3 rounded-btn text-danger hover:bg-danger-light text-xs font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Hapus Kode</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-2xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
