module.exports = class api_geral_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        const geralServices = require('../../services/geral.api.service')
        const services = new geralServices(client)

        routes.get("/ping", (req, res) => {
            res.status(200).end()
        })

        routes.post("/status", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    await services.setStatus(req.body)
                    res.status(200).end()
                }
                catch (err) {
                    res.status(500).end()
                    this.client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
            }
        })

        routes.post("/comandos", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    await services.setComandos(req.body)
                    res.status(200).end()
                }
                catch (err) {
                    res.status(500).end()
                    this.client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
            }
        })

        return { path: '/api/', router: routes }
    }
}