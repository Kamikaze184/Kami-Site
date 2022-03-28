module.exports = class ficha_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        const fichaServices = require('../../services/ficha.api.service')
        const services = new fichaServices(client)

        routes.get("/:id/:nomerpg", async (req, res) => {
            const ficha = await services.getFicha(req.params.id, req.params.nomerpg)

            if (ficha) {
                res.render("fichaPublica.ejs", {
                    session: req.session,
                    services: services,
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                });
            }
            else {
                res.render("404.ejs", {
                    session: req.session,
                })
            }
        })

        return { path: '/ficha/', router: routes }
    }
}