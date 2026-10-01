/**
 * ==============================================================================
 * TOKO SRPCOM - BACKEND GOOGLE APPS SCRIPT (Code.gs)
 * API RESTful untuk Katalog Produk, Pencatatan Order & Upload ke Google Drive
 * ==============================================================================
 */

// 1. KONFIGURASI GLOBAL
// Jika script dibuat standalone (terpisah dari sheet), isi ID spreadsheet di bawah.
// Jika script dibuat via Extensions > Apps Script di Google Sheets, biarkan kosong.
const CONFIG = {
  SPREADSHEET_ID: '', // Contoh: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' (opsional)
  DRIVE_FOLDER_NAME: 'Bukti Transfer Toko SRPCOM',
  SHEET_PRODUCTS: 'Produk',
  SHEET_ORDERS: 'Orders'
};

/**
 * Helper untuk mendapatkan instance Spreadsheet
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Helper untuk membuat response JSON dengan header CORS
 */
function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * ==============================================================================
 * ENDPOINT GET (doGet)
 * ==============================================================================
 * Digunakan oleh frontend GitHub Pages untuk:
 * 1. Mengambil katalog produk aktif (?action=getProducts)
 * 2. Cek status order berdasarkan No. Ref (?action=checkOrder&ref=SRP-123456)
 * 3. Ping status server (?action=ping)
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'getProducts';

    if (action === 'ping') {
      return createJsonResponse({
        status: 'success',
        message: 'Toko SRPCOM API aktif dan siap melayani!',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getProducts') {
      const ss = getSpreadsheet();
      let sheet = ss.getSheetByName(CONFIG.SHEET_PRODUCTS);

      if (!sheet) {
        setupDatabase();
        sheet = ss.getSheetByName(CONFIG.SHEET_PRODUCTS);
      }

      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return createJsonResponse({ status: 'success', data: [] });
      }

      const headers = rows[0];
      const products = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const status = String(row[6] || '').trim().toLowerCase();
        
        // Hanya tampilkan produk yang aktif
        if (status === 'aktif' || status === '1' || status === 'true' || status === '') {
          products.push({
            code: String(row[0] || ''),
            name: String(row[1] || ''),
            category: String(row[2] || '').toLowerCase(),
            brand: String(row[3] || '').toUpperCase(),
            price: Number(row[4]) || 0,
            desc: String(row[5] || ''),
            status: 'Aktif'
          });
        }
      }

      return createJsonResponse({
        status: 'success',
        count: products.length,
        data: products
      });
    }

    if (action === 'checkOrder') {
      const ref = (params.ref || '').trim();
      if (!ref) {
        return createJsonResponse({ status: 'error', message: 'Parameter ref diperlukan.' });
      }

      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName(CONFIG.SHEET_ORDERS);
      if (!sheet) {
        return createJsonResponse({ status: 'error', message: 'Tabel Orders belum ada.' });
      }

      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][1]) === ref) {
          return createJsonResponse({
            status: 'success',
            order: {
              timestamp: rows[i][0],
              orderRef: rows[i][1],
              productName: rows[i][2],
              customerNo: rows[i][3],
              totalPrice: rows[i][6],
              paymentMethod: rows[i][7],
              proofUrl: rows[i][8],
              status: rows[i][9]
            }
          });
        }
      }

      return createJsonResponse({ status: 'not_found', message: 'Order tidak ditemukan.' });
    }

    return createJsonResponse({ status: 'error', message: 'Action tidak dikenali: ' + action });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * ==============================================================================
 * ENDPOINT POST (doPost)
 * ==============================================================================
 * Digunakan oleh frontend untuk:
 * 1. Mencatat pesanan baru ke Sheet Orders (action: 'createOrder')
 * 2. Upload file bukti bayar base64 ke Google Drive (action: 'uploadProof')
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback jika dikirim via URL encoded
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'createOrder';

    // AKSI 1: BUAT PESANAN BARU KE SHEET ORDERS
    if (action === 'createOrder') {
      const ss = getSpreadsheet();
      let sheet = ss.getSheetByName(CONFIG.SHEET_ORDERS);

      if (!sheet) {
        setupDatabase();
        sheet = ss.getSheetByName(CONFIG.SHEET_ORDERS);
      }

      const timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
      const orderRef = payload.orderRef || ('SRP-' + Date.now().toString().slice(-6));
      const productName = payload.productName || '-';
      const customerNo = payload.customerNo || '-';
      const price = Number(payload.price) || 0;
      const uniqueCode = Number(payload.uniqueCode) || 0;
      const totalPrice = Number(payload.totalPrice) || (price + uniqueCode);
      const paymentMethod = payload.paymentMethod || 'Manual Transfer / QRIS';
      const proofUrl = payload.proofUrl || '-';
      const status = payload.status || 'PENDING';
      const notes = payload.notes || 'Order dari Web GitHub Pages';

      sheet.appendRow([
        timestamp,
        orderRef,
        productName,
        customerNo,
        price,
        uniqueCode,
        totalPrice,
        paymentMethod,
        proofUrl,
        status,
        notes
      ]);

      return createJsonResponse({
        status: 'success',
        message: 'Pesanan berhasil dicatat di database Google Sheets!',
        orderRef: orderRef,
        totalPrice: totalPrice
      });
    }

    // AKSI 2: UPLOAD BUKTI TRANSFER KE GOOGLE DRIVE
    if (action === 'uploadProof') {
      const orderRef = (payload.orderRef || 'ORDER').replace(/[^a-zA-Z0-9_-]/g, '');
      const base64Data = payload.fileBase64 || '';
      const originalName = payload.fileName || 'bukti_transfer.jpg';
      const mimeType = payload.mimeType || 'image/jpeg';

      if (!base64Data) {
        return createJsonResponse({ status: 'error', message: 'Data file base64 tidak boleh kosong.' });
      }

      // Bersihkan prefix data URL jika ada (misal: "data:image/png;base64,")
      const pureBase64 = base64Data.indexOf(',') > -1 ? base64Data.split(',')[1] : base64Data;
      const decodedBytes = Utilities.base64Decode(pureBase64);

      // Cari atau buat folder di Google Drive
      const folder = getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME);
      const ext = originalName.split('.').pop() || 'jpg';
      const newFileName = `${orderRef}_${Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd_HHmmss')}.${ext}`;

      const blob = Utilities.newBlob(decodedBytes, mimeType, newFileName);
      const file = folder.createFile(blob);

      // Set permission agar file bisa dilihat oleh Admin/Owner
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      const fileUrl = file.getUrl();

      // Perbarui link bukti di Sheet Orders jika orderRef sudah ada
      if (orderRef) {
        updateOrderProofUrl(orderRef, fileUrl);
      }

      return createJsonResponse({
        status: 'success',
        message: 'Bukti transfer berhasil disimpan di Google Drive!',
        fileUrl: fileUrl,
        fileName: newFileName
      });
    }

    return createJsonResponse({ status: 'error', message: 'Aksi POST tidak valid: ' + action });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Cari atau buat folder di root Google Drive
 */
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

/**
 * Perbarui kolom Link Bukti Bayar pada Sheet Orders
 */
function updateOrderProofUrl(orderRef, fileUrl) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_ORDERS);
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]) === String(orderRef)) {
        // Kolom 9 adalah Link Bukti Bayar (Indeks baris i+1, kolom 9)
        sheet.getRange(i + 1, 9).setValue(fileUrl);
        sheet.getRange(i + 1, 10).setValue('MENUNGGU VERIFIKASI');
        break;
      }
    }
  } catch (e) {
    console.error('Gagal update link bukti di sheet:', e.message);
  }
}

/**
 * ==============================================================================
 * AUTO-SETUP DATABASE GOOGLE SHEETS
 * ==============================================================================
 * Jalankan fungsi ini SEKALI di editor Apps Script untuk membuat tabel
 * 'Produk' dan 'Orders' secara otomatis lengkap dengan data awal!
 */
function setupDatabase() {
  const ss = getSpreadsheet();

  // 1. SETUP TABEL PRODUK
  let prodSheet = ss.getSheetByName(CONFIG.SHEET_PRODUCTS);
  if (!prodSheet) {
    prodSheet = ss.insertSheet(CONFIG.SHEET_PRODUCTS);
  }

  // Header Produk
  const prodHeaders = ['Kode Produk', 'Nama Produk', 'Kategori', 'Brand', 'Harga Jual', 'Deskripsi', 'Status'];
  prodSheet.getRange(1, 1, 1, prodHeaders.length).setValues([prodHeaders]);
  prodSheet.getRange(1, 1, 1, prodHeaders.length)
    .setBackground('#0284c7')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Isi Data Awal jika kosong
  if (prodSheet.getLastRow() <= 1) {
    const initialProducts = [
      ['TSEL5', 'Telkomsel 5.000', 'pulsa', 'TELKOMSEL', 6200, 'Masa aktif +7 hari', 'Aktif'],
      ['TSEL10', 'Telkomsel 10.000', 'pulsa', 'TELKOMSEL', 11200, 'Masa aktif +15 hari', 'Aktif'],
      ['TSEL25', 'Telkomsel 25.000', 'pulsa', 'TELKOMSEL', 25750, 'Masa aktif +30 hari', 'Aktif'],
      ['TSEL50', 'Telkomsel 50.000', 'pulsa', 'TELKOMSEL', 50500, 'Masa aktif +45 hari', 'Aktif'],
      ['TSEL100', 'Telkomsel 100.000', 'pulsa', 'TELKOMSEL', 99500, 'Masa aktif +60 hari', 'Aktif'],
      ['ISAT5', 'Indosat IM3 5.000', 'pulsa', 'INDOSAT', 6150, 'Masa aktif +7 hari', 'Aktif'],
      ['ISAT10', 'Indosat IM3 10.000', 'pulsa', 'INDOSAT', 11150, 'Masa aktif +15 hari', 'Aktif'],
      ['ISAT25', 'Indosat IM3 25.000', 'pulsa', 'INDOSAT', 25600, 'Masa aktif +30 hari', 'Aktif'],
      ['XL5', 'XL Axiata 5.000', 'pulsa', 'XL', 6200, 'Masa aktif +7 hari', 'Aktif'],
      ['XL10', 'XL Axiata 10.000', 'pulsa', 'XL', 11200, 'Masa aktif +15 hari', 'Aktif'],
      ['AX5', 'Axis 5.000', 'pulsa', 'AXIS', 6150, 'Masa aktif +7 hari', 'Aktif'],
      ['AX10', 'Axis 10.000', 'pulsa', 'AXIS', 11150, 'Masa aktif +15 hari', 'Aktif'],
      ['TRI5', 'Tri (3) 5.000', 'pulsa', 'TRI', 6100, 'Masa aktif +7 hari', 'Aktif'],
      ['TRI10', 'Tri (3) 10.000', 'pulsa', 'TRI', 11100, 'Masa aktif +15 hari', 'Aktif'],
      ['SMART10', 'Smartfren 10.000', 'pulsa', 'SMARTFREN', 11200, 'Masa aktif +15 hari', 'Aktif'],
      ['BYU10', 'By.U 10.000', 'pulsa', 'BYU', 11200, 'Pulsa hemat By.U', 'Aktif'],
      ['DATA-TSEL-3GB', 'Telkomsel Data 3.5GB 5 Hari', 'data', 'TELKOMSEL', 18500, 'Kuota Nasional 24 Jam', 'Aktif'],
      ['DATA-TSEL-10GB', 'Telkomsel Data 10GB 30 Hari', 'data', 'TELKOMSEL', 48500, 'Kuota Utama Flash', 'Aktif'],
      ['PLN20', 'Token PLN Rp 20.000', 'pln', 'PLN', 21500, 'Stroom PLN 20 Digit', 'Aktif'],
      ['PLN50', 'Token PLN Rp 50.000', 'pln', 'PLN', 51500, 'Stroom PLN 20 Digit', 'Aktif'],
      ['PLN100', 'Token PLN Rp 100.000', 'pln', 'PLN', 101500, 'Stroom PLN 20 Digit', 'Aktif'],
      ['DANA10', 'Saldo DANA 10.000', 'ewallet', 'DANA', 11250, 'Top Up DANA Instant', 'Aktif'],
      ['DANA50', 'Saldo DANA 50.000', 'ewallet', 'DANA', 51250, 'Top Up DANA Instant', 'Aktif'],
      ['SHOPEE10', 'ShopeePay 10.000', 'ewallet', 'SHOPEEPAY', 11200, 'Top Up ShopeePay', 'Aktif'],
      ['ML86', 'Mobile Legends 86 DM', 'game', 'GAME', 21500, 'Top Up MLBB Diamond', 'Aktif'],
      ['FF140', 'Free Fire 140 DM', 'game', 'GAME', 19500, 'Top Up Free Fire', 'Aktif'],
      ['SRP-WEB', 'Jasa Pembuatan Web & Hosting', 'srpcom', 'SRPCOM', 250000, 'Website Toko & Portofolio', 'Aktif'],
      ['SRP-BOT', 'Setup Bot WhatsApp/Telegram', 'srpcom', 'SRPCOM', 150000, 'Integrasi Sheets & Notifikasi', 'Aktif']
    ];
    prodSheet.getRange(2, 1, initialProducts.length, prodHeaders.length).setValues(initialProducts);
  }
  prodSheet.autoResizeColumns(1, prodHeaders.length);

  // 2. SETUP TABEL ORDERS
  let orderSheet = ss.getSheetByName(CONFIG.SHEET_ORDERS);
  if (!orderSheet) {
    orderSheet = ss.insertSheet(CONFIG.SHEET_ORDERS);
  }

  // Header Orders
  const orderHeaders = [
    'Waktu Transaksi',
    'No. Referensi',
    'Nama Produk',
    'No. Tujuan / ID',
    'Harga Dasar',
    'Kode Unik',
    'Total Bayar',
    'Metode Bayar',
    'Link Bukti Bayar (Google Drive)',
    'Status Order',
    'Catatan Admin'
  ];
  orderSheet.getRange(1, 1, 1, orderHeaders.length).setValues([orderHeaders]);
  orderSheet.getRange(1, 1, 1, orderHeaders.length)
    .setBackground('#10b981')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  orderSheet.autoResizeColumns(1, orderHeaders.length);

  // Buat folder Google Drive jika belum ada
  getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME);

  SpreadsheetApp.getActiveSpreadsheet().toast('Database Toko SRPCOM dan Folder Google Drive Berhasil Disiapkan!', 'Sukses', 5);
}
