const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

router.get('/', pesananController.getAllPesanan);
router.get('/:id', pesananController.getPesananById);
router.post('/', pesananController.createPesanan);
router.put('/:id/bayar', pesananController.bayarPesanan);

module.exports = router; 