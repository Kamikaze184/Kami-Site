require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser');
const path = require('path')

const handleControllers = require('./controllers/handle')
const controllers = new handleControllers()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("public/assets/tutoriais"))
app.use(express.static("public/assets/img/"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.sessionSecret,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

for (c in controllers.paths) {
    app.use(controllers.paths[c], controllers.routers[c])
}

// app.use(function (req, res, next) {
//     res.status(404).render('404.ejs', {session: req.session});
// });

module.exports = app