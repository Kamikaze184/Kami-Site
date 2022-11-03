export async function rnAtbHandler() {
    const buttonRenomear = document.getElementById("buttonRenomear")
    const buttonConfRnFicha = document.getElementById("buttonConfRnFicha")
    const buttonCancRnFicha = document.getElementById("buttonCancRnFicha")

    const rnApgButtons = document.querySelector(".rnApgButtons")
    const rnControls = document.querySelector(".rnControls")

    buttonRenomear.addEventListener("click", () => {
        rnApgButtons.style = "display: none;"
        rnControls.style = "display: flex;"
    })

    buttonCancRnFicha.addEventListener("click", () => {
        rnApgButtons.style = "display: flex;"
        rnControls.style = "display: none;"

        document.getElementById("inputNomeAtbRm").value = ""
        document.getElementById("inputValorAtbRm").value = ""
    })

    buttonConfRnFicha.addEventListener("click", () => {

    })
}
