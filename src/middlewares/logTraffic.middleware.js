module.exports = (req, res, next) => {
    console.info(`${req.method} ${req.path}`)
    next()
}