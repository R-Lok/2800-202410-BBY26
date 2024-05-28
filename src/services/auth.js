const bcrypt = require('bcrypt')
const saltRounds = 12
const { CustomError, encrypt, decrypt, hash } = require('../utilities')
const usersModel = require('../models/users')
const userSessionModel = require('../models/userSessions')


const registerPOST = async (loginId, name, email, password) => {
    const userObject = {
        loginId,
        name,
        email: await encrypt(email),
        emailHash: await hash(email),
        password: await bcrypt.hash(password, saltRounds),
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
        throw new CustomError('404', 'user not found')
    }
    if (!user.enable) {
        throw new CustomError('403', 'account disable!')
    }
    const result = await bcrypt.compare(password, user.password)
    if (!result) {
        throw new CustomError('401', 'loginId or password incorrect!')
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
