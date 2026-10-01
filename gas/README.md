# ⚙️ Panduan Backend Google Apps Script (Toko SRPCOM)

Skrip ini berfungsi sebagai **Backend REST API Gratis** untuk Toko SRPCOM.
Menghubungkan frontend GitHub Pages dengan:
- **Google Sheets** (sebagai database produk dan pencatatan order)
- **Google Drive** (sebagai media penyimpanan bukti transfer)

---

## 🚀 Cara Pasang (Paling Cepat via Google Sheets)

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda (gunakan akun Google Anda).
2. Beri nama spreadsheet: **Database Toko SRPCOM**.

### Langkah 2: Buka Apps Script Editor
1. Di menu atas Google Sheets, klik **Extensions (Ekstensi)** > **Apps Script**.
2. Beri nama proyek: **Toko SRPCOM Backend API**.
3. Hapus semua kode default di file `Code.gs`, lalu ganti dengan seluruh isi file [`gas/Code.gs`](file:///gas/Code.gs).
4. Klik tombol **Save (Simpan)** (ikon disket).

### Langkah 3: Inisialisasi Database Otomatis
1. Pada dropdown fungsi di samping tombol "Debug / Run", pilih fungsi: **`setupDatabase`**.
2. Klik tombol **Run (Jalankan)**.
3. Google akan meminta izin otorisasi pertama kali:
   - Klik **Review Permissions**.
   - Pilih akun Google Anda.
   - Klik **Advanced (Lanjutan)** > Klik **Go to Toko SRPCOM Backend API (unsafe)**.
   - Klik **Allow (Izinkan)**.
4. Kembali ke tab Google Sheets Anda! 
   - Anda akan melihat sheet **`Produk`** (berisi data awal) dan sheet **`Orders`** sudah otomatis dibuat dan dirapikan warnanya.
   - Folder bernama **`Bukti Transfer Toko SRPCOM`** juga otomatis dibuat di Google Drive Anda.

---

### Langkah 4: Deploy Menjadi Web App API Publik
1. Di editor Apps Script, klik tombol biru **Deploy** di kanan atas > pilih **New deployment**.
2. Klik ikon gerigi (Select type) > pilih **Web app**.
3. Isi form deployment:
   - **Description:** `Toko SRPCOM API v1`
   - **Execute as:** `Me (email-anda@gmail.com)` *(Sangat penting)*
   - **Who has access:** `Anyone (Siapa saja)` *(Sangat penting agar GitHub Pages bisa mengakses tanpa login)*
4. Klik **Deploy**.
5. Salin URL **Web App** yang dihasilkan.
   - Format URL: `https://script.google.com/macros/s/AKfycb.../exec`

---

### Langkah 5: Sambungkan ke Frontend GitHub Pages
Buka file [`app.js`](file:///app.js) di repository Anda, lalu tempel URL Web App pada `gasApiUrl`:
```javascript
const SRPCOM_CONFIG = {
  storeName: 'Toko SRPCOM',
  whatsappNumber: '628979527685',
  gasApiUrl: 'https://script.google.com/macros/s/AKfycb.../exec', // <-- Tempel URL Anda di sini
  // ...
};
```

Selesai! Sekarang semua produk akan ditarik secara dinamis dari Google Sheets, dan setiap pesanan otomatis tersimpan di tabel `Orders`.
