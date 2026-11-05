import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function PengaturanNomor() {
  const { nomorConfig, setNomorConfig, showToast } = useSurat();

  const [prefix, setPrefix] = useState(nomorConfig.kodePrefix);
  const [tahun, setTahun] = useState(nomorConfig.tahun);
  const [klasifikasiList, setKlasifikasiList] = useState(nomorConfig.klasifikasi);

  // New Classification Form
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newCounter, setNewCounter] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Simulator State
  const [simKode, setSimKode] = useState('HK.01');
  const [simBulan, setSimBulan] = useState('X');

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setNomorConfig({
      ...nomorConfig,
      kodePrefix: prefix,
      tahun: Number(tahun),
      klasifikasi: klasifikasiList,
    });
    showToast('Konfigurasi tata penomoran surat berhasil diperbarui.', 'success');
  };

  const handleAddKlasifikasi = (e) => {
    e.preventDefault();
    if (!newKode || !newNama) {
      showToast('Harap lengkapi kode dan nama klasifikasi', 'warning');
      return;
    }
    const updated = [...klasifikasiList, { kode: newKode, nama: newNama, counter: Number(newCounter) }];
    setKlasifikasiList(updated);
    setNomorConfig({ ...nomorConfig, klasifikasi: updated });
    setNewKode('');
    setNamaKlasifikasi('');
    setNewCounter(1);
    setShowAddModal(false);
    showToast(`Klasifikasi baru ${newKode} berhasil ditambahkan.`, 'success');
  };

  const handleUpdateCounter = (kode, delta) => {
    const updated = klasifikasiList.map((k) => {
      if (k.kode === kode) {
        return { ...k, counter: Math.max(0, k.counter + delta) };
      }
      return k;
    });
    setKlasifikasiList(updated);
    setNomorConfig({ ...nomorConfig, klasifikasi: updated });
    showToast(`Counter ${kode} berhasil diperbarui.`);
  };

  const simTarget = klasifikasiList.find((k) => k.kode === simKode) || klasifikasiList[0];
  const simGeneratedNumber = `${prefix}/${(simTarget?.counter || 0) + 1}/${simKode}/${simBulan}/${tahun}`;

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
            <span>Penomoran Otomatis</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Pengaturan Nomor Surat</h2>
          <p className="text-xs md:text-sm text-outline">
            Konfigurasi format penomoran naskah dinas keluar, kode klasifikasi perkara, dan counter nomor urut otomatis.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Tambah Klasifikasi Kode</span>
          </button>
        </div>
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
            Hasil di atas adalah pratinjau nomor resmi berikutnya yang akan digenerate saat atasan menyetujui surat keluar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div>
            <label className="text-[11px] font-bold text-outline block mb-1">Pilih Klasifikasi:</label>
            <select
              value={simKode}
              onChange={(e) => setSimKode(e.target.value)}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {klasifikasiList.map((k) => (
                <option key={k.kode} value={k.kode}>
                  {k.kode} ({k.nama.slice(0, 20)}...)
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
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            Parameter Format Baku Penomoran Mahkamah Agung
          </h3>
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
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Contoh: W13-A12"
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface font-code font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-[11px] text-outline">Kode unik pengadilan dari Mahkamah Agung RI</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Tahun Dinas Aktif</label>
              <input
                type="number"
                required
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface font-code font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-9 px-5 rounded-btn bg-success hover:bg-success-dark text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Simpan Parameter</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Klasifikasi & Counter Berjalan */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-outline-subtle flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">Daftar Kode Klasifikasi & Counter Berjalan</h3>
            <p className="text-xs text-outline">Nomor urut otomatis akan menggunakan counter ini sebagai acuan</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase font-semibold">
                <th className="py-3 px-4">Kode Klasifikasi</th>
                <th className="py-3 px-4">Uraian / Bidang Administrasi</th>
                <th className="py-3 px-4">Nomor Urut Terakhir</th>
                <th className="py-3 px-4">Nomor Berikutnya</th>
                <th className="py-3 px-4 text-right">Penyesuaian Counter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {klasifikasiList.map((k) => (
                <tr key={k.kode} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-code text-primary whitespace-nowrap">
                    {k.kode}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    {k.nama}
                  </td>
                  <td className="py-3.5 px-4 font-code font-bold text-on-surface">
                    {k.counter}
                  </td>
                  <td className="py-3.5 px-4 font-code font-bold text-success">
                    {k.counter + 1}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateCounter(k.kode, -1)}
                        className="w-7 h-7 rounded border border-outline-subtle bg-white hover:bg-surface flex items-center justify-center font-bold text-xs"
                        title="Kurangi 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateCounter(k.kode, 1)}
                        className="w-7 h-7 rounded border border-outline-subtle bg-white hover:bg-surface flex items-center justify-center font-bold text-xs"
                        title="Tambah 1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Klasifikasi */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-card shadow-xl border border-outline-subtle max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
              <h3 className="text-base font-bold text-on-surface">Tambah Kode Klasifikasi Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddKlasifikasi} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Kode Klasifikasi (misal: OT.01)</label>
                <input
                  type="text"
                  required
                  value={newKode}
                  onChange={(e) => setNewKode(e.target.value.toUpperCase())}
                  placeholder="OT.01"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Nama / Deskripsi Bidang</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Organisasi & Tata Kelola"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Counter Awal</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newCounter}
                  onChange={(e) => setNewCounter(e.target.value)}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code font-bold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-dark"
                >
                  Simpan Klasifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
