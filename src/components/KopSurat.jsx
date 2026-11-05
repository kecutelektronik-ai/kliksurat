import React from 'react';
import logoInstansi from '../assets/logo-instansi.png';

export default function KopSurat({ className = '', compact = false }) {
  return (
    <div className={`kop-surat-resmi text-black ${className}`}>
      <div className="flex items-center justify-center gap-4 sm:gap-6 pb-2">
        {/* Logo Instansi Pengadilan Agama Lumajang */}
        <div className="shrink-0">
          <img
            src={logoInstansi}
            alt="Logo Pengadilan Agama Lumajang"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain block"
          />
        </div>

        {/* Teks Identitas Naskah Dinas Peradilan (Ukuran Font 13pt) */}
        <div className="text-center flex-1">
          <h3
            style={{ fontSize: '13pt' }}
            className="font-bold uppercase tracking-wider text-black leading-snug font-serif"
          >
            MAHKAMAH AGUNG REPUBLIK INDONESIA
          </h3>
          <h4
            style={{ fontSize: '13pt' }}
            className="font-bold uppercase tracking-wide text-black leading-snug mt-0.5 font-serif"
          >
            DIREKTORAT JENDERAL BADAN PERADILAN AGAMA
          </h4>
          <h4
            style={{ fontSize: '13pt' }}
            className="font-bold uppercase tracking-wide text-black leading-snug mt-0.5 font-serif"
          >
            PENGADILAN TINGGI AGAMA SURABAYA
          </h4>
          <h2
            style={{ fontSize: '13pt' }}
            className="font-bold uppercase tracking-wider text-black leading-snug mt-0.5 font-serif"
          >
            PENGADILAN AGAMA LUMAJANG
          </h2>
          <p className="text-[10px] sm:text-[11px] text-neutral-800 leading-tight mt-1.5 font-sans">
            Jalan Soekarno Hatta Nomor 11, Selokbesuki, Sukodono, Lumajang, Jawa Timur 67352
          </p>
          <p className="text-[10px] sm:text-[11px] text-neutral-800 leading-tight mt-0.5 font-sans">
            www.pa-lumajang.go.id, email: pa.lumajang@gmail.com, telepon (0334) 8781874
          </p>
        </div>
      </div>

      {/* Garis Ganda Kop Surat Resmi (Garis tebal atas, garis tipis bawah) */}
      <div className="border-t-[2.5px] border-b-[1px] border-black h-[4px] mt-2 mb-4"></div>
    </div>
  );
}
