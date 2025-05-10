//TO DO 
const express = require('express');
const { getAllPeminjaman, getPeminjamanByUserId, createPeminjaman, deletePeminjaman, updateStatusPeminjaman, getPeminjamanByRuanganId } = require('../controller/peminjamanController');
const router = express.Router();
const { authorizeAdmin } = require('../middleware/auth');

router.get('/', authorizeAdmin, getAllPeminjaman);
router.get('/getPeminjamanByUserId', getPeminjamanByUserId);
router.get('/getPeminjamanByRuanganId/:idRuangan', getPeminjamanByRuanganId);
router.post('/create', createPeminjaman);
router.patch('/updateStatus/:idPeminjaman', authorizeAdmin, updateStatusPeminjaman);
router.delete('/delete/:idPeminjaman', deletePeminjaman);

module.exports = router;