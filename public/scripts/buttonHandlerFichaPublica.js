const visualizar = document.querySelector("#visualizar");

visualizar.addEventListener("click", async () => {
    var trys = 0
    async function makeRequest() {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/ficha/password", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                id: document.querySelector("#id").value,
                nomerpg: document.querySelector("#nomerpg").value,
                senha: document.querySelector("#senha").value
            }));
        }
        catch (err) { }
        trys++

        xhr.onreadystatechange = async function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const apiResponse = JSON.parse(xhr.response);

                window.location.href = `/ficha/${apiResponse.id}/${apiResponse.nomerpg}`;
            }
            else if (xhr.readyState == 4 && xhr.status == 400) {
                const apiResponse = JSON.parse(xhr.response);

                console.log(apiResponse)

            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 1) {
                    return
                    // responseTitle.innerHTML = "Erro inesperado"
                    // responseText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    // responseBtn.addEventListener("click", () => {
                    //     response.style.display = "none";
                    //     controles.style.display = "flex";
                    // })

                    // loading.style.display = "none";
                    // response.style.display = "flex";
                }
                else {
                    await setTimeout(async () => { await makeRequest(); }, 3500)
                }
            }
        }

    }
    await makeRequest();
})