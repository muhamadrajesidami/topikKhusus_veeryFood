const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meja = sequelize.define('Meja', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomor: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'meja',
  timestamps: false,
});

module.exports = Meja; 