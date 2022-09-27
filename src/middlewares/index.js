const { Router } = require("express")

const sendFont = require("./sendFont.middleware")
const logTraffic = require("./logTraffic.middleware")

const router = Router()

router.use(sendFont)
router.use(logTraffic)

module.exports = router