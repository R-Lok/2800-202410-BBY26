const sqController = require('./securityQuestions')
const authController = require('./auth')
const saveFlashcardsController = require('./submitcards')
const adminController = require('./admin')


module.exports = {
    sqController,
    authController,
    saveFlashcardsController,
    adminController,
}
