import React, { useState, useEffect } from 'react';
import { useSurat, USERS } from '../context/SuratContext';
import logoAplikasi from '../assets/logo-aplikasi.png';

export default function Login() {
  const { login, usersList } = useSurat();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#26331C';
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();

    // Cari akun berdasarkan username, email, NIP, atau roleKey
    const matched =
      (usersList || []).find(
        (u) =>
          u.username?.toLowerCase() === cleanUser ||
          u.email?.toLowerCase() === cleanUser ||
          u.nip?.toLowerCase() === cleanUser ||
          u.roleKey?.toLowerCase() === cleanUser
      ) ||
      Object.values(USERS || {}).find(
        (u) =>
          u.username?.toLowerCase() === cleanUser ||
          u.email?.toLowerCase() === cleanUser ||
          u.roleKey?.toLowerCase() === cleanUser
      );

    if (matched) {
      login(matched.roleKey || matched.key || matched.id);
    } else {
      login('sekretaris');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#334426]/30"
      style={{
        backgroundColor: '#26331C',
        background: 'linear-gradient(135deg, #3A4C28 0%, #26331C 50%, #151D0F 100%)',
      }}
    >
      {/* Aksen Latar Belakang Green Olive */}
      <div
        className="absolute -top-36 -left-36 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(84, 108, 62, 0.35)' }}
      />
      <div
        className="absolute -bottom-36 -right-36 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(26, 35, 19, 0.6)' }}
      />

      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-card shadow-2xl border border-[#334426]/20 p-6 md:p-8 space-y-6 relative z-10">
        {/* Emblem & Branding */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-2xl border border-outline-subtle mx-auto overflow-hidden shadow-md">
            <img
              src={logoAplikasi}
              alt="Logo KlikDispos"
              className="w-full h-full object-cover block"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              KlikDispos
            </h1>
            <p className="text-xs text-outline font-medium mt-0.5">
              Kanal Layanan Instan Kendali Disposisi & Surat
            </p>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant">
              Email Kedinasan / NIP / Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                mail
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-btn bg-surface border border-outline-subtle text-sm text-on-surface focus:border-[#334426] focus:ring-2 focus:ring-[#334426]/20 outline-none transition-all"
                placeholder="Contoh: sekretaris@peradilan.go.id atau username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-on-surface-variant">
                Kata Sandi
              </label>
              <a href="#" className="text-[11px] text-[#334426] hover:underline font-semibold">
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-10 rounded-btn bg-surface border border-outline-subtle text-sm text-on-surface focus:border-[#334426] focus:ring-2 focus:ring-[#334426]/20 outline-none transition-all"
                placeholder="Masukkan kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-[#334426] transition-colors p-1"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#334426] focus:ring-[#334426]" />
              <span className="text-on-surface-variant font-medium">Ingat perangkat ini</span>
            </label>
            <span className="text-[11px] text-outline font-medium">Zona Waktu: WIB</span>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-btn text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] hover:brightness-110"
            style={{ backgroundColor: '#334426' }}
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Masuk ke Aplikasi KlikDispos</span>
          </button>
        </form>

        {/* Security Footer */}
        <div className="pt-4 border-t border-outline-subtle text-center space-y-1 text-xs text-outline">
          <div className="flex items-center justify-center gap-1.5 text-success font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Terenkripsi Digital BSSN Republik Indonesia</span>
          </div>
          <p className="text-[11px]">Mahkamah Agung Republik Indonesia &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
