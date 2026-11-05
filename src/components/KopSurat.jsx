import React from 'react';
import logoInstansi from '../assets/logo-instansi.png';

export default function KopSurat({ className = '', compact = false }) {
  return (
    <div className={`kop-surat-resmi text-black ${className}`}>
      <div className={`flex items-center justify-center gap-3 sm:gap-6 ${compact ? 'pb-1' : 'pb-2'}`}>
        {/* Logo Instansi Pengadilan Agama Lumajang */}
        <div className="shrink-0">
          <img
            src={logoInstansi}
            alt="Logo Pengadilan Agama Lumajang"
            className={`${
              compact ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-20 h-20 sm:w-24 sm:h-24'
            } object-contain block`}
          />
        </div>

        {/* Teks Identitas Naskah Dinas Peradilan */}
        <div className="text-center flex-1">
          <h3
            className={`${
              compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
            } font-bold uppercase tracking-wider text-black leading-tight font-serif`}
          >
            MAHKAMAH AGUNG REPUBLIK INDONESIA
          </h3>
          <h4
            className={`${
              compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
            } font-bold uppercase tracking-wide text-black leading-tight mt-0.5 font-serif`}
          >
            DIREKTORAT JENDERAL BADAN PERADILAN AGAMA
          </h4>
          <h4
            className={`${
              compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
            } font-bold uppercase tracking-wide text-black leading-tight mt-0.5 font-serif`}
          >
            PENGADILAN TINGGI AGAMA SURABAYA
          </h4>
          <h2
            className={`${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            } font-black uppercase tracking-wider text-black leading-tight mt-1 font-serif`}
          >
            PENGADILAN AGAMA LUMAJANG
          </h2>
          <p
            className={`${
              compact ? 'text-[9.5px] sm:text-[10.5px]' : 'text-[10px] sm:text-[11.5px]'
            } text-neutral-800 leading-tight mt-1.5`}
          >
            Jalan Soekarno Hatta Nomor 11, Selokbesuki, Sukodono, Lumajang, Jawa Timur 67352
          </p>
          <p
            className={`${
              compact ? 'text-[9.5px] sm:text-[10.5px]' : 'text-[10px] sm:text-[11.5px]'
            } text-neutral-800 leading-tight mt-0.5`}
          >
            www.pa-lumajang.go.id, email: pa.lumajang@gmail.com, telepon (0334) 8781874
          </p>
        </div>
      </div>

      {/* Garis Ganda Kop Surat Resmi (Garis tebal atas, garis tipis bawah) */}
      <div className="border-t-[2.5px] border-b-[1px] border-black h-[4px] mt-2 mb-4"></div>
    </div>
  );
}

