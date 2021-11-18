const { default: axios } = require("axios")

class apiServices {
    constructor(db) {
        this.db = db.db
    }

    saveBotinfo(botinfo) {
        try {
            this.db.set("botinfo", botinfo)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    saveCommands(commands) {
        try {
            this.db.set("commands", commands)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async getBotinfo() {
        const res = await axios.get(`${process.env.apiUrl}/botinfo`, {
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            }
        })

        this.saveBotinfo(res.data)

        if (res.data.oldInfo) {
            setTimeout(async () => {
                const res = await axios.get(`${process.env.apiUrl}/botinfo`, {
                    headers: {
                        "Authorization": process.env.apiToken,
                        "Content-Type": "application/json"
                    }
                })

                this.saveBotinfo(res.data)
            }, 20 * 60 * 1000)

        }

        setInterval(async () => {
            const res = await axios.get(`${process.env.apiUrl}/botinfo`, {
                headers: {
                    "Authorization": process.env.apiToken,
                    "Content-Type": "application/json"
                }
            })

            this.saveBotinfo(res.data)
        }, 20 * 60 * 1000)
    }

    async getCommands() {
        const res = await axios.get(`${process.env.apiUrl}/comandos`, {
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            }
        })

        this.saveCommands(res.data)

        setInterval(async () => {
            const res = await axios.get(`${process.env.apiUrl}/comandos`, {
                headers: {
                    "Authorization": process.env.apiToken,
                    "Content-Type": "application/json"
                }
            })

            this.saveCommands(res.data)
        }, 20 * 60 * 1000)
    }
}

module.exports = apiServices