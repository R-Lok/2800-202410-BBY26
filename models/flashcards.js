const { number } = require('joi')
const mongoose = require('mongoose')
const { Schema } = mongoose

const flashcardsSchema = new Schema({
    shareId: {
        type: Number
    },
    question: {
        type: String
    },
    answer: {
        type: String
    }
})

module.exports = mongoose.model('Flashcards', flashcardsSchema)