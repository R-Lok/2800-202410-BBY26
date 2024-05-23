const { CustomError } = require('./customError')
const usersModel = require('../models/users')


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

module.exports = {
    isAuth,
    isAdmin,
    noSecurityQuestion,
    hasSecurityQuestion,
}
