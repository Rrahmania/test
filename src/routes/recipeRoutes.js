// src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();

// Import Controller
const recipeController = require('../controllers/recipeController'); 

// Import Middleware
const protect = require('../middleware/authMiddleware'); // Untuk verifikasi JWT (login wajib)
const uploadImage = require('../middleware/uploadMiddleware'); // Untuk Multer (handle file upload)

// --- RUTE RESEP (MEMBUTUHKAN OTENTIKASI) ---

// POST /api/recipes
// 1. protect: Memastikan pengguna login dan memiliki token valid.
// 2. uploadImage: Memproses data multipart/form-data dan menyimpan file di req.file.
// 3. addRecipe: Menyimpan data resep dan URL gambar ke database.
router.post('/', protect, uploadImage, recipeController.addRecipe);

// POST /api/recipes/rate/:id
// Beri rating pada resep tertentu
router.post('/rate/:id', protect, recipeController.rateRecipe);

// POST /api/recipes/favorite
// Tambah/hapus resep dari daftar favorit
router.post('/favorite', protect, recipeController.toggleFavorite);

// --- RUTE RESEP (TIDAK MEMBUTUHKAN OTENTIKASI) ---

// GET /api/recipes
// Mengambil semua resep (umumnya tidak butuh login)
router.get('/', recipeController.getAllRecipes);

// GET /api/recipes/:id
// Mengambil detail resep berdasarkan ID
router.get('/:id', recipeController.getRecipeById);

// ⚠️ Catatan: Anda mungkin ingin menambahkan rute untuk UPDATE/DELETE 
// yang juga membutuhkan middleware `protect`.

module.exports = router;