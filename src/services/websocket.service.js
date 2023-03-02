import { default as config } from '../config/publicVars'

const socket = io(`${config.API_URI}`)

export default socket