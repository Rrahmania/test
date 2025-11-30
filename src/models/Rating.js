// src/models/Rating.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        score: {
            // Skor rating (misalnya 1 hingga 5)
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        // userId dan recipeId (Foreign Keys) akan ditambahkan melalui relasi di index.js
    }, {
        timestamps: true,
        freezeTableName: true,
        // **PENTING:** Membuat gabungan userId dan recipeId menjadi Kunci Unik (Compound Unique Key)
        // Ini mencegah satu pengguna memberikan rating lebih dari satu kali pada resep yang sama.
        indexes: [
            {
                unique: true,
                fields: ['userId', 'recipeId']
            }
        ]
    });

    return Rating;
};