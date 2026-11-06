import React, { useState } from 'react';
import { useSurat, getAllowedMenusForRole } from './context/SuratContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuratMasuk from './pages/SuratMasuk';
import SuratKeluar from './pages/SuratKeluar';
import Distribusi from './pages/Distribusi';
import Disposisi from './pages/Disposisi';
import Pelacakan from './pages/Pelacakan';
import Arsip from './pages/Arsip';
import PengaturanNomor from './pages/PengaturanNomor';
import Laporan from './pages/Laporan';
import Pimpinan from './pages/Pimpinan';
import PelimpahanKewenangan from './pages/PelimpahanKewenangan';
import Akun from './pages/Akun';
import WhatsApp from './pages/WhatsApp';

export default function App() {
  const { isLoggedIn, currentPage, currentUser } = useSurat();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // If user is logged out or navigating to login page, show Login screen
  if (!isLoggedIn || currentPage === 'login') {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  const allowedMenus = getAllowedMenusForRole(currentUser?.roleKey);
  const activePage = allowedMenus.includes(currentPage) ? currentPage : 'dashboard';

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'surat-masuk':
        return <SuratMasuk />;
      case 'surat-keluar':
        return <SuratKeluar />;
      case 'distribusi':
        return <Distribusi />;
      case 'disposisi':
        return <Disposisi />;
      case 'pelacakan':
        return <Pelacakan />;
      case 'arsip':
        return <Arsip />;
      case 'pengaturan-nomor':
        return <PengaturanNomor />;
      case 'laporan':
        return <Laporan />;
      case 'pimpinan':
        return <Pimpinan />;
      case 'kewenangan-plh':
        return <PelimpahanKewenangan />;
      case 'whatsapp':
        return <WhatsApp />;
      case 'akun':
        return <Akun />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* 280px Persistent Sidebar on desktop & drawer on mobile */}
      <Sidebar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface">
        {/* Sticky Header with Search, Date, Notifications, and Role Switcher */}
        <Header onOpenMobileMenu={() => setIsOpenMobile(true)} />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Toast Component */}
      <Toast />
    </div>
  );
}
