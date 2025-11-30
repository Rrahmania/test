const { db } = require('../config/db'); 
const { Op } = require('sequelize');

const Recipe = db.Recipe;
const User = db.User;
const Rating = db.Rating;
const Favorite = db.Favorite;

const parseBody = (body) => {
    const parsedBody = {};
    for (const key in body) {

        try {
            parsedBody[key] = JSON.parse(body[key]);
        } catch (e) {
            parsedBody[key] = body[key];
        }
    }
    return parsedBody;
};


// ---------------------------------------------------
// 1. TAMBAH RESEP (CREATE)
// ---------------------------------------------------
const addRecipe = async (req, res) => {
    // 1. Dapatkan data teks dan parse JSON String dari req.body
    const parsedData = parseBody(req.body);
    const { title, description, ingredients, steps, categories } = parsedData;
    const userId = req.userId; // Dari JWT Middleware (protect)

    // 2. Dapatkan data gambar dari Multer
    const imageFile = req.file; // Ini adalah objek File (buffer) dari multer (uploadMiddleware.js)

    // Logika URL Gambar (sementara/placeholder)
    // ⚠️ Jika menggunakan Cloudinary/S3, URL aktual harus dihasilkan di sini.
    let imageUrl = imageFile ? 
        `http://localhost:5000/uploads/${Date.now()}-${imageFile.originalname.replace(/\s/g, '_')}` : 
        'default-recipe.jpg';

    // 3. Validasi
    if (!title || !description || !ingredients || ingredients.length === 0 || !steps || steps.length === 0) {
        return res.status(400).json({ message: 'Judul, deskripsi, bahan, dan langkah wajib diisi.' });
    }

    try {
        const newRecipe = await Recipe.create({
            title,
            description,
            ingredients, // Array
            steps,       // Array
            categories: categories || [], // Array
            imageUrl: imageUrl, 
            userId: userId
        });
        
        res.status(201).json({ 
            message: 'Resep berhasil ditambahkan.', 
            recipe: newRecipe 
        });
    } catch (error) {
        console.error('Error saat menyimpan resep:', error);
        res.status(500).json({ message: 'Gagal menyimpan resep.' });
    }
};

// ---------------------------------------------------
// 2. AMBIL SEMUA RESEP (READ ALL)
// ---------------------------------------------------
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            // Memasukkan data user pembuat resep
            include: [{ model: User, attributes: ['id', 'username', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error mengambil resep:', error);
        res.status(500).json({ message: 'Gagal mengambil data resep.' });
    }
};

// ---------------------------------------------------
// 3. AMBIL RESEP BERDASARKAN ID (READ ONE)
// ---------------------------------------------------
const getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                // Jika Anda ingin menampilkan rating/favorit:
                // { model: Rating }, 
                // { model: Favorite }
            ]
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Resep tidak ditemukan.' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error mengambil resep berdasarkan ID:', error);
        res.status(500).json({ message: 'Gagal mengambil data resep.' });
    }
};

// ---------------------------------------------------
// 4. BERI RATING
// ---------------------------------------------------
const rateRecipe = async (req, res) => {
    const { id } = req.params; // ID Resep
    const { rating } = req.body;
    const userId = req.userId; // Dari JWT Middleware

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating harus antara 1 dan 5.' });
    }

    try {
        // Cek apakah user sudah pernah memberi rating pada resep ini
        let existingRating = await Rating.findOne({
            where: {
                recipeId: id,
                userId: userId
            }
        });

        if (existingRating) {
            // Update Rating
            existingRating.rating = rating;
            await existingRating.save();
            return res.status(200).json({ message: 'Rating berhasil diperbarui.', rating: existingRating });
        } else {
            // Buat Rating baru
            const newRating = await Rating.create({
                recipeId: id,
                userId: userId,
                rating: rating
            });
            return res.status(201).json({ message: 'Rating berhasil ditambahkan.', rating: newRating });
        }

    } catch (error) {
        console.error('Error rating resep:', error);
        res.status(500).json({ message: 'Gagal memproses rating.' });
    }
};

// ---------------------------------------------------
// 5. TAMBAH/HAPUS FAVORIT (TOGGLE)
// ---------------------------------------------------
const toggleFavorite = async (req, res) => {
    const { recipeId } = req.body; // ID Resep yang akan difavoritkan
    const userId = req.userId; // Dari JWT Middleware

    try {
        // Cek apakah resep sudah ada di favorit user
        const existingFavorite = await Favorite.findOne({
            where: {
                recipeId: recipeId,
                userId: userId
            }
        });

        if (existingFavorite) {
            // Jika sudah ada, hapus (Toggle OFF)
            await existingFavorite.destroy();
            return res.status(200).json({ message: 'Resep dihapus dari favorit.', isFavorite: false });
        } else {
            // Jika belum ada, buat (Toggle ON)
            const newFavorite = await Favorite.create({
                recipeId: recipeId,
                userId: userId
            });
            return res.status(201).json({ message: 'Resep ditambahkan ke favorit.', isFavorite: true });
        }

    } catch (error) {
        console.error('Error toggle favorit:', error);
        res.status(500).json({ message: 'Gagal memproses favorit.' });
    }
};


module.exports = {
    addRecipe,
    getAllRecipes,
    getRecipeById,
    rateRecipe,
    toggleFavorite,
};