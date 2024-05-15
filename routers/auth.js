const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const saltRounds = 12
const router = new express.Router()
const { CustomError } = require('../utilities/customError')
const Joi = require('joi')


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
    req.session.accountId = user.accountId
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
        const { accountId, name, email, password, confirmPassword } = req.body
        const schema = Joi.object({
            accountId: Joi.string().max(20).required(),
            name: Joi.string().alphanum().max(20).required(),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ accountId, name, email, password, confirmPassword })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const result = await userModel.countDocuments({ accountId: accountId })
        if (result) {
            throw new CustomError('422', 'accountId already exists')
        }
        const user = await userModel.create({
            accountId,
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
        const { accountId, password } = req.body
        const schema = Joi.object({
            accountId: Joi.string().max(20).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })

        await schema.validateAsync({ accountId, password })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const user = await userModel.findOne({ accountId: accountId })
        if (!user) {
            throw new CustomError('422', 'user not found')
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            throw new CustomError('401', 'accountId or password incorrect!')
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

module.exports = { router, isAuth, isAdmin }
