// Service worker TugasKu - Kelompok Josjis
// Naikkan nomor versi (v1 -> v2) setiap kali berkas ini atau daftar PRECACHE berubah.
const CACHE = 'tugasku-static-v1';
const PRECACHE = ['/', '/offline.html', '/manifest.json', '/icons/icon-192.png'];

// Saat dipasang: simpan berkas penting ke cache.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

// Saat aktif: hapus cache versi lama.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

// Setiap permintaan: tentukan dijawab dari mana.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Halaman: coba jaringan dulu. Kalau gagal, tampilkan halaman offline.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/offline.html')));
    return;
  }

  // Aset statis: pakai cache bila ada, kalau tidak ambil dari jaringan.
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
