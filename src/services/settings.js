const Joi = require('joi')
const { CustomError, encrypt, decrypt, hash } = require('../utilities/index')
const bcrypt = require('bcrypt')
const userAnswersModel = require('../models/userAnswers')
const usersModel = require('../models/users')

// Function used to validate security answer, current password, and new password matching requirements for password change
async function validatePasswordChange(userId, currPass, newPass, confirmNewPass, securityQuesId, securityAns) {
    const userAnswer = await userAnswersModel.findOne({ userId: userId, questionId: securityQuesId }).select('answer').lean()
    const user = await usersModel.findById(userId)

    if (userAnswer.answer !== securityAns) {
        console.log('Incorrect Security Answer')
        throw new CustomError('401', 'Incorrect Security Answer')
    }

    const schema = Joi.object({
        currPass: Joi.string().alphanum().min(3).max(20).required(),
        newPass: Joi.string().alphanum().min(3).max(20).required(),
    })

    await schema.validateAsync({ currPass, newPass })
        .catch((error) => {
            const errorMsgParts = error.message.split(' ')
            errorMsgParts.shift()
            const errorMsg = errorMsgParts.join(' ')
            throw new CustomError('422', 'Passwords ' + errorMsg)
        })

    if (newPass !== confirmNewPass) {
        throw new CustomError('401', 'New Password and Confirm Password do not match')
    }

    const result = await bcrypt.compare(currPass, user.password)
    if (!result) {
        throw new CustomError('401', 'Incorrect Current Password')
    }
}

module.exports = {
    validatePasswordChange,
}
