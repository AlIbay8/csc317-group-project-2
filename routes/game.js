const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies

router.get('/all', async (req, res) => {
    db.all(`SELECT * FROM products`, (err, products) => {
        if (err || !products) {
            return res.status(400).json({ message: "Can't get games" });
        }
        return res.json(products)
    })
    
})

router.get('/:id', async (req, res) => {
    db.get('SELECT * FROM products where id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(400).json({ message: `Can't get game with id ${req.params.id}` });
        }
        return res.json(product)
    })
})

// router.get('/test', (req, res) => {
//     return res.json({
//         id: req.session.userId
//     })
// })

// router.post('/update', (req, res) => {
//     const user_info = req.body
//     const update_keys = ["name", "email", "bio", "pfp"]
//     for (let key of update_keys) {
//         if (user_info[key]) {
//             db.run(`UPDATE users SET ${key} = ? WHERE id = ?`, [user_info[key], req.session.userId], (err) => {
//                 if (err) {
//                     console.log(`existing item error on ${key}`)
//                     return res.status(400).json({message: err})
//                 }
//             })
//         }   
//     }
// })

module.exports = router;