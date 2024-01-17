<script>
import config from '../config/publicVars'
import LoadWheel from '../components/LoadWheel.vue'

export default {
    data() {
        return {
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
                avatarUrl: {
                    state: false,
                    actualMessage: '',
                    messages: {
                        invalid: 'O URL inserido é inválido',
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
            patchingUser: false,
            patchError: {
                state: false,
                errors: []
            },
            patchSuccess: false,
            originalUser: {},
            userLoaded: false,
            discordSyncError: false,
            confirmations: {
                unsyncDiscord: false
            },
            unsyncingDiscord: false,
        }
    },
    components: {
        LoadWheel
    },
    methods: {
        async patchUser() {
            const username = this.$refs['patch-username'].value
            const password = this.$refs['patch-password'].value
            const avatarUrl = this.$refs['patch-avatar-url'].value

            if (this.validationErrors.username.state || this.validationErrors.avatarUrl.state || this.validationErrors.password.state || this.validationErrors.confirmPassword.state) {
                this.patchError.errors = [{ message: 'Corrija os erros no formulário' }]
                this.patchError.state = true
                return
            }
            else if (username === this.originalUser.username && password === '' && avatarUrl == this.originalUser.avatar_url) {
                return
            }
            else {
                this.patchingUser = true

                const response = await fetch(`${config.API_URI}/user`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        username: username === this.originalUser.username ? undefined : username,
                        avatar: avatarUrl == this.originalUser.avatar_url ? undefined : avatarUrl == '' ? null : avatarUrl,
                        password: password === '' ? undefined : password
                    })
                })

                if (password !== '') {
                    this.$store.commit('setConfig', {
                        ...this.$store.state.config,
                        changedPasswordNow: true
                    })

                    setTimeout(() => {
                        this.$store.commit('setConfig', {
                            ...this.$store.state.config,
                            changedPasswordNow: false
                        })
                    }, 5000)
                }

                if (response.status === 200) {
                    this.patchSuccess = true
                }
                else if (response.status == 400) {
                    const data = await response.json()

                    this.patchError.errors = data.invalidFields
                    this.patchError.state = true
                }
                else {
                    this.patchError.errors = [{ message: 'Erro desconhecido, tente novamente mais tarde' }]
                    this.patchError.state = true
                }

                this.patchingUser = false
            }
        },
        validateUsername() {
            this.$refs['patch-username'].value = this.$refs['patch-username'].value.trim()
            const username = this.$refs['patch-username'].value

            if (username === this.originalUser.username) {
                this.$refs['patch-username'].style.border = '2px solid var(--background)'
                this.validationErrors.username.actualMessage = ''
                this.validationErrors.username.state = false
                return
            }

            if (username.length < 3) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooShort
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else if (username.length > 32) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.tooLong
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else if (!username.match(/^[a-zA-Z0-9_]+$/)) {
                this.validationErrors.username.state = true
                this.validationErrors.username.actualMessage = this.validationErrors.username.messages.invalidChars
                this.$refs['patch-username'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-username'].style.border = '2px solid var(--background)'
                this.validationErrors.username.actualMessage = ''
                this.validationErrors.username.state = false
            }
        },
        validateAvatarUrl() {
            this.$refs['patch-avatar-url'].value = this.$refs['patch-avatar-url'].value.trim()
            const avatarUrl = this.$refs['patch-avatar-url'].value

            if (!avatarUrl) {
                this.$refs['patch-avatar-url'].style.border = '2px solid var(--background)'
                this.validationErrors.avatarUrl.actualMessage = ''
                this.validationErrors.avatarUrl.state = false
                return
            }

            if (!avatarUrl.match(/(https?:\/\/.*.(?:png|jpg|jpeg|webp|gif|gifv))/i)) {
                this.validationErrors.avatarUrl.state = true
                this.validationErrors.avatarUrl.actualMessage = this.validationErrors.avatarUrl.messages.invalid
                this.$refs['patch-avatar-url'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-avatar-url'].style.border = '2px solid var(--background)'
                this.validationErrors.avatarUrl.actualMessage = ''
                this.validationErrors.avatarUrl.state = false
            }
        },
        validatePassword() {
            const password = this.$refs['patch-password'].value

            if (!password) {
                this.$refs['patch-password'].style.border = '2px solid var(--background)'
                this.validationErrors.password.actualMessage = ''
                this.validationErrors.password.state = false
                return
            }

            if (password.length < 8) {
                this.validationErrors.password.state = true
                this.validationErrors.password.actualMessage = this.validationErrors.password.messages.tooShort
                this.$refs['patch-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-password'].style.border = '2px solid var(--background)'
                this.validationErrors.password.actualMessage = ''
                this.validationErrors.password.state = false
            }
        },
        validateConfirmPassword() {
            const password = this.$refs['patch-password'].value
            const confirmPassword = this.$refs['patch-confirm-password'].value

            if (!password) {
                this.$refs['patch-confirm-password'].style.border = '2px solid var(--background)'
                this.validationErrors.confirmPassword.actualMessage = ''
                this.validationErrors.confirmPassword.state = false
                return
            }

            if (password !== confirmPassword) {
                this.validationErrors.confirmPassword.state = true
                this.validationErrors.confirmPassword.actualMessage = this.validationErrors.confirmPassword.messages.notMatch
                this.$refs['patch-confirm-password'].style.border = '2px solid red'
            }
            else {
                this.$refs['patch-confirm-password'].style.border = '2px solid var(--background)'
                this.validationErrors.confirmPassword.actualMessage = ''
                this.validationErrors.confirmPassword.state = false
            }
        },
        returnFields() {
            this.patchError.state = false
            this.patchError.message = ''
            this.patchSuccess = false

            setTimeout(() => {
                this.$refs['patch-username'].value = this.originalUser.username
                this.$refs['patch-avatar-url'].value = this.originalUser.avatar_url

                this.validateUsername()
                this.validateAvatarUrl()
            }, 100)
        },
        syncDiscord() {
            window.location.href = config.O_AUTH_URI
        },
        async unsyncDiscord() {
            this.unsyncingDiscord = true
            const response = await fetch(`${config.API_URI}/auth/discord/unsync`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (response.status === 200) {
                this.originalUser.discord_id = null
                this.originalUser.discord = undefined
            }
            else {
                this.patchError.state = true
                this.patchError.errors = [{ message: 'Um erro ocorreu ao tentar desvincular sua conta do Discord. Tente novamente mais tarde.' }]
            }

            this.unsyncingDiscord = false
            this.confirmations.unsyncDiscord = false
            this.returnFields()
        }
    },
    mounted() {
        const sideMenu = document.querySelector('#signed-nav-bar .collapsable-menu')

        const observerMenuCollapse = new MutationObserver(() => {
            if (sideMenu.getAttribute('collapsed') == 'true') {
                this.$refs.config.style.marginLeft = '4em'
                this.$refs.config.style.width = 'calc(100% - 4em)'
            }
            else {
                this.$refs.config.style.marginLeft = '23em'
                this.$refs.config.style.width = 'calc(100% - 24em)'
            }
        })

        observerMenuCollapse.observe(sideMenu, { attributes: true, attributeFilter: ['collapsed'] })

        if (this.$route.params.error == 'SyncError') {
            this.discordSyncError = true
        }
    },
    beforeMount() {
        fetch(`${config.API_URI}/user?discord=true`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            cache: 'no-cache'
        })
            .then((res) => {
                if (res.status == 200) {
                    res.json()
                        .then(data => {
                            this.originalUser = data.user

                            if (!data.user.avatar_url) {
                                this.originalUser.avatar_url = ''
                            }

                            this.userLoaded = true
                        })
                }
                else {
                    localStorage.removeItem('token')
                    this.userLoaded = false
                }
            }).catch((err) => {
                localStorage.removeItem('token')
                this.userLoaded = false
            })
    },
    computed: {
        userState() {
            return this.$store.state.user
        },
    },
    watch: {
        userLoaded() {
            if (this.userLoaded) {
                this.$store.commit('setUser', this.originalUser)

                setTimeout(() => {
                    this.$refs['patch-username'].value = this.originalUser.username
                    this.$refs['patch-avatar-url'].value = this.originalUser.avatar_url
                }, 100)
            }
        },
        async userState() {
            const user = this.$store.state.user
            
            if (user.discord_id != this.originalUser.discord_id) {
                if (user.discord_id != null) {
                    const response = await fetch(`${config.API_URI}/user?discord=true`, {
                        method: 'GET',
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                        cache: 'no-cache'
                    })

                    if (response.status === 200) {
                        const data = await response.json()
                        this.originalUser = data.user
                        this.returnFields()
                    }
                    else {
                        localStorage.removeItem('token')
                    }
                }
                else {
                    this.originalUser = user
                    this.returnFields()
                }
            }
            else{
                this.originalUser = user
                this.returnFields()
            }
        }
    }
}
</script>

<template>
    <div id="Config" ref="config">
        <div class="config-list" v-if="userLoaded">
            <div class="config-box" v-if="!confirmations.unsyncDiscord">
                <div class="config-box-header" v-if="!patchingUser && !patchError.state && !patchSuccess">
                    <h1>Configurações</h1>
                </div>
                <div class="config-box-header" v-else-if="patchingUser && !patchError.state && !patchSuccess">
                    <h1>Carregando...</h1>
                </div>
                <div class="config-box-header" v-else-if="!patchingUser && !patchError.state && patchSuccess">
                    <h1>Informações atualizadas com sucesso</h1>
                    <button @click="returnFields()">Ok</button>
                </div>
                <div class="config-box-header" v-else-if="!patchingUser && patchError.state && !patchSuccess">
                    <h1 v-for="error of patchError.errors" :key="error">{{ error.message }}</h1>
                    <button @click="returnFields()">Ok</button>
                </div>
                <div class="config-box-header" v-else-if="discordSyncError">
                    <h1>Um erro ocorreu ao tentar sincronizar com sua conta do Discord, tente novamente mais tarde</h1>
                    <button @click="returnFields(); discordSyncError = false">Ok</button>
                </div>
                <div class="config-box-body" v-if="!patchingUser && !patchError.state && !patchSuccess">
                    <div class="config-box-body-input">
                        <label for="name">Nome de usuário</label>
                        <input type="text" id="name" placeholder="Insira um nome de usuário" ref="patch-username"
                            @keyup="validateUsername()" @change="validateUsername()" />
                        <p class="patch-error-message" ref="patch-username-error-message"
                            v-if="validationErrors.username.state">{{ validationErrors.username.actualMessage }}</p>
                    </div>
                    <div class="config-box-body-input">
                        <label for="avatarUrl">URL para foto de perfil</label>
                        <input type="avatarUrl" id="avatar-url" placeholder="Insira um URL para foto de perfil"
                            ref="patch-avatar-url" @keyup="validateAvatarUrl()" @change="validateAvatarUrl" />
                        <p class="patch-error-message" ref="patch-avatarUrl-error-message"
                            v-if="validationErrors.avatarUrl.state">{{ validationErrors.avatarUrl.actualMessage }}</p>
                    </div>
                    <div class="config-box-body-input">
                        <label for="password">Nova senha</label>
                        <input autocomplete="false" type="password" id="password" placeholder="Insira uma senha"
                            ref="patch-password" @keyup="validatePassword(); validateConfirmPassword()"
                            @change="validatePassword(); validateConfirmPassword()" />
                        <p class="patch-error-message" ref="patch-password-error-message"
                            v-if="validationErrors.password.state">{{ validationErrors.password.actualMessage }}</p>
                    </div>
                    <div class="config-box-body-input">
                        <label for="password">Confirme a nova senha</label>
                        <input autocomplete="false" type="password" id="confirm-password" placeholder="Confirme sua senha"
                            ref="patch-confirm-password" @keyup="validateConfirmPassword(); validatePassword()"
                            @change="validateConfirmPassword(); validatePassword()" />
                        <p class="patch-error-message" ref="patch-confirm-password-error-message"
                            v-if="validationErrors.confirmPassword.state">{{ validationErrors.confirmPassword.actualMessage
                            }}
                        </p>
                    </div>
                    <div class="config-box-body-controls">
                        <div class="sync-discord" v-if="!originalUser.discord">
                            <p>Já tinha uma conta ou quer utilizar o BOT no Discord?</p>
                            <button @click="syncDiscord()">Sincronizar com o Discord</button>
                        </div>
                        <div class="synced-discord" v-else>
                            <div class="discord-profile">
                                <img class="discord-avatar" :src="originalUser.discord.avatar_url">
                                <p class="discord-username">{{ originalUser.discord.username }}</p>
                            </div>
                            <button @click="confirmations.unsyncDiscord = true">Desvincular conta do Discord</button>
                        </div>
                        <button @click="patchUser()">Salvar Alterações</button>
                    </div>
                </div>
                <LoadWheel v-else-if="patchingUser && !patchError.state" style="border-color: var(--text) transparent" />
            </div>
            <div class="unsync-discord-confirmation-box" v-if="confirmations.unsyncDiscord">
                <div class="unsync-discord-confirmation-body" v-if="!unsyncingDiscord">
                    <h1>Tem certeza que deseja desvincular sua conta do Discord?</h1>
                    <p>Se você desvincular sua conta do Discord, quando utilizar o BOT no Discord você não terá mais as
                        informações
                        desta conta sincronizadas (Fichas, Camapanhas e etc)</p>
                    <div class="unsync-discord-confirmation-controls">
                        <button @click="confirmations.unsyncDiscord = false; returnFields()">Cancelar</button>
                        <button @click="unsyncDiscord()">Confirmar Desvinculação</button>
                    </div>
                </div>
                <h1 v-if="unsyncingDiscord">Desvinculando...</h1>
                <LoadWheel v-if="unsyncingDiscord" style="border-color: var(--text) transparent" />
            </div>
        </div>
        <div class="loading-config" v-else>
            <LoadWheel style="border-color: var(--primary) transparent" />
        </div>
    </div>
</template>

<style>
#Config {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    margin-left: 23em;
    margin-bottom: 4em;
    overflow: hidden;
    width: calc(100% - 24em);
    transition: all 0.5s linear;
    z-index: 2 !important;
}

.config-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 95vh;
    padding: 0 1em;
    overflow: hidden;
    z-index: 2 !important;
}

.loading-config {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 95vh;
    padding: 0 1em;
    overflow: hidden;
    z-index: 2 !important;
}

.config-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 1em;
    width: 25em;
    height: 40em;
}

.config-box-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 10%;
    margin: 0;
    margin-bottom: 1em;
}

.config-box-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    text-align: center;
}

.config-box-header button {
    background-color: var(--background);
    border-radius: 5px;
    color: var(--text);
    border: none;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 1em;
    padding: 0.5em 1em;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
}

.config-box-header button:hover {
    color: var(--background);
    background-color: var(--text);
}

.config-box-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80%;
}

.config-box-body-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 33.33%;
    margin-bottom: 15px;
}

.config-box-body-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
}

.config-box-body-input label {
    align-self: flex-start;
    margin-left: 35px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
}

.config-box-body-input input {
    font-size: 1em;
    width: 80%;
    height: 40px;
    border: 2px solid var(--background);
    border-radius: 5px;
    padding: 0 10px;
    outline: none;
}

.config-box-body-input p {
    align-self: flex-start;
    margin: 0;
    margin-left: 35px;
    font-size: 0.8rem;
    font-weight: 600;
    max-width: 80%;
    text-align: center;
    color: var(--error);
}

.config-box-body-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
}

.config-box-body-controls button {
    width: 80%;
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

.config-box-body-controls button:hover {
    background-color: var(--text);
    color: var(--background);
}

.config-box-body-controls .active {
    background-color: var(--text);
    color: var(--background);
}

.config-box-body-controls .active:hover {
    background-color: var(--background);
    color: var(--text);
}

.config-box-body-controls .sync-discord {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 2em;
}

.config-box-body-controls .sync-discord p {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text);
    margin: 2px;
    text-align: center;
}

.config-box-body-controls .synced-discord {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 2em;
}

.config-box-body-controls .synced-discord button {
    background-color: var(--cancel-secondary);
}

.config-box-body-controls .synced-discord button:hover {
    background-color: var(--background);
    color: var(--cancel-secondary);
}

.config-box-body-controls .synced-discord .discord-profile {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
    height: 60%;
    margin: 0;
    margin-bottom: 1em;
    padding: 2px 10px;
    border: none;
    border-radius: 10px;
    background-color: var(--background);
    color: var(--text);
    font-size: 90%;
    font-weight: 700;
}

.config-box-body-controls .synced-discord .discord-profile img {
    width: 45px;
    height: 45px;
    border: 2px solid var(--text);
    border-radius: 50%;
    margin: 0;
    margin-right: 1em;
}

.unsync-discord-confirmation-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 35%;
    background-color: var(--primary);
    border-radius: 10px;
    padding: 1em;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    color: var(--text);
}

.unsync-discord-confirmation-box h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    margin-bottom: 2em;
}

.unsync-discord-confirmation-box p {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 2em;
}

.unsync-discord-confirmation-box .unsync-discord-confirmation-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: fit-content;
}

.unsync-discord-confirmation-box button {
    width: 30%;
    height: 3em;
    border: none;
    border-radius: 5px;
    background-color: var(--background);
    color: var(--text);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    transition: 0.3s;
}

.unsync-discord-confirmation-box button:nth-child(2) {
    background-color: var(--cancel-secondary);
}

.unsync-discord-confirmation-box button:nth-child(2):hover {
    background-color: var(--background);
    color: var(--cancel-secondary);
}

.unsync-discord-confirmation-box button:hover {
    background-color: var(--text);
    color: var(--background);
}
</style>