const sqService = require('./securityQuestions')
const authService = require('./auth')
const saveFlashcardsService = require('./submitcards')
const adminService = require('./admin')
const collectionService = require('./collection')
const settingsService = require('./settings')


module.exports = {
    sqService,
    authService,
    saveFlashcardsService,
    adminService,
    collectionService,
    settingsService,
}
