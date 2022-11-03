const { Router } = require("express");
const routes = Router()
const crypto = require("crypto-js")

const authServices = require("../services/auth.service")

routes.get("/login", (req, res) => {
    if (req.query.redirect) {
        res.cookie("redirect", req.query.redirect, { maxAge: 1000 * 60 * 10 })
    }

    if (process.env.NODE_ENV == "development") {
        const session = new Object()
        session.user = {
            id: "252868463150759961",
            username: "Kamikaze_184",
            avatar: "db949980e5d2a66ab559251404a9b747",
            discriminator: "7417",
            avatarURL: "https://cdn.discordapp.com/avatars/252868463150759961/db949980e5d2a66ab559251404a9b747.webp?size=128",
        }
        session.validation = process.env.VALIDATION

        const sessionToken = crypto.AES.encrypt(JSON.stringify(session), process.env.SESSION_SECRET).toString()

        res.cookie("session", sessionToken, { maxAge: 1000 * 60 * 60 * 24 * 7 })
        res.redirect(req.query.redirect || "/")
    }
    else if (process.env.NODE_ENV == "production") {
        res.redirect(`${process.env.OAUTH_URI}`)
    }
})

routes.get("/logout", (req, res) => {
    res.clearCookie("session")
    res.redirect("/")
})

routes.get("/callback", async (req, res) => {
    const code = req.query.code

    if (code) {
        const userInfo = await authServices.getUserInfo(code)

        const session = req.session;
        session.user = userInfo
        session.validation = process.env.VALIDATION

        const sessionToken = crypto.AES.encrypt(JSON.stringify(session), process.env.SESSION_SECRET)
        res.cookie("session", sessionToken, { maxAge: 1000 * 60 * 60 * 24 * 7 })

        const redirect = req.cookies.redirect || "/"

        res.clearCookie("redirect")
        res.redirect(redirect)
    }
    else {
        res.redirect("/")
    }
})

module.exports = routes

