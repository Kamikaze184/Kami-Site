const { io } = require("socket.io-client")
const connUrl = process.env.NODE_ENV == "development" ? "http://localhost:3005/" : process.env.BOT_API_URL

const socket = new io(connUrl, {
    reconnectionDelayMax: 5000,
    query: {
        main: true
    },
    auth: {
        api_key: process.env.API_TOKEN
    },
})

const servicesGeral = require("../services/geral.api.service")

socket.on("update", (data) => {
    servicesGeral[data.action](data)
})