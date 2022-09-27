const fs = require("fs")
const path = require("path")
const toMs = require("milliseconds-parser")()
const LRU = require("@alanfilho184/kami-lru-cache").kami_cache
const { QueryTypes } = require('sequelize');

const fichas = new LRU({ maxAge: toMs.parse("2 horas"), updateAgeOnGet: true })
const beta = new Set()

const db = require("../../config/database")
const logger = require("../logger")
const utils = require("../functions/utils")

class Cache {
    constructor() {
        db.site.query("select * from info")
            .then(result => {
                var configCache = new Map()

                configCache.set("status", result[0][0].status)
                configCache.set("comandos", result[0][0].comandos)

                configCache = Object.fromEntries(configCache)
                configCache = JSON.stringify(configCache)

                fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, { flag: "w" }, function (err) {
                    if (err) {
                        logger.error(err, true)
                    }
                })

                logger.start("Cache do botinfo")

            })
            .catch(err => logger.error(err, true))

        db.bot.query(`select id from beta`)
            .then(result => {
                result[0].forEach(betaUser => {
                    beta.add(betaUser.id)
                })
                logger.start("Usuários da beta setados")
            })
            .catch(err => logger.error(err, true))

        db.bot.query("select id, nomerpg from fichas")
            .then(result => {
                const fichasUsers = new Object()
                let usuarios = new Array()


                for (var x of result[0]) {
                    usuarios.push(x.id)
                }

                usuarios.forEach(u => {
                    let fichasUser = new Array()
                    for (var x of result[0]) {
                        if (x.id == u) {
                            fichasUser.push(x.nomerpg == null ? "undefined" : x.nomerpg)
                        }
                    }
                    fichasUsers[u] = fichasUser
                })

                fs.writeFileSync(path.join(__dirname, "json", 'nomeFichas.json'), JSON.stringify(fichasUsers), { flag: "w" }, function (err) {
                    if (err) {
                        logger.error(err, true)
                    }
                })

                logger.start("Cache de nome das fichas")
            })
            .catch(err => { logger.error(err, true) })
    }

    getStatus() {
        return require("./json/botinfo.json").status
    }

    getComandos() {
        return require("./json/botinfo.json").comandos
    }

    async getFicha(id, nomerpg, force = false) {
        var ficha = fichas.get(id + nomerpg)

        if (ficha && !force) { return ficha } else {
            var r = await db.bot.query(`select * from fichas where id = :id and nomerpg = :nomerpg`, {
                replacements: { id: id, nomerpg: nomerpg },
            })

            if (r[0][0]) { fichas.set(id + nomerpg, r[0][0]) }
            return r[0][0]
        }
    }

    getFichasUser(id) {
        var result = fs.readFileSync(path.join(__dirname, "json", `nomeFichas.json`), "utf-8")
        result = JSON.parse(result)

        if (result[id] == undefined) {
            return new Array()
        }
        else {
            return result[id]
        }
    }

    async setStatus(status) {
        var configCache = require("./json/botinfo.json")

        configCache.status = status
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                logger.error(err, true)
            }
        })

        await db.site.query(`update info set status = '${JSON.stringify(status)}'`).catch(err => logger.error(err, true))
    }

    async setComandos(comandos) {
        var configCache = require("./json/botinfo.json")

        configCache.comandos = comandos
        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", 'botinfo.json'), configCache, function (err) {
            if (err) {
                logger.error(err, true)
            }
        })

        await db.site.query(`update info set comandos = '${JSON.stringify(comandos)}'`).catch(err => logger.error(err, true))
    }

    getFichaPublica(key) {
        return fichas.get(key)
    }

    setFichaPublica(key, ficha) {
        fichas.set(key, ficha)
    }

    isBeta(id) {
        if (beta.has(id)) {
            return true
        }
        else {
            return false
        }
    }

    refreshBeta() {
        db.bot.query(`select id from beta`)
            .then(result => {
                result[0].forEach(betaUser => {
                    beta.add(betaUser.id)
                })
                logger.info("Usuários da beta setados")
            })
            .catch(err => logger.error(err, true))
    }

    async updateFicha(id, nomerpg, data, config) {
        config = {
            ...config,
            query: config.query || "update"
        }

        if (config.query == "insert") {
            var atributos = {
                ...data
            }

            const atbTest = Object.entries(atributos)

            atbTest.forEach((e) => {
                e[1] = e[1].replaceAll(" ", "").toLowerCase()
                if (e[1] == null || e[1] == undefined || e[1] === "" || e[1] === " " || e[1] == "undefined" || e[1] == "null" || e[1] == "excluir" || e[1] == "delete" || e[1] == "-") {
                    delete atributos[e[0]]
                }
            })

            const senha = utils.gerarSenha()
            const lastuse = utils.getPostgresTime()

            await db.bot.query(`insert into fichas (id, nomerpg, senha, lastuse, atributos) values (:id, :nomerpg, :senha, :lastuse, :atributos)`, {
                replacements: {
                    id: id,
                    nomerpg: nomerpg,
                    senha: senha,
                    lastuse: lastuse,
                    atributos: JSON.stringify(atributos)
                },
                type: QueryTypes.INSERT
            })

            fichas.set(`${id}${nomerpg}`, { id: id, nomerpg: nomerpg, senha: senha, lastuse: lastuse, atributos: atributos })
            this.updateFichasUser(id, nomerpg)

            return { id: id, nomerpg: nomerpg, senha: senha, lastuse: lastuse, atributos: atributos }
        }
        else if (config.query == "update") {
            config = {
                ...config,
                resetarSenha: config.resetarSenha || false,
                oldData: config.oldData || await this.getFicha(id, nomerpg),
            }

            if(!config.oldData.atributos) {
                config.oldData.atributos = {}
            }

            if (Object.entries(config.oldData.atributos).length == 0) {
                var oldData = await db.bot.query("select * from fichas where id = :id and nomerpg = :nomerpg", {
                    replacements: {
                        id: id,
                        nomerpg: nomerpg
                    }
                })

                config.oldData = oldData[0][0]
            }

            if (config.resetarSenha) {
                const lastuse = utils.getPostgresTime()

                await db.bot.query(`update fichas set senha = :senha, lastuse = :lastuse where id = :id and nomerpg = :nomerpg`, {
                    replacements: {
                        id: id,
                        nomerpg: nomerpg,
                        senha: config.resetarSenha,
                        lastuse: lastuse
                    },
                    type: QueryTypes.UPDATE
                })

                fichas.set(`${id}${nomerpg}`, { id: id, nomerpg: nomerpg, senha: config.resetarSenha, lastuse: lastuse, atributos: config.oldData.atributos })
                this.updateFichasUser(id, nomerpg)

                return { id: id, nomerpg: nomerpg, senha: config.resetarSenha, lastuse: lastuse, atributos: config.oldData.atributos }
            }
            else {
                var atributos = {
                    ...config.oldData.atributos,
                    ...data
                }

                const atbTest = Object.entries(atributos)

                atbTest.forEach((e) => {
                    try { e[1] = e[1].replaceAll(" ", "").toLowerCase() } catch (err) { }
                    if (e[1] == null || e[1] == undefined || e[1] === "" || e[1] == "undefined" || e[1] == "null" || e[1] == "excluir" || e[1] == "delete" || e[1] == "-") {
                        delete atributos[e[0]]
                    }
                })

                const lastuse = utils.getPostgresTime()

                await db.bot.query(`update fichas set atributos = :atributos, lastuse = :lastuse where id = :id and nomerpg = :nomerpg`, {
                    replacements: {
                        id: id,
                        nomerpg: nomerpg,
                        lastuse: lastuse,
                        atributos: JSON.stringify(atributos)
                    },
                    type: QueryTypes.UPDATE
                })

                fichas.set(id + nomerpg, { id: id, nomerpg: nomerpg, senha: config.oldData.senha, lastuse: lastuse, atributos: atributos })

                return { id: id, nomerpg: nomerpg, senha: config.oldData.senha, lastuse: lastuse, atributos: atributos }
            }
        }
    }

    updateFichasUser(id, nomerpg) {
        let uInfo = this.getFichasUser(id)

        if (!uInfo) {
            uInfo = new Array()
        }

        if (!uInfo.includes(nomerpg)) { uInfo.push(nomerpg) }
        let nomeFichasCache = require("./json/nomeFichas.json")

        nomeFichasCache[id] = uInfo
        nomeFichasCache = JSON.stringify(nomeFichasCache)

        fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
            if (err) {
                logger.error(err, true)
            }
        })
    }

    deleteFicha(id, nomerpg) {
        fichas.delete(id + nomerpg)
        this.deleteFichaUser(id, nomerpg)
    }

    deleteFichaUser(id, nomerpg) {
        let uInfo = this.getFichasUser(id)
        let newUInfo = new Array()

        uInfo.forEach((f) => {
            if (f !== nomerpg) {
                newUInfo.push(f)
            }
        })

        let nomeFichasCache = require("./json/nomeFichas.json")

        nomeFichasCache[id] = newUInfo
        nomeFichasCache = JSON.stringify(nomeFichasCache)

        fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
            if (err) {
                logger.error(err, true)
            }
        })
    }

}

const cache = new Cache()

module.exports = cache