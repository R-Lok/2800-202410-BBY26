const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSessionsSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
    },
    sessionId: {
        type: mongoose.ObjectId,
    },
    createdAt: {
        type: Date,
        expires: process.env.SESSION_TTL,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('UserSessions', UserSessionsSchema)

