const crypto = require("crypto-js")

module.exports = (req, res, next) => {
    const { session } = req.cookies

    if(session){
        req.session = JSON.parse(crypto.AES.decrypt(session, process.env.sessionSecret).toString(crypto.enc.Utf8))
    }
    else{
        req.session = false
    }

    next()
}