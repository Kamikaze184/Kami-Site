class LastUseStore {
    constructor() {
        this.store = {
            sheets: {},
            macros: {}
        }

        this.load()
    }

    save() {
        const json = JSON.stringify(this.store)
        localStorage.setItem('last-use-store', json)
    }

    load() {
        const json = localStorage.getItem('last-use-store')
        if (json) {
            this.store = JSON.parse(json)
        }
    }

    get(location = 'sheets' || 'macros') {
        return this.store[location]
    }

    set(location = 'sheets' || 'macros', key = 'userid-name', value = { id: 0, name: '', userid: '', username: '', lastUse: new Date() }) {
        this.store[location][key] = value
        this.save()
        return true
    }

    delete(location = 'sheets' || 'macros', key = 'userid-name') {
        delete this.store[location][key]
        return true
    }
}

const lastUseStore = new LastUseStore()

export default lastUseStore