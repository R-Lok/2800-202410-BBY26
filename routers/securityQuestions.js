const express = require('express')
const router = new express.Router()
const { CustomError } = require('../utilities/customError')
const Joi = require('joi')
const SecurityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')


router.get('/', (req, res) => {
    return res.status(200).json({ msg: 'security questions' })
})

router.post('/insertAnswer', async (req, res, next) => {
    try {
        const { questionId, answer } = req.body
        const { userId } = req.session
        const schema = Joi.object({
            questionId: Joi.string().required(),
            answer: Joi.string().required(),
        })

        await schema.validateAsync({ questionId, answer })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const result = await SecurityQuestionsModel.findById(questionId)
        if (!result) {
            throw new CustomError('422', 'Bad input!')
        }
        await userAnswersModel.create({
            userId,
            questionId,
            answer,
        })
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
})

router.post('/updateAnswer', async (req, res, next) => {
    try {
        const { answer, answerId } = req.body
        const { userId } = req.session
        const schema = Joi.object({
            answer: Joi.string().required(),
            answerId: Joi.string().required(),
        })

        await schema.validateAsync({ answer, answerId })
            .catch((error) => {
                throw new CustomError('422', error)
            })

        const question = await userAnswersModel.findOne({
            _id: answerId,
            userId: userId,
        })
        if (!question) {
            throw new CustomError('422', 'Bad input!')
        }
        await userAnswersModel.findByIdAndUpdate(question._id, {
            answer,
        })
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
})

module.exports = router
