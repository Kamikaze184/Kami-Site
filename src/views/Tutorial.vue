<script>
export default {
    data() {
        return {
            tutorial: {}
        }
    },
    methods: {
        openKamiInvite() {
            window.open('https://kamiapp.com.br/suporte', '_blank').focus()
        }
    },
    beforeMount() {
        const params = new URLSearchParams()
        params.append('link', this.$route.path.replace("/tutoriais/", ""))

        fetch('http://localhost:3001/tutorial?' + params,
            {
                method: 'GET'
            })
            .then(res => {
                if (res.status == 200) {
                    res.json()
                        .then(data => {
                            this.tutorial = data.tutorial

                            this.$refs.tutorial.innerHTML = this.tutorial.tutorial
                        })
                }
                else if (res.status == 404) {

                }
            })
    }
}
</script>
<template>
    <div id="Tutorial">
        <div class="tutorial-title">
            <h1>{{ tutorial.title }}</h1>
            <p>{{ tutorial.desc }}</p>
        </div>
        <div class="tutorial-body" ref="tutorial"></div>
        <div class="more-help">
            <h2>Precisa de mais ajuda?</h2>
            <p>Você pode procurar por mais tutoriais, ou se preferir, peça ajuda no servidor do Kami no Discord!</p>
            <div class="help-options">
                <router-link to="/tutoriais">Tutoriais</router-link>
                <button v-on:click="openKamiInvite()">Servidor do Kami</button>
            </div>
        </div>
    </div>
</template>
<style>
#Tutorial {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    position: relative;
    z-index: 2;
    height: fit-content;
    text-align: center;
    margin-bottom: 50px;
}

.tutorial-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
    margin-bottom: 30px;
}

.tutorial-title h1 {
    font-size: 3em;
    margin: 0;
    color: var(--primary);
}

.tutorial-title p {
    font-size: 1.3em;
    margin: 0;
    color: var(--text-secondary)
}

.tutorial-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
}

.tutorial-body h2 {
    font-size: 2.5em;
    color: var(--secondary);
    margin: 5px;
}

.tutorial-body h4 {
    font-size: 1.5em;
    color: var(--text);
    margin: 5px;
}

.tutorial-body p {
    font-size: 1em;
    color: var(--text-secondary);
    margin: 5px;
}

.tutorial-body img {
    margin: 5px;
    border: 2px solid var(--primary);
    border-radius: 10px;
    transition: 0.3s;
}

.tutorial-body br {
    margin: 0;
    content: " ";
    height: 20px;
}

.more-help{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

}

.more-help h2 {
    color: var(--text);
    margin: 0;
}

.more-help p {
    color: var(--text-secondary);
    margin: 0;
}

.help-options {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 5px;
}

.help-options button, .help-options a {
  width: 11em;
  font-size: 1em;
  font-weight: bold;
  color: var(--text);
  background-color: var(--primary);
  padding: 5px 5px 5px 5px;
  border-radius: 10px;
  border: 3px solid var(--background);
  margin: 5px;
  transition: 0.3s;
  cursor: pointer;
}

.help-options button:hover, .help-options a:hover {
  background-color: var(--text);
  color: var(--primary);
}
</style>