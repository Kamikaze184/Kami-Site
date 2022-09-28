require("colors")
require("dotenv").config()
const express = require("express")
const middlewares = require("./middlewares")
const routes = require("./routes")
const path = require("path")
const cookieParser = require("cookie-parser");
const helmet = require("helmet")
const favicon = require("serve-favicon")

const app = express()

require("./config/database")
require("./modules/logger")
require("./modules/cache/cache")
require("./modules/websocket")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())
app.use(favicon(path.join(__dirname, "public", "assets", "img", "favicon.ico")))

if (process.env.NODE_ENV == "production") {
    app.use(helmet())
}

app.use(middlewares)
app.use("/", routes)
app.use((req, res, next) => {
    res.status(404).render("404.ejs", { session: req.session });
});

module.exports = app
