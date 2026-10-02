/* ===================== MITRA ===================== */
function bukaModalMitra(awal, setelah) {
  awal = awal || {};
  const O = S.opsi.daftar, ln = awal.cakupan === 'Luar Negeri';
  const m = modal({
    judul: awal.id ? 'Ubah data mitra' : 'Mitra baru', lebar: 660,
    isi: `<form id="f-mitra" class="tumpuk" onsubmit="return false">
      <div class="medan"><label>Nama mitra <span class="wajib">*</span></label><input class="inp" name="nama" value="${esc(awal.nama)}" placeholder="Tulis nama lengkap tanpa singkatan"></div>
      <div class="baris2"><div class="medan"><label>Jenis mitra <span class="wajib">*</span></label><select class="inp" name="jenis"><option value="">Pilih jenis</option>${O.JENIS_MITRA.map(j => `<option ${awal.jenis === j ? 'selected' : ''}>${j}</option>`).join('')}</select></div>
      <div class="medan"><label>Cakupan <span class="wajib">*</span></label><select class="inp" name="cakupan" data-ubah="mitra-cakupan"><option value="">Pilih cakupan</option>${O.CAKUPAN.map(j => `<option ${awal.cakupan === j ? 'selected' : ''}>${j}</option>`).join('')}</select></div></div>
      <div class="baris2"><div class="medan" id="w-negara" ${ln ? '' : 'hidden'}><label>Negara <span class="wajib">*</span></label><input class="inp" name="negara" value="${esc(ln ? awal.negara : '')}"></div>
      <div class="medan"><label>Kota atau provinsi</label><input class="inp" name="kota" value="${esc(awal.kota)}"></div></div>
      <div class="medan"><label>Alamat</label><textarea class="inp" name="alamat" style="min-height:64px">${esc(awal.alamat)}</textarea></div>
      <div class="baris3"><div class="medan"><label>Narahubung</label><input class="inp" name="kontak_nama" value="${esc(awal.kontak_nama)}"></div><div class="medan"><label>Email narahubung</label><input class="inp" type="email" name="kontak_email" value="${esc(awal.kontak_email)}"></div><div class="medan"><label>Telepon</label><input class="inp" name="kontak_telp" value="${esc(awal.kontak_telp)}"></div></div>
      <div class="medan"><label>Situs web</label><input class="inp" name="situs" value="${esc(awal.situs)}" placeholder="https://"></div></form>`,
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: 'Simpan mitra', kelas: 'btn-utama', aksi: async () => {
      const d = dataForm($('#f-mitra')); if (awal.id) d.id = awal.id;
      const r = await api('simpanMitra', d); await muatMitra(true); m.tutup(); toast('Mitra tersimpan', 'ok'); if (setelah) setelah(r);
    } }]
  });
}
AKSI['mitra-cakupan'] = t => { $('#w-negara').hidden = t.value !== 'Luar Negeri'; };
AKSI['mitra-baru'] = () => bukaModalMitra({}, () => pgMitra($('#isi')));
AKSI['mitra-ubah'] = t => bukaModalMitra(S.mitra.find(x => x.id === t.dataset.id), () => pgMitra($('#isi')));
AKSI['mitra-cari'] = t => { S.mitraQ = t.value; renderMitra(); };

async function pgMitra(el) {
  S.hal = 'mitra'; el.innerHTML = memuat();
  await pastikanOpsi(); await muatMitra(true);
  el.innerHTML = judulHal('Mitra', 'Daftar mitra kerja sama. Pilih dari daftar ini saat mengunggah dokumen agar data tetap rapi.', ada('unggah') ? `<button class="btn btn-utama" data-aksi="mitra-baru">${ikon('plus')} Mitra baru</button>` : '') +
    `<div class="panel"><div class="alat"><div class="cari">${ikon('cari', 17)}<input class="inp" type="search" placeholder="Cari nama mitra atau negara" value="${esc(S.mitraQ || '')}" data-saring="mitra-cari" aria-label="Cari mitra"></div></div><div id="mitra-isi"></div></div>`;
  renderMitra();
}
function renderMitra() {
  const q = (S.mitraQ || '').toLowerCase(), l = S.mitra.filter(m => !q || [m.nama, m.negara, m.kota, m.jenis].join(' ').toLowerCase().includes(q)), w = $('#mitra-isi');
  if (!w) return;
  if (!l.length) { w.innerHTML = '<div class="kosong"><h3>Mitra tidak ditemukan</h3><p>Mitra baru dibuat dari halaman ini atau dari formulir unggah dokumen.</p></div>'; return; }
  w.innerHTML = `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Nama mitra</th><th>Jenis</th><th>Cakupan</th><th>Narahubung</th><th>Dokumen</th>${ada('kelola') ? '<th></th>' : ''}</tr></thead><tbody>${l.map(m => `<tr>
    <td><b>${esc(m.nama)}</b><div class="sub">${esc([m.kota, m.negara].filter(Boolean).join(', '))}</div></td><td>${esc(m.jenis)}</td><td>${lencana(m.cakupan, m.cakupan === 'Luar Negeri' ? 'info' : m.cakupan === 'Nasional' ? 'emas' : 'abu')}</td>
    <td>${esc(m.kontak_nama)}<div class="sub">${esc([m.kontak_email, m.kontak_telp].filter(Boolean).join(', '))}</div></td><td>${m.jumlah_dokumen}</td>
    ${ada('kelola') ? `<td><button class="btn btn-ghost btn-sm" data-aksi="mitra-ubah" data-id="${m.id}">${ikon('ubah', 14)} Ubah</button></td>` : ''}</tr>`).join('')}</tbody></table></div>
    <div class="kartu-daftar">${l.map(m => `<div class="kartu"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(m.nama)}</b>${lencana(m.cakupan, 'info')}</div><div class="sub">${esc(m.jenis)}, ${m.jumlah_dokumen} dokumen</div></div>`).join('')}</div><div class="tabel-kaki">${l.length} mitra</div>`;
}

/* ===================== IMPLEMENTASI ===================== */
const FI = { q: '', tahun: '', unit: '', validasi: '' };
async function pgImplementasi(el) {
  S.hal = 'implementasi'; el.innerHTML = memuat();
  await pastikanOpsi();
  S.impl = await api('daftarImplementasi'); S.implMap = {}; S.impl.forEach(x => { S.implMap[x.id] = x; });
  const th = Array.from(new Set(S.impl.map(x => x.tgl_mulai.slice(0, 4)))).sort().reverse(), un = Array.from(new Set(S.impl.map(x => x.unit_nama))).sort();
  el.innerHTML = judulHal('Implementasi kerja sama', 'Berita acara dan laporan kegiatan dari pelaksanaan MoU, MoA, dan IA. Data ini menjadi bahan pelaporan KERMA DIKTI dan penilaian penghargaan.',
    ada('unggah') ? `<a class="btn btn-utama" href="#/implementasi/baru">${ikon('plus')} Laporkan kegiatan</a>` : '') +
    `<div class="panel"><div class="alat"><div class="cari">${ikon('cari', 17)}<input class="inp" type="search" placeholder="Cari kegiatan atau mitra" value="${esc(FI.q)}" data-saring="impl-cari" aria-label="Cari"></div>
    <select class="inp" data-ubah="impl-f" data-k="tahun" aria-label="Tahun"><option value="">Semua tahun</option>${th.map(y => `<option ${FI.tahun === y ? 'selected' : ''}>${y}</option>`).join('')}</select>
    ${un.length > 1 ? `<select class="inp" data-ubah="impl-f" data-k="unit" aria-label="Unit"><option value="">Semua unit</option>${un.map(y => `<option ${FI.unit === y ? 'selected' : ''}>${esc(y)}</option>`).join('')}</select>` : ''}
    <select class="inp" data-ubah="impl-f" data-k="validasi" aria-label="Verifikasi"><option value="">Semua status</option><option value="menunggu" ${FI.validasi === 'menunggu' ? 'selected' : ''}>Menunggu verifikasi</option><option value="valid" ${FI.validasi === 'valid' ? 'selected' : ''}>Terverifikasi</option><option value="perbaikan" ${FI.validasi === 'perbaikan' ? 'selected' : ''}>Perlu perbaikan</option></select></div><div id="impl-isi"></div></div>`;
  renderImpl();
}
AKSI['impl-cari'] = t => { FI.q = t.value; renderImpl(); };
AKSI['impl-f'] = t => { FI[t.dataset.k] = t.value; renderImpl(); };
AKSI['impl-buka'] = t => bukaDetailImpl(t.dataset.id);
function renderImpl() {
  const w = $('#impl-isi'); if (!w) return;
  const q = FI.q.toLowerCase();
  const l = S.impl.filter(x => (!q || [x.judul, x.mitra_nama, x.unit_nama, x.perjanjian_nomor].join(' ').toLowerCase().includes(q)) && (!FI.tahun || x.tgl_mulai.slice(0, 4) === FI.tahun) && (!FI.unit || x.unit_nama === FI.unit) && (!FI.validasi || x.status_validasi === FI.validasi));
  if (!l.length) { w.innerHTML = `<div class="kosong"><h3>${S.impl.length ? 'Tidak ada kegiatan yang cocok' : 'Belum ada implementasi'}</h3><p>${S.impl.length ? 'Ubah filter untuk melihat data lain.' : 'Laporkan kegiatan beserta berita acara atau laporan kegiatannya.'}</p></div>`; return; }
  const bukti = x => [x.ada_ba ? lencana('Berita Acara', 'abu') : '', x.ada_lap ? lencana('Laporan', 'abu') : ''].filter(Boolean).join(' ');
  w.innerHTML = `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Kegiatan</th><th>Dokumen dasar</th><th>Unit pelaksana</th><th>Tanggal</th><th>Bukti</th><th>Status</th></tr></thead><tbody>${l.map(x => `<tr data-aksi="impl-buka" data-id="${x.id}">
    <td><b>${esc(x.judul)}</b><div class="sub">${esc(x.jenis_kegiatan)}</div></td><td>${lencana(x.perjanjian_jenis, 'emas')} ${esc(x.perjanjian_nomor)}<div class="sub">${esc(x.mitra_nama)}</div></td>
    <td>${esc(x.unit_nama)}</td><td>${tglPendek(x.tgl_mulai)}</td><td>${bukti(x)}</td><td>${lVal(x.status_validasi, true)}</td></tr>`).join('')}</tbody></table></div>
    <div class="kartu-daftar">${l.map(x => `<div class="kartu" data-aksi="impl-buka" data-id="${x.id}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(x.judul)}</b>${lVal(x.status_validasi, true)}</div><div class="sub">${esc(x.mitra_nama)}, ${esc(x.unit_nama)}, ${tglPendek(x.tgl_mulai)}</div></div>`).join('')}</div>
    <div class="tabel-kaki">Menampilkan ${l.length} dari ${S.impl.length} kegiatan</div>`;
}
function bukaDetailImpl(id) {
  const x = S.implMap[id]; if (!x) return;
  const t = [];
  if (x.bisa_ubah) t.push(`<a class="btn btn-ghost btn-sm" href="#/implementasi/ubah/${x.id}" data-aksi="tutup-modal">${ikon('ubah', 15)} Ubah</a>`);
  if (ada('validasi') && x.status_validasi !== 'valid') t.push(`<button class="btn btn-utama btn-sm" data-aksi="impl-val" data-k="valid" data-id="${x.id}">${ikon('cek', 15)} Verifikasi</button>`);
  if (ada('validasi')) t.push(`<button class="btn btn-ghost btn-sm" data-aksi="impl-val" data-k="perbaikan" data-id="${x.id}">Minta perbaikan</button>`);
  if (ada('hapus')) t.push(`<button class="btn btn-ghost btn-sm" style="color:var(--bad)" data-aksi="impl-hapus" data-id="${x.id}">${ikon('sampah', 15)} Hapus</button>`);
  const berkas = (j, nama, ada_) => ada_ ? `<div class="berkas" style="margin-bottom:8px"><span style="color:var(--bad)">${ikon('dokumen', 22)}</span><span class="nama">${nama}</span>
    <button class="btn btn-ghost btn-sm" data-aksi="pdf" data-j="${j}" data-id="${x.id}" data-mode="lihat">${ikon('mata', 15)} Lihat</button>${ada('unduh') ? `<button class="btn btn-utama btn-sm" data-aksi="pdf" data-j="${j}" data-id="${x.id}" data-mode="unduh">${ikon('unduh', 15)} Unduh</button>` : ''}</div>` : '';
  const m = modal({ judul: 'Detail kegiatan', lebar: 720, onTutup: () => { S.modalImpl = null; }, isi: `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${t.join('')}</div>
    ${x.catatan_validasi ? `<div class="peringatan bad" style="margin-bottom:14px"><b>Catatan perbaikan:</b> ${esc(x.catatan_validasi)}</div>` : ''}
    <h3 style="margin-bottom:8px">${esc(x.judul)}</h3><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${lencana(x.jenis_kegiatan, 'info')}${lVal(x.status_validasi, true)}${x.cakupan ? lencana(x.cakupan, 'abu') : ''}</div>
    <dl class="info">${baris('Dokumen dasar', `<a href="#/dokumen/lihat/${x.perjanjian_id}" data-aksi="tutup-modal">${esc(x.perjanjian_jenis)} ${esc(x.perjanjian_nomor)}</a>, ${esc(x.mitra_nama)}`)}${baris('Unit pelaksana', esc(x.unit_nama))}
    ${baris('Tanggal', x.tgl_selesai && x.tgl_selesai !== x.tgl_mulai ? `${tgl(x.tgl_mulai)} s.d. ${tgl(x.tgl_selesai)}` : tgl(x.tgl_mulai))}${baris('Tempat', esc(x.tempat))}${baris('Jumlah peserta', x.peserta ? angka(x.peserta) : '')}
    ${baris('Uraian', esc(x.uraian).replace(/\n/g, '<br>'))}${baris('Capaian atau luaran', esc(x.capaian).replace(/\n/g, '<br>'))}</dl>
    <div class="bag-judul">Bukti kegiatan</div>${berkas('ba', esc(x.file_ba_nama), x.ada_ba)}${berkas('lap', esc(x.file_lap_nama), x.ada_lap)}${ada('unduh') ? '' : '<p class="hint">Peran Anda dapat melihat berkas, tetapi tidak dapat mengunduhnya.</p>'}` });
  S.modalImpl = m;
}
AKSI['tutup-modal'] = () => { if (S.modalImpl) S.modalImpl.tutup(); };
AKSI['impl-val'] = t => {
  const valid = t.dataset.k === 'valid', id = t.dataset.id;
  const m = modal({ judul: valid ? 'Verifikasi kegiatan' : 'Minta perbaikan', lebar: 480,
    isi: valid ? '<p>Tandai laporan ini sudah sesuai? Kegiatan terverifikasi dihitung dalam papan peringkat.</p>' : '<div class="medan"><label>Catatan untuk pelapor <span class="wajib">*</span></label><textarea class="inp" id="v-cat"></textarea></div>',
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: valid ? 'Verifikasi' : 'Kirim catatan', kelas: 'btn-utama', aksi: async () => {
      await api('validasiImplementasi', { id, keputusan: t.dataset.k, catatan: valid ? '' : $('#v-cat').value }); m.tutup(); if (S.modalImpl) S.modalImpl.tutup(); toast('Tersimpan', 'ok'); route(true);
    } }] });
};
AKSI['impl-hapus'] = async t => {
  if (!(await konfirmasi('Hapus data implementasi', 'Data kegiatan ini akan dihapus dari daftar.', 'Hapus', true))) return;
  try { await api('hapusImplementasi', { id: t.dataset.id }); if (S.modalImpl) S.modalImpl.tutup(); toast('Data dihapus', 'ok'); route(true); } catch (e) { toast(e.message, 'bad'); }
};

async function pgFormImpl(el, id, dokAwal) {
  el.innerHTML = memuat();
  await pastikanOpsi();
  const [per, daftar] = await Promise.all([api('opsiPerjanjianImpl'), id ? api('daftarImplementasi') : Promise.resolve([])]);
  const L = id ? (daftar.find(x => x.id === id) || {}) : {};
  if (id && (!L.id || !L.bisa_ubah)) throw new Error('Data implementasi tidak ditemukan atau tidak dapat Anda ubah.');
  S.formImpl = { id: id || '', per };
  const unitList = (id && ada('kelola')) ? S.opsi.unit : unitBoleh(), unitPilih = L.unit_id || (unitList.length === 1 ? unitList[0].id : '');
  const itemPer = d => ({ id: d.id, teks: `${d.jenis} ${d.nomor || d.judul}, ${d.mitra_nama}`, sub: `${d.unit_nama}${d.status_masa === 'kedaluwarsa' ? ', sudah berakhir' : ''}`, d });
  el.innerHTML = judulHal(id ? 'Ubah laporan implementasi' : 'Laporkan implementasi kerja sama', 'Unggah berita acara dan atau laporan kegiatan. Minimal satu berkas PDF.') +
    (id && L.catatan_validasi ? `<div class="peringatan bad mb"><b>Catatan perbaikan:</b> ${esc(L.catatan_validasi)}</div>` : '') +
    `<form id="form-impl" data-kirim="impl" novalidate>
    <section class="bagian"><h3>Dokumen kerja sama yang diimplementasikan</h3><div class="isi-b"><div class="medan"><label>MoU, MoA, atau IA <span class="wajib">*</span></label>${kombo('k-per', 'perjanjian_id', 'Cari berdasarkan mitra atau nomor dokumen')}<span class="hint" id="h-per">Implementasi dikaitkan ke dokumen yang menjadi dasar kegiatan.</span></div></div></section>
    <section class="bagian"><h3>Data kegiatan</h3><div class="isi-b">
      <div class="medan"><label>Judul kegiatan <span class="wajib">*</span></label><input class="inp" name="judul" value="${esc(L.judul)}"></div>
      <div class="baris2"><div class="medan"><label>Jenis kegiatan <span class="wajib">*</span></label><select class="inp" name="jenis_kegiatan"><option value="">Pilih jenis</option>${S.opsi.daftar.JENIS_KEGIATAN.map(j => `<option ${L.jenis_kegiatan === j ? 'selected' : ''}>${j}</option>`).join('')}</select></div>
      <div class="medan"><label>Unit pelaksana <span class="wajib">*</span></label><select class="inp" name="unit_id">${opsiUnitHtml(unitList, unitPilih)}</select></div></div>
      <div class="baris3"><div class="medan"><label>Tanggal mulai <span class="wajib">*</span></label><input class="inp" type="date" name="tgl_mulai" value="${esc(L.tgl_mulai)}"></div><div class="medan"><label>Tanggal selesai</label><input class="inp" type="date" name="tgl_selesai" value="${esc(L.tgl_selesai)}"></div><div class="medan"><label>Jumlah peserta</label><input class="inp" type="number" min="0" name="peserta" value="${esc(L.peserta)}"></div></div>
      <div class="medan"><label>Tempat pelaksanaan</label><input class="inp" name="tempat" value="${esc(L.tempat)}"></div>
      <div class="medan"><label>Uraian kegiatan <span class="wajib">*</span></label><textarea class="inp" name="uraian">${esc(L.uraian)}</textarea></div>
      <div class="medan"><label>Capaian atau luaran</label><textarea class="inp" name="capaian" placeholder="Contoh: naskah publikasi, nota kesepahaman lanjutan, jumlah mahasiswa yang berangkat">${esc(L.capaian)}</textarea></div></div></section>
    <section class="bagian"><h3>Bukti kegiatan<small>PDF, maksimal ${S.opsi.maks_pdf_mb} MB per berkas. Isi minimal salah satu.</small></h3><div class="isi-b"><div class="baris2">
      <div class="medan"><label>Berita Acara</label><input class="inp" type="file" id="f-ba" accept="application/pdf,.pdf">${id && L.ada_ba ? `<span class="hint">Tersimpan: ${esc(L.file_ba_nama)}. Pilih berkas baru untuk mengganti.</span>` : ''}</div>
      <div class="medan"><label>Laporan Kegiatan</label><input class="inp" type="file" id="f-lap" accept="application/pdf,.pdf">${id && L.ada_lap ? `<span class="hint">Tersimpan: ${esc(L.file_lap_nama)}. Pilih berkas baru untuk mengganti.</span>` : ''}</div></div></div></section>
    <div class="bar-aksi"><span class="pesan" id="f-pesan" role="alert"></span><a class="btn btn-ghost" href="#/implementasi">Batal</a><button class="btn btn-utama" type="submit">${ikon('cek')} ${id ? 'Simpan perubahan' : 'Simpan laporan'}</button></div></form>`;
  const kb = pasangKombo($('#k-per'), {
    ambil: () => per.map(itemPer), kosong: 'Belum ada MoU, MoA, atau IA yang tercatat',
    onPilih: i => { const h = $('#h-per'); if (h) h.textContent = i && i.d.status_masa === 'kedaluwarsa' ? `Dokumen ini berakhir pada ${tgl(i.d.tgl_berakhir)}. Kegiatan tetap dapat dilaporkan.` : 'Implementasi dikaitkan ke dokumen yang menjadi dasar kegiatan.'; }
  });
  const d0 = per.find(x => x.id === (L.perjanjian_id || dokAwal)); if (d0) kb.atur(itemPer(d0));
}
KIRIM.impl = async f => {
  const b = $('button[type=submit]', f), pesan = $('#f-pesan'); pesan.textContent = '';
  const d = dataForm(f); if (S.formImpl.id) d.id = S.formImpl.id;
  muatTombol(b, true, 'Menyimpan');
  try {
    d.file_ba = await bacaPdf($('#f-ba').files[0]); d.file_lap = await bacaPdf($('#f-lap').files[0]);
    await api('simpanImplementasi', d); toast('Laporan tersimpan', 'ok'); location.hash = '#/implementasi';
  } catch (e) { muatTombol(b, false); pesan.textContent = e.message; }
};

/* ===================== PENGINGAT ===================== */
async function pgPengingat(el) {
  S.hal = 'pengingat'; el.innerHTML = memuat();
  const r = await api('daftarPengingat'); S.pengingat = r;
  el.innerHTML = judulHal('Pengingat', 'Pantau dan kirim pengingat masa berlaku dokumen serta rekap tindak lanjut implementasi.',
    `<button class="btn btn-ghost" data-aksi="kirim-rekap">${ikon('aktivitas')} Kirim rekap implementasi</button><button class="btn btn-utama" data-aksi="kirim-semua">${ikon('surat')} Kirim pengingat dokumen segera berakhir</button>`) +
    `<div class="grid g3 mb"><div class="panel"><div class="panel-isi"><div class="kecil">Pengingat masa berlaku</div><p style="margin:6px 0 0">Dikirim otomatis setiap pukul 07.00 WIB pada tahap ${r.tahap.filter(t => t > 0).join(', ')} hari sebelum berakhir, dan saat dokumen berakhir.</p></div></div>
      <div class="panel"><div class="panel-isi"><div class="kecil">Rekap implementasi</div><p style="margin:6px 0 0">Dikirim otomatis tanggal 1 bulan ${r.bulan_rekap.map(b => BLN[b - 1]).join(' dan ')}. ${r.rekap_terakhir ? 'Terakhir terkirim pada periode ' + esc(r.rekap_terakhir) + '.' : 'Belum pernah terkirim.'}</p></div></div>
      <div class="panel"><div class="panel-isi"><div class="kecil">Sisa kuota email hari ini</div><div style="font-family:var(--f-display);font-size:32px;font-weight:600;color:${r.kuota_email < 20 ? 'var(--bad)' : 'var(--navy-900)'}">${r.kuota_email}</div></div></div></div>
    <section class="panel mb"><div class="panel-kepala"><h3>Dokumen yang memerlukan pengingat</h3></div>${r.dokumen.length ? `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Mitra</th><th>Dokumen</th><th>Unit</th><th>Berakhir</th><th>Pengingat terakhir</th><th></th></tr></thead><tbody>${r.dokumen.map(d => `<tr>
      <td><a class="tautan" href="#/dokumen/lihat/${d.id}">${esc(d.mitra_nama)}</a></td><td>${esc(d.jenis)} ${esc(d.nomor)}</td><td>${esc(d.unit_nama)}</td>
      <td>${tglPendek(d.tgl_berakhir)}<div class="sub">${teksSisa(d.sisa_hari)}</div></td><td>${d.pengingat_terakhir ? esc(d.pengingat_terakhir) : '<span class="kecil">Belum</span>'}<div class="sub">${d.jumlah_penerima} penerima</div></td>
      <td><button class="btn btn-ghost btn-sm" data-aksi="kirim-satu" data-id="${d.id}">Kirim</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="kosong">Tidak ada dokumen yang memasuki masa pengingat.</div>'}</section>
    <section class="panel"><div class="panel-kepala"><h3>Riwayat pengiriman</h3></div>${r.riwayat.length ? `<ul class="garis-waktu" style="margin:18px 20px">${r.riwayat.map(x => `<li><b>${esc(x.aksi.replace(/_/g, ' '))}</b> oleh ${esc(x.pelaku)}<div class="sub">${esc(x.waktu)}, ${esc(x.detail)}</div></li>`).join('')}</ul>` : '<div class="kosong">Belum ada riwayat.</div>'}</section>`;
}
async function kirimPengingatAksi(judul, pesan, aksi, data) {
  if (!(await konfirmasi(judul, pesan, 'Kirim sekarang'))) return;
  const t = toast('Mengirim email', '', true);
  try { const h = await api(aksi, data); toast(`Terkirim ke ${h.terkirim} penerima`, 'ok'); route(true); } catch (e) { toast(e.message, 'bad'); } finally { t.tutup(); }
}
AKSI['kirim-semua'] = () => kirimPengingatAksi('Kirim pengingat', 'Pengingat dikirim untuk semua dokumen yang sisa masa berlakunya kurang dari 4 bulan atau baru berakhir (30 hari terakhir), kepada penanggung jawab, admin terkait, Admin Utama, dan Superadmin.', 'kirimPengingat', {});
AKSI['kirim-satu'] = t => kirimPengingatAksi('Kirim pengingat', 'Kirim pengingat untuk dokumen ini kepada penanggung jawab dan admin terkait?', 'kirimPengingat', { id: t.dataset.id });
AKSI['kirim-rekap'] = () => kirimPengingatAksi('Kirim rekap implementasi', 'Rekap berisi dokumen yang sudah dan belum memiliki tindak lanjut dalam 6 bulan terakhir akan dikirim ke penanggung jawab masing-masing.', 'kirimRekapImplementasi', {});

/* ===================== PENGGUNA ===================== */
const STATUS_USER = { aktif: ['Aktif', 'ok'], menunggu_persetujuan: ['Menunggu persetujuan', 'info'], menunggu_verifikasi_email: ['Belum verifikasi email', 'abu'], ditolak: ['Ditolak', 'bad'], nonaktif: ['Nonaktif', 'abu'] };
let TAB_USER = 'menunggu', Q_USER = '';
async function pgPengguna(el) {
  S.hal = 'pengguna'; el.innerHTML = memuat();
  await pastikanOpsi(); S.users = await api('daftarPengguna');
  const n = S.users.filter(u => u.status === 'menunggu_persetujuan').length;
  if (n === 0 && TAB_USER === 'menunggu') TAB_USER = 'semua';
  el.innerHTML = judulHal('Pengguna', 'Verifikasi pendaftaran admin dan kelola akun.') +
    `<div class="panel"><div class="segmen" id="user-segmen"></div><div class="alat"><div class="cari">${ikon('cari', 17)}<input class="inp" type="search" placeholder="Cari nama, email, atau unit" data-saring="user-cari" aria-label="Cari pengguna"></div></div><div id="user-isi"></div></div>`;
  renderUser();
}
AKSI['user-cari'] = t => { Q_USER = t.value; renderUser(); };
AKSI['user-tab'] = t => { TAB_USER = t.dataset.t; renderUser(); };
function renderUser() {
  const w = $('#user-isi'); if (!w) return;
  const n = S.users.filter(u => u.status === 'menunggu_persetujuan').length, q = Q_USER.toLowerCase();
  $('#user-segmen').innerHTML = [['menunggu', 'Menunggu persetujuan', n], ['semua', 'Semua pengguna', S.users.length]].map(s => `<button class="${TAB_USER === s[0] ? 'aktif' : ''}" data-aksi="user-tab" data-t="${s[0]}">${s[1]}<span>${s[2]}</span></button>`).join('');
  const l = S.users.filter(u => (TAB_USER === 'semua' || u.status === 'menunggu_persetujuan') && (!q || [u.nama, u.email, u.unit_nama, u.jabatan].join(' ').toLowerCase().includes(q)));
  if (!l.length) { w.innerHTML = '<div class="kosong"><h3>Tidak ada pengguna</h3><p>Pendaftaran baru akan muncul di sini setelah email pendaftar terverifikasi.</p></div>'; return; }
  const aksi = u => {
    if (u.role === 'superadmin' || u.id === S.user.id) return '';
    if (S.user.role === 'admin_utama' && u.role === 'admin_utama') return '<span class="kecil">Diproses Superadmin</span>';
    const b = [];
    if (u.status === 'menunggu_persetujuan') b.push(`<button class="btn btn-utama btn-sm" data-aksi="user-proses" data-k="setujui" data-id="${u.id}">Setujui</button><button class="btn btn-ghost btn-sm" data-aksi="user-proses" data-k="tolak" data-id="${u.id}">Tolak</button>`);
    else if (u.status === 'aktif') b.push(`<button class="btn btn-ghost btn-sm" data-aksi="user-proses" data-k="nonaktifkan" data-id="${u.id}">Nonaktifkan</button>`);
    else if (u.status === 'nonaktif' || u.status === 'ditolak') b.push(`<button class="btn btn-ghost btn-sm" data-aksi="user-proses" data-k="aktifkan" data-id="${u.id}">Aktifkan</button>`);
    if (S.user.role === 'superadmin') b.push(`<button class="btn btn-teks btn-sm" data-aksi="user-ubah" data-id="${u.id}">Ubah</button>`);
    return `<div style="display:flex;gap:6px;flex-wrap:wrap">${b.join('')}</div>`;
  };
  w.innerHTML = `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Nama</th><th>Peran dan unit</th><th>Kontak</th><th>Status</th><th></th></tr></thead><tbody>${l.map(u => `<tr>
    <td><b>${esc(u.nama)}</b><div class="sub">${esc(u.jabatan)}, ${esc(u.nidn_nuptk)}</div></td><td>${esc(LABEL_PERAN[u.role] || u.role)}<div class="sub">${esc(u.unit_nama)}</div></td>
    <td>${esc(u.email)}<div class="sub"><a href="https://wa.me/${esc(u.wa)}" target="_blank" rel="noopener">${esc(u.wa)}</a></div></td>
    <td>${lencana(STATUS_USER[u.status][0], STATUS_USER[u.status][1])}${u.catatan && u.status === 'ditolak' ? `<div class="sub">${esc(u.catatan)}</div>` : ''}</td><td>${aksi(u)}</td></tr>`).join('')}</tbody></table></div>
    <div class="kartu-daftar">${l.map(u => `<div class="kartu"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(u.nama)}</b>${lencana(STATUS_USER[u.status][0], STATUS_USER[u.status][1])}</div><div class="sub">${esc(LABEL_PERAN[u.role])}, ${esc(u.unit_nama)}</div><div>${aksi(u)}</div></div>`).join('')}</div>`;
}
AKSI['user-proses'] = t => {
  const k = t.dataset.k, u = S.users.find(x => x.id === t.dataset.id), judul = { setujui: 'Setujui pendaftaran', tolak: 'Tolak pendaftaran', nonaktifkan: 'Nonaktifkan akun', aktifkan: 'Aktifkan akun' }[k];
  const m = modal({ judul, lebar: 480, isi: `<p><b>${esc(u.nama)}</b><br><span class="kecil">${esc(LABEL_PERAN[u.role])}, ${esc(u.unit_nama)}</span></p>${k === 'tolak' ? '<div class="medan"><label>Alasan penolakan <span class="wajib">*</span></label><textarea class="inp" id="u-cat"></textarea></div>' : k === 'setujui' ? '<p>Pengguna akan menerima email pemberitahuan dan dapat langsung masuk.</p>' : ''}`,
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: judul, kelas: k === 'tolak' || k === 'nonaktifkan' ? 'btn-bahaya' : 'btn-utama', aksi: async () => {
      await api('prosesPengguna', { id: u.id, keputusan: k, catatan: k === 'tolak' ? $('#u-cat').value : '' }); m.tutup(); toast('Tersimpan', 'ok'); pgPengguna($('#isi'));
    } }] });
};
AKSI['user-ubah'] = t => {
  const u = S.users.find(x => x.id === t.dataset.id);
  const roleOpts = ['admin_utama', 'admin_prodi', 'admin_fakultas', 'admin_rektorat'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${esc(LABEL_PERAN[r])}</option>`).join('');
  const m = modal({ judul: 'Ubah data pengguna', lebar: 560, isi: `<form id="f-user" class="tumpuk" onsubmit="return false">
    <div class="medan"><label>Nama</label><input class="inp" name="nama" value="${esc(u.nama)}"></div>
    <div class="baris2"><div class="medan"><label>WhatsApp</label><input class="inp" name="wa" value="${esc(u.wa)}"></div><div class="medan"><label>NP</label><input class="inp" name="nidn_nuptk" value="${esc(u.nidn_nuptk)}"></div></div>
    <div class="medan"><label>Jabatan</label><input class="inp" name="jabatan" value="${esc(u.jabatan)}"></div>
    <div class="medan"><label>Peran</label><select class="inp" name="role" data-ubah="user-peran">${roleOpts}</select></div>
    <div class="medan" id="u-unit-w" ${u.role === 'admin_utama' ? 'hidden' : ''}><label>Unit kerja</label><select class="inp" name="unit_id">${opsiUnitHtml(S.opsi.unit, u.unit_id)}</select></div></form>`,
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: 'Simpan', kelas: 'btn-utama', aksi: async () => {
      const d = dataForm($('#f-user')); d.id = u.id; await api('ubahPengguna', d); m.tutup(); toast('Data pengguna diperbarui', 'ok'); pgPengguna($('#isi'));
    } }] });
};
AKSI['user-peran'] = t => { $('#u-unit-w').hidden = t.value === 'admin_utama'; };

/* ===================== UNIT ===================== */
let TAB_UNIT = 'prodi';
async function pgUnit(el) {
  S.hal = 'unit'; el.innerHTML = memuat();
  await pastikanOpsi(); S.unitSemua = await api('daftarUnit');
  el.innerHTML = judulHal('Unit dan fakultas', 'Daftar fakultas, program studi, serta unit di rektorat. Daftar ini dipakai pada pendaftaran admin dan formulir dokumen.',
    `<button class="btn btn-ghost" data-aksi="unit-impor">${ikon('unggah')} Impor daftar</button><button class="btn btn-utama" data-aksi="unit-baru">${ikon('plus')} Tambah unit</button>`) +
    `<div class="panel"><div class="segmen" id="unit-segmen"></div><div id="unit-isi"></div></div>`;
  renderUnit();
}
AKSI['unit-tab'] = t => { TAB_UNIT = t.dataset.t; renderUnit(); };
function renderUnit() {
  const w = $('#unit-isi'); if (!w) return;
  const J = [['prodi', 'Program studi'], ['fakultas', 'Fakultas'], ['rektorat', 'Rektorat, unit, lembaga, biro']];
  $('#unit-segmen').innerHTML = J.map(j => `<button class="${TAB_UNIT === j[0] ? 'aktif' : ''}" data-aksi="unit-tab" data-t="${j[0]}">${j[1]}<span>${S.unitSemua.filter(u => u.jenis === j[0]).length}</span></button>`).join('');
  const l = S.unitSemua.filter(u => u.jenis === TAB_UNIT).sort((a, b) => a.nama.localeCompare(b.nama));
  if (!l.length) { w.innerHTML = '<div class="kosong"><h3>Belum ada data</h3><p>Tambahkan unit satu per satu atau gunakan impor daftar.</p></div>'; return; }
  const fak = id => (S.unitSemua.find(x => x.id === id) || {}).nama || '';
  w.innerHTML = `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Nama</th>${TAB_UNIT === 'prodi' ? '<th>Fakultas</th>' : ''}<th>Status</th><th></th></tr></thead><tbody>${l.map(u => `<tr><td><b>${esc(u.nama)}</b></td>${TAB_UNIT === 'prodi' ? `<td>${esc(fak(u.fakultas_id))}</td>` : ''}<td>${u.aktif === '0' ? lencana('Nonaktif', 'abu') : lencana('Aktif', 'ok')}</td><td><button class="btn btn-ghost btn-sm" data-aksi="unit-ubah" data-id="${u.id}">${ikon('ubah', 14)} Ubah</button></td></tr>`).join('')}</tbody></table></div><div class="tabel-kaki">${l.length} unit</div>`;
}
function modalUnit(u) {
  u = u || { jenis: TAB_UNIT };
  const fk = S.unitSemua.filter(x => x.jenis === 'fakultas');
  const m = modal({ judul: u.id ? 'Ubah unit' : 'Tambah unit', lebar: 520, isi: `<form id="f-unit" class="tumpuk" onsubmit="return false">
    <div class="medan"><label>Jenis</label><select class="inp" name="jenis" data-ubah="unit-jenis"><option value="prodi" ${u.jenis === 'prodi' ? 'selected' : ''}>Program studi</option><option value="fakultas" ${u.jenis === 'fakultas' ? 'selected' : ''}>Fakultas</option><option value="rektorat" ${u.jenis === 'rektorat' ? 'selected' : ''}>Rektorat, unit, lembaga, atau biro</option></select></div>
    <div class="medan"><label>Nama <span class="wajib">*</span></label><input class="inp" name="nama" value="${esc(u.nama)}"></div>
    <div class="medan" id="u-fak" ${u.jenis === 'prodi' ? '' : 'hidden'}><label>Fakultas induk <span class="wajib">*</span></label><select class="inp" name="fakultas_id"><option value="">Pilih fakultas</option>${fk.map(f => `<option value="${f.id}" ${u.fakultas_id === f.id ? 'selected' : ''}>${esc(f.nama)}</option>`).join('')}</select></div>
    ${u.id ? `<label class="centang"><input type="checkbox" name="aktif" ${u.aktif === '0' ? '' : 'checked'}> Unit aktif (muncul pada pilihan formulir)</label>` : ''}</form>`,
    tombol: [{ label: 'Batal', aksi: () => m.tutup() }, { label: 'Simpan', kelas: 'btn-utama', aksi: async () => {
      const f = $('#f-unit'), d = dataForm(f); if (u.id) { d.id = u.id; d.aktif = f.elements.aktif.checked; }
      await api('simpanUnit', d); m.tutup(); toast('Unit tersimpan', 'ok'); S.opsi = null; S.unitPublik = null; pgUnit($('#isi'));
    } }] });
}
AKSI['unit-jenis'] = t => { $('#u-fak').hidden = t.value !== 'prodi'; };
AKSI['unit-baru'] = () => modalUnit();
AKSI['unit-ubah'] = t => modalUnit(S.unitSemua.find(x => x.id === t.dataset.id));
AKSI['unit-impor'] = () => {
  const m = modal({ judul: 'Impor daftar unit', lebar: 640, isi: `<p class="kecil">Tulis satu unit per baris dengan format <b>jenis;nama;fakultas induk</b>. Jenis berisi prodi, fakultas, atau rektorat. Tulis baris fakultas lebih dulu sebelum prodi di bawahnya. Nama yang sudah ada dilewati.</p>
    <textarea class="inp" id="u-teks" style="min-height:220px;font-size:13.5px" placeholder="fakultas;Fakultas Ekonomi dan Bisnis&#10;prodi;Manajemen;Fakultas Ekonomi dan Bisnis&#10;rektorat;Lembaga Penelitian"></textarea><div id="u-hasil" style="margin-top:10px"></div>`,
    tombol: [{ label: 'Tutup', aksi: () => m.tutup() }, { label: 'Impor', kelas: 'btn-utama', aksi: async () => {
      const r = await api('imporUnit', { teks: $('#u-teks').value }); S.opsi = null; S.unitPublik = null;
      $('#u-hasil').innerHTML = `<div class="peringatan ${r.galat.length ? '' : 'ok'}"><b>${r.tambah}</b> unit ditambahkan, ${r.lewati} dilewati.${r.galat.length ? '<br>' + r.galat.map(esc).join('<br>') : ''}</div>`;
      S.unitSemua = await api('daftarUnit'); renderUnit();
    } }] });
};

/* ===================== LOG DAN PROFIL ===================== */
async function pgLog(el) {
  S.hal = 'log'; el.innerHTML = memuat();
  const l = await api('daftarLog');
  el.innerHTML = judulHal('Log aktivitas', '400 aktivitas terbaru di seluruh sistem.') + `<div class="panel">${l.length ? `<div class="tbl-wrap"><table class="tabel"><thead><tr><th>Waktu</th><th>Kategori</th><th>Pelaku</th><th>Aksi</th><th>Target</th><th>Keterangan</th></tr></thead><tbody>${l.map(x => `<tr><td style="white-space:nowrap">${esc(x.waktu)}</td><td>${esc(x.kategori)}</td><td>${esc(x.pelaku)}</td><td>${esc(x.aksi.replace(/_/g, ' '))}</td><td class="sub">${esc(x.target)}</td><td class="sub">${esc(x.detail)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="kosong">Belum ada aktivitas.</div>'}</div>`;
}
async function pgProfil(el) {
  S.hal = 'profil'; const u = S.user;
  el.innerHTML = judulHal('Profil saya') + `<div class="grid g2b"><section class="panel"><div class="panel-kepala"><h3>Data akun</h3></div><div class="panel-isi"><dl class="info">${baris('Nama', esc(u.nama))}${baris('Email', esc(u.email))}${baris('WhatsApp', esc(u.wa))}${baris('NP', esc(u.nidn_nuptk))}${baris('Jabatan', esc(u.jabatan))}${baris('Peran', esc(LABEL_PERAN[u.role]))}${baris('Unit', esc(u.unit_nama))}</dl>
    <p class="hint" style="margin-top:14px">Untuk mengubah data akun, hubungi Superadmin UGE.</p></div></section>
    <section class="panel"><div class="panel-kepala"><h3>Ganti kata sandi</h3></div><div class="panel-isi"><form data-kirim="sandi" class="tumpuk" novalidate>
      <div class="medan"><label>Kata sandi saat ini</label><input class="inp" type="password" name="lama" autocomplete="current-password"></div>
      <div class="medan"><label>Kata sandi baru</label><input class="inp" type="password" name="baru" autocomplete="new-password"><span class="hint">Minimal 8 karakter, memuat huruf dan angka.</span></div>
      <div class="medan"><label>Ulangi kata sandi baru</label><input class="inp" type="password" name="baru2" autocomplete="new-password"></div>
      <div class="peringatan bad" id="s-galat" hidden></div><button class="btn btn-utama" type="submit" style="align-self:flex-start">Simpan kata sandi</button></form></div></section></div>`;
}
KIRIM.sandi = async f => {
  const b = $('button[type=submit]', f), g = $('#s-galat'); g.hidden = true; muatTombol(b, true, 'Menyimpan');
  try { await api('gantiSandi', dataForm(f)); f.reset(); toast('Kata sandi diperbarui', 'ok'); } catch (e) { g.hidden = false; g.textContent = e.message; } finally { muatTombol(b, false); }
};
