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
});

module.exports = db;