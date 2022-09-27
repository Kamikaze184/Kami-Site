const { Router } = require('express');
const routes = Router()

const logger = require("../modules/logger")

const cors = require('cors')
const corsConfig = {
    origin: "*" // process.env.corsAllow.split(",")
}

const fichaServices = require('../services/ficha.api.service')

routes.post("/atb/add", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.updateAtbFicha(req.body)
            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.delete("/atb/remove", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.removeAtbFicha(req.body)

            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.post("/create", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.createFicha(req.body)
            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            logger.error(err)
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.patch("/update", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.updateFicha(req.body)

            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.patch("/rename", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.renameFicha(req.body)
            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.delete("/delete", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.deleteFicha(req.body)
            if (response.status == 200) {
                res.status(200).send(response.data)
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).end()
    }
})

routes.post("/password", cors(corsConfig), async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await fichaServices.getFichaWithPassword(req.body)

            if (response.status === 200) {
                req.session.access = {
                    [`${req.body.id}${req.body.nomerpg}`]: req.body.senha
                }
                req.session.cookie.maxAge = 1000 * 60 * 60 * 12

                res.status(200).json({ id: req.body.id, nomerpg: req.body.nomerpg })
            }
            else {
                res.status(response.status).send(response.data)
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        res.status(401).json({
            status: 401,
            title: "Falha na validação",
            text: "Este endpoint é somente para o servidor"
        })
    }
})

module.exports = routes