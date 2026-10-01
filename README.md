# 🛒 Toko SRPCOM - Platform Digital & PPOB 24 Jam

Web toko online modern untuk penjualan Pulsa All Operator, Paket Kuota Data Internet, Token Listrik PLN, Top Up Saldo E-Wallet, Voucher Game, dan Layanan Digital SRPCOM.
Dibangun dengan arsitektur **Serverless Static Frontend** yang ringan, cepat, dan siap dihosting gratis di **GitHub Pages**, dengan backend fleksibel menggunakan **Google Apps Script (GAS)** & **Google Sheets**.

---

## 🌟 Fitur Utama
1. **Adopsi UI/UX Modern AwanPulsa:**
   - Desain mobile-first dengan tema cerah bersih (Clean Slate & Sky Blue).
   - Glassmorphism sticky navbar & ambient glowing lighting.
   - 6 Tab Kategori: Pulsa Reguler, Paket Data, Token PLN, E-Wallet, Voucher Game, dan Layanan SRPCOM.
2. **Deteksi Operator Otomatis (0ms Instant Client-Side):**
   - Mengetik 4 digit nomor HP (misal `0812`, `0857`, `0878`, `0838`, `0896`, `0882`, `0851`) langsung mendeteksi badge operator (**Telkomsel, Indosat, XL, Axis, Tri, Smartfren, By.U**).
3. **Proteksi Anti Double-Order (Idempotency 30s):**
   - Mencegah pembeli mengklik transaksi ganda saat koneksi internet melambat.
4. **Checkout & Verifikasi Kilat:**
   - Generate kode unik transfer (3-digit) untuk verifikasi otomatis/mudah.
   - Pilihan rekening Bank (BSI, BCA) & E-Wallet (DANA, ShopeePay) dengan fitur **1-Click Salin Nomor Rekening**.
   - Integrasi langsung ke **WhatsApp API** dengan format pesan nota siap kirim ke Admin.
5. **Offline/Fallback Catalog Ready:**
   - Website langsung siap digunakan dan menampilkan katalog tanpa harus menunggu database disetup.
   - Siap disinkronkan dinamis dengan Google Sheets via Google Apps Script Web App.

---

## 📂 Struktur File
```text
├── index.html       # Antarmuka web utama (Frontend)
├── style.css        # Kustomisasi CSS, font Plus Jakarta Sans, scrollbar & modal
├── app.js           # Mesin utama (Logika katalog, deteksi nomor HP, modal & WA checkout)
└── README.md        # Dokumentasi teknis & panduan deployment
```

---

## 🚀 Panduan Hosting di GitHub Pages

1. **Inisialisasi Git & Commit:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit Toko SRPCOM frontend"
   ```

2. **Buat Repository Baru di GitHub:**
   - Beri nama repository: `toko-srpcom` (atau nama pilihan Anda).
   - Pastikan visibilitas: **Public**.

3. **Push ke GitHub:**
   ```bash
   git remote add origin https://github.com/<username-anda>/toko-srpcom.git
   git branch -M main
   git push -u origin main
   ```

4. **Aktifkan GitHub Pages:**
   - Masuk ke tab **Settings** di repository GitHub Anda.
   - Klik menu **Pages** di bilah kiri.
   - Pada bagian **Build and deployment > Source**, pilih `Deploy from a branch`.
   - Pilih Branch: `main` dan folder `/ (root)`, lalu klik **Save**.
   - Dalam 1-2 menit, website Toko SRPCOM Anda aktif di `https://<username-anda>.github.io/toko-srpcom/`.

---

## ⚙️ Konfigurasi Kontak & Rekening
Buka file [`app.js`](file:///app.js) dan sesuaikan bagian `SRPCOM_CONFIG`:
```javascript
const SRPCOM_CONFIG = {
  storeName: 'Toko SRPCOM',
  whatsappNumber: '628979527685', // Nomor WhatsApp admin tujuan order
  gasApiUrl: '', // Isi setelah menyelesaikan Fase 2 (Google Apps Script)
  paymentAccounts: {
    bsi: { accountNo: '7253303867', accountName: 'SRPCOM OFFICIAL' },
    bca: { accountNo: '8110928371', accountName: 'SRPCOM OFFICIAL' },
    dana: { accountNo: '08979527685', accountName: 'SRPCOM DIGITAL' },
    shopeepay: { accountNo: '08979527685', accountName: 'SRPCOM DIGITAL' }
  }
};
```
