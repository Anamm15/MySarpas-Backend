const { PrismaClient } = require('@prisma/client');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const uuid = require('uuid');

const prisma = new PrismaClient();

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
    const { namaRuangan, kapasitas } = req.body;
    try {
        const newRuangan = await prisma.ruangan.create({
            data: {
                idRuangan: uuid.v4(),
                namaRuangan,
                kapasitas,
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
    const { idRuangan } = req.params;
    const { namaRuangan, kapasitas } = req.body;
    try {
        const updatedRuangan = await prisma.ruangan.update({
            where: { idRuangan },
            data: {
                namaRuangan,
                kapasitas,
            },
        });
        res.status(200).json(updatedRuangan);
    } catch (error) {
        console.error('Error updating ruangan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRuangans,
    getRuangansBySearch,
    createRuangan,
    updateRuangan
};