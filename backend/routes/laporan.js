const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.get('/penjualan', laporanController.laporanPenjualan);
router.get('/export', laporanController.exportPenjualanCSV);
router.get('/transaksi', laporanController.laporanTransaksi);

module.exports = router; 