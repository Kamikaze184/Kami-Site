const cache = require("../modules/cache/cache")

module.exports = {
    async setStatus(body) {
        await cache.setStatus(body)
    },

    async setComandos(body) {
        await cache.setComandos(body)
    },

    createFichaBot(body) {
        cache.updateFichasUser(body.id, body.nomerpg)
    },

    deleteFichaBot(body) {
        cache.deleteFichaUser(body.id, body.nomerpg)
    },

    updateFichaBot(body){
        cache.getFicha(body.id, body.nomerpg, true)
    },

    renameFichaBot(body){
        cache.deleteFichaUser(body.id, body.nomerpg)
        cache.updateFichasUser(body.id, body.novonomerpg)
        cache.getFicha(body.id, body.novonomerpg, true)
    }
}