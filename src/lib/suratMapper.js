/**
 * Adapter / Data Mapper antara skema database PostgreSQL Supabase (snake_case)
 * dan state frontend React aplikasi KlikSurat (camelCase).
 */

export function mapRowToSuratMasuk(row) {
  return {
    id: row.id,
    nomorSurat: row.nomor_surat || '',
    agenda: row.agenda || '',
    asalSurat: row.asal_surat || '',
    perihal: row.perihal || '',
    tanggalSurat: row.tanggal_surat ? String(row.tanggal_surat).slice(0, 10) : '',
    tanggalTerima: row.tanggal_terima ? String(row.tanggal_terima).slice(0, 16) : '',
    sifat: row.sifat || 'biasa',
    status: row.status || 'Menunggu Disposisi',
    lampiran: row.lampiran || '',
    fileScan: row.file_scan || '',
    fileSize: row.file_size || '',
    tujuanAwal: row.tujuan_surat || 'Ketua Pengadilan Agama Lamongan Kelas I-A',
    prioritasTinggi: Boolean(row.prioritas_tinggi),
  };
}

export function mapRowToSuratKeluar(row) {
  return {
    id: row.id,
    nomorSurat: row.nomor_surat || '',
    unitPengusul: row.unit_pengusul || '',
    pembuat: row.pembuat || '',
    tujuanSurat: row.tujuan_surat || '',
    perihal: row.perihal || '',
    tanggalSurat: row.tanggal_surat ? String(row.tanggal_surat).slice(0, 10) : '',
    sifat: row.sifat || 'biasa',
    status: row.status || 'Draft',
    disetujuiOleh: row.disetujui_oleh || null,
    waktuPersetujuan: row.waktu_persetujuan ? String(row.waktu_persetujuan).slice(0, 16) : null,
    nomorUrut: row.nomor_urut ?? null,
    kodeKlasifikasi: row.kode_klasifikasi || 'HK.01',
    lampiran: row.lampiran || '',
  };
}

export function mapSuratMasukToRow(item, initialTracking = []) {
  return {
    id: item.id,
    jenis_surat: 'masuk',
    nomor_surat: item.nomorSurat,
    agenda: item.agenda,
    asal_surat: item.asalSurat,
    tujuan_surat: item.tujuanAwal || 'Ketua Pengadilan Agama Lamongan Kelas I-A',
    perihal: item.perihal,
    tanggal_surat: item.tanggalSurat,
    tanggal_terima: item.tanggalTerima ? new Date(item.tanggalTerima).toISOString() : new Date().toISOString(),
    sifat: item.sifat || 'biasa',
    status: item.status || 'Menunggu Disposisi',
    lampiran: item.lampiran || '1 Berkas PDF',
    file_scan: item.fileScan || 'Naskah_Surat_Masuk.pdf',
    file_size: item.fileSize || '2.1 MB',
    prioritas_tinggi: Boolean(item.prioritasTinggi),
    tracking: initialTracking,
  };
}

export function mapSuratKeluarToRow(item) {
  return {
    id: item.id,
    jenis_surat: 'keluar',
    nomor_surat: item.nomorSurat,
    unit_pengusul: item.unitPengusul,
    pembuat: item.pembuat,
    tujuan_surat: item.tujuanSurat,
    perihal: item.perihal,
    tanggal_surat: item.tanggalSurat,
    sifat: item.sifat || 'biasa',
    status: item.status || 'Menunggu Persetujuan Atasan',
    kode_klasifikasi: item.kodeKlasifikasi || 'HK.01',
    lampiran: item.lampiran || '1 Berkas',
    disetujui_oleh: item.disetujuiOleh || null,
    waktu_persetujuan: item.waktuPersetujuan ? new Date(item.waktuPersetujuan).toISOString() : null,
    nomor_urut: item.nomorUrut ?? null,
    tracking: [],
  };
}

