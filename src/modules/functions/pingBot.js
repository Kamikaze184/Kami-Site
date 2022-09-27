const axios = require("axios")

module.exports = async function pingBot(client) {
    const config = {
        method: 'get',
        url: `${process.env.botApiUrl}/ping`,
    }

    try {
        var ping = Date.now()
        const res = await axios(config)
        ping = Date.now() - ping

        if (res.status != 200) {
            client.log.error(`Ping Bot - ${res.status} - ${res.statusText}`, true)
        }
        else{
            client.log.info(`Ping Bot - ${ping}ms`)
        }
        
        return ping
    }
    catch (err) {
        client.log.error(`Ping Bot - ${err.status} - ${err.statusText}`, true)
        return "Timeout"
    }
}