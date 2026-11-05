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

        {/* Teks Identitas Naskah Dinas Peradilan (Font 13pt, Spasi Paragraf Single) */}
        <div className="text-center flex-1" style={{ lineHeight: '1.15' }}>
          <div
            style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }}
            className="font-bold uppercase tracking-wide text-black font-serif"
          >
            MAHKAMAH AGUNG REPUBLIK INDONESIA
          </div>
          <div
            style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }}
            className="font-bold uppercase tracking-wide text-black font-serif"
          >
            DIREKTORAT JENDERAL BADAN PERADILAN AGAMA
          </div>
          <div
            style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }}
            className="font-bold uppercase tracking-wide text-black font-serif"
          >
            PENGADILAN TINGGI AGAMA SURABAYA
          </div>
          <div
            style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }}
            className="font-bold uppercase tracking-wide text-black font-serif"
          >
            PENGADILAN AGAMA LUMAJANG
          </div>
          <div
            style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: '3px 0 0 0', padding: 0 }}
            className="text-neutral-900 font-sans"
          >
            Jalan Soekarno Hatta Nomor 11, Selokbesuki, Sukodono, Lumajang, Jawa Timur 67352
          </div>
          <div
            style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: 0, padding: 0 }}
            className="text-neutral-900 font-sans"
          >
            www.pa-lumajang.go.id, email: pa.lumajang@gmail.com, telepon (0334) 8781874
          </div>
        </div>
      </div>

      {/* Garis Ganda Kop Surat Resmi (Garis tebal atas, garis tipis bawah) */}
      <div className="border-t-[2.5px] border-b-[1px] border-black h-[4px] mt-2 mb-4"></div>
    </div>
  );
}
