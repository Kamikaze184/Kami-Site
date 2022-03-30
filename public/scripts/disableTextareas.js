const atributos = document.querySelectorAll(".atributo")
atributos.forEach(atributo => {
    atributo.querySelector("textarea").disabled = true
})

const atributo2 = document.querySelectorAll(".atributo2")
atributo2.forEach(atributo => {
    atributo.querySelector("textarea").disabled = true
})

document.querySelector("#imagem").disabled = true
document.querySelector("#descricao").disabled = true
