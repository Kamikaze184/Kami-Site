class apiServices {
    constructor() {
        const db = require('../db/index')
        this.db = new db()
    }

    saveBotinfo(botinfo) {
        try {
            this.db.set("botinfo", botinfo)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    saveCommands(commands) {
        try {
            this.db.set("commands", commands)
        }
        catch (err) {
            throw new Error(err)
        }
    }
}

module.exports = apiServices