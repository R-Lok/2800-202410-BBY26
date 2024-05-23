const Joi = require('joi')
const { authService } = require('../services/index')
const { CustomError } = require('../utilities')


const authorization = (req, user) => {
    req.session.userId = user._id
    req.session.loginId = user.loginId
    req.session.email = user.email
    req.session.name = user.name
    req.session.role = user.role
    req.session.picture = user.picture
    console.log(req.session)
}

const registerGET = (req, res) => {
    return res.render('register', { pictureID: req.session.picture })
}

const registerPOST = async (req, res, next) => {
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
        const user = await authService.registerPOST({ loginId, name, email, password, confirmPassword })
        authorization(req, user)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const loginGET = (req, res) => {
    return res.render('login', { pictureID: req.session.picture })
}

const loginPOST = async (req, res, next) => {
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
        const user = await authService.loginPOST({ loginId, password })
        authorization(req, user)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const logoutGET = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
}

const resetPasswordPOST = async (req, res, next) => {
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
        await authService.resetPasswordPOST({ userId, password })
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    registerGET,
    registerPOST,
    loginGET,
    loginPOST,
    logoutGET,
    resetPasswordPOST,
}
