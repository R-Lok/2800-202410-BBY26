const usersModel = require('../models/users')
const securityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')
const bcrypt = require('bcrypt')
const saltRounds = 12
const Joi = require('joi')
const { CustomError, encrypt, decrypt, hash } = require('../utilities/index')
const { settingsService } = require('../services/index')

// Updates the user's login Id with their input login Id
const settingsGET = async (req, res) => {
    const userId = req.session.userId
    const user = await usersModel.findById(userId).select('-_id picture name loginId email').lean()
    const userSecurityQuestions = await userAnswersModel.find({ userId: userId }).select('-_id questionId').lean()
    const securityQuesIdValues = userSecurityQuestions.map((q) => q.questionId)
    const randomIndex = Math.floor(Math.random() * securityQuesIdValues.length)
    const randomQuestionId = securityQuesIdValues[randomIndex]
    req.session.securityQuestionId = randomQuestionId
    const securityQues = await securityQuestionsModel.findById(randomQuestionId).select('question').lean()
    const email = await decrypt(user.email)
    return res.render('settings', {
        imageId: user.picture,
        name: user.name,
        loginId: user.loginId,
        email: email,
        securityQuestion: securityQues.question,
        pictureID: req.session.picture,
    })
}

// Updates the user's display name with their input display name
const settingsEditLoginIdPOST = async (req, res) => {
    try {
        const userId = req.session.userId
        const newId = req.body.loginId

        const schema = Joi.object({
            newId: Joi.string().alphanum().min(3).max(20).required(),
        })

        await schema.validateAsync({ newId })
            .catch((error) => {
                const errorMsgParts = error.message.split(' ')
                errorMsgParts.shift()
                const errorMsg = errorMsgParts.join(' ')
                throw new CustomError('400', 'Login Id ' + errorMsg)
            })

        await usersModel.findByIdAndUpdate(userId, { loginId: newId })
        req.session.loginId = newId
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Updates the user's display name with their input display name
const settingsEditNamePOST = async (req, res) => {
    try {
        const userId = req.session.userId
        const newName = req.body.newName
        const schema = Joi.object({
            newName: Joi.string().max(20).required(),
        })

        await schema.validateAsync({ newName })
            .catch((error) => {
                const errorMsgParts = error.message.split(' ')
                errorMsgParts.shift()
                const errorMsg = errorMsgParts.join(' ')
                throw new CustomError('400', 'Name ' + errorMsg)
            })

        const newNameTrimmed = newName.trim()

        await usersModel.findByIdAndUpdate(userId, { name: newNameTrimmed })
        req.session.name = newNameTrimmed
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Updates the user's password with their input password
const settingsEditPasswordPOST = async (req, res) => {
    try {
        const userId = req.session.userId
        const currPass = req.body.currentPwd
        const newPass = req.body.newPwd
        const confirmNewPass = req.body.confirmPwd
        const securityAns = req.body.securityAns
        const securityQuesId = req.session.securityQuestionId

        await settingsService.validatePasswordChange(userId, currPass, newPass, confirmNewPass, securityQuesId, securityAns)

        const hashedPass = await bcrypt.hash(newPass, saltRounds)
        await usersModel.findByIdAndUpdate(userId, { password: hashedPass })
        return res.status(200).json({ message: 'ok' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Updates the user's email with their input email
const settingsEditEmailPOST = async (req, res) => {
    const userId = req.session.userId
    const email = req.body.email
    const schema = Joi.object({
        email: Joi.string().email().max(22).required(),
    })

    try {
        await schema.validateAsync({ email })
        const encryptEmail = await encrypt(email)
        const hashedEmail = await hash(email)

        await usersModel.findByIdAndUpdate(userId, { email: encryptEmail, emailHash: hashedEmail })
        req.session.email = email
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        const errorMsgParts = error.message.split(' ')
        errorMsgParts.shift()
        const errorMsg = errorMsgParts.join(' ')
        return res.status(400).json({ message: 'Email ' + errorMsg })
    }
}

// Updates the user's profile picture with their selected preset profile picture
const settingsChangePicPOST = async (req, res) => {
    const picChoice = req.body.picture
    const userId = req.session.userId
    req.session.picture = picChoice
    await usersModel.findByIdAndUpdate(userId, { picture: picChoice })
    res.redirect('/settings')
}

module.exports = {
    settingsGET,
    settingsEditLoginIdPOST,
    settingsEditNamePOST,
    settingsEditPasswordPOST,
    settingsEditEmailPOST,
    settingsChangePicPOST,
}

