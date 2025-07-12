const { Pesanan } = require('../models');

exports.getNotifikasi = async (req, res) => {
  try {
    // Pesanan dengan status Unpaid dianggap sebagai notifikasi
    const pesananBaru = await Pesanan.findAll({ where: { status_pembayaran: 'Unpaid' }, order: [['waktu_pesanan', 'DESC']] });
    res.json({ jumlah: pesananBaru.length, pesanan: pesananBaru });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 