const { Meja } = require('../models');

exports.getAllMeja = async (req, res) => {
  try {
    const meja = await Meja.findAll();
    res.json(meja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMeja = async (req, res) => {
  try {
    const { nomor } = req.body;
    const meja = await Meja.create({ nomor });
    res.status(201).json(meja);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMeja = async (req, res) => {
  try {
    const meja = await Meja.findByPk(req.params.id);
    if (!meja) return res.status(404).json({ error: 'Meja tidak ditemukan' });
    await meja.destroy();
    res.json({ message: 'Meja berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 