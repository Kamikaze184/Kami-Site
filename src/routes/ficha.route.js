const { Router } = require('express');
const routes = Router()

const fichaServices = require('../services/ficha.api.service')

const jogadorServices = require("../services/jogador.service")

routes.get("/:id/:nomerpg", async (req, res) => {
    let userid = 0
    if (req.session.user) {
        userid = req.session.user.id
    }

    if (userid == req.params.id) {
        try {
            const ficha = await fichaServices.getFicha(req.params.id, req.params.nomerpg)

            let previewInfo = undefined

            if (ficha) {
                previewInfo = {
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                    atributos: {
                        imagem: ficha.atributos.imagem ? ficha.atributos.imagem : undefined,
                    }
                }

                res.render("ficha.ejs", {
                    session: req.session,
                    ficha: ficha,
                    atributos: ficha.atributos,
                    services: jogadorServices,
                    previewInfo: previewInfo,
                });
            }
            else {
                res.render("404.ejs", {
                    session: req.session,
                })
            }
        }
        catch (err) {
            res.status(500).end()
        }
    }
    else {
        req.session.validation = process.env.validation

        let accessKey
        try { accessKey = req.session.access[`${req.params.id}${req.params.nomerpg}`] } catch (err) { accessKey = null }

        if (accessKey) {
            const response = await fichaServices.getFichaWithPassword({ id: req.params.id, nomerpg: req.params.nomerpg, senha: accessKey })

            let previewInfo = undefined

            if (response.status == 200) {
                previewInfo = {
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                    atributos: {
                        imagem: response.data.ficha.atributos.imagem ? response.data.ficha.atributos.imagem : undefined,
                    }
                }

                res.render("fichaPublica.ejs", {
                    session: req.session,
                    services: services,
                    ficha: response.data.ficha,
                    atributos: response.data.ficha.atributos,
                    jogadorServices: jogadorServices,
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                    previewInfo: previewInfo,
                })
            }
            else {
                res.render("404.ejs", {
                    session: req.session,
                })
            }
        }
        else {
            const ficha = await fichaServices.getFicha(req.params.id, req.params.nomerpg)

            let previewInfo = undefined

            if (ficha) {
                previewInfo = {
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                    atributos: {
                        imagem: ficha.atributos.imagem ? ficha.atributos.imagem : undefined,
                    }
                }

                res.render("fichaPublica.ejs", {
                    session: req.session,
                    services: services,
                    id: req.params.id,
                    nomerpg: req.params.nomerpg,
                    ficha: null,
                    previewInfo: previewInfo,
                });
            }
            else {
                res.render("404.ejs", {
                    session: req.session,
                })
            }
        }
    }
})

module.exports = routes