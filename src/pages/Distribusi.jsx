import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function Distribusi() {
  const { suratMasuk, showToast } = useSurat();

  const [distribusiItems, setDistribusiItems] = useState([
    {
      id: 'DST-001',
      suratId: 'SM-001',
      nomorSurat: '012/PA.Lmg/X/2026',
      perihal: 'Undangan Rapat Koordinasi Pembinaan Wilayah Hukum PTA Surabaya',
      unitTujuan: 'Kesekretariatan (Bpk. H. M. Ridwan, S.H.)',
      tanggalKirim: '20 Okt 2026 10:20 WIB',
      penerima: 'H. M. Ridwan, S.H.',
      status: 'Diterima',
      waktuTerima: '20 Okt 2026 10:45 WIB',
      catatan: 'Disposisi Ketua ditindaklanjuti untuk penyiapan bahan rakor',
    },
    {
      id: 'DST-002',
      suratId: 'SM-001',
      nomorSurat: '012/PA.Lmg/X/2026',
      perihal: 'Undangan Rapat Koordinasi Pembinaan Wilayah Hukum PTA Surabaya',
      unitTujuan: 'Kepaniteraan (Ibu Dra. Hj. Nurjanah, M.H.)',
      tanggalKirim: '20 Okt 2026 10:20 WIB',
      penerima: 'Dra. Hj. Nurjanah, M.H.',
      status: 'Diterima',
      waktuTerima: '20 Okt 2026 11:10 WIB',
      catatan: 'Bahan laporan e-Court & perkara siap dipresentasikan',
    },
    {
      id: 'DST-003',
      suratId: 'SM-003',
      nomorSurat: '042/KP.02/X/2026',
      perihal: 'Verifikasi Berkas Usulan Kenaikan Pangkat Hakim & Aparatur PNS',
      unitTujuan: 'Subbag Kepegawaian & Ortala',
      tanggalKirim: '19 Okt 2026 09:00 WIB',
      penerima: 'Staf Kepegawaian',
      status: 'Sedang Diproses',
      waktuTerima: '19 Okt 2026 09:30 WIB',
      catatan: 'Pemeriksaan berkas SKP & e-Kinerja aparatur',
    },
    {
      id: 'DST-004',
      suratId: 'SM-002',
      nomorSurat: '047/UM.01/X/2026',
      perihal: 'Pemberitahuan Kegiatan Sosialisasi PTSP Ramah Disabilitas',
      unitTujuan: 'Pimpinan (Ketua & Panitera)',
      tanggalKirim: '20 Okt 2026 09:30 WIB',
      penerima: 'Menunggu Konfirmasi',
      status: 'Pending',
      waktuTerima: '-',
      catatan: 'Menunggu arahan disposisi dari Ketua Pengadilan',
    }
  ]);

  const [selectedSurat, setSelectedSurat] = useState('SM-001');
  const [selectedUnit, setSelectedUnit] = useState('Kesekretariatan');
  const [catatanPengiriman, setCatatanPengiriman] = useState('');

  const handleKirimDistribusi = (e) => {
    e.preventDefault();
    const surat = suratMasuk.find(s => s.id === selectedSurat);
    if (!surat) return;

    const newItem = {
      id: `DST-${Date.now()}`,
      suratId: surat.id,
      nomorSurat: surat.nomorSurat,
      perihal: surat.perihal,
      unitTujuan: selectedUnit,
      tanggalKirim: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      penerima: 'Petugas / Pejabat Terkait',
      status: 'Pending',
      waktuTerima: '-',
      catatan: catatanPengiriman || 'Diteruskan sesuai alur tata persuratan dinas',
    };

    setDistribusiItems([newItem, ...distribusiItems]);
    setCatatanPengiriman('');
    showToast(`Surat ${surat.nomorSurat} berhasil didistribusikan ke ${selectedUnit}`, 'success');
  };

  const handleTandaTerima = (id) => {
    setDistribusiItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Diterima',
          waktuTerima: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          penerima: 'Telah Ditandatangani Digital'
        };
      }
      return item;
    }));
    showToast('Tanda terima digital berhasil diverifikasi & dicatat pada buku ekspedisi.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Distribusi Surat</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Buku Ekspedisi</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Distribusi & Ekspedisi Surat</h2>
          <p className="text-xs md:text-sm text-outline">
            Penyampaian naskah dinas antarpejabat, pembagian berkas ke unit kerja, dan tanda terima elektronik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-btn bg-white border border-outline-subtle hover:bg-surface text-on-surface text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Buku Ekspedisi</span>
          </button>
        </div>
      </div>

      {/* Grid: Form Distribusi & Ringkasan Alur */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-card border border-outline-subtle p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-subtle">
            <span className="material-symbols-outlined text-primary text-[20px]">share</span>
            <h3 className="text-sm font-bold text-on-surface">Form Distribusi Surat Baru</h3>
          </div>

          <form onSubmit={handleKirimDistribusi} className="space-y-3.5 text-xs md:text-sm">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Pilih Surat Masuk yang Didistribusikan</label>
              <select
                value={selectedSurat}
                onChange={(e) => setSelectedSurat(e.target.value)}
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
              >
                {suratMasuk.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nomorSurat} - {s.asalSurat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Unit Kerja Tujuan Distribusi</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
              >
                <option value="Kepaniteraan Perkara (Panitera)">Kepaniteraan Perkara (Panitera)</option>
                <option value="Kesekretariatan (Sekretaris)">Kesekretariatan (Sekretaris)</option>
                <option value="Pimpinan (Ketua & Wakil Ketua)">Pimpinan (Ketua & Wakil Ketua)</option>
                <option value="Majelis Hakim / Hakim Pengawas">Majelis Hakim / Hakim Pengawas</option>
                <option value="Subbag Kepegawaian & Ortala">Subbag Kepegawaian & Ortala</option>
                <option value="Subbag Perencanaan, TI & Pelaporan">Subbag Perencanaan, TI & Pelaporan</option>
                <option value="Subbag Umum & Keuangan (Tata Usaha)">Subbag Umum & Keuangan (Tata Usaha)</option>
                <option value="Meja Informasi PTSP">Meja Informasi PTSP</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Catatan / Instruksi Pengiriman</label>
              <textarea
                rows="3"
                value={catatanPengiriman}
                onChange={(e) => setCatatanPengiriman(e.target.value)}
                placeholder="Tuliskan catatan khusus penerusan berkas fisik atau instruksi koordinasi..."
                className="w-full p-3 rounded-btn border border-outline-subtle bg-white text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-btn bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Teruskan Surat ke Unit Tujuan</span>
            </button>
          </form>
        </div>

        {/* Right: Units Matrix Status (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-card bg-surface-low border border-outline-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">hub</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Jalur Distribusi Aktif Kepaniteraan</h4>
                <p className="text-xs text-outline">Real-time update alur perpindahan naskah antar-pejabat</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-success-light text-success border border-success/30 font-bold">
              {distribusiItems.length} Pengiriman Tercatat
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="p-3 bg-white rounded-card border border-outline-subtle shadow-2xs">
              <div className="text-lg font-bold text-success">
                {distribusiItems.filter(i => i.status === 'Diterima').length}
              </div>
              <div className="text-outline font-medium">Telah Diterima</div>
            </div>
            <div className="p-3 bg-white rounded-card border border-outline-subtle shadow-2xs">
              <div className="text-lg font-bold text-warning-dark">
                {distribusiItems.filter(i => i.status === 'Sedang Diproses').length}
              </div>
              <div className="text-outline font-medium">Dalam Proses</div>
            </div>
            <div className="p-3 bg-white rounded-card border border-outline-subtle shadow-2xs">
              <div className="text-lg font-bold text-danger">
                {distribusiItems.filter(i => i.status === 'Pending').length}
              </div>
              <div className="text-outline font-medium">Menunggu Tanda Terima</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Ekspedisi Pengiriman */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-outline-subtle flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface">Catatan Ekspedisi Serah Terima Naskah</h3>
          <span className="text-xs text-outline">Format Standar Buku Ekspedisi MA-RI</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase font-semibold">
                <th className="py-3 px-4">Nomor Ekspedisi</th>
                <th className="py-3 px-4">Surat & Perihal</th>
                <th className="py-3 px-4">Unit Kerja Penerima</th>
                <th className="py-3 px-4">Waktu Dikirim</th>
                <th className="py-3 px-4">Status & Waktu Terima</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {distribusiItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 font-code font-bold text-primary whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-on-surface font-code text-xs">{item.nomorSurat}</div>
                    <div className="text-xs text-on-surface truncate" title={item.perihal}>{item.perihal}</div>
                    <div className="text-[11px] text-outline mt-0.5 italic">"{item.catatan}"</div>
                  </td>
                  <td className="py-3 px-4 font-semibold whitespace-nowrap text-on-surface">
                    {item.unitTujuan}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-outline text-xs">
                    {item.tanggalKirim}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.status === 'Diterima' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-success-light text-success border border-success/30">
                          <span className="material-symbols-outlined text-[13px]">done_all</span>
                          Diterima
                        </span>
                        <div className="text-[10px] text-outline mt-0.5">{item.waktuTerima}</div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-warning-light text-amber-900 border border-warning/40">
                        <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    {item.status !== 'Diterima' ? (
                      <button
                        onClick={() => handleTandaTerima(item.id)}
                        className="h-8 px-2.5 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit_square</span>
                        <span>Paraf Terima</span>
                      </button>
                    ) : (
                      <span className="text-xs text-success font-semibold flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Terverifikasi</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
