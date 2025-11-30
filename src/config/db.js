// Backend/src/config/db.js
const { Sequelize, DataTypes } = require('sequelize'); // Import DataTypes
require('dotenv').config();

// 1. Inisialisasi Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'postgres', // Pastikan dialect terdefinisi
        logging: false,
    }
);

// 2. Definisi Objek DB dan Model
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Muat Model
// ⚠️ Pastikan path ini benar (misalnya, jika models berada di '../models')
db.User = require('../models/User')(sequelize, DataTypes);
db.Recipe = require('../models/Recipe')(sequelize, DataTypes);
db.Rating = require('../models/Rating')(sequelize, DataTypes);
db.Favorite = require('../models/Favorite')(sequelize, DataTypes);

// 3. Setup Relasi (Associations)

// Contoh Relasi: User memiliki banyak Recipe
db.User.hasMany(db.Recipe, { foreignKey: 'userId' });
db.Recipe.belongsTo(db.User, { foreignKey: 'userId' });

// Contoh Relasi: Rating (Many-to-Many melalui tabel Rating)
db.User.belongsToMany(db.Recipe, { through: db.Rating, foreignKey: 'userId', as: 'RatedRecipes' });
db.Recipe.belongsToMany(db.User, { through: db.Rating, foreignKey: 'recipeId', as: 'Ratings' });
// Relasi langsung untuk akses data Rating
db.Recipe.hasMany(db.Rating, { foreignKey: 'recipeId' });
db.Rating.belongsTo(db.Recipe, { foreignKey: 'recipeId' });


// 4. Fungsi Koneksi Database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Koneksi PostgreSQL sukses.');
        
        // Sinkronkan model dengan database (membuat atau mengubah tabel)
        await sequelize.sync(); 
        console.log('✅ Model disinkronkan dengan database.');
    } catch (error) {
        console.error('❌ Koneksi PostgreSQL GAGAL:', error.message);
        // process.exit(1); 
    }
};

// 5. Ekspor Objek DB dan Fungsi Koneksi
module.exports = { 
    sequelize, 
    connectDB, 
    db // ⬅️ EKSPOR OBJEK DB LENGKAP INI
};