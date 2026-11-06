import React, { useState, useRef, useEffect } from 'react';
import { useSurat, USERS, getAllowedMenusForRole } from '../context/SuratContext';

export default function Header({ onOpenMobileMenu }) {
  const {
    currentUser,
    switchUser,
    logout,
    navigateTo,
    waSettings,
    suratMasuk,
    plhConfig,
    usersList,
    isAdmin,
  } = useSurat();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allowedMenus = getAllowedMenusForRole(currentUser?.roleKey);

  const roleMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('arsip');
    }
  };

  const pendingLettersCount = suratMasuk.filter(s => s.status === 'Menunggu Disposisi').length;

  return (
    <header className="h-16 px-4 md:px-8 w-full bg-accent text-white border-b border-accent-dark sticky top-0 z-30 shadow-sm flex justify-between items-center gap-4 md:gap-8 select-none">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md lg:max-w-lg">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white focus:outline-none"
          title="Buka Navigasi"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor surat, pengirim, atau agenda..."
            className="w-full h-9 pl-9 pr-4 rounded-btn text-xs md:text-sm bg-white/20 border border-white/25 focus:bg-white focus:text-on-surface focus:placeholder:text-outline text-white placeholder:text-white/70 transition-all outline-none shadow-2xs"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Plh Badge indicator */}
        {plhConfig?.isActive && (
          <button
            onClick={() => navigateTo('kewenangan-plh')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-bold border border-primary-dark shadow-xs transition-all active:scale-[0.98]"
            title="Kewenangan Pimpinan Dilimpahkan (Plh. Ketua)"
          >
            <span className="material-symbols-outlined text-[16px] text-warning font-bold">how_to_reg</span>
            <span>
              Plh. Ketua: {plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim Ditunjuk' : 'Wakil Ketua'}
            </span>
          </button>
        )}

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-warning text-slate-950 text-xs font-bold border border-warning shadow-xs whitespace-nowrap">
          <span className="material-symbols-outlined text-[16px] text-slate-950 font-bold">calendar_today</span>
          <span>Senin, 02 November 2026</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
            title="Pemberitahuan Persuratan"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {pendingLettersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-accent">
                {pendingLettersCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-on-surface rounded-card shadow-xl border border-outline-subtle p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-outline-subtle mb-2">
                <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
                  Pemberitahuan Terkini
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-light text-accent font-bold">
                  {pendingLettersCount} Butuh Tindakan
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {suratMasuk
                  .filter((s) => s.status === 'Menunggu Disposisi')
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigateTo('disposisi', item.id);
                        setShowNotifMenu(false);
                      }}
                      className="p-2.5 rounded-lg bg-surface hover:bg-primary-light/50 border border-outline-subtle cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-primary font-code">{item.nomorSurat}</span>
                        <span className="text-accent uppercase text-[10px] px-1.5 py-0.2 rounded bg-accent-light font-bold">
                          {item.sifat}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                        {item.perihal}
                      </p>
                      <span className="text-[11px] text-outline mt-1 block">
                        Asal: {item.asalSurat}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="pt-2 border-t border-outline-subtle mt-2 text-center">
                <button
                  onClick={() => {
                    navigateTo('surat-masuk');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Lihat Semua Surat Masuk &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Gateway Status Pill */}
        <button
          onClick={() => navigateTo('whatsapp')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold border border-success-dark shadow-xs transition-all active:scale-[0.98]"
          title="Status Gateway WhatsApp Fonnte"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>WA Online</span>
        </button>

        <div className="h-6 w-px bg-white/20"></div>

        {/* User Profile & Demo Role Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/10 transition-all text-left"
            title="Klik untuk Ganti Peran Demo atau Keluar"
          >
            <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor} border border-white/20 flex items-center justify-center font-bold text-xs shadow-2xs`}>
              {currentUser.initials}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-white/80 font-medium leading-tight">
                {currentUser.role}
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-white/80">
              expand_more
            </span>
          </button>

          {/* Role Switcher Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-card shadow-xl border border-outline-subtle p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="pb-2 border-b border-outline-subtle mb-2">
                <div className="text-xs font-bold text-on-surface">Masuk Sebagai:</div>
                <div className="text-xs text-outline">{currentUser.department}</div>
                <div className="text-[10px] text-outline font-code mt-0.5">NIP: {currentUser.nip}</div>
              </div>

              <div className="py-1 max-h-64 overflow-y-auto">
                <div className="text-[11px] font-bold text-outline uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Ganti Peran Pejabat:</span>
                  <span className="text-[10px] text-primary lowercase">{usersList?.length || 7} akun</span>
                </div>
                {(usersList || Object.values(USERS)).map((user) => {
                  const isSelected = currentUser.id === user.id || currentUser.roleKey === user.roleKey;
                  return (
                    <button
                      key={user.id || user.roleKey}
                      onClick={() => {
                        switchUser(user.id || user.roleKey);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-primary-light text-primary font-bold'
                          : 'text-on-surface hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full ${user.avatarColor || 'bg-primary text-white'} text-[10px] flex items-center justify-center font-bold shrink-0`}>
                          {user.initials || 'U'}
                        </span>
                        <div className="truncate">
                          <div className="truncate font-semibold">{user.name}</div>
                          <div className="text-[10px] text-outline flex items-center gap-1">
                            <span>{user.role || user.jabatan}</span>
                            {user.isAdmin && (
                              <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 font-bold">Admin</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-outline-subtle mt-2 flex items-center justify-between">
                {isAdmin ? (
                  <button
                    onClick={() => {
                      navigateTo('akun');
                      setShowRoleMenu(false);
                    }}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">manage_accounts</span>
                    Kelola Akun (Admin)
                  </button>
                ) : (
                  <span className="text-[11px] text-outline font-medium italic">
                    Izin: {currentUser.role}
                  </span>
                )}
                <button
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                  }}
                  className="text-xs text-danger font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
