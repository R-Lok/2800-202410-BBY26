const Joi = require('joi')
const { authService } = require('../services/index')
const { CustomError, authorization, tools } = require('../utilities/index')


const checkLoginId = Joi.string().alphanum().min(3).max(20).required().messages({
    'string.max': 'Login ID must be at most 20 characters long',
    'string.pattern.base': 'Login ID must be between 3 and 20 characters long and contain only alpha-numeric characters',
    'string.empty': 'Login ID is required',
})

const checkPwd = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required().messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must be between 3 and 20 alpha-numeric characters',
})

const checkConfirmPwd = Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Please confirm your password',
})

const registerGET = (req, res) => {
    return res.render('register', { pictureID: req.session.picture })
}

const registerPOST = async (req, res, next) => {
    try {
        const { loginId, name, email, password, confirmPassword } = req.body
        const schema = Joi.object({
            name: Joi.string().max(20).required().messages({
                'string.max': 'Display name must be at most 20 characters long',
                'string.empty': 'Display name is required',
            }),
            email: Joi.string().max(22).required().email().messages({
                'string.email': 'Email must be a valid email',
                'string.max': 'Email must have a max length of 22 characters',
                'string.empty': 'Email is required',
            }),
            loginId: checkLoginId,
            password: checkPwd,
            confirmPassword: checkConfirmPwd,
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
            loginId: checkLoginId,
            password: checkPwd,
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
        return res.status(200).redirect('./')
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
            password: checkPwd,
            confirmPassword: checkConfirmPwd,
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
