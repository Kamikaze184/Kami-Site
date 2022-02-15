const { Router } = require('express');
const routes = Router()

const tutoriais = require('../../public/assets/tutoriais/tutoriais');

const viewsServices = require('../../services/views.service')
const services = new viewsServices()

routes.get("/", async (req, res) => {
    const botinfo = await services.getBotinfo()
    res.render("index.ejs", {
        botStatus: botinfo,
        session: req.session
    });
});

routes.get("/comandos", async (req, res) => {
    const commands = new Map(Object.entries(await services.getCommands()))
    const boxSize = services.getBoxSize(commands)

    res.render("comandos.ejs", {
        comandos: commands,
        boxSize: boxSize,
        session: req.session
    })
});

routes.get("/tutoriais", async (req, res) => {
    if (req.query.search) {
        const result = services.tutorialSearchEngine(req.query.search, tutoriais)

        res.render("tutoriais.ejs", {
            queryResult: result.find,
            query: req.query.search,
            queryFind: result.queryFind,
            tutoriais: result.tutoriais,
            session: req.session
        })
    }
    else {
        res.render("tutoriais.ejs", {
            queryResult: null,
            query: null,
            queryFind: false,
            tutoriais: tutoriais,
            session: req.session
        })
    }
});

routes.get("/tutoriais/:tutorial", async (req, res) => {
    const tutorial = services.getTutorial(req.params.tutorial, tutoriais)

    res.render("tutorial.ejs", {
        tutorial: tutorial,
        session: req.session
    })
});

module.exports = { path: '/', router: routes }