const logger = require("../modules/logger")

module.exports = (req, res, next) => {
    logger.info(`${req.method} ${req.path}`)
    next()
}