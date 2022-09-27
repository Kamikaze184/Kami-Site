const express = require("express")
const middlewares = require("./middlewares")
const routes = require("./routes")
const path = require("path")
const cookieParser = require("cookie-parser");

const app = express()

if (process.env.NODE_ENV == "production") {

}

app.use(express.json)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.set("public", path.join(__dirname, "public"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(middlewares)

app.use("/", routes)

module.exports = app
