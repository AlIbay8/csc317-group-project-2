const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/checkout', (req, res) => {
    res.sendFile(__dirname + '/views/checkout.html')
})

app.get('/profile', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/views/profile.html');
    } else {
        res.redirect('/auth/login');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
