const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })

let mongod

const mockMongooseUtils = {
    connect: async () => {
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        console.log(uri)

        const mongooseOpts = {
        }

        await mongoose.connect(uri, mongooseOpts)
    },
    close: async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        if (mongod) {
            await mongod.stop()
        }
    },
    clear: async () => {
        const collections = mongoose.connection.collections

        // eslint-disable-next-line guard-for-in
        for (const key in collections) {
            const collection = collections[key]
            await collection.deleteMany({})
        }
    },

}

beforeAll(async () => await mockMongooseUtils.connect())

afterEach(async () => await mockMongooseUtils.clear())

afterAll(async () => await mockMongooseUtils.close())
