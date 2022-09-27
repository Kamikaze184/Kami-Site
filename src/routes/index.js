const { Router } = require("express")
const authRoute = require("./auth.route")
const fichaRoute = require("./ficha.route")
const jogadorRoute = require("./jogador.route")
const urlShortRoute = require("./urlShort.route")
const viewsRoute = require("./views.route")
const fichaApiRoute = require("./ficha.api.route")
const geralApiRoute = require("./geral.api.route")

const router = Router()

router.use("/api/ficha", fichaApiRoute)
router.use("/api", geralApiRoute)
router.use("/", urlShortRoute)
router.use("/auth", authRoute)
router.use("/ficha", fichaRoute)
router.use("/jogador", jogadorRoute)
router.use("/", viewsRoute)

module.exports = router