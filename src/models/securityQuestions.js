const mongoose = require('mongoose')
const { Schema } = mongoose

const SecurityQuestionsSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('SecurityQuestions', SecurityQuestionsSchema)

