const { Kasir } = require('../models');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const kasir = await Kasir.findOne({ where: { username } });
    if (!kasir) return res.status(401).json({ error: 'Username salah' });
    const isMatch = await bcrypt.compare(password, kasir.password);
    if (!isMatch) return res.status(401).json({ error: 'Password salah' });
    res.json({ message: 'Login berhasil', kasir: { id: kasir.id, username: kasir.username } });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}; 