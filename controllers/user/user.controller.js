module.exports = class user_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        const userService = require("../../services/user.service")
        const services = new userService(client)

        routes.get("/jogador", async (req, res) => {
            if (req.session.user) {
                const info = await services.getUser(req.session.user.id)
                res.render("jogador.ejs", {
                    session: req.session,
                    info: info
                });
            }
            else {
                res.redirect("/auth/login")
            }
        })

        routes.get("/jogador/ficha/:ficha", async (req, res) => {
            if (req.session.user) {
                const ficha = await services.getFicha(req.session.user.id, req.params.ficha)

                res.render("ficha.ejs", {
                    session: req.session,
                    ficha: ficha,
                    atributos: ficha.atributos,
                    services: services
                });
            }
            else {
                res.redirect("/auth/login")
            }
        })

        return { path: '/user/', router: routes }
    }
}