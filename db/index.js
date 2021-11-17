const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, "json", 'db.json')
var firstS = true

module.exports = class json_database {
    constructor() {
        if (firstS) {
            if (!fs.existsSync(dbPath)) {
                fs.writeFileSync(dbPath, "{}", { flag: "w+" }, (err) => {
                    if (err) {
                        throw err;
                    }
                })
            }
            firstS = false
        }
    }

    set(key, value) {
        var db = require('./json/db.json')
        db[key] = { content: value }

        fs.writeFileSync(dbPath, JSON.stringify(db), { flag: "w+" }, (err) => {
            if (err) {
                throw err;
            }
        })

        return true
    }

    get(key) {
        let toReturn

        try {
            toReturn = require('./json/db.json')[key].content
        }
        catch (err) {
            toReturn = undefined
        }

        return toReturn
    }

    delete(key) {
        var db = require('./json/db.json')
        db[key] = undefined

        fs.writeFileSync(dbPath, JSON.stringify(db), { flag: "w+" }, (err) => {
            if (err) {
                throw err;
            }
        })

        return true
    }

    has(key) {
        const db = require('./json/db.json')
        if (db[key].content) { return true }
        else { return false }
    }

    length() {
        const db = require('./json/db.json')
        return db.size
    }
}