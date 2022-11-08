const atbsLocation = document.querySelector(".infoBox .atbs")

const navigateNext = document.getElementById("infoBoxNavigateRight")
const navigatePrevious = document.getElementById("infoBoxNavigateLeft")

export async function infoBoxHandler(ficha) {
    const fetchAtbs = await fetch("/assets/others/texts.json")
    const { atbs } = await fetchAtbs.json()

    const atbI1 = atbs.atbsI1
    const atbI1F = atbs.atbsI1F

    const atbsBox = new Array()

    let atbBox = document.createElement("div")
    atbBox.classList.add("atbBox")

    let atbCount = 0
    for (let i in atbI1) {
        if (atbCount >= 6 || parseInt(i) + 1 == atbI1.length) {
            atbsBox.push(atbBox)

            atbBox = document.createElement("div")
            atbBox.classList.add("atbBox")

            atbCount = 0
        }
        if (ficha.atributos[atbI1[i]] != null && ficha.atributos[atbI1[i]] != "" && ficha.atributos[atbI1[i]] != " " && ficha.atributos[atbI1[i]] != "excluir" && ficha.atributos[atbI1[i]] != "delete" && ficha.atributos[atbI1[i]] != "-") {
            const atb = document.createElement("atb")
            const atbLabel = document.createElement("atbLabel")
            const textArea = document.createElement("textarea")

            atbLabel.innerHTML = atbI1F[i]
            textArea.innerHTML = ficha.atributos[atbI1[i]]

            atb.appendChild(atbLabel)
            atb.appendChild(textArea)

            atbBox.appendChild(atb)
            atbCount++
        }
    }

    atbsLocation.appendChild(atbsBox[0])

    let page = 0
    navigateNext.addEventListener("click", () => {
        atbsLocation.removeChild(atbsBox[page])
        page++

        if (page >= atbsBox.length) {
            page = 0
        }

        atbsLocation.appendChild(atbsBox[page])
    })

    navigatePrevious.addEventListener("click", () => {
        atbsLocation.removeChild(atbsBox[page])
        page--

        if (page < 0) {
            page = atbsBox.length - 1
        }

        atbsLocation.appendChild(atbsBox[page])
    })
}