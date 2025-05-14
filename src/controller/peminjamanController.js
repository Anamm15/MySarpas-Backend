const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const timeFormatter = require('../utils/timeformat');
const sendEmail = require('../utils/sendEmail');

const getAllPeminjaman = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.per_page) || 10;
  const skip = (page - 1) * limit;
  const statusParam = req.query.status;
  const status = typeof statusParam === 'string' ? statusParam.split(',') : [];
  const keyword = req.query.keyword || '';
  const jenisKegiatanParam = req.query.jenisKegiatan;
  const jenisKegiatan =
    typeof jenisKegiatanParam === 'string' ? jenisKegiatanParam.split(',') : [];
  const sortParam = req.query.sort;
  const typeParam = req.query.type;
  const sortArray =
    typeof sortParam === 'string' ? sortParam.split(',') : ['tanggal'];
  const typeArray =
    typeof typeParam === 'string' ? typeParam.split(',') : ['desc'];
  const tanggal = req.query.tanggal;
  const orderBy = sortArray.map((field, index) => ({
    [field]: typeArray[index] || 'desc',
  }));

  const whereClause = {
    tanggal: tanggal ? new Date(tanggal) : undefined,
    ...(status.length > 0 ? { status: { in: status } } : {}),
    ...(jenisKegiatan.length > 0
      ? {
          OR: jenisKegiatan.map((item) => ({
            jenisKegiatan: {
              equals: item,
              mode: 'insensitive',
            },
          })),
        }
      : {}),
    ...(keyword
      ? {
          OR: [
            {
              User: { namaUser: { contains: keyword, mode: 'insensitive' } },
            },
            {
              Ruangan: {
                namaRuangan: { contains: keyword, mode: 'insensitive' },
              },
            },
          ],
        }
      : {}),
  };

  try {
    const peminjaman = await prisma.peminjaman.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy,
      select: {
        idPeminjaman: true,
        User_idUser: true,
        Ruangan_idRuangan: true,
        tanggal: true,
        jamAwal: true,
        jamAkhir: true,
        jenisKegiatan: true,
        deskripsi: true,
        status: true,
        Ruangan: {
          select: {
            idRuangan: true,
            namaRuangan: true,
            kapasitas: true,
          },
        },
        User: {
          select: {
            idUser: true,
            namaUser: true,
            email: true,
            noTelp: true,
            role: true,
            kartuTandaPengenal: true,
          },
        },
      },
    });

    const total = await prisma.peminjaman.count({
      where: whereClause,
    });

    res.json({
      data: peminjaman,
      meta: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_data: total,
        per_page: limit,
      },
    });
  } catch (error) {
    console.error('Get peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPeminjamanByUserId = async (req, res) => {
  const { idUser } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.per_page) || 10;
  const skip = (page - 1) * limit;
  const statusParam = req.query.status;
  const status = typeof statusParam === 'string' ? statusParam.split(',') : [];
  const keyword = req.query.keyword || '';
  const jenisKegiatanParam = req.query.jenisKegiatan;
  const jenisKegiatan =
    typeof jenisKegiatanParam === 'string' ? jenisKegiatanParam.split(',') : [];
  const sortParam = req.query.sort;
  const typeParam = req.query.type;
  const sortArray =
    typeof sortParam === 'string' ? sortParam.split(',') : ['tanggal'];
  const typeArray =
    typeof typeParam === 'string' ? typeParam.split(',') : ['desc'];
  const tanggal = req.query.tanggal;
  const orderBy = sortArray.map((field, index) => ({
    [field]: typeArray[index] || 'desc',
  }));

  const whereClause = {
    User_idUser: parseInt(idUser),
    tanggal: tanggal ? new Date(tanggal) : undefined,
    ...(status.length > 0 ? { status: { in: status } } : {}),
    ...(jenisKegiatan.length > 0
      ? {
          OR: jenisKegiatan.map((item) => ({
            jenisKegiatan: {
              equals: item,
              mode: 'insensitive',
            },
          })),
        }
      : {}),
    ...(keyword
      ? {
          OR: [
            {
              User: { namaUser: { contains: keyword, mode: 'insensitive' } },
            },
            {
              Ruangan: {
                namaRuangan: { contains: keyword, mode: 'insensitive' },
              },
            },
          ],
        }
      : {}),
  };

  try {
    const peminjaman = prisma.peminjaman.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      select: {
        idPeminjaman: true,
        User_idUser: true,
        Ruangan_idRuangan: true,
        tanggal: true,
        jamAwal: true,
        jamAkhir: true,
        jenisKegiatan: true,
        deskripsi: true,
        status: true,
        Ruangan: {
          select: {
            idRuangan: true,
            namaRuangan: true,
            kapasitas: true,
          },
        },
        User: {
          select: {
            idUser: true,
            namaUser: true,
            email: true,
            noTelp: true,
            role: true,
            kartuTandaPengenal: true,
          },
        },
      },
    });

    const total = await prisma.peminjaman.count({
      where: whereClause,
    });

    if (!peminjaman) {
      return res.status(404).json({ error: 'Peminjaman not found' });
    }

    res.json({
      data: peminjaman,
      current_page: page,
      total_pages: Math.ceil(total / limit),
      total_data: total,
      per_page: limit,
    });
  } catch (error) {
    console.error('Get peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPeminjamanByRuanganId = async (req, res) => {
  const { idRuangan } = req.params;

  const tanggal = req.query.tanggal;
  if (!tanggal) {
    return res
      .status(400)
      .json({ error: 'Tanggal harus disertakan dalam query parameter' });
  }

  try {
    const peminjaman = await prisma.peminjaman.findMany({
      where: {
        Ruangan_idRuangan: parseInt(idRuangan),
        tanggal: new Date(tanggal),
        status: 'approved',
      },
      orderBy: {
        jamAwal: 'asc',
      },
      select: {
        idPeminjaman: true,
        User_idUser: true,
        Ruangan_idRuangan: true,
        tanggal: true,
        jamAwal: true,
        jamAkhir: true,
        jenisKegiatan: true,
        deskripsi: true,
        status: true,
        Ruangan: {
          select: {
            idRuangan: true,
            namaRuangan: true,
            kapasitas: true,
          },
        },
        User: {
          select: {
            idUser: true,
            namaUser: true,
            email: true,
            noTelp: true,
            role: true,
            kartuTandaPengenal: true,
          },
        },
      },
    });

    res.json({
      data: peminjaman,
    });
  } catch (error) {
    console.error('Get peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPeminjamanDetail = async (req, res) => {
  const { idPeminjaman } = req.params;
  try {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { idPeminjaman: parseInt(idPeminjaman) },
      select: {
        idPeminjaman: true,
        User_idUser: true,
        Ruangan_idRuangan: true,
        tanggal: true,
        jamAwal: true,
        jamAkhir: true,
        jenisKegiatan: true,
        deskripsi: true,
        status: true,
        Ruangan: {
          select: {
            idRuangan: true,
            namaRuangan: true,
            kapasitas: true,
          },
        },
        User: {
          select: {
            idUser: true,
            namaUser: true,
            email: true,
            noTelp: true,
            role: true,
            kartuTandaPengenal: true,
          },
        },
      },
    });
    res.json({
      status: true,
      data: peminjaman,
    });
  } catch (error) {
    console.error('Get peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPeminjaman = async (req, res) => {
  const { idUser, role } = req.user;
  const { ruanganId, tanggal, jamAwal, jamAkhir, jenisKegiatan, deskripsi } =
    req.body;

  if (
    !ruanganId ||
    !tanggal ||
    !jamAwal ||
    !jamAkhir ||
    !jenisKegiatan ||
    !deskripsi
  ) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  const tanggalDate = new Date(tanggal);
  const jamAwalString = timeFormatter.formatTimeToString(jamAwal);
  const jamAkhirString = timeFormatter.formatTimeToString(jamAkhir);
  const jamAwalFormatted = timeFormatter.parseTimeToDate(jamAwal);
  const jamAkhirFormatted = timeFormatter.parseTimeToDate(jamAkhir);

  if (jamAwalFormatted >= jamAkhirFormatted) {
    return res.status(400).json({
      error: 'jamAwal harus lebih kecil dari jamAkhir',
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minBookingDate = new Date(today);
  if (role == 'mahasiswa') {
    minBookingDate.setDate(minBookingDate.getDate() + 3);
  }

  if (tanggalDate < minBookingDate) {
    return res.status(400).json({
      error:
        'Peminjaman harus dilakukan minimal 3 hari sebelum tanggal pelaksanaan',
    });
  }

  try {
    const konflik = await prisma.peminjaman.findMany({
      where: {
        Ruangan_idRuangan: ruanganId,
        tanggal: tanggalDate,
        status: 'approved',
      },
    });

    for (let i = 0; i < konflik.length; i++) {
      const peminjaman = konflik[i];
      if (
        (jamAwalFormatted >= peminjaman.jamAwal &&
          jamAwalFormatted <= peminjaman.jamAkhir) ||
        (jamAkhirFormatted >= peminjaman.jamAwal &&
          jamAkhirFormatted <= peminjaman.jamAkhir) ||
        (jamAwalFormatted <= peminjaman.jamAwal &&
          jamAkhirFormatted >= peminjaman.jamAkhir)
      ) {
        return res.status(409).json({
          error: 'Ruangan sudah dipinjam di jam dan tanggal tersebut',
        });
      }
    }

    const peminjaman = await prisma.peminjaman.create({
      data: {
        User_idUser: idUser,
        Ruangan_idRuangan: ruanganId,
        tanggal: new Date(tanggal),
        jamAwal: timeFormatter.parseTimeToDate(jamAwal),
        jamAkhir: timeFormatter.parseTimeToDate(jamAkhir),
        jenisKegiatan,
        status: 'waiting',
        deskripsi: deskripsi,
      },
    });

    res.status(201).json({
      message: 'Peminjaman berhasil diajukan',
      data: {
        idPeminjaman: peminjaman.idPeminjaman,
        User_idUser: peminjaman.User_idUser,
        Ruangan_idRuangan: peminjaman.Ruangan_idRuangan,
        tanggal: peminjaman.tanggal,
        jamAwal: peminjaman.jamAwal,
        jamAkhir: peminjaman.jamAkhir,
        jenisKegiatan: peminjaman.jenisKegiatan,
        deskripsi: peminjaman.deskripsi,
        status: peminjaman.status,
      },
    });
  } catch (error) {
    console.error('Create peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStatusPeminjaman = async (req, res) => {
  const { idPeminjaman } = req.params;
  const { role } = req.user;
  const { status } = req.body;

  const validStatuses = ['approved', 'rejected', 'waiting', 'canceled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status peminjaman tidak valid' });
  }

  if (role === 'mahasiswa' && status !== 'canceled') {
    return res
      .status(403)
      .json({ error: 'Mahasiswa hanya dapat membatalkan peminjaman' });
  }

  try {
    if (status == 'approved') {
      const currPeminjaman = await prisma.peminjaman.findUnique({
        where: {
          idPeminjaman: parseInt(idPeminjaman),
        },
      });

      const konflik = await prisma.peminjaman.findMany({
        where: {
          Ruangan_idRuangan: currPeminjaman.Ruangan_idRuangan,
          tanggal: new Date(currPeminjaman.tanggal),
          status: 'approved',
        },
      });

      const jamAwalTime = currPeminjaman.jamAwal.getTime();
      const jamAkhirTime = currPeminjaman.jamAkhir.getTime();

      for (let i = 0; i < konflik.length; i++) {
        const peminjaman = konflik[i];

        const konflikJamAwal = peminjaman.jamAwal.getTime();
        const konflikJamAkhir = peminjaman.jamAkhir.getTime();

        if (
          (jamAwalTime >= konflikJamAwal && jamAkhirTime <= konflikJamAkhir) ||
          (jamAkhirTime >= konflikJamAwal && jamAkhirTime <= konflikJamAkhir) ||
          (jamAwalTime <= konflikJamAwal && jamAkhirTime >= konflikJamAkhir)
        ) {
          return res.status(409).json({
            error: 'Ruangan sudah dipinjam di jam dan tanggal tersebut',
          });
        }
      }
    }

    const peminjaman = await prisma.peminjaman.update({
      where: { idPeminjaman: parseInt(idPeminjaman) },
      data: { status },
      select: {
        idPeminjaman: true,
        Ruangan_idRuangan: true,
        User_idUser: true,
        tanggal: true,
        jamAwal: true,
        jamAkhir: true,
        jenisKegiatan: true,
        deskripsi: true,
        Ruangan: {
          select: {
            idRuangan: true,
            namaRuangan: true,
          },
        },
      },
    });

    if (!peminjaman) {
      return res.status(404).json({ error: 'Peminjaman tidak ditemukan' });
    }

    user = await prisma.user.findUnique({
      where: { idUser: peminjaman.User_idUser },
      select: {
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    await sendEmail(
      user.email,
      status,
      peminjaman.Ruangan.namaRuangan,
      peminjaman.tanggal,
      peminjaman.jamAwal,
      peminjaman.jamAkhir,
      peminjaman.jenisKegiatan,
      peminjaman.deskripsi
    );
    res.json({
      message: 'Status peminjaman berhasil diperbarui',
      data: {
        idPeminjaman: peminjaman.idPeminjaman,
        status: peminjaman.status,
      },
    });
  } catch (error) {
    console.error('Update peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePeminjaman = async (req, res) => {
  const { idPeminjaman } = req.params;
  const { idUser } = req.user;

  try {
    await prisma.peminjaman.delete({
      where: {
        idPeminjaman: parseInt(idPeminjaman),
        User_idUser: idUser,
      },
    });

    res.status(200).json({ message: 'Peminjaman berhasil dihapus' });
  } catch (error) {
    console.error('Delete peminjaman message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllPeminjaman,
  getPeminjamanByUserId,
  getPeminjamanByRuanganId,
  createPeminjaman,
  updateStatusPeminjaman,
  deletePeminjaman,
  getPeminjamanDetail,
};
