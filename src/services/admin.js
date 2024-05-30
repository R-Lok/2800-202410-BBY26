const { CustomError, decrypt, searcherObject } = require('../utilities/index')
const usersModel = require('../models/users')
const userSessionModel = require('../models/userSessions')

const searcher = searcherObject({
    // can't filter by email because hash
    filter: {
        $eq: ['_id', 'role'],
        $iLike: ['loginId', 'name'],
    },
    sorter: searcherObject().default.sorter,
    pager: searcherObject().default.pager,
})


const userListGET = async (query) => {
    const filter = searcher.getFilter(query)
    const sorter = searcher.getSorter(query)
    const pager = searcher.getPager(query)

    const [results, total] = await Promise.all([
        usersModel
            .find(filter, { emailHash: 0, password: 0, __v: 0 })
            .sort(sorter)
            .skip(pager.skip)
            .limit(pager.limit)
            .lean(),
        usersModel.countDocuments(filter),
    ])

    const data = await Promise.all(results.map(async (user) => {
        user.email = await decrypt(user.email)
        return user
    }))
    return { data, total }
}

const impersonationPOST = async (loginId) => {
    const user = await usersModel.findOne({ loginId: loginId }).lean()
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    user.email = await decrypt(user.email)
    return user
}

const revokePOST = async (loginId) => {
    const user = await usersModel.findOneAndUpdate({ loginId: loginId }, { enable: false }, { new: true })
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    // FIX: does not delete session, too much to work on express-session
    await userSessionModel.deleteMany({ userId: user._id })
    return user
}

const enablePOST = async (loginId) => {
    const user = await usersModel.findOneAndUpdate({ loginId: loginId }, { enable: true }, { new: true })
    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    return user
}

module.exports = {
    userListGET,
    impersonationPOST,
    revokePOST,
    enablePOST,
}
