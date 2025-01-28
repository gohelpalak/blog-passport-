const express = require('express');
const port = 2204;
const app = express();
const cookieparser = require('cookie-parser');


const db = require('./config/db');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passportlocal');

app.use(session({
    secret: 'haituk',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 100 * 100
    }
}))



app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser);

const path = require('path');
const { editCategory } = require('./controllers/categorycontroller');

app.use(cookieparser())

app.use(express.urlencoded());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/",require('./routes/userRoutes'))
app.use('/admin', require('./routes/indexRoutes'));




app.set('view engine', 'ejs');
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server is runing http://localhost:${port}`);
})