const Joi = require('joi')
const { adminService } = require('../services/index')
const { CustomError, authorization } = require('../utilities/index')


const userListGET = async (req, res, next) => {
    try {
        const result = await adminService.userListGET({})
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const impersonationPOST = async (req, res, next) => {
    try {
        const { loginId } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
        })

        await schema.validateAsync({ loginId })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const user = await adminService.impersonationPOST(loginId)
        await authorization(req, user)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const revokePOST = async (req, res, next) => {
    try {
        const { loginId } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
        })

        await schema.validateAsync({ loginId })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await adminService.revokePOST(req, loginId)
        if (!result) {
            throw new CustomError('404', 'user not found')
        }
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const enablePOST = async (req, res, next) => {
    try {
        const { loginId } = req.body
        const schema = Joi.object({
            loginId: Joi.string().max(20).required(),
        })

        await schema.validateAsync({ loginId })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await adminService.enablePOST(loginId)
        if (!result) {
            throw new CustomError('404', 'user not found')
        }
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userListGET,
    impersonationPOST,
    revokePOST,
    enablePOST,
}
