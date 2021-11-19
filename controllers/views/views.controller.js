const { Router } = require('express');
const routes = Router()

const tutoriais = require('../../public/assets/tutoriais/tutoriais');

const viewsServices = require('../../services/views.service')
const services = new viewsServices(require("../../db/index"))

routes.get("/", (req, res) => {
    const botinfo = services.getBotinfo()
    res.render("index.ejs", {
        botStatus: botinfo,
        inviteLink: botinfo.inviteLink || "https://discord.com/oauth2/authorize?client_id=716053210179043409&permissions=388160&scope=bot%20applications.commands"
    });
});

routes.get("/sobre", (req, res) => {
    const botinfo = services.getBotinfo()
    res.render("sobre.ejs", {
        inviteLink: botinfo.inviteLink || "https://discord.com/oauth2/authorize?client_id=716053210179043409&permissions=388160&scope=bot%20applications.commands"
    })
});

routes.get("/comandos", (req, res) => {
    const botinfo = services.getBotinfo()
    const commands = new Map(Object.entries(services.getCommands()))

    res.render("comandos.ejs", {
        comandos: commands,
        inviteLink: botinfo.inviteLink || "https://discord.com/oauth2/authorize?client_id=716053210179043409&permissions=388160&scope=bot%20applications.commands"
    })
});

routes.get("/tutoriais", (req, res) => {
    const commands = services.getCommands()
    const botinfo = services.getBotinfo()

    if (req.query.search) {
        const result = services.tutorialSearchEngine(req.query.search, tutoriais)

        res.render("tutoriais.ejs", {
            comandos: commands,
            inviteLink: botinfo.inviteLink,
            queryResult: result.find,
            query: req.query.search,
            queryFind: result.queryFind,
            tutoriais: result.tutoriais
        })

    }
    else {
        res.render("tutoriais.ejs", {
            comandos: commands,
            inviteLink: botinfo.inviteLink,
            queryResult: null,
            query: null,
            queryFind: false,
            tutoriais: tutoriais
        })
    }
});

routes.get("/tutoriais/:tutorial", (req, res) => {
    const botinfo = services.getBotinfo()
    const tutorial = services.getTutorial(req.params.tutorial, tutoriais)

    res.render("tutorial.ejs", {
        tutorial: tutorial,
        inviteLink: botinfo.inviteLink || "https://discord.com/oauth2/authorize?client_id=716053210179043409&permissions=388160&scope=bot%20applications.commands"
    })
});

module.exports = { path: '/', router: routes }