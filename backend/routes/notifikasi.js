const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');

router.get('/', notifikasiController.getNotifikasi);

module.exports = router; 