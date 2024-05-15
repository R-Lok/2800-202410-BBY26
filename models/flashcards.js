const mongoose = require('mongoose')
const { Schema } = mongoose

const flashcardsSchema = new Schema({
    shareId: {
        type: Number,
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

module.exports = mongoose.model('Flashcards', flashcardsSchema)
