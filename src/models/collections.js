const mongoose = require('mongoose')
const { Schema } = mongoose

const CollectionsSchema = new Schema({
    setName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    shareId: { type: Number, required: true, unique: true },
}, {
    timestamps: true,
})

module.exports = mongoose.model('flashcardsets', CollectionsSchema)
