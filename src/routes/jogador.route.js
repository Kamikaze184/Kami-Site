const { Router } = require("express");
const routes = Router()

const jogadorServices = require("../services/jogador.service")

routes.get("/", async (req, res) => {
    if (req.session.user) {
        const info = await jogadorServices.getUser(req.session.user.id)
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
        const ficha = await jogadorServices.getFicha(req.session.user.id, req.params.ficha)

        if (!ficha) {
            res.redirect("/jogador")
        }
        else {
            res.render("ficha.ejs", {
                session: req.session,
                ficha: ficha,
                atributos: ficha.atributos,
                services: jogadorServices
            });
        }
    }
    else {
        res.redirect("/auth/login?redirect=/jogador/ficha/" + req.params.ficha)
    }
})

module.exports = routes