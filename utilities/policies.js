const { CustomError } = require('./customError')
const usersModel = require('../models/users')
const userSessionModel = require('../models/userSessions')


const isAuth = (req, res, next) => {
    return req.session.email ? next() : res.redirect('/login')
}

const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next()
    } else {
        throw new CustomError('403', 'Forbidden!')
    }
}

const hasSecurityQuestion = async (req, res, next) => {
    const { userId } = req.session
    const user = await usersModel.findById(userId, { security: 1 }).lean()
    if (user.security === true) {
        return next()
    } else {
        return res.redirect('/securityQuestions/setup')
    }
}

const noSecurityQuestion = async (req, res, next) => {
    const { userId } = req.session
    const user = await usersModel.findById(userId, { security: 1 }).lean()
    if (user.security === false) {
        return next()
    } else {
        return next(new CustomError('400', 'Already have security question.'))
    }
}

const authorization = (req, user) => {
    req.session.userId = user._id
    req.session.loginId = user.loginId
    req.session.email = user.email
    req.session.name = user.name
    req.session.role = user.role
    req.session.picture = user.picture
    console.log(req.session)

    const now = new Date()
    const updateObject = {
        userId: user._id,
        sessionId: req.session.id,
        updatedAt: now,
        createdAt: now,
    }
    return userSessionModel.findOneAndUpdate(
        { sessionId: req.session.id },
        { $set: updateObject },
        { upsert: true },
    )
}

module.exports = {
    isAuth,
    isAdmin,
    noSecurityQuestion,
    hasSecurityQuestion,
    authorization,
}
