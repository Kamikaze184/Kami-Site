const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.env.local)
var firstS = true

module.exports = class json_database {
    constructor() {
        if (firstS) {
            fs.writeFileSync(dbPath, "{}", { flag: "w+" }, (err) => {
                if (err) {
                    throw err;
                }
            })
            firstS = false
        }
    }

    set(key, value) {
        var db = require(dbPath)
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
            toReturn = require(dbPath)[key].content
        }
        catch (err) {
            toReturn = undefined
        }

        return toReturn
    }

    delete(key) {
        var db = require(dbPath)
        db[key] = undefined

        fs.writeFileSync(dbPath, JSON.stringify(db), { flag: "w+" }, (err) => {
            if (err) {
                throw err;
            }
        })

        return true
    }

    has(key) {
        const db = require(dbPath)
        if (db[key].content) { return true }
        else { return false }
    }

    length() {
        const db = require(dbPath)
        return db.size
    }
}