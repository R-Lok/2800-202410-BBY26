const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSessionsSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
    },
    sessionId: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

UserSessionsSchema.index({ createdAt: 1 }, { expireAfterSeconds: Number(process.env.SESSION_TTL) })

module.exports = mongoose.model('UserSessions', UserSessionsSchema)
