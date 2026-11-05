import React from 'react';
import { useSurat } from '../context/SuratContext';
import logoAplikasi from '../assets/logo-aplikasi.png';

export default function Sidebar({ isOpenMobile, setIsOpenMobile }) {
  const { currentPage, navigateTo, currentUser, plhConfig } = useSurat();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'surat-masuk', label: 'Surat Masuk', icon: 'inbox' },
    { id: 'surat-keluar', label: 'Surat Keluar', icon: 'outbox' },
    { id: 'distribusi', label: 'Distribusi Surat', icon: 'share' },
    { id: 'disposisi', label: 'Disposisi Surat', icon: 'forward_to_inbox' },
    { id: 'pelacakan', label: 'Pelacakan Surat', icon: 'track_changes' },
    { id: 'arsip', label: 'Arsip Surat', icon: 'archive' },
    { id: 'pengaturan-nomor', label: 'Pengaturan Nomor Surat', icon: 'pin' },
    { id: 'laporan', label: 'Laporan', icon: 'assessment' },
    { id: 'pimpinan', label: 'Halaman Pimpinan', icon: 'shield_person', badge: 'Khusus' },
    {
      id: 'kewenangan-plh',
      label: 'Kewenangan Plh Ketua',
      icon: 'how_to_reg',
      badge: plhConfig?.isActive ? 'Plh' : null
    },
    { id: 'whatsapp', label: 'Pengaturan WhatsApp', icon: 'chat' },
    { id: 'akun', label: 'Akun dan Hak Akses', icon: 'manage_accounts' },
  ];

  const handleNavClick = (id) => {
    navigateTo(id);
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  const handleCreateNew = () => {
    navigateTo('surat-masuk');
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] flex flex-col shrink-0 bg-primary text-white border-r border-primary-dark shadow-md z-50 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4">
          {/* Upper Section */}
          <div className="flex flex-col gap-3">
            {/* Header / Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl shrink-0 overflow-hidden shadow-xs border border-white/20">
                  <img
                    src={logoAplikasi}
                    alt="Logo KlikDispos"
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-base font-extrabold text-white tracking-wide leading-tight">
                    KlikDispos
                  </h1>
                  <p className="text-[10.5px] text-amber-100/80 font-medium leading-tight mt-0.5">
                    <span className="block">Kanal Layanan Instan</span>
                    <span className="block">Kendali Disposisi & Surat</span>
                  </p>
                </div>
              </div>

              {/* Close button on mobile */}
              <button
                className="lg:hidden p-1 rounded-lg text-amber-100/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpenMobile(false)}
                title="Tutup Menu"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick CTA: Buat Surat Baru */}
            <div className="pt-1">
              <button
                onClick={handleCreateNew}
                className="w-full h-10 px-4 rounded-btn bg-warning hover:bg-warning-dark text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-150 active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                <span>Buat Surat Baru</span>
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 mt-1 text-sm">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-accent text-white font-bold border border-accent-dark shadow-sm'
                        : 'text-stone-200/90 font-medium hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-white fill' : 'text-stone-300'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase bg-warning text-slate-950 shadow-2xs"
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-white/15 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('whatsapp')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 text-sm transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Bantuan Teknis Fonnte</span>
            </button>

            <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse ring-2 ring-white/50"></span>
                <span className="text-stone-200 font-medium">Server PTIP Aktif</span>
              </div>
              <span className="text-stone-300 font-semibold font-code">v2.4-ID</span>
            </div>

            {/* Copyright */}
            <div className="text-center pt-1 text-[11px] leading-tight">
              <p className="font-semibold text-white/90">
                <span className="text-warning font-bold">KlikDispos</span> &copy; MASKOD-2026. Hak Cipta
              </p>
              <p className="font-semibold text-white/90 mt-0.5">
                Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
