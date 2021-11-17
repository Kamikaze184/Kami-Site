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

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("public/assets/tutoriais"))


module.exports = app