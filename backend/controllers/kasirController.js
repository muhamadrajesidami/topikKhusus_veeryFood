const { Kasir } = require('../models');
const bcrypt = require('bcrypt');

exports.getAllKasir = async (req, res) => {
  try {
    const kasir = await Kasir.findAll({ attributes: { exclude: ['password'] } });
    res.json(kasir);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createKasir = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const kasir = await Kasir.create({ username, password: hashedPassword });
    res.status(201).json({ id: kasir.id, username: kasir.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateKasir = async (req, res) => {
  try {
    const kasir = await Kasir.findByPk(req.params.id);
    if (!kasir) return res.status(404).json({ error: 'Kasir tidak ditemukan' });
    const { username, password } = req.body;
    if (username) kasir.username = username;
    if (password) {
      kasir.password = await bcrypt.hash(password, 10);
    }
    await kasir.save();
    res.json({ id: kasir.id, username: kasir.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteKasir = async (req, res) => {
  try {
    const kasir = await Kasir.findByPk(req.params.id);
    if (!kasir) return res.status(404).json({ error: 'Kasir tidak ditemukan' });
    await kasir.destroy();
    res.json({ message: 'Kasir berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const kasir = await Kasir.findByPk(req.params.id);
    if (!kasir) return res.status(404).json({ error: 'Kasir tidak ditemukan' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password baru harus diisi' });
    kasir.password = await bcrypt.hash(password, 10);
    await kasir.save();
    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 