//TO DO 
const express = require('express');
const ruanganController = require('../controller/ruanganController');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', ruanganController.getAllRuangans);
router.get('/search', ruanganController.getRuangansBySearch);
router.post('/', auth.authorizeAdmin, ruanganController.upload, ruanganController.createRuangan);
router.patch('/:idRuangan', auth.authorizeAdmin, ruanganController.upload, ruanganController.updateRuangan);

module.exports = router;