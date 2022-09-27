const cache = require("../modules/cache/cache")

module.exports = {
    getInviteLink() {
        return cache.getStatus().inviteLink
    }
}