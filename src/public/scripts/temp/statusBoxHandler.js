const atbsLocation = document.querySelector(".statusBox .atbs")

const navigateNext = document.getElementById("statusBoxNavigateRight")
const navigatePrevious = document.getElementById("statusBoxNavigateLeft")

export async function statusBoxHandler(ficha) {
    const fetchAtbs = await fetch("/assets/others/texts.json")
    const { atbs } = await fetchAtbs.json()

    const atbS = atbs.atbsS
    const atbSF = atbs.atbsSF

    let atbsBox = new Array()

    let page = 0
    function fillPages() {
        let atbBox = document.createElement("div")
        atbBox.classList.add("atbBox")

        const atb = document.createElement("atb")
        const atbLabel = document.createElement("atbLabel")
        const textArea = document.createElement("textarea")

        atbLabel.innerHTML = "Calculando tamanho"
        textArea.innerHTML = "Calculando quantidade de atributos"

        atb.appendChild(atbLabel)
        atb.appendChild(textArea)

        atbBox.appendChild(atb)
        atbBox.style.opacity = 0

        atbsLocation.appendChild(atbBox)

        let atbMax

        const bgSize = (document.querySelector(".bgFicha").clientHeight - document.querySelector(".statusBox .titleBox").clientHeight) - 70;
        const base = 520
        const step = document.querySelector(".statusBox .atbs .atbBox atb").clientHeight;


        if (bgSize <= base) {
            atbMax = 6
        }
        else if (bgSize <= (base + step) && bgSize > base) {
            atbMax = 8
        }
        else if (bgSize <= (base + (step * 2)) && bgSize > (base + step)) {
            atbMax = 10
        }
        else if (bgSize <= (base + (step * 3)) && bgSize > (base + (step * 2))) {
            atbMax = 12
        }
        else if (bgSize <= (base + (step * 4)) && bgSize > (base + (step * 3))) {
            atbMax = 14
        }
        else if (bgSize <= (base + (step * 5)) && bgSize > (base + (step * 4))) {
            atbMax = 16
        }
        else if (bgSize <= (base + (step * 6)) && bgSize > (base + (step * 5))) {
            atbMax = 18
        }
        else {
            atbMax = 18
        }

        while ((step * (atbMax / 2)) >= bgSize) {
            atbMax -= 2
        }

        atbsLocation.removeChild(atbsLocation.lastElementChild)

        atbBox = document.createElement("div")
        atbBox.classList.add("atbBox")

        let atbCount = 0
        for (let i in atbS) {
            if (atbCount >= atbMax || parseInt(i) + 1 == atbS.length) {
                atbsBox.push(atbBox)

                atbBox = document.createElement("div")
                atbBox.classList.add("atbBox")

                atbCount = 0
            }

            if (ficha.atributos[atbS[i]] != null && ficha.atributos[atbS[i]] != "" && ficha.atributos[atbS[i]] != " " && ficha.atributos[atbS[i]] != "excluir" && ficha.atributos[atbS[i]] != "delete" && ficha.atributos[atbS[i]] != "-") {
                const atb = document.createElement("atb")
                const atbLabel = document.createElement("atbLabel")
                const textArea = document.createElement("textarea")

                atbLabel.innerHTML = atbSF[i]
                textArea.innerHTML = ficha.atributos[atbS[i]]

                atb.appendChild(atbLabel)
                atb.appendChild(textArea)

                atbBox.appendChild(atb)
                atbCount++
            }
        }

        atbsLocation.appendChild(atbsBox[0])
        page = 0
    }

    fillPages()
    window.onresize = () => {
        if (atbsLocation.children.length > 0) {
            for (let i in atbsLocation.children) {
                if (atbsLocation.lastChild) {
                    atbsLocation.removeChild(atbsLocation.lastChild)
                }
            }
        }

        atbsBox = new Array()

        fillPages()
    }

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