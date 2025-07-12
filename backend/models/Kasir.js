const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kasir = sequelize.define('Kasir', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'kasir',
  timestamps: false,
});

module.exports = Kasir; 