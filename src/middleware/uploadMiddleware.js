// src/middleware/uploadMiddleware.js
const multer = require('multer');

// Konfigurasi penyimpanan file sementara di memori
const storage = multer.memoryStorage();

// Inisialisasi Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
    },
    fileFilter: (req, file, cb) => {
        // Hanya izinkan format gambar
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diizinkan.'), false);
        }
    }
});

// Ekspor middleware: 'single' berarti menerima satu file dengan field name 'image'
const uploadImage = upload.single('image'); 

module.exports = uploadImage;