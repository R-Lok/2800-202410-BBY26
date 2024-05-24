const mongoose = require('mongoose')
const { Schema } = mongoose

const AuditLogsSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        ref: 'users',
    },
    type: {
        type: String,
        default: null,
        enum: ['flashcard'],
    },
    shareId: {
        type: Number,
        required: true,
        ref: 'collections',
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('AuditLogs', AuditLogsSchema)
