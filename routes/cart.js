const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies


// to get an array of all the items in a user's cart, use

// fetch("/cart").then((response) => response.json()).then((result) => console.log(result));

// this only works if the user is logged in
router.get('/', (req, res) => {
    if (req.session.userId===undefined) {
        return res.status(400).json({message: "No user currently logged in."})
    }
    db.all(`SELECT * FROM cart_items WHERE user_id = ?`, [req.session.userId], (err, items) => {
        if (err) {
            console.log("get cart error: ", err)
            return res.status(400).json({message: "Error retrieving cart: " + err})
        }
        return res.json(items)
    })
})


// to add a game to the user's cart, use

// fetch('/cart/add/{game_id}', {
//     method: 'POST'
// }).then((response) => console.log(response));

// replace {game_id} with the desired game
router.post('/add/:game_id', (req, res) => {
    if (req.session.userId===undefined) {
        return res.status(400).json({message: "No user currently logged in."})
    }
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.game_id], (err, game) => {
        if (err || !game) {
            return res.status(400).json({message: "Couldn't find game, " + err})
        }
        db.get('SELECT 1 FROM cart_items WHERE product_id = ? AND user_id = ?', [game.id, req.session.userId], (err, row) => {
            if (err) {
                return res.status(400).json({message: "Error in finding existing row: "+err})
            }
            if (row) {
                return res.status(400).json({message: "Game is already in user's cart"})
            } else {
                db.run(`INSERT INTO cart_items (product_id, user_id) VALUES (?, ?)`, [game.id, req.session.userId], (err) => {
                    if (err) {
                        return res.status(400).json({message: "Couldn't add game to cart, "+err})
                    }
                    return res.status(200).json({message: "Game added to cart."})
                })
            }
        })
    })
})

// to remove a game to the user's cart, use

// fetch('/cart/remove/{game_id}', {
//     method: 'POST'
// }).then((response) => console.log(response));

// replace {game_id} with the desired game
router.post('/remove/:game_id', (req, res) => {
    if (req.session.userId===undefined) {
        return res.status(400).json({message: "No user currently logged in."})
    }
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.game_id], (err, game) => {
        if (err || !game) {
            return res.status(400).json({message: "Couldn't find game, " + err})
        }
        db.run(`DELETE FROM cart_items WHERE product_id = ? and user_id = ?`, [game.id, req.session.userId], (err) => {
            if (err) {
                return res.status(400).json({message: "Couldn't remove game from cart, "+err})
            }
            return res.status(200).json({message: "Game removed from cart."})
        })
    })
})

// to clear the entire user's cart, use

// fetch('/cart/clear', {
//     method: 'POST'
// }).then((response) => console.log(response));
router.post('/clear/', (req, res) => {
    if (req.session.userId===undefined) {
        return res.status(400).json({message: "No user currently logged in."})
    }
    db.run(`DELETE FROM cart_items WHERE user_id = ?`, [req.session.userId], (err) => {
        if (err) {
            return res.status(400).json({message: "Couldn't remove games from cart, "+err})
        }
        return res.status(200).json({message: "All games removed from cart."})
    })
})

// router.get('/all', async (req, res) => {
//     db.all(`SELECT * FROM products`, (err, products) => {
//         if (err || !products) {
//             return res.status(400).json({ message: "Can't get games" });
//         }
//         console.log(products)
//         return res.json(products)
//     })
    
// })

// router.get('/:id', async (req, res) => {
//     db.get('SELECT * FROM products where id = ?', [req.params.id], (err, product) => {
//         if (err || !product) {
//             return res.status(400).json({ message: `Can't get game with id ${req.params.id}` });
//         }
//         console.log(product)
//         return res.json(product)
//     })
// })

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