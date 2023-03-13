<script>
import config from '../config/publicVars'

export default {
    data() {
        return {
            login: false,
            register: true,
        }
    },
    methods: {
        toggleLogin() {
            this.login = true;
            this.register = false;
        },
        toggleRegister() {
            this.login = false;
            this.register = true;
        },
        async makeLogin() {
            const email = this.$refs['login-email'].value
            const password = this.$refs['login-password'].value

            const response = await fetch(`${config.API_URI}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (response.status === 200) {
                const data = await response.json()
                localStorage.setItem('token', data.token)
                this.$router.push({ name: 'Dashboard' })
            } else {
                alert('Usuário ou senha incorretos')
            }

        }
    }
}
</script>

<template>
    <div id="Login">
        <div class="login-box" v-if="login">
            <div class="login-box-header">
                <h1>Acesse sua conta</h1>
            </div>
            <div class="login-box-body">
                <div class="login-box-body-input">
                    <label for="email" ref="login-email">Email</label>
                    <input type="email" id="email" placeholder="Insira seu email" />
                </div>
                <div class="login-box-body-input">
                    <label for="password" ref="login-password">Senha</label>
                    <input type="password" id="password" placeholder="Insira sua senha" />
                </div>
                <div class="login-box-body-controls">
                    <button class="active" @click="makeLogin()">Login</button>
                    <button @click="toggleRegister()">Criar conta</button>
                </div>
            </div>
        </div>
        <div class="register-box" v-else>
            <div class="register-box-header">
                <h1>Crie sua conta</h1>
            </div>
            <div class="register-box-body">
                <div class="register-box-body-input">
                    <label for="name">Nome de usuário</label>
                    <input type="text" id="name" placeholder="Insira um nome de usuário" />
                </div>
                <div class="register-box-body-input">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Insira seu email" />
                </div>
                <div class="register-box-body-input">
                    <label for="password">Senha</label>
                    <input type="password" id="password" placeholder="Insira uma senha" />
                </div>
                <div class="register-box-body-input">
                    <label for="password">Confirme sua senha</label>
                    <input type="password" id="password" placeholder="Confirme sua senha" />
                </div>
                <div class="register-box-body-controls">
                    <button class="active">Criar conta</button>
                    <button @click="toggleLogin()">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#Login {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: max-content;
    margin-top: 5em;
}

.login-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 2em;
    width: 25em;
}

.login-box-header,
.register-box-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30%;
}

.login-box-header h1,
.register-box-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    margin-bottom: 1em;
}

.login-box-body,
.register-box-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70%;
}

.login-box-body-input,
.register-box-body-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 33.33%;
}

.login-box-body-controls,
.register-box-body-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 33.33%;
}


.login-box-body-input label,
.register-box-body-input label {
    align-self: flex-start;
    margin-left: 35px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
}

.login-box-body-input input,
.register-box-body-input input {
    font-size: 1em;
    width: 80%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    margin-bottom: 20px;
    outline: none;
}

.login-box-body-controls button,
.register-box-body-controls button {
    width: 40%;
    height: 40px;
    border: none;
    border-radius: 5px;
    background-color: var(--background);
    color: var(--text);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    margin: 0 10px;
    transition: 0.3s;
}

.login-box-body-controls button:hover,
.register-box-body-controls button:hover {
    background-color: var(--text);
    color: var(--background);
}

.login-box-body-controls .active,
.register-box-body-controls .active {
    background-color: var(--text);
    color: var(--background);
}

.login-box-body-controls .active:hover,
.register-box-body-controls .active:hover {
    background-color: var(--background);
    color: var(--text);
}

.register-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 2em;
    width: 25em;
}
</style>