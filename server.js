require('dotenv').config()
const express = require('express')
const app = express()

const apiController = require('./controllers/api.controller')

app.use(apiController.path, apiController.router)
app.use(express.json());

module.exports = app