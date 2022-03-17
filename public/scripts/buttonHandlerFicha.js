const addAtbBox = document.querySelector(".addAtb");
const delAtbBox = document.querySelector(".delAtb");
const confApagarBox = document.querySelector(".confApagar");
const renFichaBox = document.querySelector(".renFicha");
const controles = document.querySelector(".controles");
const loading = document.querySelector(".loading");
const response = document.querySelector(".response");
const responseTitle = document.querySelector(".responseTitle");
const responseText = document.querySelector(".responseText");
const responseBtn = document.querySelector("#confirmMessage");

const addAtb = document.querySelector("#addAtb");
const delAtb = document.querySelector("#delAtb");
const salvarFicha = document.querySelector("#salvarFicha");
const apagarFicha = document.querySelector("#apagarFicha");
const renFicha = document.querySelector("#renomearFicha");

addAtb.addEventListener("click", () => {
    controles.style.display = "none";
    addAtbBox.style.display = "flex";

    const addAtbConf = document.querySelector("#addAtbConf");
    const addAtbCanc = document.querySelector("#addAtbCanc");

    addAtbConf.addEventListener("click", async () => {
        var trys = 0;
        addAtbBox.style.display = "none";
        loading.style.display = "flex";

        async function makeRequest() {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/ficha/atb/add", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                atb: document.querySelector("#toAddAtb").value,
                valor: document.querySelector("#valor").value,
                id: document.querySelector("#id").value,
                nomerpg: document.querySelector("#nomerpg").value,
                tag: document.querySelector("#tag").value,
            }));
            trys++

            xhr.onreadystatechange = async function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    loading.style.display = "none";
                    controles.style.display = "flex";
                    response.style.display = "flex";
                    responseTitle.innerHTML = "Atributo adicionado";
                    responseText.innerHTML = "Atributo adicionado com sucesso, clique em Ok para atualizar a página (alterações não salvas serão perdidas)";
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
                        controles.style.display = "flex";
                    })

                    loading.style.display = "none";
                    response.style.display = "flex";
                }
                else if (xhr.readyState == 4 && xhr.status == 401) {
                    window.location.replace("/auth/login");
                }
                else if (xhr.readyState == 4 && xhr.status == 500) {
                    if (trys >= 5) {
                        responseTitle.innerHTML = "Erro inesperado"
                        responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                        responseBtn.addEventListener("click", () => {
                            response.style.display = "none";
                            controles.style.display = "flex";
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
    });

    addAtbCanc.addEventListener("click", () => {
        controles.style.display = "flex";
        addAtbBox.style.display = "none";

        document.querySelector("#toAddAtb").value = "";
        document.querySelector("#valor").value = "";
    });
})

delAtb.addEventListener("click", () => {
    controles.style.display = "none";
    delAtbBox.style.display = "flex";

    const delAtbConf = document.querySelector("#delAtbConf");
    const delAtbCanc = document.querySelector("#delAtbCanc");

    delAtbConf.addEventListener("click", async () => {
        var trys = 0;
        delAtbBox.style.display = "none";
        loading.style.display = "flex";

        async function makeRequest() {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", "/api/ficha/atb/remove", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                atb: document.querySelector("#toDelAtb").value,
                id: document.querySelector("#id").value,
                nomerpg: document.querySelector("#nomerpg").value,
                tag: document.querySelector("#tag").value,
            }));
            trys++

            xhr.onreadystatechange = async function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    loading.style.display = "none";
                    controles.style.display = "flex";
                    response.style.display = "flex";
                    responseTitle.innerHTML = "Atributo removido";
                    responseText.innerHTML = "Atributo removido com sucesso, clique em Ok para atualizar a página (alterações não salvas serão perdidas)";
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
                        controles.style.display = "flex";
                    })

                    loading.style.display = "none";
                    response.style.display = "flex";
                }
                else if (xhr.readyState == 4 && xhr.status == 401) {
                    window.location.replace("/auth/login");
                }
                else if (xhr.readyState == 4 && xhr.status == 500) {
                    if (trys >= 5) {
                        responseTitle.innerHTML = "Erro inesperado"
                        responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                        responseBtn.addEventListener("click", () => {
                            response.style.display = "none";
                            controles.style.display = "flex";
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
    });

    delAtbCanc.addEventListener("click", () => {
        controles.style.display = "flex";
        delAtbBox.style.display = "none";

        document.querySelector("#toDelAtb").value = "";
    });
})

salvarFicha.addEventListener("click", async () => {
    controles.style.display = "none";
    loading.style.display = "flex";

    const ficha = new Object({ id: document.querySelector("#id").value, nomerpg: document.querySelector("#nomerpg").value, atributos: {} });
    const forms = new Array();

    try {
        const atbsI = document.querySelectorAll(".atbsI")[0].getElementsByClassName("atributo");
        forms.push(atbsI);
    }
    catch { }

    try {
        const atbsI2 = document.querySelector(".atbsI2").getElementsByClassName("atributo");
        forms.push(atbsI2);
    }
    catch { }

    try {
        const atbsS = document.querySelectorAll(".atbsI")[1].getElementsByClassName("atributo");
        forms.push(atbsS)
    } catch { }


    for (var atbForm of forms) {
        for (var div of atbForm) {
            const atb = div.getElementsByClassName("atbIInput").item(0).id;
            const valor = div.getElementsByClassName("atbIInput").item(0).value;

            ficha.atributos[atb] = valor;
        }
    }

    try {
        const desc = document.querySelector(".desc").getElementsByClassName("descInput").item(0).value;
        ficha.atributos["descricao"] = desc;
    }
    catch { }

    try {
        const img = document.querySelector(".infImage").getElementsByClassName("atbIInput").item(0).value;
        ficha.atributos["imagem"] = img;
    }
    catch { }

    var trys = 0;
    async function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/api/ficha/update", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            id: document.querySelector("#id").value,
            nomerpg: document.querySelector("#nomerpg").value,
            tag: document.querySelector("#tag").value,
            ficha: ficha
        }));
        trys++

        xhr.onreadystatechange = async function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                loading.style.display = "none";
                controles.style.display = "flex";
                response.style.display = "flex";
                responseTitle.innerHTML = "Ficha salva";
                responseText.innerHTML = "Ficha salva com sucesso, clique em Ok para atualizar a página (alterações não salvas serão perdidas)";
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
                    controles.style.display = "flex";
                })

                loading.style.display = "none";
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 401) {
                window.location.replace("/auth/login");
            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 5) {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    responseBtn.addEventListener("click", () => {
                        response.style.display = "none";
                        controles.style.display = "flex";
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

apagarFicha.addEventListener("click", async () => {
    controles.style.display = "none";
    confApagarBox.style.display = "flex";

    var trys = 0;
    async function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api/ficha/delete", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            id: document.querySelector("#id").value,
            nomerpg: document.querySelector("#nomerpg").value,
            tag: document.querySelector("#tag").value
        }));
        trys++

        xhr.onreadystatechange = async function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                loading.style.display = "none";
                controles.style.display = "flex";
                response.style.display = "flex";
                responseTitle.innerHTML = "Ficha apagada";
                responseText.innerHTML = "Ficha apagada com sucesso, clique em Ok para voltar à página do jogador";
                responseBtn.addEventListener("click", () => {
                    window.location.href = "/user/jogador"
                })
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                const apiResponse = JSON.parse(xhr.response);
                responseTitle.innerHTML = apiResponse.title
                responseText.innerHTML = apiResponse.text;

                responseBtn.addEventListener("click", () => {
                    response.style.display = "none";
                    controles.style.display = "flex";
                })

                loading.style.display = "none";
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 401) {
                window.location.replace("/auth/login");
            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 5) {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    responseBtn.addEventListener("click", () => {
                        response.style.display = "none";
                        controles.style.display = "flex";
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

    const confApagar = document.querySelector("#apagarFichaConf");
    const cancApagar = document.querySelector("#apagarFichaCanc");

    confApagar.addEventListener("click", async () => {
        loading.style.display = "flex";
        confApagarBox.style.display = "none";
        await makeRequest();
    })

    cancApagar.addEventListener("click", () => {
        confApagarBox.style.display = "none";
        controles.style.display = "flex";
    })


})

renFicha.addEventListener("click", () => {
    controles.style.display = "none";
    renFichaBox.style.display = "flex";

    var trys = 0;
    async function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/api/ficha/rename", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            id: document.querySelector("#id").value,
            nomerpg: document.querySelector("#nomerpg").value,
            novonomerpg: document.querySelector("#novoNomeRpg").value,
            tag: document.querySelector("#tag").value
        }));
        trys++

        xhr.onreadystatechange = async function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const apiResponse = JSON.parse(xhr.response);
                loading.style.display = "none";
                controles.style.display = "flex";
                response.style.display = "flex";
                responseTitle.innerHTML = "Ficha renomeada"
                responseText.innerHTML = `Ficha renomeada com sucesso para "${apiResponse.novonomerpg}", clique em Ok para atualizar a página (alterações não salvas serão perdidas)`;

                document.querySelector("#nomerpg").value = apiResponse.novonomerpg;

                responseBtn.addEventListener("click", () => {
                    window.location.replace(`/user/jogador/ficha/${apiResponse.novonomerpg}`);
                })

                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                const apiResponse = JSON.parse(xhr.response);
                responseTitle.innerHTML = apiResponse.title
                responseText.innerHTML = apiResponse.text;

                responseBtn.addEventListener("click", () => {
                    response.style.display = "none";
                    controles.style.display = "flex";
                })

                loading.style.display = "none";
                response.style.display = "flex";
            }
            else if (xhr.readyState == 4 && xhr.status == 401) {
                window.location.replace("/auth/login");
            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 5) {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    responseBtn.addEventListener("click", () => {
                        response.style.display = "none";
                        controles.style.display = "flex";
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

    const confRenFicha = document.querySelector("#renFichaConf");
    const cancRenFicha = document.querySelector("#renFichaCanc");

    confRenFicha.addEventListener("click", async () => {
        renFichaBox.style.display = "none";
        loading.style.display = "flex";
        await makeRequest();
    })

    cancRenFicha.addEventListener("click", () => {
        controles.style.display = "flex";
        renFichaBox.style.display = "none";
    })
})
