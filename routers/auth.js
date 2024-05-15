const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const saltRounds = 12
const router = new express.Router()
const { CustomError } = require('../utilities/customError')
const Joi = require('joi')
const SecurityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')


const isAuth = (req, res, next) => {
    return req.session.email ? next() : res.redirect('/login')
}

const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next()
    } else {
        throw new CustomError('403', 'Forbidden!')
    }
}

const authorization = (req, user) => {
    req.session.userId = user._id
    req.session.loginId = user.loginId
    req.session.email = user.email
    req.session.name = user.name
    req.session.role = user.role
    console.log(req.session)
}

router.get('/register', (req, res) => {
    return res.render('register')
})

router.post('/register', async (req, res, next) => {
    try {
        const { loginId, name, email, password, confirmPassword } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
            name: Joi.string().alphanum().max(20).required(),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ loginId, name, email, password, confirmPassword })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const result = await userModel.countDocuments({ loginId: loginId })
        if (result) {
            throw new CustomError('422', 'loginId already exists')
        }
        const user = await userModel.create({
            loginId,
            name,
            email,
            password: await bcrypt.hash(password, saltRounds),
            lastLogin: Date.now(),
            enable: true,
        })
        authorization(req, user)
        return res.redirect('/')
    } catch (error) {
        next(error)
    }
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', async (req, res, next) => {
    try {
        const { loginId, password } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })

        await schema.validateAsync({ loginId, password })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const user = await userModel.findOne({ loginId: loginId })
        if (!user) {
            throw new CustomError('422', 'user not found')
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            throw new CustomError('401', 'loginId or password incorrect!')
        }
        await userModel.findByIdAndUpdate(user.id, { lastLogin: Date.now() })
        authorization(req, user)
        return res.redirect('/')
    } catch (error) {
        next(error)
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/')
})

router.get('/getQuestion', async (req, res, next) => {
    try {
        const { email } = req.body
        const result = await userAnswersModel
            .findOne({ email: email }, { _id: 0, questionId: 1, userId: 1 })
            .lean()
        if (!result) {
            throw new CustomError('422', 'You don\'t have a security question yet!')
        }
        const question = await SecurityQuestionsModel
            .findById(result.questionId)
            .lean()
        result.question = question.question

        return res.status(200).json({ result: result })
    } catch (error) {
        next(error)
    }
})

router.post('/checkAnswer', async (req, res, next) => {
    try {
        const { userId, questionId, answer } = req.body
        const result = await userAnswersModel
            .findOne({
                userId: userId,
                questionId: questionId,
            }, { _id: 0, answer: 1 })
            .lean()

        if (!result) {
            throw new CustomError('422', 'You don\'t have a security question yet!')
        }
        if (result.answer !== answer) {
            throw new CustomError('403', 'Incorrect answer!')
        }

        return res.status(200).json({ result: 'ok' })
    } catch (error) {
        next(error)
    }
})


router.post('/resetPassword', async (req, res, next) => {
    try {
        const { userId, password, confirmPassword } = req.body
        console.log(req.body)
        const schema = Joi.object({
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ password, confirmPassword })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const user = await userModel
            .findByIdAndUpdate(userId, {
                password: await bcrypt.hash(password, saltRounds),
            })
            .lean()

        authorization(req, user)
        return res.status(200).json({ result: 'ok' })
    } catch (error) {
        next(error)
    }
})

module.exports = { router, isAuth, isAdmin }
