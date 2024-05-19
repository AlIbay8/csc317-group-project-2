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
        desc TEXT,
        date_published DATE
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
            genre: "adventure, puzzle",
            price: 7.99,
            img: "/resources/T8H-thumbnail-small.gif",
            date_published: '2024-03-24',
            desc: "A time-looping text adventure. Explore an abandoned village. You wake up in an apartment of a deserted village. As you are exploring, you find the community which was once here referred to themselves as \"The Order of Perennial Mortals.\" Find the answers. Learn the secrets of the village and its residents. Follow the clues to search for the source of your time loop. Break the loop. \"What is called a reason for living is also an excellent reason for dying.\""
        },
        {
            name: "What the Curl?",
            genre: "sports, comedy",
            price: 4.99,
            img: "/resources/WTC_Thumbnail.gif",
            date_published: '2023-05-21',
            desc: "WHAT THE CURL? is a curling simulation that is anything but curling. Much like its inspiration, WHAT THE GOLF? by Triband, it is a comedy game with some light puzzles and a few surprises. Wield your mighty brush to control the stone's fate. Evade your opponent's stones, ride some waves, partake in a coup d'état, and more in WHAT THE CURL? Master your curling skills in a tutorial, 4 levels, 12 gags/sublevels, and a boss fight."
        },
        {
            name: "The Nature of Gravity",
            genre: "platformer, puzzle",
            price: 5.99,
            img: "/resources/TNOG_Thumbnail.gif",
            date_published: '2022-08-18',
            desc: "Navigate through obstacles and deadly objects using your unique platforming ability: influencing the direction of gravity. Collect arrow keys, jump over spikes, move crates, and reach the flag at the end of the level by understanding the nature of gravity."
        },
        {
            name: "Telepathic Puzzler",
            genre: "puzzle",
            price: 1.99,
            img: "/resources/TelepathicPuzzler_Thumbnail.gif",
            date_published: '2021-06-13',
            desc: "Play as the two telepathically connected puzzle pieces, Poly and Beta, in their journey to join together! The goal is to get Poly and Beta to join together by maneuvering through obstacles and understanding the telepathic controls."
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
                db.run(`INSERT INTO products (${keys.join(", ")}) VALUES (?, ?, ?, ?, ?, ?)`, values, (err) => {
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