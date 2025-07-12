const { Menu } = require('../models');
const { Op } = require('sequelize');

exports.getAllMenu = async (req, res) => {
  try {
    const { kategori, tersedia, search } = req.query;
    let where = {};
    if (kategori) where.kategori = kategori;
    if (tersedia !== undefined) where.ketersediaan = tersedia === 'true';
    if (search) where.nama = { [Op.like]: `%${search}%` };
    const menu = await Menu.findAll({ where });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    await menu.update(req.body);
    res.json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    await menu.destroy();
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Menu tidak bisa dihapus karena sudah pernah dipesan.' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.uploadGambarMenu = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    if (!req.file) return res.status(400).json({ error: 'File gambar tidak ditemukan' });
    menu.gambar = req.file.filename;
    await menu.save();
    res.json({ message: 'Gambar menu berhasil diupload', gambar: menu.gambar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 