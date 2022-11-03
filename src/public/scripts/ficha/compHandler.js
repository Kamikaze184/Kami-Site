export async function compHandler() {
    const buttonShare = document.getElementById("share")
    const buttonCompLink = document.getElementById("buttonCompLink")
    const buttonCancComp = document.getElementById("buttonCancComp")
    const compLink = document.getElementById("compLink")
    const compPassword = document.getElementById("compPassword")

    const salvarCompButtons = document.querySelector(".salvarCompButtons")
    const compControls = document.querySelector(".compControls")

    buttonShare.addEventListener("click", () => {
        salvarCompButtons.style = "display: none;"
        compControls.style = "display: flex;"
    })

    buttonCancComp.addEventListener("click", () => {
        salvarCompButtons.style = "display: flex;"
        compControls.style = "display: none;"

        document.getElementById("inputNomeAtbRm").value = ""
        document.getElementById("inputValorAtbRm").value = ""
    })

    compLink.addEventListener("click", async () => {
        navigator.clipboard.writeText(compLink.value);
        alert("Link copiado para a área de transferência");
    })

    compPassword.addEventListener("click", async () => {
        navigator.clipboard.writeText(compPassword.value);
        alert("Senha copiada para a área de transferência");
    })

    buttonCompLink.addEventListener("click", () => {
        navigator.clipboard.writeText(`Visualize a ficha "${document.querySelector("#nomerpg").value}" criada pelo usuário ${document.querySelector("#tag").value}\nLink: ${compLink.value}\nSenha: ${compPassword.value}`);
        alert("Link copiado para a área de transferência");
    })
}