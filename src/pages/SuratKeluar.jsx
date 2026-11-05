import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function SuratKeluar() {
  const {
    suratKeluar,
    addSuratKeluarDraft,
    approveAndNumberSuratKeluar,
    nomorConfig,
    currentUser,
    plhConfig,
    showToast,
  } = useSurat();

  const [form, setForm] = useState({
    tujuanSurat: '',
    perihal: '',
    unitPengusul: currentUser.department,
    kodeKlasifikasi: 'HK.01',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    sifat: 'biasa',
    lampiran: '1 Berkas Lampiran',
  });

  const [showForm, setShowForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleCreateDraft = (e) => {
    e.preventDefault();
    if (!form.tujuanSurat || !form.perihal) {
      showToast('Harap lengkapi tujuan dan perihal surat keluar', 'warning');
      return;
    }

    addSuratKeluarDraft(form);
    setForm({
      tujuanSurat: '',
      perihal: '',
      unitPengusul: currentUser.department,
      kodeKlasifikasi: 'HK.01',
      tanggalSurat: new Date().toISOString().slice(0, 10),
      sifat: 'biasa',
      lampiran: '1 Berkas',
    });
    setShowForm(false);
  };

  const isLeader =
    currentUser.roleKey === 'ketua' ||
    currentUser.roleKey === 'wakil_ketua' ||
    currentUser.roleKey === 'sekretaris' ||
    currentUser.roleKey === 'panitera' ||
    (currentUser.roleKey === 'hakim_senior' && plhConfig?.isActive && plhConfig?.tipePelimpahan === 'hakim_ditunjuk');

  const filteredSurat = suratKeluar.filter(
    (s) =>
      s.nomorSurat.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.tujuanSurat.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.pembuat.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Surat Keluar</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Penomoran & Register</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Manajemen Surat Keluar</h2>
          <p className="text-xs md:text-sm text-outline">
            Pengajuan naskah dinas, alur persetujuan atasan, penomoran otomatis, dan register surat keluar peradilan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('laporan')}
            className="h-10 px-3.5 rounded-btn bg-white border border-outline-subtle text-primary hover:bg-surface text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Buka buku agenda rekapitulasi surat keluar per bulan dan per kode surat"
          >
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            <span>Rekap Bulanan & Kode</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showForm ? 'expand_less' : 'add'}
            </span>
            <span>{showForm ? 'Tutup Formulir' : '+ Ajukan Surat Keluar'}</span>
          </button>
        </div>
      </div>

      {/* Information Banner: Aturan Penomoran Otomatis */}
      <div className="p-4 rounded-card bg-primary-light/40 border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">format_list_numbered</span>
          </div>
          <div>
            <div className="font-bold text-on-surface text-sm">
              SOP Penomoran Surat Keluar Otomatis
            </div>
            <p className="text-on-surface-variant">
              Nomor urut resmi diterbitkan sistem secara otomatis setelah naskah dinas disetujui atasan/pimpinan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-code font-bold bg-white px-2.5 py-1 rounded border border-outline-subtle text-primary">
            Prefix: {nomorConfig.kodePrefix}
          </span>
        </div>
      </div>

      {/* Form Pengajuan Draf Surat Keluar */}
      {showForm && (
        <div className="bg-white rounded-card border border-outline-subtle shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-outline-subtle pb-3">
            <h3 className="text-sm md:text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
              Formulir Konsep Draf Surat Keluar
            </h3>
            <span className="text-xs text-outline">Status Awal: Menunggu Persetujuan Atasan</span>
          </div>

          <form onSubmit={handleCreateDraft} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Instansi / Pihak Tujuan Surat <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.tujuanSurat}
                  onChange={(e) => setForm({ ...form, tujuanSurat: e.target.value })}
                  placeholder="Contoh: Mahkamah Agung RI / PTA Surabaya"
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">
                  Kode Klasifikasi Tata Persuratan <span className="text-danger">*</span>
                </label>
                <select
                  value={form.kodeKlasifikasi}
                  onChange={(e) => setForm({ ...form, kodeKlasifikasi: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                >
                  {nomorConfig.klasifikasi.map((k) => (
                    <option key={k.kode} value={k.kode}>
                      {k.kode} - {k.nama} (No. Terakhir: {k.counter})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-on-surface-variant">
                  Perihal Naskah Dinas Keluar <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={form.perihal}
                  onChange={(e) => setForm({ ...form, perihal: e.target.value })}
                  placeholder="Isi uraian ringkas perihal surat dinas..."
                  className="w-full p-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Unit Kerja Pengusul</label>
                <input
                  type="text"
                  value={form.unitPengusul}
                  onChange={(e) => setForm({ ...form, unitPengusul: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Lampiran Berkas</label>
                <input
                  type="text"
                  value={form.lampiran}
                  onChange={(e) => setForm({ ...form, lampiran: e.target.value })}
                  placeholder="Contoh: 1 Berkas Proposal"
                  className="w-full h-10 px-3 rounded-btn bg-white border border-outline-subtle text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-subtle">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
              >
                Batal
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Ajukan Draf ke Atasan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Register Surat Keluar */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-outline-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">Buku Register Surat Keluar Resmi</h3>
            <p className="text-xs text-outline">Daftar penomoran surat keluar dan status persetujuan pejabat pengesah</p>
          </div>

          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari nomor, perihal, tujuan..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-outline-subtle text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nomor Surat Resmi</th>
                <th className="py-3 px-4">Tujuan Surat</th>
                <th className="py-3 px-4">Perihal</th>
                <th className="py-3 px-4">Pembuat & Unit</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status & Pengesahan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredSurat.map((item) => {
                const isApproved = item.status === 'Disetujui & Diterbitkan Nomor';
                return (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isApproved ? (
                        <div className="font-bold text-primary font-code text-xs">
                          {item.nomorSurat}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-warning-light px-2 py-0.5 rounded border border-warning/40">
                          <span className="material-symbols-outlined text-[14px]">pending</span>
                          <span>{item.nomorSurat}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-outline mt-0.5">Klasifikasi: {item.kodeKlasifikasi}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold whitespace-nowrap">{item.tujuanSurat}</td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-on-surface truncate" title={item.perihal}>
                        {item.perihal}
                      </div>
                      <span className="text-[11px] text-outline">{item.lampiran}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="font-semibold text-on-surface">{item.pembuat}</div>
                      <div className="text-[11px] text-outline">{item.unitPengusul}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant font-medium">
                      {item.tanggalSurat}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isApproved ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/30">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Diterbitkan
                          </span>
                          <div className="text-[10px] text-outline mt-0.5">Oleh: {item.disetujuiOleh}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-warning-light text-amber-900 border border-warning/40">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      {!isApproved ? (
                        <button
                          onClick={() => approveAndNumberSuratKeluar(item.id)}
                          className="h-8 px-3 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors"
                          title="Setujui dan beri nomor otomatis"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Setujui & Beri Nomor</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Mencetak warkat ${item.nomorSurat}...`, 'info')}
                          className="h-8 px-3 rounded-btn bg-white border border-outline-subtle text-primary hover:bg-primary-light text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span>
                          <span>Cetak Surat</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
