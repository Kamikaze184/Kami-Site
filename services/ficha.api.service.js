const axios = require('axios')

class fichaService {
    constructor(client) {
        this.client = client
    }

    async getFicha(id, nomerpg) {
        const config = {
            method: 'get',
            url: `${process.env.botApiUrl}/ficha`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": id,
                "nomerpg": nomerpg
            }
        }

        const res = await axios(config)

        return res.data
    }

    async getFichaWithPassword(body) {
        const config = {
            method: 'get',
            url: `${process.env.botApiUrl}/ficha/password`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "senha": body.senha
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }

    }

    async sendAtb(body) {
        const config = {
            method: 'put',
            url: `${process.env.botApiUrl}/ficha/atb/update`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "tag": body.tag,
                "atb": body.atb,
                "valor": body.valor
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    async removeAtb(body) {
        const config = {
            method: 'delete',
            url: `${process.env.botApiUrl}/ficha/atb/remove`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "tag": body.tag,
                "atb": body.atb,
                "valor": body.valor
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    async createFicha(body) {
        const config = {
            method: 'post',
            url: `${process.env.botApiUrl}/ficha/create`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "ficha": body.ficha
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    async updateFicha(body) {
        const config = {
            method: 'patch',
            url: `${process.env.botApiUrl}/ficha/update`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "tag": body.tag,
                "ficha": body.ficha
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    async renameFicha(body) {
        const config = {
            method: 'patch',
            url: `${process.env.botApiUrl}/ficha/rename`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "novonomerpg": body.novonomerpg,
                "tag": body.tag
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    async deleteFicha(body) {
        const config = {
            method: 'delete',
            url: `${process.env.botApiUrl}/ficha/delete`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": body.id,
                "nomerpg": body.nomerpg,
                "tag": body.tag
            }
        }

        try {
            const res = await axios(config)
            return res
        }
        catch (err) {
            return err.response
        }
    }

    generateFichaHTML(ficha) {
        const jogadorServices = require("./jogador.service")
        const service = new jogadorServices(this.client)

        const inf = service.generateFormInf(ficha)
        const inf2 = service.generateFormInf2(ficha)
        const status = service.generateFormStatus(ficha)
    }

}

module.exports = fichaService