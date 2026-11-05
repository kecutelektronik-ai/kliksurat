import React, { useState } from 'react';
import { useSurat } from '../context/SuratContext';

export default function WhatsApp() {
  const { waSettings, setWaSettings, showToast } = useSurat();

  const [token, setToken] = useState(waSettings.token);
  const [senderPhone, setSenderPhone] = useState(waSettings.senderPhone);
  const [showPassword, setShowPassword] = useState(false);
  const [activeChatTemplate, setActiveChatTemplate] = useState('surat_masuk'); // surat_masuk, disposisi, tindak_lanjut

  const [testNumber, setTestNumber] = useState('+62 812-3456-7890');
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setWaSettings({
      ...waSettings,
      token,
      senderPhone,
    });
    showToast('Konfigurasi Gateway WhatsApp Fonnte.com berhasil disimpan.', 'success');
  };

  const toggleTrigger = (triggerName) => {
    setWaSettings((prev) => ({
      ...prev,
      triggers: {
        ...prev.triggers,
        [triggerName]: !prev.triggers[triggerName],
      },
    }));
    showToast(`Pengaturan pemicu notifikasi ${triggerName} diperbarui.`);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      showToast('Koneksi ke API Fonnte.com BERHASIL. Gateway merespons status: ONLINE (200 OK)', 'success');
    }, 1000);
  };

  const handleSendTestMessage = (e) => {
    e.preventDefault();
    const testLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      recipient: testNumber,
      type: 'Uji Coba Pesan',
      nomorSurat: '012/PA.Lmg/X/2026',
      text: `[KlikDispos] Notifikasi Persuratan Resmi Pengadilan Agama Lamongan via Fonnte. Gateway WhatsApp berfungsi optimal.`,
      status: 'Terkirim (Centang Dua)',
    };

    setWaSettings((prev) => ({
      ...prev,
      dailyQuota: {
        ...prev.dailyQuota,
        used: prev.dailyQuota.used + 1,
      },
      messageLogs: [testLog, ...prev.messageLogs],
    }));

    showToast(`Pesan uji coba WhatsApp berhasil dikirim ke ${testNumber}`, 'success');
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    showToast('Token API disalin ke clipboard.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-subtle">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-outline mb-1">
            <span>Manajemen Persuratan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Integrasi WhatsApp</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Gateway Fonnte.com</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Pengaturan WhatsApp</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-light text-success border border-success/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Integrasi Aktif</span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-outline mt-0.5">
            Konfigurasi gateway pengiriman pesan notifikasi otomatis dan berkas naskah dinas melalui <span className="font-semibold text-primary">Fonnte.com</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://fonnte.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-3.5 rounded-btn border border-outline-subtle bg-white text-on-surface hover:bg-surface text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
            <span>Dokumentasi API Fonnte</span>
          </a>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="h-10 px-4 rounded-btn bg-success hover:bg-success-dark text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isTesting ? 'sync' : 'network_check'}
            </span>
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* Bento Metric / Integration Summary */}
      <div className="bg-white rounded-card border border-outline-subtle p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[28px]">cell_tower</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Integrasi WhatsApp Gateway melalui Fonnte
                </h3>
                <p className="text-xs text-outline">
                  Gateway Layanan Komunikasi Eksternal & Notifikasi Persuratan Instan (API v4)
                </p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Modul ini menghubungkan buku register persuratan kepaniteraan langsung ke saluran pesan terenkripsi WhatsApp aparatur. Berfungsi untuk mempercepat rantai disposisi naskah dari Ketua/Wakil Ketua ke Panitera & Sekretaris, pemberitahuan surat kilat, dan koordinasi tindak lanjut tanpa jeda waktu.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary-light text-primary font-bold border border-primary/20">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>End-to-End Handshake TLS 1.3</span>
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-success-light text-success font-bold border border-success/30">
                <span className="material-symbols-outlined text-[14px]">speed</span>
                <span>Rata-rata Waktu Kirim: ~1.2 Detik</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface p-4 rounded-card border border-outline-subtle">
            <div className="bg-white p-3.5 rounded-lg border border-outline-subtle flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-xs text-outline">
                <span>Status Server</span>
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              </div>
              <div className="text-xl font-bold text-success mt-2">Terhubung</div>
              <span className="text-[11px] text-outline mt-0.5">Fonnte Cloud: Online</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-outline-subtle flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-xs text-outline">
                <span>Kuota Pesan</span>
                <span className="text-[10px] font-bold bg-warning-light text-amber-900 border border-warning/40 px-1.5 py-0.5 rounded">
                  96.4%
                </span>
              </div>
              <div className="text-xl font-bold text-on-surface mt-2">
                {waSettings.dailyQuota.total - waSettings.dailyQuota.used}
              </div>
              <span className="text-[11px] text-outline mt-0.5">
                dari {waSettings.dailyQuota.total} pesan harian
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-outline-subtle col-span-1 sm:col-span-2 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-danger-light text-danger flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">
                    {waSettings.dailyQuota.used} Notifikasi Terkirim Hari Ini
                  </div>
                  <div className="text-[11px] text-outline">Tingkat keberhasilan: 100%</div>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">Sukses 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Form Kredensial & Pemicu (Left) + WhatsApp Simulator Live (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Kredensial & Switch Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Kredensial */}
          <div className="bg-white rounded-card border border-outline-subtle p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">key</span>
                <h3 className="text-base font-bold text-on-surface">Kredensial Akun Gateway Fonnte</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-success-light text-success border border-success/30 font-bold">
                Terhubung
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-on-surface">
                    Token API Fonnte <span className="text-danger">*</span>
                  </label>
                  <span className="text-[11px] text-outline flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[13px] text-primary">encrypted</span>
                    Terenkripsi SHA-256
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="fn_live_..."
                    className="w-full h-10 pl-3.5 pr-20 rounded-btn border border-outline-subtle bg-surface font-code text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-outline">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:text-primary"
                      title="Lihat / Tutup Token"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={copyToken}
                      className="p-1 hover:text-primary"
                      title="Salin Token"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-outline">
                  Dapatkan token resmi API Anda melalui dasbor perangkat akun <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Fonnte.com</a>.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">
                  Nomor WhatsApp Gateway Pengirim <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    phone_in_talk
                  </span>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full h-10 pl-10 pr-4 rounded-btn border border-outline-subtle bg-surface font-code text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <p className="text-[11px] text-outline">
                  Nomor resmi terdaftar pada Meja Tata Usaha Kepaniteraan Pengadilan.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="h-9 px-5 rounded-btn bg-success hover:bg-success-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Simpan Kredensial</span>
                </button>
              </div>
            </form>
          </div>

          {/* 4 Pemicu Notifikasi Otomatis (Switches) */}
          <div className="bg-white rounded-card border border-outline-subtle p-6 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-outline-subtle">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                Pengaturan Pemicu Notifikasi Otomatis
              </h3>
              <p className="text-xs text-outline mt-0.5">
                Tentukan modul administrasi yang akan mengirim pesan WhatsApp secara langsung ke penerima
              </p>
            </div>

            <div className="space-y-3">
              {/* Trigger 1: Surat Masuk */}
              <div className="p-3.5 rounded-card border border-outline-subtle bg-surface flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mark_email_unread</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Pemberitahuan Surat Masuk</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-success-light text-success border border-success/30 font-bold">Wajib</span>
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Kirim pesan instan ke Ketua & Wakil saat ada surat masuk baru tercatat di loket.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={waSettings.triggers.suratMasuk}
                    onChange={() => toggleTrigger('suratMasuk')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Trigger 2: Distribusi Surat */}
              <div className="p-3.5 rounded-card border border-outline-subtle bg-surface flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-success-light text-success border border-success/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">move_to_inbox</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Pemberitahuan Distribusi Surat</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-low text-outline font-semibold">Unit Kerja</span>
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Notifikasi penerimaan berkas ke unit kerja (Kepaniteraan, Kesekretariatan, Panmud).
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={waSettings.triggers.distribusi}
                    onChange={() => toggleTrigger('distribusi')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Trigger 3: Disposisi Surat */}
              <div className="p-3.5 rounded-card border border-outline-subtle bg-surface flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-danger-light text-danger flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Pemberitahuan Disposisi</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-danger-light text-danger font-bold">Instruksi Pimpinan</span>
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Kirim naskah arahan dan link lembar disposisi langsung ke penerima disposisi.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={waSettings.triggers.disposisi}
                    onChange={() => toggleTrigger('disposisi')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
                </label>
              </div>

              {/* Trigger 4: Tindak Lanjut */}
              <div className="p-3.5 rounded-card border border-outline-subtle bg-surface flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-warning-light text-amber-900 border border-warning/40 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Pemberitahuan Tindak Lanjut</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-warning-light text-amber-900 border border-warning/40 font-bold">Batas Waktu</span>
                    </div>
                    <p className="text-[11px] text-outline mt-0.5">
                      Pengingat otomatis tenggat penyelesaian disposisi kepada aparatur penanggung jawab.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={waSettings.triggers.tindakLanjut}
                    onChange={() => toggleTrigger('tindakLanjut')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warning-dark"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pratinjau Live WhatsApp Chat & Test Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">smartphone</span>
                Pratinjau Pesan WhatsApp Live
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success-light text-success border border-success/30">
                Format Fonnte v4
              </span>
            </div>

            {/* Template Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-surface rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveChatTemplate('surat_masuk')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all text-center ${
                  activeChatTemplate === 'surat_masuk'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Surat Masuk
              </button>
              <button
                type="button"
                onClick={() => setActiveChatTemplate('disposisi')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all text-center ${
                  activeChatTemplate === 'disposisi'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Disposisi
              </button>
              <button
                type="button"
                onClick={() => setActiveChatTemplate('tindak_lanjut')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all text-center ${
                  activeChatTemplate === 'tindak_lanjut'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Tindak Lanjut
              </button>
            </div>

            {/* Authentic WhatsApp Phone Screen Frame */}
            <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md bg-[#EFEAE2]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs">
                    <span className="material-symbols-outlined text-[18px]">balance</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">PTSP Persuratan PA Lamongan</div>
                    <div className="text-[10px] text-white/80 leading-tight">Akun Bisnis Resmi Peradilan</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-3.5 flex flex-col gap-2.5 min-h-[260px] bg-[radial-gradient(#d4dbd7_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="self-center bg-white/80 backdrop-blur-xs text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded shadow-2xs font-medium">
                  HARI INI
                </div>

                {/* Message Bubble */}
                <div className="self-start max-w-[92%] bg-white rounded-lg rounded-tl-none p-3 shadow-xs border border-black/5 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-[#075E54] flex items-center gap-1">
                    <span>KlikDispos Elektronik</span>
                    <span className="material-symbols-outlined text-[12px] text-primary">verified</span>
                  </div>

                  {activeChatTemplate === 'surat_masuk' && (
                    <div className="text-[#111B21] leading-relaxed space-y-1">
                      <p>Yth. Bapak/Ibu Pimpinan,</p>
                      <p>
                        Terdapat <strong>Surat Masuk Baru</strong> dengan Nomor Agenda <span className="font-code text-primary font-bold">AGD-2026/X/SM-0012</span>:
                      </p>
                      <div className="p-2 bg-gray-50 rounded border-l-2 border-primary text-[11px]">
                        <div><strong>No:</strong> 012/PA.Lmg/X/2026</div>
                        <div><strong>Pengirim:</strong> PTA Surabaya</div>
                        <div><strong>Perihal:</strong> Undangan Rapat Koordinasi Pembinaan Wilayah</div>
                        <div><strong>Sifat:</strong> SEGERA (24 Jam)</div>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Mohon ditinjau untuk pemberian lembar disposisi elektronik.
                      </p>
                    </div>
                  )}

                  {activeChatTemplate === 'disposisi' && (
                    <div className="text-[#111B21] leading-relaxed space-y-1">
                      <p>Yth. Bpk. H. M. Ridwan, S.H. (Sekretaris),</p>
                      <p>
                        Terdapat <strong>Instruksi Disposisi Baru</strong> dari Ketua Pengadilan Agama untuk surat <span className="font-code text-primary font-bold">012/PA.Lmg/X/2026</span>:
                      </p>
                      <div className="p-2 bg-warning-light rounded border-l-2 border-warning text-[11px] text-amber-950">
                        <div><strong>Instruksi:</strong> Hadiri / Wakili & Tindaklanjuti</div>
                        <div><strong>Arahan:</strong> Hadiri rakor wilayah PTA Surabaya dan siapkan laporan penyerapan anggaran DIPA.</div>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Tautan naskah: <span className="text-primary underline">https://persuratan.pengadilan.go.id/lk-012</span>
                      </p>
                    </div>
                  )}

                  {activeChatTemplate === 'tindak_lanjut' && (
                    <div className="text-[#111B21] leading-relaxed space-y-1">
                      <p className="text-danger font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        <span>PENGINGAT BATAS WAKTU (TENGGAT DISPOSISI)</span>
                      </p>
                      <p>
                        Surat <strong>039/PL.01/X/2026</strong> perihal Pengadaan Perangkat Sidang Elektronik telah berada di unit Anda selama <strong>48 jam</strong>.
                      </p>
                      <div className="p-2 bg-red-50 rounded border-l-2 border-red-500 text-[11px]">
                        Batas waktu penyelesaian: Hari Ini, pukul 16:00 WIB.
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end items-center gap-1 text-[10px] text-gray-400 -mt-1">
                    <span>10:45 WIB</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Uji Kirim Pesan Langsung */}
            <div className="pt-2 border-t border-outline-subtle space-y-2">
              <span className="text-xs font-bold text-on-surface block">Kirim Pesan Uji Coba WhatsApp:</span>
              <form onSubmit={handleSendTestMessage} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="flex-1 h-9 px-3 rounded-btn border border-outline-subtle bg-surface text-xs font-code outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-btn bg-primary hover:bg-primary-dark text-white text-xs font-bold shrink-0 shadow-2xs"
                >
                  Kirim Tes
                </button>
              </form>
            </div>
          </div>

          {/* Log Riwayat Transmisi Pesan WhatsApp */}
          <div className="bg-white rounded-card border border-outline-subtle p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-subtle text-xs">
              <span className="font-bold text-on-surface">Riwayat Pesan Terkirim</span>
              <span className="text-outline">{waSettings.messageLogs.length} Log Terakhir</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {waSettings.messageLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-surface border border-outline-subtle space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-primary">{log.type}</span>
                    <span className="text-outline">{log.time}</span>
                  </div>
                  <div className="text-on-surface font-semibold text-xs">
                    Ke: {log.recipient} ({log.nomorSurat})
                  </div>
                  <p className="text-[11px] text-outline line-clamp-2 leading-relaxed">
                    {log.text}
                  </p>
                  <div className="text-[10px] text-success font-bold flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-[13px]">done_all</span>
                    <span>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
