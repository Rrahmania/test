const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Recipe = sequelize.define('Recipe', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // PostgreSQL mendukung Array Tipe Data
        ingredients: { 
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        steps: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        categories: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
        // userId akan ditambahkan secara otomatis oleh Sequelize sebagai Foreign Key
    }, {
        timestamps: true, // Menambahkan createdAt dan updatedAt
    });

    return Recipe;
};