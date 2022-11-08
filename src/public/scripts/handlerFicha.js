import { addAtbHandler } from "./ficha/controls/addAtbHandler.js"
import { rmAtbHandler } from "./ficha/controls/rmAtbHandler.js"
import { rnAtbHandler } from "./ficha/controls/rnFichaHandler.js"
import { compHandler } from "./ficha/controls/compHandler.js"
import { notificacaoHandler } from "./ficha/controls/notificacaoHandler.js"

import { infoBoxHandler } from "./ficha/atbs/infoBoxHandler.js"
import { longStatusBoxHandler } from "./ficha/atbs/longStatusBoxHandler.js"
import { statusBoxHandler } from "./ficha/atbs/statusBoxHandler.js"

const id = document.getElementById("userid").value
const nomerpg = document.getElementById("nomerpg").value
let ficha

const xhr = new XMLHttpRequest()
xhr.open("POST", "/api/ficha/", true);
xhr.setRequestHeader("Content-Type", "application/json")
xhr.send(JSON.stringify({
    id: id,
    nomerpg: nomerpg
}))

xhr.onreadystatechange = async (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        ficha = JSON.parse(xhr.responseText)

        infoBoxHandler(ficha)
        longStatusBoxHandler(ficha)
        statusBoxHandler(ficha)
    }
}

addAtbHandler()
rmAtbHandler()
rnAtbHandler()
compHandler()
notificacaoHandler()