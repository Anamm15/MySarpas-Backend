const { PrismaClient } = require('@prisma/client');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const uuid = require('uuid');

const prisma = new PrismaClient();

// Get all ruangan
const getAllRuangans = async (req, res) => {
  try {
    const ruangans = await prisma.ruangan.findMany({
      orderBy: {
        idRuangan: 'asc',
      },
    });
    res.status(200).json({ data: ruangans });
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
          mode: 'insensitive',
        },
      },
    });

    if (ruangans.length === 0) {
      return res.status(404).json({
        error: 'Ruangan tidak ditemukan',
      });
    }

    res.status(200).json({ data: ruangans });
  } catch (error) {
    console.error('Error fetching ruangans:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};

// Post create ruangan
const createRuangan = async (req, res) => {
  const { namaRuangan, kapasitas } = req.body;
  try {
    const newRuangan = await prisma.ruangan.create({
      data: {
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
  const idRuanganInt = parseInt(idRuangan);
  try {
    const updatedRuangan = await prisma.ruangan.update({
      where: { idRuangan: idRuanganInt },
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

const getJadwalAllRuangan = async (req, res) => {
  const { tanggal, idRuangan } = req.query;

  if (!tanggal) {
    return res.status(400).json({
      error: 'Tanggal harus disertakan dalam query parameter',
    });
  }

  let idFilter = undefined;
  if (idRuangan) {
    const ids = idRuangan
      .split(',')
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));
    if (ids.length > 0) {
      idFilter = { idRuangan: { in: ids } };
    }
  }

  try {
    const ruangan = await prisma.ruangan.findMany({
      where: idFilter,
      select: {
        idRuangan: true,
        namaRuangan: true,
        kapasitas: true,
        Peminjaman: {
          where: {
            tanggal: new Date(tanggal),
            status: 'approved',
          },
          orderBy: {
            jamAwal: 'asc',
          },
          select: {
            idPeminjaman: true,
            tanggal: true,
            jamAwal: true,
            jamAkhir: true,
            jenisKegiatan: true,
            deskripsi: true,
            status: true,
          },
        },
      },
      orderBy: {
        idRuangan: 'asc',
      },
    });

    return res.status(200).json({
      message: 'Jadwal peminjaman ruangan berhasil diambil',
      data: {
        tanggal: tanggal,
        ruangan,
      },
    });
  } catch (error) {
    console.error('Get jadwal peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllRuangans,
  getRuangansBySearch,
  createRuangan,
  updateRuangan,
  getJadwalAllRuangan,
};
