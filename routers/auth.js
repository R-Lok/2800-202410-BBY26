const express = require('express')
const bcrypt = require('bcrypt')
const usersModel = require('../models/users')
const saltRounds = 12
const router = new express.Router()
const { CustomError, encrypt, decrypt, hash } = require('../utilities/index')
const Joi = require('joi')


const isAuth = (req, res, next) => {
    return req.session.email ? next() : res.redirect('/login')
}

const hasSecurityQuestion = async (req, res, next) => {
    const { userId } = req.session
    const user = await usersModel.findById(userId, { security: 1 }).lean()
    if (user.security === true) {
        return next()
    } else {
        return res.redirect('/setSecurityQuestion')
    }
}

const noSecurityQuestion = async (req, res, next) => {
    const { userId } = req.session
    const user = await usersModel.findById(userId, { security: 1 }).lean()
    if (user.security === false) {
        return next()
    } else {
        return next(new CustomError('400', 'Already have security question.'))
    }
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
    req.session.picture = user.picture
    console.log(req.session)
}

router.get('/register', (req, res) => {
    return res.render('register', { pictureID: req.session.picture })
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

        const result = await usersModel.countDocuments({ loginId: loginId })
        if (result) {
            throw new CustomError('422', 'loginId already exists')
        }
        const userObject = {
            loginId,
            name,
            email: await encrypt(email),
            emailHash: await hash(email),
            password: await bcrypt.hash(password, saltRounds),
            lastLogin: Date.now(),
            enable: true,
        }
        const user = await usersModel.create(userObject)
        user.email = email
        authorization(req, user)
        return res.redirect('/setSecurityQuestion')
    } catch (error) {
        next(error)
    }
})

router.get('/login', (req, res) => {
    return res.render('login', { pictureID: req.session.picture })
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

        const user = await usersModel.findOne({ loginId: loginId }).lean()
        if (!user) {
            throw new CustomError('422', 'user not found')
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            throw new CustomError('401', 'loginId or password incorrect!')
        }
        await usersModel.findByIdAndUpdate(user.id, { lastLogin: Date.now() }).lean()
        user.email = await decrypt(user.email)
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

router.post('/resetPassword', async (req, res, next) => {
    try {
        const { userId, password, confirmPassword } = req.body
        const schema = Joi.object({
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ password, confirmPassword })
            .catch((error) => {
                console.log(error)
                throw new CustomError('422', error)
            })

        const user = await usersModel
            .findByIdAndUpdate(userId, {
                password: await bcrypt.hash(password, saltRounds),
            })
            .lean()

        return res.status(200).json({ result: 'ok' })
    } catch (error) {
        next(error)
    }
})

module.exports = { router, isAuth, hasSecurityQuestion, noSecurityQuestion, isAdmin }
