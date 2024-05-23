const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const { CustomError, searcherObject } = require('../utilities')
const Joi = require('joi')
const SecurityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')
const usersModel = require('../models/users')
const { isAuth } = require('../routers/auth')

const searcher = searcherObject({
    filter: {
        $eq: ['_id'],
        $iLike: ['question'],
    },
    sorter: searcherObject().default.sorter,
    pager: searcherObject().default.pager,
})

const hasSecurityQuestion = async (req, res, next) => {
    const result = await userAnswersModel
        .findOne({
            userId: req.session.userId,
        })
        .lean()
    return result ? next() : res.redirect('/setsecurity')
}

router.get('/', isAuth, async (req, res, next) => {
    try {
        const filter = searcher.getFilter(req.query)
        const sorter = searcher.getSorter(req.query)
        const pager = searcher.getPager(req.query)

        const securityQuestions = await SecurityQuestionsModel
            .find(filter, { question: 1 })
            .sort(sorter)
            .skip(pager.skip)
            .limit(pager.limit)
            .lean()
        return res.status(200).json({ securityQuestions: securityQuestions })
    } catch (error) {
        next(error)
    }
})

router.post('/insertAnswer', async (req, res, next) => {
    // const session = await mongoose.startSession()
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

        const result = await SecurityQuestionsModel
            .findById(questionId)
            .lean()
        if (!result) {
            throw new CustomError('422', 'Bad input!')
        }
        // session.startTransaction()
        await Promise.all([
            userAnswersModel
                .create([{
                    userId,
                    questionId,
                    answer,
                }],
                // { session },
                ),
            usersModel
                .findByIdAndUpdate(userId, { security: true }),
            // .session(session),
        ])
        // await session.commitTransaction()
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        // await session.abortTransaction()
        next(error)
    } finally {
        // session.endSession()
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

        const question = await userAnswersModel
            .findOne({
                _id: answerId,
                userId: userId,
            })
            .lean()
        if (!question) {
            throw new CustomError('422', 'Bad input!')
        }
        await userAnswersModel.findByIdAndUpdate(question._id, { answer })
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
})

module.exports = {router, hasSecurityQuestion}
