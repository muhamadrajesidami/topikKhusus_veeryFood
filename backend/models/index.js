const Menu = require('./Menu');
const Pesanan = require('./Pesanan');
const PesananItem = require('./PesananItem');
const Kasir = require('./Kasir');
const Kategori = require('./Kategori');
const Meja = require('./Meja');

// Relasi: Pesanan memiliki banyak PesananItem
Pesanan.hasMany(PesananItem, { foreignKey: 'pesanan_id' });
PesananItem.belongsTo(Pesanan, { foreignKey: 'pesanan_id' });

// Relasi: PesananItem mengacu ke Menu
Menu.hasMany(PesananItem, { foreignKey: 'menu_id' });
PesananItem.belongsTo(Menu, { foreignKey: 'menu_id' });

module.exports = {
  Menu,
  Pesanan,
  PesananItem,
  Kasir,
  Kategori,
  Meja,
}; 