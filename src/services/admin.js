const { CustomError, decrypt } = require('../utilities/index')
const usersModel = require('../models/users')
const authService = require('../services/auth')


const userListGET = async () => {
    const results = await usersModel.find({}).lean()
    return { data: results, total: results.length }
}

const impersonationPOST = async (loginId) => {
    const user = await usersModel.findOne({ loginId: loginId }).lean()
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    user.email = await decrypt(user.email)
    return user
}

const revokePOST = async (req, loginId) => {
    const user = await usersModel.findOne({ loginId: loginId }).lean()
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    await authService.logoutGET(req)
    return usersModel.findByIdAndUpdate(user._id, { enable: false }, { new: true })
}

const enablePOST = async (loginId) => {
    const user = await usersModel.findOne({ loginId: loginId }).lean()
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    return usersModel.findByIdAndUpdate(user._id, { enable: true }, { new: true })
}

module.exports = {
    userListGET,
    impersonationPOST,
    revokePOST,
    enablePOST,
}
