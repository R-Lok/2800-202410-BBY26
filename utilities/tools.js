const mongoose = require('mongoose')

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

module.exports = {
    isObjectId,
    sleep,
}
