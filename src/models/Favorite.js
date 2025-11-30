// src/models/Favorite.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Tidak perlu kolom lain selain ID, karena relasi (userId dan recipeId)
        // sudah diurus oleh Foreign Keys yang didefinisikan di index.js
    }, {
        timestamps: true, // Untuk mencatat kapan favorit ini ditambahkan
        freezeTableName: true,
        tableName: 'Favorites', // Nama tabel di database
        // **PENTING:** Membuat Compound Unique Key
        // Ini memastikan satu pengguna tidak dapat menambahkan resep yang sama dua kali ke favorit.
        indexes: [
            {
                unique: true,
                fields: ['userId', 'recipeId']
            }
        ]
    });

    return Favorite;
};