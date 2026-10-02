/* ===================== KONFIGURASI ===================== */
const KONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwTuAE29ofD3mdREy71i5m4tE2R0G6wwUHZr5V7PVl9gCq9OLsGEUy_tZ0Zde_xljoCYA/exec',
  UNIVERSITAS: 'Universitas Muhammadiyah Bengkulu',
  INSTANSI: 'UMB Global Engagement',
  SINGKAT: 'UMB'
};

/* ===================== UTILITAS ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const tgl = s => { if (!s) return '-'; const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return `${d} ${BLN[m - 1]} ${y}`; };
const tglPendek = s => { if (!s) return '-'; const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return `${d} ${BLN[m - 1].slice(0, 3)} ${y}`; };
const angka = n => new Intl.NumberFormat('id-ID').format(n || 0);
const inisial = n => String(n || '?').split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
const hariIniStr = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };
const tambahTahunStr = (s, n) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y + n, m - 1, d)).toISOString().slice(0, 10); };
const teksSisa = s => s == null ? '' : s > 0 ? `${s} hari lagi` : s === 0 ? 'berakhir hari ini' : `berakhir ${-s} hari lalu`;
const ukuranBerkas = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.ceil(b / 1024) + ' KB';

const IKON = {
  beranda: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  dokumen: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  aktivitas: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  mitra: '<path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M14 9h5a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2"/><path d="M3 21h18"/>',
  lonceng: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>',
  pengguna: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.6 3.5 5.7"/>',
  unit: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  log: '<path d="M9 4h6v3H9z"/><path d="M7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1"/><path d="M9 12h6M9 16h6"/>',
  keluar: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  cari: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  unduh: '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  mata: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  cek: '<path d="M5 12l5 5 9-10"/>',
  ubah: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  sampah: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  surat: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/>',
  unggah: '<path d="M12 16V4M7 8l5-5 5 5"/><path d="M4 20h16"/>'
};
const ikon = (n, u = 18) => `<svg width="${u}" height="${u}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IKON[n] || ''}</svg>`;

const LABEL_PERAN = {
  superadmin: 'Superadmin (Kepala UGE)', admin_utama: 'Admin Utama (Tim UGE)', admin_prodi: 'Admin Prodi',
  admin_fakultas: 'Admin Fakultas', admin_rektorat: 'Admin Rektorat, Unit, Lembaga, dan Biro'
};

/* ===================== STATE DAN API ===================== */
const S = { token: '', user: null, hak: {}, opsi: null, mitra: null, hal: '', dok: [], dash: null, rank: { valid: true, jenis: 'prodi' }, auth: { view: 'masuk', email: '' }, tugas: {} };
try { S.token = localStorage.getItem('uge_token') || ''; } catch (e) { S.token = ''; }
const simpanToken = t => { S.token = t || ''; try { t ? localStorage.setItem('uge_token', t) : localStorage.removeItem('uge_token'); } catch (e) { /* penyimpanan dinonaktifkan */ } };
const ada = h => !!S.hak[h];

async function api(aksi, data = {}) {
  let res, j;
  try { res = await fetch(KONFIG.API_URL, { method: 'POST', body: JSON.stringify({ aksi, data, token: S.token }) }); }
  catch (e) { throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'); }
  try { j = await res.json(); } catch (e) { throw new Error('Server memberi jawaban yang tidak dapat dibaca. Coba lagi beberapa saat.'); }
  if (!j.ok) {
    const err = new Error(j.pesan || 'Terjadi kesalahan.'); err.kode = j.kode;
    if (j.kode === 'SESI' && S.token) keluar(true);
    throw err;
  }
  return j.data;
}

/* ===================== UI DASAR ===================== */
const TUMPUK = [];
function toast(pesan, jenis = '', tetap = false) {
  const el = document.createElement('div'); el.className = 'toast ' + jenis; el.textContent = pesan;
  $('#toast').appendChild(el);
  const tutup = () => el.remove();
  if (!tetap) setTimeout(tutup, jenis === 'bad' ? 6500 : 3500);
  return { tutup };
}

function modal({ judul, isi, lebar = 560, tombol = [], onTutup, laci = false, kelas = '' }) {
  const lap = document.createElement('div'); lap.className = 'lapis' + (laci ? ' laci' : '');
  lap.innerHTML = `<div class="kotak ${kelas}" style="${laci ? '' : 'max-width:' + lebar + 'px'}" role="dialog" aria-modal="true" aria-label="${esc(judul)}">
    <div class="kotak-kepala"><h3>${esc(judul)}</h3><button type="button" class="ikon-btn" data-x aria-label="Tutup">${ikon('x')}</button></div>
    <div class="kotak-isi">${isi}</div><div class="kotak-galat" hidden></div>${tombol.length ? '<div class="kotak-kaki"></div>' : ''}</div>`;
  document.body.appendChild(lap); document.body.classList.add('kunci');
  const m = {
    el: lap, isi: $('.kotak-isi', lap),
    tutup() { if (!lap.isConnected) return; lap.remove(); const i = TUMPUK.indexOf(m); if (i >= 0) TUMPUK.splice(i, 1); if (!TUMPUK.length) document.body.classList.remove('kunci'); if (onTutup) onTutup(); },
    galat(t) { const g = $('.kotak-galat', lap); g.hidden = !t; g.textContent = t || ''; }
  };
  tombol.forEach(t => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (t.kelas || 'btn-ghost'); b.textContent = t.label;
    b.addEventListener('click', async () => {
      m.galat(''); b.disabled = true;
      try { await t.aksi(m); } catch (e) { m.galat(e.message); } finally { b.disabled = false; }
    });
    $('.kotak-kaki', lap).appendChild(b);
  });
  lap.addEventListener('mousedown', e => { if (e.target === lap) m.tutup(); });
  $('[data-x]', lap).addEventListener('click', m.tutup);
  TUMPUK.push(m);
  const f = $('input:not([type=hidden]),select,textarea', m.isi); if (f && !laci) f.focus();
  return m;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && TUMPUK.length) TUMPUK[TUMPUK.length - 1].tutup(); });

function konfirmasi(judul, pesan, ok = 'Ya, lanjutkan', bahaya = false) {
  return new Promise(res => {
    const m = modal({
      judul, lebar: 460, isi: `<p>${esc(pesan)}</p>`, onTutup: () => res(false),
      tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: ok, kelas: bahaya ? 'btn-bahaya' : 'btn-utama', aksi: () => { res(true); m.tutup(); } }]
    });
  });
}

function muatTombol(b, on, teks) {
  if (!b) return;
  if (on) { b.dataset.asal = b.innerHTML; b.disabled = true; b.innerHTML = `<span class="muat"></span> ${esc(teks || 'Memproses')}`; }
  else { b.disabled = false; if (b.dataset.asal) b.innerHTML = b.dataset.asal; }
}

function lencana(t, j = 'abu') { return `<span class="lencana l-${j}">${esc(t)}</span>`; }
const MASA = { aktif: ['Aktif', 'ok'], segera: ['Segera berakhir', 'warn'], kedaluwarsa: ['Berakhir', 'bad'], tanpa_batas: ['Aktif, tanpa batas', 'ok'] };
const lMasa = s => lencana(MASA[s][0], MASA[s][1]);
const lVal = (v, impl) => v === 'valid' ? lencana(impl ? 'Terverifikasi' : 'Tervalidasi', 'ok') : v === 'perbaikan' ? lencana('Perlu perbaikan', 'bad') : lencana(impl ? 'Menunggu verifikasi' : 'Menunggu validasi', 'info');
const lJenis = d => lencana(d.jenis === 'Lainnya' && d.jenis_lain ? d.jenis_lain : d.jenis, 'emas');

function judulHal(judul, sub, aksi) {
  return `<div class="kepala-hal"><div><h1>${esc(judul)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>${aksi ? `<div class="aksi">${aksi}</div>` : ''}</div>`;
}
const memuat = () => '<div class="memuat"><div class="spin"></div><span>Memuat data</span></div>';
function galatHal(el, e) { el.innerHTML = `<div class="panel"><div class="kosong"><h3>Data tidak dapat dimuat</h3><p>${esc(e.message)}</p><button class="btn btn-ghost" data-aksi="muat-ulang">Coba lagi</button></div></div>`; }

function b64Blob(b64) { const bin = atob(b64), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: 'application/pdf' }); }
function bacaPdf(file) {
  return new Promise((res, rej) => {
    if (!file) return res(null);
    const maks = (S.opsi && S.opsi.maks_pdf_mb) || 8;
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) return rej(new Error('Berkas harus berformat PDF.'));
    if (file.size > maks * 1048576) return rej(new Error(`Ukuran "${file.name}" melebihi ${maks} MB. Kompres berkas lalu coba lagi.`));
    const r = new FileReader();
    r.onload = () => res({ nama: file.name, b64: String(r.result).split(',')[1] });
    r.onerror = () => rej(new Error('Berkas tidak dapat dibaca.'));
    r.readAsDataURL(file);
  });
}
async function bukaPdf(jenis, id, mode) {
  const t = toast(mode === 'unduh' ? 'Menyiapkan unduhan' : 'Membuka berkas', '', true);
  try {
    const r = await api('ambilFile', { jenis, id, mode }), url = URL.createObjectURL(b64Blob(r.b64));
    if (mode === 'unduh') {
      const a = document.createElement('a'); a.href = url; a.download = r.nama; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000); toast('Berkas diunduh', 'ok');
    } else {
      modal({ judul: r.nama, lebar: 1000, kelas: 'kotak-pdf', onTutup: () => URL.revokeObjectURL(url),
        isi: `<iframe class="pdf" src="${url}" title="${esc(r.nama)}"></iframe><p class="kecil" style="padding:10px 16px;margin:0">Jika berkas tidak tampil, <a href="${url}" target="_blank" rel="noopener">buka di tab baru</a>.</p>` });
    }
  } catch (e) { toast(e.message, 'bad'); } finally { t.tutup(); }
}

/* Kotak pilih dengan pencarian */
function kombo(id, nama, ph) {
  return `<div class="kombo" id="${id}"><input type="text" class="inp" placeholder="${esc(ph)}" autocomplete="off"><input type="hidden" name="${nama}"><div class="kombo-daftar" hidden></div></div>`;
}
function pasangKombo(wadah, { ambil, tambah, onPilih, kosong }) {
  const inp = $('input[type=text]', wadah), hid = $('input[type=hidden]', wadah), dft = $('.kombo-daftar', wadah);
  let saring = [];
  const render = () => {
    const q = inp.value.trim().toLowerCase();
    saring = ambil().filter(i => !q || i.teks.toLowerCase().includes(q) || (i.sub || '').toLowerCase().includes(q)).slice(0, 50);
    dft.innerHTML = saring.map((i, n) => `<div class="kombo-item" data-n="${n}"><b>${esc(i.teks)}</b>${i.sub ? `<small>${esc(i.sub)}</small>` : ''}</div>`).join('') +
      (tambah ? `<div class="kombo-tambah" data-tambah>${ikon('plus', 16)} ${esc(tambah.label)}${q ? ': ' + esc(inp.value.trim()) : ''}</div>` : '') +
      (!saring.length && !tambah ? `<div class="kombo-kosong">${esc(kosong || 'Tidak ada hasil')}</div>` : '');
    dft.hidden = false;
  };
  const pilih = i => { hid.value = i.id; inp.value = i.teks; dft.hidden = true; wadah.classList.add('terisi'); if (onPilih) onPilih(i); };
  inp.addEventListener('focus', render);
  inp.addEventListener('input', () => { hid.value = ''; wadah.classList.remove('terisi'); if (onPilih) onPilih(null); render(); });
  dft.addEventListener('mousedown', e => {
    e.preventDefault();
    const it = e.target.closest('.kombo-item');
    if (it) pilih(saring[+it.dataset.n]);
    else if (e.target.closest('[data-tambah]')) { dft.hidden = true; tambah.aksi(inp.value.trim(), pilih); }
  });
  inp.addEventListener('blur', () => setTimeout(() => { dft.hidden = true; }, 150));
  return { atur: pilih };
}

/* ===================== PENGENDALI KLIK DAN FORM ===================== */
const AKSI = {}, KIRIM = {};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-aksi]');
  if (!t) return;
  if (t.tagName === 'TR' && e.target.closest('a,button')) return;
  const fn = AKSI[t.dataset.aksi];
  if (fn) { if (t.tagName === 'A' && t.getAttribute('href') === '#') e.preventDefault(); fn(t, e); }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-kirim]');
  if (!f) return;
  e.preventDefault();
  if (KIRIM[f.dataset.kirim]) KIRIM[f.dataset.kirim](f);
});
document.addEventListener('input', e => { const t = e.target.closest('[data-saring]'); if (t && AKSI[t.dataset.saring]) AKSI[t.dataset.saring](t, e); });
document.addEventListener('change', e => { const t = e.target.closest('[data-ubah]'); if (t && AKSI[t.dataset.ubah]) AKSI[t.dataset.ubah](t, e); });
AKSI['muat-ulang'] = () => route(true);
const dataForm = f => Object.fromEntries(new FormData(f).entries());

/* ===================== AUTENTIKASI ===================== */
const PERAN_DAFTAR = [
  ['admin_utama', 'Admin Utama (Tim UGE)'], ['admin_prodi', 'Admin Prodi (Ketua Program Studi)'],
  ['admin_fakultas', 'Admin Fakultas (Dekan atau Wakil Dekan)'], ['admin_rektorat', 'Admin Rektorat, Unit, Lembaga, atau Biro']
];

async function tampilMasuk() {
  document.title = 'Masuk | Sistem Kerja Sama UMB';
  $('#app').innerHTML = `<div class="masuk">
    <section class="masuk-kiri"><div><div class="merek" style="border:0;padding:0"><div class="monogram">${KONFIG.SINGKAT}</div><div><b style="color:#fff">${esc(KONFIG.INSTANSI)}</b><span>${esc(KONFIG.UNIVERSITAS)}</span></div></div>
      <h1>Satu pangkalan data untuk seluruh kerja sama kampus.</h1>
      <p>Catat MoU, MoA, dan IA, pantau masa berlakunya, dan laporkan implementasinya dari satu tempat. Pengingat dikirim otomatis sebelum dokumen berakhir.</p></div>
      <p class="kecil" style="color:#8FA2C0">Akses hanya untuk admin yang terverifikasi oleh tim UGE.</p></section>
    <section class="masuk-kanan"><div class="form-masuk" id="kanan"></div></section></div>`;
  if (!S.unitPublik) { try { S.unitPublik = await api('unitPublik'); } catch (e) { S.unitPublik = []; } }
  tampilAuth();
}

function tampilAuth() {
  const v = S.auth.view, k = $('#kanan');
  if (!k) return;
  if (v === 'masuk') k.innerHTML = `<h2>Masuk ke sistem</h2><p class="kecil">Gunakan email dan kata sandi akun admin Anda.</p>
    <form data-kirim="masuk" class="tumpuk" novalidate>
      <div class="medan"><label for="m-email">Email</label><input class="inp" id="m-email" name="email" type="email" autocomplete="username" required></div>
      <div class="medan"><label for="m-sandi">Kata sandi</label><input class="inp" id="m-sandi" name="sandi" type="password" autocomplete="current-password" required></div>
      <div class="peringatan bad" id="a-galat" hidden></div>
      <button class="btn btn-utama btn-blok" type="submit">Masuk</button>
      <div class="tautan-baris"><a href="#" data-aksi="auth" data-v="lupa">Lupa kata sandi</a><a href="#" data-aksi="auth" data-v="daftar">Daftar sebagai admin</a></div></form>`;
  else if (v === 'daftar') k.innerHTML = `<h2>Pendaftaran admin</h2><p class="kecil">Setelah mendaftar, email Anda diverifikasi lewat kode, lalu Admin Utama UGE menyetujui akun Anda.</p>
    <form data-kirim="daftar" class="tumpuk" novalidate>
      <div class="medan"><label>Nama lengkap dengan gelar <span class="wajib">*</span></label><input class="inp" name="nama" required autocomplete="name"></div>
      <div class="baris2"><div class="medan"><label>Email <span class="wajib">*</span></label><input class="inp" name="email" type="email" required autocomplete="email"></div>
      <div class="medan"><label>Nomor WhatsApp <span class="wajib">*</span></label><input class="inp" name="wa" inputmode="tel" placeholder="08xxxxxxxxxx" required></div></div>
      <div class="baris2"><div class="medan"><label>NIDN / NUPTK <span class="wajib">*</span></label><input class="inp" name="nidn_nuptk" required><span class="hint">Staf nondosen dapat mengisi NIP atau NIK internal UMB.</span></div>
      <div class="medan"><label>Jabatan <span class="wajib">*</span></label><input class="inp" name="jabatan" placeholder="Contoh: Ketua Program Studi" required></div></div>
      <div class="medan"><label>Peran <span class="wajib">*</span></label><select class="inp" name="role" data-ubah="peran-daftar" required><option value="">Pilih peran</option>${PERAN_DAFTAR.map(p => `<option value="${p[0]}">${esc(p[1])}</option>`).join('')}</select></div>
      <div class="medan" id="w-unit" hidden><label>Unit kerja <span class="wajib">*</span></label><select class="inp" name="unit_id"></select></div>
      <div class="baris2"><div class="medan"><label>Kata sandi <span class="wajib">*</span></label><input class="inp" name="sandi" type="password" autocomplete="new-password" required><span class="hint">Minimal 8 karakter, memuat huruf dan angka.</span></div>
      <div class="medan"><label>Ulangi kata sandi <span class="wajib">*</span></label><input class="inp" name="sandi2" type="password" autocomplete="new-password" required></div></div>
      <input class="jebakan" name="situs_web" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="peringatan bad" id="a-galat" hidden></div>
      <button class="btn btn-utama btn-blok" type="submit">Daftar</button>
      <div class="tautan-baris"><a href="#" data-aksi="auth" data-v="masuk">Sudah punya akun? Masuk</a></div></form>`;
  else if (v === 'otp') k.innerHTML = `<h2>Verifikasi email</h2><p class="kecil">Kami mengirim kode 6 digit ke <b>${esc(S.auth.email)}</b>. Kode berlaku 15 menit.</p>
    <form data-kirim="otp" class="tumpuk" novalidate><div class="medan"><label>Kode verifikasi</label><input class="inp kode-otp" name="kode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></div>
      <div class="peringatan bad" id="a-galat" hidden></div><button class="btn btn-utama btn-blok" type="submit">Verifikasi</button>
      <div class="tautan-baris"><a href="#" data-aksi="kirim-ulang-otp">Kirim ulang kode</a><a href="#" data-aksi="auth" data-v="masuk">Kembali</a></div></form>`;
  else if (v === 'selesai') k.innerHTML = `<h2>${esc(S.auth.judul)}</h2><div class="peringatan ok" style="margin:16px 0">${esc(S.auth.pesan)}</div><button class="btn btn-utama btn-blok" data-aksi="auth" data-v="masuk">Ke halaman masuk</button>`;
  else if (v === 'lupa') k.innerHTML = `<h2>Atur ulang kata sandi</h2><p class="kecil">Masukkan email akun Anda. Kode pengaturan ulang dikirim bila email terdaftar.</p>
    <form data-kirim="lupa" class="tumpuk" novalidate><div class="medan"><label>Email</label><input class="inp" name="email" type="email" required></div>
      <div class="peringatan bad" id="a-galat" hidden></div><button class="btn btn-utama btn-blok" type="submit">Kirim kode</button>
      <div class="tautan-baris"><a href="#" data-aksi="auth" data-v="masuk">Kembali</a></div></form>`;
  else if (v === 'atur') k.innerHTML = `<h2>Kata sandi baru</h2><p class="kecil">Masukkan kode yang dikirim ke <b>${esc(S.auth.email)}</b>.</p>
    <form data-kirim="atur" class="tumpuk" novalidate><div class="medan"><label>Kode</label><input class="inp kode-otp" name="kode" inputmode="numeric" maxlength="6" required></div>
      <div class="medan"><label>Kata sandi baru</label><input class="inp" name="sandi" type="password" autocomplete="new-password" required></div>
      <div class="medan"><label>Ulangi kata sandi baru</label><input class="inp" name="sandi2" type="password" autocomplete="new-password" required></div>
      <div class="peringatan bad" id="a-galat" hidden></div><button class="btn btn-utama btn-blok" type="submit">Simpan kata sandi</button></form>`;
}
const galatAuth = t => { const g = $('#a-galat'); if (g) { g.hidden = !t; g.textContent = t || ''; } };
AKSI.auth = t => { S.auth.view = t.dataset.v; tampilAuth(); };
AKSI['peran-daftar'] = t => {
  const w = $('#w-unit'), sel = $('select[name=unit_id]'), r = t.value, jenis = { admin_prodi: 'prodi', admin_fakultas: 'fakultas', admin_rektorat: 'rektorat' }[r];
  if (!jenis) { w.hidden = true; sel.innerHTML = ''; return; }
  const u = (S.unitPublik || []).filter(x => x.jenis === jenis);
  sel.innerHTML = '<option value="">Pilih unit kerja</option>' + u.map(x => `<option value="${x.id}">${esc(x.nama)}</option>`).join('');
  w.hidden = false;
};
AKSI['kirim-ulang-otp'] = async () => {
  try { await api('kirimUlangOtp', { email: S.auth.email }); toast('Kode baru dikirim ke email Anda', 'ok'); } catch (e) { galatAuth(e.message); }
};

KIRIM.masuk = async f => {
  const b = $('button[type=submit]', f); galatAuth(''); muatTombol(b, true, 'Memeriksa');
  try {
    const r = await api('masuk', dataForm(f));
    simpanToken(r.token); S.user = r.pengguna; S.hak = r.hak; mulaiAplikasi();
  } catch (e) {
    muatTombol(b, false);
    if (e.kode === 'VERIFIKASI') { S.auth = { view: 'otp', email: dataForm(f).email.trim().toLowerCase() }; tampilAuth(); toast(e.message); }
    else galatAuth(e.message);
  }
};
KIRIM.daftar = async f => {
  const b = $('button[type=submit]', f); galatAuth(''); muatTombol(b, true, 'Mendaftarkan');
  try { const d = dataForm(f), r = await api('daftar', d); S.auth = { view: 'otp', email: r.email }; tampilAuth(); }
  catch (e) { muatTombol(b, false); galatAuth(e.message); }
};
KIRIM.otp = async f => {
  const b = $('button[type=submit]', f); galatAuth(''); muatTombol(b, true, 'Memeriksa');
  try {
    const r = await api('verifikasiEmail', { email: S.auth.email, kode: dataForm(f).kode });
    S.auth = r.status === 'aktif'
      ? { view: 'selesai', judul: 'Akun aktif', pesan: 'Email terverifikasi dan akun Superadmin Anda sudah aktif. Silakan masuk.' }
      : { view: 'selesai', judul: 'Email terverifikasi', pesan: 'Pendaftaran Anda menunggu persetujuan Admin Utama UGE. Kami akan mengirim email setelah akun disetujui.' };
    tampilAuth();
  } catch (e) { muatTombol(b, false); galatAuth(e.message); }
};
KIRIM.lupa = async f => {
  const b = $('button[type=submit]', f); galatAuth(''); muatTombol(b, true, 'Mengirim');
  try { const email = dataForm(f).email.trim().toLowerCase(); await api('lupaSandi', { email }); S.auth = { view: 'atur', email }; tampilAuth(); }
  catch (e) { muatTombol(b, false); galatAuth(e.message); }
};
KIRIM.atur = async f => {
  const b = $('button[type=submit]', f); galatAuth(''); muatTombol(b, true, 'Menyimpan');
  try {
    await api('aturUlangSandi', Object.assign(dataForm(f), { email: S.auth.email }));
    S.auth = { view: 'selesai', judul: 'Kata sandi diperbarui', pesan: 'Kata sandi baru tersimpan. Silakan masuk.' }; tampilAuth();
  } catch (e) { muatTombol(b, false); galatAuth(e.message); }
};

function keluar(sesiHabis) {
  simpanToken(''); S.user = null; S.hak = {}; S.opsi = null; S.mitra = null; S.hal = '';
  TUMPUK.slice().forEach(m => m.tutup());
  S.auth = { view: 'masuk', email: '' }; tampilMasuk();
  if (sesiHabis) toast('Sesi berakhir. Silakan masuk kembali.');
}
AKSI.keluar = () => keluar(false);

/* ===================== KERANGKA DAN ROUTER ===================== */
function mulaiAplikasi() {
  const u = S.user;
  const menu = [{ h: '#/beranda', t: 'Beranda', i: 'beranda' }, { g: 'Pengelolaan' },
    { h: '#/dokumen', t: 'Dokumen kerja sama', i: 'dokumen' }, { h: '#/implementasi', t: 'Implementasi', i: 'aktivitas' }, { h: '#/mitra', t: 'Mitra', i: 'mitra' }];
  if (ada('pengingat')) menu.push({ h: '#/pengingat', t: 'Pengingat', i: 'lonceng' });
  if (ada('pengguna')) menu.push({ g: 'Administrasi' }, { h: '#/pengguna', t: 'Pengguna', i: 'pengguna', nb: 1 }, { h: '#/unit', t: 'Unit dan fakultas', i: 'unit' });
  if (ada('log')) menu.push({ h: '#/log', t: 'Log aktivitas', i: 'log' });
  $('#app').innerHTML = `<div class="shell"><aside class="sisi" id="sisi">
      <div class="merek"><div class="monogram">${KONFIG.SINGKAT}</div><div><b>Kerja Sama</b><span>${esc(KONFIG.INSTANSI)}</span></div></div>
      <nav class="nav" aria-label="Menu utama">${menu.map(m => m.g ? `<div class="nav-grup">${m.g}</div>` :
        `<a href="${m.h}" data-nav="${m.h}">${ikon(m.i)}<span>${m.t}</span>${m.nb ? '<span class="nb" id="nb-pengguna" hidden></span>' : ''}</a>`).join('')}</nav>
      <div class="sisi-kaki">${esc(KONFIG.UNIVERSITAS)}</div></aside><div class="tabir" data-aksi="tutup-nav"></div>
    <div class="utama"><header class="bar"><button class="ikon-btn hamburger" data-aksi="buka-nav" aria-label="Buka menu">${ikon('menu', 22)}</button>
      <div class="judul" id="judul-hal">Beranda</div>
      <a class="pengguna-bar" href="#/profil" title="Profil saya"><div class="avatar">${esc(inisial(u.nama))}</div><div class="t"><b>${esc(u.nama.split(',')[0])}</b><span>${esc(LABEL_PERAN[u.role] || u.role)}</span></div></a>
      <button class="ikon-btn" data-aksi="keluar" aria-label="Keluar" title="Keluar">${ikon('keluar')}</button></header>
      <main class="isi" id="isi"></main></div></div>`;
  S.hal = '';
  if (!location.hash || location.hash === '#') location.hash = '#/beranda'; else route(true);
}
AKSI['buka-nav'] = () => document.body.classList.add('nav-buka');
AKSI['tutup-nav'] = () => document.body.classList.remove('nav-buka');

const JUDUL_RUTE = { beranda: 'Beranda', dokumen: 'Dokumen kerja sama', implementasi: 'Implementasi', mitra: 'Mitra', pengingat: 'Pengingat', pengguna: 'Pengguna', unit: 'Unit dan fakultas', log: 'Log aktivitas', profil: 'Profil saya' };

async function route(paksa) {
  if (!S.user) return;
  document.body.classList.remove('nav-buka');
  const [path, qs] = (location.hash || '#/beranda').split('?'), seg = path.replace(/^#\//, '').split('/');
  const nama = seg[0] || 'beranda', sub = seg[1], id = seg.slice(2).join('/'), q = new URLSearchParams(qs || '');
  const el = $('#isi'); if (!el) return;
  $$('[data-nav]').forEach(a => a.classList.toggle('aktif', a.dataset.nav === '#/' + nama));
  $('#judul-hal').textContent = JUDUL_RUTE[nama] || 'Beranda';
  document.title = (JUDUL_RUTE[nama] || 'Beranda') + ' | Sistem Kerja Sama UMB';

  // buka atau tutup laci detail tanpa memuat ulang daftar
  if (!paksa && nama === 'dokumen' && S.hal === 'dokumen' && (!sub || sub === 'lihat')) {
    if (sub === 'lihat' && id) bukaDetailDok(id); else if (S.laci) S.laci.tutup();
    return;
  }
  if (S.laci) { S.laci.tutup(); S.laci = null; }
  S.hal = ''; window.scrollTo(0, 0);
  try {
    if (nama === 'beranda') await pgBeranda(el);
    else if (nama === 'dokumen' && sub === 'baru') await pgFormDok(el, '', q.get('induk'));
    else if (nama === 'dokumen' && sub === 'ubah') await pgFormDok(el, id);
    else if (nama === 'dokumen') await pgDokumen(el, sub === 'lihat' ? id : '');
    else if (nama === 'implementasi' && sub === 'baru') await pgFormImpl(el, '', q.get('dok'));
    else if (nama === 'implementasi' && sub === 'ubah') await pgFormImpl(el, id);
    else if (nama === 'implementasi') await pgImplementasi(el);
    else if (nama === 'mitra') await pgMitra(el);
    else if (nama === 'pengingat' && ada('pengingat')) await pgPengingat(el);
    else if (nama === 'pengguna' && ada('pengguna')) await pgPengguna(el);
    else if (nama === 'unit' && ada('pengguna')) await pgUnit(el);
    else if (nama === 'log' && ada('log')) await pgLog(el);
    else if (nama === 'profil') await pgProfil(el);
    else el.innerHTML = `<div class="panel"><div class="kosong"><h3>Halaman tidak ditemukan</h3><p>Alamat yang Anda buka tidak tersedia atau di luar wewenang peran Anda.</p><a class="btn btn-utama" href="#/beranda">Kembali ke beranda</a></div></div>`;
  } catch (e) { galatHal(el, e); }
}
window.addEventListener('hashchange', () => route(false));

async function mulai() {
  if (!S.token) return tampilMasuk();
  $('#app').innerHTML = memuat();
  try { const r = await api('profil'); S.user = r.pengguna; S.hak = r.hak; mulaiAplikasi(); }
  catch (e) { if (!S.user) { simpanToken(''); tampilMasuk(); } }
}
