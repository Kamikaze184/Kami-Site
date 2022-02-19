require("colors")
require("dotenv").config()

const _app = require("./system/app.js");
const app = new _app();

app.start();