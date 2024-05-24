const express = require('express')
const app = express()
app.use(express.json())
const router = new express.Router()
const usersModel = require('../models/users')
const securityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')
const bcrypt = require('bcrypt')
const saltRounds = 12
const Joi = require('joi')
const { CustomError, encrypt, decrypt, hash } = require('../utilities/index')


router.get('/', async (req, res) => {
    const userId = req.session.userId
    const user = await usersModel.findById(userId).select('-_id picture name loginId email').lean()
    const userSecurityQuestions = await userAnswersModel.find({ userId: userId }).select('-_id questionId').lean()
    const securityQuesIdValues = userSecurityQuestions.map((q) => q.questionId)
    const randomIndex = Math.floor(Math.random() * securityQuesIdValues.length)
    const randomQuestionId = securityQuesIdValues[randomIndex]
    req.session.securityQuestionId = randomQuestionId
    const securityQues = await securityQuestionsModel.findById(randomQuestionId).select('question').lean()
    const email = await decrypt(user.email)
    return res.render('settings', { imageId: user.picture, name: user.name, loginId: user.loginId, email: email, securityQuestion: securityQues.question, pictureID: req.session.picture })
})

router.post('/editLoginId', async (req, res) => {
    try {
        const userId = req.session.userId
        const newId = req.body.loginId

        const schema = Joi.object({
            newId: Joi.string().max(15).required(),
        })

        await schema.validateAsync({ newId })
            .catch((error) => {
                throw new CustomError('400', error.message)
            })

        await usersModel.findByIdAndUpdate(userId, { loginId: newId })
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/editName', async (req, res) => {
    try {
        const userId = req.session.userId
        const newName = req.body.newName
        const schema = Joi.object({
            newName: Joi.string().alphanum().max(15).required(),
        })

        await schema.validateAsync({ newName })
            .catch((error) => {
                throw new CustomError('400', error.message)
            })

        await usersModel.findByIdAndUpdate(userId, { name: newName })
        req.session.name = newName
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/changePwd', async (req, res) => {
    try {
        const userId = req.session.userId
        const user = await usersModel.findById(userId)
        const currPass = req.body.currentPwd
        const newPass = req.body.newPwd
        const confirmNewPass = req.body.confirmPwd
        const securityAns = req.body.securityAns
        const securityQuesId = req.session.securityQuestionId

        const userAnswer = await userAnswersModel.findOne({ userId: userId, questionId: securityQuesId }).select('answer').lean()
        console.log(userAnswer)
        console.log(userAnswer.answer)
        console.log(securityAns)
        if (userAnswer.answer !== securityAns) {
            console.log('Incorrect security Answer')
            throw new CustomError('401', 'Incorrect Security Answer')
        }

        if (newPass !== confirmNewPass) {
            console.log(newPass)
            console.log(confirmNewPass)
            console.log('Incorrect pass check')
            throw new CustomError('401', 'New Password and Confirm Password do not match')
        }

        const schema = Joi.object({
            currPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            newPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })
        await schema.validateAsync({ currPass, newPass })
            .catch((error) => {
                throw new CustomError('422', 'Missing Password Fields')
            })

        const result = await bcrypt.compare(currPass, user.password)
        if (!result) {
            console.log('Incorrect current password')
            throw new CustomError('401', 'Incorrect Current Password')
        }
        const hashedPass = await bcrypt.hash(newPass, saltRounds)
        await usersModel.findByIdAndUpdate(userId, { password: hashedPass })
        return res.status(200).json({ message: 'ok' })
    } catch (error) {
        console.log(error.statusCode)
        res.status(400).json({ message: error.message })
    }
})

router.post('/editEmail', async (req, res) => {
    const userId = req.session.userId
    const email = req.body.email
    const schema = Joi.object({
        email: Joi.string().email().max(20).required(),
    })

    try {
        await schema.validateAsync({ email })
        const encryptEmail = await encrypt(email)
        const hashedEmail = await hash(email)

        await usersModel.findByIdAndUpdate(userId, { email: encryptEmail, emailHash: hashedEmail })
        return res.status(200).json({
            msg: 'ok',
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

router.post('/changePic', async (req, res) => {
    const picChoice = req.body.picture
    const userId = req.session.userId
    req.session.picture = picChoice;
    await usersModel.findByIdAndUpdate(userId, { picture: picChoice })
    res.redirect('/settings')
})


module.exports = router
