const time = require("luxon").DateTime
const { inspect } = require("util")
var logTxt = `Log - ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}\n`

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
rest.routes = Routes

module.exports = {
    async send(msg) {
        const res = await rest.post(
            rest.routes.webhook(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN),
            {
                headers: { "Content-Type": "application/json" },
                body: msg
            }
        )

        return res
    },
    info(msg, ds) {
        if (typeof msg === "string") {
            logTxt += `[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}\n`

            console.log(`[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}`.green)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n"
            logTxt += `---------------- [ FIM DA INFO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------`.green);
            console.log(msg);
            console.log(`---------------- [ FIM DA INFO ] ----------------`.green)
        }

        if (ds === true) {
            msg = typeof msg === "string" ? msg : inspect(msg, { depth: 99 })
            this.send({
                embeds: [{
                    title: "INFO",
                    description: "```js\n" + msg + "```",
                    color: process.env.EMBED_COLOR,
                    footer: {
                        text: `Informação em: ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")} (GMT -3)`,
                        icon_url: process.env.AVATAR_URL
                    }
                }]
            })
        }
    },
    start(msg, ds) {
        logTxt += `[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}\n`
        console.log(`[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}`.cyan)
        
        if (ds === true) {
            this.send({
                embeds: [{
                    title: "INICIADO",
                    description: "```js\n" + msg + "```",
                    color: process.env.EMBED_COLOR,
                    footer: {
                        text: `Iniciado em: ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")} (GMT -3)`,
                        icon_url: process.env.AVATAR_URL
                    }
                }]
            })
        }
    },
    warn(msg, ds) {
        if (typeof msg === "string") {
            logTxt += `[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}`.yellow)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------\n`
            logTxt += msg + "\n"
            logTxt += `---------------- [ FIM DO AVISO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------`.yellow);
            console.log(msg);
            console.log(`---------------- [ FIM DO AVISO ] ----------------`.yellow);
        }

        if (ds === true) {
            msg = typeof msg === "string" ? msg : inspect(msg, { depth: 99 })
            this.send({
                content: `<@${process.env.OWNER_ID}>`,
                embeds: [{
                    title: "AVISO",
                    description: "```js\n" + msg + "```",
                    color: process.env.EMBED_COLOR,
                    footer: {
                        text: `Aviso em: ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")} (GMT -3)`,
                        icon_url: process.env.AVATAR_URL
                    }
                }]
            })
        }
    },
    error(msg, ds) {
        if (typeof msg === "string") {
            logTxt += `[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}`.red)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n"
            logTxt += `---------------- [ FIM DO ERRO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------`.red);
            console.log(msg);
            console.log(`---------------- [ FIM DO ERRO ] ----------------`.red)
        }

        if (ds === true) {
            msg = typeof msg === "string" ? msg : inspect(msg, { depth: 99 })
            msg = `${String(msg).slice(0, 4000) + (msg.length >= 4000 ? "..." : "")}`

            try {
                this.send({
                    content: `<@${process.env.OWNER_ID}>`,
                    embeds: [{
                        title: "ERRO",
                        description: "```js\n" + msg + "```",
                        color: process.env.EMBED_COLOR,
                        footer: {
                            text: `Erro em: ${time.now().setZone("America/Sao_Paulo").toFormat("dd/MM/y | HH:mm:ss ")} (GMT -3)`,
                            icon_url: process.env.AVATAR_URL
                        }
                    }]
                })
            }
            catch (err) { process.emit("SIGTERM") }
        }
    },
    logString() {
        return logTxt
    }
}