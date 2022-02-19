class urlShortService {
    constructor(client) {
        this.client = client
    }

    getInviteLink() {
        return this.client.cache.getStatus().inviteLink
    }
}

module.exports = urlShortService