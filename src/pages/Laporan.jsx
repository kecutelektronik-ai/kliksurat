import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function Laporan() {
  const { suratMasuk, suratKeluar, showToast } = useSurat();

  const [dateStart, setDateStart] = useState('2026-10-01');
  const [dateEnd, setDateEnd] = useState('2026-10-31');
  const [filterType, setFilterType] = useState('semua');

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    showToast('Laporan Rekapitulasi Persuratan Excel berhasil diunduh.', 'success');
  };

  // Combine data
  const combinedReports = [
    ...suratMasuk.map((s) => ({
      tipe: 'Surat Masuk',
      nomorSurat: s.nomorSurat,
      agenda: s.agenda,
      pihak: s.asalSurat,
      perihal: s.perihal,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      status: s.status,
    })),
    ...suratKeluar.map((s) => ({
      tipe: 'Surat Keluar',
      nomorSurat: s.nomorSurat,
      agenda: `SK-${s.nomorUrut || 'DRAFT'}`,
      pihak: s.tujuanSurat,
      perihal: s.perihal,
      tanggal: s.tanggalSurat,
      sifat: s.sifat,
      status: s.status,
    })),
  ];

  const filteredReports = combinedReports.filter((item) => {
    if (filterType === 'masuk') return item.tipe === 'Surat Masuk';
    if (filterType === 'keluar') return item.tipe === 'Surat Keluar';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Laporan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Rekapitulasi Periode</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Laporan & Rekapitulasi Persuratan</h2>
          <p className="text-xs md:text-sm text-outline">
            Laporan berkala naskah dinas masuk dan keluar, analisis durasi disposisi, serta ekspor format resmi A4.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-on-surface hover:bg-surface text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-success">file_download</span>
            <span>Unduh Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-card border border-outline-subtle p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs no-print">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-outline">Dari:</span>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="h-9 px-2.5 rounded border border-outline-subtle bg-surface text-on-surface font-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-outline">Sampai:</span>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="h-9 px-2.5 rounded border border-outline-subtle bg-surface text-on-surface font-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-outline">Jenis:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 px-3 rounded border border-outline-subtle bg-surface text-on-surface font-semibold outline-none"
            >
              <option value="semua">Semua Naskah</option>
              <option value="masuk">Surat Masuk Saja</option>
              <option value="keluar">Surat Keluar Saja</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setDateStart('2026-10-01');
              setDateEnd('2026-10-31');
              showToast('Periode diatur: Oktober 2026');
            }}
            className="px-2.5 py-1 rounded bg-surface hover:bg-surface-low text-on-surface-variant font-medium border border-outline-subtle"
          >
            Bulan Ini
          </button>
          <button
            onClick={() => {
              setDateStart('2026-01-01');
              setDateEnd('2026-12-31');
              showToast('Periode diatur: Tahun 2026 Penuh');
            }}
            className="px-2.5 py-1 rounded bg-surface hover:bg-surface-low text-on-surface-variant font-medium border border-outline-subtle"
          >
            Tahun 2026
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1">Surat Masuk Terdaftar</div>
          <div className="text-2xl font-extrabold text-primary">{suratMasuk.length} Berkas</div>
          <div className="text-success text-[11px] font-semibold mt-1">+100% Tercatat Digital</div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1">Surat Keluar Terbit</div>
          <div className="text-2xl font-extrabold text-on-surface">{suratKeluar.length} Naskah</div>
          <div className="text-outline text-[11px] font-medium mt-1">Otomatisasi Penomoran</div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1">Penyelesaian Disposisi</div>
          <div className="text-2xl font-extrabold text-success">92.4%</div>
          <div className="text-success text-[11px] font-semibold mt-1">Sesuai Tenggat Waktu</div>
        </div>

        <div className="p-4 rounded-card bg-white border border-outline-subtle shadow-2xs">
          <div className="text-outline font-semibold mb-1">Rata-rata Waktu Proses</div>
          <div className="text-2xl font-extrabold text-warning-dark">1.2 Hari</div>
          <div className="text-outline text-[11px] font-medium mt-1">Efisiensi Meningkat 35%</div>
        </div>
      </div>

      {/* Tabel Rekapitulasi (Siap Cetak PDF) */}
      <div className="print-clean bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        {/* Kop Cetak PDF (Only visible on print or preview header) */}
        <div className="p-6 border-b border-outline-subtle text-center">
          <h4 className="text-base font-extrabold uppercase text-on-surface">
            PENGADILAN AGAMA LAMONGAN KELAS I-A
          </h4>
          <h5 className="text-xs font-bold uppercase text-primary tracking-wider mt-0.5">
            Laporan Rekapitulasi Persuratan Resmi Kepaniteraan & Kesekretariatan
          </h5>
          <p className="text-xs text-outline mt-1">
            Periode Tanggal: <strong className="text-on-surface">{dateStart}</strong> s/d{' '}
            <strong className="text-on-surface">{dateEnd}</strong>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Nomor Naskah</th>
                <th className="py-3 px-4">Instansi / Pihak</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Sifat</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredReports.map((item, index) => (
                <tr key={index} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 text-outline font-semibold">{index + 1}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.tipe === 'Surat Masuk'
                          ? 'bg-primary-light text-primary'
                          : 'bg-success-light text-success border border-success/30'
                        }`}
                    >
                      {item.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-code font-bold text-on-surface whitespace-nowrap">
                    {item.nomorSurat}
                  </td>
                  <td className="py-3 px-4 font-semibold whitespace-nowrap">{item.pihak}</td>
                  <td className="py-3 px-4 max-w-xs truncate" title={item.perihal}>
                    {item.perihal}
                  </td>
                  <td className="py-3 px-4 text-outline whitespace-nowrap">{item.tanggal}</td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-warning-dark whitespace-nowrap">
                    {item.sifat}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-xs whitespace-nowrap">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Pejabat Pengesah Laporan */}
        <div className="p-6 border-t border-outline-subtle flex justify-between items-end text-xs">
          <div className="text-outline text-[11px]">
            <div>Dicetak melalui aplikasi KlikDispos (Kanal Layanan Instan Kendali Disposisi & Surat)</div>
            <div>Tanggal Cetak: 02 November 2026 15:45 WIB</div>
          </div>

          <div className="text-center w-56">
            <p className="font-semibold text-on-surface">Mengetahui,</p>
            <p className="font-bold text-on-surface">Sekretaris Pengadilan Agama Lamongan</p>
            <div className="h-14 flex items-center justify-center text-primary text-[10px] font-semibold italic">
              [Tanda Tangan Elektronik Sah]
            </div>
            <p className="font-bold underline text-on-surface">H. M. Ridwan, S.H.</p>
            <p className="text-[10px] text-outline">NIP. 19750824 200212 1 001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
