import React, { useState, useEffect } from 'react';
import { useSurat, USERS } from '../context/SuratContext';
import { openWarkatPreview } from '../lib/previewWarkat';
import { PEJABAT_PENERIMA_DISPOSISI_OPTIONS } from '../constants/suratOptions';
import logoInstansi from '../assets/logo-instansi.png';

export default function Disposisi() {
  const {
    suratMasuk,
    disposisiList,
    saveDisposisi,
    activeLetterId,
    setActiveLetterId,
    currentUser,
    plhConfig,
    showToast,
    navigateTo,
  } = useSurat();

  const [selectedLetterId, setSelectedLetterId] = useState(activeLetterId || suratMasuk[0]?.id || '');

  const currentSurat = suratMasuk.find((s) => s.id === selectedLetterId) || suratMasuk[0];
  const existingDisposisi = selectedLetterId ? disposisiList[selectedLetterId] : null;

  // 18 Petunjuk Resmi Mahkamah Agung (Gambar 26 Pedoman Tata Naskah Dinas MARI)
  const OFFICIAL_PETUNJUK = [
    'Setuju sesuai ketentuan yang berlaku',
    'Tolak sesuai ketentuan yang berlaku',
    'Selesaikan sesuai ketentuan yang berlaku',
    'Jawab sesuai ketentuan yang berlaku',
    'Perbaiki',
    'Teliti & pendapat',
    'Sesuai catatan',
    'Untuk perhatian',
    'Untuk diketahui',
    'Edarkan',
    'Bicarakan dengan saya',
    'Bicarakan bersama dan laporkan hasilnya',
    'Dijadwalkan',
    'Simpan',
    'Disiapkan',
    'Ingatkan',
    'Harap dihadiri/diwakili',
    'Asli kepada',
  ];

  // 10 Jabatan Penerima Disposisi Resmi Pengadilan Agama
  const OFFICIAL_RECIPIENTS = PEJABAT_PENERIMA_DISPOSISI_OPTIONS;

  // Active Stage Tab in Workflow: 2 (Sekretaris), 3 (Ketua), 4 (Pengarsipan Kasubag)
  const [activeTahap, setActiveTahap] = useState(3);

  // State Formulir Alur Disposisi
  const [form, setForm] = useState({
    sifatDisposisi: 'segera',
    // Tahap 1: Registrasi
    disposisiAwalKe: 'Sekretaris',
    petugasRegistrasi: 'Ahmad Fauzi, S.H.',
    tanggalKirim: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    diterimaOleh: 'Sekretaris (Penanggung Jawab Surat)',

    // Tahap 2: Catatan / Telaah Sekretaris / Plh
    catatanSekretaris: 'Telah diteliti berkas naskah dinas sesuai tata persuratan. Diajukan kepada Yth. Ketua Pengadilan untuk arahan dan petunjuk tindak lanjut.',
    penelaahSekretaris: 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
    tanggalTelaahSekretaris: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    tujuanPimpinan: 'Ketua Pengadilan',

    // Tahap 3: Perintah Tindak Lanjut Pimpinan (Ketua / Wakil Ketua / Plh)
    pilihanTindakLanjut: 'Keduanya', // 'Sekretaris' | 'Panitera' | 'Keduanya'
    diteruskanKepada: ['Sekretaris', 'Panitera'],
    petunjukPilihan: ['Selesaikan sesuai ketentuan yang berlaku', 'Tanggapi & tindak lanjuti'],
    isiArahan: '1. Tindak lanjuti segera sesuai ketentuan yang berlaku.\n2. Siapkan data dukung dan laporkan hasil pelaksanaannya kepada pimpinan.',
    catatanKhusus: 'Koordinasikan penerbitan Surat Tugas (ST) jika terdapat penugasan dinas.',
    asliKepada: '',

    // Tahap 4: Disposisi Pengarsipan oleh Sekretaris ke Kasubag Umum & Keuangan
    disposisiKeArsip: 'Kepala Subbagian Umum dan Keuangan',
    catatanPengarsipan: 'Telah selesai ditindaklanjuti. Harap dicatat dalam buku agenda dan simpan/arsipkan warkat dinas fisik serta pindaian digital pada berkas naskah dinas aktif.',
    lokasiArsip: 'Boks Arsip Umum 2026 / Warkat Aktif',
    tanggalArsip: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    petugasArsip: 'Budi Santoso, S.Kom. (Kasubag Umum & Keuangan)',
    isArchived: false,

    diajukanKembali: '',
    diterimaTanggal: '',
    tanggalKembali: '',
    diterimaKembaliOleh: '',
  });

  // Sync state when selected letter or existing disposisi changes
  useEffect(() => {
    const prioritasIsSangatSegera =
      currentSurat?.prioritas === 'Sangat Segera' || currentSurat?.sifat === 'sangat_segera';
    const defaultSifatDisposisi = prioritasIsSangatSegera ? 'sangat_segera' : 'segera';
    const defaultRecipient = currentSurat?.pejabatPenerima ? [currentSurat.pejabatPenerima] : ['Sekretaris', 'Panitera'];

    if (existingDisposisi) {
      const recs = existingDisposisi.diteruskanKepada || defaultRecipient;
      let pilihan = 'Keduanya';
      if (recs.includes('Sekretaris') && recs.includes('Panitera')) {
        pilihan = 'Keduanya';
      } else if (recs.includes('Panitera')) {
        pilihan = 'Panitera';
      } else if (recs.includes('Sekretaris')) {
        pilihan = 'Sekretaris';
      }

      setForm({
        sifatDisposisi: existingDisposisi.sifatDisposisi || defaultSifatDisposisi,
        disposisiAwalKe: existingDisposisi.disposisiAwalKe || currentSurat?.pejabatPenerima || 'Sekretaris',
        petugasRegistrasi: existingDisposisi.petugasRegistrasi || 'Ahmad Fauzi, S.H.',
        tanggalKirim:
          existingDisposisi.tanggalKirim ||
          new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        diterimaOleh: existingDisposisi.diterimaOleh || 'Sekretaris (Penanggung Jawab Surat)',

        catatanSekretaris:
          existingDisposisi.catatanSekretaris ||
          'Telah diteliti berkas naskah dinas sesuai tata persuratan. Diajukan kepada Yth. Ketua Pengadilan untuk arahan dan petunjuk tindak lanjut.',
        penelaahSekretaris: existingDisposisi.penelaahSekretaris || 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
        tanggalTelaahSekretaris:
          existingDisposisi.tanggalTelaahSekretaris ||
          new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tujuanPimpinan: existingDisposisi.tujuanPimpinan || 'Ketua Pengadilan',

        pilihanTindakLanjut: pilihan,
        diteruskanKepada: recs,
        petunjukPilihan: existingDisposisi.instruksiPilihan || existingDisposisi.petunjukPilihan || [
          'Selesaikan sesuai ketentuan yang berlaku',
          'Tanggapi & tindak lanjuti',
        ],
        isiArahan:
          existingDisposisi.isiArahan ||
          `1. Tindak lanjuti segera terkait ${currentSurat?.perihal || 'naskah dinas'} sesuai ketentuan yang berlaku.\n2. Laporkan hasil pelaksanaannya.`,
        catatanKhusus: existingDisposisi.catatanKhusus || '',
        asliKepada: existingDisposisi.asliKepada || '',

        disposisiKeArsip: existingDisposisi.disposisiKeArsip || 'Kepala Subbagian Umum dan Keuangan',
        catatanPengarsipan:
          existingDisposisi.catatanPengarsipan ||
          'Telah selesai ditindaklanjuti. Harap dicatat dalam buku agenda dan simpan/arsipkan warkat dinas fisik serta pindaian digital pada berkas naskah dinas aktif.',
        lokasiArsip: existingDisposisi.lokasiArsip || 'Boks Arsip Umum 2026 / Warkat Aktif',
        tanggalArsip:
          existingDisposisi.tanggalArsip ||
          new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        petugasArsip: existingDisposisi.petugasArsip || 'Budi Santoso, S.Kom. (Kasubag Umum & Keuangan)',
        isArchived: Boolean(existingDisposisi.isArchived || currentSurat?.status === 'Diarsipkan'),

        diajukanKembali: existingDisposisi.diajukanKembali || '',
        diterimaTanggal: existingDisposisi.diterimaTanggal || '',
        tanggalKembali: existingDisposisi.tanggalKembali || '',
        diterimaKembaliOleh: existingDisposisi.diterimaKembaliOleh || '',
      });

      // Tentukan tahap aktif secara otomatis
      if (existingDisposisi.isArchived || currentSurat?.status === 'Diarsipkan') {
        setActiveTahap(4);
      } else if (currentSurat?.status === 'Dalam Tindak Lanjut' || existingDisposisi.isiArahan) {
        setActiveTahap(3);
      } else if (existingDisposisi.catatanSekretaris || currentSurat?.status === 'Telah Didisposisi') {
        setActiveTahap(3);
      } else {
        setActiveTahap(2);
      }
    } else {
      setForm({
        sifatDisposisi: defaultSifatDisposisi,
        disposisiAwalKe: currentSurat?.pejabatPenerima || 'Sekretaris',
        petugasRegistrasi: 'Ahmad Fauzi, S.H.',
        tanggalKirim: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        diterimaOleh: 'Sekretaris (Penanggung Jawab Surat)',

        catatanSekretaris:
          'Telah diteliti berkas naskah dinas sesuai tata persuratan. Diajukan kepada Yth. Ketua Pengadilan untuk arahan dan petunjuk tindak lanjut.',
        penelaahSekretaris: 'Bpk. H. M. Ridwan, S.H. (Sekretaris)',
        tanggalTelaahSekretaris: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tujuanPimpinan: 'Ketua Pengadilan',

        pilihanTindakLanjut: 'Keduanya',
        diteruskanKepada: ['Sekretaris', 'Panitera'],
        petunjukPilihan: ['Selesaikan sesuai ketentuan yang berlaku', 'Tanggapi & tindak lanjuti'],
        isiArahan: `1. Tindak lanjuti segera terkait ${currentSurat?.perihal || 'naskah dinas'} sesuai ketentuan yang berlaku.\n2. Laporkan hasil pelaksanaannya kepada pimpinan.`,
        catatanKhusus: '',
        asliKepada: '',

        disposisiKeArsip: 'Kepala Subbagian Umum dan Keuangan',
        catatanPengarsipan:
          'Telah selesai ditindaklanjuti. Harap dicatat dalam buku agenda dan simpan/arsipkan warkat dinas fisik serta pindaian digital pada berkas naskah dinas aktif.',
        lokasiArsip: 'Boks Arsip Umum 2026 / Warkat Aktif',
        tanggalArsip: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        petugasArsip: 'Budi Santoso, S.Kom. (Kasubag Umum & Keuangan)',
        isArchived: false,

        diajukanKembali: '',
        diterimaTanggal: '',
        tanggalKembali: '',
        diterimaKembaliOleh: '',
      });
      setActiveTahap(2);
    }
  }, [selectedLetterId, existingDisposisi, currentSurat]);

  // Handler Pilihan Disposisi Tindak Lanjut Pimpinan: Sekretaris / Panitera / Keduanya
  const handlePilihanTindakLanjut = (pilihan) => {
    let newRecipients = [];
    if (pilihan === 'Sekretaris') {
      newRecipients = ['Sekretaris'];
    } else if (pilihan === 'Panitera') {
      newRecipients = ['Panitera'];
    } else if (pilihan === 'Keduanya') {
      newRecipients = ['Sekretaris', 'Panitera'];
    }
    setForm((prev) => ({
      ...prev,
      pilihanTindakLanjut: pilihan,
      diteruskanKepada: newRecipients,
    }));
  };

  const toggleForwardRecipient = (name) => {
    setForm((prev) => {
      const exists = prev.diteruskanKepada.includes(name);
      const updated = exists ? prev.diteruskanKepada.filter((x) => x !== name) : [...prev.diteruskanKepada, name];
      let pil = 'Kustom';
      if (updated.length === 2 && updated.includes('Sekretaris') && updated.includes('Panitera')) {
        pil = 'Keduanya';
      } else if (updated.length === 1 && updated.includes('Sekretaris')) {
        pil = 'Sekretaris';
      } else if (updated.length === 1 && updated.includes('Panitera')) {
        pil = 'Panitera';
      }
      return {
        ...prev,
        pilihanTindakLanjut: pil,
        diteruskanKepada: updated,
      };
    });
  };

  const togglePetunjuk = (petunjuk) => {
    setForm((prev) => {
      const exists = prev.petunjukPilihan.includes(petunjuk);
      return {
        ...prev,
        petunjukPilihan: exists ? prev.petunjukPilihan.filter((x) => x !== petunjuk) : [...prev.petunjukPilihan, petunjuk],
      };
    });
  };

  // 1. Eksekusi Tahap 2: Sekretaris/Plh memberi catatan & mendisposisi ke Ketua/Wakil/Plh
  const handleSaveTahap2 = (e) => {
    e.preventDefault();
    if (!form.catatanSekretaris.trim()) {
      showToast('Ketik catatan telaah Sekretaris terlebih dahulu', 'warning');
      return;
    }
    const prioritasIsSangatSegera =
      currentSurat?.prioritas === 'Sangat Segera' || currentSurat?.sifat === 'sangat_segera';

    saveDisposisi(selectedLetterId, {
      ...form,
      alurTahap: 2,
      sifatDisposisi: prioritasIsSangatSegera ? 'sangat_segera' : 'segera',
      statusSurat: 'Telah Didisposisi',
      tahapLabel: 'Telaah & Catatan Sekretaris',
    });

    showToast(`Catatan telaah Sekretaris berhasil disimpan dan diteruskan ke ${form.tujuanPimpinan}.`);
    setActiveTahap(3);
  };

  // 2. Eksekusi Tahap 3: Ketua/Wakil/Plh memberi perintah tindak lanjut ke Sekretaris/Panitera/Keduanya
  const handleSaveTahap3 = (e) => {
    e.preventDefault();
    if (form.diteruskanKepada.length === 0) {
      showToast('Pilih minimal satu pejabat penindak lanjut (Sekretaris, Panitera, atau Keduanya)', 'warning');
      return;
    }
    if (!form.isiArahan.trim()) {
      showToast('Tuliskan perintah tindak lanjut pimpinan', 'warning');
      return;
    }

    const prioritasIsSangatSegera =
      currentSurat?.prioritas === 'Sangat Segera' || currentSurat?.sifat === 'sangat_segera';

    saveDisposisi(selectedLetterId, {
      ...form,
      alurTahap: 3,
      sifatDisposisi: prioritasIsSangatSegera ? 'sangat_segera' : 'segera',
      instruksiPilihan: form.petunjukPilihan,
      statusSurat: 'Dalam Tindak Lanjut',
      tahapLabel: 'Perintah Tindak Lanjut Pimpinan',
    });

    showToast(`Perintah pimpinan berhasil disahkan dan didisposisikan kepada: ${form.diteruskanKepada.join(' & ')}.`);
    setActiveTahap(4);
  };

  // 3. Eksekusi Tahap 4: Sekretaris mendisposisi ke Kasubag Umum & Keuangan untuk pengarsipan
  const handleSaveTahap4 = (e) => {
    e.preventDefault();
    if (!form.catatanPengarsipan.trim()) {
      showToast('Tuliskan instruksi pengarsipan', 'warning');
      return;
    }

    const prioritasIsSangatSegera =
      currentSurat?.prioritas === 'Sangat Segera' || currentSurat?.sifat === 'sangat_segera';

    saveDisposisi(selectedLetterId, {
      ...form,
      alurTahap: 4,
      sifatDisposisi: prioritasIsSangatSegera ? 'sangat_segera' : 'segera',
      instruksiPilihan: form.petunjukPilihan,
      isArchived: true,
      statusSurat: 'Diarsipkan',
      tahapLabel: 'Disposisi Pengarsipan Surat',
    });

    showToast(`Surat berhasil didisposisikan ke Kasubag Umum & Keuangan dan resmi diarsipkan.`);
  };

  // Penentuan data pimpinan penandatangan
  const pimpinanName = plhConfig?.isActive
    ? `${plhConfig.pejabatPlh.name} (${plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'})`
    : 'Dr. H. Ahmad Zainuddin, S.H., M.H. (Ketua)';

  if (suratMasuk.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
          <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Disposisi Surat</h2>
            <p className="text-xs md:text-sm text-outline mt-0.5">
              Lembar Disposisi Elektronik Resmi Mahkamah Agung RI
            </p>
          </div>
        </div>
        <div className="p-12 text-center bg-white rounded-xl border border-outline-subtle shadow-xs">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2 block">
            mark_email_unread
          </span>
          <h3 className="text-base font-bold text-on-surface">Belum Ada Surat Masuk untuk Didisposisi</h3>
          <p className="text-xs text-outline mt-1 mb-5">
            Database surat saat ini kosong. Catat surat masuk baru terlebih dahulu untuk membuat lembar disposisi.
          </p>
          <button
            onClick={() => navigateTo('surat-masuk')}
            className="px-4 py-2 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
            style={{ backgroundColor: '#0B3B24' }}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Catat Surat Masuk</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle no-print">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Disposisi Surat Masuk</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Standar Alur 4 Tahap & Format Gambar 26 SEKMA</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Lembar & Alur Disposisi Surat Masuk
          </h2>
          <p className="text-xs md:text-sm text-outline">
            SOP Alur Disposisi: Petugas → Sekretaris/Plh → Ketua/Wakil/Plh → Sekretaris & Panitera → Kasubag Umum & Keuangan (Arsip).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pilihan Surat */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-outline">Pilih Surat:</span>
            <select
              value={selectedLetterId}
              onChange={(e) => {
                setSelectedLetterId(e.target.value);
                setActiveLetterId(e.target.value);
              }}
              className="h-10 px-3 rounded-btn border border-outline-subtle bg-white text-xs font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {suratMasuk.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nomorSurat} - {s.asalSurat?.slice(0, 24)} ({s.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            title="Cetak lembar disposisi resmi format A4"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Lembar Disposisi</span>
          </button>
        </div>
      </div>

      {/* Info Card Surat Terpilih */}
      <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs relative overflow-hidden no-print">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-code text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded">
                Agenda: {currentSurat?.agenda}
              </span>
              <span className="font-code text-xs font-bold text-on-surface">
                No. Surat: {currentSurat?.nomorSurat}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-surface text-on-surface border border-outline-subtle">
                Sifat: {currentSurat?.sifatSurat || (currentSurat?.sifat && !currentSurat.sifat.includes('segera') ? currentSurat.sifat.replace(/_/g, ' ') : 'Biasa')}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-warning-light text-amber-900 border border-warning/40">
                Prioritas: {currentSurat?.prioritas || (currentSurat?.sifat === 'sangat_segera' ? 'Sangat Segera' : 'Segera')}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary-light text-primary border border-primary/30">
                Status: {currentSurat?.status || 'Menunggu Disposisi'}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-on-surface">
              {currentSurat?.perihal}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-outline">
              <span>
                Pengirim: <strong className="text-on-surface">{currentSurat?.asalSurat}</strong>
              </span>
              <span>•</span>
              <span>
                Tgl Surat: <strong className="text-on-surface">{currentSurat?.tanggalSurat}</strong>
              </span>
              <span>•</span>
              <span>
                Diterima: <strong className="text-on-surface">{currentSurat?.tanggalTerima?.slice(0, 16) || currentSurat?.tanggalSurat}</strong>
              </span>
              <span>•</span>
              <span>
                Lampiran: <strong className="text-on-surface">{currentSurat?.lampiran || '-'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showToast(`Membuka pindaian warkat: ${currentSurat?.nomorSurat || ''}...`, 'info');
                openWarkatPreview(currentSurat);
              }}
              className="h-9 px-3.5 rounded-btn bg-surface border border-outline-subtle text-primary font-semibold text-xs flex items-center gap-1.5 hover:bg-primary-light active:scale-[0.98] transition-all shadow-2xs"
              title="Buka pindaian naskah dinas pada tab baru"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Lihat Scan Warkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEPPER PROGRESS ALUR DISPOSISI 4 TAHAP */}
      <div className="bg-white rounded-card border border-outline-subtle p-4 md:p-5 shadow-2xs no-print">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
            <h3 className="text-xs md:text-sm font-bold text-on-surface uppercase tracking-wide">
              Bagan Alur Disposisi Surat Masuk Pengadilan
            </h3>
          </div>
          <span className="text-[11px] text-outline font-medium">
            Klik tahapan di bawah untuk beralih formulir proses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Langkah 1: Registrasi Petugas */}
          <div className="p-3 rounded-lg border border-success/40 bg-success-light/40 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success text-white">
                Tahap 1 • Selesai
              </span>
              <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface leading-snug">
                1. Registrasi Petugas Surat
              </div>
              <div className="text-[11px] text-outline mt-0.5">
                Surat dicatat & diarahkan ke <strong>Sekretaris/Plh</strong>.
              </div>
            </div>
            <div className="mt-2 text-[10px] text-success font-semibold">
              Disposisi awal: Sekretaris
            </div>
          </div>

          {/* Langkah 2: Telaah & Catatan Sekretaris */}
          <button
            type="button"
            onClick={() => setActiveTahap(2)}
            className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
              activeTahap === 2
                ? 'border-primary ring-2 ring-primary/20 bg-primary-light/50 shadow-xs'
                : form.catatanSekretaris
                ? 'border-outline-subtle bg-white hover:bg-surface'
                : 'border-dashed border-outline-subtle bg-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeTahap === 2
                    ? 'bg-primary text-white'
                    : form.catatanSekretaris
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface text-outline'
                }`}
              >
                Tahap 2 {activeTahap === 2 ? '• Aktif' : form.catatanSekretaris ? '• Ada Catatan' : ''}
              </span>
              <span className="material-symbols-outlined text-primary text-[18px]">
                {form.catatanSekretaris ? 'task_alt' : 'draw'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface leading-snug">
                2. Catatan Sekretaris/Plh
              </div>
              <div className="text-[11px] text-outline mt-0.5">
                Penanggung jawab pengelola surat memberi catatan & teruskan ke <strong>Ketua</strong>.
              </div>
            </div>
            <div className="mt-2 text-[10px] text-primary font-semibold flex items-center gap-1">
              <span>Ke: {form.tujuanPimpinan}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </div>
          </button>

          {/* Langkah 3: Perintah Pimpinan (Ketua/Wakil/Plh) */}
          <button
            type="button"
            onClick={() => setActiveTahap(3)}
            className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
              activeTahap === 3
                ? 'border-primary ring-2 ring-primary/20 bg-primary-light/50 shadow-xs'
                : existingDisposisi?.isiArahan || currentSurat?.status === 'Dalam Tindak Lanjut'
                ? 'border-outline-subtle bg-white hover:bg-surface'
                : 'border-dashed border-outline-subtle bg-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeTahap === 3
                    ? 'bg-primary text-white'
                    : existingDisposisi?.isiArahan
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface text-outline'
                }`}
              >
                Tahap 3 {activeTahap === 3 ? '• Aktif' : existingDisposisi?.isiArahan ? '• Selesai' : ''}
              </span>
              <span className="material-symbols-outlined text-amber-600 text-[18px]">
                {existingDisposisi?.isiArahan ? 'verified' : 'gavel'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface leading-snug">
                3. Perintah Pimpinan (Ketua/Plh)
              </div>
              <div className="text-[11px] text-outline mt-0.5">
                Pimpinan memberi instruksi & disposisi ke <strong>Sekretaris / Panitera / Keduanya</strong>.
              </div>
            </div>
            <div className="mt-2 text-[10px] text-amber-800 font-semibold flex items-center gap-1">
              <span>Kepada: {form.diteruskanKepada.join(' & ')}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </div>
          </button>

          {/* Langkah 4: Disposisi Pengarsipan Sekretaris ke Kasubag Umum & Keuangan */}
          <button
            type="button"
            onClick={() => setActiveTahap(4)}
            className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
              activeTahap === 4
                ? 'border-primary ring-2 ring-primary/20 bg-primary-light/50 shadow-xs'
                : form.isArchived || currentSurat?.status === 'Diarsipkan'
                ? 'border-success/40 bg-success-light/40'
                : 'border-dashed border-outline-subtle bg-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeTahap === 4
                    ? 'bg-primary text-white'
                    : form.isArchived
                    ? 'bg-success text-white'
                    : 'bg-surface text-outline'
                }`}
              >
                Tahap 4 {activeTahap === 4 ? '• Aktif' : form.isArchived ? '• Diarsipkan' : '• Final'}
              </span>
              <span className="material-symbols-outlined text-teal-700 text-[18px]">
                {form.isArchived ? 'inventory_2' : 'archive'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface leading-snug">
                4. Disposisi Pengarsipan
              </div>
              <div className="text-[11px] text-outline mt-0.5">
                Sekretaris mendisposisi ke <strong>Kasubag Umum & Keuangan</strong> untuk arsip.
              </div>
            </div>
            <div className="mt-2 text-[10px] text-teal-800 font-semibold flex items-center gap-1">
              <span>Status: {form.isArchived ? 'Diarsipkan' : 'Siap Diarsipkan'}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Formulir Arahan Disposisi Sesuai Tahap (Kiri) & Pratinjau Standar Gambar 26 SEKMA (Kanan) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* SISI KIRI: Formulir Arahan Disposisi Berdasarkan Tahap Alur (5 Kolom) */}
        <section className="xl:col-span-5 bg-white rounded-card border border-outline-subtle shadow-2xs p-5 md:p-6 space-y-5 no-print">
          {/* Header Tab Tahapan */}
          <div className="flex items-center justify-between border-b border-outline-subtle pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary mb-0.5">
                <span className="material-symbols-outlined text-[16px]">flowsheet</span>
                <span>Alur Disposisi Aktif: Tahap {activeTahap}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">
                {activeTahap === 2
                  ? 'Catatan & Telaah Sekretaris / Plh'
                  : activeTahap === 3
                  ? 'Perintah Tindak Lanjut Pimpinan'
                  : 'Disposisi Pengarsipan Kasubag Umum'}
              </h3>
            </div>
            <span className="text-xs text-outline font-code">
              Agenda: {currentSurat?.agenda}
            </span>
          </div>

          {/* Banner Pelimpahan PLH jika aktif */}
          {plhConfig?.isActive && (
            <div className="p-3 rounded-lg bg-warning-light/80 border border-warning/50 text-amber-950 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-[18px]">shield</span>
                <span>
                  Penandatangan Plh: <strong>{plhConfig.pejabatPlh.name}</strong> (
                  {plhConfig.tipePelimpahan === 'hakim_ditunjuk' ? 'Hakim yang Ditunjuk' : 'Wakil Ketua'})
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAHAP 2: Catatan / Telaah Sekretaris / Plh & Teruskan ke Ketua            */}
          {/* ========================================================================= */}
          {activeTahap === 2 && (
            <form onSubmit={handleSaveTahap2} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">info</span>
                <div>
                  <strong>Tugas Penanggung Jawab Tata Persuratan:</strong>
                  <p className="mt-0.5 text-[11px] text-amber-900 leading-relaxed">
                    Sekretaris/Plh meneliti surat masuk, memberikan catatan telaah pada lembar disposisi, kemudian mendisposisikan/meneruskannya kepada Ketua/Wakil Ketua/Plh.
                  </p>
                </div>
              </div>

              {/* Pejabat Penelaah */}
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Penanggung Jawab Pengelola Surat:
                </label>
                <input
                  type="text"
                  value={form.penelaahSekretaris}
                  onChange={(e) => setForm({ ...form, penelaahSekretaris: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded border border-outline-subtle bg-surface text-on-surface font-semibold"
                />
              </div>

              {/* Catatan Sekretaris pada Lembar Disposisi */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-on-surface">
                    Catatan Sekretaris pada Lembar Disposisi: <span className="text-danger">*</span>
                  </label>
                  <span className="text-[10px] text-outline font-medium">Wajib diisi</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={form.catatanSekretaris}
                  onChange={(e) => setForm({ ...form, catatanSekretaris: e.target.value })}
                  placeholder="Ketik telaah atau catatan sekretaris sebelum diteruskan ke ketua..."
                  className="w-full p-2.5 text-xs rounded border border-outline-subtle bg-surface text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                />
                {/* Template cepat catatan sekretaris */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-outline font-medium mr-1">Template:</span>
                  {[
                    'Telah diteliti berkas naskah dinas, diajukan kepada Yth. Ketua Pengadilan untuk arahan tindak lanjut.',
                    'Surat undangan koordinasi kedinasan, diajukan untuk arahan delegasi & penerbitan Surat Tugas (ST).',
                    'Naskah dinas pemberitahuan teknis, diajukan untuk petunjuk dan arahan pimpinan.',
                  ].map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, catatanSekretaris: tpl })}
                      className="px-2 py-0.5 rounded text-[10px] bg-surface hover:bg-primary-light hover:text-primary border border-outline-subtle text-outline transition-all truncate max-w-full"
                    >
                      Template {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teruskan Disposisi ke Ketua / Wakil Ketua / Plh */}
              <div>
                <label className="font-bold text-on-surface block mb-1.5">
                  Didisposisikan / Diteruskan Kepada Pimpinan:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Ketua Pengadilan',
                    'Wakil Ketua Pengadilan',
                    plhConfig?.isActive ? 'Plh. Ketua (Sesuai SK Pelimpahan)' : 'Plh. Ketua',
                  ].map((pim) => (
                    <label
                      key={pim}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                        form.tujuanPimpinan === pim
                          ? 'bg-primary-light text-primary border-primary font-bold'
                          : 'bg-white text-on-surface border-outline-subtle hover:bg-surface'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tujuanPimpinan"
                        checked={form.tujuanPimpinan === pim}
                        onChange={() => setForm({ ...form, tujuanPimpinan: pim })}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{pim}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tanggal Telaah */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-subtle">
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-0.5">
                    Tanggal Telaah:
                  </label>
                  <input
                    type="text"
                    value={form.tanggalTelaahSekretaris}
                    onChange={(e) => setForm({ ...form, tanggalTelaahSekretaris: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-0.5">
                    Status Surat:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Telah Didisposisi (ke Pimpinan)"
                    className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface/70 font-semibold text-primary"
                  />
                </div>
              </div>

              {/* Tombol Simpan & Teruskan Tahap 2 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Simpan Catatan & Disposisikan ke Ketua / Pimpinan</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAHAP 3: Perintah Tindak Lanjut oleh Ketua / Wakil / Plh                   */}
          {/* ========================================================================= */}
          {activeTahap === 3 && (
            <form onSubmit={handleSaveTahap3} className="space-y-4 text-xs">
              {/* Ringkasan Catatan Sekretaris Sebelumnya */}
              <div className="p-3 rounded-lg bg-amber-50/90 border border-amber-300 text-amber-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <span className="material-symbols-outlined text-[16px]">notes</span>
                  <span>Catatan Masuk dari Sekretaris / Penanggung Jawab:</span>
                </div>
                <div className="italic text-[11px] text-black bg-white/70 p-2 rounded border border-amber-200">
                  "{form.catatanSekretaris || 'Telah diteliti berkas naskah dinas, diajukan kepada Ketua Pengadilan.'}"
                </div>
              </div>

              {/* Disposisi Kepada: Sekretaris, Panitera, atau Keduanya */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-on-surface">
                    Disposisi Tindak Lanjut Kepada: <span className="text-danger">*</span>
                  </label>
                  <span className="text-[11px] text-primary font-semibold">
                    {form.diteruskanKepada.length} dipilih
                  </span>
                </div>

                {/* 3 Opsi Utama sesuai instruksi user: Sekretaris / Panitera / Keduanya */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { id: 'Sekretaris', label: 'Sekretaris', icon: 'badge' },
                    { id: 'Panitera', label: 'Panitera', icon: 'gavel' },
                    { id: 'Keduanya', label: 'Keduanya (Sekretaris & Panitera)', icon: 'group' },
                  ].map((opt) => {
                    const isSelected = form.pilihanTindakLanjut === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handlePilihanTindakLanjut(opt.id)}
                        className={`h-11 px-2 rounded-btn border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface text-on-surface border-outline-subtle hover:bg-surface-low'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                          <span>{isSelected ? '☑' : '☐'}</span>
                        </span>
                        <span className="truncate text-[10px] sm:text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown Pejabat Tambahan jika diperlukan */}
                <details className="mt-1">
                  <summary className="text-[11px] text-primary font-semibold cursor-pointer select-none hover:underline">
                    Lihat / Pilih Pejabat Lainnya ({OFFICIAL_RECIPIENTS.length} Jabatan)
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 mt-1 rounded-lg border border-outline-subtle bg-surface/50 max-h-40 overflow-y-auto">
                    {OFFICIAL_RECIPIENTS.map((rec) => {
                      const isChecked = form.diteruskanKepada.includes(rec);
                      return (
                        <button
                          key={rec}
                          type="button"
                          onClick={() => toggleForwardRecipient(rec)}
                          className={`px-2 py-1 rounded text-left text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                            isChecked
                              ? 'bg-primary text-white font-bold'
                              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
                          }`}
                        >
                          <span>{isChecked ? '☑' : '☐'}</span>
                          <span className="truncate">{rec}</span>
                        </button>
                      );
                    })}
                  </div>
                </details>
              </div>

              {/* Petunjuk Resmi MARI (18 Petunjuk Gambar 26) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-on-surface">Petunjuk Standar Mahkamah Agung:</label>
                  <span className="text-[11px] text-primary font-semibold">
                    {form.petunjukPilihan.length} dipilih
                  </span>
                </div>
                <div className="space-y-1 p-2 rounded-lg border border-outline-subtle bg-surface/50 max-h-48 overflow-y-auto">
                  {OFFICIAL_PETUNJUK.map((petunjuk) => {
                    const isChecked = form.petunjukPilihan.includes(petunjuk);
                    const isAsli = petunjuk === 'Asli kepada';
                    return (
                      <div key={petunjuk} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => togglePetunjuk(petunjuk)}
                          className={`w-full px-2.5 py-1.5 rounded text-left text-xs flex items-center gap-2 transition-all ${
                            isChecked
                              ? 'bg-primary-light text-primary font-bold border border-primary/40'
                              : 'bg-white text-on-surface hover:bg-surface border border-outline-subtle'
                          }`}
                        >
                          <span className="text-xs">{isChecked ? '☑' : '☐'}</span>
                          <span className="flex-1">{petunjuk}</span>
                        </button>
                        {isAsli && isChecked && (
                          <input
                            type="text"
                            placeholder="Ketik penerima naskah asli..."
                            value={form.asliKepada}
                            onChange={(e) => setForm({ ...form, asliKepada: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs rounded border border-primary/40 bg-white text-on-surface outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Berupa Perintah untuk Menindaklanjuti Surat Masuk */}
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Catatan Berupa Perintah untuk Menindaklanjuti Surat Masuk: <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.isiArahan}
                  onChange={(e) => setForm({ ...form, isiArahan: e.target.value })}
                  placeholder="Tuliskan perintah tindak lanjut konkret kepada Sekretaris/Panitera..."
                  className="w-full p-2.5 text-xs rounded border border-outline-subtle bg-surface text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                />
                {/* Template Perintah Cepat */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-outline font-medium mr-1">Template Perintah:</span>
                  {[
                    '1. Selesaikan sesuai ketentuan yang berlaku.\n2. Laporkan hasil pelaksanaannya kepada pimpinan.',
                    '1. Hadiri dan wakili pimpinan dalam agenda dimaksud.\n2. Koordinasikan surat tugas (ST) dan laporkan hasilnya.',
                    'Pelajari dan tindak lanjuti bersama dalam waktu 2x24 jam.',
                  ].map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, isiArahan: tpl })}
                      className="px-2 py-0.5 rounded text-[10px] bg-surface hover:bg-primary-light hover:text-primary border border-outline-subtle text-outline transition-all truncate max-w-full"
                    >
                      Perintah {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rincian Kisi Alur Proses & Penerimaan (4 Kotak Bawah Form Disposisi PA) */}
              <details className="border border-outline-subtle rounded-lg p-2.5 bg-surface/40">
                <summary className="text-[11px] font-bold text-on-surface cursor-pointer select-none flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                    <span>Isian 4 Kotak Bawah (Alur Proses & Penerimaan)</span>
                  </span>
                  <span className="text-[10px] text-outline font-normal">Klik untuk ubah</span>
                </summary>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-outline-subtle text-[11px]">
                  <div>
                    <label className="text-outline block mb-0.5">Tanggal Kirim untuk Proses:</label>
                    <input
                      type="text"
                      value={form.tanggalKirim}
                      onChange={(e) => setForm({ ...form, tanggalKirim: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-outline block mb-0.5">Diterima Oleh:</label>
                    <input
                      type="text"
                      value={form.diterimaOleh}
                      onChange={(e) => setForm({ ...form, diterimaOleh: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-outline block mb-0.5">Diajukan Kembali Tanggal:</label>
                    <input
                      type="text"
                      value={form.diajukanKembali}
                      placeholder="dd/mm/yyyy"
                      onChange={(e) => setForm({ ...form, diajukanKembali: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-outline block mb-0.5">Diterima Tanggal:</label>
                    <input
                      type="text"
                      value={form.diterimaTanggal}
                      placeholder="dd/mm/yyyy"
                      onChange={(e) => setForm({ ...form, diterimaTanggal: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-outline block mb-0.5">Tanggal Kembali untuk Proses:</label>
                    <input
                      type="text"
                      value={form.tanggalKembali}
                      placeholder="dd/mm/yyyy"
                      onChange={(e) => setForm({ ...form, tanggalKembali: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-outline block mb-0.5">Diterima Kembali Oleh:</label>
                    <input
                      type="text"
                      value={form.diterimaKembaliOleh}
                      placeholder="Nama / Jabatan"
                      onChange={(e) => setForm({ ...form, diterimaKembaliOleh: e.target.value })}
                      className="w-full h-7 px-2 text-xs rounded border border-outline-subtle bg-white"
                    />
                  </div>
                </div>
              </details>

              {/* Tombol Simpan & Tanda Tangani Tahap 3 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Sahkan & Terbitkan Perintah Disposisi (TTE Pimpinan)</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAHAP 4: Disposisi Pengarsipan oleh Sekretaris ke Kasubag Umum & Keuangan  */}
          {/* ========================================================================= */}
          {activeTahap === 4 && (
            <form onSubmit={handleSaveTahap4} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-teal-700 text-[18px] shrink-0 mt-0.5">inventory_2</span>
                <div>
                  <strong>Tahap Terakhir Disposisi (Pengarsipan):</strong>
                  <p className="mt-0.5 text-[11px] text-teal-900 leading-relaxed">
                    Setelah perintah disposisi pimpinan ditindaklanjuti oleh Sekretaris/Panitera, Sekretaris mendisposisi surat kepada <strong>Kepala Subbagian Umum dan Keuangan</strong> untuk dicatat dalam buku agenda penutupan dan diarsipkan.
                  </p>
                </div>
              </div>

              {/* Pejabat Penerima Disposisi Pengarsipan */}
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Disposisi Pengarsipan Ditujukan Kepada:
                </label>
                <div className="p-2.5 rounded-lg border border-teal-400 bg-teal-50/60 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-700 text-[18px]">account_box</span>
                  <div>
                    <div className="font-bold text-xs text-teal-950">
                      Kepala Subbagian Umum dan Keuangan
                    </div>
                    <div className="text-[10px] text-teal-800">
                      Penanggung Jawab Urusan Tata Usaha & Kearsipan Pengadilan
                    </div>
                  </div>
                </div>
              </div>

              {/* Catatan / Instruksi Pengarsipan */}
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Catatan / Instruksi Pengarsipan Sekretaris: <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.catatanPengarsipan}
                  onChange={(e) => setForm({ ...form, catatanPengarsipan: e.target.value })}
                  placeholder="Ketik instruksi pengarsipan warkat dinas..."
                  className="w-full p-2.5 text-xs rounded border border-outline-subtle bg-surface text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Lokasi / Berkas Simpan Arsip */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-0.5">
                    Lokasi / Boks Arsip:
                  </label>
                  <input
                    type="text"
                    value={form.lokasiArsip}
                    onChange={(e) => setForm({ ...form, lokasiArsip: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-outline block mb-0.5">
                    Tanggal Pengarsipan:
                  </label>
                  <input
                    type="text"
                    value={form.tanggalArsip}
                    onChange={(e) => setForm({ ...form, tanggalArsip: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-outline-subtle bg-surface"
                  />
                </div>
              </div>

              {/* Tombol Arsipkan Surat */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 px-4 rounded-btn bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">archive</span>
                  <span>Disposisikan ke Kasubag Umum & Keuangan (Arsipkan Surat)</span>
                </button>
              </div>
            </form>
          )}

          {/* Navigasi Cepat Tab Formulir */}
          <div className="pt-3 border-t border-outline-subtle flex items-center justify-between text-xs text-outline">
            <span>Beralih Tahap Formulir:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTahap(2)}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTahap === 2 ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                2. Sekretaris
              </button>
              <button
                type="button"
                onClick={() => setActiveTahap(3)}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTahap === 3 ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                3. Ketua
              </button>
              <button
                type="button"
                onClick={() => setActiveTahap(4)}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTahap === 4 ? 'bg-primary text-white' : 'hover:bg-surface'
                }`}
              >
                4. Arsip
              </button>
            </div>
          </div>
        </section>

        {/* SISI KANAN: Pratinjau Lembar Disposisi Format Standar Gambar 26 SEKMA RI (7 Kolom) */}
        <section className="xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between no-print">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <span>Pratinjau Lembar Disposisi Resmi (Format Gambar 26 SEKMA RI)</span>
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-success-light text-success border border-success/30">
              Format Standar Baku MARI
            </span>
          </div>

          {/* DOCKET SHEET RESMI: REPRODUKSI PERSIS GAMBAR 26 DENGAN KOLOM ALUR LENGKAP */}
          <div className="print-clean bg-white border-2 border-black text-black font-serif text-[11px] leading-tight shadow-md">
            {/* 1. KOP SURAT PENGADILAN AGAMA LUMAJANG DENGAN LOGO */}
            <div className="border-b border-black p-4 flex items-center justify-center gap-4">
              <img
                src={logoInstansi}
                alt="Logo Pengadilan Agama Lumajang"
                className="w-20 h-20 object-contain shrink-0"
              />
              <div className="flex-1 text-center text-black" style={{ lineHeight: '1.15' }}>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  MAHKAMAH AGUNG REPUBLIK INDONESIA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  DIREKTORAT JENDERAL BADAN PERADILAN AGAMA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  PENGADILAN TINGGI AGAMA SURABAYA
                </div>
                <div style={{ fontSize: '13pt', lineHeight: '1.15', margin: 0, padding: 0 }} className="font-bold uppercase tracking-wide font-serif">
                  PENGADILAN AGAMA LUMAJANG
                </div>
                <div style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: '3px 0 0 0', padding: 0 }} className="text-neutral-900 font-sans">
                  Jalan Soekarno Hatta Nomor 11, Selokbesuki, Sukodono, Lumajang, Jawa Timur 67352
                </div>
                <div style={{ fontSize: '9.5pt', lineHeight: '1.2', margin: 0, padding: 0 }} className="text-neutral-900 font-sans">
                  www.pa-lumajang.go.id, email: pa.lumajang@gmail.com, telepon (0334) 8781874
                </div>
              </div>
            </div>

            {/* 2. JUDUL LEMBAR DISPOSISI */}
            <div className="border-b border-black py-1.5 text-center font-bold text-sm sm:text-base tracking-widest uppercase font-serif">
              LEMBAR DISPOSISI
            </div>

            {/* 3. PERINGATAN / PERHATIAN */}
            <div className="border-b border-black py-1 px-3 text-center font-bold text-[10px] sm:text-[10.5px] font-sans">
              PERHATIAN: Dilarang memisahkan sehelai Naskah Dinas pun yang tergabung dalam berkas ini.
            </div>

            {/* 4. GRID METADATA NASKAH DINAS (3 Kolom Sesuai Format Referensi) */}
            <div className="grid grid-cols-12 border-b border-black font-sans text-[11px]">
              {/* Kolom 1 (Kiri) */}
              <div className="col-span-5 p-2 border-r border-black space-y-1">
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Nomor Naskah Dinas</span>
                  <span className="mr-1.5">:</span>
                  <span className="font-bold font-code break-all">{currentSurat?.nomorSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Tanggal Naskah Dinas</span>
                  <span className="mr-1.5">:</span>
                  <span>{currentSurat?.tanggalSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold shrink-0">Lampiran</span>
                  <span className="mr-1.5">:</span>
                  <span className="truncate">{currentSurat?.lampiran || '-'}</span>
                </div>
              </div>

              {/* Kolom 2 (Tengah) */}
              <div className="col-span-3 p-2 border-r border-black space-y-1">
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Status</span>
                  <span className="mr-1">:</span>
                  <span>{currentSurat?.status || 'Didisposisi'}</span>
                </div>
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Sifat</span>
                  <span className="mr-1">:</span>
                  <span className="uppercase font-semibold">
                    {currentSurat?.sifatSurat || (currentSurat?.sifat && !currentSurat.sifat.includes('segera') ? currentSurat.sifat.replace(/_/g, ' ') : 'BIASA')}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-14 font-semibold shrink-0">Jenis</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{currentSurat?.jenisSurat || 'Surat Dinas'}</span>
                </div>
              </div>

              {/* Kolom 3 (Kanan) */}
              <div className="col-span-4 p-2 space-y-1">
                <div className="flex">
                  <span className="w-32 font-semibold shrink-0">Diterima Tanggal</span>
                  <span className="mr-1.5">:</span>
                  <span>{currentSurat?.tanggalTerima?.slice(0, 10) || currentSurat?.tanggalSurat}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold shrink-0">Nomor Agenda</span>
                  <span className="mr-1.5">:</span>
                  <span className="font-bold font-code text-black">{currentSurat?.agenda}</span>
                </div>
              </div>
            </div>

            {/* DARI & HAL */}
            <div className="border-b border-black p-2 font-sans text-[11px] space-y-1">
              <div className="flex">
                <span className="w-16 font-semibold shrink-0">Dari</span>
                <span className="mr-1.5">:</span>
                <span className="font-bold">{currentSurat?.asalSurat}</span>
              </div>
              <div className="flex">
                <span className="w-16 font-semibold shrink-0">Hal</span>
                <span className="mr-1.5">:</span>
                <span className="font-medium leading-snug">{currentSurat?.perihal}</span>
              </div>
            </div>

            {/* 5. CHECKBOX SIFAT: SANGAT SEGERA vs SEGERA (Diambil dari Prioritas Surat Masuk) */}
            {(() => {
              const isSangatSegera =
                currentSurat?.prioritas === 'Sangat Segera' ||
                currentSurat?.sifat === 'sangat_segera' ||
                form.sifatDisposisi === 'sangat_segera';
              return (
                <div className="grid grid-cols-2 border-b border-black font-sans text-xs font-bold text-center">
                  <div className="p-1.5 border-r border-black flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border border-black text-xs leading-none text-center font-bold">
                      {isSangatSegera ? '✓' : ''}
                    </span>
                    <span>SANGAT SEGERA</span>
                  </div>
                  <div className="p-1.5 flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border border-black text-xs leading-none text-center font-bold">
                      {!isSangatSegera ? '✓' : ''}
                    </span>
                    <span>SEGERA</span>
                  </div>
                </div>
              );
            })()}

            {/* 6. MAIN BODY (Kiri: DISPOSISI KEPADA + CATATAN ALUR LENGKAP, Kanan: 18 PETUNJUK) */}
            {/* Garis tengah 50%-50% lurus tersambung dari bagian atas (Sifat), tengah (Body), dan bawah (Kisi Proses) */}
            <div className="grid grid-cols-2 border-b border-black font-sans text-[11px]">
              {/* Kolom Kiri: DISPOSISI KEPADA (Atas) & CATATAN ALUR (Bawah) */}
              <div className="border-r border-black flex flex-col justify-between">
                {/* DISPOSISI KEPADA */}
                <div className="p-2.5 space-y-1.5">
                  <div className="font-bold underline text-xs mb-2">DISPOSISI KEPADA:</div>
                  {OFFICIAL_RECIPIENTS.map((rec) => {
                    const isChecked =
                      form.diteruskanKepada.includes(rec) ||
                      (form.isArchived && rec === 'Kepala Subbagian Umum dan Keuangan') ||
                      (rec === 'Sekretaris' && activeTahap >= 2);
                    return (
                      <div key={rec} className="flex items-center gap-2 leading-tight">
                        <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold shrink-0">
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className={isChecked ? 'font-bold' : 'text-neutral-800'}>
                          {rec}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CATATAN ALUR LENGKAP: CATATAN SEKRETARIS + PERINTAH PIMPINAN + DISPOSISI PENGARSIPAN */}
                <div className="border-t border-black p-2.5 min-h-[160px] flex-1 flex flex-col space-y-2">
                  <div className="font-bold underline text-xs mb-1">CATATAN:</div>

                  {/* 1. Catatan Sekretaris/Plh (Penanggung Jawab Pengelola Surat) */}
                  <div className="border-l-2 border-black pl-2 py-0.5">
                    <div className="font-bold text-[10px] uppercase">
                      Catatan Sekretaris/Plh (Pengelola Surat):
                    </div>
                    <div className="whitespace-pre-line text-[10.5px] italic text-black leading-snug">
                      {form.catatanSekretaris || '-'}
                    </div>
                    <div className="text-[9.5px] text-neutral-700">
                      → Didisposisikan ke: <strong>{form.tujuanPimpinan || 'Ketua Pengadilan'}</strong>
                    </div>
                  </div>

                  {/* 2. Perintah Tindak Lanjut oleh Ketua / Wakil Ketua / Plh */}
                  <div className="border-l-2 border-black pl-2 py-0.5">
                    <div className="font-bold text-[10px] uppercase">
                      Perintah Tindak Lanjut Ketua / Plh:
                    </div>
                    <div className="whitespace-pre-line text-[10.5px] font-semibold text-black leading-snug">
                      {form.isiArahan || 'Mohon ditindaklanjuti sesuai ketentuan yang berlaku.'}
                    </div>
                    {form.catatanKhusus && (
                      <div className="text-neutral-700 italic text-[10px] mt-0.5">
                        Catatan: {form.catatanKhusus}
                      </div>
                    )}
                    <div className="text-[9.5px] text-neutral-700">
                      → Didisposisikan kepada: <strong>{form.diteruskanKepada.join(' & ')}</strong>
                    </div>
                  </div>

                  {/* 3. Disposisi Pengarsipan Sekretaris ke Kasubag Umum & Keuangan (Jika sudah di tahap arsip) */}
                  {(form.isArchived || form.catatanPengarsipan) && (
                    <div className="border-l-2 border-black pl-2 py-0.5">
                      <div className="font-bold text-[10px] uppercase">
                        Disposisi Pengarsipan Sekretaris:
                      </div>
                      <div className="whitespace-pre-line text-[10.5px] italic text-black leading-snug">
                        {form.catatanPengarsipan || 'Telah selesai ditindaklanjuti. Diarsipkan pada berkas dinas.'}
                      </div>
                      <div className="text-[9.5px] text-neutral-700">
                        → Kepada: <strong>Kepala Subbagian Umum dan Keuangan</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: PETUNJUK RESMI (18 Item Sesuai Format Gambar 26) */}
              <div className="p-2.5 space-y-1.5">
                <div className="font-bold underline text-xs mb-2">PETUNJUK:</div>
                {OFFICIAL_PETUNJUK.map((petunjuk) => {
                  const isChecked = form.petunjukPilihan.includes(petunjuk);
                  const isAsli = petunjuk === 'Asli kepada';
                  return (
                    <div key={petunjuk} className="flex items-center gap-2 leading-tight">
                      <span className="w-3.5 h-3.5 border border-black flex items-center justify-center text-[10px] font-bold shrink-0">
                        {isChecked ? '✓' : ''}
                      </span>
                      <span className={isChecked ? 'font-bold' : 'text-neutral-800'}>
                        {petunjuk}
                        {isAsli && (
                          <span className="ml-1 text-neutral-800 underline font-normal">
                            {form.asliKepada ? ` ${form.asliKepada}` : ' .........................'}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. KISI ALUR PROSES & PENERIMAAN (4 Kotak Bawah Format Baku Gambar 27 Form Disposisi Pengadilan Agama) */}
            {/* Baris Bawah 1: Tanggal Kirim untuk Proses & Diajukan Kembali Tanggal */}
            <div className="grid grid-cols-2 border-b border-black font-sans text-[10.5px]">
              <div className="p-2 border-r border-black space-y-1">
                <div>
                  Tanggal Kirim untuk Proses :{' '}
                  <span className="font-semibold">
                    {form.tanggalKirim || currentSurat?.tanggalTerima?.slice(0, 10) || '...........................'}
                  </span>
                </div>
                <div>
                  Diterima Oleh :{' '}
                  <span className="font-semibold">
                    {form.diterimaOleh || 'Staf Bagian Umum / TU'}
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <div>
                  Diajukan Kembali Tanggal :{' '}
                  <span className="font-semibold">
                    {form.diajukanKembali || form.tanggalTelaahSekretaris || '...........................'}
                  </span>
                </div>
                <div>
                  Diterima Tanggal :{' '}
                  <span className="font-semibold">
                    {form.diterimaTanggal || form.tanggalTelaahSekretaris || '...........................'}
                  </span>
                </div>
              </div>
            </div>

            {/* Baris Bawah 2: Tanggal Kembali untuk Proses & Tanggal Selesai dari Pejabat yang Memberi Disposisi */}
            <div className="grid grid-cols-2 font-sans text-[10.5px]">
              <div className="p-2 border-r border-black space-y-1">
                <div>
                  Tanggal Kembali untuk Proses :{' '}
                  <span className="font-semibold">
                    {form.tanggalKembali || (form.alurTahap >= 3 ? form.tanggalDisposisi?.slice(0, 10) || form.tanggalKirim : '...........................')}
                  </span>
                </div>
                <div>
                  Diterima Oleh :{' '}
                  <span className="font-semibold">
                    {form.diterimaKembaliOleh || (form.diteruskanKepada && form.diteruskanKepada.length > 0 ? form.diteruskanKepada.join(' & ') : '...........................')}
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <div>
                  Tanggal selesai dari Pejabat yang memberi disposisi :{' '}
                  <span className="font-semibold">
                    {existingDisposisi?.tanggalDisposisi?.slice(0, 10) || (form.alurTahap >= 3 ? form.tanggalKirim : '...........................')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
