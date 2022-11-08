export async function rmAtbHandler() {
    const buttonRmAtb = document.getElementById("buttonRmAtb")
    const buttonConfRmAtb = document.getElementById("buttonConfRmAtb")
    const buttonCancRmAtb = document.getElementById("buttonCancRmAtb")

    const addRmButtons = document.querySelector(".addRmButtons")
    const rmControls = document.querySelector(".rmControls")

    buttonRmAtb.addEventListener("click", () => {
        addRmButtons.style = "display: none;"
        rmControls.style = "display: flex;"
    })

    buttonCancRmAtb.addEventListener("click", () => {
        addRmButtons.style = "display: flex;"
        rmControls.style = "display: none;"

        document.getElementById("inputNomeAtbRm").value = ""
    })

    buttonConfRmAtb.addEventListener("click", () => {

    })
}
