const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies

router.get('/info', (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.query.id], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "Can't find user" });
        }
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio
        })
    })
})

// router.get('/:id', function(req, res, next) {
//     let id = req.params.id;
//     //var user = data.filter(u => u.name == name );
//     db.get('SELECT * FROM users WHERE id = ?', [id],  (err, user) => {
//         if (err || !user) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }
//     });
//     return res.json({ message: 'Users Show', data: user });
// });
// router.post('/update', (req, res) => {
//     const { id, user_info } = req.body;
//     db.run()
// })

module.exports = router;