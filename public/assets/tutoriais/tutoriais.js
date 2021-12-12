module.exports = new Map([
    [
        "ficha", [
            {
                link: "criar-ficha",
                title: "Criando a sua primeira ficha",
                desc: "Aprendendo a usar o comando /ficha",
                thumb: "/assets/tutoriais/img/f-cF-opcoes.png",
                tags: ["ficha", "criar", "primeira", "atributo", "valor"],
                tutorial: `
                <h2>Para criar sua primeira ficha é bem simples!</h2>

                <br>
                <h4>O comando /ficha terá as seguintes opções: nome_da_ficha, atributo e valor.</h4>
                <br>
                <img src="/assets/tutoriais/img/f-cF-opcoes.png">
                <br>

                <h4>O nome_da_ficha, como o nome sugere, é como você vai chamar sua ficha.</h4>
                <p>Ele deve ser um nome simples, ou seja, não pode conter espaços e nem caracteres especiais. (com execeção do "_").</p>
                <br>

                <h4>O atributo também como o nome sugere é o atributo que você quer que seja adicionado a sua ficha.</h4>
                <p>Os atributos padrões do bot estão disponíveis no comando /ajuda selecionando a opção "Atributos".</p>
                <br>
                <p>Para adicionar um atributo que não está na lista de atributos padrões, você deve usar o "Extras". Mais detalhes de como usar no tutorial "Adicionando à sua ficha atributos personalizados".</p>
                <br>
                <p>Para adicionar vários atributos ao mesmo tempo, você deve utilizar o "Multi". Mais detalhes de como usar no tutorial "Adicionando vários atributos à sua ficha ao mesmo tempo".</p>
                <br>

                <h4>O valor é o que você quer que seja adicionando ao atributo, o valor pode ser um número, um texto e afins.</h4>
                <p>Lembrando que existem limitações de tamanho dependendo do atributo. Mais sobre isto no tutorial "Resolvendo problemas com sua ficha".</p>
                <br>
                <h2>Sabendo disso, vamos criar uma ficha!</h2>
                <br>
                <h4>Basta digitar o comando /ficha com as opções acima e o bot irá criar uma ficha para você!</h4>
                <br>
                <p>Exemplo: /ficha RPG_Kami nome Kami BOT</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-ex.png">
                <br>
                <p>Clique em confirmar e sua ficha estará criada!</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-conf.png">
                <br>
                `
            },
            {
                link: "atb-personalizados",
                title: "Adicionando à sua ficha atributos personalizados",
                desc: "Aprendendo a usar o Extras do /ficha",
                thumb: "/assets/tutoriais/img/f-cF-extras.png",
                tags: ["ficha", "adicionar", "atributo", "personalizado", "extras", "custom"],
                tutorial: `
                <h2>Adicionar atributos personalizados não é tão complicado!</h2>

                <br>
                <h4>Você irá utilizar o /ficha com "extras" no local do atributo.</h4>
                <br>
                <img src="/assets/tutoriais/img/f-cF-extras.png">
                <br>
                <p>Com isso o BOT irá entender que você quer adicionar um atributo que não está na lista dos padrões e não irá parar o comando se não encontrar o mesmo.</p>
                <br>
                <h4>O valor do atributo personalizado é onde está a mágica dessa função.</h4>
                <p>Para que o extras funcione corretamente você precisa seguir a formatação a seguir.<p>
                <br>
                <h4>O caracter : separa um atributo de um valor</h4>
                <h4>Enquanto o caracter | separa um atributo de outro</h4>
                <br>
                <p>Exemplo: /ficha RPG_Kami extras meuAtb1:1 | meuAtb2:2</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exExtras.png">
                <br>
                <p>Pronto, agora sua ficha estará com os atributos que você mesmo criou!</p>
                <br>
                <h2>Para excluir atributos personalizados da sua ficha siga estes passos</h2>
                <br>
                <h4>Primeiro, é importante lembrar que os atributos devem ser excluidos 1 de cada vez, tentar excluir vários atributos ao mesmo tempo não irá funcionar</h4>
                <br>
                <p>Exemplo: /ficha RPG_Kami extras meuAtb1:excluir</p> 
                <br>
                <img src="/assets/tutoriais/img/f-cF-exExcExtras.png">

                `
            },
            {
                link: "multi-atb",
                title: "Adicionando vários atributos à sua ficha ao mesmo tempo",
                desc: "Aprendendo a usar o Multi do /ficha",
                thumb: "/assets/tutoriais/img/f-cF-multi.png",
                tags: ["ficha", "adicionar", "atributos", "multi", "multi-atb", "varios", "mesmo", "tempo"],
                tutorial: `
                <h2>Adicionar vários atributos ao mesmo tempo é bem simples!</h2>

                <br>
                <h4>Você irá utilizar o /ficha com "multi" no local do atributo.</h4>
                <br>
                <img src="/assets/tutoriais/img/f-cF-multi.png">
                <br>

                <h4>O valor que é colocado no multi é o que faz tudo funcionar.</h4>
                <p>Para que o multi funcione corretamente você precisa seguir a formatação a seguir.<p>
                <br>
                <h4>O caracter : separa um atributo de um valor</h4>
                <h4>Enquanto o caracter | separa um atributo de outro</h4>
                <h4>É importante ressaltar que o Multi e o Extras não funcionam juntos</h4>
                <p>O Multi adiciona somente atributos que já estão na lista padrão, enquanto o Extras adiciona atributos que não estão na lista padrão.</p>
                <br>
                <p>Exemplo: /ficha RPG_Kami multi nome: Kami BOT | sanidade: 10</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exMulti.png">
                <br>
                <p>Pronto, agora foram adicionados na sua ficha todos os atributos que você colocou ao mesmo tempo!</p>
                <br>
                <h4>O atributo Multi não pode ser usado para excluir diversos atributos de uma ficha ao mesmo tempo</h4>
                `
            },
            {
                link: "ficha-geral",
                title: "Funções gerais da ficha",
                desc: "Excluindo atributos, adicionando uma imagem e afins no comando /ficha",
                thumb: "/assets/tutoriais/img/f-cF-opcoes.png",
                tags: ["ficha", "excluir", "adicionar", "imagem", "geral", "atributo"],
                tutorial: `
                <h2>Aqui você pode ver algumas funções comuns para utilizar na ficha</h2>
                <br>
                <h4>Adicionando uma imagem à sua ficha</h4>
                <p>Para adicionar uma imagem à sua ficha basta utlizar o comando /ficha colocando como atributo "imagem" e como valor o link para a imagem</p>
                <br>
                <p>Exemplo: /ficha RPG_Kami imagem https://cdn.discordapp.com/attachments/836291199140102195/912397718859677737/Logo.png</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exImg.png">
                <br>
                <h4>Ou então você pode utilizar outro tipo de comando:</h4>
                <br>
                <h4>Apps > Add imagem à ficha</h4>
                <br>
                <p>Clique com o botão direito sob uma mensagem que contenha uma imagem em anexo, passe o cursor sob "Apps" e clique em "Add imagem à ficha"</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exImg2.png">
                <br>
                <p>Selecione a ficha onde deseja adicionar a imagem no menu de seleção que irá aparecer e pronto</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exImg3.png">
                <br>
                <p>Só pra avisar, os tipos de imagens permitidas são: .png, .jpg, .jpeg, .gif e .gifv</p>
                <br>
                <h4>Excluindo um atributo da sua ficha</h4>
                <p>Para excluir um atributo da sua ficha também é simples, utilize o comando /ficha e coloque o nome do atributo que deseja excluir no local para 
                atributo, coloque o valor como "excluir" e envie o comando e pronto, o atributo será excluido da sua ficha</p>
                <br>
                <p>Exemplo: /ficha RPG_Kami nome excluir</p>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exAtbExcluir.png">
                <br>
                <h4>Se você quiser ver os atributos que já estão no BOT prontos para serem usados é só utilizar o comando /ajuda e selecionar a opção "Atributos"</h4>
                <br>
                <img src="/assets/tutoriais/img/f-cF-exAtbAjuda.png">
                <br>
                `
            }
        ],
    ]
])
