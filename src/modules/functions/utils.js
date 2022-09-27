const CryptoJS = require("crypto-js");
const time = require("luxon").DateTime

module.exports = {
    gerarSenha() {
        const senha = CryptoJS.AES.encrypt(Date.now().toString(), process.env.fKey)
        return senha.toString().slice(33, 43)
    },

    getPostgresTime(){
        return time.now().setZone('America/Sao_Paulo').toSQL({ includeZone: true });
    },

    matchAtb(atributo, atributos, customBase) {
        var base = 0.295

        if (customBase) { base = customBase }

        const result = stringSimilarity.findBestMatch(atributo.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos)
        const target = result.bestMatch.target
        const rating = result.bestMatch.rating

        var x = 0

        while (x < atributo.length) {
            base += 0.045
            x++
        }

        if (base > 0.75) {
            base = 0.75
        }

        if (rating >= base) {
            return target
        }
        else {
            return atributo
        }
    },

    returnAtb() {
        return ["nome", "altura", "idade", "peso", "profissao", "competencias", "equipamentos", "constituicao", "disposicao", "forca", "destreza", "sorte", "acrobacia",
        "inteligencia", "perspicacia", "carisma", "agilidade", "conhecimento", "furtividade", "percepcao", "sobrevivencia", "vontade", "magia", "sanidade", "linguas", "ciencias", "erudicao",
        "investigacao", "medicina", "mitosdocthulhu", "ocultismo", "oficio", "politica", "descricao", "imagem", "defeitos", "luta", "armasbrancas", "armasdefogo", "fadiga", "memoria",
        "lucidez", "extras", "vida", "encontrar", "escutar", "classe", "adestraranimais", "atletismo", "atuacao", "cavalgar", "cura", "diplomacia", "enganacao", "identificarmagias",
        "iniciativa", "intimidacao", "intuicao", "ladinagem", "obterinformacoes", "sabedoria", "nivel", "divindade", "deslocamento", "tendencia", "corpoacorpo", "ataquesadistancia",
        "armas", "armadura", "habilidadesderaca", "habilidadesdeclasse", "talentos", "dinheiro", "idiomas", "arcanismo", "blefar", "historia", "lidarcomanimais", "natureza",
        "persuasao", "prestidigitacao", "religiao", "classedaarmadura", "ligacoes", "fofura", "resistencia", "raca", "defesa", "escudo", "aparencia", "furto", "labia", "habilidadesmanuais", "militar",
        "naval", "habilidades", "fortitude", "guerra", "jogatina", "pilotagem", "reflexos", "nobreza", "pontaria", "mana"]
    }
}