const axios = require('axios')

class urlShortService {
    constructor() {
    }

    async getInviteLink() {
        const res = await axios.get(`${process.env.apiUrl}/botinfo`, {
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            }
        })

        return res.data.botinfo.inviteLink
    }
}

module.exports = urlShortService