const express = require('express');
const router = express.Router();
const kasirController = require('../controllers/kasirController');

router.get('/', kasirController.getAllKasir);
router.post('/', kasirController.createKasir);
router.put('/:id', kasirController.updateKasir);
router.delete('/:id', kasirController.deleteKasir);
router.put('/:id/password', kasirController.changePassword);

module.exports = router; 