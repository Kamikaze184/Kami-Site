module.exports = new Map([
    [
        "ficha", [
            {
                link: "criar-ficha",
                title: 'Criando a sua primeira ficha',
                desc: 'Aprendendo a usar o comando /ficha',
                thumb: "/img/f-cf-opcoes.png",
                tags: ['ficha', 'criar', 'primeira', 'atributo', 'valor'],
                tutorial: `
                <h2>Para criar sua primeira ficha é bem simples!</h2>

                <br>
                <h4>O comando /ficha terá as seguintes opções: nome_da_ficha, atributo e valor.</h4>
                <br>
                <img src="/img/f-cf-opcoes.png">
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
                <img src="/img/f-cf-ex.png">
                <br>
                <p>Clique em confirmar e sua ficha estará criada!</p>
                <br>
                <img src="/img/f-cf-conf.png">
                <br>
            `
            },
            {
                link: "atb-personalizados",
                title: 'Adicionando à sua ficha atributos personalizados',
                desc: 'Aprendendo a usar o Extras do /ficha',
                thumb: "/img/f-cf-extras.png",
                tags: ['ficha', 'adicionar', 'atributo', 'personalizado', 'extras', 'custom'],
                tutorial: `
                <h2>Adicionar atributos personalizados não é tão complicado!</h2>

                <br>
                <h4>Você irá utilizar o /ficha com "extras" no local do atributo.</h4>
                <br>
                <img src="/img/f-cf-extras.png">
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
                <img src="/img/f-cf-exExtras.png">
                <br>
                <p>Pronto, agora sua ficha estará com os atributos que você mesmo criou!</p>
                `
            }
        ],
    ]
])
