const { Router } = require("express")

const sendFont = require("./sendFont.middleware")
const sessionParser = require("./sessionParser.middleware")
const logTraffic = require("./logTraffic.middleware")

const router = Router()

router.use(sendFont)
router.use(sessionParser)
router.use(logTraffic)

module.exports = router