const prisma = require("../config/database")
const { Router } = require('express');
const routes = Router()

const tutoriais = require('../public/assets/tutoriais/tutoriais');

const viewsServices = require('../services/views.service')
const services = new viewsServices(prisma)

routes.get("/", (req, res) => {
    const botinfo = services.getBotinfo()
    res.render("index.ejs", {
        botStatus: botinfo,
        session: req.session
    });
});

routes.get("/comandos", (req, res) => {
    const commands = new Map(Object.entries(services.getCommands()))
    const boxSize = services.getBoxSize(commands)

    res.render("comandos.ejs", {
        comandos: commands,
        boxSize: boxSize,
        session: req.session
    })
});

routes.get("/tutoriais", (req, res) => {
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

routes.get("/tutoriais/:tutorial", (req, res) => {
    const tutorial = services.getTutorial(req.params.tutorial, tutoriais)

    res.render("tutorial.ejs", {
        tutorial: tutorial,
        session: req.session
    })
});

module.exports = routes