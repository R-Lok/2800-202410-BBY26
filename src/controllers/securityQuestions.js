const Joi = require('joi')
const { sqService } = require('../services/index')
const { CustomError, tools } = require('../utilities')


const sqGETSetup = (req, res) => {
    return res.render('setSecurityQuestion', { pictureID: req.session.picture || '' })
}

const sqGET = async (req, res, next) => {
    try {
        const result = await sqService.sqGET(req.query)
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const sqPOST = async (req, res, next) => {
    try {
        const { questionId, answer } = req.body
        const schema = Joi.object({
            questionId: Joi.string().required(),
            answer: Joi.string().required(),
        })

        await schema.validateAsync({ questionId, answer })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const result = await sqService.sqPOST({ questionId, answer, req })
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const sqPUT = async (req, res, next) => {
    try {
        const { answer, answerId } = req.body
        const schema = Joi.object({
            answer: Joi.string().required(),
            answerId: Joi.string().required(),
        })

        await schema.validateAsync({ answer, answerId })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await sqService.sqPUT({ answer, answerId, req })
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const sqDELETE = async (req, res, next) => {
    try {
        const { userId } = req.params
        const schema = Joi.object({
            userId: Joi.string().required().custom((value, helper) => {
                if (!tools.isObjectId(value)) {
                    return helper.message('Invalid object id')
                }
            }),
        })
        await schema.validateAsync({ userId })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await sqService.sqDELETE({ req, userId })
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const sqGETQuestion = async (req, res, next) => {
    try {
        const { email } = req.params
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Invalid Email. Try again.',
            }),
        })
        await schema.validateAsync({ email })
            .catch((error) => {
                throw new CustomError('422', error.details[0].message)
            })
        const result = await sqService.sqGETQuestion({ email })
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const sqPOSTCheck = async (req, res, next) => {
    try {
        const { userId, questionId, answer } = req.body
        const schema = Joi.object({
            userId: Joi.string().required().custom((value, helper) => {
                if (!tools.isObjectId(value)) {
                    return helper.message('Invalid user id')
                }
            }),
            questionId: Joi.string().required().custom((value, helper) => {
                if (!tools.isObjectId(value)) {
                    return helper.message('Invalid question id')
                }
            }),
            answer: Joi.string().required(),
        })
        await schema.validateAsync({ userId, questionId, answer })
            .catch((error) => {
                throw new CustomError('422', error)
            })
        const result = await sqService.sqPOSTCheck({ userId, questionId, answer })
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sqGETSetup,
    sqGET,
    sqPOST,
    sqPUT,
    sqDELETE,
    sqGETQuestion,
    sqPOSTCheck,
}
