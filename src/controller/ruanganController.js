const { PrismaClient } = require('@prisma/client');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const prisma = new PrismaClient();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/ruangan/');
    },
    filename: (req, file, cb) => {
        const uniqueName = uuid.v4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Filter jenis file (opsional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};
const upload = multer({ storage: storage, fileFilter }).single('gambar');

// Get all ruangan
const getAllRuangans = async (req, res) => {
    try {
        const ruangans = await prisma.ruangan.findMany();
        res.status(200).json(ruangans);
    } catch (error) {
        console.error('Error fetching ruangans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get ruangan by namaRuangan search
const getRuangansBySearch = async (req, res) => {
    const { namaRuangan } = req.query;

    try {
        const ruangans = await prisma.ruangan.findMany({
            where: {
                namaRuangan: {
                    contains: namaRuangan,
                    mode: 'insensitive'
                }
            },
        });

        if (ruangans.length === 0) {
            return res.status(404).json({
                message: 'Ruangan tidak ditemukan'
            });
        }

        res.status(200).json(ruangans);
    } catch (error) {
        console.error('Error fetching ruangans:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// Post create ruangan
const createRuangan = async (req, res) => {
    const { namaRuangan, kapasitas, fasilitas, deskripsi, Gedung } = req.body;
    const fileGambar = req.file ? req.file.filename : null;

    try {
        const newRuangan = await prisma.ruangan.create({
            data: {
                namaRuangan,
                kapasitas: parseInt(kapasitas),
                fasilitas,
                deskripsi,
                Gedung,
                gambar: fileGambar, // hanya nama file
            },
        });
        res.status(201).json(newRuangan);
    } catch (error) {
        console.error('Error creating ruangan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Patch update ruangan
const updateRuangan = async (req, res) => {
    const idRuangan = parseInt(req.params.idRuangan, 10);
    const { namaRuangan, fasilitas, deskripsi, Gedung, gambar } = req.body;
    const fileGambar = req.file ? req.file.filename : null;

    try {
        const dataToUpdate = {};
        if (namaRuangan !== undefined) dataToUpdate.namaRuangan = namaRuangan;
        if (req.body.kapasitas !== undefined && req.body.kapasitas !== '') {
            const kapasitas = parseInt(req.body.kapasitas, 10);
            if (!isNaN(kapasitas)) dataToUpdate.kapasitas = kapasitas;
        }
        if (fasilitas !== undefined) dataToUpdate.fasilitas = fasilitas;
        if (deskripsi !== undefined) dataToUpdate.deskripsi = deskripsi;
        if (Gedung !== undefined) dataToUpdate.Gedung = Gedung;
        if (fileGambar) dataToUpdate.gambar = fileGambar;

        await prisma.ruangan.update({
            where: { idRuangan },
            data: dataToUpdate,
        });
        res.status(200).json(updateRuangan);
    } catch (error) {
        console.error('Error updating ruangan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRuangans,
    getRuangansBySearch,
    createRuangan,
    updateRuangan,
    upload,
};