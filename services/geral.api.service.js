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

}

module.exports = geralService