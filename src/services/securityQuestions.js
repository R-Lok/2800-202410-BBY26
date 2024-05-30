const mongoose = require('mongoose')
const { CustomError, searcherObject, hash } = require('../utilities')
const SecurityQuestionsModel = require('../models/securityQuestions')
const userAnswersModel = require('../models/userAnswers')
const usersModel = require('../models/users')

const searcher = searcherObject({
    filter: {
        $eq: ['_id'],
        $iLike: ['question'],
    },
    sorter: searcherObject().default.sorter,
    pager: searcherObject().default.pager,
})

const sqGET = async (query) => {
    const filter = searcher.getFilter(query)
    const sorter = searcher.getSorter(query)
    const pager = searcher.getPager(query)

    const securityQuestions = await SecurityQuestionsModel
        .find(filter, { question: 1 })
        .sort(sorter)
        .skip(pager.skip)
        .limit(pager.limit)
        .lean()
    return securityQuestions
}

const sqPOST = async ({ questionId, answer, req }) => {
    const { userId } = req.session
    const session = await mongoose.startSession()
    const result = await SecurityQuestionsModel
        .findById(questionId)
        .lean()
    if (!result) {
        throw new CustomError('404', 'Question not found!')
    }

    await session.withTransaction(() => {
        return Promise.all([
            userAnswersModel
                .create([{
                    userId,
                    questionId,
                    answer,
                }],
                { session: session },
                ),
            usersModel
                .findByIdAndUpdate(userId, { security: true }, { session }),
        ])
    }).finally(() => session.endSession())
    req.session.security = true
    return { msg: 'ok' }
}

const sqPUT = async ({ answer, answerId, req }) => {
    const { userId } = req.session
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
    return { msg: 'ok' }
}

const sqDELETE = async ({ req, userId }) => {
    const session = await mongoose.startSession()

    const user = await usersModel.findById(userId).lean()
    if (!user) {
        throw new CustomError('404', 'user not found.')
    }
    await session.withTransaction(() => {
        return Promise.all([
            userAnswersModel.deleteMany({ userId: userId }, { session }),
            usersModel.findByIdAndUpdate(userId, { security: false }, { session }),
        ])
    }).finally(() => session.endSession())
    req.session.security = false
    return { msg: 'ok' }
}

const sqGETQuestion = async ({ email }) => {
    const emailHash = await hash(email)
    const user = await usersModel
        .findOne({ emailHash: emailHash }, { _id: 1 })
        .lean()
    if (!user) {
        throw new CustomError('404', 'User does not exist. Try again.')
    }
    const result = await userAnswersModel
        .findOne({ userId: user._id }, { _id: 0, questionId: 1, userId: 1 })
        .lean()
    if (!result) {
        throw new CustomError('422', `You haven't set up security question.`)
    }
    const question = await SecurityQuestionsModel
        .findById(result.questionId)
        .lean()
    result.question = question.question
    return result
}

const sqPOSTCheck = async ({ userId, questionId, answer }) => {
    const result = await userAnswersModel
        .findOne({
            userId: userId,
            questionId: questionId,
        }, { _id: 0, answer: 1 })
        .lean()

    if (!result) {
        throw new CustomError('404', 'Answer not found!')
    }
    if (result.answer !== answer) {
        throw new CustomError('403', 'Incorrect answer!')
    }
    return { msg: 'ok' }
}

module.exports = {
    sqGET,
    sqPOST,
    sqPUT,
    sqDELETE,
    sqGETQuestion,
    sqPOSTCheck,
}
