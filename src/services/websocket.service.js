import { default as config } from '../config/publicVars'

let socket = io(`${config.API_URI}`, {
    upgrade: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
})

if (localStorage.getItem('token')) {
    socket.on('connect', () => {
        socket.emit('login', { token: localStorage.getItem('token') })
    })
}

socket.on('reconnect', () => {
    if (localStorage.getItem('token')) {
        socket.emit('login', { token: localStorage.getItem('token') })
    }
})

export default socket