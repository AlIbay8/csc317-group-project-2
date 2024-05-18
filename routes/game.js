const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies


// to get an array of all games in db, use

// fetch("/game/all").then((response) => response.json()).then((result) => console.log(result));
router.get('/all', async (req, res) => {
    db.all(`SELECT * FROM products`, (err, products) => {
        if (err || !products) {
            return res.status(400).json({ message: "Can't get games" });
        }
        return res.json(products)
    })
    
})

// to get info of specific game, use

// fetch("/game/{id}").then((response) => response.json()).then((result) => console.log(result));

// replace {id} with the id of the desired game
router.get('/:id', async (req, res) => {
    db.get('SELECT * FROM products where id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(400).json({ message: `Can't get game with id ${req.params.id}` });
        }
        return res.json(product)
    })
})

module.exports = router;