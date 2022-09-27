const { io } = require("socket.io-client")
const connUrl = process.env.NODE_ENV == "development" ? "http://localhost:3005/" : "https://bot.kamiapp.com.br/"

const socket = new io(connUrl, {
    reconnectionDelayMax: 5000,
    query: {
        main: true
    },
    auth: {
        api_key: process.env.apiToken
    },
})

const servicesGeral = require("../services/geral.api.service")
const services = new servicesGeral()

socket.on("update", (data) => {
    services[data.action](data)
})