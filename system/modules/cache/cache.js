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
        var configCache = require("./json/botinfo.json")

        configCache.status = status
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        await this.client.db.query(`update info set status = '${JSON.stringify(status)}'`).catch(err => this.client.log.error(err, true))
    }

    async setComandos(comandos) {
        var configCache = require("./json/botinfo.json")

        configCache.comandos = comandos
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        await this.client.db.query(`update info set comandos = '${JSON.stringify(comandos)}'`).catch(err => this.client.log.error(err, true))
    }

}