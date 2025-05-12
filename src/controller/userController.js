const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Mendapatkan profil pengguna
const getProfile = async (req, res) => {
  const { idUser } = req.user; // Mendapatkan idUser dari token JWT

  try {
    const user = await prisma.user.findUnique({
      where: { idUser },
      select: {
        idUser: true,
        namaUser: true,
        email: true,
        noTelp: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      status : true,
      message : "success get user profile",
      data : user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error });
  }
};

// Memperbarui profil pengguna (noTelp, password)
const updateProfile = async (req, res) => {
  const { idUser } = req.user; // Mendapatkan idUser dari token JWT
  const { noTelp, password } = req.body;

  try {
    // Validasi password jika ada perubahan
    let updatedData = { noTelp };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { idUser },
      data: updatedData,
    });

    res.json({
      status : true,
      message: 'Profile updated successfully',
      user: {
        idUser: updatedUser.idUser,
        namaUser: updatedUser.namaUser,
        email: updatedUser.email,
        noTelp: updatedUser.noTelp,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
