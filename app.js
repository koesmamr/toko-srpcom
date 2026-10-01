/**
 * ==============================================================================
 * TOKO SRPCOM - MAIN APPLICATION JAVASCRIPT (app.js)
 * Mengadopsi alur, komponen & interaksi modern dari AwanPulsa
 * ==============================================================================
 */

// 1. KONFIGURASI TOKO & INTEGRASI
const SRPCOM_CONFIG = {
  storeName: 'Toko SRPCOM',
  tagline: '✦ Pusat Layanan Digital & PPOB 24 Jam ✦',
  whatsappNumber: '628979527685', // Format: 628xxx (tanpa + atau 0)
  
  // URL Web App Google Apps Script (Diisi saat Fase 2 selesai)
  gasApiUrl: '', 

  // Akun Pembayaran Manual Toko SRPCOM
  paymentAccounts: {
    bsi: {
      bankName: 'Bank BSI (Bank Syariah Indonesia)',
      accountNo: '7253303867',
      accountName: 'SRPCOM OFFICIAL',
      icon: '🏦'
    },
    bca: {
      bankName: 'Bank BCA',
      accountNo: '8110928371',
      accountName: 'SRPCOM OFFICIAL',
      icon: '🏛️'
    },
    dana: {
      bankName: 'DANA',
      accountNo: '08979527685',
      accountName: 'SRPCOM DIGITAL',
      icon: '📱'
    },
    shopeepay: {
      bankName: 'ShopeePay',
      accountNo: '08979527685',
      accountName: 'SRPCOM DIGITAL',
      icon: '🛍️'
    }
  },

  // QRIS String / URL Gambar
  qris: {
    qrString: '00020101021126670016ID.CO.SHOPEE.WWW011893600918000000000002150000000000000000303UMI51440014ID.CO.QRIS.WWW0215ID10200210000000303UMI5204599953033605802ID5911TOKO SRPCOM6007BANDUNG61054011562070703A01630454D1',
    qrImage: '' // Jika ingin menyematkan link gambar langsung
  }
};

// 2. KATALOG PRODUK BAWAAN (OFFLINE FALLBACK READY)
// Produk akan otomatis tampil saat pertama kali dibuka, dan akan diperbarui dari GAS jika ada API
const DEFAULT_PRODUCTS = [
  // PULSA TELKOMSEL
  { code: 'TSEL5', name: 'Telkomsel 5.000', price: 6200, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +7 hari, langsung masuk 24 jam' },
  { code: 'TSEL10', name: 'Telkomsel 10.000', price: 11200, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +15 hari, reguler all jaringan' },
  { code: 'TSEL20', name: 'Telkomsel 20.000', price: 20800, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +30 hari' },
  { code: 'TSEL25', name: 'Telkomsel 25.000', price: 25750, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +30 hari' },
  { code: 'TSEL50', name: 'Telkomsel 50.000', price: 50500, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +45 hari' },
  { code: 'TSEL100', name: 'Telkomsel 100.000', price: 99500, category: 'pulsa', brand: 'TELKOMSEL', desc: 'Masa aktif +60 hari' },

  // PULSA INDOSAT
  { code: 'ISAT5', name: 'Indosat IM3 5.000', price: 6150, category: 'pulsa', brand: 'INDOSAT', desc: 'Masa aktif +7 hari' },
  { code: 'ISAT10', name: 'Indosat IM3 10.000', price: 11150, category: 'pulsa', brand: 'INDOSAT', desc: 'Masa aktif +15 hari' },
  { code: 'ISAT25', name: 'Indosat IM3 25.000', price: 25600, category: 'pulsa', brand: 'INDOSAT', desc: 'Masa aktif +30 hari' },
  { code: 'ISAT50', name: 'Indosat IM3 50.000', price: 50400, category: 'pulsa', brand: 'INDOSAT', desc: 'Masa aktif +45 hari' },

  // PULSA XL & AXIS
  { code: 'XL5', name: 'XL Axiata 5.000', price: 6200, category: 'pulsa', brand: 'XL', desc: 'Masa aktif +7 hari' },
  { code: 'XL10', name: 'XL Axiata 10.000', price: 11200, category: 'pulsa', brand: 'XL', desc: 'Masa aktif +15 hari' },
  { code: 'XL25', name: 'XL Axiata 25.000', price: 25700, category: 'pulsa', brand: 'XL', desc: 'Masa aktif +30 hari' },
  { code: 'AX5', name: 'Axis 5.000', price: 6150, category: 'pulsa', brand: 'AXIS', desc: 'Masa aktif +7 hari' },
  { code: 'AX10', name: 'Axis 10.000', price: 11150, category: 'pulsa', brand: 'AXIS', desc: 'Masa aktif +15 hari' },

  // PULSA TRI & SMARTFREN & BYU
  { code: 'TRI5', name: 'Tri (3) 5.000', price: 6100, category: 'pulsa', brand: 'TRI', desc: 'Masa aktif +7 hari' },
  { code: 'TRI10', name: 'Tri (3) 10.000', price: 11100, category: 'pulsa', brand: 'TRI', desc: 'Masa aktif +15 hari' },
  { code: 'SMART10', name: 'Smartfren 10.000', price: 11200, category: 'pulsa', brand: 'SMARTFREN', desc: 'Masa aktif +15 hari' },
  { code: 'BYU10', name: 'By.U 10.000', price: 11200, category: 'pulsa', brand: 'BYU', desc: 'Pulsa By.U serba hemat' },

  // PAKET DATA
  { code: 'DATA-TSEL-3GB', name: 'Telkomsel Data 3.5GB 5 Hari', price: 18500, category: 'data', brand: 'TELKOMSEL', desc: 'Kuota Nasional 24 Jam Semua Jaringan' },
  { code: 'DATA-TSEL-10GB', name: 'Telkomsel Data 10GB 30 Hari', price: 48500, category: 'data', brand: 'TELKOMSEL', desc: 'Kuota Reguler Flash All Jaringan' },
  { code: 'DATA-ISAT-7GB', name: 'Indosat Freedom 7GB 30 Hari', price: 32000, category: 'data', brand: 'INDOSAT', desc: 'Freedom Internet Utama 24 Jam' },
  { code: 'DATA-XL-11GB', name: 'XL Xtra Combo Flex 11GB', price: 39000, category: 'data', brand: 'XL', desc: '30 Hari + Bonus Kuota YouTube/Tiktok' },

  // TOKEN PLN
  { code: 'PLN20', name: 'Token PLN Rp 20.000', price: 21500, category: 'pln', brand: 'PLN', desc: 'Kode Stroom 20 Digit instan di layar & WhatsApp' },
  { code: 'PLN50', name: 'Token PLN Rp 50.000', price: 51500, category: 'pln', brand: 'PLN', desc: 'Kode Stroom 20 Digit instan di layar & WhatsApp' },
  { code: 'PLN100', name: 'Token PLN Rp 100.000', price: 101500, category: 'pln', brand: 'PLN', desc: 'Kode Stroom 20 Digit instan di layar & WhatsApp' },
  { code: 'PLN200', name: 'Token PLN Rp 200.000', price: 201500, category: 'pln', brand: 'PLN', desc: 'Kode Stroom 20 Digit instan di layar & WhatsApp' },

  // E-WALLET
  { code: 'DANA10', name: 'Saldo DANA 10.000', price: 11250, category: 'ewallet', brand: 'DANA', desc: 'Saldo DANA otomatis masuk 1-3 detik' },
  { code: 'DANA20', name: 'Saldo DANA 20.000', price: 21250, category: 'ewallet', brand: 'DANA', desc: 'Saldo DANA otomatis masuk 1-3 detik' },
  { code: 'DANA50', name: 'Saldo DANA 50.000', price: 51250, category: 'ewallet', brand: 'DANA', desc: 'Saldo DANA otomatis masuk 1-3 detik' },
  { code: 'GOPAY10', name: 'Saldo GoPay 10.000', price: 11300, category: 'ewallet', brand: 'GOPAY', desc: 'Top Up Saldo GoPay Customer' },
  { code: 'GOPAY25', name: 'Saldo GoPay 25.000', price: 26300, category: 'ewallet', brand: 'GOPAY', desc: 'Top Up Saldo GoPay Customer' },
  { code: 'SHOPEE10', name: 'ShopeePay 10.000', price: 11200, category: 'ewallet', brand: 'SHOPEEPAY', desc: 'Top Up Saldo ShopeePay' },
  { code: 'SHOPEE20', name: 'ShopeePay 20.000', price: 21200, category: 'ewallet', brand: 'SHOPEEPAY', desc: 'Top Up Saldo ShopeePay' },
  { code: 'OVO20', name: 'Saldo OVO 20.000', price: 21500, category: 'ewallet', brand: 'OVO', desc: 'Top Up Saldo OVO Cash' },

  // GAME
  { code: 'ML86', name: 'Mobile Legends 86 Diamonds', price: 21500, category: 'game', brand: 'GAME', desc: 'Proses Instan via User ID & Zone ID' },
  { code: 'ML172', name: 'Mobile Legends 172 Diamonds', price: 42500, category: 'game', brand: 'GAME', desc: 'Proses Instan via User ID & Zone ID' },
  { code: 'FF140', name: 'Free Fire 140 Diamonds', price: 19500, category: 'game', brand: 'GAME', desc: 'Top up kilat via Player ID' },
  { code: 'FF355', name: 'Free Fire 355 Diamonds', price: 48000, category: 'game', brand: 'GAME', desc: 'Top up kilat via Player ID' },

  // LAYANAN SRPCOM KHUSUS
  { code: 'SRP-WEB', name: 'Jasa Pembuatan Web & Hosting', price: 250000, category: 'srpcom', brand: 'SRPCOM', desc: 'Setup website toko, landing page, atau portfolio' },
  { code: 'SRP-BOT', name: 'Setup Bot Notifikasi WhatsApp/Telegram', price: 150000, category: 'srpcom', brand: 'SRPCOM', desc: 'Integrasi otomatis Google Sheets ke WhatsApp' },
  { code: 'SRP-VPN', name: 'Akun Premium VPN Private 30 Hari', price: 25000, category: 'srpcom', brand: 'SRPCOM', desc: 'Koneksi internet cepat & aman unlimited' }
];

// 3. STATE MANAJEMEN APLIKASI
let allProducts = [...DEFAULT_PRODUCTS];
let currentCategory = 'pulsa';
let currentBrand = '';
let detectedBrand = '';
let activeEwalletBrand = 'DANA';
let activeGameBrand = 'ML';

// Anti Double Click Lock (30 detik)
const TRX_LOCK_KEY = 'srpcom_trx_lock';
let trxLockInterval = null;

// Brand Display Names
const BRAND_NAMES = {
  'TELKOMSEL': 'Telkomsel',
  'INDOSAT': 'Indosat IM3',
  'XL': 'XL Axiata',
  'AXIS': 'Axis',
  'TRI': 'Tri (3)',
  'SMARTFREN': 'Smartfren',
  'BYU': 'By.U',
  'PLN': 'Token PLN',
  'DANA': 'DANA',
  'GOPAY': 'GoPay',
  'OVO': 'OVO',
  'SHOPEEPAY': 'ShopeePay',
  'GAME': 'Voucher Game',
  'SRPCOM': 'Layanan SRPCOM'
};

// 4. DETEKTOR OPERATOR SELULER (0ms INSTANT CLIENT-SIDE ENGINE)
function detectOperator(phone) {
  if (!phone) return null;
  const clean = String(phone).replace(/\D/g, '').replace(/^62/, '0');
  if (clean.length < 4) return null;
  const p4 = clean.substring(0, 4);

  if (p4 === '0851') return 'BYU';
  if (['0852', '0853', '0811', '0812', '0813', '0821', '0822', '0823'].includes(p4)) return 'TELKOMSEL';
  if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(p4)) return 'INDOSAT';
  if (['0817', '0818', '0819', '0859', '0877', '0878'].includes(p4)) return 'XL';
  if (['0831', '0832', '0833', '0838'].includes(p4)) return 'AXIS';
  if (['0895', '0896', '0897', '0898', '0899'].includes(p4)) return 'TRI';
  if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(p4)) return 'SMARTFREN';
  return null;
}

// 5. HELPER FORMAT RUPIAH & ESCAPE HTML
function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 6. INITIALIZATION SAAT HALAMAN DIMUAT
document.addEventListener('DOMContentLoaded', () => {
  // Render konfigurasi brand ke elemen statis
  const brandNameEls = document.querySelectorAll('.dynamic-store-name');
  brandNameEls.forEach(el => el.innerText = SRPCOM_CONFIG.storeName);

  // Setup kategori default
  selectCategory('pulsa');

  // Mulai hitung mundur proteksi transaksi jika ada lock tersimpan
  checkTrxLockState();

  // Load produk dari GAS jika ada API URL
  if (SRPCOM_CONFIG.gasApiUrl) {
    loadProductsFromGAS();
  }
});

// 7. SINKRONISASI DATA DARI GOOGLE APPS SCRIPT (GAS)
async function loadProductsFromGAS() {
  const loadingEl = document.getElementById('productsLoading');
  try {
    if (loadingEl) loadingEl.classList.remove('hidden');
    const res = await fetch(`${SRPCOM_CONFIG.gasApiUrl}?action=getProducts`);
    const json = await res.json();
    if (json && json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
      allProducts = json.data;
      console.log(`[SRPCOM] Berhasil memuat ${allProducts.length} produk dari Google Sheets.`);
      renderFilteredProducts();
    }
  } catch (err) {
    console.warn('[SRPCOM] Menggunakan katalog lokal karena GAS belum terhubung:', err.message);
  } finally {
    if (loadingEl) loadingEl.classList.add('hidden');
  }
}

// 8. LOGIKA SELEKSI KATEGORI
function selectCategory(cat) {
  currentCategory = cat;

  // Update tab visual
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('cat-btn-' + cat);
  if (activeBtn) activeBtn.classList.add('active');

  const input = document.getElementById('customerNoInput');
  const label = document.getElementById('input-label');
  const helper = document.getElementById('helperText');
  const brandContainer = document.getElementById('brandSelectorContainer');
  const badge = document.getElementById('operatorBadge');

  if (cat === 'pln') {
    label.innerText = 'Nomor Meter / ID Pelanggan PLN';
    input.placeholder = 'Contoh: 14234567890 (11-12 Digit)';
    helper.innerText = 'Masukkan 11-12 digit Nomor Meter atau ID Pelanggan PLN.';
    brandContainer.classList.add('hidden');
    badge.classList.add('hidden');
    currentBrand = 'PLN';
    renderFilteredProducts();
  } else if (cat === 'ewallet') {
    label.innerText = 'Nomor HP Akun E-Wallet';
    input.placeholder = 'Contoh: 081234567890';
    helper.innerText = 'Pilih e-wallet tujuan lalu masukkan nomor HP yang terdaftar.';
    brandContainer.classList.remove('hidden');
    badge.classList.add('hidden');
    renderBrandPills(['DANA', 'SHOPEEPAY', 'GOPAY', 'OVO'], activeEwalletBrand);
    currentBrand = activeEwalletBrand;
    renderFilteredProducts();
  } else if (cat === 'game') {
    label.innerText = 'User ID & Zone/Server Akun Game';
    input.placeholder = 'Contoh: 12345678 (2041)';
    helper.innerText = 'Masukkan User ID dan Zone ID akun game Anda.';
    brandContainer.classList.remove('hidden');
    badge.classList.add('hidden');
    renderBrandPills(['GAME'], 'GAME');
    currentBrand = 'GAME';
    renderFilteredProducts();
  } else if (cat === 'srpcom') {
    label.innerText = 'Nomor WhatsApp / Email Kontak Pemesan';
    input.placeholder = 'Contoh: 081234567890 atau email@domain.com';
    helper.innerText = 'Tim Toko SRPCOM akan segera menghubungi kontak Anda setelah pesanan dibuat.';
    brandContainer.classList.add('hidden');
    badge.classList.add('hidden');
    currentBrand = 'SRPCOM';
    renderFilteredProducts();
  } else {
    // Pulsa atau Data
    label.innerText = 'Nomor Handphone Tujuan';
    input.placeholder = 'Contoh: 081234567890';
    helper.innerText = 'Ketik 4 digit pertama nomor HP untuk otomatis mendeteksi operator.';
    brandContainer.classList.add('hidden');
    handlePhoneInput(input.value);
  }
}

// 9. RENDER PILIHAN BRAND (SUB-KATEGORI)
function renderBrandPills(brands, activeBrand) {
  const container = document.getElementById('brandPills');
  if (!container) return;
  container.innerHTML = brands.map(b => `
    <button onclick="setBrand('${b}')" id="pill-${b}" class="brand-pill ${b === activeBrand ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
      ${BRAND_NAMES[b] || b}
    </button>
  `).join('');
}

function setBrand(brand) {
  currentBrand = brand;
  if (currentCategory === 'ewallet') activeEwalletBrand = brand;
  document.querySelectorAll('.brand-pill').forEach(btn => {
    btn.classList.remove('bg-sky-600', 'text-white', 'shadow-md');
    btn.classList.add('bg-slate-100', 'text-slate-700');
  });
  const activeBtn = document.getElementById('pill-' + brand);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
    activeBtn.classList.add('bg-sky-600', 'text-white', 'shadow-md');
  }
  renderFilteredProducts();
}

// 10. REAL-TIME PHONE INPUT & OPERATOR DETECTOR
function handlePhoneInput(val) {
  const clean = val.replace(/\D/g, '');
  const badge = document.getElementById('operatorBadge');
  const nameSpan = document.getElementById('operatorName');

  if (['pln', 'ewallet', 'game', 'srpcom'].includes(currentCategory)) {
    badge.classList.add('hidden');
    return;
  }

  if (clean.length >= 4) {
    const detected = detectOperator(clean);
    if (detected) {
      detectedBrand = detected;
      currentBrand = detected;
      nameSpan.innerText = BRAND_NAMES[detected] || detected;
      badge.classList.remove('hidden');
      badge.classList.add('flex');
      renderFilteredProducts();
      return;
    }
  }

  badge.classList.add('hidden');
  if (clean.length < 4) {
    currentBrand = '';
    renderFilteredProducts();
  }
}

// 11. FILTER & RENDER KARTU PRODUK
function renderFilteredProducts() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('productsEmpty');
  const countBadge = document.getElementById('productCountBadge');
  const listTitle = document.getElementById('productListTitle');

  if (!grid) return;

  // Filter berdasarkan category & brand
  let filtered = allProducts.filter(p => {
    if (currentCategory === 'pulsa' || currentCategory === 'data') {
      if (currentBrand) {
        return p.category === currentCategory && p.brand.toUpperCase() === currentBrand.toUpperCase();
      }
      return false; // Jangan tampilkan sebelum nomor diketik 4 digit
    }
    if (currentCategory === 'pln') return p.category === 'pln';
    if (currentCategory === 'ewallet') return p.category === 'ewallet' && p.brand.toUpperCase() === currentBrand.toUpperCase();
    if (currentCategory === 'game') return p.category === 'game';
    if (currentCategory === 'srpcom') return p.category === 'srpcom';
    return true;
  });

  // Tampilkan title dan badge count
  if (listTitle) {
    if (currentBrand) {
      listTitle.innerText = `Pilihan Produk (${BRAND_NAMES[currentBrand] || currentBrand})`;
    } else {
      listTitle.innerText = 'Pilihan Produk';
    }
  }

  if (countBadge) {
    countBadge.innerText = `${filtered.length} produk siap diproses`;
  }

  // Cek jika kosong
  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) {
      emptyState.classList.remove('hidden');
      if (['pulsa', 'data'].includes(currentCategory) && !currentBrand) {
        emptyState.querySelector('.empty-title').innerText = 'Silakan masukkan nomor tujuan di atas';
        emptyState.querySelector('.empty-desc').innerText = 'Daftar nominal pulsa & paket data akan otomatis muncul setelah 4 digit nomor dimasukkan.';
      } else {
        emptyState.querySelector('.empty-title').innerText = 'Belum ada produk untuk kategori ini';
        emptyState.querySelector('.empty-desc').innerText = 'Silakan pilih operator atau kategori lain.';
      }
    }
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // Render cards
  const remaining = getTrxRemainingSeconds();
  const isLocked = remaining > 0;

  grid.innerHTML = filtered.map(p => `
    <div onclick="initiateCheckout('${p.code}')" class="product-card p-5 rounded-3xl border-2 border-slate-200 bg-white hover:border-sky-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between group relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
            ${p.brand}
          </span>
          <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Proses Cepat
          </span>
        </div>
        <h4 class="font-extrabold text-slate-900 text-base mb-1 group-hover:text-sky-600 transition leading-snug">
          ${escapeHtml(p.name)}
        </h4>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          ${escapeHtml(p.desc || p.name)}
        </p>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
        <div>
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Harga</span>
          <div class="text-lg font-black text-sky-600 font-mono">
            ${formatRupiah(p.price)}
          </div>
        </div>
        <button type="button" class="btn-buy-product ${isLocked ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md shadow-sky-600/20 active:scale-95'} font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5" ${isLocked ? 'disabled' : ''}>
          <span>${isLocked ? '⏳ Tunggu' : 'Beli Sekarang'}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// 12. ALUR CHECKOUT & POPUP PEMBAYARAN
function initiateCheckout(productCode) {
  if (isTrxLocked()) {
    const rem = getTrxRemainingSeconds();
    Swal.fire({
      icon: 'warning',
      title: 'Tombol Transaksi Dikunci',
      html: `Proteksi anti-double order aktif. Mohon tunggu <b>${rem} detik</b> sebelum membuat pesanan baru.`,
      timer: 3000,
      timerProgressBar: true
    });
    return;
  }

  const customerNo = document.getElementById('customerNoInput').value.trim();
  if (!customerNo) {
    Swal.fire({
      icon: 'warning',
      title: 'Nomor Tujuan Belum Diisi',
      text: 'Harap masukkan nomor handphone, nomor meter, atau ID tujuan sebelum melanjutkan.',
      confirmButtonColor: '#0284c7'
    });
    document.getElementById('customerNoInput').focus();
    return;
  }

  const product = allProducts.find(p => p.code === productCode);
  if (!product) return;

  // Buat kode unik 3 digit (1 - 999) untuk verifikasi otomatis
  const uniqueCode = Math.floor(Math.random() * 899) + 100;
  const totalPrice = product.price + uniqueCode;
  const orderRef = 'SRP-' + Date.now().toString().slice(-6);

  // Render Konten Modal Pembayaran Modern (Mengadopsi AwanPulsa)
  const acc = SRPCOM_CONFIG.paymentAccounts;
  const modalHtml = `
    <div class="text-left text-slate-800 text-sm space-y-4">
      <!-- Ringkasan Produk -->
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">${product.brand}</span>
            <h4 class="font-black text-slate-900 text-base mt-1">${escapeHtml(product.name)}</h4>
          </div>
          <span class="text-xs font-mono font-bold text-slate-500">${orderRef}</span>
        </div>
        <div class="text-xs text-slate-600 flex items-center justify-between border-t border-slate-200/60 pt-2 mt-2">
          <span>Tujuan / ID:</span>
          <b class="font-mono text-slate-900 text-sm bg-white px-2 py-0.5 rounded border border-slate-200">${escapeHtml(customerNo)}</b>
        </div>
      </div>

      <!-- Total Bayar & Kode Unik -->
      <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
        <span class="text-xs text-emerald-800 font-bold uppercase tracking-wider block">Total Transfer Tepat (Termasuk Kode Unik):</span>
        <div class="flex items-center justify-center gap-2 mt-1">
          <span class="text-3xl font-black text-emerald-600 font-mono tracking-tight">${formatRupiah(totalPrice)}</span>
          <button type="button" onclick="copyToClipboard('${totalPrice}', 'Nominal Transfer')" class="p-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-100 transition" title="Salin Nominal">📋</button>
        </div>
        <p class="text-[11px] text-emerald-700 mt-2 leading-relaxed">
          *Harap transfer <b>TEPAT SEJUMLAH INI</b> (termasuk kode unik <b>${uniqueCode}</b>) agar pesanan dapat diverifikasi secara kilat.
        </p>
      </div>

      <!-- Pilihan Rekening & E-Wallet -->
      <div>
        <p class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pilih Rekening Tujuan:</p>
        <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          <!-- BSI -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-400 transition">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">${acc.bsi.icon}</span>
              <div>
                <h5 class="font-bold text-xs text-slate-900">${acc.bsi.bankName}</h5>
                <p class="text-[11px] text-slate-500">A/N: <b>${acc.bsi.accountName}</b></p>
              </div>
            </div>
            <button type="button" onclick="copyToClipboard('${acc.bsi.accountNo}', 'No Rekening BSI')" class="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-mono font-bold text-xs py-1 px-2.5 rounded-lg border border-slate-200 transition">
              ${acc.bsi.accountNo} 📋
            </button>
          </div>

          <!-- BCA -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-400 transition">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">${acc.bca.icon}</span>
              <div>
                <h5 class="font-bold text-xs text-slate-900">${acc.bca.bankName}</h5>
                <p class="text-[11px] text-slate-500">A/N: <b>${acc.bca.accountName}</b></p>
              </div>
            </div>
            <button type="button" onclick="copyToClipboard('${acc.bca.accountNo}', 'No Rekening BCA')" class="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-mono font-bold text-xs py-1 px-2.5 rounded-lg border border-slate-200 transition">
              ${acc.bca.accountNo} 📋
            </button>
          </div>

          <!-- DANA -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-400 transition">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">${acc.dana.icon}</span>
              <div>
                <h5 class="font-bold text-xs text-slate-900">${acc.dana.bankName}</h5>
                <p class="text-[11px] text-slate-500">A/N: <b>${acc.dana.accountName}</b></p>
              </div>
            </div>
            <button type="button" onclick="copyToClipboard('${acc.dana.accountNo}', 'Nomor DANA')" class="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-mono font-bold text-xs py-1 px-2.5 rounded-lg border border-slate-200 transition">
              ${acc.dana.accountNo} 📋
            </button>
          </div>
        </div>
      </div>

      <!-- Langkah Konfirmasi -->
      <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 leading-relaxed">
        <b>📌 Cara Konfirmasi:</b><br>
        1. Transfer sesuai nominal di atas.<br>
        2. Klik tombol hijau <b>"Konfirmasi via WhatsApp"</b> untuk membuka chat otomatis ke Admin SRPCOM.
      </div>
    </div>
  `;

  Swal.fire({
    title: 'Konfirmasi Pesanan',
    html: modalHtml,
    showCancelButton: true,
    confirmButtonText: '💬 Konfirmasi via WhatsApp',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#64748b',
    customClass: { popup: 'srpcom-modal' }
  }).then((res) => {
    if (res.isConfirmed) {
      setTrxLock(30);

      // Siapkan Pesan WhatsApp Otomatis yang Rapi
      const waMsg = [
        `Halo Admin *${SRPCOM_CONFIG.storeName}*, saya ingin konfirmasi pesanan:`,
        ``,
        `• No. Referensi : *${orderRef}*`,
        `• Layanan/Produk: *${product.name}*`,
        `• No. Tujuan    : *${customerNo}*`,
        `• Total Bayar   : *${formatRupiah(totalPrice)}*`,
        ``,
        `Mohon segera diproses ya Admin. Terima kasih!`
      ].join('\n');

      const waUrl = `https://wa.me/${SRPCOM_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');

      // Kirim order ke backend Google Apps Script secara asynchronous (jika aktif)
      if (SRPCOM_CONFIG.gasApiUrl) {
        sendOrderToGAS({
          orderRef,
          productCode: product.code,
          productName: product.name,
          customerNo,
          price: product.price,
          uniqueCode,
          totalPrice,
          category: product.category,
          status: 'PENDING'
        });
      }
    }
  });
}

// 13. KIRIM DATA KE GOOGLE APPS SCRIPT (GAS)
async function sendOrderToGAS(orderData) {
  try {
    const res = await fetch(SRPCOM_CONFIG.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createOrder',
        ...orderData
      })
    });
    const result = await res.json();
    console.log('[SRPCOM] Respon GAS Order:', result);
  } catch (err) {
    console.error('[SRPCOM] Gagal mengirim order ke GAS:', err.message);
  }
}

// 14. COPY TO CLIPBOARD HELPER
window.copyToClipboard = function(text, label = 'Data') {
  navigator.clipboard.writeText(text).then(() => {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).fire({
      icon: 'success',
      title: `${label} berhasil disalin!`
    });
  }).catch(() => {
    alert(`${label}: ${text}`);
  });
};

// 15. ANTI DOUBLE-CLICK / IDEMPOTENCY SYSTEM (30 DETIK)
function setTrxLock(seconds = 30) {
  try {
    const expireAt = Date.now() + (seconds * 1000);
    localStorage.setItem(TRX_LOCK_KEY, String(expireAt));
  } catch (e) {}
  checkTrxLockState();
}

function getTrxRemainingSeconds() {
  try {
    const expireAt = parseInt(localStorage.getItem(TRX_LOCK_KEY) || '0', 10);
    const diff = Math.ceil((expireAt - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  } catch (e) {
    return 0;
  }
}

function isTrxLocked() {
  return getTrxRemainingSeconds() > 0;
}

function checkTrxLockState() {
  if (trxLockInterval) clearInterval(trxLockInterval);

  const tick = () => {
    const remaining = getTrxRemainingSeconds();
    const notice = document.getElementById('trxLockNotice');
    const badge = document.getElementById('trxLockTimerBadge');

    if (remaining <= 0) {
      if (notice) notice.classList.add('hidden');
      updateAllButtonsLockState(0);
      clearInterval(trxLockInterval);
      trxLockInterval = null;
      return;
    }

    if (notice) notice.classList.remove('hidden');
    if (badge) badge.innerText = remaining + 's';
    updateAllButtonsLockState(remaining);
  };

  tick();
  trxLockInterval = setInterval(tick, 1000);
}

function updateAllButtonsLockState(remaining = 0) {
  const isLocked = remaining > 0;
  document.querySelectorAll('.btn-buy-product').forEach(btn => {
    if (isLocked) {
      btn.disabled = true;
      btn.classList.remove('bg-sky-600', 'hover:bg-sky-500', 'cursor-pointer');
      btn.classList.add('bg-slate-300', 'text-slate-600', 'cursor-not-allowed');
      btn.innerText = `⏳ Tunggu (${remaining}s)`;
    } else {
      btn.disabled = false;
      btn.classList.add('bg-sky-600', 'hover:bg-sky-500', 'cursor-pointer');
      btn.classList.remove('bg-slate-300', 'text-slate-600', 'cursor-not-allowed');
      btn.innerText = 'Beli Sekarang';
    }
  });
}
