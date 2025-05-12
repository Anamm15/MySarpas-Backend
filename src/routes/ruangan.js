//TO DO 
const express = require('express');
const ruanganController = require('../controller/ruanganController');
const router = express.Router();

router.get('/', ruanganController.getAllRuangans);
router.get('/search', ruanganController.getRuangansBySearch);
router.post('/', ruanganController.createRuangan);
router.patch('/:idRuangan', ruanganController.updateRuangan);

module.exports = router;