const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------
// --- MIDDLEWARES (HARUS DITARUH DI AWAL) ---
// ------------------------------------------------------------------

// 1. Konfigurasi CORS LENGKAP (Ganti port 5174 dengan port frontend Anda jika berbeda)
app.use(cors({
    origin: 'http://localhost:5174', // 🛑 Catatan: Hapus slash (/) di akhir URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// 2. Body Parsers (Menerima data JSON dari request body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------------------------------------------------------
// --- KONEKSI DATABASE ---
// ------------------------------------------------------------------
// Menjalankan koneksi dan sinkronisasi model ke PostgreSQL
connectDB(); 


// ------------------------------------------------------------------
// --- INTEGRASI ROUTES ---
// ------------------------------------------------------------------
// Rute Pengujian Server (Harus di atas route spesifik jika menggunakan /)
app.get('/', (req, res) => {
    res.send('Server Resep Hub API Berjalan.');
});

// 🛑 AKTIFKAN ROUTE ANDA KEMBALI
app.use('/api/auth', authRoutes); 
app.use('/api/recipes', recipeRoutes); 


// ------------------------------------------------------------------
// --- JALANKAN SERVER ---
// ------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});