// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.User;
const JWT_SECRET = process.env.JWT_SECRET; // Diambil dari .env

// Fungsi pembantu untuk membuat JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d', // Token berlaku 7 hari
    });
};

const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        // 1. Cek User
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Buat User baru di PostgreSQL
        user = await User.create({
            email,
            password: hashedPassword,
            username: username || email.split('@')[0], // Jika username kosong
        });

        // 4. Beri Token dan Kirim Response
        res.status(201).json({
            id: user.id,
            email: user.email,
            token: generateToken(user.id),
        });

    } catch (error) {
        console.error('Error Registrasi:', error);
        res.status(500).json({ message: 'Gagal melakukan registrasi.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Cari User
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // 2. Bandingkan Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // 3. Kirim Token
        res.status(200).json({
            id: user.id,
            email: user.email,
            token: generateToken(user.id),
        });

    } catch (error) {
        console.error('Error Login:', error);
        res.status(500).json({ message: 'Gagal melakukan login.' });
    }
};

module.exports = {
    register,
    login,
};