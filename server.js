require("colors")
require("dotenv").config()

const app = require("./src/app")

app.listen(process.env.PORT || 3001, () => {
    require("./src/modules/logger").info(`Servidor iniciado na porta ${process.env.PORT || 3001}`)
})