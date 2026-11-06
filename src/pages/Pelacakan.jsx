import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';

export default function Pelacakan() {
  const { suratMasuk, trackingList, activeLetterId, setActiveLetterId, navigateTo, showToast } = useSurat();

  const [searchLetter, setSearchLetter] = useState(activeLetterId || suratMasuk[0]?.id || '');

  if (suratMasuk.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
          <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Pelacakan Alur Surat</h2>
            <p className="text-xs md:text-sm text-outline mt-0.5">
              Jejak Audit Real-time Perjalanan Berkas Naskah Dinas
            </p>
          </div>
        </div>
        <div className="p-12 text-center bg-white rounded-xl border border-outline-subtle shadow-xs">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2 block">
            timeline
          </span>
          <h3 className="text-base font-bold text-on-surface">Belum Ada Surat Masuk untuk Dilacak</h3>
          <p className="text-xs text-outline mt-1 mb-5">
            Database persuratan saat ini kosong. Alur pelacakan otomatis aktif saat ada surat masuk tercatat.
          </p>
          <button
            onClick={() => navigateTo('surat-masuk')}
            className="px-4 py-2 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
            style={{ backgroundColor: '#0B3B24' }}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Catat Surat Masuk</span>
          </button>
        </div>
      </div>
    );
  }

  const currentSurat = suratMasuk.find((s) => s.id === searchLetter) || suratMasuk[0];
  const history = currentSurat?.id ? (trackingList[currentSurat.id] || []) : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const found = suratMasuk.find(
      (s) =>
        s.nomorSurat.toLowerCase().includes(searchLetter.toLowerCase()) ||
        s.agenda.toLowerCase().includes(searchLetter.toLowerCase()) ||
        s.id.toLowerCase() === searchLetter.toLowerCase()
    );
    if (found) {
      setSearchLetter(found.id);
      setActiveLetterId(found.id);
      showToast(`Surat ditemukan: ${found.nomorSurat}`);
    } else {
      showToast('Surat dengan nomor/agenda tersebut tidak ditemukan.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Pelacakan Surat</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Audit Trail & Riwayat</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Pelacakan & Riwayat Perjalanan Surat
          </h2>
          <p className="text-xs md:text-sm text-outline">
            Transparansi alur penanganan berkas naskah dinas, pemantauan waktu proses, dan rekam jejak pejabat.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="h-10 px-4 rounded-btn bg-white border border-outline-subtle hover:bg-surface text-on-surface text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Cetak Riwayat Perjalanan</span>
        </button>
      </div>

      {/* Search Bar Input */}
      <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs no-print">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchLetter}
              onChange={(e) => setSearchLetter(e.target.value)}
              placeholder="Masukkan Nomor Surat, Nomor Agenda (misal: 0001/SM/XI/2026), atau ID Surat..."
              className="w-full h-11 pl-10 pr-4 rounded-btn border border-outline-subtle bg-surface text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-6 rounded-btn bg-primary hover:bg-primary-dark text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">track_changes</span>
            <span>Lacak Perjalanan</span>
          </button>
        </form>
      </div>

      {/* Identity Card Surat */}
      <div className="bg-white rounded-card border border-outline-subtle p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-code text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded">
                Agenda: {currentSurat?.agenda}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-warning-light text-amber-900 border border-warning/40">
                Sifat: {currentSurat?.sifat}
              </span>
            </div>
            <h3 className="text-base font-bold text-on-surface mt-1">
              {currentSurat?.perihal}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-xs text-outline block">Status Saat Ini:</span>
              <span className="text-sm font-bold text-primary flex items-center md:justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {currentSurat?.status}
              </span>
            </div>
            {currentSurat && (
              <button
                onClick={() => {
                  showToast(`Membuka pindaian warkat ${currentSurat.nomorSurat}...`, 'info');
                  openWarkatPreview(currentSurat);
                }}
                className="h-9 px-3 rounded-btn bg-surface hover:bg-primary-light border border-outline-subtle text-primary font-semibold text-xs flex items-center gap-1.5 shadow-2xs active:scale-[0.98] transition-all"
                title="Buka pindaian warkat pada tab baru"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Lihat Scan Warkat</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-outline">
          <div>
            <span>Nomor Surat Asal:</span>
            <div className="font-code font-bold text-on-surface text-sm">{currentSurat?.nomorSurat}</div>
          </div>
          <div>
            <span>Asal Instansi:</span>
            <div className="font-semibold text-on-surface text-sm">{currentSurat?.asalSurat}</div>
          </div>
          <div>
            <span>Tanggal Diterima:</span>
            <div className="font-semibold text-on-surface text-sm">
              {currentSurat?.tanggalTerima?.replace('T', ' ')} WIB
            </div>
          </div>
          <div>
            <span>Lampiran:</span>
            <div className="font-semibold text-on-surface text-sm">{currentSurat?.lampiran}</div>
          </div>
        </div>
      </div>

      {/* Timeline Perjalanan Surat (Audit Trail) */}
      <div className="bg-white rounded-card border border-outline-subtle p-6 md:p-8 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-outline-subtle mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">route</span>
            <h3 className="text-base font-bold text-on-surface">Timeline Kronologis Audit Trail</h3>
          </div>
          <span className="text-xs text-outline font-medium">Zona Waktu: WIB (GMT+7)</span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/30">
          {history.map((event, index) => (
            <div key={index} className="relative group">
              {/* Bullet Node */}
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                <span className="material-symbols-outlined text-[14px]">{event.icon || 'check'}</span>
              </div>

              {/* Event Content Card */}
              <div className="p-4 rounded-card bg-surface border border-outline-subtle group-hover:border-primary/40 transition-colors shadow-2xs space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-primary">{event.tahap}</span>
                  <span className="text-outline font-medium">{event.waktu}</span>
                </div>

                <p className="text-xs md:text-sm font-semibold text-on-surface leading-relaxed">
                  {event.status}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-outline">
                  <span>Pelaksana: <strong className="text-on-surface">{event.petugas}</strong></span>
                  <span className={`px-2 py-0.5 rounded font-bold ${event.badgeColor}`}>
                    {event.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
