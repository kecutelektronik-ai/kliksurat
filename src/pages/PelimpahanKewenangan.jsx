import React, { useState } from 'react';
import { useSurat, USERS } from '../context/SuratContext';

export default function PelimpahanKewenangan() {
  const {
    plhConfig,
    aktifkanPlh,
    nonaktifkanPlh,
    switchUser,
    currentUser,
    navigateTo,
    showToast
  } = useSurat();

  const [formData, setFormData] = useState({
    tipePelimpahan: plhConfig.tipePelimpahan || 'wakil_ketua', // 'wakil_ketua' | 'hakim_ditunjuk'
    alasanKetiadaan: plhConfig.alasanKetiadaan || 'cuti_ketua',
    nomorSK: plhConfig.nomorSK,
    jenisCuti: plhConfig.jenisCuti,
    tanggalMulai: plhConfig.tanggalMulai,
    tanggalSelesai: plhConfig.tanggalSelesai,
    pejabatHakim: plhConfig.pejabatHakim || {
      name: 'Drs. H. M. Arifin, S.H., M.Hum.',
      role: 'Hakim Senior / Hakim Pengawas (Selaku Plh. Ketua)',
      nip: '19700612 199603 1 001',
      jabatan: 'Hakim Tingkat Pertama PA Lumajang Kelas I-A'
    },
    pejabatWakil: plhConfig.pejabatWakil || {
      name: 'Drs. H. Syamsul Hadi, M.H.',
      role: 'Wakil Ketua (Selaku Plh. Ketua)',
      nip: '19720516 199803 1 004',
      jabatan: 'Wakil Ketua Pengadilan Agama Lumajang Kelas I-A'
    },
    keterangan: plhConfig.keterangan,
    wewenang: plhConfig.wewenang || [
      'Pemberian Instruksi & Pengesahan Lembar Disposisi Surat Masuk',
      'Persetujuan & Penerbitan Nomor Resmi Surat Keluar',
      'Sertifikasi & Tanda Tangan Elektronik (TTE) Naskah Dinas',
      'Koordinasi Pembagian Tugas Kepaniteraan & Kesekretariatan'
    ]
  });

  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'dokumen' | 'riwayat'

  const handleToggleWewenang = (wItem) => {
    setFormData(prev => {
      const exists = prev.wewenang.includes(wItem);
      return {
        ...prev,
        wewenang: exists ? prev.wewenang.filter(x => x !== wItem) : [...prev.wewenang, wItem]
      };
    });
  };

  const handleSimpanAktivasi = (e) => {
    e.preventDefault();
    aktifkanPlh(formData);
  };

  const handlePrintDokumen = () => {
    window.print();
  };

  const ALASAN_KETIADAAN_OPTIONS = [
    {
      value: 'keduanya_dinas_luar',
      label: 'Ketua & Wakil Ketua Dinas Luar Bersamaan (Rakor / Bintek Nasional)',
      target: 'hakim_ditunjuk',
      defaultJenis: 'Dinas Luar Daerah / Rakor Nasional'
    },
    {
      value: 'keduanya_cuti',
      label: 'Ketua & Wakil Ketua Cuti Bersamaan',
      target: 'hakim_ditunjuk',
      defaultJenis: 'Cuti Tahunan Bersama'
    },
    {
      value: 'cuti_dan_dinas',
      label: 'Ketua Cuti & Wakil Ketua Dinas Luar Daerah',
      target: 'hakim_ditunjuk',
      defaultJenis: 'Cuti & Tugas Dinas Luar Daerah'
    },
    {
      value: 'cuti_ketua',
      label: 'Ketua Cuti (Wakil Ketua Ada di Tempat)',
      target: 'wakil_ketua',
      defaultJenis: 'Cuti Tahunan'
    },
    {
      value: 'dinas_ketua',
      label: 'Ketua Dinas Luar (Wakil Ketua Ada di Tempat)',
      target: 'wakil_ketua',
      defaultJenis: 'Dinas Luar Daerah'
    },
  ];

  const WEWENANG_PRESETS = [
    'Pemberian Instruksi & Pengesahan Lembar Disposisi Surat Masuk',
    'Persetujuan & Penerbitan Nomor Resmi Surat Keluar',
    'Sertifikasi & Tanda Tangan Elektronik (TTE) Naskah Dinas',
    'Koordinasi Pembagian Tugas Kepaniteraan & Kesekretariatan',
    'Pengesahan Surat Tugas & Delegasi Sidang Keliling',
    'Penyelenggaraan Rapat Pembinaan & Pengawasan Internal'
  ];

  const isHakimPlh = plhConfig.isActive && plhConfig.tipePelimpahan === 'hakim_ditunjuk';
  const targetPlhNama = isHakimPlh ? plhConfig.pejabatHakim?.name : plhConfig.pejabatWakil?.name;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Kewenangan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Pelimpahan Kewenangan (Plh)</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Regulasi Mahkamah Agung RI</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <span>Pelimpahan Kewenangan Pimpinan (Plh. Ketua)</span>
            {plhConfig.isActive ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-warning text-slate-950 font-extrabold uppercase border border-warning shadow-2xs">
                PLH AKTIF: {isHakimPlh ? 'HAKIM YANG DITUNJUK' : 'WAKIL KETUA'}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface text-outline font-bold border border-outline-subtle">
                NON-AKTIF (KETUA AKTIF)
              </span>
            )}
          </h2>
          <p className="text-xs md:text-sm text-outline mt-0.5">
            Pelimpahan mandat saat Ketua cuti/dinas luar ke Wakil Ketua, atau kepada <strong>Hakim yang Ditunjuk</strong> apabila Ketua dan Wakil Ketua keduanya sedang berhalangan secara bersamaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick switch button based on active scenario */}
          {isHakimPlh ? (
            currentUser.roleKey !== 'hakim_senior' && (
              <button
                onClick={() => {
                  switchUser('hakim_senior');
                  showToast('Beralih peran ke Hakim yang Ditunjuk (Plh. Ketua). Anda memiliki hak disposisi & persetujuan surat keluar penuh.', 'info');
                }}
                className="h-10 px-4 rounded-btn bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                title="Masuk sebagai Hakim Senior yang memegang mandat Plh"
              >
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>Beralih ke Hakim yang Ditunjuk</span>
              </button>
            )
          ) : (
            currentUser.roleKey !== 'wakil_ketua' && (
              <button
                onClick={() => {
                  switchUser('wakil_ketua');
                  showToast('Beralih peran ke Wakil Ketua (Plh. Ketua). Anda sekarang memiliki kewenangan penuh disposisi.', 'info');
                }}
                className="h-10 px-4 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                title="Masuk sebagai Wakil Ketua yang memegang mandat Plh"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Beralih ke Wakil Ketua</span>
              </button>
            )
          )}

          <button
            onClick={() => navigateTo('disposisi')}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            <span>Buka Lembar Disposisi</span>
          </button>
        </div>
      </div>

      {/* Primary Alert Banner */}
      {plhConfig.isActive ? (
        <div className="p-5 rounded-card bg-gradient-to-r from-accent via-accent-dark to-primary text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-accent-dark no-print">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/25 shadow-xs">
              <span className="material-symbols-outlined text-[26px] text-warning">how_to_reg</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-warning text-slate-950 shadow-2xs">
                  {isHakimPlh ? 'Kondisi: Ketua & Wakil Ketua Berhalangan Bersamaan' : 'Kondisi: Ketua Sedang Cuti / Dinas'}
                </span>
                <span className="text-xs text-amber-100/90 font-code font-bold">
                  SK No: {plhConfig.nomorSK}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {isHakimPlh
                  ? `Kewenangan Pimpinan Dilimpahkan kepada Hakim yang Ditunjuk: ${targetPlhNama}`
                  : `Kewenangan Pimpinan Dilimpahkan kepada Wakil Ketua: ${targetPlhNama}`}
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed max-w-3xl">
                {isHakimPlh ? (
                  <>
                    Ketua (<strong>{plhConfig.pejabatAsal.name}</strong>) dan Wakil Ketua (<strong>{plhConfig.pejabatWakil?.name || 'Wakil Ketua'}</strong>) sedang melaksanakan <strong>{plhConfig.jenisCuti}</strong> periode <strong>{plhConfig.tanggalMulai}</strong> s/d <strong>{plhConfig.tanggalSelesai}</strong>. Sesuai SEMA No. 2 Tahun 2020, kewenangan disposisi dan persetujuan naskah dinas diampu secara sah oleh Hakim Senior (<strong>{targetPlhNama}</strong>).
                  </>
                ) : (
                  <>
                    Ketua Pengadilan Agama (<strong>{plhConfig.pejabatAsal.name}</strong>) sedang melaksanakan <strong>{plhConfig.jenisCuti}</strong> ({plhConfig.tanggalMulai} s/d {plhConfig.tanggalSelesai}). Seluruh disposisi surat masuk dan approval surat keluar dilaksanakan oleh Wakil Ketua (<strong>{targetPlhNama}</strong>).
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={nonaktifkanPlh}
              className="w-full sm:w-auto h-9 px-4 rounded-btn bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>Cabut Mandat (Kembali ke Ketua)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-outline-subtle text-primary">
              <span className="material-symbols-outlined text-[26px]">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-surface text-outline border border-outline-subtle">
                  Status: Normal (Ketua Aktif Penuh)
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-on-surface mt-1">
                Kewenangan Diampu Langsung oleh Ketua Pengadilan
              </h3>
              <p className="text-xs text-outline leading-relaxed mt-0.5">
                Tidak ada pelaksanaan cuti kedinasan yang aktif. Surat masuk dan lembar disposisi ditandatangani langsung oleh <strong>{plhConfig.pejabatAsal.name}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('status')}
            className="h-9 px-4 rounded-btn bg-warning hover:bg-warning-dark text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">add_task</span>
            <span>Tetapkan Pelimpahan Plh</span>
          </button>
        </div>
      )}

      {/* Visual Role Transition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center no-print">
        {/* Card 1: Pihak yang Melimpahkan / Berhalangan */}
        <div className={`md:col-span-5 p-5 rounded-card bg-white border shadow-2xs space-y-3 ${
          plhConfig.isActive ? 'border-amber-300 ring-2 ring-amber-100' : 'border-outline-subtle'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              {isHakimPlh ? 'Pimpinan yang Berhalangan (Cuti / Dinas Luar)' : 'Ketua yang Melimpahkan Wewenang'}
            </span>
            {plhConfig.isActive ? (
              <span className="text-[11px] px-2 py-0.5 rounded bg-warning-light text-amber-900 border border-warning/40 font-bold">
                {isHakimPlh ? 'Keduanya Berhalangan' : 'Sedang Cuti / Dinas'}
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded bg-success-light text-success font-bold">
                Aktif Bertugas
              </span>
            )}
          </div>

          {/* Profil Ketua */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-dark text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
              AZ
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface">{plhConfig.pejabatAsal.name}</h4>
              <p className="text-[11px] text-primary font-semibold">{plhConfig.pejabatAsal.role}</p>
              <p className="text-[10px] text-outline font-code">NIP. {plhConfig.pejabatAsal.nip}</p>
            </div>
          </div>

          {/* Profil Wakil Ketua (jika keduanya berhalangan) */}
          {isHakimPlh && (
            <div className="flex items-center gap-3 pt-2 border-t border-dashed border-outline-subtle">
              <div className="w-11 h-11 rounded-full bg-amber-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                SH
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-on-surface">{plhConfig.pejabatWakil?.name || 'Drs. H. Syamsul Hadi, M.H.'}</h4>
                <p className="text-[11px] text-amber-800 font-semibold">Wakil Ketua Pengadilan Agama</p>
                <p className="text-[10px] text-outline font-code">NIP. {plhConfig.pejabatWakil?.nip || '19720516 199803 1 004'}</p>
              </div>
            </div>
          )}

          <div className="p-2.5 rounded-lg bg-surface text-xs text-outline space-y-1">
            <div className="flex justify-between">
              <span>Alasan Ketiadaan:</span>
              <span className="font-bold text-amber-800">
                {plhConfig.isActive ? plhConfig.jenisCuti : 'Tidak Ada'}
              </span>
            </div>
          </div>
        </div>

        {/* Transition Indicator */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <span className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider text-center">
            Mandat Plh
          </span>
        </div>

        {/* Card 2: Pejabat Penerima Mandat */}
        <div className={`md:col-span-5 p-5 rounded-card bg-white border shadow-2xs space-y-3 ${
          plhConfig.isActive ? 'border-success ring-2 ring-success/20' : 'border-outline-subtle'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
            <span className="text-xs font-bold text-success flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              {isHakimPlh ? 'Hakim yang Ditunjuk (Plh. Ketua)' : 'Wakil Ketua (Plh. Ketua)'}
            </span>
            {plhConfig.isActive ? (
              <span className="text-[11px] px-2 py-0.5 rounded bg-success text-white font-extrabold uppercase shadow-2xs">
                Memegang Mandat Penuh
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface text-outline font-semibold border border-outline-subtle">
                Siap Menerima Mandat
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${isHakimPlh ? 'bg-indigo-700' : 'bg-success'} text-white font-extrabold flex items-center justify-center text-sm shadow-xs`}>
              {isHakimPlh ? 'MA' : 'SH'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">{targetPlhNama}</h4>
              <p className="text-xs text-success font-bold">
                {plhConfig.isActive
                  ? (isHakimPlh ? 'Hakim Senior selaku Plh. Ketua Pengadilan' : 'Wakil Ketua selaku Plh. Ketua Pengadilan')
                  : 'Siap Melaksanakan Tugas Plh'}
              </p>
              <p className="text-[11px] text-outline font-code mt-0.5">
                NIP. {isHakimPlh ? plhConfig.pejabatHakim?.nip : plhConfig.pejabatWakil?.nip}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface text-xs text-outline space-y-1">
            <div className="flex justify-between">
              <span>Wewenang Disposisi:</span>
              <span className={`font-bold ${plhConfig.isActive ? 'text-success' : 'text-outline'}`}>
                {plhConfig.isActive ? 'Sah & Bersertifikasi TTE' : 'Sesuai Arahan'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Penetapan SK:</span>
              <span className="font-code text-on-surface font-semibold">{plhConfig.nomorSK}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-outline-subtle pb-2 no-print">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-btn font-semibold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'status'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Konfigurasi & Penetapan Plh</span>
        </button>

        <button
          onClick={() => setActiveTab('dokumen')}
          className={`px-4 py-2 rounded-btn font-semibold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'dokumen'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          <span>Pratinjau Surat Perintah Plh (Format MARI)</span>
        </button>

        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-4 py-2 rounded-btn font-semibold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'riwayat'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Riwayat Pelimpahan ({(plhConfig.riwayat || []).length})</span>
        </button>
      </div>

      {/* TAB 1: FORM PENGATURAN PELIMPAHAN */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-card border border-outline-subtle shadow-2xs p-5 md:p-6 space-y-6 no-print">
          <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
            <div>
              <h3 className="text-base font-bold text-on-surface">Formulir Penetapan Pelimpahan Kewenangan (Plh)</h3>
              <p className="text-xs text-outline mt-0.5">
                Konfigurasikan pelimpahan wewenang disposisi dan persetujuan naskah dinas sesuai regulasi SEMA No. 2 Tahun 2020.
              </p>
            </div>
            <span className="text-xs font-code font-bold text-primary bg-primary-light px-2.5 py-1 rounded">
              SEMA No. 2 Tahun 2020
            </span>
          </div>

          <form onSubmit={handleSimpanAktivasi} className="space-y-6 text-xs">
            {/* Pilihan Skenario Pelimpahan Utama */}
            <div className="space-y-2">
              <label className="font-bold text-on-surface text-sm block">
                Pilih Skenario Pelimpahan Mandat <span className="text-danger">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opsi 1: Pelimpahan ke Wakil Ketua */}
                <div
                  onClick={() => setFormData({ ...formData, tipePelimpahan: 'wakil_ketua' })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    formData.tipePelimpahan === 'wakil_ketua'
                      ? 'border-primary bg-primary-light/30 shadow-xs'
                      : 'border-outline-subtle bg-white hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipePelimpahan"
                    checked={formData.tipePelimpahan === 'wakil_ketua'}
                    onChange={() => setFormData({ ...formData, tipePelimpahan: 'wakil_ketua' })}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <span>Ketua Berhalangan (Cuti / Dinas Luar)</span>
                      <span className="text-[10px] bg-primary text-white font-extrabold px-1.5 py-0.2 rounded">
                        STANDAR
                      </span>
                    </div>
                    <p className="text-outline text-xs mt-1">
                      Wewenang dilimpahkan kepada <strong>Wakil Ketua Pengadilan</strong> ({formData.pejabatWakil.name}).
                    </p>
                  </div>
                </div>

                {/* Opsi 2: Pelimpahan ke Hakim yang Ditunjuk (Keduanya Berhalangan) */}
                <div
                  onClick={() => setFormData({ ...formData, tipePelimpahan: 'hakim_ditunjuk' })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    formData.tipePelimpahan === 'hakim_ditunjuk'
                      ? 'border-indigo-600 bg-indigo-50 shadow-xs'
                      : 'border-outline-subtle bg-white hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipePelimpahan"
                    checked={formData.tipePelimpahan === 'hakim_ditunjuk'}
                    onChange={() => setFormData({ ...formData, tipePelimpahan: 'hakim_ditunjuk' })}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-bold text-sm text-indigo-950 flex items-center gap-1.5">
                      <span>Ketua & Wakil Ketua Keduanya Berhalangan</span>
                      <span className="text-[10px] bg-indigo-700 text-white font-extrabold px-1.5 py-0.2 rounded">
                        HAKIM DITUNJUK
                      </span>
                    </div>
                    <p className="text-outline text-xs mt-1">
                      Keduanya sedang cuti atau dinas luar bersamaan. Wewenang dilimpahkan kepada <strong>Hakim yang Ditunjuk / Hakim Senior</strong> ({formData.pejabatHakim.name}).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Rincian Alasan Ketiadaan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1">
                  <span>Kondisi / Alasan Ketiadaan Pimpinan</span>
                  <span className="text-danger">*</span>
                </label>
                <select
                  value={formData.alasanKetiadaan}
                  onChange={(e) => {
                    const sel = ALASAN_KETIADAAN_OPTIONS.find(x => x.value === e.target.value);
                    setFormData({
                      ...formData,
                      alasanKetiadaan: e.target.value,
                      tipePelimpahan: sel ? sel.target : formData.tipePelimpahan,
                      jenisCuti: sel ? sel.defaultJenis : formData.jenisCuti
                    });
                  }}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                >
                  {ALASAN_KETIADAAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pejabat Hakim yang Ditunjuk (jika opsi Hakim aktif) */}
              {formData.tipePelimpahan === 'hakim_ditunjuk' ? (
                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface flex items-center gap-1">
                    <span>Pejabat Hakim yang Ditunjuk</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pejabatHakim.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      pejabatHakim: { ...formData.pejabatHakim, name: e.target.value }
                    })}
                    placeholder="Nama Hakim yang Ditunjuk"
                    className="w-full h-10 px-3 rounded-btn border border-indigo-300 bg-indigo-50/50 text-indigo-950 font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                  <p className="text-[11px] text-outline">NIP: {formData.pejabatHakim.nip} ({formData.pejabatHakim.role})</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface flex items-center gap-1">
                    <span>Pejabat Wakil Ketua Penerima Mandat</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.pejabatWakil.name}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-semibold cursor-not-allowed"
                  />
                  <p className="text-[11px] text-outline">NIP: {formData.pejabatWakil.nip} (Wakil Ketua Pengadilan Agama)</p>
                </div>
              )}

              {/* Nomor SK Penunjukan */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1">
                  <span>Nomor Surat Perintah / SK Penunjukan Plh</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomorSK}
                  onChange={(e) => setFormData({ ...formData, nomorSK: e.target.value })}
                  placeholder="misal: W13-A12/128/KP.04.1/XI/2026"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white font-code text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Jenis Cuti / Tugas Kedinasan */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1">
                  <span>Jenis Kegiatan / Cuti</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.jenisCuti}
                  onChange={(e) => setFormData({ ...formData, jenisCuti: e.target.value })}
                  placeholder="misal: Cuti Tahunan atau Dinas Luar Daerah"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1">
                  <span>Tanggal Mulai</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggalMulai}
                  onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Tanggal Selesai */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1">
                  <span>Tanggal Selesai</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggalSelesai}
                  onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            {/* Ruang Lingkup Kewenangan */}
            <div className="space-y-2 pt-2 border-t border-outline-subtle">
              <label className="font-bold text-on-surface block">
                Cakupan Kewenangan yang Dilimpahkan kepada {formData.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'}:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WEWENANG_PRESETS.map((item) => {
                  const isChecked = formData.wewenang.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => handleToggleWewenang(item)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-success-light/40 border-success text-on-surface font-semibold shadow-2xs'
                          : 'bg-surface border-outline-subtle text-outline hover:border-primary'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-success text-white' : 'border border-outline'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                      <span className="text-xs">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keterangan Tambahan */}
            <div className="space-y-1.5">
              <label className="font-bold text-on-surface">Keterangan / Catatan SK:</label>
              <textarea
                rows="2"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Penjelasan instruksi koordinasi selama masa ketiadaan pimpinan..."
                className="w-full p-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-outline-subtle flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-outline flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-success">notifications_active</span>
                <span>Notifikasi WhatsApp otomatis dikirimkan ke aparatur pengadilan saat diaktifkan.</span>
              </div>

              <div className="flex items-center gap-2">
                {plhConfig.isActive && (
                  <button
                    type="button"
                    onClick={nonaktifkanPlh}
                    className="h-10 px-4 rounded-btn border border-danger text-danger hover:bg-danger-light font-bold text-xs transition-colors"
                  >
                    Nonaktifkan Plh Sekarang
                  </button>
                )}

                <button
                  type="submit"
                  className="h-10 px-6 rounded-btn bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{plhConfig.isActive ? 'Simpan Pembaruan SK Plh' : 'Aktifkan Pelimpahan Plh'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PRATINJAU NASKAH DINAS SURAT PERINTAH PLH (FORMAT RESMI MARI) */}
      {activeTab === 'dokumen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between no-print px-1">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">print</span>
              <span>Dokumen Surat Perintah Pelaksana Harian (Plh. Ketua) Standar Mahkamah Agung</span>
            </h3>
            <button
              onClick={handlePrintDokumen}
              className="h-9 px-4 rounded-btn bg-white border border-outline-subtle hover:bg-surface text-on-surface font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak Surat Perintah</span>
            </button>
          </div>

          {/* DOKUMEN CETAK KOP PERADILAN */}
          <div className="bg-white rounded-card border-2 border-black/80 shadow-md p-8 sm:p-12 text-black font-serif text-xs leading-relaxed max-w-4xl mx-auto">
            {/* Kop Resmi Pengadilan Agama Lumajang */}
            <KopSurat />

            {/* Judul Surat Perintah */}
            <div className="text-center space-y-1 mb-6">
              <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-widest underline">
                SURAT PERINTAH PELAKSANA HARIAN (Plh)
              </h4>
              <p className="font-sans font-bold text-xs text-black">
                Nomor: {formData.nomorSK}
              </p>
            </div>

            {/* Isi Surat Perintah Konsiderans */}
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-2 font-bold uppercase">Menimbang</span>
                <span className="col-span-1 text-center">:</span>
                <div className="col-span-9 space-y-1">
                  <p>
                    a. Bahwa sehubungan dengan pelaksanaan <strong>{formData.jenisCuti}</strong> oleh {formData.tipePelimpahan === 'hakim_ditunjuk' ? 'Ketua dan Wakil Ketua Pengadilan Agama Lumajang Kelas I-A secara bersamaan' : 'Ketua Pengadilan Agama Lumajang Kelas I-A'} terhitung mulai tanggal <strong>{formData.tanggalMulai}</strong> sampai dengan <strong>{formData.tanggalSelesai}</strong>;
                  </p>
                  <p>
                    b. Bahwa guna menjamin kelancaran jalannya roda organisasi peradilan, pelayanan penanganan persuratan kedinasan, pemberian disposisi naskah, serta administrasi yudisial, dipandang perlu menunjuk {formData.tipePelimpahan === 'hakim_ditunjuk' ? 'seorang Hakim Senior' : 'Wakil Ketua'} sebagai Pelaksana Harian (Plh) Ketua Pengadilan Agama Lumajang Kelas I-A;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-2 font-bold uppercase">Mengingat</span>
                <span className="col-span-1 text-center">:</span>
                <div className="col-span-9 space-y-1">
                  <p>1. Undang-Undang Nomor 7 Tahun 1989 tentang Peradilan Agama sebagaimana telah diubah dengan Undang-Undang Nomor 50 Tahun 2009;</p>
                  <p>2. Undang-Undang Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan;</p>
                  <p>3. Surat Edaran Mahkamah Agung (SEMA) Nomor 2 Tahun 2020 tentang Tata Kelola Pelimpahan Wewenang Pimpinan di Lingkungan Mahkamah Agung dan Badan Peradilan yang Berada di Bawahnya;</p>
                </div>
              </div>

              <div className="text-center font-bold uppercase tracking-wider py-2">
                MEMERINTAHKAN:
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-2 font-bold uppercase">Kepada</span>
                <span className="col-span-1 text-center">:</span>
                <div className="col-span-9 space-y-0.5">
                  <p className="font-bold text-sm">
                    {formData.tipePelimpahan === 'hakim_ditunjuk' ? formData.pejabatHakim.name : formData.pejabatWakil.name}
                  </p>
                  <p>
                    NIP. {formData.tipePelimpahan === 'hakim_ditunjuk' ? formData.pejabatHakim.nip : formData.pejabatWakil.nip}
                  </p>
                  <p>
                    Jabatan: {formData.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim Tingkat Pertama / Hakim Senior Pengadilan Agama Lumajang' : 'Wakil Ketua Pengadilan Agama Lumajang Kelas I-A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-2 font-bold uppercase">Untuk</span>
                <span className="col-span-1 text-center">:</span>
                <div className="col-span-9 space-y-2">
                  <p>
                    1. Di samping jabatannya sebagai {formData.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim' : 'Wakil Ketua'}, ditugaskan untuk bertindak dan melaksanakan wewenang kedinasan sehari-hari sebagai <strong>Pelaksana Harian (Plh.) Ketua Pengadilan Agama Lumajang Kelas I-A</strong> terhitung sejak tanggal <strong>{formData.tanggalMulai}</strong> sampai dengan <strong>{formData.tanggalSelesai}</strong>.
                  </p>
                  <p>
                    2. Menandatangani lembar kendali disposisi surat masuk, persetujuan surat keluar kedinasan, pengesahan berkas perkara elektronik, dan tanda tangan elektronik (TTE) resmi atas nama Plh. Ketua Pengadilan Agama Lumajang.
                  </p>
                  <p>
                    3. Melaporkan pelaksanaan tugas kedinasan yang telah diselesaikan kepada Ketua Pengadilan Agama setelah masa berhalangan berakhir.
                  </p>
                </div>
              </div>
            </div>

            {/* Penutup & Tanda Tangan */}
            <div className="pt-8 flex justify-end font-sans">
              <div className="text-center w-64 space-y-1">
                <p>Ditetapkan di Lumajang</p>
                <p>Pada tanggal: {formData.tanggalMulai}</p>
                <p className="font-bold pt-1">
                  Ketua Pengadilan Agama Lumajang,
                </p>
                <div className="py-4">
                  <span className="px-3 py-1 border border-dashed border-gray-400 text-[10px] text-gray-500 rounded">
                    [TTE Sah MARI]
                  </span>
                </div>
                <p className="font-extrabold underline text-sm">
                  {plhConfig.pejabatAsal.name}
                </p>
                <p className="text-[11px] text-gray-700">NIP. {plhConfig.pejabatAsal.nip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RIWAYAT PELIMPAHAN KEWENANGAN */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden no-print">
          <div className="p-4 border-b border-outline-subtle flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface">Daftar Arsip & Riwayat Penetapan Plh</h3>
            <span className="text-xs text-outline font-semibold">Tercatat dalam Buku Register Kepegawaian</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-outline font-semibold uppercase text-[10px] tracking-wider border-b border-outline-subtle">
                <tr>
                  <th className="p-3">Nomor SK</th>
                  <th className="p-3">Skenario / Jenis</th>
                  <th className="p-3">Pejabat Pengganti (Plh)</th>
                  <th className="p-3">Masa Berlaku</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle">
                {/* Active entry */}
                {plhConfig.isActive && (
                  <tr className="bg-warning-light/30">
                    <td className="p-3 font-code font-bold text-primary">{plhConfig.nomorSK}</td>
                    <td className="p-3 font-bold text-amber-900">
                      <div>{plhConfig.jenisCuti}</div>
                      <span className="text-[10px] text-indigo-700 font-semibold">
                        {isHakimPlh ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-on-surface">{targetPlhNama}</td>
                    <td className="p-3">{plhConfig.tanggalMulai} s/d {plhConfig.tanggalSelesai}</td>
                    <td className="p-3 text-outline max-w-xs truncate">{plhConfig.keterangan}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-warning text-slate-950 font-extrabold text-[10px] uppercase shadow-2xs">
                        Sedang Berjalan
                      </span>
                    </td>
                  </tr>
                )}

                {/* History entries */}
                {(plhConfig.riwayat || []).map((h) => (
                  <tr key={h.id} className="hover:bg-surface/50">
                    <td className="p-3 font-code font-semibold text-outline">{h.nomorSK}</td>
                    <td className="p-3 text-on-surface">
                      <div>{h.jenisCuti}</div>
                      <span className="text-[10px] text-outline">
                        {h.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim Ditunjuk' : 'Wakil Ketua'}
                      </span>
                    </td>
                    <td className="p-3 text-on-surface">{h.pejabatPlh}</td>
                    <td className="p-3 text-outline">{h.tanggalMulai} s/d {h.tanggalSelesai}</td>
                    <td className="p-3 text-outline max-w-xs truncate">{h.keterangan}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-surface text-outline border border-outline-subtle text-[10px] font-bold">
                        {h.status || 'Selesai'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
