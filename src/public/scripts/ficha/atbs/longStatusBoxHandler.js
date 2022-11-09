const atbsLocation = document.querySelector(".longStatusBox .atbs")

export async function longStatusBoxHandler(ficha) {
    const fetchAtbs = await fetch("/assets/others/texts.json")
    const { atbs } = await fetchAtbs.json()

    const atbS = atbs.atbsI2
    const atbSF = atbs.atbsI2F

    let atbBox = document.createElement("div")
    atbBox.classList.add("atbBox")

    for (let i in atbS) {
        if (ficha.atributos[atbS[i]] != null && ficha.atributos[atbS[i]] != "" && ficha.atributos[atbS[i]] != " " && ficha.atributos[atbS[i]] != "excluir" && ficha.atributos[atbS[i]] != "delete" && ficha.atributos[atbS[i]] != "-") {
            const atb = document.createElement("atb")
            const atbLabel = document.createElement("atbLabel")
            const textArea = document.createElement("textarea")

            atbLabel.innerHTML = atbSF[i]
            textArea.innerHTML = ficha.atributos[atbS[i]]

            atb.appendChild(atbLabel)
            atb.appendChild(textArea)

            atbBox.appendChild(atb)
        }

        atbsLocation.appendChild(atbBox)
    }
}