// src/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Email harus unik, ini penting untuk login
            validate: {
                isEmail: true // Memastikan formatnya adalah email
            }
        },
        password: {
            // Kita simpan password yang sudah di-hash (panjang)
            type: DataTypes.STRING, 
            allowNull: false,
        },
        // Anda bisa menambahkan kolom lain seperti username, profile_picture, dll.
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: true, // Menambahkan createdAt dan updatedAt
        freezeTableName: true // Memastikan nama tabel tetap 'User'
    });

    // 💡 Hooks (Opsional tapi direkomendasikan): 
    // Jika Anda ingin meng-hash password di sini (bukan di controller)
    /*
    User.beforeCreate(async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });
    */

    return User;
};