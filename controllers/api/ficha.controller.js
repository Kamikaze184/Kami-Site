const { Router } = require('express');
const routes = Router()

const fichaServices = require('../../services/ficha.api.service')
const services = new fichaServices()

routes.get("/ping", (req, res) => {
    res.status(200).end()
})

routes.post("/atb/add", async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            if (!req.body.extra) {
                const response = await services.sendAtb(req.body)
                if (response.status == 200) {
                    res.status(200).send(response.data)
                }
                else {
                    res.status(response.status).send(response.data)
                }
            }
            else if (req.body.extra) {
                const extraBody = services.prepareExtra(req.body)
                const response = await services.sendAtb(extraBody)
                if (response.status == 200) {
                    res.status(200).send(response.data)
                }
                else {
                    res.status(response.status).send(response.data)
                }
            }
            else {
                res.status(400).json({ message: `Atributo inválido`, atb: req.body.atb })
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

routes.delete("/atb/remove", async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            if (!req.body.extra) {
                const response = await services.removeAtb(req.body)
                if (response.status == 200) {
                    res.status(200).send(response.data)
                }
                else {
                    res.status(response.status).send(response.data)
                }
            }
            else if (req.body.extra) {
                const extraBody = services.prepareExtraRemove(req.body)
                const response = await services.removeAtb(extraBody)
                if (response.status == 200) {
                    res.status(200).send(response.data)
                }
                else {
                    res.status(response.status).send(response.data)
                }
            }
            else {
                res.status(400).json({ message: `Atributo inválido`, atb: req.body.atb })
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

routes.patch("/update", async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await services.updateFicha(req.body)
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

routes.delete("/delete", async (req, res) => {
    if (req.session.validation == process.env.validation) {
        try {
            const response = await services.deleteFicha(req.body)
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


module.exports = { path: '/api/ficha/', router: routes }