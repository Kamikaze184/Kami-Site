const id = document.querySelector("#id").value;
const nomerpg = document.querySelector("#nomerpg").value;

const visualizar = document.querySelector("#visualizar");

import fichaServices from '../../services/ficha.api.service';
const servicesFicha = new fichaServices()

import jogadorServices from '../../services/jogador.service';
const servicesJogador = new jogadorServices()


visualizar.addEventListener("click", async () => {
    const senha = document.querySelector("#senha").value;
    const ficha = await servicesFicha.getFicha(id, nomerpg)

    if (true) {
        const fichaPublica = document.querySelector(".ficha");

        const inf = servicesJogador.generateFormInf(ficha);
        const inf2 = servicesJogador.generateFormInf2(ficha);
        const status = servicesFicha.generateFormStatus(ficha);

        fichaPublica.innerHTML = `${inf}${inf2}${status}`;

    }
})