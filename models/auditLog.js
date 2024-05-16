const mongoose = require('mongoose')
const { Schema } = mongoose

const AuditLogSchema = new Schema({
    loginId: {type: String, required: true, unique: true},
    type: {type: String, default: null},
    timestamp: {type: Date, default: null},
}, {
    timestamps: true,
})

module.exports = mongoose.model('auditlogs', CollectionsSchema)
