import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const connUrl = document.location.href.startsWith("http://localhost") ? "http://localhost:3005/" : "http://vps41321.publiccloud.com.br:3005"

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