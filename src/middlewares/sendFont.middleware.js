const path = require("path")

module.exports = (req, res, next) => {
    if (req.path.search("Roboto-Regular.ttf") != -1) {
        res.sendFile(path.join(__dirname, "..", "public", "assets", "fonts", "Roboto-Regular.ttf"))
    }
    else {
        next()
    }
}



