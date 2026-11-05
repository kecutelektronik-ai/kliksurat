import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function Pimpinan() {
  const {
    suratMasuk,
    suratKeluar,
    currentUser,
    navigateTo,
    approveAndNumberSuratKeluar,
    plhConfig,
    showToast,
  } = useSurat();

  const [activeTab, setActiveTab] = useState('disposisi');

  const pendingDisposisi = suratMasuk.filter((s) => s.status === 'Menunggu Disposisi');
  const pendingApprovalKeluar = suratKeluar.filter(
    (s) => s.status === 'Menunggu Persetujuan Atasan' || s.status === 'Menunggu Paraf Sekretaris'
  );

  const isKetuaOrWakil =
    currentUser.roleKey === 'ketua' ||
    currentUser.roleKey === 'wakil_ketua' ||
    (currentUser.roleKey === 'hakim_senior' && plhConfig?.isActive && plhConfig?.tipePelimpahan === 'hakim_ditunjuk');

  const handleDelegasiKeWakil = (suratId) => {
    showToast(`Surat berhasil didelegasikan ke Wakil Ketua untuk proses disposisi.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="p-6 rounded-card bg-gradient-to-r from-primary via-primary-dark to-accent-dark text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-primary-dark">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-100/90">
            <span className="material-symbols-outlined text-[18px] text-warning">shield_person</span>
            <span>Ruang Kerja Pimpinan Pengadilan</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Selamat Bertugas, {currentUser.name}
          </h2>
          <p className="text-xs text-stone-200">
            {currentUser.badge} • Menjaga integritas, ketertiban administrasi persuratan, dan penegakan hukum yudisial.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-btn bg-white/10 backdrop-blur-xs border border-white/20 text-xs">
            <div className="text-amber-100/80 text-[10px] uppercase font-bold">Status Jabatan</div>
            <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{currentUser.role} Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plh Delegation Banner if Active */}
      {plhConfig?.isActive && (
        <div className="p-4 rounded-card bg-warning-light border border-warning/50 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-amber-800">how_to_reg</span>
            <div>
              <p className="font-bold text-sm text-slate-950">
                Pelimpahan Kewenangan (Plh. Ketua) Sedang Aktif
              </p>
              <p className="text-amber-900 mt-0.5">
                {plhConfig.tipePelimpahan === 'hakim_ditunjuk'
                  ? `Ketua dan Wakil Ketua sedang berhalangan/dinas luar bersamaan (${plhConfig.tanggalMulai} s/d ${plhConfig.tanggalSelesai}). Mandat disposisi dan persetujuan naskah diampu oleh Hakim yang Ditunjuk (${plhConfig.pejabatPlh?.name}).`
                  : `Ketua sedang melaksanakan ${plhConfig.jenisCuti} (${plhConfig.tanggalMulai} s/d ${plhConfig.tanggalSelesai}). Mandat disposisi dan persetujuan naskah diampu oleh Wakil Ketua (${plhConfig.pejabatPlh?.name}).`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('kewenangan-plh')}
            className="px-3.5 py-1.5 rounded-btn bg-warning hover:bg-warning-dark text-slate-950 font-bold shrink-0 shadow-2xs transition-colors"
          >
            Kelola Pelimpahan SK &rarr;
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('disposisi')}
          className={`p-5 rounded-card border shadow-2xs cursor-pointer transition-all ${
            activeTab === 'disposisi'
              ? 'bg-white border-primary shadow-sm ring-2 ring-primary/20'
              : 'bg-white border-outline-subtle hover:bg-surface'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Menunggu Disposisi</span>
            <div className="w-9 h-9 rounded-lg bg-danger-light text-danger flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-danger">{pendingDisposisi.length}</div>
          <p className="text-[11px] text-outline mt-1">Perlu instruksi pimpinan segera</p>
        </div>

        <div
          onClick={() => setActiveTab('keluar')}
          className={`p-5 rounded-card border shadow-2xs cursor-pointer transition-all ${
            activeTab === 'keluar'
              ? 'bg-white border-primary shadow-sm ring-2 ring-primary/20'
              : 'bg-white border-outline-subtle hover:bg-surface'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Menunggu TTE / Approval</span>
            <div className="w-9 h-9 rounded-lg bg-warning-light text-amber-900 flex items-center justify-center border border-warning/40">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-warning-dark">{pendingApprovalKeluar.length}</div>
          <p className="text-[11px] text-outline mt-1">Draf surat keluar butuh persetujuan</p>
        </div>

        <div className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-outline">Tingkat Ketepatan Waktu</span>
            <div className="w-9 h-9 rounded-lg bg-success-light text-success flex items-center justify-center border border-success/30">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-success">96.8%</div>
          <p className="text-[11px] text-outline mt-1">Indeks Kinerja Reformasi Birokrasi</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-outline-subtle pb-2">
        <button
          onClick={() => setActiveTab('disposisi')}
          className={`px-4 py-2 rounded-btn font-semibold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'disposisi'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
          <span>Antrean Disposisi Surat Masuk ({pendingDisposisi.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('keluar')}
          className={`px-4 py-2 rounded-btn font-semibold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'keluar'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Antrean Persetujuan Surat Keluar ({pendingApprovalKeluar.length})</span>
        </button>
      </div>

      {/* Tab 1: Antrean Disposisi */}
      {activeTab === 'disposisi' && (
        <div className="space-y-4">
          {pendingDisposisi.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-card border border-outline-subtle text-outline text-sm">
              <span className="material-symbols-outlined text-[40px] text-success block mb-2">
                task_alt
              </span>
              Semua surat masuk telah selesai didisposisi oleh Pimpinan.
            </div>
          ) : (
            pendingDisposisi.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-card bg-white border border-outline-subtle hover:border-primary/50 shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-code font-bold text-xs text-primary bg-primary-light px-2.5 py-0.5 rounded">
                      {item.agenda}
                    </span>
                    <span className="font-code font-bold text-xs text-on-surface">
                      No: {item.nomorSurat}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-danger-light text-danger uppercase">
                      Sifat: {item.sifat}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface leading-snug">
                    {item.perihal}
                  </h3>

                  <div className="text-xs text-outline space-x-3">
                    <span>Pengirim: <strong className="text-on-surface">{item.asalSurat}</strong></span>
                    <span>•</span>
                    <span>Diterima: <strong className="text-on-surface">{item.tanggalTerima?.replace('T', ' ')}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {currentUser.roleKey === 'ketua' && (
                    <button
                      onClick={() => handleDelegasiKeWakil(item.id)}
                      className="h-9 px-3 rounded-btn border border-outline-subtle text-on-surface hover:bg-surface text-xs font-semibold transition-colors"
                      title="Delegasikan jika Ketua dinas luar"
                    >
                      Delegasikan ke Wakil Ketua
                    </button>
                  )}
                  <button
                    onClick={() => navigateTo('disposisi', item.id)}
                    className="h-9 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Beri Arahan Disposisi</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Antrean Approval Surat Keluar */}
      {activeTab === 'keluar' && (
        <div className="space-y-4">
          {pendingApprovalKeluar.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-card border border-outline-subtle text-outline text-sm">
              <span className="material-symbols-outlined text-[40px] text-success block mb-2">
                verified
              </span>
              Tidak ada draf surat keluar yang menunggu persetujuan.
            </div>
          ) : (
            pendingApprovalKeluar.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-card bg-white border border-outline-subtle hover:border-primary/50 shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-warning-light text-amber-900 border border-warning/40">
                      {item.status}
                    </span>
                    <span className="font-code text-xs text-outline font-semibold">
                      Klasifikasi: {item.kodeKlasifikasi}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface leading-snug">
                    {item.perihal}
                  </h3>

                  <div className="text-xs text-outline space-x-3">
                    <span>Tujuan: <strong className="text-on-surface">{item.tujuanSurat}</strong></span>
                    <span>•</span>
                    <span>Pengusul: <strong className="text-on-surface">{item.pembuat}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveAndNumberSuratKeluar(item.id)}
                    className="h-9 px-4 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Setujui & Terbitkan Nomor Resmi</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
