const { Pesanan } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

exports.laporanPenjualan = async (req, res) => {
  try {
    const { start, end } = req.query;
    let where = {};
    if (start && end) {
      where.waktu_pesanan = { [Op.between]: [start, end] };
    }
    const pesanan = await Pesanan.findAll({ where });
    const totalTransaksi = pesanan.length;
    const totalPenjualan = pesanan.reduce((sum, p) => sum + p.total, 0);
    res.json({ totalTransaksi, totalPenjualan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportPenjualanCSV = async (req, res) => {
  try {
    const { start, end } = req.query;
    let where = {};
    if (start && end) {
      where.waktu_pesanan = { [Op.between]: [start, end] };
    }
    const pesanan = await Pesanan.findAll({ where });
    const fields = ['id', 'nama_pelanggan', 'nomor_meja', 'metode_pembayaran', 'status_pembayaran', 'total', 'waktu_pesanan'];
    const parser = new Parser({ fields });
    const csv = parser.parse(pesanan.map(p => p.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment('laporan_penjualan.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.laporanTransaksi = async (req, res) => {
  try {
    const { start, end } = req.query;
    let where = {};
    if (start && end) {
      where.waktu_pesanan = { [Op.between]: [start, end] };
    }
    const pesanan = await Pesanan.findAll({
      where,
      order: [['waktu_pesanan', 'DESC']]
    });
    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 