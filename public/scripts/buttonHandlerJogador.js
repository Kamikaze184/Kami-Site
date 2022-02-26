const novaFicha = document.querySelector('.novaFicha');
const loading = document.querySelector('.loading');
const response = document.querySelector(".response");
const responseTitle = document.querySelector(".responseTitle");
const responseText = document.querySelector(".responseText");
const responseBtn = document.querySelector("#confirmMessage");

const itens = document.querySelectorAll('.item');

const criarFicha = document.querySelector('#criarFicha');

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