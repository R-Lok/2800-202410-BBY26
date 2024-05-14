const mongoose = require('mongoose')
const { Schema } = mongoose

const UsersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    loginId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    securityQuestion: {
        type: String,
        required: true,
    },
    securityAnswer: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'normal',
        enum: ['admin', 'normal'],
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    enable: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

UsersSchema.index({ email: 1 })

module.exports = mongoose.model('Users', UsersSchema)

