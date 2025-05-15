const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const swaggerSpec = require('./utils/swagger');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const { authenticate } = require('./middleware/auth');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const ruanganRoutes = require('./routes/ruangan')
const peminjamanRoutes = require('./routes/peminjaman')

//routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, '../uploads/ruangan')));

// Allow public routes
app.use('/api/auth', authRoutes); // login/register

// kalo pake ini di sini routes setelah ini harus sudah login
app.use(authenticate);
app.use('/api/user',userRoutes);
app.use('/api/ruangan',ruanganRoutes);
app.use('/api/peminjaman',peminjamanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));