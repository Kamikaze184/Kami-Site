const prisma = require("../config/database")
const { Router } = require('express');
const routes = Router()

const cors = require('cors')
const corsConfig = {
    origin: process.env.corsAllow.split(",")
}

const geralServices = require('../../services/geral.api.service')
const services = new geralServices(prisma)

routes.get("/ping", (req, res) => {
    res.status(200).end()
})

routes.post("/status", cors(corsConfig), async (req, res) => {
    if (req.headers.authorization === process.env.apiToken) {
        try {
            await services.setStatus(req.body)
            res.status(200).end()
        }
        catch (err) {
            res.status(500).end()
            console.error(err, true)
        }
    }
    else {
        res.status(401).end()
    }
})

routes.post("/comandos", cors(corsConfig), async (req, res) => {
    if (req.headers.authorization === process.env.apiToken) {
        try {
            await services.setComandos(req.body)
            res.status(200).end()
        }
        catch (err) {
            res.status(500).end()
            console.error(err, true)
        }
    }
    else {
        res.status(401).end()
    }
})

module.exports = routes