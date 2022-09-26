const crypto = require('crypto-js')

class fichaService {
    constructor(client) {
        this.client = client
    }

    async getFicha(id, nomerpg) {
        const ficha = await this.client.cache.getFicha(id, nomerpg)
        return ficha
    }

    async getFichaWithPassword(body) {
        const ficha = await this.client.cache.getFicha(body.id, body.nomerpg)

        if (ficha.senha == body.senha) {
            return {
                status: 200,
                data: { ficha: ficha }
            }
        }
        else {
            return {
                status: 400,
                data: {
                    title: "Senha incorreta",
                    text: "A senha informada é incorreta"
                }
            }
        }
    }

    async updateFicha(body) {
        const fichaBot = await this.client.cache.getFicha(body.id, body.nomerpg)
        var fichaSite = body.ficha
        fichaSite.senha = fichaBot.senha

        const difference = (obj1, obj2) => {
            obj1 = Object.keys(obj1).sort().reduce(function (result, key) {
                result[key] = obj1[key];
                return result;
            }, {});

            obj2 = Object.keys(obj2).sort().reduce(function (result, key) {
                result[key] = obj2[key];
                return result;
            }, {});

            const keys = new Array()
            Object.keys(obj1).forEach(key => {
                if (obj1[key] !== obj2[key]) {
                    keys.push(key)
                }
            });

            return keys;
        };

        const atbsDiff = difference(fichaSite.atributos, fichaBot.atributos)

        if (atbsDiff.length > 0) {
            const data = new Object()
            for (var x of atbsDiff) {
                data[x] = fichaSite.atributos[x]
            }

            try {
                await this.client.cache.updateFicha(body.id, body.nomerpg, data, { query: "update", oldData: fichaBot })

                return {
                    status: 200,
                }
            }
            catch (err) {
                return {
                    status: 500,
                    data: {
                        title: "Erro interno",
                        text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                    }
                }
            }
        }
        else {
            return {
                status: 400,
                data: {
                    title: "Nenhuma mudança foi detectada",
                    text: "A sua ficha no site e no BOT já são iguais"
                }
            }
        }
    }

    async updateAtbFicha(body) {
        const atributos = this.client.utils.returnAtb()

        var nomerpg = body.nomerpg
        var atb = body.atb
        var valor = body.valor

        try {
            atb = this.client.utils.matchAtb(atb, atributos)
        }
        catch (err) { }

        if (atb == "imagem" || atb == "image") {
            const imageType = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "gif", "gifV"]
            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' +
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                    '((\\d{1,3}\\.){3}\\d{1,3}))' +
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                    '(\\?[;&a-z\\d%_.~+=-]*)?' +
                    '(\\#[-a-z\\d_]*)?$', 'i');
                return !!pattern.test(str);
            }

            function validImageURL(url) {
                var validUrlExt = new Map()

                for (var x in imageType) {
                    var type = url.search(imageType[x])
                    if (type != -1) {
                        var ext = imageType[x]
                        validUrlExt.set("ext", ext)
                        validUrlExt.set("vUrl", true)
                        break
                    }
                    else {
                        validUrlExt.set("vUrl", false)
                        continue
                    }
                }
                return validUrlExt
            }

            if (valor != "") {
                var validImageUrl = validImageURL(valor)

                if (!validURL(valor)) {
                    return {
                        status: 400,
                        data: {
                            title: `URL inválida`,
                            text: `A URL que você está tentando adicionar é inválida.`
                        }
                    }
                }
                if (!validImageUrl.get("vUrl")) {
                    return {
                        status: 400,
                        data: {
                            title: `Tipo de imagem inválida`,
                            text: `O tipo de imagem que você está tentando adicionar é inválido. as extensões válidas são .jpg, .jpeg, .png, .gif, .gifV`
                        }
                    }
                }
            }
        }

        try { nomerpg = nomerpg.replace("'", '') } catch { }

        try {
            await this.client.cache.updateFicha(body.id, nomerpg, { [atb]: valor }, { query: "update" })

            return {
                status: 200,
            }
        }
        catch (err) {
            this.client.log.error(err, true)
            return {
                status: 500,
                data: {
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }
        }
    }

    async removeAtbFicha(body) {
        const atributos = this.client.utils.returnAtb()

        var nomerpg = body.nomerpg
        var atb = body.atb

        try { nomerpg = nomerpg.replace("'", '') } catch { }

        try {
            atb = this.client.utils.matchAtb(atb, atributos)
        }
        catch (err) { }

        try {
            const ficha = await this.client.cache.getFicha(body.id, nomerpg)

            let atbE = false
            try {
                atbE = ficha.atributos[atb] != undefined
            }
            catch (err) {
                atbE = false
            }

            if (atbE) {
                await this.client.cache.updateFicha(body.id, nomerpg, { [atb]: null }, { query: "update" })

                return {
                    status: 200,
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        title: "Atributo não encontrado",
                        text: `O atributo "${atb}", não foi encontrado nessa ficha.`
                    }
                }
            }
        }
        catch (err) {
            this.client.log.error(err, true)
            return {
                status: 500,
                data: {
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }
        }
    }

    async createFicha(body) {
        const fichasUser = await this.client.cache.getFichasUser(body.ficha.id)

        var nomerpg = body.ficha.nomerpg
        try { nomerpg = nomerpg.replace("'", '') } catch { }

        if (fichasUser.includes(nomerpg)) {
            return {
                status: 400,
                data: {
                    title: "Ficha já existe",
                    text: "Já existe uma ficha com esse nome, por favor escolha outro nome"
                }
            }
        }
        else if (fichasUser.length >= 10) {
            return {
                status: 400,
                data: {
                    title: "Você atingiu o limite de fichas",
                    text: "Você atingiu o limite de fichas por usuário (10 fichas)"
                }
            }
        }
        else if (nomerpg.match(/[ '$%]/g) || nomerpg.length <= 0) {
            return {
                status: 400,
                data: {
                    title: "Nome inválido",
                    text: "O nome da ficha não deve conter os caracteres ' $ % ou espaços e deve ter pelo menos 1 caractere"
                }
            }
        }
        else {
            const senha = this.client.utils.gerarSenha()

            try {
                await this.client.dbBot.query(`insert into fichas (id, nomerpg, senha) values ('${body.ficha.id}', '${nomerpg}', '${senha}')`)
            }
            catch (err) {
                this.client.log.error(err, true)

                return {
                    status: 500,
                    data: {
                        title: "Erro interno",
                        text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                    }
                }
            }

            try { this.client.cache.updateFichasUser(body.ficha.id, nomerpg) } catch (err) { this.client.log.error(err, true) }

            return {
                status: 200,
            }
        }
    }

    async renameFicha(body) {
        const fichasUser = await this.client.cache.getFichasUser(body.id)

        var nomerpg = body.novonomerpg
        try { nomerpg = nomerpg.replace("'", '') } catch { }

        if (fichasUser.includes(nomerpg)) {
            return {
                status: 400,
                data: {
                    title: "Ficha já existe",
                    text: "Já existe uma ficha com esse nome, por favor escolha outro nome"
                }
            }
        }
        else if (nomerpg.match(/[ '$%]/g) || nomerpg.length <= 0) {
            return {
                status: 400,
                data: {
                    title: "Nome inválido",
                    text: "O nome da ficha não deve conter os caracteres ' $ % ou espaços e deve ter pelo menos 1 caractere"
                }
            }
        }
        else if (nomerpg == body.nomerpg) {
            return {
                status: 400,
                data: {
                    title: "Nome não alterado",
                    text: "O novo nome da ficha é igual ao antigo"
                }
            }
        }
        else {
            try {
                await this.client.dbBot.query(`update fichas set nomerpg = '${nomerpg}' where id = '${body.id}' and nomerpg = '${body.nomerpg}'`)
            }
            catch (err) {
                this.client.log.error(err, true)
                return {
                    status: 500,
                    data: {
                        title: "Erro interno",
                        text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                    }
                }
            }

            try {
                this.client.cache.deleteFichaUser(body.id, body.nomerpg)
                this.client.cache.updateFichasUser(body.id, nomerpg)

            }
            catch (err) { this.client.log.error(err, true) }

            return {
                status: 200,
                data: {
                    novonomerpg: nomerpg
                }
            }
        }
    }

    async deleteFicha(body) {
        try {
            await this.client.dbBot.query(`delete from fichas where id = '${body.id}' and nomerpg = '${body.nomerpg}'`)
        }
        catch (err) {
            this.client.log.error(err, true)
            return {
                status: 500,
                data: {
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }
        }

        await this.client.cache.deleteFicha(body.id, body.nomerpg)
        await this.client.cache.deleteFichaUser(body.id, body.nomerpg)

        return {
            status: 200
        }
    }
}

module.exports = fichaService