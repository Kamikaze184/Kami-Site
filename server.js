require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

const controllers = require('./controllers/handle')

for (c in controllers.paths) {
    app.use(controllers.paths[c], controllers.router[c])
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("public/assets/tutoriais"))
app.use(express.static("public/assets/img/"))

app.use(function (req, res, next) {
    res.status(404).render('404.ejs');
});

module.exports = app