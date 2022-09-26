const atributos = document.querySelectorAll(".atributo")
atributos.forEach(atributo => {
    atributo.querySelector("textarea").disabled = true
})

const atributo2 = document.querySelectorAll(".atributo2")
atributo2.forEach(atributo => {
    atributo.querySelector("textarea").disabled = true
})

try { document.querySelector("#imagem").disabled = true } catch (err) { }
try { document.querySelector("#descricao").disabled = true } catch (err) { }
