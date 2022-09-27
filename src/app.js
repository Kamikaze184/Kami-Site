require("colors")
require("dotenv").config()
const express = require("express")
const middlewares = require("./middlewares")
const routes = require("./routes")
const path = require("path")
const cookieParser = require("cookie-parser");

const app = express()

if (process.env.NODE_ENV == "production") {
    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
}

require("./config/database")

const rest = require("./modules/discordRest")
const Logger = require("./modules/logger")
new Logger(rest)

require("./modules/cache/cache")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())

app.use(middlewares)
app.use("/", routes)
app.use((req, res, next) => {
    res.status(404).render("404.ejs", { session: req.session });
});

module.exports = app
