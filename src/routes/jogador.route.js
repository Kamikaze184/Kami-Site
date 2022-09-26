const prisma = require("../config/database")
const { Router } = require('express');
const routes = Router()

const jogadorService = require("../services/jogador.service")
const services = new jogadorService(prisma)

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

        if (!ficha) {
            res.redirect("/jogador")
        }
        else {
            res.render("ficha.ejs", {
                session: req.session,
                ficha: ficha,
                atributos: ficha.atributos,
                services: services
            });
        }
    }
    else {
        res.redirect("/auth/login?redirect=/jogador/ficha/" + req.params.ficha)
    }
})

module.exports = routes