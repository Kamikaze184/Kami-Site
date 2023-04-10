<script>
import config from '../config/publicVars'
import LoadWheel from '../components/LoadWheel.vue'
import socket from '../services/websocket.service'

export default {
    data() {
        return {
            login: true,
            register: false,
            validationErrors: {
                username: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'O nome de usuário deve ter no mínimo 3 caracteres',
                        tooLong: 'O nome de usuário deve ter no máximo 32 caracteres',
                        invalidChars: 'O nome de usuário deve conter apenas letras, números e _',
                    },
                },
                email: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        invalid: 'O email inserido é inválido',
                    },
                },
                password: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        tooShort: 'A senha deve ter no mínimo 8 caracteres',
                    },
                },
                confirmPassword: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        notMatch: 'As senhas não conferem',
                    },
                },
            },
            makingLogin: false,
            registeringUser: false,
            loginError: {
                state: false,
                message: ''
            },
            registerError: {
                state: false,
                errors: []
            },
            registerTextValue: {
                username: '',
                email: '',
            },
            registerSuccess: false,
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
            this.makingLogin = true
            const email = this.$refs['login-email'].value
            const password = this.$refs['login-password'].value

            if (email == '' || password == '') {
                this.loginError.state = true
                this.loginError.message = 'Email e senha são obrigatórios'
                this.makingLogin = false
                return
            }
            else {
                const response = await fetch(`${config.API_URI}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                })

                if (response.status === 200) {
                    const data = await response.json()
                    localStorage.setItem('token', data.token)
                    socket.emit('login', { token: data.token })
                    this.$router.push({ name: 'Dashboard' })
                }
                else if (response.status === 400) {
                    this.loginError.state = true
                    this.loginError.message = 'Email ou senha faltando'
                    this.makingLogin = false
                    return
                }
                else if (response.status === 401) {
                    this.loginError.state = true
                    this.loginError.message = 'Senha incorreta'
                    this.makingLogin = false
                    return
                }
                else if (response.status === 404) {
                    this.loginError.state = true
                    this.loginError.message = 'Email não encontrado'
                    this.makingLogin = false
                    return
                }
                else {
                    this.loginError.state = true
                    this.loginError.message = 'Erro desconhecido, tente novamente mais tarde'
                    this.makingLogin = false
                    return
                }
            }
        },
        async registerUser() {
            this.registeringUser = true
            const username = this.$refs['register-username'].value
            const email = this.$refs['register-email'].value
            const password = this.$refs['register-password'].value

            if (username == '' || email == '' || password == '') {
                this.registerError.errors = [{ message: 'Todos os campos são obrigatórios' }]
                this.registerError.state = true
                return
            }
            else if (this.validationErrors.username.state || this.validationErrors.email.state || this.validationErrors.password.state || this.validationErrors.confirmPassword.state) {
                this.registerError.errors = [{ message: 'Corrija os erros no formulário' }]
                this.registerError.state = true
                return
            }
            else {
                const response = await fetch(`${config.API_URI}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                })

                if (response.status === 201) {
                    this.registerSuccess = true
                }
                else if (response.status == 400) {
                    const data = await response.json()

                    this.registerError.errors = data.invalidFields
                    this.registerError.state = true
                }
                else {
                    this.registerError.errors = [{ message: 'Erro desconhecido, tente novamente mais tarde' }]
                    this.registerError.state = true
                }
            }

            this.registeringUser = false
        },
        validateUsername() {
            const username = this.$refs['register-username'].value

            if (username.length < 3) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooShort
                this.$refs['register-username'].style.border = '2px solid red'
            }
            else if (username.length > 32) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooLong
                this.$refs['register-username'].style.border = '2px solid red'
            }
            else if (!username.match(/^[a-zA-Z0-9_]+$/)) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.invalidChars
                this.$refs['register-username'].style.border = '2px solid red'
            }
            else {
                this.$refs['register-username'].style.border = '2px solid var(--background)'
                this.validationErrors.username.actualMessage = ''
                this.validationErrors.username.state = false
            }

            this.registerTextValue.username = username
        },
        validateEmail() {
            const email = this.$refs['register-email'].value

            if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
                this.validationErrors.email.state = true
                this.validationErrors.email.actualMessage = this.validationErrors.email.messages.invalid
                this.$refs['register-email'].style.border = '2px solid red'
            }
            else {
                this.$refs['register-email'].style.border = '2px solid var(--background)'
                this.validationErrors.email.actualMessage = ''
                this.validationErrors.email.state = false
            }

            this.registerTextValue.email = email
        },
        validatePassword() {
            const password = this.$refs['register-password'].value

            if (password.length < 8) {
                this.validationErrors.password.state = true
                this.validationErrors.password.actualMessage = this.validationErrors.password.messages.tooShort
                this.$refs['register-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['register-password'].style.border = '2px solid var(--background)'
                this.validationErrors.password.actualMessage = ''
                this.validationErrors.password.state = false
            }
        },
        validateConfirmPassword() {
            const password = this.$refs['register-password'].value
            const confirmPassword = this.$refs['register-confirm-password'].value

            if (password !== confirmPassword) {
                this.validationErrors.confirmPassword.state = true
                this.validationErrors.confirmPassword.actualMessage = this.validationErrors.confirmPassword.messages.notMatch
                this.$refs['register-confirm-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['register-confirm-password'].style.border = '2px solid var(--background)'
                this.validationErrors.confirmPassword.actualMessage = ''
                this.validationErrors.confirmPassword.state = false
            }
        },
        triggerLogin(e) {
            if (e.key === 'Enter') {
                this.makeLogin()
            }
        },
        triggerRegister(e) {
            if (e.key === 'Enter') {
                this.registerUser()
            }
        }
    },
    components: {
        LoadWheel
    }
}
</script>

<template>
    <div id="Login">
        <div class="login-box" v-if="login" @keypress="triggerLogin">
            <div class="login-box-header" v-if="!makingLogin && !loginError.state">
                <h1>Acesse sua conta</h1>
            </div>
            <div class="login-box-header" v-else-if="makingLogin && !loginError.state">
                <h1>Carregando...</h1>
            </div>
            <div class="login-box-header" v-else>
                <h1>{{ loginError.message }}</h1>
                <button @click="loginError.state = false; loginError.message = ''">Ok</button>
            </div>
            <div class="login-box-body" v-if="!makingLogin && !loginError.state">
                <div class="login-box-body-input">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Insira seu email" ref="login-email" />
                </div>
                <div class="login-box-body-input">
                    <label for="password">Senha</label>
                    <input type="password" id="password" placeholder="Insira sua senha" ref="login-password" />
                </div>
                <div class="login-box-body-controls">
                    <button class="active" @click="makeLogin()">Login</button>
                    <button @click="toggleRegister()">Criar conta</button>
                </div>
            </div>
            <LoadWheel v-else-if="makingLogin && !loginError.state" style="border-color: var(--text) transparent" />
        </div>
        <div class="register-box" v-else @keypress="triggerRegister">
            <div class="register-box-header" v-if="!registeringUser && !registerError.state && !registerSuccess">
                <h1>Crie sua conta</h1>
            </div>
            <div class="register-box-header" v-else-if="registeringUser && !registerError.state && !registerSuccess">
                <h1>Carregando...</h1>
            </div>
            <div class="register-box-header" v-else-if="!registeringUser && registerError.state && !registerSuccess">
                <h1 v-for="error of registerError.errors" :key="error">{{ error.message }}</h1>
                <button @click="registerError.state = false; registerError.message = ''">Ok</button>
            </div>
            <div class="register-box-header" v-else-if="!registeringUser && !registerError.state && registerSuccess">
                <h1>Conta criada com sucesso! Faça login para acessar sua nova conta</h1>
                <button @click="registerSuccess = false; toggleLogin()">Ok</button>
            </div>
            <div class="register-box-body" v-if="!registeringUser && !registerError.state && !registerSuccess">
                <div class="register-box-body-input">
                    <label for="name">Nome de usuário</label>
                    <input type="text" id="name" placeholder="Insira um nome de usuário" ref="register-username"
                        @keyup="validateUsername()" :value="registerTextValue.username" />
                    <p class="register-error-message" ref="register-username-error-message"
                        v-if="validationErrors.username.state">{{ validationErrors.username.actualMessage }}</p>
                </div>
                <div class="register-box-body-input">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Insira seu email" ref="register-email"
                        @keyup="validateEmail()" :value="registerTextValue.email" />
                    <p class="register-error-message" ref="register-email-error-message"
                        v-if="validationErrors.email.state">{{ validationErrors.email.actualMessage }}</p>
                </div>
                <div class="register-box-body-input">
                    <label for="password">Senha</label>
                    <input type="password" id="password" placeholder="Insira uma senha" ref="register-password"
                        @keyup="validatePassword(); validateConfirmPassword()" />
                    <p class="register-error-message" ref="register-password-error-message"
                        v-if="validationErrors.password.state">{{ validationErrors.password.actualMessage }}</p>
                </div>
                <div class="register-box-body-input">
                    <label for="password">Confirme sua senha</label>
                    <input type="password" id="password" placeholder="Confirme sua senha" ref="register-confirm-password"
                        @keyup="validateConfirmPassword(); validatePassword()" />
                    <p class="register-error-message" ref="register-confirm-password-error-message"
                        v-if="validationErrors.confirmPassword.state">{{ validationErrors.confirmPassword.actualMessage }}
                    </p>
                </div>
                <div class="register-box-body-controls">
                    <button @click="toggleLogin()">Login</button>
                    <button class="active" @click="registerUser()">Criar conta</button>
                </div>
            </div>
            <LoadWheel v-else-if="registeringUser && !registerError.state" style="border-color: var(--text) transparent" />
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
    margin-bottom: 5em;
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
    text-align: center;
}

.login-box-header button,
.register-box-header button {
    background-color: var(--text);
    border-radius: 5px;
    color: var(--background);
    border: none;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 1em;
    padding: 0.5em 1em;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
}

.login-box-header button:hover,
.register-box-header button:hover {
    color: var(--text);
    background-color: var(--background);
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
    margin-bottom: 15px;
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
    outline: none;
}

.register-box-body-input p {
    align-self: flex-start;
    margin: 0;
    margin-left: 35px;
    font-size: 0.8rem;
    font-weight: 600;
    max-width: 80%;
    text-align: center;
    color: var(--error);
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

@media screen and (max-width: 768px) {

    .login-box,
    .register-box {
        width: 80%;
    }
}
</style>