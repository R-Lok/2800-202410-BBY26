const express = require('express')
const app = express()
app.use(express.json())
const router = new express.Router()
const usersModel = require('../models/users')
const bcrypt = require('bcrypt')
const saltRounds = 12
const Joi = require('joi')
const { CustomError, encrypt, decrypt, hash } = require('../utilities/index')


router.get('/', async (req, res) => {
    const userId = req.session.userId
    const user = await usersModel.findById(userId).select('-_id picture name loginId email').lean()
    const email = await decrypt(user.email)
    return res.render('settings', { imageId: user.picture, name: user.name, loginId: user.loginId, email: email })
})

router.post('/editLoginId', async (req, res) => {
    const userId = req.session.userId
    const newId = req.body.loginId
    await usersModel.findByIdAndUpdate(userId, { loginId: newId })
    return res.status(200).json({
        msg: 'ok',
    })
})

router.post('/editName', async (req, res) => {
    const userId = req.session.userId
    const newName = req.body.newName
    await usersModel.findByIdAndUpdate(userId, { name: newName })
    return res.status(200).json({
        msg: 'ok',
    })
})

router.post('/changePwd', async (req, res) => {
    try {
        const userId = req.session.userId
        const user = await usersModel.findById(userId)
        const prevPass = req.body.previousPwd
        const newPass = req.body.newPwd
        const confirmNewPass = req.body.confirmPwd
        if (newPass !== confirmNewPass) {
            console.log(newPass)
            console.log(confirmNewPass)
            console.log('Incorrect pass check')
            throw new CustomError('401', 'Incorrect input')
        }
        const schema = Joi.object({
            prevPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            newPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })
        await schema.validateAsync({ prevPass, newPass })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const result = await bcrypt.compare(prevPass, user.password)
        if (!result) {
            console.log('Incorrect prev password')
            throw new CustomError('401', 'loginId or password incorrect!')
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
        email: Joi.string().email().required(),
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
        return res.status(401).json({ message: error.message })
    }
})

router.post('/changePic', async (req, res) => {
    const picChoice = req.body.picture
    const userId = req.session.userId
    await usersModel.findByIdAndUpdate(userId, { picture: picChoice })
    res.redirect('/settings')
})


module.exports = router
