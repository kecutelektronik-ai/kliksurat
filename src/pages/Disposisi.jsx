import React, { useState, useEffect } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';

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

  const [form, setForm] = useState({
    sifatDisposisi: 'segera',
    diteruskanKepada: ['Sekretaris', 'Panitera'],
    instruksiPilihan: ['Tanggapi & tindak lanjuti', 'Hadiri / Wakili'],
    isiArahan:
      '1. Hadiri dan wakili pimpinan dalam agenda Rapat Koordinasi Wilayah PTA Surabaya tanggal 24 Oktober 2026.\n2. Siapkan rekapitulasi data perkara e-Court dan serapan anggaran DIPA 01 & 04 untuk bahan pemaparan resmi.',
    catatanKhusus:
      'Laporkan hasil rakor segera setelah kegiatan selesai dan koordinasikan penerbitan Surat Tugas (ST).',
  });

  useEffect(() => {
    if (existingDisposisi) {
      setForm({
        sifatDisposisi: existingDisposisi.sifatDisposisi || 'segera',
        diteruskanKepada: existingDisposisi.diteruskanKepada || ['Sekretaris'],
        instruksiPilihan: existingDisposisi.instruksiPilihan || ['Tanggapi & tindak lanjuti'],
        isiArahan: existingDisposisi.isiArahan || '',
        catatanKhusus: existingDisposisi.catatanKhusus || '',
      });
    } else {
      setForm({
        sifatDisposisi: currentSurat?.sifat || 'segera',
        diteruskanKepada: ['Sekretaris'],
        instruksiPilihan: ['Tanggapi & tindak lanjuti'],
        isiArahan: `Mohon ditindaklanjuti sesuai ketentuan naskah dinas resmi terkait ${currentSurat?.perihal || ''}.`,
        catatanKhusus: '',
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

  const toggleInstruction = (instruction) => {
    setForm((prev) => {
      const exists = prev.instruksiPilihan.includes(instruction);
      return {
        ...prev,
        instruksiPilihan: exists
          ? prev.instruksiPilihan.filter((x) => x !== instruction)
          : [...prev.instruksiPilihan, instruction],
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (form.diteruskanKepada.length === 0) {
      showToast('Pilih minimal satu pejabat penerima disposisi', 'warning');
      return;
    }
    saveDisposisi(selectedLetterId, form);
  };

  const RECIPIENT_OPTIONS = [
    { name: 'Sekretaris', official: 'Bpk. H. M. Ridwan, S.H.', unit: 'Kesekretariatan' },
    { name: 'Panitera', official: 'Ibu Dra. Hj. Nurjanah, M.H.', unit: 'Kepaniteraan Perkara' },
    { name: 'Wakil Ketua', official: 'Drs. H. Syamsul Hadi, M.H.', unit: 'Pimpinan / Pengawasan' },
    { name: 'Panitera Muda Hukum', official: 'Ahmad Fauzi, S.H.', unit: 'Dokumentasi & Laporan' },
    { name: 'Panitera Muda Gugatan', official: 'H. Suwandi, S.H.', unit: 'Administrasi Gugatan' },
    { name: 'Kasubbag Kepegawaian', official: 'Siti Aminah, S.E.', unit: 'Kepegawaian & Ortala' },
  ];

  const STANDARD_INSTRUCTIONS = [
    'Tanggapi & tindak lanjuti',
    'Hadiri / Wakili',
    'Koordinasikan',
    'Teliti & siapkan bahan',
    'Simpan / Arsipkan',
    'Jadwalkan dalam agenda',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Disposisi Surat</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Format Standar SEKMA RI</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Disposisi Surat Masuk</h2>
          <p className="text-xs md:text-sm text-outline">
            Pemberian arahan pimpinan, lembar kendali disposisi resmi, dan penyerahan berkas naskah dinas yudisial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Surat Selector Dropdown */}
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
                  {s.nomorSurat} - {s.asalSurat.slice(0, 20)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-btn bg-white border border-outline-subtle hover:bg-surface text-on-surface text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
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
              <span>Pengirim: <strong className="text-on-surface">{currentSurat?.asalSurat}</strong></span>
              <span>•</span>
              <span>Tgl Surat: <strong className="text-on-surface">{currentSurat?.tanggalSurat}</strong></span>
              <span>•</span>
              <span>Lampiran: <strong className="text-on-surface">{currentSurat?.lampiran}</strong></span>
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

      {/* Bento Grid: Form Arahan (Left) & Pratinjau Lembar Disposisi SEKMA RI (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Form Arahan Disposisi (6 cols) */}
        <section className="xl:col-span-6 bg-white rounded-card border border-outline-subtle shadow-2xs p-5 md:p-6 space-y-5 no-print">
          <div className="flex items-center justify-between border-b border-outline-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">draw</span>
              <h3 className="text-base font-bold text-on-surface">Formulir Arahan Disposisi Pimpinan</h3>
            </div>
            <span className="text-xs text-outline font-code">
              Lembar Kendali No: {existingDisposisi?.nomorLembar || `LK-${currentSurat?.id.replace('SM-', '')}`}
            </span>
          </div>

          {plhConfig?.isActive && (
            <div className="p-3 rounded-lg bg-warning-light/80 border border-warning/50 text-amber-950 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-800 font-bold">how_to_reg</span>
                <span>
                  <strong>Plh. Ketua Aktif:</strong> Mandat disposisi dijalankan oleh {plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'} (<strong>{plhConfig.pejabatPlh?.name}</strong>) selama {plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Ketua & Wakil Ketua berhalangan bersamaan' : 'Ketua cuti'}.
                </span>
              </div>
              <span className="font-code font-bold text-[10px] bg-warning px-1.5 py-0.5 rounded text-slate-950 shrink-0">
                {plhConfig.nomorSK}
              </span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
            {/* Diteruskan Kepada */}
            <div className="space-y-2">
              <label className="block font-bold text-on-surface">
                Diteruskan Kepada Yth:
                <span className="text-xs font-normal text-outline ml-1">(Pilih satu atau lebih)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RECIPIENT_OPTIONS.map((rec) => {
                  const isChecked = form.diteruskanKepada.includes(rec.name);
                  return (
                    <label
                      key={rec.name}
                      onClick={() => toggleForwardRecipient(rec.name)}
                      className={`p-2.5 rounded-btn border cursor-pointer flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'border-primary bg-primary-light/50 text-primary font-semibold shadow-2xs'
                          : 'border-outline-subtle bg-white hover:bg-surface text-on-surface'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-primary focus:ring-primary"
                      />
                      <div className="text-xs">
                        <div className="font-bold">{rec.name}</div>
                        <div className="text-[11px] text-outline font-normal">{rec.official}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sifat Disposisi */}
            <div className="space-y-1">
              <label className="block font-bold text-on-surface">Sifat Disposisi</label>
              <select
                value={form.sifatDisposisi}
                onChange={(e) => setForm({ ...form, sifatDisposisi: e.target.value })}
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="biasa">Biasa (Standar SOP)</option>
                <option value="segera">Segera (2 x 24 Jam)</option>
                <option value="sangat_segera">Sangat Segera (Hari Ini)</option>
                <option value="rahasia">Rahasia (Terbatas)</option>
              </select>
            </div>

            {/* Instruksi Standar MARI */}
            <div className="space-y-2">
              <label className="block font-bold text-on-surface">
                Instruksi Standar Sekretaris Mahkamah Agung RI:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STANDARD_INSTRUCTIONS.map((inst) => {
                  const isSelected = form.instruksiPilihan.includes(inst);
                  return (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => toggleInstruction(inst)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-surface border border-outline-subtle text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isSelected ? 'check' : 'add'}
                      </span>
                      <span>{inst}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Isi Arahan Pimpinan */}
            <div className="space-y-1">
              <label className="block font-bold text-on-surface">
                Isi / Petunjuk Arahan Pimpinan:
              </label>
              <textarea
                rows="4"
                required
                value={form.isiArahan}
                onChange={(e) => setForm({ ...form, isiArahan: e.target.value })}
                placeholder="Tuliskan petunjuk khusus pelaksanaan naskah dinas resmi..."
                className="w-full p-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Catatan Khusus */}
            <div className="space-y-1">
              <label className="block font-bold text-on-surface">Catatan Tambahan:</label>
              <input
                type="text"
                value={form.catatanKhusus}
                onChange={(e) => setForm({ ...form, catatanKhusus: e.target.value })}
                placeholder="misal: Laporkan hasil kegiatan segera setelah selesai..."
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-outline-subtle flex justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-6 rounded-btn bg-primary hover:bg-primary-dark text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Teruskan Surat & Sahkan Disposisi</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right: Pratinjau Lembar Disposisi Standar SEKMA RI (6 cols & print-area) */}
        <section className="xl:col-span-6 space-y-3">
          <div className="flex items-center justify-between no-print px-1">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">description</span>
              Pratinjau Lembar Disposisi Resmi (Format SEKMA RI)
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-success-light text-success border border-success/30">
              Dokumen Sah Digital
            </span>
          </div>

          {/* DOCKET SHEET CONTAINER (Authentic Court Style) */}
          <div className="print-clean bg-white rounded-card border-2 border-black/80 shadow-md p-6 sm:p-8 text-black relative font-sans text-xs">
            {/* Watermark Logo Peradilan */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden select-none">
              <span className="material-symbols-outlined text-[360px]">balance</span>
            </div>

            {/* KOP RESMI */}
            <div className="border-b-2 border-black pb-3 mb-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="material-symbols-outlined text-black text-[34px]">balance</span>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black">
                    Mahkamah Agung Republik Indonesia
                  </h4>
                  <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                    Pengadilan Agama Lamongan Kelas I-A
                  </h5>
                  <p className="text-[10px] text-gray-700">
                    Jl. Panglima Sudirman No. 42, Telp. (0322) 321154, Lamongan - Jawa Timur
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1 border-t border-black/40 flex justify-center">
                <span className="text-xs font-extrabold tracking-widest uppercase px-4 py-0.5 border border-black bg-gray-50">
                  {plhConfig?.isActive
                    ? 'LEMBAR DISPOSISI PLH. KETUA PENGADILAN'
                    : 'LEMBAR DISPOSISI KETUA PENGADILAN'}
                </span>
              </div>
            </div>

            {/* GRID DOKUMEN RESMI MAHKAMAH AGUNG */}
            <div className="border border-black rounded-xs overflow-hidden mb-4">
              {/* Row 1: Nomor Agenda & Sifat */}
              <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                <div className="col-span-6 p-2 border-r border-black">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Nomor Agenda / Registrasi:</span>
                  <span className="font-code font-extrabold text-sm text-black">
                    {currentSurat?.agenda}
                  </span>
                </div>
                <div className="col-span-6 p-2">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Tingkat Keamanan / Sifat:</span>
                  <span className="font-extrabold text-xs text-red-700 uppercase">
                    {form.sifatDisposisi.toUpperCase()} / PRIORITAS
                  </span>
                </div>
              </div>

              {/* Row 2: Tanggal Terima & Nomor Surat */}
              <div className="grid grid-cols-12 border-b border-black">
                <div className="col-span-6 p-2 border-r border-black">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Tanggal Penerimaan:</span>
                  <span className="font-semibold text-black">{currentSurat?.tanggalTerima?.replace('T', ' ')} WIB</span>
                </div>
                <div className="col-span-6 p-2">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Nomor Surat Asal:</span>
                  <span className="font-bold text-black font-code">{currentSurat?.nomorSurat}</span>
                </div>
              </div>

              {/* Row 3: Tanggal Surat & Asal Pengirim */}
              <div className="grid grid-cols-12 border-b border-black">
                <div className="col-span-6 p-2 border-r border-black">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Tanggal Surat Masuk:</span>
                  <span className="font-semibold text-black">{currentSurat?.tanggalSurat}</span>
                </div>
                <div className="col-span-6 p-2">
                  <span className="text-[10px] uppercase font-bold text-gray-600 block">Asal Instansi Pengirim:</span>
                  <span className="font-bold text-black">{currentSurat?.asalSurat}</span>
                </div>
              </div>

              {/* Row 4: Perihal */}
              <div className="p-2 border-b border-black bg-gray-50">
                <span className="text-[10px] uppercase font-bold text-gray-600 block">Perihal / Ringkasan Isi Naskah:</span>
                <p className="font-bold text-black mt-0.5 leading-snug">{currentSurat?.perihal}</p>
              </div>

              {/* Row 5: Diteruskan Kepada Matriks */}
              <div className="p-2.5 border-b border-black">
                <span className="text-[10px] uppercase font-extrabold text-black block mb-1.5">
                  DITERUSKAN KEPADA YTH:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {RECIPIENT_OPTIONS.map((rec) => {
                    const isChecked = form.diteruskanKepada.includes(rec.name);
                    return (
                      <div key={rec.name} className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold ${isChecked ? 'bg-black text-white' : ''}`}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className={isChecked ? 'font-bold text-black' : 'text-gray-700'}>
                          {rec.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Instruksi Standar MARI */}
              <div className="p-2.5 border-b border-black bg-gray-50">
                <span className="text-[10px] uppercase font-extrabold text-black block mb-1.5">
                  DISPOSISI / PETUNJUK STANDAR SEKMA RI:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {STANDARD_INSTRUCTIONS.map((inst) => {
                    const isChecked = form.instruksiPilihan.includes(inst);
                    return (
                      <div key={inst} className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold ${isChecked ? 'bg-black text-white' : ''}`}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className={isChecked ? 'font-bold text-black' : 'text-gray-700'}>
                          {inst}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Catatan Khusus & Arahan */}
              <div className="p-3">
                <span className="text-[10px] uppercase font-extrabold text-black block mb-1">
                  CATATAN / ARAHAN KHUSUS PIMPINAN:
                </span>
                <div className="p-2 border border-dashed border-gray-400 bg-white min-h-[70px] whitespace-pre-line text-xs font-medium text-black leading-relaxed">
                  {form.isiArahan || 'Belum ada catatan arahan.'}
                  {form.catatanKhusus && (
                    <div className="mt-2 pt-1 border-t border-gray-200 text-gray-700 font-normal italic">
                      Catatan: {form.catatanKhusus}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TANDA TANGAN ELEKTRONIK & STEMPEL PERADILAN */}
            <div className="pt-2 flex justify-between items-end">
              <div className="text-[10px] text-gray-600">
                <p>Dokumen ini disahkan secara elektronik melalui aplikasi KlikDispos (Kanal Layanan Instan Kendali Disposisi & Surat).</p>
                <p className="font-code font-semibold">TTE ID: {existingDisposisi?.tandaTanganElektronik?.sha256 || '9F8A...2026-MARI'}</p>
              </div>

              <div className="text-center w-64">
                <p className="text-[11px] font-bold text-black">
                  {existingDisposisi?.tandaTanganElektronik?.jabatan?.includes('Plh') || plhConfig?.isActive
                    ? (plhConfig?.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim Senior selaku Plh. Ketua,' : 'Plh. Ketua Pengadilan Agama Lamongan,')
                    : 'Ketua Pengadilan Agama Lamongan,'}
                </p>
                {/* Digital Stamp Simulation */}
                <div className="my-2 p-1.5 border border-dashed border-primary rounded-md inline-block bg-primary-light/20">
                  <div className="text-[10px] font-bold text-primary flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>TERVERIFIKASI TTE</span>
                  </div>
                  <div className="text-[9px] text-gray-600 font-code">
                    {existingDisposisi?.tandaTanganElektronik?.waktuSertifikasi || '04 Nov 2026 09:15 WIB'}
                  </div>
                </div>
                <p className="font-extrabold text-black underline text-xs">
                  {existingDisposisi?.tandaTanganElektronik?.penandatangan ||
                    (plhConfig?.isActive ? plhConfig.pejabatPlh.name : plhConfig.pejabatAsal.name)}
                </p>
                <p className="text-[10px] text-gray-700">
                  NIP. {existingDisposisi?.tandaTanganElektronik?.penandatangan === plhConfig.pejabatAsal.name
                    ? plhConfig.pejabatAsal.nip
                    : (plhConfig?.isActive ? plhConfig.pejabatPlh.nip : plhConfig.pejabatAsal.nip)}
                </p>
                {plhConfig?.isActive && (
                  <p className="text-[9px] text-gray-500 font-code mt-0.5">
                    (SK Plh: {plhConfig.nomorSK})
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
