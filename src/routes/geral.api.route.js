const { Router } = require("express");
const routes = Router()

const cors = require("cors")
const corsConfig = {
    origin: process.env.CORS_ALLOW.split(",")
}

const logger = require("../modules/logger")

const geralServices = require("../services/geral.api.service")

const { json } = require("express");
routes.use(json)

routes.get("/ping", (req, res) => {
    res.status(200).end()
})

routes.post("/status", cors(corsConfig), async (req, res) => {
    if (req.headers.authorization === process.env.API_TOKEN) {
        try {
            await geralServices.setStatus(req.body)
            res.status(200).end()
        }
        catch (err) {
            res.status(500).end()
            logger.error(err, true)
        }
    }
    else {
        res.status(401).end()
    }
})

routes.post("/comandos", cors(corsConfig), async (req, res) => {
    if (req.headers.authorization === process.env.API_TOKEN) {
        try {
            await geralServices.setComandos(req.body)
            res.status(200).end()
        }
        catch (err) {
            res.status(500).end()
            logger.error(err, true)
        }
    }
    else {
        res.status(401).end()
    }
})

module.exports = routes