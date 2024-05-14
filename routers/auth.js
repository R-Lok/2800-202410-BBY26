const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const saltRounds = 12
const router = new express.Router()
const Joi = require('joi')


const isAuth = (req, res, next) => {
    // console.log(req.session)
    // console.log(`email: ${req.session.email}`)
    return req.session.email ? next() : res.redirect('/')
}

router.get('/register', (req, res) => {
    return res.render('register')
})

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        const schema = Joi.object({
            name: Joi.string().alphanum().max(20).required(),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        const validationResult = await schema.validateAsync({ name, email, password, confirmPassword })
        if (validationResult.error && validationResult.error !== null) {
            console.log(validationResult.error)
            return res.redirect('/register')
        }

        const result = await userModel.countDocuments({ email: email })
        if (result) {
            throw new Error('email already exists')
        }
        const user = await userModel.create({
            name,
            email,
            password: await bcrypt.hash(password, saltRounds),
            lastLogin: Date.now(),
            enable: true,
        })
        await userModel.findByIdAndUpdate(user.id, { lastLogin: Date.now() })
        req.session.email = user.email
        req.session.name = user.name
        return res.redirect('/users/profile')
    } catch (error) {
        next(error)
    }
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })

        const validationResult = await schema.validateAsync({ email, password })
        if (validationResult.error && validationResult.error !== null) {
            console.log(validationResult.error)
            return res.redirect('/')
        }

        const user = await userModel.findOne({ email: email })
        if (!user) {
            throw new Error('user not found')
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            throw new Error('email or password incorrect!')
        }
        await userModel.findByIdAndUpdate(user.id, { lastLogin: Date.now() })
        req.session.email = user.email
        req.session.name = user.name
        req.session._id = user._id
        return res.redirect('/users/profile')
    } catch (error) {
        next(error)
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/')
})

module.exports = { router, isAuth }
