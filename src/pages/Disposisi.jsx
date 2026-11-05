import React, { useState, useEffect } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';
import logoInstansi from '../assets/logo-instansi.png';

export default function Disposisi() {
  const {
    suratMasuk,
    disposisiList,
    saveDisposisi,
    activeLetterId,
    setActiveLetterId,
    currentUser,
    plhConfig,
    showToast,
  } = useSurat();

  const [selectedLetterId, setSelectedLetterId] = useState(activeLetterId || 'SM-001');

  const currentSurat = suratMasuk.find((s) => s.id === selectedLetterId) || suratMasuk[0];
  const existingDisposisi = disposisiList[selectedLetterId];

  // 18 Petunjuk Resmi Mahkamah Agung (Gambar 26 Pedoman Tata Naskah Dinas MARI)
  const OFFICIAL_PETUNJUK = [
    'Setuju sesuai ketentuan yang berlaku',
    'Tolak sesuai ketentuan yang berlaku',
    'Selesaikan sesuai ketentuan yang berlaku',
    'Jawab sesuai ketentuan yang berlaku',
    'Perbaiki',
    'Teliti & pendapat',
    'Sesuai catatan',
    'Untuk perhatian',
    'Untuk diketahui',
    'Edarkan',
    'Bicarakan dengan saya',
    'Bicarakan bersama dan laporkan hasilnya',
    'Dijadwalkan',
    'Simpan',
    'Disiapkan',
    'Ingatkan',
    'Harap dihadiri/diwakili',
    'Asli kepada',
  ];

  // 9 Jabatan Penerima Disposisi Pengadilan Agama Lumajang
  const OFFICIAL_RECIPIENTS = [
    'Wakil Ketua',
    'Panitera',
    'Sekretaris',
    'Panitera Muda Permohonan',
    'Panitera Muda Gugatan',
    'Panitera Muda Hukum',
    'Kasubbag Kepegawaian & Ortala',
    'Kasubbag Perencanaan, TI & Pelaporan',
    'Kasubbag Umum & Keuangan',
  ];

  // State Formulir Disposisi
  const [form, setForm] = useState({
    sifatDisposisi: 'segera', // 'sangat_segera' | 'segera'
    diteruskanKepada: ['Sekretaris', 'Panitera'],
    petunjukPilihan: ['Selesaikan sesuai ketentuan yang berlaku', 'Harap dihadiri/diwakili'],
    isiArahan:
      '1. Hadiri dan wakili pimpinan dalam agenda koordinasi kedinasan.\n2. Siapkan data dukung teknis dan serapan anggaran untuk bahan konsinyir.',
    catatanKhusus: 'Koordinasikan penerbitan Surat Tugas (ST) dan laporkan hasilnya segera.',
    asliKepada: '',
    tanggalKirim: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    diterimaOleh: 'Staf Bagian Umum / TU',
    diajukanKembali: '',
    diterimaTanggal: '',
    tanggalKembali: '',
    diterimaKembaliOleh: '',
  });

  useEffect(() => {
    if (existingDisposisi) {
      setForm({
        sifatDisposisi: existingDisposisi.sifatDisposisi || currentSurat?.sifat || 'segera',
        diteruskanKepada: existingDisposisi.diteruskanKepada || ['Sekretaris'],
        petunjukPilihan: existingDisposisi.instruksiPilihan || existingDisposisi.petunjukPilihan || [
          'Selesaikan sesuai ketentuan yang berlaku',
        ],
        isiArahan: existingDisposisi.isiArahan || '',
        catatanKhusus: existingDisposisi.catatanKhusus || '',
        asliKepada: existingDisposisi.asliKepada || '',
        tanggalKirim:
          existingDisposisi.tanggalKirim ||
          new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        diterimaOleh: existingDisposisi.diterimaOleh || 'Staf Bagian Umum / TU',
        diajukanKembali: existingDisposisi.diajukanKembali || '',
        diterimaTanggal: existingDisposisi.diterimaTanggal || '',
        tanggalKembali: existingDisposisi.tanggalKembali || '',
        diterimaKembaliOleh: existingDisposisi.diterimaKembaliOleh || '',
      });
    } else {
      setForm({
        sifatDisposisi: currentSurat?.sifat === 'sangat_segera' ? 'sangat_segera' : 'segera',
        diteruskanKepada: ['Sekretaris'],
        petunjukPilihan: ['Selesaikan sesuai ketentuan yang berlaku'],
        isiArahan: `Mohon diteliti dan diselesaikan sesuai ketentuan naskah dinas resmi terkait ${currentSurat?.perihal || ''}.`,
        catatanKhusus: '',
        asliKepada: '',
        tanggalKirim: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        diterimaOleh: 'Staf Bagian Umum / TU',
        diajukanKembali: '',
        diterimaTanggal: '',
        tanggalKembali: '',
        diterimaKembaliOleh: '',
      });
    }
  }, [selectedLetterId, existingDisposisi, currentSurat]);

  const toggleForwardRecipient = (name) => {
    setForm((prev) => {
      const exists = prev.diteruskanKepada.includes(name);
      return {
        ...prev,
        diteruskanKepada: exists
          ? prev.diteruskanKepada.filter((x) => x !== name)
          : [...prev.diteruskanKepada, name],
      };
    });
  };

  const togglePetunjuk = (petunjuk) => {
    setForm((prev) => {
      const exists = prev.petunjukPilihan.includes(petunjuk);
      return {
        ...prev,
        petunjukPilihan: exists
          ? prev.petunjukPilihan.filter((x) => x !== petunjuk)
          : [...prev.petunjukPilihan, petunjuk],
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (form.diteruskanKepada.length === 0) {
      showToast('Pilih minimal satu jabatan penerima disposisi', 'warning');
      return;
    }
    saveDisposisi(selectedLetterId, {
      ...form,
      instruksiPilihan: form.petunjukPilihan,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Disposisi Surat Masuk</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Standar Gambar 26 SEKMA RI</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Lembar Disposisi Surat Masuk
          </h2>
          <p className="text-xs md:text-sm text-outline">
            Pemberian arahan pimpinan sesuai format baku Mahkamah Agung RI dengan Kop Surat resmi Pengadilan Agama Lumajang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pilihan Surat */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-outline">Pilih Surat:</span>
            <select
              value={selectedLetterId}
              onChange={(e) => {
                setSelectedLetterId(e.target.value);
                setActiveLetterId(e.target.value);
              }}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {suratMasuk.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nomorSurat} - {s.asalSurat?.slice(0, 24)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            title="Cetak lembar disposisi resmi format A4"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Lembar Disposisi</span>
          </button>
        </div>
      </div>

      {/* Info Card Surat Terpilih */}
      <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs relative overflow-hidden no-print">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-code text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded">
                Agenda: {currentSurat?.agenda}
              </span>
              <span className="font-code text-xs font-bold text-on-surface">
                No. Surat: {currentSurat?.nomorSurat}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-warning-light text-amber-900 border border-warning/40">
                Sifat: {currentSurat?.sifat}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-on-surface">
              {currentSurat?.perihal}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-outline">
              <span>
                Pengirim: <strong className="text-on-surface">{currentSurat?.asalSurat}</strong>
              </span>
              <span>•</span>
              <span>
                Tgl Surat: <strong className="text-on-surface">{currentSurat?.tanggalSurat}</strong>
              </span>
              <span>•</span>
              <span>
                Lampiran: <strong className="text-on-surface">{currentSurat?.lampiran}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showToast(`Membuka pindaian warkat: ${currentSurat?.nomorSurat || ''}...`, 'info');
                openWarkatPreview(currentSurat);
              }}
              className="h-9 px-3.5 rounded-btn bg-surface border border-outline-subtle text-primary font-semibold text-xs flex items-center gap-1.5 hover:bg-primary-light active:scale-[0.98] transition-all shadow-2xs"
              title="Buka pindaian naskah dinas pada tab baru"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Lihat Scan Warkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Formulir Arahan Disposisi (Kiri) & Pratinjau Standar Gambar 26 SEKMA (Kanan) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* SISI KIRI: Formulir Arahan Disposisi (5 Kolom) */}
        <section className="xl:col-span-5 bg-white rounded-card border border-outline-subtle shadow-2xs p-5 md:p-6 space-y-5 no-print">
          <div className="flex items-center justify-between border-b border-outline-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">draw</span>
              <h3 className="text-base font-bold text-on-surface">Formulir Disposisi Pimpinan</h3>
            </div>
            <span className="text-xs text-outline font-code">
              Agenda: {currentSurat?.agenda}
            </span>
          </div>

          {plhConfig?.isActive && (
            <div className="p-3 rounded-lg bg-warning-light/80 border border-warning/50 text-amber-950 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-[18px]">shield</span>
                <span>
                  Penandatangan: <strong>{plhConfig.pejabatPlh.name}</strong> (
                  {plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'})
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Sifat Disposisi (SANGAT SEGERA vs SEGERA) */}
            <div>
              <label className="font-bold text-on-surface block mb-1.5">
                Tingkat Kecepatan Disposisi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, sifatDisposisi: 'sangat_segera' })}
                  className={`h-9 px-3 rounded-btn border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    form.sifatDisposisi === 'sangat_segera'
                      ? 'bg-danger text-white border-danger shadow-xs'
                      : 'bg-surface text-on-surface border-outline-subtle hover:bg-surface-low'
                  }`}
                >
                  <span>{form.sifatDisposisi === 'sangat_segera' ? '☑' : '☐'}</span>
                  <span>SANGAT SEGERA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, sifatDisposisi: 'segera' })}
                  className={`h-9 px-3 rounded-btn border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    form.sifatDisposisi === 'segera'
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface text-on-surface border-outline-subtle hover:bg-surface-low'
                  }`}
                >
                  <span>{form.sifatDisposisi === 'segera' ? '☑' : '☐'}</span>
                  <span>SEGERA</span>
                </button>
              </div>
            </div>

            {/* Disposisi Kepada (9 Jabatan Resmi) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-on-surface">Disposisi Kepada:</label>
                <span className="text-[11px] text-primary font-semibold">
                  {form.diteruskanKepada.length} dipilih
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-lg border border-outline-subtle bg-surface/50 max-h-48 overflow-y-auto">
                {OFFICIAL_RECIPIENTS.map((rec) => {
                  const isChecked = form.diteruskanKepada.includes(rec);
                  return (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => toggleForwardRecipient(rec)}
                      className={`px-2.5 py-1.5 rounded text-left text-xs font-medium flex items-center gap-2 transition-all ${
                        isChecked
                          ? 'bg-primary text-white font-bold'
                          : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
                      }`}
                    >
                      <span className="text-xs">{isChecked ? '☑' : '☐'}</span>
                      <span className="truncate">{rec}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Petunjuk Resmi MARI (18 Petunjuk Gambar 26) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-on-surface">Petunjuk Standar Mahkamah Agung:</label>
                <span className="text-[11px] text-primary font-semibold">
                  {form.petunjukPilihan.length} dipilih
                </span>
              </div>
              <div className="space-y-1 p-2 rounded-lg border border-outline-subtle bg-surface/50 max-h-56 overflow-y-auto">
                {OFFICIAL_PETUNJUK.map((petunjuk) => {
                  const isChecked = form.petunjukPilihan.includes(petunjuk);
                  const isAsli = petunjuk === 'Asli kepada';
                  return (
                    <div key={petunjuk} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => togglePetunjuk(petunjuk)}
                        className={`w-full px-2.5 py-1.5 rounded text-left text-xs flex items-center gap-2 transition-all ${
                          isChecked
                            ? 'bg-primary-light text-primary font-bold border border-primary/40'
                            : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
                        }`}
                      >
                        <span className="text-xs">{isChecked ? '☑' : '☐'}</span>
                        <span className="flex-1">{petunjuk}</span>
                      </button>
                      {isAsli && isChecked && (
                        <input
                          type="text"
                          placeholder="Ketik penerima naskah asli..."
                          value={form.asliKepada}
                          onChange={(e) => setForm({ ...form, asliKepada: e.target.value })}
                          className="w-full h-8 px-2.5 text-xs rounded border border-primary/40 bg-white text-on-surface outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan Arahan Khusus Pimpinan */}
            <div>
              <label className="font-bold text-on-surface block mb-1">
                Catatan / Arahan Tertulis Pimpinan:
              </label>
              <textarea
                rows={4}
                value={form.isiArahan}
                onChange={(e) => setForm({ ...form, isiArahan: e.target.value })}
                placeholder="Tuliskan arahan dan tindak lanjut konkret..."
                className="w-full p-2.5 text-xs rounded border border-outline-subtle bg-surface text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Bagian Pelacakan & Pengiriman Proses */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-subtle">
              <div>
                <label className="text-[11px] font-semibold text-outline block mb-0.5">
                  Tanggal Kirim:
                </label>
                <input
                  type="text"
                  value={form.tanggalKirim}
                  onChange={(e) => setForm({ ...form, tanggalKirim: e.target.value })}
                  className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-outline block mb-0.5">
                  Diterima Oleh:
                </label>
                <input
                  type="text"
                  value={form.diterimaOleh}
                  onChange={(e) => setForm({ ...form, diterimaOleh: e.target.value })}
                  className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface"
                />
              </div>
            </div>

            {/* Tombol Simpan & Tanda Tangani */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Simpan & Sahkan Disposisi (TTE)</span>
              </button>
            </div>
          </form>
        </section>

        {/* SISI KANAN: Pratinjau Lembar Disposisi Format Gambar 26 SEKMA RI (7 Kolom) */}
        <section className="xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between no-print">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <span>Pratinjau Lembar Disposisi Resmi (Format Gambar 26 SEKMA RI)</span>
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-success-light text-success border border-success/30">
              Format Standar Baku MARI
            </span>
          </div>

          {/* DOCKET SHEET RESMI: REPRODUKSI PERSIS GAMBAR 26 */}
          <div className="print-clean bg-white border-2 border-black text-black font-serif text-[11px] leading-tight shadow-md">
            {/* 1. KOP SURAT PENGADILAN AGAMA LUMAJANG DENGAN LOGO */}
            <div className="border-b border-black p-4 flex items-center justify-center gap-4">
              <img
                src={logoInstansi}
                alt="Logo Pengadilan Agama Lumajang"
                className="w-20 h-20 object-contain shrink-0"
              />
              <div className="flex-1 text-center text-black" style={{ lineHeight: '1.15' }}>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  MAHKAMAH AGUNG REPUBLIK INDONESIA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  DIREKTORAT JENDERAL BADAN PERADILAN AGAMA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  PENGADILAN TINGGI AGAMA SURABAYA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  PENGADILAN AGAMA LUMAJANG
                </div>
                <div style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: '3px 0 0 0', padding: 0 }} className="text-neutral-900 font-sans">
                  Jalan Soekarno Hatta Nomor 11, Selokbesuki, Sukodono, Lumajang, Jawa Timur 67352
                </div>
                <div style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: 0, padding: 0 }} className="text-neutral-900 font-sans">
                  www.pa-lumajang.go.id, email: pa.lumajang@gmail.com, telepon (0334) 8781874
                </div>
              </div>
            </div>

            {/* 2. JUDUL LEMBAR DISPOSISI */}
            <div className="border-b border-black py-1.5 text-center font-bold text-sm sm:text-base tracking-widest uppercase font-serif">
              LEMBAR DISPOSISI
            </div>

            {/* 3. PERINGATAN / PERHATIAN */}
            <div className="border-b border-black py-1 px-3 text-center font-bold text-[10px] sm:text-[10.5px] font-sans">
              PERHATIAN: Dilarang memisahkan sehelai Naskah Dinas pun yang tergabung dalam berkas ini.
            </div>

            {/* 4. GRID METADATA NASKAH DINAS (3 Kolom Sesuai Format Referensi) */}
            <div className="grid grid-cols-12 border-b border-black font-sans text-[11px]">
              {/* Kolom 1 (Kiri) */}
              <div className="col-span-5 p-2 border-r border-black space-y-1">
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Nomor Naskah Dinas</span>
                  <span className="mr-1.5">:</span>
                  <span className="font-bold font-code break-all">{currentSurat?.nomorSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Tanggal Naskah Dinas</span>
                  <span className="mr-1.5">:</span>
                  <span>{currentSurat?.tanggalSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Lampiran</span>
                  <span className="mr-1.5">:</span>
                  <span className="truncate">{currentSurat?.lampiran || '-'}</span>
                </div>
              </div>

              {/* Kolom 2 (Tengah) */}
              <div className="col-span-3 p-2 border-r border-black space-y-1">
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Status</span>
                  <span className="mr-1">:</span>
                  <span>{currentSurat?.status || 'Didisposisi'}</span>
                </div>
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Sifat</span>
                  <span className="mr-1">:</span>
                  <span className="uppercase font-semibold">{form.sifatDisposisi.replace('_', ' ')}</span>
                </div>
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Jenis</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{currentSurat?.jenisSurat || 'Surat Dinas'}</span>
                </div>
              </div>

              {/* Kolom 3 (Kanan) */}
              <div className="col-span-4 p-2 space-y-1">
                <div className="flex">
                  <span className="w-32 font-semibold shrink-0">Diterima Tanggal</span>
                  <span className="mr-1.5">:</span>
                  <span>{currentSurat?.tanggalTerima?.slice(0, 10) || currentSurat?.tanggalSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold shrink-0">Nomor Agenda</span>
                  <span className="mr-1.5">:</span>
                  <span className="font-bold font-code text-black">{currentSurat?.agenda}</span>
                </div>
              </div>
            </div>

            {/* DARI & HAL */}
            <div className="border-b border-black p-2 font-sans text-[11px] space-y-1">
              <div className="flex">
                <span className="w-16 font-semibold shrink-0">Dari</span>
                <span className="mr-1.5">:</span>
                <span className="font-bold">{currentSurat?.asalSurat}</span>
              </div>
              <div className="flex">
                <span className="w-16 font-semibold shrink-0">Hal</span>
                <span className="mr-1.5">:</span>
                <span className="font-medium leading-snug">{currentSurat?.perihal}</span>
              </div>
            </div>

            {/* 5. CHECKBOX SIFAT: SANGAT SEGERA vs SEGERA */}
            <div className="grid grid-cols-2 border-b border-black font-sans text-xs font-bold text-center">
              <div className="p-1.5 border-r border-black flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border border-black text-xs leading-none text-center font-bold">
                  {form.sifatDisposisi === 'sangat_segera' ? '✓' : ''}
                </span>
                <span>SANGAT SEGERA</span>
              </div>
              <div className="p-1.5 flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border border-black text-xs leading-none text-center font-bold">
                  {form.sifatDisposisi === 'segera' ? '✓' : ''}
                </span>
                <span>SEGERA</span>
              </div>
            </div>

            {/* 6. MAIN BODY (Kiri: DISPOSISI KEPADA + CATATAN, Kanan: 18 PETUNJUK) */}
            <div className="grid grid-cols-12 border-b border-black font-sans text-[11px]">
              {/* Kolom Kiri: DISPOSISI KEPADA (Atas) & CATATAN (Bawah) */}
              <div className="col-span-5 border-r border-black flex flex-col justify-between">
                {/* DISPOSISI KEPADA */}
                <div className="p-2.5 space-y-1.5">
                  <div className="font-bold underline text-xs mb-2">DISPOSISI KEPADA:</div>
                  {OFFICIAL_RECIPIENTS.map((rec) => {
                    const isChecked = form.diteruskanKepada.includes(rec);
                    return (
                      <div key={rec} className="flex items-center gap-2 leading-tight">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold shrink-0">
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className={isChecked ? 'font-bold' : 'text-neutral-800'}>
                          {rec}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CATATAN PIMPINAN */}
                <div className="border-t border-black p-2.5 min-h-[140px] flex-1 flex flex-col">
                  <div className="font-bold underline text-xs mb-1.5">CATATAN:</div>
                  <div className="whitespace-pre-line text-[11px] font-medium text-black leading-relaxed flex-1">
                    {form.isiArahan || 'Mohon ditindaklanjuti sesuai ketentuan yang berlaku.'}
                    {form.catatanKhusus && (
                      <div className="mt-2 text-neutral-700 italic border-t border-neutral-300 pt-1">
                        Catatan: {form.catatanKhusus}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: PETUNJUK RESMI (18 Item Sesuai Format Gambar 26) */}
              <div className="col-span-7 p-2.5 space-y-1.5">
                <div className="font-bold underline text-xs mb-2">PETUNJUK:</div>
                {OFFICIAL_PETUNJUK.map((petunjuk) => {
                  const isChecked = form.petunjukPilihan.includes(petunjuk);
                  const isAsli = petunjuk === 'Asli kepada';
                  return (
                    <div key={petunjuk} className="flex items-center gap-2 leading-tight">
                      <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold shrink-0">
                        {isChecked ? '✓' : ''}
                      </span>
                      <span className={isChecked ? 'font-bold' : 'text-neutral-800'}>
                        {petunjuk}
                        {isAsli && (
                          <span className="ml-1 text-neutral-800 underline font-normal">
                            {form.asliKepada ? ` ${form.asliKepada}` : ' .........................'}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. KISI ALUR PROSES & PENERIMAAN (4 Kotak Bawah Sesuai Gambar 26) */}
            {/* Baris Bawah 1 */}
            <div className="grid grid-cols-2 border-b border-black font-sans text-[10.5px]">
              <div className="p-2 border-r border-black space-y-1">
                <div>
                  Tanggal Kirim untuk Proses :{' '}
                  <span className="font-semibold">{form.tanggalKirim || '-'}</span>
                </div>
                <div>
                  Diterima Oleh :{' '}
                  <span className="font-semibold">{form.diterimaOleh || '-'}</span>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div>
                  Diajukan Kembali Tanggal :{' '}
                  <span className="font-semibold">{form.diajukanKembali || '...........................'}</span>
                </div>
                <div>
                  Diterima Tanggal :{' '}
                  <span className="font-semibold">{form.diterimaTanggal || '...........................'}</span>
                </div>
              </div>
            </div>

            {/* Baris Bawah 2: Tanggal Selesai & Pengesahan Pimpinan */}
            <div className="grid grid-cols-2 font-sans text-[10.5px]">
              <div className="p-2 border-r border-black space-y-1">
                <div>
                  Tanggal Kembali untuk Proses :{' '}
                  <span className="font-semibold">{form.tanggalKembali || '...........................'}</span>
                </div>
                <div>
                  Diterima Oleh :{' '}
                  <span className="font-semibold">{form.diterimaKembaliOleh || '...........................'}</span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <div>
                  Tanggal selesai dari {plhConfig?.isActive ? 'Plh. Ketua' : 'Ketua'} :{' '}
                  <span className="font-semibold">
                    {existingDisposisi?.tanggalDisposisi?.slice(0, 10) || form.tanggalKirim || '...........................'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
