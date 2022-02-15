const { Router } = require('express');
const routes = Router()

routes.get("/ping", (req, res) => {
    res.status(200).end()
})

module.exports = { path: '/api/', router: routes }