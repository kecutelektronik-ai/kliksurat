/**
 * Fonnte WhatsApp Gateway Integration
 * Dokumentasi API resmi: https://fonnte.com
 */

/**
 * Membersihkan dan menormalkan format nomor telepon Indonesia
 * Contoh: "+62 812-3456-7890" -> "081234567890" / "6281234567890"
 */
export function normalizeIndonesianPhone(phone) {
  if (!phone) return '';
  // Hapus semua karakter non-digit kecuali koma (untuk multi-target)
  let cleaned = phone.replace(/[^\d,]/g, '');

  // Jika multi target dipisah koma
  if (cleaned.includes(',')) {
    return cleaned
      .split(',')
      .map((p) => normalizeIndonesianPhone(p))
      .filter(Boolean)
      .join(',');
  }

  // Jika diawali 08..., biarkan atau ubah ke 628...
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

/**
 * Cek status perangkat WhatsApp yang terhubung ke Fonnte
 * Endpoint: POST https://api.fonnte.com/device
 * Header: Authorization: <TOKEN>
 */
export async function checkFonnteDevice(token) {
  const activeToken =
    token ||
    import.meta.env.VITE_FONNTE_TOKEN ||
    '';

  if (!activeToken || activeToken.startsWith('fn_live_89a7')) {
    return {
      success: false,
      status: false,
      reason: 'Token API Fonnte belum diisi atau masih menggunakan token contoh.',
      device_status: 'unconfigured',
    };
  }

  try {
    const response = await fetch('https://api.fonnte.com/device', {
      method: 'POST',
      headers: {
        Authorization: activeToken.trim(),
      },
    });

    if (!response.ok) {
      return {
        success: false,
        status: false,
        reason: `Server Fonnte merespons HTTP ${response.status}: ${response.statusText}`,
        device_status: 'error',
      };
    }

    const data = await response.json();
    return {
      success: Boolean(data.status),
      status: data.status,
      device_status: data.device_status || (data.status ? 'connect' : 'disconnect'),
      device: data.device || '',
      name: data.name || '',
      expired: data.expired || '',
      messages: data.messages ?? null,
      quota: data.quota ?? null,
      reason: data.reason || (data.status ? 'OK' : 'Unknown error'),
      raw: data,
    };
  } catch (err) {
    console.error('Error saat menghubungi API Fonnte /device:', err);
    return {
      success: false,
      status: false,
      reason: `Gagal tersambung ke Fonnte: ${err.message || 'Periksa koneksi internet'}`,
      device_status: 'offline',
    };
  }
}

/**
 * Mengirim pesan WhatsApp teks atau dokumen melalui Fonnte
 * Endpoint: POST https://api.fonnte.com/send
 * Header: Authorization: <TOKEN>
 * Body: FormData { target, message, countryCode: '62', url, filename }
 */
export async function sendFonnteMessage({
  token,
  target,
  message,
  url = null,
  filename = null,
  typing = true,
  delay = '1',
}) {
  const activeToken =
    token ||
    import.meta.env.VITE_FONNTE_TOKEN ||
    '';

  if (!activeToken || activeToken.startsWith('fn_live_89a7')) {
    return {
      success: false,
      status: false,
      reason: 'Token API Fonnte belum diisi dengan kredensial aktif.',
    };
  }

  const cleanTarget = normalizeIndonesianPhone(target);
  if (!cleanTarget) {
    return {
      success: false,
      status: false,
      reason: 'Nomor WhatsApp tujuan (target) tidak valid atau kosong.',
    };
  }

  try {
    const formData = new FormData();
    formData.append('target', cleanTarget);
    formData.append('message', message);
    formData.append('countryCode', '62');

    if (typing) {
      formData.append('typing', 'true');
    }
    if (delay) {
      formData.append('delay', String(delay));
    }
    if (url) {
      formData.append('url', url);
      if (filename) {
        formData.append('filename', filename);
      }
    }

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: activeToken.trim(),
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        status: false,
        reason: `Server Fonnte merespons HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: Boolean(data.status),
      status: data.status,
      detail: data.detail || (data.status ? 'Pesan berhasil diproses Fonnte' : data.reason),
      target: data.target || [cleanTarget],
      reason: data.reason || '',
      id: data.id || null,
      raw: data,
    };
  } catch (err) {
    console.error('Error saat mengirim pesan via Fonnte /send:', err);
    return {
      success: false,
      status: false,
      reason: `Gagal mengirim pesan: ${err.message || 'Periksa koneksi internet'}`,
    };
  }
}
