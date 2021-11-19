const { Router } = require('express');
const routes = Router()

const tutoriais = require('../../public/assets/tutoriais/tutoriais');

const viewsServices = require('../../services/views.service')
const services = new viewsServices()

routes.get("/", async (req, res) => {
    const botinfo = await services.getBotinfo()
    res.render("index.ejs", {
        botStatus: botinfo,
        inviteLink: botinfo.inviteLink 
    });
});

routes.get("/sobre", async (req, res) => {
    const botinfo = await services.getBotinfo()
    res.render("sobre.ejs", {
        inviteLink: botinfo.inviteLink 
    })
});

routes.get("/comandos", async (req, res) => {
    const botinfo = await services.getBotinfo()
    const commands = new Map(Object.entries(await services.getCommands()))

    res.render("comandos.ejs", {
        comandos: commands,
        inviteLink: botinfo.inviteLink 
    })
});

routes.get("/tutoriais", async (req, res) => {
    const botinfo = await services.getBotinfo()

    if (req.query.search) {
        const result = services.tutorialSearchEngine(req.query.search, tutoriais)

        res.render("tutoriais.ejs", {
            inviteLink: botinfo.inviteLink,
            queryResult: result.find,
            query: req.query.search,
            queryFind: result.queryFind,
            tutoriais: result.tutoriais
        })

    }
    else {
        res.render("tutoriais.ejs", {
            inviteLink: botinfo.inviteLink,
            queryResult: null,
            query: null,
            queryFind: false,
            tutoriais: tutoriais
        })
    }
});

routes.get("/tutoriais/:tutorial", async (req, res) => {
    const botinfo = await services.getBotinfo()
    const tutorial = services.getTutorial(req.params.tutorial, tutoriais)

    res.render("tutorial.ejs", {
        tutorial: tutorial,
        inviteLink: botinfo.inviteLink 
    })
});

module.exports = { path: '/', router: routes }