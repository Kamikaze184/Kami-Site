module.exports = class api_geral_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        routes.get("/ping", (req, res) => {
            res.status(200).end()
        })

        return { path: '/api/', router: routes }
    }
}