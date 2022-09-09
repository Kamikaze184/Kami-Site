const novaFicha = document.querySelector('.novaFicha');
const loading = document.querySelector('.loading');
const response = document.querySelector(".response");
const responseTitle = document.querySelector(".responseTitle");
const responseText = document.querySelector(".responseText");
const responseBtn = document.querySelector("#confirmMessage");

const itens = document.querySelectorAll('.item');

const criarFicha = document.querySelector('#criarFicha');

import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const connUrl = document.location.href.startsWith("http://localhost") ? "http://localhost:3005/" : "http://vps41321.publiccloud.com.br:3005"

const socket = io(connUrl, {
    reconnectionDelayMax: 10000,
    query: {
        id: document.querySelector('#id').value,
        page: "jogador"
    }
})

setInterval(() => {
    socket.emit("alive")
}, 10000)

socket.on("createFichaBot", (nomerpg) => {
    const cardsFichas = document.getElementById("divFichas")

    const novaFicha = document.createElement("a")
    novaFicha.setAttribute("class", "item")
    novaFicha.setAttribute("href", `/jogador/ficha/${nomerpg}`)
    novaFicha.innerHTML = `<h2>${nomerpg}</h2>`
    cardsFichas.appendChild(novaFicha)
})

socket.on("deleteFichaBot", (nomerpg) => {
    const cardsFichas = document.getElementById("divFichas")

    for (let card of cardsFichas.children) {
        if (card.firstElementChild.innerHTML.trim() == nomerpg) {
            cardsFichas.removeChild(card)
        }
    }
})

socket.on("renameFichaBot", (novonomerpg, nomerpg) => {
    const cardsFichas = document.getElementById("divFichas")

    for (let card of cardsFichas.children) {
        if (card.firstElementChild.innerHTML.trim() == nomerpg) {
            const novaFicha = document.createElement("a")
            novaFicha.setAttribute("class", "item")
            novaFicha.setAttribute("href", `/jogador/ficha/${novonomerpg}`)
            novaFicha.innerHTML = `<h2>${novonomerpg}</h2>`
            cardsFichas.removeChild(card)
            cardsFichas.appendChild(novaFicha)
        }
    }
})

criarFicha.addEventListener("click", async () => {
    var trys = 0;
    loading.style.display = 'flex';

    novaFicha.style.display = 'none';
    itens.forEach(item => {
        item.style.display = 'none';
    });

    const nomerpg = document.querySelector('#nomerpg').value;
    const id = document.querySelector('#id').value;

    const ficha = {
        id: id,
        nomerpg: nomerpg,
    }

    async function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/ficha/create", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            ficha: ficha
        }));
        trys++

        xhr.onreadystatechange = async function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                socket.emit("createFichaSite", (ficha))
                loading.style.display = "none";
                response.style.display = "flex";
                responseTitle.innerHTML = "Ficha criada com sucesso!";
                responseText.innerHTML = "Ficha criada com sucesso, clique em Ok para atualizar a página";
                responseBtn.addEventListener("click", () => {
                    window.location.reload();
                })
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                const apiResponse = JSON.parse(xhr.response);
                responseTitle.innerHTML = apiResponse.title
                responseText.innerHTML = apiResponse.text;

                responseBtn.addEventListener("click", () => {
                    response.style.display = "none";

                    itens.forEach(item => {
                        item.style.display = 'flex';
                    });

                    novaFicha.style.display = 'flex';
                })

                loading.style.display = "none";
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 5) {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    responseBtn.addEventListener("click", () => {
                        window.location.reload();
                    })

                    loading.style.display = "none";
                    response.style.display = "flex";
                }
                else {
                    await setTimeout(async () => { await makeRequest(); }, 3500)
                }
            }
        }

    }
    await makeRequest();
})

