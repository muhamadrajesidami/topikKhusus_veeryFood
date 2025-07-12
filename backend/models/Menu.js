const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kategori: {
    type: DataTypes.ENUM('makanan', 'minuman'),
    allowNull: false,
  },
  terlaris: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'menu',
  timestamps: false,
});

module.exports = Menu; 