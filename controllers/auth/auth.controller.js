module.exports = class auth_controller {
    constructor(client) {
        const { Router } = require('express');
        const routes = Router()

        const authServices = require('../../services/auth.service')
        const services = new authServices(client)

        routes.get("/login", (req, res) => {
            if (process.env.deploy == "development") {
                const session = req.session
                session.user = {
                    id: '252868463150759961',
                    username: 'Kamikaze_184',
                    avatar: '347aa6655964484ff3f10e74c1170c1c',
                    discriminator: '7417',
                    avatarURL: 'https://cdn.discordapp.com/avatars/252868463150759961/347aa6655964484ff3f10e74c1170c1c.png?size=128',
                }
                session.validation = process.env.validation
                res.redirect('/')
            }
            else if (process.env.deploy == "production") {
                res.redirect(`${process.env.oauthUri}`)
            }
        })

        routes.get("/logout", (req, res) => {
            req.session.destroy()
            res.redirect('/')
        })

        routes.get("/callback", async (req, res) => {
            const code = req.query.code

            if (code) {
                const userInfo = await services.getUserInfo(code)

                // if (userInfo.isBeta) {

                const session = req.session;
                session.user = userInfo
                session.validation = process.env.validation

                res.redirect("/")
                // }
                // else {
                //     res.render("beta.ejs", {
                //         session: req.session
                //     });
                // }
            }
            else {
                res.redirect("/")
            }
        })

        return { path: '/auth/', router: routes }
    }
}