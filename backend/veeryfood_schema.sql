-- SQL Schema VeeryFood
-- Database name "veryfooddd"

CREATE TABLE kasir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  kategori ENUM('makanan', 'minuman') NOT NULL,
  terlaris BOOLEAN DEFAULT FALSE,
  gambar VARCHAR(255),
  ketersediaan BOOLEAN DEFAULT TRUE
);

CREATE TABLE pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pelanggan VARCHAR(100) NOT NULL,
  nomor_meja VARCHAR(10) NOT NULL,
  metode_pembayaran ENUM('Cash', 'QRIS') NOT NULL,
  status_pembayaran ENUM('Paid', 'Unpaid') NOT NULL DEFAULT 'Unpaid',
  total INT NOT NULL,
  waktu_pesanan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pesanan_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pesanan_id INT NOT NULL,
  menu_id INT NOT NULL,
  nama VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  jumlah INT NOT NULL,
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menu(id)
); 
