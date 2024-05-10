const mongoose = require('mongoose')
const { Schema } = mongoose

const CollectionsSchema = new Schema({
    // userId: {
    //     type: mongoose.ObjectId,
    //     required: true,
    // },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Collections', CollectionsSchema)
