import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const connUrl = document.location.href.startsWith("http://localhost") ? "http://localhost:3005/" : "https://kamikaze184bot.herokuapp.com/"

const socket = io(connUrl, {
    reconnectionDelayMax: 10000,
    query: {
        id: document.querySelector('#id').value,
        page: "ficha",
        nomerpg: document.querySelector("#nomerpg").value
    }
})

setInterval(() => {
    socket.emit("alive")
}, 10000)

socket.on("updateFichaBot", () => {
    window.location.reload()
})