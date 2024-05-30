const bcrypt = require('bcrypt')
const saltRounds = 12
const { encrypt, decrypt, hash } = require('../utilities')
const usersModel = require('../models/users')
const userSessionModel = require('../models/userSessions')
const Joi = require('joi')


const registerPOST = async (loginId, name, email, password) => {
    const emailHash = await hash(email)
    await usersModel.countDocuments({ loginId: loginId }).then((count) => {
        if (count) {
            throw new Joi.ValidationError('ValidationError', [{
                message: 'LoginId already exists.',
                path: ['loginId'],
                type: 'LoginId already exists.',
                context: {
                    key: 'loginId',
                },
            }], null)
        }
    })
    await usersModel.countDocuments({ emailHash: emailHash }).then((count) => {
        if (count) {
            throw new Joi.ValidationError('ValidationError', [{
                message: 'Email already exists.',
                path: ['email'],
                type: 'Email already exists.',
                context: {
                    key: 'email',
                },
            }], null)
        }
    })
    const [emailEncrypt, passwordHash] = await Promise.all([
        encrypt(email),
        bcrypt.hash(password, saltRounds),
    ])
    const userObject = {
        loginId,
        name,
        email: emailEncrypt,
        emailHash: emailHash,
        password: passwordHash,
        lastLogin: Date.now(),
        enable: true,
    }
    const user = await usersModel.create(userObject)
    user.email = email
    return user
}

const loginPOST = async (loginId, password) => {
    const user = await usersModel.findOne({ loginId: loginId }).lean()
    if (!user) {
        throw new Joi.ValidationError('ValidationError', [{
            message: 'user not found.',
            path: ['loginId'],
            type: 'not found',
            context: {
                key: 'loginId',
            },
        }], null)
    }
    if (!user.enable) {
        throw new Joi.ValidationError('ValidationError', [{
            message: 'account disable!',
            path: ['loginId'],
            type: 'account disable',
            context: {
                key: 'loginId',
            },
        }], null)
    }
    const result = await bcrypt.compare(password, user.password)
    if (!result) {
        throw new Joi.ValidationError('ValidationError', [{
            message: 'loginId or password incorrect!',
            path: [''],
            type: 'loginId or password incorrect',
            context: {
                key: '',
            },
        }], null)
    }
    await usersModel.findByIdAndUpdate(user.id, { lastLogin: Date.now() }).lean()
    user.email = await decrypt(user.email)
    return user
}

const logoutGET = (req) => {
    const sessionId = req.session.id
    req.session.destroy()
    return userSessionModel.findOneAndDelete({ sessionId: sessionId })
}

const resetPasswordPOST = async ({ userId, password }) => {
    return usersModel
        .findByIdAndUpdate(userId, {
            password: await bcrypt.hash(password, saltRounds),
        })
        .lean()
}

module.exports = {
    registerPOST,
    loginPOST,
    logoutGET,
    resetPasswordPOST,
}
