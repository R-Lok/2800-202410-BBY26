const mongoose = require('mongoose')
const { Schema } = mongoose

const AuditLogSchema = new Schema({
    loginId: {type: String, required: true, unique: true},
    type: {type: String, default: null, enum: ['flashcard']},
    timestamp: {type: Date, default: null},
    shareId: {type: Number, required: true, unique: true}
}, {
    timestamps: true,
})

module.exports = mongoose.model('auditlogs', CollectionsSchema)
