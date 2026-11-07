import React, { useState } from 'react';
import { useSurat, getAllowedMenusForRole } from '../context/SuratContext';

export default function Akun() {
  const {
    usersList,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
    switchUser,
    isAdmin,
    showToast,
  } = useSurat();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('Semua Jabatan');

  // Password Peek State (userId -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    jabatan: 'Sekretaris',
    roleKey: 'sekretaris',
    username: '',
    password: 'password123',
    nip: '',
    email: '',
    status: 'Aktif',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    jabatan: 'Sekretaris',
    roleKey: 'sekretaris',
    username: '',
    password: '',
    nip: '',
    email: '',
    status: 'Aktif',
  });

  const JABATAN_OPTIONS = [
    { label: 'Sekretaris', roleKey: 'sekretaris', color: 'border-amber-300 bg-amber-50 text-amber-900' },
    { label: 'Kasubag Umum', roleKey: 'kasubag_umum', color: 'border-sky-300 bg-sky-50 text-sky-900' },
    { label: 'Petugas Surat', roleKey: 'petugas', color: 'border-teal-300 bg-teal-50 text-teal-900' },
    { label: 'Ketua', roleKey: 'ketua', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
    { label: 'Wakil Ketua', roleKey: 'wakil_ketua', color: 'border-amber-300 bg-amber-50 text-amber-900' },
    { label: 'Plh. Ketua', roleKey: 'hakim_senior', color: 'border-purple-300 bg-purple-50 text-purple-900' },
    { label: 'Panitera', roleKey: 'panitera', color: 'border-rose-300 bg-rose-50 text-rose-900' },
  ];

  const getJabatanColor = (jabatanName, roleKey) => {
    const found = JABATAN_OPTIONS.find(
      (j) => j.label === jabatanName || j.roleKey === roleKey
    );
    return found?.color || 'border-slate-300 bg-slate-50 text-slate-800';
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Filter Users
  const filteredUsers = (usersList || []).filter((user) => {
    const matchesSearch =
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.jabatan || user.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJabatan =
      filterJabatan === 'Semua Jabatan' ||
      (user.jabatan || user.role || '').toLowerCase().includes(filterJabatan.toLowerCase()) ||
      user.roleKey === filterJabatan;

    return matchesSearch && matchesJabatan;
  });

  const activeCount = (usersList || []).filter((u) => u.status === 'Aktif').length;

  // Add Handlers
  const handleOpenAdd = () => {
    setAddForm({
      name: '',
      jabatan: 'Sekretaris',
      roleKey: 'sekretaris',
      username: '',
      password: 'password123',
      nip: '',
      email: '',
      status: 'Aktif',
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.username.trim()) {
      showToast('Nama pegawai dan username wajib diisi', 'warning');
      return;
    }

    const selectedJ = JABATAN_OPTIONS.find((j) => j.label === addForm.jabatan);
    const roleKey = selectedJ ? selectedJ.roleKey : 'petugas';

    const success = addUser({
      ...addForm,
      roleKey,
      role: addForm.jabatan,
    });

    if (success) {
      setShowAddModal(false);
    }
  };

  // Edit Handlers
  const handleOpenEdit = (user) => {
    setEditForm({
      id: user.id,
      name: user.name,
      jabatan: user.jabatan || user.role || 'Sekretaris',
      roleKey: user.roleKey || 'sekretaris',
      username: user.username || '',
      password: user.password || 'password123',
      nip: user.nip || '',
      email: user.email || '',
      status: user.status || 'Aktif',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.username.trim()) {
      showToast('Nama pegawai dan username wajib diisi', 'warning');
      return;
    }

    const selectedJ = JABATAN_OPTIONS.find((j) => j.label === editForm.jabatan);
    const roleKey = selectedJ ? selectedJ.roleKey : editForm.roleKey;

    const success = updateUser(editForm.id, {
      ...editForm,
      roleKey,
      role: editForm.jabatan,
    });

    if (success) {
      setShowEditModal(false);
    }
  };

  // Delete Handler
  const handleDelete = (user) => {
    if (window.confirm(`Yakin ingin menghapus akun pengelola "${user.name}" (${user.jabatan || user.role})?`)) {
      deleteUser(user.id);
    }
  };

  const getMenuSummaryText = (roleKey) => {
    switch (roleKey) {
      case 'kasubag_umum':
      case 'sekretaris':
      case 'admin':
        return 'Seluruh Menu Aplikasi (Admin: Lihat, Tambah, Edit, Hapus Data Penuh)';
      case 'petugas':
        return 'Dashboard, Surat Masuk, Surat Keluar, Distribusi Surat, Pelacakan Surat, Arsip Surat, Kewenangan Plh Ketua';
      case 'ketua':
      case 'wakil_ketua':
      case 'hakim_senior':
      case 'plh_ketua':
        return 'Dashboard, Surat Masuk, Halaman Pimpinan, Arsip Surat';
      case 'panitera':
        return 'Dashboard, Surat Masuk, Disposisi Surat';
      default:
        return 'Dashboard, Surat Masuk';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Penjelasan Hak Akses Seperti Referensi */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-outline-subtle shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
            <span className="material-symbols-outlined text-[22px]">key</span>
          </div>
          <div>
            <h2 className="text-sm md:text-base font-extrabold text-on-surface">
              Manajemen Akun Pengelola & Kredensial Aparatur
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Wewenang khusus Admin/Ketua untuk mendaftarkan akun baru (<strong>Create</strong>), melihat kredensial (<strong>Read</strong>), memperbarui data &amp; sandi (<strong>Update</strong>), serta menghapus akun pengelola (<strong>Delete</strong>).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="h-10 px-4 rounded-lg bg-[#0B7A48] hover:bg-[#096038] text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            title="Tambah akun pengelola baru ke sistem"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Tambah Akun Pengelola</span>
          </button>
        </div>
      </div>

      {/* Matriks Ringkasan Hak Akses Berdasarkan Aturan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Kasubag Umum &amp; Sekretaris
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">Admin</span>
          </div>
          <p className="text-emerald-950 font-medium text-[11px] leading-tight">
            Melihat seluruh menu aplikasi, menambah, edit, dan hapus seluruh data master &amp; naskah.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-teal-50/80 border border-teal-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
              Petugas Surat
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-700 text-white font-bold">7 Menu</span>
          </div>
          <p className="text-teal-950 font-medium text-[11px] leading-tight">
            Dashboard, Surat Masuk, Surat Keluar, Distribusi Surat, Pelacakan Surat, Arsip Surat, dan Kewenangan Plh Ketua.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
              Ketua, Wakil, Plh Ketua
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-700 text-white font-bold">4 Menu</span>
          </div>
          <p className="text-amber-950 font-medium text-[11px] leading-tight">
            Dashboard, Surat Masuk, Halaman Pimpinan, dan Arsip Surat.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-purple-50/80 border border-purple-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">assignment</span>
              Panitera
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-700 text-white font-bold">3 Menu</span>
          </div>
          <p className="text-purple-950 font-medium text-[11px] leading-tight">
            Dashboard, Surat Masuk, dan Disposisi Surat.
          </p>
        </div>
      </div>

      {/* Bar Pencarian, Filter Jabatan & Indikator Jumlah Akun (Persis Referensi) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-outline-subtle shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
          {/* Input Cari */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, jabatan, username..."
              className="w-full h-9 pl-9 pr-3 rounded-btn bg-surface border border-outline-subtle text-xs md:text-sm text-on-surface focus:bg-white focus:border-primary outline-none"
            />
          </div>

          {/* Filter Dropdown Jabatan */}
          <div className="relative">
            <select
              value={filterJabatan}
              onChange={(e) => setFilterJabatan(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-btn bg-surface border border-outline-subtle text-xs font-semibold text-on-surface focus:bg-white outline-none appearance-none cursor-pointer"
            >
              <option value="Semua Jabatan">Semua Jabatan</option>
              {JABATAN_OPTIONS.map((j) => (
                <option key={j.label} value={j.label}>
                  {j.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-outline pointer-events-none">
              tune
            </span>
          </div>
        </div>

        {/* Badges Total & Aktif */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full shadow-2xs">
            Total: {filteredUsers.length} Akun
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            {activeCount} Aktif
          </span>
        </div>
      </div>

      {/* Tabel Akun Pengelola Seperti Gambar Referensi */}
      <div className="bg-white rounded-xl border border-outline-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            {/* Header Gelap Mewah Persis Referensi */}
            <thead>
              <tr className="bg-[#0B3B24] text-white text-[11px] font-bold tracking-wider uppercase">
                <th className="py-3 px-4 w-36">JABATAN</th>
                <th className="py-3 px-4">NAMA PEGAWAI</th>
                <th className="py-3 px-4">USERNAME LOGIN</th>
                <th className="py-3 px-4 w-36">KATA SANDI</th>
                <th className="py-3 px-4 text-center w-24">STATUS</th>
                <th className="py-3 px-4 text-right w-44">AKSI (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-on-surface">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-outline">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">
                      person_off
                    </span>
                    Tidak ada akun pengelola yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser.id === user.id || currentUser.roleKey === user.roleKey;
                  const isPasswordVisible = visiblePasswords[user.id];

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-surface/50 transition-colors ${
                        isCurrent ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Kolom JABATAN (Pill Badge) */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getJabatanColor(
                            user.jabatan || user.role,
                            user.roleKey
                          )}`}
                        >
                          {user.jabatan || user.role}
                        </span>
                      </td>

                      {/* Kolom NAMA PEGAWAI */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {user.name}
                          </span>
                          {user.roleKey === 'ketua' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300">
                              Ketua
                            </span>
                          )}
                          {user.isAdmin && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                              Admin
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-800 font-bold border border-cyan-300">
                              Anda
                            </span>
                          )}
                        </div>
                        {(() => {
                          let deptText = (user.department || user.dept || '').trim();
                          // Hilangkan seluruh kata "Tata Usaha" dan variasinya
                          deptText = deptText
                            .replace(/\(?\s*Tata Usaha\s*\)?/gi, '')
                            .replace(/&\s*\(\s*\)/g, '')
                            .replace(/Subbag Umum &\s*\(Persuratan\)/gi, 'Subbag Umum Persuratan')
                            .replace(/&\s*Persuratan/gi, 'Persuratan')
                            .replace(/\s{2,}/g, ' ')
                            .trim();
                          if (deptText === 'Pengadilan Agama' || deptText === '-' || deptText === '&' || !deptText) {
                            deptText = '';
                          }

                          const showNip = user.nip && user.nip !== '-';
                          if (!deptText && !showNip) return null;

                          return (
                            <div className="text-[11px] text-outline mt-0.5 flex items-center gap-2">
                              {deptText ? <span>{deptText}</span> : null}
                              {showNip ? <span className="font-code">NIP: {user.nip}</span> : null}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Kolom USERNAME LOGIN */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-emerald-800 font-semibold text-xs">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            mail
                          </span>
                          <span>{user.username || user.roleKey}</span>
                        </div>
                      </td>

                      {/* Kolom KATA SANDI */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 text-xs">
                            {isPasswordVisible ? (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">
                                {user.password || 'password123'}
                              </span>
                            ) : (
                              '••••••••'
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 rounded text-outline hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title={isPasswordVisible ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isPasswordVisible ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Kolom STATUS */}
                      <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
                            user.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {user.status || 'Aktif'}
                        </span>
                      </td>

                      {/* Kolom AKSI (CRUD) - Persis Referensi: Tombol Hijau Edit Akun & Pink Hapus */}
                      <td className="py-3.5 px-4 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="h-8 px-3 rounded-full bg-[#0B7A48] hover:bg-[#096038] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                            title="Edit data akun & kata sandi"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            <span>Edit Akun</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="h-8 px-3 rounded-full border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                            title="Hapus akun pengelola ini"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Akun Pengelola Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-subtle max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[22px]">person_add</span>
                <h3 className="text-base font-bold text-on-surface">Tambah Akun Pengelola Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">
                  Nama Lengkap &amp; Gelar <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Contoh: Dr. Rozy Alifian Mukhtar, S.H., M.Kn."
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Jabatan / Peran <span className="text-danger">*</span>
                  </label>
                  <select
                    value={addForm.jabatan}
                    onChange={(e) => {
                      const selectedJ = JABATAN_OPTIONS.find((j) => j.label === e.target.value);
                      setAddForm({
                        ...addForm,
                        jabatan: e.target.value,
                        roleKey: selectedJ ? selectedJ.roleKey : 'petugas',
                      });
                    }}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-semibold outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    {JABATAN_OPTIONS.map((j) => (
                      <option key={j.label} value={j.label}>
                        {j.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Status Akun</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-semibold outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Username Login <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    placeholder="Contoh: sekretaris"
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white font-mono text-on-surface outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Kata Sandi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white font-mono text-on-surface outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Preview Hak Akses Berdasarkan Jabatan */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Hak Akses Menu Otomatis:</span>
                </div>
                <p className="text-emerald-950 font-medium">
                  {getMenuSummaryText(addForm.roleKey)}
                </p>
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
                  className="h-9 px-5 rounded-btn bg-[#0B7A48] hover:bg-[#096038] text-white text-xs font-bold shadow-2xs transition-colors"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Akun Pengelola */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-outline-subtle max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[22px]">edit</span>
                <h3 className="text-base font-bold text-on-surface">Edit Akun Pengelola &amp; Kredensial</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">
                  Nama Lengkap &amp; Gelar <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Jabatan / Peran <span className="text-danger">*</span>
                  </label>
                  <select
                    value={editForm.jabatan}
                    onChange={(e) => {
                      const selectedJ = JABATAN_OPTIONS.find((j) => j.label === e.target.value);
                      setEditForm({
                        ...editForm,
                        jabatan: e.target.value,
                        roleKey: selectedJ ? selectedJ.roleKey : 'petugas',
                      });
                    }}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-semibold outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    {JABATAN_OPTIONS.map((j) => (
                      <option key={j.label} value={j.label}>
                        {j.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Status Akun</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white text-on-surface font-semibold outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Username Login <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white font-mono text-on-surface outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">
                    Kata Sandi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-outline-subtle bg-white font-mono text-on-surface outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Preview Hak Akses Berdasarkan Jabatan */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Hak Akses Menu Baru yang Diterapkan:</span>
                </div>
                <p className="text-emerald-950 font-medium">
                  {getMenuSummaryText(editForm.roleKey)}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="h-9 px-4 rounded-btn border border-outline-subtle text-xs font-semibold hover:bg-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-btn bg-[#0B7A48] hover:bg-[#096038] text-white text-xs font-bold shadow-2xs transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
