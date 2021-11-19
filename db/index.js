class DB {
    constructor() {
        this.map = new Map()
    }

    set(key, value) {
        this.map.set(key, { key: key, content: value })

        return "Setado com sucesso"
    }

    get(key) {
        let toReturn

        try {
            toReturn = this.map.get(key).content
        }
        catch (err) {
            toReturn = undefined
        }

        return toReturn
    }

    delete(key) {
        this.map.delete(key)

        return "Deletado com sucesso"
    }

    has(key) {
        if (this.map.get(key)) { return true }
        else { return false }
    }

    length() {
        return this.map.size
    }
}

const db = new DB()

module.exports = {
    db
}