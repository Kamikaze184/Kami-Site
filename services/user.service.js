const axios = require('axios')
const resources = require('../public/assets/others/texts.json')

class userService {
    constructor() {
    }

    async getUser(id) {
        const config = {
            method: 'get',
            url: `${process.env.botApiUrl}/user`,
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            },
            data: {
                "id": id
            }
        }

        const res = await axios(config)

        return res.data
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

    generateFormInf(ficha) {
        var htmlString = `<form class="atbsI">`

        const atbI1 = resources.atbs.atbsI1
        const atbI1F = resources.atbs.atbsI1F

        for (var i in atbI1) {
            if (ficha[atbI1[i]] != null && ficha[atbI1[i]] != "" && ficha[atbI1[i]] != " " && ficha[atbI1[i]] != "excluir" && ficha[atbI1[i]] != "delete" && ficha[atbI1[i]] != "-") {
                htmlString += `<div class="atributo"><label class="atbILabel" for="${atbI1[i]}">${atbI1F[i]}:</label>`
                htmlString += `<textarea class="atbIInput" id="${atbI1[i]}" cols="100" rows="5" maxlength="2048" name="${atbI1[i]}">${ficha[atbI1[i]]}</textarea></div>`
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
            if (ficha[atbI2[i]] != null && ficha[atbI2[i]] != "" && ficha[atbI2[i]] != " " && ficha[atbI2[i]] != "excluir" && ficha[atbI2[i]] != "delete" && ficha[atbI2[i]] != "-") {
                htmlString += `<div class="atributo2"><label class="atbILabel" for="${atbI2[i]}">${atbI2F[i]}:</label>`
                htmlString += `<textarea class="atbI2Input" id="${atbI2[i]}" cols="100" rows="8" maxlength="2048" name="${atbI2[i]}">${ficha[atbI2[i]]}</textarea> </div>`
            }
        }

        htmlString += `</form>`
        return htmlString
    }

    generateFormStatus(ficha) {
        var htmlString = `<form class="atbsI">`

        const atbS = resources.atbs.atbsS
        const atbSF = resources.atbs.atbsSF

        for (var i in atbS) {
            if (ficha[atbS[i]] != null && ficha[atbS[i]] != "" && ficha[atbS[i]] != " " && ficha[atbS[i]] != "excluir" && ficha[atbS[i]] != "delete" && ficha[atbS[i]] != "-") {
                htmlString += `<div class="atributo"><label class="atbILabel" for="${atbS[i]}">${atbSF[i]}:</label>`
                htmlString += `<textarea class="atbIInput" id="${atbS[i]}" cols="100" rows="5" maxlength="2048" name="${atbS[i]}">${ficha[atbS[i]]}</textarea></div>`
            }
        }

        if (ficha["extras"] != null && ficha["extras"] != "" && ficha["extras"] != " " && ficha["extras"] != "excluir" && ficha["extras"] != "delete" && ficha["extras"] != "-") {
            var atbExtras = ficha['extras']

            var atbs = atbExtras.split("|")

            for (var x in atbs) {
                var atb = atbs[x].split(":")[0]
                var val = atbs[x].split(":")[1]

                try { atb = atb.replace(" ", "") } catch (err) { }
                try { val = val.replace(/ /, '') } catch (err) { }


                if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "") {
                    htmlString += `<div class="atributo"><label class="atbILabel" for="${atb}$extra$">${atb}:</label>`
                    htmlString += `<textarea class="atbIInput" id="${atb}$extra$" cols="100" rows="5" maxlength="2048" name="${atb}">${val}</textarea></div>`
                }
            }
        }

        htmlString += `</form>`
        return htmlString
    }

    checkAtbs(ficha, local) {
        const atbs = resources.atbs[local]
        for (var i in atbs) {
            if (ficha[atbs[i]] != null && ficha[atbs[i]] != "" && ficha[atbs[i]] != " " && ficha[atbs[i]] != "excluir" && ficha[atbs[i]] != "delete" && ficha[atbs[i]] != "-") {
                return true
            }
        }
        return false
    }
}

module.exports = userService