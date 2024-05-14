const mongoose = require('mongoose')
const { Schema } = mongoose

const FlashcardsSchema = new Schema({
    shareId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'collections',
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

FlashcardsSchema.index({ email: 1 })

module.exports = mongoose.model('Flashcards', FlashcardsSchema)