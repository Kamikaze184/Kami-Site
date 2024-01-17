import { default as config } from '../config/publicVars'

let socket = io(`${config.API_URI}`, {
    extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    upgrade: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
})

export default socket