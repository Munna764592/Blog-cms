const Page = require("../models/addpageModel")

const isPage = async (req, res, next) => {
    try {
        const PageS = await Page.find({})
        if (PageS.length == 0 && req.originalUrl != '/admin') {
            res.render('error.ejs', { pages: PageS })
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { isPage }