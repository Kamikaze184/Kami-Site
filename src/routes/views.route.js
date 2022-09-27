const { Router } = require('express');
const routes = Router()

const tutoriais = require('../public/assets/tutoriais/tutoriais');

const viewsServices = require('../services/views.service')

routes.get("/", (req, res) => {
    const botinfo = viewsServices.getBotinfo()
    res.render("index.ejs", {
        botStatus: botinfo,
        session: req.session
    });
});

routes.get("/comandos", (req, res) => {
    const commands = new Map(Object.entries(viewsServices.getCommands()))
    const boxSize = viewsServices.getBoxSize(commands)

    res.render("comandos.ejs", {
        comandos: commands,
        boxSize: boxSize,
        session: req.session
    })
});

routes.get("/tutoriais", (req, res) => {
    if (req.query.search) {
        const result = viewsServices.tutorialSearchEngine(req.query.search, tutoriais)

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

routes.get("/tutoriais/:tutorial", (req, res) => {
    const tutorial = viewsServices.getTutorial(req.params.tutorial, tutoriais)

    res.render("tutorial.ejs", {
        tutorial: tutorial,
        session: req.session
    })
});

module.exports = routes