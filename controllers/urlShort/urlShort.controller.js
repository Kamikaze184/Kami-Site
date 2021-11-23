const { Router } = require('express');
const routes = Router()


routes.get("/termos/:lang", async (req, res) => {
    const lang = req.params.lang

    if (lang == "pt") {
        res.redirect(`https://docs.google.com/document/d/10nngrKxxgIjC03EPjsstSuxkGkY90zT-nIT7owWSX5s/edit?usp=sharing`)
    }
    else {
        res.redirect(`https://docs.google.com/document/d/1eTWagnevvJqmFVKSrceCMdr-Y821Nhr7_lX8G6JvR6U/edit?usp=sharing`)
    }
});


module.exports = { path: '/short/', router: routes }