const mongoose = require('mongoose')
const { MongoMemoryReplSet } = require('mongodb-memory-server')
require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })


const mockMongooseUtils = {
    connect: async () => {
        this.replset = await MongoMemoryReplSet.create()
        const uri = this.replset.getUri()
        console.log(uri)

        const mongooseOpts = {
        }

        return mongoose.connect(uri, mongooseOpts)
    },
    close: async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        if (this.replset) {
            await this.replset.stop()
        }
    },
    clear: () => {
        const collections = mongoose.connection.collections
        return Promise.all(
            Object.values(collections).map((collection) => collection.deleteMany({})),
        )
    },

}

beforeAll(() => mockMongooseUtils.connect())

afterEach(() => mockMongooseUtils.clear())

afterAll(() => mockMongooseUtils.close())
