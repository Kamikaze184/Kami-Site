var firstS = true
const map = new Map()

module.exports = class map_database {
    constructor() {
        if (firstS) {
            map.set("botinfo", {
                "serverCount": 1,
                "userCount": 1,
                "fichasCount": 1,
                "commandsTotal": 1,
                "inviteLink": "/"
            })

            firstS = false
        }
    }

    set(key, value) {
        map.set(key, value)
        return true
    }

    get(key) {
        let toReturn

        try {
            toReturn = map.get(key)
        }
        catch (err) {
            toReturn = undefined
        }

        return toReturn
    }

    delete(key) {
        map.delete(key)
        return true
    }

    has(key) {
        if (map.get(key)) { return true }
        else { return false }
    }

    length() {
        return map.length
    }
}