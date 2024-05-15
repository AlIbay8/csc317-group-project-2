const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});

// router.get('/register', (req, res) => {
//     res.sendFile('register.html', { root: './views' });
// });

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
            console.log("register error: ", email, hashedPassword)
            return res.status(400).json({ message: 'Error occurred during registration' });
        }
        res.status(200).json({ message: 'Registration successful' });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        req.session.userId = user.id;
        res.status(200).json({ message: 'Login successful' });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(400).json({ message: 'Error occurred during logout' });
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
