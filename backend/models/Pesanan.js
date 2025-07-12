const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pesanan = sequelize.define('Pesanan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama_pelanggan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_meja: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metode_pembayaran: {
    type: DataTypes.ENUM('Cash', 'QRIS'),
    allowNull: false,
  },
  status_pembayaran: {
    type: DataTypes.ENUM('Paid', 'Unpaid'),
    allowNull: false,
    defaultValue: 'Unpaid',
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  waktu_pesanan: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pesanan',
  timestamps: false,
});

module.exports = Pesanan; 