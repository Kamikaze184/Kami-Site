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
        let atbMax
        if (window.innerHeight <= 770) {
            atbMax = 8
        }
        else if (window.innerHeight <= 880 && window.innerHeight > 770 ){
            atbMax = 10
        }
        else if (window.innerHeight <= 990 && window.innerHeight > 880){
            atbMax = 12
        }
        else{
            atbMax = 12
        }

        let atbBox = document.createElement("div")
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
        console.log(atbsBox)
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