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
        developer VARCHAR,
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
            img: "/resources/games/T8H-thumbnail-small.gif",
            date_published: '2124-03-24',
            developer: "4RT1F1C1AL",
            desc: "A time-looping text adventure. Explore an abandoned village. You wake up in an apartment of a deserted village. As you are exploring, you find the community which was once here referred to themselves as \"The Order of Perennial Mortals.\" Find the answers. Learn the secrets of the village and its residents. Follow the clues to search for the source of your time loop. Break the loop. \"What is called a reason for living is also an excellent reason for dying.\""
        },
        {
            name: "What the Curl?",
            genre: "sports, comedy",
            price: 4.99,
            img: "/resources/games/WTC_Thumbnail.gif",
            date_published: '2123-05-21',
            developer: "4RT1F1C1AL",
            desc: "WHAT THE CURL? is a curling simulation that is anything but curling. Much like its inspiration, WHAT THE GOLF? by Triband, it is a comedy game with some light puzzles and a few surprises. Wield your mighty brush to control the stone's fate. Evade your opponent's stones, ride some waves, partake in a coup d'état, and more in WHAT THE CURL? Master your curling skills in a tutorial, 4 levels, 12 gags/sublevels, and a boss fight."
        },
        {
            name: "The Nature of Gravity",
            genre: "platformer, puzzle",
            price: 5.99,
            img: "/resources/games/TNOG_Thumbnail.gif",
            date_published: '2122-08-18',
            developer: "4RT1F1C1AL",
            desc: "Navigate through obstacles and deadly objects using your unique platforming ability: influencing the direction of gravity. Collect arrow keys, jump over spikes, move crates, and reach the flag at the end of the level by understanding the nature of gravity."
        },
        {
            name: "Telepathic Puzzler",
            genre: "puzzle",
            price: 1.99,
            img: "/resources/games/TelepathicPuzzler_Thumbnail.gif",
            date_published: '2121-06-13',
            developer: "4RT1F1C1AL",
            desc: "Play as the two telepathically connected puzzle pieces, Poly and Beta, in their journey to join together! The goal is to get Poly and Beta to join together by maneuvering through obstacles and understanding the telepathic controls."
        },
        {
            name: "High Stakes",
            genre: "card",
            price: 3.99,
            img: "/resources/games/highstakes.png",
            date_published: '2020-10-14',
            developer: "Krystman",
            desc: "Las Vegas 2024. Vampires have stolen your blood. Play the card game of your life and win it all back."
        },
        {
            name: "Astra and the New Constellation",
            genre: "platformer",
            price: 4.99,
            img: "/resources/games/astra.gif",
            date_published: '2023-05-01',
            developer: "rare",
            desc: "Astra is the smallest star in Constellation Station. Tired of being picked on, she sets off an adventure to build a new constellation of her own! Run, jump, slide, and float across the galaxy while collecting stardust to build your new home in this retro-inspired Pico-8 platformer."
        },
        {
            name: "Cosmic Collapse",
            genre: "puzzle",
            price: 4.95,
            img: "/resources/games/cosmiccollapse.png",
            date_published: '2023-11-01',
            developer: "Johan Peitz",
            desc: "It is time to tidy up the solar system. Can't have all these planets laying around."
        },
        {
            name: "Golf Monday",
            genre: "sports, simulation",
            price: 4.95,
            img: "/resources/games/golfmonday.png",
            date_published: '2023-12-11',
            developer: "Johan Peitz",
            desc: "Welcome to the national amateur golf tournament at Oakvale Meadows! Avoid the sand traps and water hazards, score birdies and eagles, make new friends, and win the day. Enjoy a golf experience where you not only need to aim your shots, but also keep your social relations finely tuned. Luckily everybody is well rested and in their best mood."
        },
        {
            name: "Kalikan",
            genre: "action",
            price: 5.00,
            img: "/resources/games/kalikan.gif",
            date_published: '2023-07-02',
            developer: "LouieChapm",
            desc: "Kalikan is a vertically scrolling bullet hell 'shmup inspired by Dodonpachi- pushing the limits of ~virtual~ hardware. Control one of 3 1 ship(s) featuring two varied attack modes. Maintain your chain to compete for the highest scores."
        },
        {
            name: "Infinimoes",
            genre: "puzzle",
            price: 4.00,
            img: "/resources/games/infinimoes.png",
            date_published: '2024-05-12',
            developer: "Werxzy",
            desc: "Infinimoes is a space filling puzzle game (like tangrams) involving a variety of polyominoes and sometimes an infinitely repeating space."
        },
        {
            name: "Murtop",
            genre: "action",
            price: 4.99,
            img: "/resources/games/murtop.png",
            date_published: '2023-04-25',
            developer: "hiulit",
            desc: "Murtop is a fast-paced arcade game packed with action, as if it was taken out directly from the 80's, where Dig Dug meets Bomberman."
        },
        {
            name: "Rubblar",
            genre: "puzzle, action",
            price: 2.99,
            img: "/resources/games/rubblar.png",
            date_published: '2022-12-04',
            developer: "Sander Vanhove, Thibaud Goiffon",
            desc: "Time to grab everything you can!"
        },
        {
            name: "Celeste Classic",
            genre: "platformer",
            price: 1.99,
            img: "/resources/games/celeste.gif",
            date_published: '2015-07-25',
            developer: "Extremely OK Games",
            desc: "A PICO-8 platformer about climbing a mountain, made in four days. Use the arrow keys, X, and C."
        },
        {
            name: "Celeste 2 Lani's Trek",
            genre: "platformer",
            price: 1.99,
            img: "/resources/games/celeste2.png",
            date_published: '2021-01-25',
            developer: "Extremely OK Games",
            desc: "A PICO-8 platformer about hiking around a mountain, made in three days for Celeste's third anniversary."
        },
    ]
    for (let product of products) {
        let keys = Object.keys(product);
        let values = keys.map((key) => product[key])
        db.get(`SELECT 1 FROM products WHERE ${keys.join(" = ? AND ").concat(" = ?")}`, values, (err, row) => {
            if (err) {
                console.log("Error getting row: ", err)
            }
            if (!row) {
                db.run(`INSERT INTO products (${keys.join(", ")}) VALUES (?, ?, ?, ?, ?, ?, ?)`, values, (err) => {
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