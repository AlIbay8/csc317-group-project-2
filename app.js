const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require("path");
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const cartRoutes = require('./routes/cart');

const app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/game', gameRoutes);
app.use('/cart', cartRoutes);


app.get('/', (req, res) => {
    //res.render('home')
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/checkout', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/views/checkout.html');
    } else {
        res.redirect('/auth/login');
    }
})

app.get('/profile', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/views/profile.html');
    } else {
        res.redirect('/auth/login');
    }
});

app.get('/product/:id', (req, res) => {
    db.get('SELECT * FROM products where id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(400).json({ message: `Can't get game with id ${req.params.id}` });
        }
        res.render(`product`, {game: product})
    })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
