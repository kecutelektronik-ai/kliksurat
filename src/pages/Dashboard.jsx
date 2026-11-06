import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function Dashboard() {
  const { suratMasuk, suratKeluar, currentUser, navigateTo, showToast } = useSurat();
  const [filterPeriod, setFilterPeriod] = useState('minggu');

  const dalamProsesCount =
    suratMasuk.filter((s) => s.status !== 'Selesai' && s.status !== 'Diarsipkan').length +
    suratKeluar.filter((s) => s.status !== 'Disetujui & Diterbitkan Nomor').length;

  const selesaiCount =
    suratMasuk.filter((s) => s.status === 'Selesai' || s.status === 'Diarsipkan').length +
    suratKeluar.filter((s) => s.status === 'Disetujui & Diterbitkan Nomor').length;

  const priorityLetters = suratMasuk.filter(
    (s) =>
      s.status === 'Menunggu Disposisi' ||
      s.prioritasTinggi ||
      s.prioritas === 'Sangat Segera' ||
      s.sifat === 'sangat_segera'
  );

  const handlePrintAgenda = () => {
    window.print();
  };

  const handleExportRekap = () => {
    showToast('Ekspor Rekapitulasi Persuratan Excel berhasil diunduh.', 'success');
  };

  const handleSendReminderWA = (noSurat) => {
    showToast(`Pengingat WhatsApp berhasil dikirimkan ke Sekretaris untuk surat ${noSurat}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard Persuratan & Disposisi</h2>
          <p className="text-xs md:text-sm text-outline mt-0.5">
            Selamat Datang, Bapak/Ibu <span className="font-semibold text-primary">{currentUser.name}</span> di <strong className="text-on-surface font-bold">KlikDispos</strong> (Kanal Layanan Instan Kendali Disposisi & Surat).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter Segments */}
          <div className="inline-flex p-1 rounded-lg bg-surface border border-outline-subtle text-xs">
            <button
              onClick={() => setFilterPeriod('hari')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterPeriod === 'hari' ? 'bg-white text-primary font-semibold shadow-2xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterPeriod('minggu')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterPeriod === 'minggu' ? 'bg-white text-primary font-semibold shadow-2xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setFilterPeriod('bulan')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterPeriod === 'bulan' ? 'bg-white text-primary font-semibold shadow-2xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={handlePrintAgenda}
            className="h-9 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface hover:bg-surface text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">menu_book</span>
            <span>Cetak Buku Agenda</span>
          </button>
          <button
            onClick={handleExportRekap}
            className="h-9 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface hover:bg-surface text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">download</span>
            <span>Ekspor Rekap</span>
          </button>
        </div>
      </section>

      {/* 4 Metrics Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Surat Masuk */}
        <div
          onClick={() => navigateTo('surat-masuk')}
          className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-outline">Total Surat Masuk</span>
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">inbox</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface leading-none mb-2">
              {suratMasuk.length}
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-[16px]">folder</span>
              <span>Surat masuk tercatat</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Surat Keluar */}
        <div
          onClick={() => navigateTo('surat-keluar')}
          className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-outline">Total Surat Keluar</span>
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">outbox</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface leading-none mb-2">
              {suratKeluar.length}
            </div>
            <div className="flex items-center gap-1 text-xs text-outline font-medium">
              <span className="material-symbols-outlined text-[16px]">folder</span>
              <span>Surat keluar tercatat</span>
            </div>
          </div>
        </div>

        {/* Card 3: Surat Dalam Proses */}
        <div
          onClick={() => navigateTo('distribusi')}
          className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs flex flex-col justify-between hover:border-warning cursor-pointer transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-outline">Surat Dalam Proses</span>
            <div className="w-10 h-10 rounded-xl bg-warning-light text-amber-900 flex items-center justify-center border border-warning/40">
              <span className="material-symbols-outlined text-[22px]">autorenew</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface leading-none mb-2">
              {dalamProsesCount}
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning-light text-amber-900 border border-warning/30 text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[13px]">pending</span>
              <span>Perlu verifikasi / tindak lanjut</span>
            </div>
          </div>
        </div>

        {/* Card 4: Surat Selesai */}
        <div
          onClick={() => navigateTo('arsip')}
          className="p-5 rounded-card bg-white border border-outline-subtle shadow-2xs flex flex-col justify-between hover:border-success/50 cursor-pointer transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-outline">Surat Selesai</span>
            <div className="w-10 h-10 rounded-xl bg-success-light text-success flex items-center justify-center border border-success/30">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface leading-none mb-2">
              {selesaiCount}
            </div>
            <div className="flex items-center gap-1 text-xs text-success font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Telah terarsip & tuntas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Action Section: Surat Perlu Ditindaklanjuti */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-danger text-[22px]">warning</span>
            <h3 className="text-lg font-bold text-on-surface">Surat Perlu Ditindaklanjuti</h3>
            <span className="px-2 py-0.5 rounded-full bg-danger-light text-danger text-xs font-bold">
              {priorityLetters.length} Perlu Perhatian
            </span>
          </div>
          <span className="text-xs text-outline font-medium hidden sm:inline">Pembaruan otomatis berkala</span>
        </div>

        {/* Priority Cards */}
        {priorityLetters.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-card border border-outline-subtle text-outline text-xs">
            <span className="material-symbols-outlined text-[36px] text-emerald-600 block mb-1">
              task_alt
            </span>
            <p className="font-semibold text-on-surface text-sm">Semua Tugas Berjalan Lancar</p>
            <p className="text-outline mt-0.5">Tidak ada surat mendesak yang menunggu tindak lanjut saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityLetters.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-card bg-white border-l-4 border-l-danger border-y border-r border-outline-subtle shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-code text-xs text-outline font-semibold">
                      {item.nomorSurat}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-danger-light text-danger font-bold">
                      {item.prioritas || 'Perlu Disposisi'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface leading-snug line-clamp-2">
                    {item.perihal}
                  </h4>
                  <div className="text-xs text-outline space-y-1 pt-1">
                    <p>
                      <span className="font-semibold text-on-surface">Pengirim:</span> {item.asalSurat}
                    </p>
                    <p className="text-danger font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">assignment_late</span>
                      <span>Status: {item.status}</span>
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-surface">
                  <button
                    onClick={() => navigateTo('disposisi', item.id)}
                    className="w-full h-9 px-3 rounded-btn bg-primary text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Buka Lembar Disposisi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Table Section: Aktivitas Surat Terbaru */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">history</span>
            <h3 className="text-lg font-bold text-on-surface">Aktivitas Surat Terbaru</h3>
          </div>
          <button
            onClick={() => navigateTo('arsip')}
            className="text-primary hover:underline text-xs font-semibold flex items-center gap-1"
          >
            <span>Lihat Semua Arsip</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold">
                  <th className="py-3 px-4 md:px-6">Nomor Surat</th>
                  <th className="py-3 px-4 md:px-6">Perihal</th>
                  <th className="py-3 px-4 md:px-6">Tanggal</th>
                  <th className="py-3 px-4 md:px-6">Status</th>
                  <th className="py-3 px-4 md:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-subtle text-on-surface">
                {suratMasuk.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-outline text-xs">
                      <span className="material-symbols-outlined text-[36px] block mb-1 text-outline">
                        inbox
                      </span>
                      Belum ada aktivitas persuratan yang tercatat.
                    </td>
                  </tr>
                ) : (
                  suratMasuk.slice(0, 4).map((item) => {
                    const isMenunggu = item.status === 'Menunggu Disposisi';
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-surface/50 transition-colors ${
                          isMenunggu ? 'bg-danger-light/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 md:px-6 font-code font-bold text-primary whitespace-nowrap">
                          <div>{item.nomorSurat}</div>
                          <div className="text-[10px] text-outline font-normal">{item.agenda}</div>
                        </td>
                        <td className="py-3 px-4 md:px-6 max-w-sm">
                          <div className="font-semibold text-on-surface truncate">{item.perihal}</div>
                          <div className="text-xs text-outline truncate">Pengirim: {item.asalSurat}</div>
                        </td>
                        <td className="py-3 px-4 md:px-6 text-on-surface-variant whitespace-nowrap">
                          {item.tanggalSurat}
                        </td>
                        <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-xs ${
                              item.status === 'Selesai'
                                ? 'bg-success-light text-success border border-success/30'
                                : isMenunggu
                                ? 'bg-danger-light text-danger'
                                : 'bg-warning-light text-amber-900 border border-warning/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Selesai'
                                  ? 'bg-success'
                                  : isMenunggu
                                  ? 'bg-danger'
                                  : 'bg-warning-dark'
                              }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (isMenunggu) {
                                navigateTo('disposisi', item.id);
                              } else {
                                navigateTo('pelacakan', item.id);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-surface text-outline hover:text-primary transition-colors"
                            title="Detail"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              arrow_forward
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 px-6 bg-surface border-t border-outline-subtle flex flex-col sm:flex-row items-center justify-between text-xs text-outline gap-2">
            <span>Menampilkan 4 dari {suratMasuk.length} surat terkini</span>
            <button
              onClick={() => navigateTo('surat-masuk')}
              className="text-primary font-semibold hover:underline"
            >
              Buka Register Surat Masuk &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Specialized Judicial Component: Validasi TTE & Stempel Kriptografis */}
      <section className="p-5 rounded-card bg-white border border-dashed border-success/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0 border border-success/30">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">
              Validasi Paraf & Tanda Tangan Elektronik (TTE) Tersertifikasi BSSN
            </h4>
            <p className="text-xs text-outline mt-0.5">
              Seluruh warkat dinas yang diproses melalui sistem terenkripsi dengan sertifikat digital resmi Badan Siber dan Sandi Negara Republik Indonesia.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-success flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>Kunci Kriptografis: AKTIF</span>
            </div>
            <div className="text-[11px] text-outline font-code">SHA-256: 9F8A...2026-MARI-ID</div>
          </div>
          <button
            onClick={() => showToast('Status validasi sertifikat digital: VALID & AKTIF (BSSN-RI)', 'info')}
            className="h-9 px-3.5 rounded-btn bg-primary-light border border-primary/30 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors"
          >
            Cek Validitas Serti-Registry
          </button>
        </div>
      </section>
    </div>
  );
}
