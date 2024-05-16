const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies

router.get('/info', (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.session.userId], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "Can't find user" });
        }
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            pfp: user.pfp
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

router.get('/test', (req, res) => {
    return res.json({
        id: req.session.userId
    })
})

router.post('/update', (req, res) => {
    const user_info = req.body
    const update_keys = ["name", "email", "bio", "pfp"]
    for (let key of update_keys) {
        if (user_info[key]) {
            db.run(`UPDATE users SET ${key} = ? WHERE id = ?`, [user_info[key], req.session.userId], (err) => {
                if (err) {
                    console.log(`existing item error on ${key}`)
                    return res.status(400).json({message: err})
                }
            })
        }
        
    }
    db.get(`SELECT * FROM users WHERE id = ?`, [req.session.userId], (err, user) => {
        console.log(user)
        if (err) {
            return res.status(400).json({message: "couldn't get user"})
        }
    })
    
})

module.exports = router;