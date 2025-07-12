const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');

router.get('/', kategoriController.getAllKategori);
router.post('/', kategoriController.createKategori);
router.delete('/:id', kategoriController.deleteKategori);

module.exports = router; 