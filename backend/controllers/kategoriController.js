const { Kategori } = require('../models');

exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findAll();
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createKategori = async (req, res) => {
  try {
    const { nama } = req.body;
    const kategori = await Kategori.create({ nama });
    res.status(201).json(kategori);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    await kategori.destroy();
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 