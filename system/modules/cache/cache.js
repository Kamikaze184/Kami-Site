const fs = require("fs")
const path = require("path")

module.exports = class cache {
    constructor(client) {
        this.client = client

        this.client.db.query("select * from info")
            .then(result => {
                var configCache = new Map()

                configCache.set("status", result[0][0].status)
                configCache.set("comandos", result[0][0].comandos)

                configCache = Object.fromEntries(configCache)
                configCache = JSON.stringify(configCache)

                fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, { flag: "w" }, function (err) {
                    if (err) {
                        this.client.log.error(err, true)
                    }
                })

                this.client.log.start("Cache do botinfo")

            })
            .catch(err => this.client.log.error(err, true))
    }

    getStatus() {
        return require("./json/botinfo.json").status
    }

    getComandos() {
        return require("./json/botinfo.json").comandos
    }

    async setStatus(status) {
        var configCache = new Map()

        configCache.set("status", status)
        configCache.set("comandos", this.getComandos())

        configCache = Object.fromEntries(configCache)
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        await this.client.db.query(`update info set status = '${status}'`).catch(err => this.client.log.error(err, true))
    }

    async setComandos(comandos) {
        var configCache = new Map()

        configCache.set("status", this.getStatus())
        configCache.set("comandos", comandos)

        configCache = Object.fromEntries(configCache)
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        await this.client.db.query(`update info set comandos = '${comandos}'`).catch(err => this.client.log.error(err, true))
    }

}