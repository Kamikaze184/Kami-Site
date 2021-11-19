const { Router, json } = require('express')
const routes = Router()

const apiServices = require('../../services/api.services')
const services = new apiServices()

routes.use(json())

routes.post("/botinfo", (req, res) => {
    if (req.headers.authorization === process.env.apiToken) {
        try {
            services.saveBotinfo(req.body)
            res.status(200).send({
                message: "Ok"
            })
        }
        catch (err) {
            res.status(500).send({
                message: "Internal Server Error"
            })
            throw new Error(err)
        }
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
})

routes.post("/comandos", (req, res) => {
    if (req.headers.authorization === process.env.apiToken) {
        try {
            services.saveCommands(req.body)
            res.status(200).send({
                message: "Ok"
            })
        }
        catch (err) {
            res.status(500).send({
                message: "Internal Server Error"
            })
            throw new Error(err)
        }
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
})

routes.get("/botinfo", (req, res) => {
    if (req.headers.authorization === process.env.apiToken) {
        try {
            const botinfo = services.getBotinfo()
            res.json(botinfo).end()
        }
        catch (err) {
            res.status(500).send({
                message: "Internal Server Error"
            })
            throw new Error(err)
        }
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
})

routes.get("/comandos", (req, res) => { 
    if (req.headers.authorization === process.env.apiToken) {
        try {
            const comandos = services.getCommands()
            res.json(comandos).end()
        }
        catch (err) {
            res.status(500).send({
                message: "Internal Server Error"
            })
            throw new Error(err)
        }
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
})

module.exports = { path: "/api/v1", router: routes }