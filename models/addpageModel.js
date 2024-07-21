const mongoose = require("mongoose")

const pageSchema = new mongoose.Schema({

    pagetitle: {
        type: String,
        required: true

    },
    image: {
        type: String,
        default: ''
    },
    content: {
        type: String
    }
})

const Page = mongoose.model("PAGE", pageSchema)
module.exports = Page