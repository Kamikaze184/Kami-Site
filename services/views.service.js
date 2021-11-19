const ss = require('string-similarity')

class viewsService {
    constructor(db) {
        this.db = db.db
    }

    getBotinfo() {
        return this.db.get("botinfo")
    }

    getCommands() {
        return this.db.get("commands")
    }

    tutorialSearchEngine(search, tutoriais) {
        const find = new Array()
        var search = req.query.search
        var result

        search = search.split(" ")

        tutoriais.forEach((c) => {
            c.forEach((t) => {
                if (search.length > 1) {
                    for (x in search) {
                        result = ss.findBestMatch(search[x], t.tags)

                        if (result.bestMatch.rating > 0.75) {
                            find.push({ tutorial: t, bestRating: result.bestMatch.rating })
                            return false
                        }
                    }
                }
                else {
                    result = ss.findBestMatch(search[0], t.tags)

                    if (result.bestMatch.rating > 0.75) {
                        find.push({ tutorial: t, bestRating: result.bestMatch.rating })
                    }
                }
            })
        })

        find.sort(function (a, b) {
            if (a.bestRating > b.bestRating) {
                return -1;
            }
            else {
                return 1
            }
        })

        var queryFind = find.length > 0

        return { find: find, queryFind: queryFind, tutoriais: tutoriais }
    }

    getTutorial(param, tutoriais) {
        let tutorial
        tutoriais.forEach(t => {
            t.forEach(c => {
                if (c.link == param) {
                    tutorial = c
                }
            })
        })

        return tutorial
    }

}

module.exports = viewsService