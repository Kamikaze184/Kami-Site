module.exports = class ficha_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        //const fichaService = require("../../services/ficha.service")
        //const services = new fichaService(client)

        routes.get("/:id/:nomerpg", async (req, res) => {
            res.render("fichaPublica.ejs", {
                session: req.session,
                //services: services
            });

        })

        return { path: '/ficha/', router: routes }
    }
}