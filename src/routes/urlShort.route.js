const { Router } = require('express');
const routes = Router()

const urlShortServices = require("../services/urlShort.service")

routes.get("/termos", (req, res) => {
    res.redirect("https://docs.google.com/document/d/1PneTS5LFyqqrMgpwht8nEHMg8H6BaszzoraWjsbR4k0")
});

routes.get("/terms", (req, res) => {
    res.redirect("https://docs.google.com/document/d/1mctX2GQQukx6Y0TMDXj-J1wYjDqOqbAhRwoqsJOYRaE")
});

routes.get("/privacidade", (req, res) => {
    res.redirect("https://docs.google.com/document/d/1ei3UdKmaVShQuQ4OFvZm5sWTR4_5oyYerRP-OkneECM")
});

routes.get("/privacy", (req, res) => {
    res.redirect("https://docs.google.com/document/d/1zu7o9mjeV1Mt2aLaJ7v6sVW0-CXuVwj8O13cVMtjCWs")
});

routes.get("/convite", (req, res) => {
    const inviteLink = urlShortServices.getInviteLink()
    res.redirect(inviteLink)
})

routes.get("/invite", (req, res) => {
    const inviteLink = urlShortServices.getInviteLink()
    res.redirect(inviteLink)
})

routes.get("/suporte", (req, res) => {
    res.redirect("https://discord.com/invite/9rqCkFB")
})

routes.get("/support", (req, res) => {
    res.redirect("https://discord.com/invite/9rqCkFB")
})

module.exports = routes