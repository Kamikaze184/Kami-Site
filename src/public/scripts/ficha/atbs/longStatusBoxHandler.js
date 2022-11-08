const atbsLocation = document.querySelector(".longStatusBox .atbs")

const navigateNext = document.getElementById("longStatusBoxNavigateRight")
const navigatePrevious = document.getElementById("longStatusBoxNavigateLeft")

export async function longStatusBoxHandler(ficha) {
    const fetchAtbs = await fetch("/assets/others/texts.json")
    const { atbs } = await fetchAtbs.json()

    ficha.atributos = {
        ...ficha.atributos,
        "habilidadesderaca": "a",
        "talentos": "b"
    }

    const atbI2 = atbs.atbsI2
    const atbI2F = atbs.atbsI2F

    const atbsBox = new Array()

    let atbBox = document.createElement("div")
    atbBox.classList.add("atbBox")

    console.log(window.innerHeight)

    let atbMax = 6
    if (window.innerHeight <= 770) {
        atbMax = 4
    }

    let atbCount = 0
    for (let i in atbI2) {
        if (atbCount == atbMax || parseInt(i) == atbI2.length) {
            atbsBox.push(atbBox)

            atbBox = document.createElement("div")
            atbBox.classList.add("atbBox")

            atbCount = 0
        }
        if (ficha.atributos[atbI2[i]] != null && ficha.atributos[atbI2[i]] != "" && ficha.atributos[atbI2[i]] != " " && ficha.atributos[atbI2[i]] != "excluir" && ficha.atributos[atbI2[i]] != "delete" && ficha.atributos[atbI2[i]] != "-") {
            const atb = document.createElement("atb")
            const atbLabel = document.createElement("atbLabel")
            const textArea = document.createElement("textarea")

            atbLabel.innerHTML = atbI2F[i]
            textArea.innerHTML = ficha.atributos[atbI2[i]]

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