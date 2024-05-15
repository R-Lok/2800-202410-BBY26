const mongoose = require('mongoose')
const { Schema } = mongoose

const UserAnswersSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    questionId: {
        type: mongoose.ObjectId,
        required: true,
    },
    answer: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('UserAnswers', UserAnswersSchema)

