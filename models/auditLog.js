const mongoose = require('mongoose')
const { Schema } = mongoose

const AuditLogsSchema = new Schema({
    loginId: {type: String, required: true, unique: true, ref: 'users'},
    type: {type: String, default: null, enum: ['flashcard']},
    shareId: {type: Number, required: true, unique: true, ref: 'collections',},
    timestamp: {type: Date, default: null},
}, {
    timestamps: true,
})

module.exports = mongoose.model('AuditLogs', AuditLogsSchema)
