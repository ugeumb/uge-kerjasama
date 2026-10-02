/* ===================== DATA BERSAMA ===================== */
async function pastikanOpsi() { if (!S.opsi) S.opsi = await api('opsi'); return S.opsi; }
async function muatMitra(paksa) { if (!S.mitra || paksa) S.mitra = await api('daftarMitra'); return S.mitra; }
const mitraItem = m => ({ id: m.id, teks: m.nama, sub: m.cakupan + (m.cakupan === 'Luar Negeri' && m.negara ? ', ' + m.negara : '') });

function unitBoleh() {
  const u = S.user, un = S.opsi.unit;
  if (u.role === 'superadmin' || u.role === 'admin_utama') return un;
  if (u.role === 'admin_prodi') return un.filter(x => x.id === u.unit_id);
  if (u.role === 'admin_fakultas') return un.filter(x => x.id === u.unit_id || x.fakultas_id === u.unit_id);
  return un.filter(x => x.jenis === 'rektorat');
}
function opsiUnitHtml(daftar, pilih) {
  const sel = id => id === pilih ? ' selected' : '';
  const rk = daftar.filter(x => x.jenis === 'rektorat'), fk = daftar.filter(x => x.jenis === 'fakultas'), pr = daftar.filter(x => x.jenis === 'prodi');
  let h = '<option value="">Pilih unit</option>';
  if (rk.length) h += `<optgroup label="Rektorat, unit, lembaga, dan biro">${rk.map(x => `<option value="${x.id}"${sel(x.id)}>${esc(x.nama)}</option>`).join('')}</optgroup>`;
  if (fk.length) h += `<optgroup label="Fakultas">${fk.map(x => `<option value="${x.id}"${sel(x.id)}>${esc(x.nama)}</option>`).join('')}</optgroup>`;
  const grup = {}; pr.forEach(x => { (grup[x.fakultas_id] = grup[x.fakultas_id] || []).push(x); });
  Object.keys(grup).forEach(fid => {
    const f = S.opsi.unit.find(x => x.id === fid);
    h += `<optgroup label="Program studi, ${esc(f ? f.nama : 'tanpa fakultas')}">${grup[fid].map(x => `<option value="${x.id}"${sel(x.id)}>${esc(x.nama)}</option>`).join('')}</optgroup>`;
  });
  return h;
}
function ketLingkup() {
  const l = S.opsi && S.opsi.lingkup;
  return l === 'semua' ? 'Menampilkan seluruh data kerja sama UMB.' : l === 'fakultas' ? `Menampilkan data fakultas ${S.user.unit_nama} beserta program studinya.` : `Menampilkan data milik ${S.user.unit_nama}.`;
}

/* ===================== GRAFIK ===================== */
function donat(items, label) {
  const total = items.reduce((a, b) => a + b.nilai, 0), r = 52, k = 2 * Math.PI * r;
  let off = 0;
  const seg = total ? items.filter(i => i.nilai > 0).map(i => { const p = i.nilai / total * k, s = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${i.warna}" stroke-width="18" stroke-dasharray="${p} ${k - p}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"/>`; off += p; return s; }).join('') : '';
  return `<svg viewBox="0 0 140 140" class="donat" role="img" aria-label="${esc(label)}"><circle cx="70" cy="70" r="${r}" fill="none" stroke="#EBEEF2" stroke-width="18"/>${seg}<text x="70" y="72" text-anchor="middle" class="donat-angka">${total}</text><text x="70" y="88" text-anchor="middle" class="donat-ket">dokumen</text></svg>`;
}
function batang(items) {
  const maks = Math.max(1, ...items.map(i => i.nilai));
  return items.map(i => `<div class="bt"><span>${esc(i.label)}</span><div class="bt-trek"><div class="bt-isi" style="width:${i.nilai / maks * 100}%"></div></div><span class="bt-nilai">${i.nilai}</span></div>`).join('');
}
const WARNA_CAKUPAN = { 'Luar Negeri': 'var(--navy-700)', 'Nasional': 'var(--gold-500)', 'Daerah': 'var(--teal)', 'Belum diisi': '#C8CFDA' };
function barCakupan(obj, judul) {
  const tot = Object.values(obj).reduce((a, b) => a + b, 0);
  if (!tot) return `<div class="kecil">${esc(judul)}: belum ada data.</div>`;
  const ks = Object.keys(WARNA_CAKUPAN).filter(k => obj[k]);
  return `<div class="bag-judul" style="margin:0 0 4px;border:0;padding:0;font-size:15px">${esc(judul)} <span class="kecil" style="font-family:var(--f-body)">(${tot})</span></div>
    <div class="tumpuk-bar">${ks.map(k => `<i style="width:${obj[k] / tot * 100}%;background:${WARNA_CAKUPAN[k]}"></i>`).join('')}</div>
    <ul class="legenda" style="flex-direction:row;flex-wrap:wrap;gap:6px 18px;font-size:13.5px">${ks.map(k => `<li><i style="background:${WARNA_CAKUPAN[k]}"></i>${esc(k)} <b style="margin-left:6px">${obj[k]}</b></li>`).join('')}</ul>`;
}
function kolomGrafik(obj) {
  const th = Object.keys(obj).sort().slice(-8);
  if (!th.length) return '<div class="kecil">Belum ada data.</div>';
  const maks = Math.max(1, ...th.map(t => obj[t]));
  return `<div class="kolom">${th.map(t => `<div><b>${obj[t]}</b><i style="height:${Math.max(3, obj[t] / maks * 100)}%"></i><span>${t}</span></div>`).join('')}</div>`;
}

/* ===================== BERANDA ===================== */
async function pgBeranda(el) {
  el.innerHTML = memuat();
  await pastikanOpsi();
  const d = await api('dashboard', { tahun: S.tahunDash }); S.dash = d; S.tahunDash = d.tahun;
  const r = d.ringkas, t = d.tugas || {};
  const nb = $('#nb-pengguna'); if (nb) { nb.hidden = !t.pengguna_menunggu; nb.textContent = t.pengguna_menunggu || ''; }
  const tugas = [];
  if (t.pengguna_menunggu) tugas.push(`<a href="#/pengguna"><b>${t.pengguna_menunggu}</b><span>pendaftaran admin menunggu persetujuan</span></a>`);
  if (t.dok_menunggu) tugas.push(`<a href="#/dokumen" data-aksi="saring-validasi"><b>${t.dok_menunggu}</b><span>dokumen menunggu validasi</span></a>`);
  if (t.impl_menunggu) tugas.push(`<a href="#/implementasi"><b>${t.impl_menunggu}</b><span>laporan implementasi menunggu verifikasi</span></a>`);
  if (t.dok_perbaikan) tugas.push(`<a href="#/dokumen"><b>${t.dok_perbaikan}</b><span>dokumen Anda perlu diperbaiki</span></a>`);
  if (t.impl_perbaikan) tugas.push(`<a href="#/implementasi"><b>${t.impl_perbaikan}</b><span>laporan implementasi Anda perlu diperbaiki</span></a>`);
  const tahunSel = `<select class="inp" style="width:auto;height:38px" data-ubah="dash-tahun" aria-label="Tahun implementasi">${d.tahun_tersedia.map(y => `<option ${y === d.tahun ? 'selected' : ''}>${y}</option>`).join('')}</select>`;
  el.innerHTML = judulHal(`Selamat datang, ${S.user.nama.split(',')[0].split(' ').slice(0, 3).join(' ')}`, ketLingkup(), ada('unggah') ? `<a class="btn btn-ghost" href="#/implementasi/baru">${ikon('aktivitas')} Laporkan implementasi</a><a class="btn btn-utama" href="#/dokumen/baru">${ikon('plus')} Unggah dokumen</a>` : '') +
    (tugas.length ? `<div class="tugas mb">${tugas.join('')}</div>` : '') +
    `<div class="kpi mb">
      <div><div class="l">Total dokumen</div><div class="n">${angka(r.total)}</div><div class="s">MoU, MoA, IA, dan sejenisnya</div></div>
      <div style="--c:var(--ok)"><div class="l">Aktif</div><div class="n">${angka(r.aktif)}</div><div class="s">masa berlaku masih panjang</div></div>
      <div style="--c:#D9A441"><div class="l">Segera berakhir</div><div class="n">${angka(r.segera)}</div><div class="s">dalam ${S.opsi.ambang_segera} hari</div></div>
      <div style="--c:var(--bad)"><div class="l">Sudah berakhir</div><div class="n">${angka(r.kedaluwarsa)}</div><div class="s">perlu diperpanjang</div></div>
      <div style="--c:var(--gold-500)"><div class="l">Implementasi ${d.tahun}</div><div class="n">${angka(d.implementasi.total)}</div><div class="s">${d.implementasi.terverifikasi} terverifikasi</div></div></div>
    ${kermaPanel(d.kerma)}
    <div class="grid g3 mb">
      <section class="panel"><div class="panel-kepala"><h3>Status masa berlaku</h3></div><div class="panel-isi"><div class="donat-wrap">
        ${donat([{ nilai: r.aktif, warna: '#1D7A55' }, { nilai: r.segera, warna: '#D9A441' }, { nilai: r.kedaluwarsa, warna: '#B0352D' }], 'Status masa berlaku dokumen')}
        <ul class="legenda"><li><i style="background:#1D7A55"></i>Aktif<b>${r.aktif}</b></li><li><i style="background:#D9A441"></i>Segera berakhir<b>${r.segera}</b></li><li><i style="background:#B0352D"></i>Berakhir<b>${r.kedaluwarsa}</b></li></ul></div></div></section>
      <section class="panel"><div class="panel-kepala"><h3>Jenis dokumen</h3></div><div class="panel-isi">${Object.keys(d.per_jenis).length ? batang(Object.keys(d.per_jenis).map(k => ({ label: k, nilai: d.per_jenis[k] })).sort((a, b) => b.nilai - a.nilai)) : '<div class="kecil">Belum ada dokumen.</div>'}</div></section>
      <section class="panel"><div class="panel-kepala"><h3>Cakupan mitra</h3></div><div class="panel-isi tumpuk">${barCakupan(d.per_cakupan, 'Dokumen')}${barCakupan(d.implementasi.per_cakupan, 'Implementasi ' + d.tahun)}</div></section>
    </div>
    <div class="grid g2 mb">
      <section class="panel"><div class="panel-kepala"><h3>Papan peringkat implementasi</h3>${tahunSel}</div>
        <div class="alat" style="border-bottom:0;padding-bottom:6px"><div class="pilih-chip" id="rank-jenis">${[['prodi', 'Program studi'], ['fakultas', 'Fakultas'], ['rektorat', 'Unit lain']].map(j => `<label><input type="radio" name="rj" value="${j[0]}" data-ubah="rank-jenis" ${S.rank.jenis === j[0] ? 'checked' : ''}><span>${j[1]}</span></label>`).join('')}</div>
        <label class="centang" style="margin-left:auto"><input type="checkbox" data-ubah="rank-valid" ${S.rank.valid ? 'checked' : ''}> Hanya yang sudah diverifikasi</label></div>
        <div id="rank-isi"></div></section>
      <section class="panel"><div class="panel-kepala"><h3>Perlu perhatian</h3><a class="btn btn-teks btn-sm" href="#/dokumen">Semua dokumen</a></div>
        ${d.perhatian.length ? `<ul class="daftar-hal">${d.perhatian.map(p => `<li><a href="#/dokumen/lihat/${p.id}"><div><b>${esc(p.mitra_nama)}</b><div class="sub">${esc(p.jenis)} ${esc(p.nomor)}, ${esc(p.unit_nama)}</div></div>${lencana(teksSisa(p.sisa_hari), p.sisa_hari < 0 ? 'bad' : p.sisa_hari <= 30 ? 'warn' : 'abu')}</a></li>`).join('')}</ul>` : '<div class="kosong">Tidak ada dokumen yang akan berakhir dalam waktu dekat.</div>'}</section>
    </div>
    <div class="grid g2b">
      <section class="panel"><div class="panel-kepala"><h3>Dokumen ditandatangani per tahun</h3></div><div class="panel-isi">${kolomGrafik(d.per_tahun_dok)}</div></section>
      <section class="panel"><div class="panel-kepala"><h3>Tindak lanjut implementasi</h3></div><div class="panel-isi">
        <p style="font-size:34px;font-family:var(--f-display);font-weight:600;color:${d.tanpa_tindak_lanjut ? 'var(--bad)' : 'var(--ok)'};margin:0">${d.tanpa_tindak_lanjut}</p>
        <p style="margin:4px 0 14px">dokumen MoU, MoA, atau IA yang masih berlaku belum memiliki kegiatan dalam 6 bulan terakhir. Data ini diperlukan untuk pelaporan KERMA DIKTI.</p>
        <a class="btn btn-ghost btn-sm" href="#/implementasi">Buka implementasi</a></div></section></div>`;
  isiRank();
}
function kermaPanel(k) {
  if (!k) return '';
  const pct = k.total ? Math.round(k.sudah / k.total * 100) : 0;
  return `<div class="grid g2b mb"><section class="panel"><div class="panel-kepala"><h3>Pelaporan ke KERMA Dikti</h3></div><div class="panel-isi">
    <p style="font-family:var(--f-display);font-size:34px;font-weight:600;margin:0;color:var(--navy-900)">${k.sudah}<span style="font-size:20px;color:var(--muted)"> dari ${k.total}</span></p>
    <p style="margin:2px 0 12px">dokumen sudah diunggah ke Website KERMA Dikti (${pct}%).</p><div class="tumpuk-bar" style="height:12px"><i style="width:${pct}%;background:var(--ok)"></i></div>
    <div style="display:flex;gap:18px;font-size:14px;margin:8px 0 16px"><span>${lencana('Sudah', 'ok')} ${k.sudah}</span><span>${lencana('Belum', 'warn')} ${k.belum}</span></div>
    <a class="btn btn-ghost btn-sm" href="#/dokumen" data-aksi="kerma-filter-belum">Lihat yang belum diunggah</a><p class="hint" style="margin-top:10px">Berita Acara tidak dihitung.</p></div></section>
    <section class="panel"><div class="panel-kepala"><h3>Belum diunggah ke KERMA Dikti</h3></div>${k.belum_daftar.length ? `<ul class="daftar-hal">${k.belum_daftar.map(x => `<li><div style="display:flex;gap:12px;justify-content:space-between;align-items:center;padding:12px 20px;border-bottom:1px solid var(--line-2)"><a href="#/dokumen/lihat/${x.id}" style="text-decoration:none;color:inherit"><b>${esc(x.mitra_nama)}</b><div class="sub">${esc(x.jenis)} ${esc(x.nomor)}, ditandatangani ${tglPendek(x.tgl_ttd)}</div></a><button class="btn btn-ghost btn-sm" data-aksi="kerma-buka" data-id="${x.id}">Tandai</button></div></li>`).join('')}</ul>${k.belum > k.belum_daftar.length ? `<div class="tabel-kaki">dan ${k.belum - k.belum_daftar.length} dokumen lain</div>` : ''}` : '<div class="kosong">Semua dokumen sudah diunggah ke KERMA Dikti.</div>'}</section></div>`;
}
function isiRank() {
  const w = $('#rank-isi'); if (!w || !S.dash) return;
  const daftar = (S.dash.peringkat[S.rank.valid ? 'valid' : 'semua'] || []).filter(x => x.jenis === S.rank.jenis).slice(0, 10);
  if (!daftar.length) { w.innerHTML = `<div class="kosong">Belum ada implementasi ${S.rank.valid ? 'terverifikasi ' : ''}untuk kategori ini pada ${S.dash.tahun}.</div>`; return; }
  const maks = Math.max(1, ...daftar.map(x => x.kegiatan));
  w.innerHTML = `<ol class="rank">${daftar.map((x, i) => `<li class="rank-baris r${i + 1}"><span class="rank-no">${i + 1}</span><div><div class="rank-nama">${esc(x.unit_nama)}</div><div class="rank-bar"><i style="width:${x.kegiatan / maks * 100}%"></i></div>
    <div class="sub">${x.mitra_unik} mitra berbeda; ${x.ln} luar negeri, ${x.nas} nasional, ${x.dae} daerah</div></div><div class="rank-nilai">${x.kegiatan}<small>kegiatan</small></div></li>`).join('')}</ol>`;
}
AKSI['dash-tahun'] = t => { S.tahunDash = Number(t.value); pgBeranda($('#isi')); };
AKSI['rank-jenis'] = t => { S.rank.jenis = t.value; isiRank(); };
AKSI['rank-valid'] = t => { S.rank.valid = t.checked; isiRank(); };
AKSI['saring-validasi'] = () => { F.validasi = 'menunggu'; };

/* ===================== DAFTAR DOKUMEN ===================== */
const F = { q: '', masa: 'semua', jenis: '', cakupan: '', unit: '', validasi: '', kerma: '', urut: 'prioritas' };
const URUT_MASA = { segera: 0, aktif: 1, tanpa_batas: 2, kedaluwarsa: 3 };

async function pgDokumen(el, lihatId) {
  S.hal = 'dokumen'; el.innerHTML = memuat();
  await pastikanOpsi();
  S.dok = await api('daftarDokumen');
  const unitAda = Array.from(new Set(S.dok.map(d => d.unit_nama))).sort();
  el.innerHTML = judulHal('Dokumen kerja sama', ketLingkup(), ada('unggah') ? `<a class="btn btn-utama" href="#/dokumen/baru">${ikon('plus')} Unggah dokumen</a>` : '') +
    `<div class="panel"><div class="alat"><div class="cari">${ikon('cari', 17)}<input class="inp" type="search" placeholder="Cari mitra, nomor, atau judul" value="${esc(F.q)}" data-saring="dok-cari" aria-label="Cari dokumen"></div>
      <select class="inp" data-ubah="dok-f" data-k="jenis" aria-label="Jenis"><option value="">Semua jenis</option>${S.opsi.daftar.JENIS_DOK.map(j => `<option ${F.jenis === j ? 'selected' : ''}>${j}</option>`).join('')}</select>
      <select class="inp" data-ubah="dok-f" data-k="cakupan" aria-label="Cakupan"><option value="">Semua cakupan</option>${S.opsi.daftar.CAKUPAN.map(j => `<option ${F.cakupan === j ? 'selected' : ''}>${j}</option>`).join('')}</select>
      ${unitAda.length > 1 ? `<select class="inp" data-ubah="dok-f" data-k="unit" aria-label="Unit"><option value="">Semua unit</option>${unitAda.map(j => `<option ${F.unit === j ? 'selected' : ''}>${esc(j)}</option>`).join('')}</select>` : ''}
      <select class="inp" data-ubah="dok-f" data-k="validasi" aria-label="Validasi"><option value="">Semua status validasi</option><option value="menunggu" ${F.validasi === 'menunggu' ? 'selected' : ''}>Menunggu validasi</option><option value="valid" ${F.validasi === 'valid' ? 'selected' : ''}>Tervalidasi</option><option value="perbaikan" ${F.validasi === 'perbaikan' ? 'selected' : ''}>Perlu perbaikan</option></select>
      ${ada('kerma') ? `<select class="inp" data-ubah="dok-f" data-k="kerma" aria-label="KERMA Dikti"><option value="">Semua status KERMA</option><option value="sudah" ${F.kerma === 'sudah' ? 'selected' : ''}>Sudah diunggah ke KERMA</option><option value="belum" ${F.kerma === 'belum' ? 'selected' : ''}>Belum diunggah ke KERMA</option></select>` : ''}
      <select class="inp" data-ubah="dok-f" data-k="urut" aria-label="Urutan"><option value="prioritas" ${F.urut === 'prioritas' ? 'selected' : ''}>Urut masa berlaku</option><option value="terbaru" ${F.urut === 'terbaru' ? 'selected' : ''}>Terbaru ditandatangani</option><option value="mitra" ${F.urut === 'mitra' ? 'selected' : ''}>Nama mitra</option></select></div>
      <div class="segmen" id="dok-segmen"></div><div id="dok-daftar"></div></div>`;
  renderDok();
  if (lihatId) bukaDetailDok(lihatId);
}
AKSI['dok-cari'] = t => { F.q = t.value; renderDok(); };
AKSI['dok-f'] = t => { F[t.dataset.k] = t.value; renderDok(); };
AKSI['dok-masa'] = t => { F.masa = t.dataset.m; renderDok(); };
AKSI['dok-buka'] = t => { location.hash = '#/dokumen/lihat/' + t.dataset.id; };

function terapkanDok(abaikanMasa) {
  const q = F.q.trim().toLowerCase();
  return S.dok.filter(d =>
    (!q || [d.mitra_nama, d.nomor, d.nomor_mitra, d.judul, d.unit_nama].join(' ').toLowerCase().includes(q)) &&
    (!F.jenis || d.jenis === F.jenis) && (!F.cakupan || d.cakupan === F.cakupan) && (!F.unit || d.unit_nama === F.unit) &&
    (!F.validasi || d.status_validasi === F.validasi) && (!F.kerma || (F.kerma === 'sudah' ? d.kerma_status === '1' : (d.kerma_status !== '1' && d.jenis !== 'Berita Acara'))) && (abaikanMasa || F.masa === 'semua' || d.status_masa === F.masa));
}
function renderDok() {
  const w = $('#dok-daftar'); if (!w) return;
  const dasar = terapkanDok(true), hit = k => dasar.filter(d => d.status_masa === k).length;
  $('#dok-segmen').innerHTML = [['semua', 'Semua', dasar.length], ['aktif', 'Aktif', hit('aktif') + hit('tanpa_batas')], ['segera', 'Segera berakhir', hit('segera')], ['kedaluwarsa', 'Berakhir', hit('kedaluwarsa')]]
    .map(s => `<button class="${F.masa === s[0] || (F.masa === 'tanpa_batas' && s[0] === 'aktif') ? 'aktif' : ''}" data-aksi="dok-masa" data-m="${s[0]}">${s[1]}<span>${s[2]}</span></button>`).join('');
  let l = terapkanDok(false);
  if (F.masa === 'aktif') l = l.concat(dasar.filter(d => d.status_masa === 'tanpa_batas')).filter((d, i, a) => a.indexOf(d) === i);
  l.sort((a, b) => {
    if (F.urut === 'terbaru') return b.tgl_ttd.localeCompare(a.tgl_ttd);
    if (F.urut === 'mitra') return a.mitra_nama.localeCompare(b.mitra_nama);
    const s = URUT_MASA[a.status_masa] - URUT_MASA[b.status_masa];
    if (s) return s;
    return a.status_masa === 'kedaluwarsa' ? b.tgl_berakhir.localeCompare(a.tgl_berakhir) : (a.sisa_hari == null ? 1e9 : a.sisa_hari) - (b.sisa_hari == null ? 1e9 : b.sisa_hari);
  });
  if (!l.length) { w.innerHTML = `<div class="kosong"><h3>${S.dok.length ? 'Tidak ada dokumen yang cocok' : 'Belum ada dokumen'}</h3><p>${S.dok.length ? 'Ubah kata kunci atau filter untuk melihat dokumen lain.' : 'Dokumen yang diunggah akan muncul di sini.'}</p>${ada('unggah') && !S.dok.length ? `<a class="btn btn-utama" href="#/dokumen/baru">Unggah dokumen pertama</a>` : ''}</div>`; return; }
  const masaTeks = d => d.status_masa === 'tanpa_batas' ? 'Tanpa batas waktu' : `${tglPendek(d.tgl_ttd)} s.d. ${tglPendek(d.tgl_berakhir)}`;
  w.innerHTML = `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Mitra</th><th>Dokumen</th><th>Unit</th><th>Masa berlaku</th><th>Status</th>${ada('kerma') ? '<th>KERMA Dikti</th>' : ''}</tr></thead><tbody>${l.map(d => `<tr data-aksi="dok-buka" data-id="${d.id}">
    <td><a class="tautan" href="#/dokumen/lihat/${d.id}">${esc(d.mitra_nama)}</a><div class="sub">${esc(d.cakupan)}${d.cakupan === 'Luar Negeri' && d.negara ? ', ' + esc(d.negara) : ''}</div></td>
    <td>${lJenis(d)} <span>${esc(d.nomor || d.nomor_mitra)}</span><div class="sub">${esc(d.judul)}</div></td><td>${esc(d.unit_nama)}<div class="sub">Ditandatangani ${esc(d.level_ttd)}</div></td>
    <td>${masaTeks(d)}${d.sisa_hari != null ? `<div class="sub">${teksSisa(d.sisa_hari)}</div>` : ''}</td><td>${lMasa(d.status_masa)}<div style="margin-top:4px">${lVal(d.status_validasi)}</div></td>${ada('kerma') ? `<td>${lKerma(d)}</td>` : ''}</tr>`).join('')}</tbody></table></div>
    <div class="kartu-daftar">${l.map(d => `<a class="kartu" href="#/dokumen/lihat/${d.id}" style="text-decoration:none;color:inherit"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(d.mitra_nama)}</b>${lMasa(d.status_masa)}</div>
      <div>${lJenis(d)} ${esc(d.nomor || d.nomor_mitra)}</div><div class="sub">${esc(d.judul)}</div><div class="sub">${esc(d.unit_nama)}, ${masaTeks(d)}</div>${ada('kerma') && d.jenis !== 'Berita Acara' ? `<div>${d.kerma_status === '1' ? lencana('KERMA: sudah diunggah', 'ok') : lencana('KERMA: belum diunggah', 'warn')}</div>` : ''}</a>`).join('')}</div>
    <div class="tabel-kaki">Menampilkan ${l.length} dari ${S.dok.length} dokumen</div>`;
}

function lKerma(d) {
  if (d.jenis === 'Berita Acara') return '<span class="kecil">Tidak berlaku</span>';
  return d.kerma_status === '1'
    ? `<button type="button" class="kerma-tombol sudah" data-aksi="kerma-buka" data-id="${d.id}" title="Ubah status">${ikon('cek', 14)} Sudah diunggah</button>${d.kerma_tgl ? `<div class="sub">${tglPendek(d.kerma_tgl)}</div>` : ''}`
    : `<button type="button" class="kerma-tombol belum" data-aksi="kerma-buka" data-id="${d.id}" title="Tandai sudah diunggah">Belum diunggah</button>`;
}
function cariDokKerma(id) {
  return (S.dok || []).find(x => x.id === id) || (S.detail && S.detail.dokumen.id === id ? S.detail.dokumen : null) || (S.dash && S.dash.kerma ? S.dash.kerma.belum_daftar.find(x => x.id === id) : null);
}
async function segarkanKerma(id) {
  if (S.hal === 'dokumen') { S.dok = await api('daftarDokumen'); renderDok(); }
  else if ((location.hash || '#/beranda').indexOf('#/beranda') === 0) pgBeranda($('#isi'));
  if (S.laci && S.detail && S.detail.dokumen.id === id) { const r = await api('detailDokumen', { id }); S.detail = r; S.laci.isi.innerHTML = isiDetailDok(r); }
}
AKSI['kerma-filter-belum'] = () => { F.kerma = 'belum'; };
AKSI['kerma-buka'] = t => {
  const d = cariDokKerma(t.dataset.id); if (!d) return;
  const sudah = d.kerma_status === '1', id = d.id;
  const tombol = [{ label: 'Tutup', aksi: () => m.tutup() }];
  if (sudah) tombol.push({ label: 'Batalkan tanda', aksi: async () => { await api('tandaiKerma', { id, status: '' }); m.tutup(); toast('Tanda KERMA Dikti dibatalkan', 'ok'); await segarkanKerma(id); } });
  tombol.push({ label: sudah ? 'Simpan perubahan' : 'Tandai sudah diunggah', kelas: 'btn-utama', aksi: async () => {
    await api('tandaiKerma', { id, status: '1', tgl: $('#k-tgl').value, catatan: $('#k-cat').value }); m.tutup(); toast('Tersimpan: dokumen ditandai sudah diunggah ke KERMA Dikti', 'ok'); await segarkanKerma(id);
  } });
  const m = modal({ judul: 'Status KERMA Dikti', lebar: 500, tombol,
    isi: `<p><b>${esc(d.mitra_nama)}</b><br><span class="kecil">${esc(d.jenis)} ${esc(d.nomor || d.nomor_mitra || '')}</span></p><div class="tumpuk">
      <div class="medan"><label>Tanggal diunggah ke Website KERMA Dikti</label><input class="inp" type="date" id="k-tgl" max="${hariIniStr()}" value="${esc(sudah && d.kerma_tgl ? d.kerma_tgl : hariIniStr())}"></div>
      <div class="medan"><label>Catatan (opsional)</label><input class="inp" id="k-cat" value="${esc(d.kerma_catatan || '')}" placeholder="Contoh: nomor registrasi di KERMA Dikti"></div></div>` });
};

/* ===================== DETAIL DOKUMEN ===================== */
async function bukaDetailDok(id) {
  if (S.laci) { const lama = S.laci; S.laci = null; lama.tutup(); }
  const m = modal({ judul: 'Detail dokumen', laci: true, isi: memuat(), onTutup: () => { if (S.laci === m) { S.laci = null; if (location.hash.indexOf('#/dokumen/lihat') === 0) history.replaceState(null, '', '#/dokumen'); } } });
  S.laci = m;
  try { const r = await api('detailDokumen', { id }); S.detail = r; m.isi.innerHTML = isiDetailDok(r); }
  catch (e) { m.isi.innerHTML = `<div class="peringatan bad">${esc(e.message)}</div>`; }
}
const baris = (k, v) => `<dt>${k}</dt><dd>${v || '<span class="kecil">Belum diisi</span>'}</dd>`;
function isiDetailDok(r) {
  const d = r.dokumen, m = r.mitra || {}, tombol = [];
  if (d.bisa_ubah) tombol.push(`<button class="btn btn-ghost btn-sm" data-aksi="dok-ubah" data-id="${d.id}">${ikon('ubah', 15)} Ubah</button>`);
  if (ada('validasi') && d.status_validasi !== 'valid') tombol.push(`<button class="btn btn-utama btn-sm" data-aksi="dok-validasi" data-k="valid">${ikon('cek', 15)} Validasi</button>`);
  if (ada('validasi')) tombol.push(`<button class="btn btn-ghost btn-sm" data-aksi="dok-validasi" data-k="perbaikan">Minta perbaikan</button>`);
  if (ada('pengingat') && d.status_masa !== 'tanpa_batas') tombol.push(`<button class="btn btn-ghost btn-sm" data-aksi="dok-ingatkan">${ikon('surat', 15)} Kirim pengingat</button>`);
  if (ada('unggah') && ['MoU', 'MoA', 'IA'].includes(d.jenis)) tombol.push(`<a class="btn btn-ghost btn-sm" href="#/implementasi/baru?dok=${d.id}">${ikon('aktivitas', 15)} Laporkan implementasi</a>`);
  if (ada('unggah')) tombol.push(`<a class="btn btn-ghost btn-sm" href="#/dokumen/baru?induk=${d.id}">${ikon('plus', 15)} Dokumen turunan</a>`);
  if (ada('hapus')) tombol.push(`<button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-aksi="dok-hapus">${ikon('sampah', 15)} Hapus</button>`);
  const catatan = d.catatan_validasi ? `<div class="peringatan bad" style="margin-bottom:16px"><b>Catatan perbaikan:</b> ${esc(d.catatan_validasi)}</div>` : '';
  const dokTerkait = (r.induk ? `<div class="bag-judul">Dokumen induk</div><div class="mini-daftar"><a class="mini" href="#/dokumen/lihat/${r.induk.id}"><span><b>${esc(r.induk.jenis)}</b> ${esc(r.induk.nomor)}<div class="sub">${esc(r.induk.judul)}</div></span></a></div>` : '') +
    (r.turunan.length ? `<div class="bag-judul">Dokumen turunan (${r.turunan.length})</div><div class="mini-daftar">${r.turunan.map(x => `<a class="mini" href="#/dokumen/lihat/${x.id}"><span>${lJenis(x)} ${esc(x.nomor || x.nomor_mitra)}<div class="sub">${esc(x.judul)}, ${esc(x.unit_nama)}</div></span>${lMasa(x.status_masa)}</a>`).join('')}</div>` : '');
  const impl = `<div class="bag-judul">Implementasi (${r.implementasi.length})</div>` + (r.implementasi.length ? `<div class="mini-daftar">${r.implementasi.map(x => `<a class="mini" href="#/implementasi"><span><b>${esc(x.judul)}</b><div class="sub">${tglPendek(x.tgl_mulai)}, ${esc(x.unit_nama)}</div></span>${lVal(x.status_validasi, true)}</a>`).join('')}</div>` : '<p class="kecil">Belum ada kegiatan yang dilaporkan untuk dokumen ini.</p>');
  const kermaBag = ada('kerma') && d.jenis !== 'Berita Acara' ? `<div class="bag-judul">Pelaporan KERMA Dikti</div><div class="berkas">${d.kerma_status === '1' ? lencana('Sudah diunggah', 'ok') : lencana('Belum diunggah', 'warn')}
    <span class="nama" style="font-weight:400">${d.kerma_status === '1' ? `Diunggah ${tgl(d.kerma_tgl)} oleh ${esc(d.kerma_oleh)}${d.kerma_catatan ? ', ' + esc(d.kerma_catatan) : ''}` : 'Dokumen ini belum dilaporkan ke Website KERMA Dikti.'}</span>
    <button class="btn btn-ghost btn-sm" data-aksi="kerma-buka" data-id="${d.id}">${d.kerma_status === '1' ? 'Ubah status' : 'Tandai sudah diunggah'}</button></div>` : '';
  return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${tombol.join('')}</div>${catatan}
    <h2 style="margin-bottom:8px">${esc(d.mitra_nama)}</h2><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">${lJenis(d)}${lMasa(d.status_masa)}${lVal(d.status_validasi)}${d.cakupan ? lencana(d.cakupan, 'info') : ''}</div>
    <div class="bag-judul">Informasi dokumen</div><dl class="info">${baris('Judul', esc(d.judul))}${baris('Nomor UMB', esc(d.nomor))}${baris('Nomor mitra', esc(d.nomor_mitra))}${baris('Bidang kerja sama', esc(d.bidang.split('; ').join(', ')))}${baris('Ringkasan', esc(d.ringkasan).replace(/\n/g, '<br>'))}</dl>
    <div class="bag-judul">Penandatanganan</div><dl class="info">${baris('Tanggal', tgl(d.tgl_ttd))}${baris('Tempat', esc(d.tempat_ttd))}${baris('Unit penanggung jawab', esc(d.unit_nama))}${baris('Level penandatangan', esc(d.level_ttd))}${baris('Penandatangan UMB', esc(d.nama_ttd))}${baris('Penandatangan mitra', esc([d.nama_ttd_mitra, d.jabatan_ttd_mitra].filter(Boolean).join(', ')))}</dl>
    <div class="bag-judul">Masa berlaku</div><dl class="info">${baris('Mulai berlaku', tgl(d.tgl_mulai))}${baris('Berakhir', d.status_masa === 'tanpa_batas' ? 'Tanpa batas waktu' : tgl(d.tgl_berakhir) + ` <span class="kecil">(${teksSisa(d.sisa_hari)})</span>`)}</dl>
    <div class="bag-judul">Penanggung jawab</div><dl class="info">${baris('Nama', esc(d.pic_nama))}${baris('Email', esc(d.pic_email))}${baris('WhatsApp', d.pic_wa ? `<a href="https://wa.me/${esc(d.pic_wa)}" target="_blank" rel="noopener">${esc(d.pic_wa)}</a>` : '')}</dl>
    <div class="bag-judul">Mitra</div><dl class="info">${baris('Jenis', esc(m.jenis))}${baris('Cakupan', esc(m.cakupan) + (m.negara && m.cakupan === 'Luar Negeri' ? ', ' + esc(m.negara) : ''))}${baris('Kontak', esc([m.kontak_nama, m.kontak_email, m.kontak_telp].filter(Boolean).join(', ')))}</dl>
    <div class="bag-judul">Berkas</div>${d.ada_file ? `<div class="berkas"><span style="color:var(--bad)">${ikon('dokumen', 22)}</span><span class="nama">${esc(d.file_nama)}</span>
      <button class="btn btn-ghost btn-sm" data-aksi="pdf" data-j="dok" data-id="${d.id}" data-mode="lihat">${ikon('mata', 15)} Lihat</button>
      ${ada('unduh') ? `<button class="btn btn-utama btn-sm" data-aksi="pdf" data-j="dok" data-id="${d.id}" data-mode="unduh">${ikon('unduh', 15)} Unduh</button>` : ''}</div>
      ${ada('unduh') ? '' : '<p class="hint" style="margin-top:6px">Peran Anda dapat melihat berkas, tetapi tidak dapat mengunduhnya.</p>'}` : '<p class="kecil">Tidak ada berkas.</p>'}
    ${kermaBag}${dokTerkait}${impl}
    ${r.penerima_pengingat ? `<div class="bag-judul">Penerima pengingat otomatis</div><p class="kecil">${r.penerima_pengingat.length ? esc(r.penerima_pengingat.join(', ')) : 'Belum ada penerima valid.'}</p>` : ''}
    ${r.riwayat ? `<div class="bag-judul">Riwayat</div>${r.riwayat.length ? `<ul class="garis-waktu">${r.riwayat.map(x => `<li><b>${esc(x.aksi.replace(/_/g, ' '))}</b> oleh ${esc(x.pelaku)}<div class="sub">${esc(x.waktu)}${x.detail ? ', ' + esc(x.detail) : ''}</div></li>`).join('')}</ul>` : '<p class="kecil">Belum ada riwayat.</p>'}` : ''}`;
}
AKSI.pdf = t => bukaPdf(t.dataset.j, t.dataset.id, t.dataset.mode);
AKSI['dok-ubah'] = t => { location.hash = '#/dokumen/ubah/' + t.dataset.id; };
AKSI['dok-validasi'] = t => {
  const d = S.detail.dokumen, valid = t.dataset.k === 'valid';
  const m = modal({ judul: valid ? 'Validasi dokumen' : 'Minta perbaikan', lebar: 480,
    isi: valid ? '<p>Tandai dokumen ini sudah sesuai dan lengkap?</p>' : '<div class="medan"><label>Catatan untuk pengunggah <span class="wajib">*</span></label><textarea class="inp" id="v-cat" placeholder="Jelaskan bagian yang perlu diperbaiki"></textarea></div>',
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: valid ? 'Validasi' : 'Kirim catatan', kelas: 'btn-utama', aksi: async () => {
      await api('validasiDokumen', { id: d.id, keputusan: t.dataset.k, catatan: valid ? '' : $('#v-cat').value }); m.tutup(); toast(valid ? 'Dokumen tervalidasi' : 'Catatan perbaikan terkirim', 'ok'); route(true);
    } }] });
};
AKSI['dok-ingatkan'] = async () => {
  const r = S.detail, n = (r.penerima_pengingat || []).length;
  if (!(await konfirmasi('Kirim pengingat', `Pengingat masa berlaku dokumen ini akan dikirim ke ${n} penerima (penanggung jawab, admin unit, Admin Utama, dan Superadmin).`, 'Kirim sekarang'))) return;
  const t = toast('Mengirim pengingat', '', true);
  try { const h = await api('kirimPengingat', { id: r.dokumen.id }); toast(`Pengingat terkirim ke ${h.terkirim} penerima`, 'ok'); } catch (e) { toast(e.message, 'bad'); } finally { t.tutup(); }
};
AKSI['dok-hapus'] = async () => {
  const d = S.detail.dokumen;
  if (!(await konfirmasi('Hapus dokumen', `Dokumen ${d.jenis} ${d.mitra_nama} akan dihapus dari daftar. Berkas tetap tersimpan di Drive.`, 'Hapus', true))) return;
  try {
    try { await api('hapusDokumen', { id: d.id }); }
    catch (e) { if (e.kode !== 'KONFIRMASI') throw e; if (!(await konfirmasi('Dokumen memiliki data terkait', e.message, 'Hapus tetap', true))) return; await api('hapusDokumen', { id: d.id, paksa: true }); }
    toast('Dokumen dihapus', 'ok'); location.hash = '#/dokumen'; route(true);
  } catch (e) { toast(e.message, 'bad'); }
};

/* ===================== FORMULIR DOKUMEN ===================== */
async function pgFormDok(el, id, indukAwal) {
  el.innerHTML = memuat();
  await Promise.all([pastikanOpsi(), muatMitra(true)]);
  let L = {}, mitraAwal = '';
  if (id) { const r = await api('detailDokumen', { id }); L = r.dokumen; if (!L.bisa_ubah) throw new Error('Dokumen ini tidak dapat Anda ubah. Hubungi Admin Utama UGE.'); }
  else if (indukAwal) { try { const r = await api('detailDokumen', { id: indukAwal }); mitraAwal = r.dokumen.mitra_id; } catch (e) { /* abaikan */ } }
  S.formDok = { id: id || '', induk: L.induk_id || indukAwal || '' };
  const O = S.opsi.daftar, bidangDipilih = (L.bidang || '').split('; '), jenisDipilih = L.jenis || '';
  const unitList = (id && ada('kelola')) ? S.opsi.unit : unitBoleh();
  const unitPilih = L.unit_id || (unitList.length === 1 ? unitList[0].id : '');
  const u = S.user, tb = L.tanpa_batas === '1';
  el.innerHTML = judulHal(id ? 'Ubah dokumen' : 'Unggah dokumen kerja sama', 'Isi data selengkap mungkin. Data ini menjadi dasar pengingat, pelaporan, dan penilaian penghargaan.') +
    (id && L.catatan_validasi ? `<div class="peringatan bad mb"><b>Catatan perbaikan:</b> ${esc(L.catatan_validasi)}</div>` : '') +
    `<form id="form-dok" data-kirim="dok" novalidate>
    <section class="bagian"><h3>Mitra dan jenis dokumen<small>Pilih mitra dari daftar agar data tidak ganda. Jika belum ada, buat mitra baru dari kotak pilihan.</small></h3><div class="isi-b">
      <div class="medan"><label>Mitra <span class="wajib">*</span></label>${kombo('k-mitra', 'mitra_id', 'Ketik untuk mencari mitra')}</div>
      <div class="medan"><span class="lbl">Jenis dokumen <span class="wajib">*</span></span><div class="pilih-chip">${O.JENIS_DOK.map(j => `<label><input type="radio" name="jenis" value="${esc(j)}" data-ubah="dok-jenis" ${jenisDipilih === j ? 'checked' : ''}><span>${esc(j)}</span></label>`).join('')}</div></div>
      <div class="medan" id="w-jenis-lain" ${jenisDipilih === 'Lainnya' ? '' : 'hidden'}><label>Sebutkan jenis dokumen</label><input class="inp" name="jenis_lain" value="${esc(L.jenis_lain)}"></div>
      <div id="w-induk"></div></div></section>
    <section class="bagian"><h3>Identitas dokumen</h3><div class="isi-b">
      <div class="baris2"><div class="medan"><label>Nomor dokumen UMB</label><input class="inp" name="nomor" value="${esc(L.nomor)}"></div><div class="medan"><label>Nomor dokumen mitra</label><input class="inp" name="nomor_mitra" value="${esc(L.nomor_mitra)}"><span class="hint">Isi salah satu nomor, atau keduanya.</span></div></div>
      <div class="medan"><label>Judul atau tentang dokumen <span class="wajib">*</span></label><input class="inp" name="judul" value="${esc(L.judul)}" placeholder="Contoh: Kerja sama pertukaran mahasiswa dan dosen"></div>
      <div class="medan"><span class="lbl">Bidang kerja sama <span class="wajib">*</span></span><div class="grid-centang">${O.BIDANG.map(b => `<label class="centang"><input type="checkbox" name="bidang" value="${esc(b)}" ${bidangDipilih.includes(b) ? 'checked' : ''}> ${esc(b)}</label>`).join('')}</div></div>
      <div class="medan"><label>Ringkasan ruang lingkup</label><textarea class="inp" name="ringkasan" placeholder="Uraikan secara singkat isi dan tujuan kerja sama">${esc(L.ringkasan)}</textarea></div></div></section>
    <section class="bagian"><h3>Penandatanganan</h3><div class="isi-b">
      <div class="baris2"><div class="medan"><label>Tanggal ditandatangani <span class="wajib">*</span></label><input class="inp" type="date" name="tgl_ttd" max="${hariIniStr()}" value="${esc(L.tgl_ttd)}" data-ubah="dok-ttd"></div><div class="medan"><label>Tempat penandatanganan</label><input class="inp" name="tempat_ttd" value="${esc(L.tempat_ttd)}"></div></div>
      <div class="baris2"><div class="medan"><label>Prodi, fakultas, atau unit penanggung jawab <span class="wajib">*</span></label><select class="inp" name="unit_id">${opsiUnitHtml(unitList, unitPilih)}</select></div>
      <div class="medan"><label>Level penandatangan UMB <span class="wajib">*</span></label><select class="inp" name="level_ttd"><option value="">Pilih level</option>${O.LEVEL_TTD.map(x => `<option ${L.level_ttd === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div></div>
      <div class="medan"><label>Nama penandatangan UMB <span class="wajib">*</span></label><input class="inp" name="nama_ttd" value="${esc(L.nama_ttd)}"></div>
      <div class="baris2"><div class="medan"><label>Nama penandatangan mitra</label><input class="inp" name="nama_ttd_mitra" value="${esc(L.nama_ttd_mitra)}"></div><div class="medan"><label>Jabatan penandatangan mitra</label><input class="inp" name="jabatan_ttd_mitra" value="${esc(L.jabatan_ttd_mitra)}"></div></div></div></section>
    <section class="bagian"><h3>Masa berlaku<small>Pengingat otomatis dikirim ${S.opsi.ambang_segera / 30} bulan sebelum tanggal berakhir.</small></h3><div class="isi-b">
      <div class="baris2"><div class="medan"><label>Mulai berlaku</label><input class="inp" type="date" name="tgl_mulai" value="${esc(L.tgl_mulai)}"><span class="hint">Kosongkan bila sama dengan tanggal penandatanganan.</span></div>
      <div class="medan"><label>Tanggal berakhir <span class="wajib">*</span></label><input class="inp" type="date" name="tgl_berakhir" value="${esc(L.tgl_berakhir)}" ${tb ? 'disabled' : ''}></div></div>
      <div class="medan"><span class="lbl">Isi tanggal berakhir otomatis</span><div style="display:flex;gap:8px;flex-wrap:wrap">${[1, 2, 3, 5].map(n => `<button type="button" class="btn btn-ghost btn-sm" data-aksi="durasi" data-th="${n}">${n} tahun</button>`).join('')}</div></div>
      <label class="centang"><input type="checkbox" name="tanpa_batas" data-ubah="dok-tb" ${tb ? 'checked' : ''}> Dokumen berlaku tanpa batas waktu (tidak ada tanggal berakhir)</label></div></section>
    <section class="bagian"><h3>Penanggung jawab dokumen<small>Penerima pengingat masa berlaku dan rekap implementasi.</small></h3><div class="isi-b">
      <div class="baris3"><div class="medan"><label>Nama <span class="wajib">*</span></label><input class="inp" name="pic_nama" value="${esc(L.pic_nama || (id ? '' : u.nama))}"></div><div class="medan"><label>Email <span class="wajib">*</span></label><input class="inp" type="email" name="pic_email" value="${esc(L.pic_email || (id ? '' : u.email))}"></div><div class="medan"><label>WhatsApp</label><input class="inp" name="pic_wa" value="${esc(L.pic_wa || (id ? '' : u.wa))}"></div></div></div></section>
    <section class="bagian"><h3>Berkas dokumen<small>Format PDF, maksimal ${S.opsi.maks_pdf_mb} MB. Gunakan hasil pindai yang sudah ditandatangani kedua pihak.</small></h3><div class="isi-b">
      <label class="kotak-berkas" for="berkas"><span style="color:var(--navy-700)">${ikon('unggah', 26)}</span><span><span class="nama" id="nama-berkas">${id && L.ada_file ? 'Berkas saat ini: ' + esc(L.file_nama) : 'Pilih berkas PDF'}</span><br><span class="hint">${id ? 'Pilih berkas baru hanya jika ingin menggantinya.' : 'Klik untuk memilih berkas dari perangkat Anda.'}</span></span></label>
      <input type="file" id="berkas" accept="application/pdf,.pdf" data-ubah="dok-berkas" style="position:absolute;opacity:0;width:1px;height:1px"></div></section>
    ${ada('kerma') ? `<section class="bagian"><h3>Pelaporan KERMA Dikti</h3><div class="isi-b"><label class="centang"><input type="checkbox" name="kerma_status" ${L.kerma_status === '1' ? 'checked' : ''}> Dokumen ini sudah diunggah ke Website KERMA Dikti</label></div></section>` : ''}
    <div class="bar-aksi"><span class="pesan" id="f-pesan" role="alert"></span><a class="btn btn-ghost" href="#/dokumen${id ? '/lihat/' + id : ''}">Batal</a><button class="btn btn-utama" type="submit">${ikon('cek')} ${id ? 'Simpan perubahan' : 'Simpan dokumen'}</button></div></form>`;
  const kb = pasangKombo($('#k-mitra'), {
    ambil: () => S.mitra.map(mitraItem), kosong: 'Mitra tidak ditemukan',
    tambah: { label: 'Buat mitra baru', aksi: (nama, pilih) => bukaModalMitra({ nama }, m => pilih({ id: m.id, teks: m.nama, sub: '' })) },
    onPilih: () => muatInduk()
  });
  const m0 = S.mitra.find(m => m.id === (L.mitra_id || mitraAwal)); if (m0) kb.atur(mitraItem(m0));
}
async function muatInduk() {
  const f = $('#form-dok'); if (!f) return;
  const w = $('#w-induk'), mitra = f.elements.mitra_id.value, jenis = (f.elements.jenis.value || '');
  if (!mitra || !jenis) { w.innerHTML = ''; return; }
  const wajib = !!S.opsi.induk_wajib[jenis], syarat = (S.opsi.induk_wajib[jenis] || []).join(' atau ');
  w.innerHTML = '<span class="hint">Memuat dokumen induk</span>';
  try {
    const l = await api('opsiInduk', { mitra_id: mitra, jenis, kecuali: S.formDok.id });
    if (!l.length) { w.innerHTML = wajib ? `<div class="peringatan">Mitra ini belum memiliki ${esc(syarat)} yang tercatat. Unggah ${esc(syarat)} terlebih dahulu, karena ${esc(jenis)} merupakan turunannya.</div>` : ''; return; }
    w.innerHTML = `<div class="medan"><label>Dokumen induk ${wajib ? '<span class="wajib">*</span>' : '(opsional)'}</label><select class="inp" name="induk_id"><option value="">Pilih dokumen induk</option>${l.map(i => `<option value="${i.id}" ${i.id === S.formDok.induk ? 'selected' : ''}>${esc(i.jenis)} ${esc(i.nomor || i.judul)} (${esc(i.unit_nama)})</option>`).join('')}</select>
      <span class="hint">${wajib ? esc(jenis) + ' harus dikaitkan dengan ' + esc(syarat) + ' dari mitra yang sama.' : 'Kaitkan bila dokumen ini turunan dari dokumen lain.'}</span></div>`;
  } catch (e) { w.innerHTML = `<div class="peringatan bad">${esc(e.message)}</div>`; }
}
AKSI['dok-jenis'] = t => { $('#w-jenis-lain').hidden = t.value !== 'Lainnya'; muatInduk(); };
AKSI['dok-ttd'] = t => { const f = t.form; if (!f.elements.tgl_mulai.value) f.elements.tgl_mulai.value = t.value; };
AKSI['dok-tb'] = t => { const x = t.form.elements.tgl_berakhir; x.disabled = t.checked; if (t.checked) x.value = ''; };
AKSI['dok-berkas'] = t => { const f = t.files[0]; $('#nama-berkas').textContent = f ? `${f.name} (${ukuranBerkas(f.size)})` : 'Pilih berkas PDF'; };
AKSI.durasi = t => {
  const f = $('#form-dok'), mulai = f.elements.tgl_mulai.value || f.elements.tgl_ttd.value;
  if (!mulai) return toast('Isi tanggal penandatanganan terlebih dahulu', 'bad');
  f.elements.tanpa_batas.checked = false; f.elements.tgl_berakhir.disabled = false;
  f.elements.tgl_berakhir.value = tambahTahunStr(mulai, +t.dataset.th);
};
KIRIM.dok = async f => {
  const b = $('button[type=submit]', f), pesan = $('#f-pesan'); pesan.textContent = '';
  const fd = new FormData(f), d = Object.fromEntries(fd.entries());
  d.bidang = fd.getAll('bidang'); d.tanpa_batas = fd.get('tanpa_batas') ? '1' : '0'; if (ada('kerma')) d.kerma_status = fd.get('kerma_status') ? '1' : ''; if (S.formDok.id) d.id = S.formDok.id;
  muatTombol(b, true, 'Menyimpan');
  try {
    d.file = await bacaPdf($('#berkas').files[0]);
    const r = await api('simpanDokumen', d); toast('Dokumen tersimpan', 'ok'); location.hash = '#/dokumen/lihat/' + r.id;
  } catch (e) { muatTombol(b, false); pesan.textContent = e.message; }
};
