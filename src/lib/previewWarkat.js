/**
 * Utility untuk membuka preview pindaian warkat asli (digital scan warkat)
 * pada tab baru (new tab) dengan tampilan viewer naskah dinas peradilan resmi.
 */

function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function getLetterBody(surat) {
  const p = (surat.perihal || '').toLowerCase();
  const id = surat.id || '';

  if (id === 'SM-001' || p.includes('rakor') || p.includes('pembinaan wilayah')) {
    return `
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Dalam rangka meningkatkan efektivitas pembinaan, pengawasan yudisial, serta akselerasi penyelesaian perkara dan optimalisasi serapan anggaran Triwulan IV Tahun Anggaran 2026, dengan ini disampaikan bahwa Pengadilan Tinggi Agama Surabaya akan menyelenggarakan <strong>Rapat Koordinasi Pembinaan Wilayah Hukum Semester II</strong>.
      </p>
      <p style="margin-bottom: 14px;">
        Sehubungan dengan hal tersebut, diminta kepada Saudara Ketua Pengadilan Agama Lamongan untuk menugaskan aparatur pimpinan guna menghadiri kegiatan koordinasi kedinasan dengan ketentuan sebagai berikut:
      </p>
      <div style="margin-left: 24px; margin-bottom: 16px; line-height: 1.8;">
        <table>
          <tr><td style="width: 140px; vertical-align: top;"><strong>Hari / Tanggal</strong></td><td style="width: 15px; vertical-align: top;">:</td><td>Sabtu s/d Minggu, 24 - 25 Oktober 2026</td></tr>
          <tr><td style="vertical-align: top;"><strong>Waktu</strong></td><td style="vertical-align: top;">:</td><td>Pukul 08.30 WIB s/d Selesai</td></tr>
          <tr><td style="vertical-align: top;"><strong>Tempat</strong></td><td style="vertical-align: top;">:</td><td>Aula Graha Samudra Gedung PTA Surabaya, Jl. Mayjen Sungkono No. 74-76 Surabaya</td></tr>
          <tr><td style="vertical-align: top;"><strong>Peserta Hadir</strong></td><td style="vertical-align: top;">:</td><td>Ketua / Wakil Ketua (atau mewakili), Panitera, dan Sekretaris</td></tr>
          <tr><td style="vertical-align: top;"><strong>Pakaian Resmi</strong></td><td style="vertical-align: top;">:</td><td>PSL / PSH Lengkap dengan Tanda Jabatan Kedinasan</td></tr>
        </table>
      </div>
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Masing-masing satuan kerja diwajibkan membawa data dukung berupa laporan rekapitulasi kinerja perkara elektronik (e-Court), penanganan mediasi yudisial, serta realisasi capaian DIPA 01 dan 04 s.d. Oktober 2026 untuk bahan konsinyir pemaparan resmi.
      </p>
      <p style="text-indent: 36px; margin-bottom: 24px;">
        Demikian undangan koordinasi kedinasan ini disampaikan, atas perhatian dan kehadiran tepat waktu Saudara diucapkan terima kasih.
      </p>
    `;
  }

  if (id === 'SM-002' || p.includes('disabilitas') || p.includes('ptsp')) {
    return `
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Menindaklanjuti Keputusan Ketua Mahkamah Agung RI tentang Pedoman Standar Pelayanan Terpadu Satu Pintu (PTSP) Ramah Kelompok Rentan dan Penyandang Disabilitas pada 4 (Empat) Lingkungan Peradilan, bersama ini kami sampaikan Petunjuk Pelaksanaan Kegiatan Sosialisasi dan Standardisasi Layanan Inklusif.
      </p>
      <p style="margin-bottom: 14px;">
        Seluruh Pengadilan Tingkat Pertama diinstruksikan untuk segera melaksanakan langkah-langkah peningkatan sarana prasarana dan kompetensi aparatur frontliner PTSP dengan rincian jadwal sebagai berikut:
      </p>
      <div style="margin-left: 24px; margin-bottom: 16px; line-height: 1.8;">
        <table>
          <tr><td style="width: 140px; vertical-align: top;"><strong>Agenda Kegiatan</strong></td><td style="width: 15px; vertical-align: top;">:</td><td>Sosialisasi & Workshop Standar Pelayanan PTSP Inklusif</td></tr>
          <tr><td style="vertical-align: top;"><strong>Waktu Pelaksanaan</strong></td><td style="vertical-align: top;">:</td><td>Selasa, 27 Oktober 2026, Pukul 09.00 WIB s/d Selesai</td></tr>
          <tr><td style="vertical-align: top;"><strong>Media Layanan</strong></td><td style="vertical-align: top;">:</td><td>Hybrid (Zoom Meeting Cloud ID: 849 2210 5543 • Passcode: DISABILITAS26)</td></tr>
          <tr><td style="vertical-align: top;"><strong>Wajib Mengikuti</strong></td><td style="vertical-align: top;">:</td><td>Penanggungjawab PTSP, Kasubbag Umum, Petugas Frontliner Meja Layanan</td></tr>
        </table>
      </div>
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Mengingat sifat surat yang <strong>Sangat Segera</strong>, satuan kerja diminta menyampaikan laporan inventarisasi fasilitas ramah disabilitas (jalur pemandu/guiding block, kursi roda, toilet ramah disabilitas, dan formulir huruf braille) paling lambat 3 (tiga) hari kerja sebelum kegiatan berlangsung.
      </p>
      <p style="text-indent: 36px; margin-bottom: 24px;">
        Demikian pemberitahuan ini disampaikan untuk dipedomani dan ditindaklanjuti dengan penuh tanggung jawab.
      </p>
    `;
  }

  if (id === 'SM-003' || p.includes('kenaikan pangkat')) {
    return `
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Sehubungan dengan persiapan penetapan Kenaikan Pangkat Pilihan dan Reguler bagi Tenaga Teknis Peradilan, Pejabat Kepaniteraan, serta Aparatur Pegawai Negeri Sipil di lingkungan Mahkamah Agung RI Periode 1 April 2027, Biro Kepegawaian menyampaikan bahwa tahapan verifikasi berkas usulan telah dibuka.
      </p>
      <p style="margin-bottom: 14px;">
        Satuan kerja diminta untuk memeriksa kelengkapan data aparatur yang memenuhi syarat (BKN SIASN & SIKEP) dengan ketentuan pokok:
      </p>
      <div style="margin-left: 24px; margin-bottom: 16px; line-height: 1.8;">
        <ol style="margin-top: 4px; padding-left: 20px;">
          <li>Penilaian Kinerja Pegawai (SKP) 2 (dua) tahun terakhir dengan predikat minimal <em>Baik</em>;</li>
          <li>Surat Tanda Tamat Pendidikan & Pelatihan (STTPP) Kedinasan yang telah dilegalisir;</li>
          <li>Surat Keterangan Bebas Hukuman Disiplin Tingkat Sedang/Berat dari Badan Pengawasan MARI;</li>
          <li>Pengunggahan dokumen PDF melalui portal layanan kepegawaian paling lambat <strong>20 November 2026</strong>.</li>
        </ol>
      </div>
      <p style="text-indent: 36px; margin-bottom: 24px;">
        Demikian surat edaran verifikasi ini disampaikan untuk dilaksanakan sebagaimana mestinya.
      </p>
    `;
  }

  if (id === 'SM-004' || p.includes('audit kepatuhan') || p.includes('aksesibilitas')) {
    return `
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Dalam rangka implementasi Peraturan Mahkamah Agung Nomor 1 Tahun 2019 tentang Administrasi Perkara dan Persidangan di Pengadilan Secara Elektronik juncto Keputusan KMA No. 129/KMA/SK/VIII/2019, Kepaniteraan Mahkamah Agung RI melaksanakan Audit Kepatuhan Aksesibilitas Sistem Informasi Perkara.
      </p>
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Pengadilan Agama Lamongan Kelas I-A ditunjuk sebagai salah satu satker sampling monitoring berkala kepatuhan sinkronisasi data e-Court ke Sistem Informasi Penelusuran Perkara (SIPP) Mahkamah Agung. Diharapkan Tim IT dan Panitera mempersiapkan log sinkronisasi dan data dukung terlampir.
      </p>
      <p style="text-indent: 36px; margin-bottom: 24px;">
        Atas perhatian dan kerja sama jajaran pimpinan satuan kerja, kami ucapkan terima kasih.
      </p>
    `;
  }

  if (id === 'SM-005' || p.includes('delegasi')) {
    return `
      <p style="text-indent: 36px; margin-bottom: 14px;">
        Menunjuk ketentuan Pasal 390 ayat (1) HIR juncto SEMA No. 6 Tahun 2014 tentang Penanganan Delegasi Bantuan Panggilan/Pemberitahuan, Ketua Majelis Hakim Pengadilan Agama Jember dalam perkara Nomor <strong>1245/Pdt.G/2026/PA.Jbr</strong> dengan ini memohon bantuan delegasi pemanggilan sidang.
      </p>
      <p style="margin-bottom: 14px;">
        Adapun data pihak yang dipanggil berdomisili di wilayah hukum Pengadilan Agama Lamongan Kelas I-A, dengan rincian jadwal persidangan:
      </p>
      <div style="margin-left: 24px; margin-bottom: 16px; line-height: 1.8;">
        <table>
          <tr><td style="width: 140px; vertical-align: top;"><strong>Nomor Perkara</strong></td><td style="width: 15px; vertical-align: top;">:</td><td>1245/Pdt.G/2026/PA.Jbr</td></tr>
          <tr><td style="vertical-align: top;"><strong>Hari / Tanggal Sidang</strong></td><td style="vertical-align: top;">:</td><td>Kamis, 05 November 2026, Pukul 09.00 WIB</td></tr>
          <tr><td style="vertical-align: top;"><strong>Tempat Sidang</strong></td><td style="vertical-align: top;">:</td><td>Ruang Sidang Utama PA Jember, Jl. Teratai No. 10 Jember</td></tr>
        </table>
      </div>
      <p style="text-indent: 36px; margin-bottom: 24px;">
        Mohon relaas panggilan yang telah dilaksanakan dapat dikirimkan kembali melalui aplikasi Delegasi MARI sebelum hari sidang yang telah ditetapkan. Atas bantuannya disampaikan terima kasih.
      </p>
    `;
  }

  // Generic fallback
  return `
    <p style="text-indent: 36px; margin-bottom: 14px;">
      Bersama ini disampaikan naskah dinas resmi dari <strong>${surat.asalSurat || 'Instansi Pengirim'}</strong> perihal: <strong>${surat.perihal}</strong>.
    </p>
    <p style="text-indent: 36px; margin-bottom: 14px;">
      Naskah dinas ini telah dicatat dan teragendakan secara sah pada buku register persuratan kedinasan peradilan dengan Nomor Agenda <strong>${surat.agenda || '-'}</strong>.
    </p>
    <p style="text-indent: 36px; margin-bottom: 24px;">
      Demikian naskah dinas ini disampaikan untuk diketahui, ditindaklanjuti, dan dipergunakan sebagaimana mestinya.
    </p>
  `;
}

function getHeaderInfo(asalSurat) {
  const asal = (asalSurat || '').toLowerCase();

  if (asal.includes('pta surabaya') || asal.includes('pengadilan tinggi agama surabaya')) {
    return {
      instansi1: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
      instansi2: 'PENGADILAN TINGGI AGAMA SURABAYA',
      instansi3: 'WILAYAH HUKUM JAWA TIMUR',
      alamat: 'Jl. Mayjen Sungkono No. 74-76, Gn. Sari, Kec. Dukuhpakis, Surabaya 60224 • Telp: (031) 5684562 • pta-surabaya.go.id',
      pejabat: 'Ketua Pengadilan Tinggi Agama Surabaya',
      namaPejabat: 'Dr. H. Bahruddin Muhammad, S.H., M.H.',
      nipPejabat: '19620510 198803 1 003'
    };
  }

  if (asal.includes('pengadilan tinggi') || asal.includes('jawa timur')) {
    return {
      instansi1: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
      instansi2: 'PENGADILAN TINGGI JAWA TIMUR',
      instansi3: 'SURABAYA',
      alamat: 'Jl. Sumatera No. 4, Gubeng, Kec. Gubeng, Kota Surabaya, Jawa Timur 60281 • Telp: (031) 5032515 • pt-surabaya.go.id',
      pejabat: 'Ketua Pengadilan Tinggi Jawa Timur',
      namaPejabat: 'Dr. H. Kresna Menon, S.H., M.Hum.',
      nipPejabat: '19630718 199003 1 002'
    };
  }

  if (asal.includes('kepegawaian') || asal.includes('ortala') || asal.includes('biro')) {
    return {
      instansi1: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
      instansi2: 'BADAN URUSAN ADMINISTRASI',
      instansi3: 'BIRO KEPEGAWAIAN DAN ORGANISASI TATA LAKSANA',
      alamat: 'Jl. Medan Merdeka Utara No. 9-13, Jakarta Pusat 10110 • Tromol Pos No. 1028 • mahkamahagung.go.id',
      pejabat: 'Kepala Biro Kepegawaian MARI',
      namaPejabat: 'H. Sahwan, S.H., M.H.',
      nipPejabat: '19680320 199303 1 001'
    };
  }

  if (asal.includes('kepaniteraan mahkamah agung')) {
    return {
      instansi1: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
      instansi2: 'KEPANITERAAN MAHKAMAH AGUNG',
      instansi3: 'JAKARTA',
      alamat: 'Jl. Medan Merdeka Utara No. 9-13, Jakarta Pusat 10110 • Telp: (021) 3843348 • kepaniteraan.mahkamahagung.go.id',
      pejabat: 'Panitera Mahkamah Agung RI',
      namaPejabat: 'Dr. Heru Pramono, S.H., M.Hum.',
      nipPejabat: '19641215 198903 1 004'
    };
  }

  if (asal.includes('jember')) {
    return {
      instansi1: 'PENGADILAN TINGGI AGAMA SURABAYA',
      instansi2: 'PENGADILAN AGAMA JEMBER KELAS I-A',
      instansi3: 'KEPANITERAAN PERKARA',
      alamat: 'Jl. Teratai No. 10, Gebang, Kec. Patrang, Kabupaten Jember 68117 • Telp: (0331) 487406 • pa-jember.go.id',
      pejabat: 'Panitera Pengadilan Agama Jember',
      namaPejabat: 'Drs. Subandi, S.H., M.H.',
      nipPejabat: '19670815 199403 1 003'
    };
  }

  return {
    instansi1: 'PEMERINTAH REPUBLIK INDONESIA',
    instansi2: (asalSurat || 'INSTANSI PENGIRIM RESMI').toUpperCase(),
    instansi3: 'SEKRETARIAT & TATA USAHA KEDINASAN',
    alamat: 'Kantor Kedinasan Resmi Pemerintahan • Dokumen Naskah Dinas Terverifikasi',
    pejabat: `Pimpinan ${asalSurat || 'Instansi Pengirim'}`,
    namaPejabat: 'Drs. H. Mulyono, S.H., M.H.',
    nipPejabat: '19700115 199503 1 002'
  };
}

export function generateWarkatHtml(surat) {
  const header = getHeaderInfo(surat.asalSurat);
  const letterBody = getLetterBody(surat);
  const tanggalIndo = formatDateIndo(surat.tanggalSurat) || '19 Oktober 2026';
  const tanggalTerimaIndo = formatDateIndo(surat.tanggalTerima) || tanggalIndo;
  const fileName = surat.fileScan || `Scan_Warkat_${surat.id || 'Dokumen'}.pdf`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pratinjau Scan Warkat: ${surat.nomorSurat || surat.id} - ${surat.asalSurat || 'KlikSurat'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tinos:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #323639;
      color: #202124;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Sticky Toolbar - PDF Viewer Style */
    .viewer-navbar {
      background-color: #202124;
      color: #e8eaed;
      height: 54px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #3c4043;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .viewer-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .pdf-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #c5221f;
      color: white;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .file-meta {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .file-title {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 480px;
    }

    .file-sub {
      font-size: 11px;
      color: #9aa0a6;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .viewer-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-tool {
      background: #2e3034;
      border: 1px solid #4a4d51;
      color: #e8eaed;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }

    .btn-tool:hover {
      background: #3c4043;
      border-color: #5f6368;
      color: #ffffff;
    }

    .btn-tool-primary {
      background: #1a73e8;
      border-color: #1a73e8;
      color: white;
    }

    .btn-tool-primary:hover {
      background: #1557b0;
      border-color: #1557b0;
    }

    /* Document Workspace Canvas */
    .document-viewport {
      flex: 1;
      padding: 32px 16px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-x: auto;
    }

    /* A4 Paper Simulation */
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      padding: 22mm 24mm;
      background: #ffffff;
      box-shadow: 0 4px 24px rgba(0,0,0,0.45);
      border-radius: 2px;
      position: relative;
      font-family: 'Tinos', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #111111;
      transition: transform 0.2s ease;
      transform-origin: top center;
    }

    /* Watermark Scanned Stamp */
    .scan-stamp-bg {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 58pt;
      font-weight: 800;
      color: rgba(26, 115, 232, 0.04);
      pointer-events: none;
      letter-spacing: 6px;
      text-transform: uppercase;
      border: 8px dashed rgba(26, 115, 232, 0.04);
      padding: 18px 40px;
      white-space: nowrap;
    }

    /* Kop Surat */
    .kop-header {
      border-bottom: 3px double #000000;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .kop-logo {
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #000;
      border-radius: 50%;
      font-weight: 800;
      font-size: 10px;
      text-align: center;
      line-height: 1.1;
      padding: 6px;
      flex-shrink: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #f8f9fa;
    }

    .kop-text {
      flex: 1;
      text-align: center;
    }

    .kop-instansi1 {
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 1px;
    }

    .kop-instansi2 {
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 1px;
    }

    .kop-instansi3 {
      font-size: 10.5pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .kop-alamat {
      font-size: 8.5pt;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #333333;
      line-height: 1.3;
    }

    /* Meta Baris: Nomor, Sifat, Lampiran, Tanggal */
    .letter-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      font-size: 11pt;
    }

    .meta-table {
      border-collapse: collapse;
    }

    .meta-table td {
      padding: 1px 4px 1px 0;
      vertical-align: top;
    }

    .badge-sifat {
      display: inline-block;
      text-transform: uppercase;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .recipient-block {
      margin-bottom: 22px;
      line-height: 1.4;
      font-size: 11pt;
    }

    /* Body Text */
    .letter-body {
      text-align: justify;
      font-size: 11.5pt;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    /* Footer Signer & PTSP Stamp */
    .letter-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      page-break-inside: avoid;
    }

    /* Cap Penerimaan PTSP PA Lamongan */
    .ptsp-receipt-box {
      border: 2px solid #0b62a4;
      background: #f0f7fc;
      padding: 10px 14px;
      border-radius: 6px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9pt;
      color: #0b62a4;
      width: 250px;
      line-height: 1.35;
      position: relative;
    }

    .ptsp-receipt-title {
      font-weight: 800;
      font-size: 9.5pt;
      text-transform: uppercase;
      text-align: center;
      border-bottom: 1px dashed #0b62a4;
      padding-bottom: 4px;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .ptsp-receipt-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .ptsp-receipt-val {
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Pejabat Pengirim Sign Box */
    .signer-box {
      width: 260px;
      text-align: center;
      font-size: 11pt;
    }

    .signer-stamp {
      height: 64px;
      margin: 8px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .digital-seal {
      width: 62px;
      height: 62px;
      border: 2px dashed #1a73e8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1a73e8;
      font-size: 9px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      text-align: center;
      line-height: 1.1;
      padding: 4px;
      background: rgba(26, 115, 232, 0.05);
      transform: rotate(-12deg);
    }

    .signer-name {
      font-weight: 700;
      text-decoration: underline;
      font-size: 11.5pt;
    }

    .signer-nip {
      font-size: 10pt;
      color: #333;
    }

    /* Print Formatting */
    @media print {
      body {
        background: transparent !important;
      }
      .viewer-navbar {
        display: none !important;
      }
      .document-viewport {
        padding: 0 !important;
      }
      .a4-sheet {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 15mm 20mm !important;
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <!-- Viewer Header Toolbar -->
  <header class="viewer-navbar">
    <div class="viewer-left">
      <span class="pdf-badge">
        <span class="material-symbols-outlined" style="font-size: 16px;">picture_as_pdf</span>
        WARKAT DIGITAL
      </span>
      <div class="file-meta">
        <div class="file-title">${fileName}</div>
        <div class="file-sub">
          <span>Agenda: ${surat.agenda || '-'}</span>
          <span>•</span>
          <span>Ukuran: ${surat.fileSize || '2.4 MB'}</span>
          <span>•</span>
          <span>Status: Terverifikasi</span>
        </div>
      </div>
    </div>

    <div class="viewer-controls">
      <button class="btn-tool" onclick="zoomDoc(-0.1)" title="Perkecil Tampilan">
        <span class="material-symbols-outlined" style="font-size: 16px;">zoom_out</span>
      </button>
      <button class="btn-tool" onclick="zoomDoc(0.1)" title="Perbesar Tampilan">
        <span class="material-symbols-outlined" style="font-size: 16px;">zoom_in</span>
      </button>
      <button class="btn-tool btn-tool-primary" onclick="window.print()" title="Cetak Surat Warkat">
        <span class="material-symbols-outlined" style="font-size: 16px;">print</span>
        <span>Cetak Warkat</span>
      </button>
      <button class="btn-tool" onclick="window.close()" title="Tutup Tab">
        <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
        <span>Tutup</span>
      </button>
    </div>
  </header>

  <!-- Document Viewport -->
  <main class="document-viewport">
    <article class="a4-sheet" id="docSheet">
      <div class="scan-stamp-bg">PINDAIAN ASLI</div>

      <!-- Kop Resmi Instansi Pengirim -->
      <div class="kop-header">
        <div class="kop-logo">
          LOGO RESMI
        </div>
        <div class="kop-text">
          <div class="kop-instansi1">${header.instansi1}</div>
          <div class="kop-instansi2">${header.instansi2}</div>
          <div class="kop-instansi3">${header.instansi3}</div>
          <div class="kop-alamat">${header.alamat}</div>
        </div>
      </div>

      <!-- Meta Baris Nomor & Tanggal -->
      <div class="letter-meta">
        <table class="meta-table">
          <tr>
            <td>Nomor</td>
            <td>:</td>
            <td><strong>${surat.nomorSurat}</strong></td>
          </tr>
          <tr>
            <td>Sifat</td>
            <td>:</td>
            <td><span class="badge-sifat">${(surat.sifat || 'biasa').replace('_', ' ')}</span></td>
          </tr>
          <tr>
            <td>Lampiran</td>
            <td>:</td>
            <td>${surat.lampiran || '1 Berkas'}</td>
          </tr>
          <tr>
            <td>Perihal</td>
            <td>:</td>
            <td><strong>${surat.perihal}</strong></td>
          </tr>
        </table>

        <div style="text-align: right; font-size: 11pt;">
          ${tanggalIndo}
        </div>
      </div>

      <!-- Alamat Tujuan -->
      <div class="recipient-block">
        <div>Kepada Yth.</div>
        <div style="font-weight: 700; margin-top: 2px;">
          ${surat.tujuanAwal || 'Ketua Pengadilan Agama Lamongan Kelas I-A'}
        </div>
        <div>di -</div>
        <div style="margin-left: 24px; text-decoration: underline;">TEMPAT</div>
      </div>

      <!-- Isi Surat Masuk -->
      <div class="letter-body">
        ${letterBody}
      </div>

      <!-- Footer: Cap Penerimaan PTSP + TTD Pengirim -->
      <div class="letter-footer">
        <!-- Cap Agenda PTSP PA Lamongan -->
        <div class="ptsp-receipt-box">
          <div class="ptsp-receipt-title">
            PENGADILAN AGAMA LAMONGAN<br>
            <span style="font-size: 7.5pt; font-weight: 500;">Diterima Loket Persuratan PTSP</span>
          </div>
          <div class="ptsp-receipt-row">
            <span>No. Agenda:</span>
            <span class="ptsp-receipt-val">${surat.agenda || 'AGD-2026/SM-001'}</span>
          </div>
          <div class="ptsp-receipt-row">
            <span>Tgl Terima:</span>
            <span>${tanggalTerimaIndo}</span>
          </div>
          <div class="ptsp-receipt-row">
            <span>Petugas:</span>
            <span style="font-weight: 600;">AF (Ahmad Fauzi, S.H.)</span>
          </div>
          <div class="ptsp-receipt-row" style="margin-top: 4px; padding-top: 3px; border-top: 1px dashed #b4d3ea; font-size: 8pt;">
            <span>Status Warkat:</span>
            <span style="color: #0b62a4; font-weight: 700;">TERVERIFIKASI FISIK & SCAN</span>
          </div>
        </div>

        <!-- Tanda Tangan Pejabat Pengirim -->
        <div class="signer-box">
          <div>${header.pejabat},</div>
          <div class="signer-stamp">
            <div class="digital-seal">
              TERTANDA<br>DIGITAL<br>MARI
            </div>
          </div>
          <div class="signer-name">${header.namaPejabat}</div>
          <div class="signer-nip">NIP. ${header.nipPejabat}</div>
        </div>
      </div>
    </article>
  </main>

  <script>
    let currentZoom = 1.0;
    function zoomDoc(delta) {
      currentZoom = Math.min(Math.max(currentZoom + delta, 0.7), 1.6);
      const sheet = document.getElementById('docSheet');
      if (sheet) {
        sheet.style.transform = 'scale(' + currentZoom + ')';
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Buka dokumen warkat di tab baru browser.
 */
export function openWarkatPreview(surat) {
  if (!surat) return;

  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    alert('Pop-up terblokir oleh browser. Harap izinkan pop-up untuk membaca warkat digital.');
    return;
  }

  const html = generateWarkatHtml(surat);
  newWindow.document.open();
  newWindow.document.write(html);
  newWindow.document.close();
}

