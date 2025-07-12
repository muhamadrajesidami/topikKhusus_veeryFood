const express = require('express');
const sequelize = require('./config/database');
const { Menu, Pesanan, PesananItem } = require('./models');
const menuRoutes = require('./routes/menu');
const pesananRoutes = require('./routes/pesanan');
const authRoutes = require('./routes/auth');
const kasirRoutes = require('./routes/kasir');
const laporanRoutes = require('./routes/laporan');
const kategoriRoutes = require('./routes/kategori');
const mejaRoutes = require('./routes/meja');
const notifikasiRoutes = require('./routes/notifikasi');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend kasir siap!');
});

// TODO: Tambahkan route menu & pesanan
app.use('/menu', menuRoutes);
app.use('/pesanan', pesananRoutes);
app.use('/auth', authRoutes);
app.use('/kasir', kasirRoutes);
app.use('/laporan', laporanRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/meja', mejaRoutes);
app.use('/notifikasi', notifikasiRoutes);
app.use('/uploads', express.static('uploads'));

// Sync database dan jalankan server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
  });
}).catch((err) => {
  console.error('Gagal koneksi database:', err);
}); 