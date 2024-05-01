const mongoose = require('mongoose')
const { Schema } = mongoose

const UsersSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
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
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})

module.exports = mongoose.model('Users', UsersSchema)

