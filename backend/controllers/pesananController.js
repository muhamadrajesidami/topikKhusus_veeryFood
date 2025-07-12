const { Pesanan, PesananItem, Menu } = require('../models');

exports.getAllPesanan = async (req, res) => {
  try {
    const pesanan = await Pesanan.findAll({
      include: [PesananItem],
      order: [['waktu_pesanan', 'DESC']]
    });
    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPesananById = async (req, res) => {
  try {
    const pesanan = await Pesanan.findByPk(req.params.id, {
      include: [PesananItem]
    });
    if (!pesanan) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPesanan = async (req, res) => {
  try {
    const { nama_pelanggan, nomor_meja, metode_pembayaran, status_pembayaran, items } = req.body;
    let total = 0;
    for (const item of items) {
      total += item.harga * item.jumlah;
    }
    const pesanan = await Pesanan.create({
      nama_pelanggan,
      nomor_meja,
      metode_pembayaran,
      status_pembayaran,
      total,
      waktu_pesanan: new Date()
    });
    for (const item of items) {
      await PesananItem.create({
        pesanan_id: pesanan.id,
        menu_id: item.menu_id,
        nama: item.nama,
        harga: item.harga,
        jumlah: item.jumlah
      });
      // Debug log
      console.log('Kurangi stok menu:', item.menu_id, 'jumlah:', item.jumlah);
      const menu = await Menu.findByPk(item.menu_id);
      if (menu) {
        menu.stok = Math.max(0, menu.stok - item.jumlah);
        await menu.save();
        console.log('Stok baru menu', menu.id, ':', menu.stok);
      } else {
        console.log('Menu tidak ditemukan:', item.menu_id);
      }
    }
    const pesananBaru = await Pesanan.findByPk(pesanan.id, { include: [PesananItem] });
    res.status(201).json(pesananBaru);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.bayarPesanan = async (req, res) => {
  try {
    const pesanan = await Pesanan.findByPk(req.params.id);
    if (!pesanan) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    await pesanan.update({ status_pembayaran: 'Paid' });
    res.json(pesanan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 