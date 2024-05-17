const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR,
        email VARCHAR UNIQUE,
        password VARCHAR,
        pfp MEDIUMBLOB,
        bio TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR,
        genre VARCHAR,
        price FLOAT(6,2),
        img VARCHAR,
        desc TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        user_id INTEGER
    )`);
    db.serialize(() => {
        prepareProducts();
    })
});

function prepareProducts() {
    const products = [
        {
            name: "The 8th Hour",
            genre: "adventure,puzzle",
            price: 7.99,
            img: "/resources/T8H-thumbnail-small.gif",
            desc: "test"
        },
        {
            name: "What the Curl?",
            genre: "sports,comedy",
            price: 4.99,
            img: "/resources/WTC_Thumbnail.gif",
            desc: "test"
        },
        {
            name: "The Nature of Gravity",
            genre: "platformer,puzzle",
            price: 5.99,
            img: "/resources/TNOG_Thumbnail.gif",
            desc: "test"
        },
        {
            name: "Telepathic Puzzler",
            genre: "puzzle",
            price: 1.99,
            img: "/resources/TelepathicPuzzler_Thumbnail.gif",
            desc: "test"
        }
    ]
    for (let product of products) {
        let keys = Object.keys(product);
        let values = keys.map((key) => product[key])
        db.get(`SELECT 1 FROM products WHERE ${keys.join(" = ? AND ").concat(" = ?")}`, values, (err, row) => {
            if (err) {
                console.log("Error getting row: ", err)
            }
            if (!row) {
                db.run(`INSERT INTO products (${keys.join(", ")}) VALUES (?, ?, ?, ?, ?)`, values, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                })
            }
        })
    }
}

module.exports = db;