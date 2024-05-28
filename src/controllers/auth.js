const Joi = require('joi')
const { authService } = require('../services/index')
const { CustomError, authorization, tools } = require('../utilities/index')


const registerGET = (req, res) => {
    return res.render('register', { pictureID: req.session.picture })
}

const registerPOST = async (req, res, next) => {
    try {
        const { loginId, name, email, password, confirmPassword } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
            name: Joi.string().max(20).required(),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ loginId, name, email, password, confirmPassword })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const user = await authService.registerPOST(loginId.toLowerCase(), name.toLowerCase(), email.toLowerCase(), password)
        await authorization(req, user)
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
        const user = await authService.loginPOST(loginId.toLowerCase(), password)
        await authorization(req, user)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const logoutGET = async (req, res, next) => {
    try {
        await authService.logoutGET(req)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const resetPasswordPOST = async (req, res, next) => {
    try {
        const { userId, password, confirmPassword } = req.body
        const schema = Joi.object({
            userId: Joi.string().required().custom((value, helper) => {
                if (!tools.isObjectId(value)) {
                    return helper.message('Invalid object id')
                }
            }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            confirmPassword: Joi.ref('password'),
        })
            .with('password', 'confirmPassword')

        await schema.validateAsync({ userId, password, confirmPassword })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await authService.resetPasswordPOST({ userId, password })
        if (!result) {
            throw new CustomError('404', 'user not found')
        }
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
