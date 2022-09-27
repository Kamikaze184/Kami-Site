const { Sequelize } = require("sequelize");

function conStr(DATABASE_URL) {
    const dbURI = DATABASE_URL.replace("postgres://", "");
    const conStr = {
        database: dbURI.split("/")[1],
        username: dbURI.split(/@(?!.*@)/g)[0].split(":")[0],
        password: dbURI.split(/@(?!.*@)/g)[0].split(":")[1],
        host: dbURI.split(/@(?!.*@)/g)[1].split(":")[0],
        port: dbURI.split(/@(?!.*@)/g)[1].split(":")[1],
        logging: false,
        dialect: "postgres",
    }

    if (process.env.deploy == "production") {
        conStr["dialectOptions"] = {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }

    return conStr
}

const site = Sequelize(conStr(process.env.DATABASE_URL))
const bot = Sequelize(conStr(process.env.BOT.DATABASE_URL))

module.exports = {
    site,
    bot
}