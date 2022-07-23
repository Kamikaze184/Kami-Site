class geralService {
    constructor(client) {
        this.client = client
    }

    async setStatus(body) {
        await this.client.cache.setStatus(body)
    }

    async setComandos(body) {
        await this.client.cache.setComandos(body)
    }

    createFichaBot(body) {
        this.client.cache.updateFichasUser(body.id, body.nomerpg)
    }

    deleteFichaBot(body) {
        this.client.cache.deleteFichaUser(body.id, body.nomerpg)
    }

    updateFichaBot(body){
        this.client.cache.getFicha(body.id, body.nomerpg, true)
    }

    renameFichaBot(body){
        this.client.cache.deleteFichaUser(body.id, body.nomerpg)
        this.client.cache.updateFichasUser(body.id, body.novonomerpg)
        this.client.cache.getFicha(body.id, body.novonomerpg, true)
    }
}

module.exports = geralService