export async function addAtbHandler() {
    const buttonAddAtb = document.getElementById("buttonAddAtb")
    const buttonConfAddAtb = document.getElementById("buttonConfAddAtb")
    const buttonCancAddAtb = document.getElementById("buttonCancAddAtb")

    const addRmButtons = document.querySelector(".addRmButtons")
    const addControls = document.querySelector(".addControls")

    buttonAddAtb.addEventListener("click", () => {
        addRmButtons.style = "display: none;"
        addControls.style = "display: flex;"
    })

    buttonCancAddAtb.addEventListener("click", () => {
        addRmButtons.style = "display: flex;"
        addControls.style = "display: none;"

        document.getElementById("inputNomeAtb").value = ""
        document.getElementById("inputValorAtb").value = ""
    })

    buttonConfAddAtb.addEventListener("click", () => {

    })
}
