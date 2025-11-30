// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize'); 
const { sequelize } = require('../config/db'); 

// Objek untuk menampung semua model yang sudah terinisialisasi
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// --- 1. Definisikan Model ---
// Menggunakan require dan langsung memanggil fungsi dengan instance sequelize dan DataTypes
db.User = require('./User')(sequelize, DataTypes); 
db.Recipe = require('./Recipe')(sequelize, DataTypes);
db.Rating = require('./Rating')(sequelize, DataTypes);
db.Favorite = require('./Favorite')(sequelize, DataTypes);


// --- 2. Definisikan Relasi Antar Tabel (Associations) ---

// 1. Relasi User dan Recipe (One-to-Many: 1 User punya banyak Recipes)
db.User.hasMany(db.Recipe, { 
    foreignKey: 'userId', 
    as: 'recipes' // Alias untuk hasil query
});
db.Recipe.belongsTo(db.User, { 
    foreignKey: 'userId', 
    as: 'user' // Alias untuk hasil query
});

// 2. Relasi User dan Rating (One-to-Many: 1 User bisa memberi banyak Rating)
db.User.hasMany(db.Rating, { 
    foreignKey: 'userId', 
    as: 'ratingsGiven' 
});
db.Rating.belongsTo(db.User, { 
    foreignKey: 'userId', 
    as: 'rater' 
});

// 3. Relasi Recipe dan Rating (One-to-Many: 1 Recipe bisa memiliki banyak Rating)
db.Recipe.hasMany(db.Rating, { 
    foreignKey: 'recipeId', 
    as: 'ratings' 
});
db.Rating.belongsTo(db.Recipe, { 
    foreignKey: 'recipeId', 
    as: 'recipe' 
});

// 4. Relasi User dan Favorite (One-to-Many: 1 User bisa punya banyak Favorite)
db.User.hasMany(db.Favorite, { 
    foreignKey: 'userId', 
    as: 'favoriteList' 
});
db.Favorite.belongsTo(db.User, { 
    foreignKey: 'userId', 
    as: 'user' 
});

// 5. Relasi Recipe dan Favorite (One-to-Many: 1 Recipe bisa masuk ke banyak Favorite)
db.Recipe.hasMany(db.Favorite, { 
    foreignKey: 'recipeId', 
    as: 'favoritedBy' 
});
db.Favorite.belongsTo(db.Recipe, { 
    foreignKey: 'recipeId', 
    as: 'recipe' 
});


module.exports = db;