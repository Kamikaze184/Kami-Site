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
        status = JSON.stringify(status)
        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), status, { flag: "w" }, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        this.client.db.query(`update info set status = '${status}'`).catch(err => this.client.log.error(err, true))
    }

    async setComandos(comandos) {
        comandos = JSON.stringify(comandos)
        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), comandos, { flag: "w" }, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        this.client.db.query(`update info set comandos = '${comandos}'`).catch(err => this.client.log.error(err, true))
    }

}