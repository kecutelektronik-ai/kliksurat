import React, { useState } from 'react';
import { useSurat, USERS } from '../context/SuratContext';

export default function Akun() {
  const { currentUser, switchUser, showToast } = useSurat();

  const [usersList, setUsersList] = useState([
    {
      id: 'usr-1',
      key: 'petugas',
      name: 'Ahmad Fauzi, S.H.',
      role: 'Petugas Persuratan & Panmud',
      nip: '19880412 201101 1 003',
      dept: 'Subbag Umum & Tata Usaha',
      email: 'ahmad.fauzi@peradilan.go.id',
      phone: '+62 812-3456-7890',
      status: 'Aktif',
      access: ['Surat Masuk', 'Surat Keluar', 'Distribusi', 'Arsip', 'Penomoran', 'WhatsApp'],
    },
    {
      id: 'usr-2',
      key: 'sekretaris',
      name: 'Bpk. H. M. Ridwan, S.H.',
      role: 'Sekretaris Pengadilan',
      nip: '19750824 200212 1 001',
      dept: 'Kesekretariatan',
      email: 'ridwan.sekretaris@peradilan.go.id',
      phone: '+62 813-9876-5432',
      status: 'Aktif',
      access: ['Disposisi', 'Approval Keluar Kesekretariatan', 'Laporan'],
    },
    {
      id: 'usr-3',
      key: 'panitera',
      name: 'Ibu Dra. Hj. Nurjanah, M.H.',
      role: 'Panitera Pengadilan',
      nip: '19780315 200501 2 002',
      dept: 'Kepaniteraan Perkara',
      email: 'nurjanah.panitera@peradilan.go.id',
      phone: '+62 821-4567-8901',
      status: 'Aktif',
      access: ['Disposisi', 'Approval Keluar Perkara', 'Laporan'],
    },
    {
      id: 'usr-4',
      key: 'ketua',
      name: 'Dr. H. Ahmad Zainuddin, S.H., M.H.',
      role: 'Ketua Pengadilan Agama',
      nip: '19690110 199403 1 002',
      dept: 'Pimpinan Pengadilan',
      email: 'ketua@peradilan.go.id',
      phone: '+62 811-2233-4455',
      status: 'Aktif',
      access: ['Semua Akses', 'Disposisi Penuh', 'Persetujuan Akhir', 'Halaman Pimpinan'],
    },
    {
      id: 'usr-5',
      key: 'wakil_ketua',
      name: 'Drs. H. Syamsul Hadi, M.H.',
      role: 'Wakil Ketua Pengadilan',
      nip: '19720516 199803 1 004',
      dept: 'Pimpinan & Pengawasan',
      email: 'wakil.ketua@peradilan.go.id',
      phone: '+62 812-6677-8899',
      status: 'Aktif',
      access: ['Disposisi Delegasi', 'Approval', 'Halaman Pimpinan', 'Pengawasan'],
    },
    {
      id: 'usr-6',
      key: 'hakim_senior',
      name: 'Drs. H. M. Arifin, S.H., M.Hum.',
      role: 'Hakim Senior / Hakim yang Ditunjuk',
      nip: '19700612 199603 1 001',
      dept: 'Kepaniteraan & Hakim Peradilan',
      email: 'm.arifin.hakim@peradilan.go.id',
      phone: '+62 813-2244-6688',
      status: 'Aktif',
      access: ['Disposisi Plh (Saat Ditunjuk)', 'Approval Surat Keluar', 'Halaman Pimpinan', 'Laporan'],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Staf Administrasi Persuratan',
    nip: '',
    dept: 'Subbag Umum & Keuangan',
    email: '',
    phone: '',
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.nip) {
      showToast('Harap lengkapi nama dan NIP pegawai', 'warning');
      return;
    }

    const created = {
      id: `usr-${Date.now()}`,
      key: 'petugas',
      name: newUser.name,
      role: newUser.role,
      nip: newUser.nip,
      dept: newUser.dept,
      email: newUser.email || `${newUser.name.toLowerCase().replace(/[\s,.]+/g, '')}@peradilan.go.id`,
      phone: newUser.phone || '+62 8xx-xxxx-xxxx',
      status: 'Aktif',
      access: ['Surat Masuk', 'Distribusi', 'Arsip'],
    };

    setUsersList([...usersList, created]);
    setShowAddModal(false);
    setNewUser({
      name: '',
      role: 'Staf Administrasi Persuratan',
      nip: '',
      dept: 'Subbag Umum & Keuangan',
      email: '',
      phone: '',
    });
    showToast(`Akun aparatur ${created.name} berhasil ditambahkan ke sistem.`);
  };

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
            <span>Akun & Hak Akses</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Pengaturan Akun & Hak Akses Aparatur
          </h2>
          <p className="text-xs md:text-sm text-outline">
            Manajemen identitas aparatur peradilan, matriks izin tugas kedinasan, dan otorisasi tanda tangan elektronik.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Tambah Akun Aparatur</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-card bg-surface-low border border-outline-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">security</span>
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface">Hak Akses Berbasis Jabatan (RBAC)</div>
            <p className="text-xs text-outline">
              Akses halaman disposisi hanya terbuka bagi Ketua, Wakil Ketua, Sekretaris, dan Panitera.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-primary px-3 py-1 bg-white rounded-btn border border-outline-subtle">
          Total {usersList.length} Aparatur Aktif
        </span>
      </div>

      {/* Tabel Akun Aparatur */}
      <div className="bg-white rounded-card border border-outline-subtle shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-surface border-b border-outline-subtle text-on-surface-variant font-semibold text-xs uppercase">
                <th className="py-3 px-4">Nama & NIP</th>
                <th className="py-3 px-4">Peran / Jabatan</th>
                <th className="py-3 px-4">Unit Kerja</th>
                <th className="py-3 px-4">Kontak Dinas</th>
                <th className="py-3 px-4">Hak Akses Modul</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {usersList.map((user) => {
                const isCurrent = currentUser.nip === user.nip;
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-surface/50 transition-colors ${
                      isCurrent ? 'bg-primary-light/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-on-surface flex items-center gap-2">
                        <span>{user.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded text-[10px] bg-primary text-white font-bold">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-outline font-code mt-0.5">NIP: {user.nip}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-primary whitespace-nowrap">
                      {user.role}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">
                      {user.dept}
                    </td>
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      <div>{user.email}</div>
                      <div className="text-outline text-[11px] font-code">{user.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {user.access.map((acc, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-surface border border-outline-subtle text-on-surface-variant font-medium"
                          >
                            {acc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {user.key && (
                        <button
                          onClick={() => switchUser(user.key)}
                          className={`h-8 px-3 rounded-btn text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-primary text-white cursor-default'
                              : 'bg-white border border-primary text-primary hover:bg-primary-light'
                          }`}
                        >
                          {isCurrent ? 'Aktif' : 'Ganti ke Akun Ini'}
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

      {/* Modal Tambah Akun */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-card shadow-xl border border-outline-subtle max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
              <h3 className="text-base font-bold text-on-surface">Tambah Akun Aparatur Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Contoh: Siti Rahmawati, S.H."
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Nomor Induk Pegawai (NIP)</label>
                <input
                  type="text"
                  required
                  value={newUser.nip}
                  onChange={(e) => setNewUser({ ...newUser, nip: e.target.value })}
                  placeholder="19920101 201601 2 001"
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface font-code outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant">Peran / Jabatan</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-medium outline-none"
                  >
                    <option value="Petugas Persuratan">Petugas Persuratan</option>
                    <option value="Hakim Anggota">Hakim Anggota</option>
                    <option value="Panitera Pengganti">Panitera Pengganti</option>
                    <option value="Kasubbag Umum & Keuangan">Kasubbag Umum & Keuangan</option>
                    <option value="Kasubbag Kepegawaian">Kasubbag Kepegawaian</option>
                    <option value="Kasubbag TI & Perencanaan">Kasubbag TI & Perencanaan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant">Unit Kerja</label>
                  <input
                    type="text"
                    value={newUser.dept}
                    onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant">Email Dinas</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="nama@peradilan.go.id"
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface-variant">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-surface text-on-surface font-code outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-btn bg-success text-white text-xs font-bold hover:bg-success-dark shadow-2xs transition-colors"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
