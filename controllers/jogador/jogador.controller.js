module.exports = class jogador_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        const jogadorService = require("../../services/jogador.service")
        const services = new jogadorService(client)

        routes.get("/", async (req, res) => {
            if (req.session.user) {
                const info = await services.getUser(req.session.user.id)
                res.render("jogador.ejs", {
                    session: req.session,
                    info: info
                });
            }
            else {
                res.redirect("/auth/login?redirect=/jogador")
            }
        })

        routes.get("/ficha/:ficha", async (req, res) => {
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
                res.redirect("/auth/login?redirect=/jogador/ficha/" + req.params.ficha)
            }
        })

        return { path: '/jogador/', router: routes }
    }
}