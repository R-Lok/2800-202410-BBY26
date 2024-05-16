const mongoose = require('mongoose')
const { Schema } = mongoose

const UsersSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    emailHash: {
        type: String,
        required: true,
    },
    password: {
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
    lastActivity: {
        timestamp: {
            type: Date,
            default: null,
        },
        shareId: {
            type: Number,
            default: null,
        },
    },
    streak: {
        type: Number,
        default: 0,
    },
    picture: {
        type: Number,
        min: 0,
        max: 9,
    },
    enable: {
        type: Boolean,
        default: false,
    },
    security: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

UsersSchema.index({ email: 1 })
UsersSchema.index({ userId: 1 })

module.exports = mongoose.model('Users', UsersSchema)

