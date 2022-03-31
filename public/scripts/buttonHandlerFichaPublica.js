const loading = document.querySelector('.loading');

const accessBox = document.querySelector(".getAccess");
const visualizar = document.querySelector("#visualizar");

const errBox = document.querySelector(".errorMessage");
const errTitle = document.querySelector("#title");
const errText = document.querySelector("#text");
const errButton = document.querySelector("#ok");

visualizar.addEventListener("click", async () => {
    loading.style.display = "flex";
    accessBox.style.display = "none";

    var trys = 0
    async function makeRequest() {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/ficha/password", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", process.env.validation);
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

                loading.style.display = "none";

                errBox.style.display = "flex";
                errTitle.innerHTML = apiResponse.title;
                errText.innerHTML = apiResponse.text;

                errButton.addEventListener("click", () => {
                    errBox.style.display = "none";
                    accessBox.style.display = "flex";
                })
            }
            else if (xhr.readyState == 4 && xhr.status == 500) {
                if (trys >= 5) {
                    loading.style.display = "none";

                    errBox.style.display = "flex";
                    errTitle.innerHTML = "Erro inesperado";
                    errText.innerHTML = "Ocorreu um erro inesperado, tente novamente em alguns instantes";

                    errButton.addEventListener("click", () => {
                        errBox.style.display = "none";
                        accessBox.style.display = "flex";
                    })
                }
                else {
                    await setTimeout(async () => { await makeRequest(); }, 3500)
                }
            }
        }

    }
    await makeRequest();
})