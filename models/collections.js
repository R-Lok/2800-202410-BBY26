const mongoose = require('mongoose')
const { Schema } = mongoose

const CollectionsSchema = new Schema({
    setName: {type: String},
    userId: {type: Schema.Types.ObjectId},
    shareId: {type: Number}
}, {
    timestamps: true,
})

module.exports = mongoose.model('Collections', CollectionsSchema)
