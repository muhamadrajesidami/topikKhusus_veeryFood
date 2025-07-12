const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PesananItem = sequelize.define('PesananItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pesanan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'pesanan_item',
  timestamps: false,
});

module.exports = PesananItem; 