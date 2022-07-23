const resources = require('../public/assets/others/texts.json')

class jogadorService {
    constructor(client) {
        this.client = client
    }

    getUser(id) {
        const fichas = this.client.cache.getFichasUser(id)
        return { fichas: fichas }
    }

    async getFicha(id, nomerpg) {
        const ficha = await this.client.cache.getFicha(id, nomerpg)
        return ficha
    }

    generateFormInf(ficha) {
        var htmlString = `<form class="atbsI">`

        const atbI1 = resources.atbs.atbsI1
        const atbI1F = resources.atbs.atbsI1F

        for (var i in atbI1) {
            if (ficha.atributos[atbI1[i]] != null && ficha.atributos[atbI1[i]] != "" && ficha.atributos[atbI1[i]] != " " && ficha.atributos[atbI1[i]] != "excluir" && ficha.atributos[atbI1[i]] != "delete" && ficha.atributos[atbI1[i]] != "-") {
                htmlString += `<div class="atributo"><label class="atbILabel" for="${atbI1[i]}">${atbI1F[i]}:</label>`
                htmlString += `<textarea class="atbIInput" id="${atbI1[i]}" cols="100" rows="5" maxlength="2048" name="${atbI1[i]}">${ficha.atributos[atbI1[i]]}</textarea></div>`
            }
        }

        htmlString += `</form>`
        return htmlString
    }

    generateFormInf2(ficha) {
        var htmlString = `<form class="atbsI2">`
        const atbI2 = resources.atbs.atbsI2
        const atbI2F = resources.atbs.atbsI2F

        for (var i in atbI2) {
            if (ficha.atributos[atbI2[i]] != null && ficha.atributos[atbI2[i]] != "" && ficha.atributos[atbI2[i]] != " " && ficha.atributos[atbI2[i]] != "excluir" && ficha.atributos[atbI2[i]] != "delete" && ficha.atributos[atbI2[i]] != "-") {
                htmlString += `<div class="atributo2"><label class="atbILabel" for="${atbI2[i]}">${atbI2F[i]}:</label>`
                htmlString += `<textarea class="atbI2Input" id="${atbI2[i]}" cols="100" rows="8" maxlength="2048" name="${atbI2[i]}">${ficha.atributos[atbI2[i]]}</textarea> </div>`
            }
        }

        htmlString += `</form>`
        return htmlString
    }

    generateFormStatus(ficha) {
        var htmlString = `<form class="atbsI">`

        const { atbsS, atbsSF, atbsI1, atbsI2 } = resources.atbs

        for (var atb of atbsS) {
            if (ficha.atributos[atb] != null && ficha.atributos[atb] != "" && ficha.atributos[atb] != " " && ficha.atributos[atb] != "excluir" && ficha.atributos[atb] != "delete" && ficha.atributos[atb] != "-") {
                htmlString += `<div class="atributo"><label class="atbILabel" for="${atb}">${atbsSF[atbsS.indexOf(atb)]}:</label>`
                htmlString += `<textarea class="atbIInput" id="${atb}" cols="100" rows="5" maxlength="2048" name="${atb}">${ficha.atributos[atb]}</textarea></div>`

                delete ficha.atributos[atb]
            }
        }

        for (var atb of atbsI1) {
            if (ficha.atributos[atb]) {
                delete ficha.atributos[atb]
            }
        }

        for (var atb of atbsI2) {
            if (ficha.atributos[atb]) {
                delete ficha.atributos[atb]
            }
        }

        for (var atb of Object.keys(ficha.atributos)) {
            if (atb.toLowerCase() != "imagem" && atb.toLowerCase() != "descricao") {
                htmlString += `<div class="atributo"><label class="atbILabel" for="${atb}">${atb}:</label>`
                htmlString += `<textarea class="atbIInput" id="${atb}" cols="100" rows="5" maxlength="2048" name="${atb}">${ficha.atributos[atb]}</textarea></div>`
            }
        }

        htmlString += `</form>`
        return htmlString
    }

    checkAtbs(ficha, local) {
        if (local != "atbsS") {
            const atbs = resources.atbs[local]
            for (var i in atbs) {
                if (ficha.atributos[atbs[i]] != null && ficha.atributos[atbs[i]] != "" && ficha.atributos[atbs[i]] != " " && ficha.atributos[atbs[i]] != "excluir" && ficha.atributos[atbs[i]] != "delete" && ficha.atributos[atbs[i]] != "-") {
                    return true
                }
            }
            return false
        }
        else {
            const { atbsI1, atbsI2 } = resources.atbs

            for (var atb of Object.keys(ficha.atributos)) {
                if (ficha.atributos[atb] != null && ficha.atributos[atb] != "" && ficha.atributos[atb] != " " && ficha.atributos[atb] != "excluir" && ficha.atributos[atb] != "delete" && ficha.atributos[atb] != "-") {
                    if (!atbsI1.includes(atb.toLowerCase().trim()) && !atbsI2.includes(atb.toLowerCase().trim()) && atb.toLowerCase().trim() != "imagem" && atb.toLowerCase().trim() != "descricao") {
                        return true
                    }
                }
            }
            return false
        }
    }
}

module.exports = jogadorService