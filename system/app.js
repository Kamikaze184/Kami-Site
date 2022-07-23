const express = require("express")
const path = require("path")
const time = require("luxon").DateTime

module.exports = class App {
    constructor() {
        this.setDiscordRest();
        this.setLog();
        this.setDB();
        this.setCache();
        this.app = express();
        this.setMiddlewares();
        this.setSession();
        this.setControllers();
        this.setFunctions();
        this.setWebSocket();
    }

    setDiscordRest() {
        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v9");

        const rest = new REST({ version: "10" }).setToken(process.env.botToken);

        this.rest = rest
        this.rest.routes = Routes
    }

    setLog() {
        const log = require("./modules/logs.js")
        this.log = new log(this.rest)


        if (process.env.deploy == "production") {
            process.on("uncaughtException", (err) => {
                this.log.error(err, true)
            })

            process.on("unhandledRejection", (err) => {
                this.log.error(err, true)
            })

            // process.on("SIGTERM", async (signal) => {
            //     const axios = require("axios")
            //     const config = {
            //         method: 'post',
            //         url: `${process.env.botApiUrl}/log`,
            //         headers: {
            //             "Authorization": process.env.apiToken,
            //             "Content-Type": "application/json"
            //         },
            //         data: {
            //             "content": `Log KamiSite - ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}`,
            //             "log": this.log.logString(),
            //         }
            //     }

            //     try {
            //         const res = await axios(config)
            //         process.exit(0)
            //     }
            //     catch (err) {
            //         console.log(err)
            //         process.exit(1)
            //     }
            // })
        }

        this.log.start("Logs")
    }

    setDB() {
        const { Sequelize } = require("sequelize");

        function conStr(DATABASE_URL) {
            const dbURI = DATABASE_URL.replace("postgres://", "");
            const conStr = {
                database: dbURI.split("/")[1],
                username: dbURI.split(/@(?!.*@)/g)[0].split(":")[0],
                password: dbURI.split(/@(?!.*@)/g)[0].split(":")[1],
                host: dbURI.split(/@(?!.*@)/g)[1].split(":")[0],
                port: dbURI.split(/@(?!.*@)/g)[1].split(":")[1],
                logging: false,
                dialect: "postgres",
            }

            if (process.env.deploy == "production") {
                conStr["dialectOptions"] = {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                }
            }

            return conStr
        }

        const db = new Sequelize(conStr(process.env.DATABASE_URL));
        const dbBot = new Sequelize(conStr(process.env.BOT_DATABASE_URL))

        this.db = db
        this.dbBot = dbBot
        this.log.start("DB")
    }

    setCache() {
        const _utils = require("./modules/utils.js")
        this.utils = new _utils(this)

        const _cache = require("./modules/cache/cache.js")
        this.cache = new _cache(this)
    }

    setMiddlewares() {
        const cookieParser = require("cookie-parser");

        this.app.set("view engine", "ejs");
        this.app.set("views", path.join(__dirname, "..", "views"))
        this.app.set("public", path.join(__dirname, "..", "public"))

        this.app.use(express.json());
        this.app.use(express.static("public"));
        this.app.use(express.static("public/assets/tutoriais"))
        this.app.use(express.static("public/assets/img/"))

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        if (process.env.deploy === "production") {
            this.app.use((req, res, next) => {
                if (req.header("x-forwarded-proto") !== "https") {
                    res.redirect(`https://${req.header("host")}${req.url}`)
                }
                else {
                    next()
                }
            })
        }

        this.app.use((req, res, next) => {
            if (req.path.search("Roboto-Regular.ttf") != -1) {
                res.sendFile(path.join(__dirname, "..", "public", "assets", "fonts", "Roboto-Regular.ttf"))
            }
            else {
                next()
            }
        })

        this.app.use((req, res, next) => {
            this.log.info(`${req.method} ${req.path}`)
            next()
        })

        this.log.start("Middlewares")
    }

    setSession() {
        const session = require("express-session")
        const CryptoJS = require("crypto-js")

        let store = undefined
        if (process.env.deploy === "production") {
            const pg = require('pg');
            const pgSession = require('connect-pg-simple')(session);

            const pgPool = new pg.Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            });

            store = new pgSession({
                pool: pgPool,
                createTableIfMissing: true,
                schemaName: 'public'
            })
        }

        this.app.use(session({
            store: store,
            secret: process.env.sessionSecret,
            saveUninitialized: false,
            cookie: { maxAge: (1000 * 60 * 60 * 24) * 7 },
            resave: false,
            proxy: true,
            unset: "destroy",
            rolling: true,
            genid: (req) => {
                return CryptoJS.AES.encrypt(req.socket.localAddress + Date.now().toString(), process.env.sessionSecret).toString()
            }
        }));

        this.log.start("Session")
    }

    setControllers() {
        const handleControllers = require("../controllers/handle")
        const controllers = new handleControllers(this)

        for (var c in controllers.paths) {
            this.app.use(controllers.paths[c], controllers.routers[c])
        }

        this.app.use((req, res, next) => {
            res.status(404).render("404.ejs", { session: req.session });
        });

        this.log.start("Controllers")
    }

    setFunctions() {
        if (process.env.deploy == "production") {
            const pingBot = require("./modules/functions/pingBot.js")
            setInterval(() => { pingBot(this) }, 1000 * 60 * 5)
        }
    }

    setWebSocket() {
        const { io } = require("socket.io-client")
        const connUrl = process.env.deploy == "development" ? "http://localhost:3005/" : "https://kamikaze184bot.herokuapp.com/"

        const socket = new io(connUrl, {
            reconnectionDelayMax: 5000,
            query: {
                main: true
            },
            auth: {
                api_key: process.env.apiToken
            },
        })

        const servicesGeral = require("../services/geral.api.service")
        const services = new servicesGeral(this)

        socket.on("update", (data) => {
            services[data.action](data)
        })
    }

    start() {
        this.app.listen(process.env.PORT, function () {
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - Servidor iniciado na porta ${process.env.PORT}`.green.bold)
        });
    }
}