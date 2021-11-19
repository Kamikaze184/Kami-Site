class apiServices {
    constructor() {
        const Database = require("@replit/database")
        this.db = new Database()
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

    async getBotinfo() {
        try {
            return this.db.get("botinfo")
        }
        catch (err) {
            throw new Error(err)
        }

    }

    async getCommands() {
        try {
            return this.db.get("commands")
        }
        catch (err) {
            throw new Error(err)
        }
    }
}

module.exports = apiServices