// This script is for removing data from our collection, "flashcards"
require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const flashcardModel = require('../models/flashcards')


const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`

const mongoOptions = {
    user: process.env.DATABASE_USERNAME,
    pass: process.env.DATABASE_PASSWORD,
    autoIndex: false,
    dbName: process.env.DATABASE_NAME,
    maxPoolSize: 100,
    ssl: process.env.NODE_ENV === 'local' ? false : true,
    // sslValidate: false,
}

const main = async () => {
    try {
        await mongoose.connect(mongoUrl, mongoOptions)
        console.log('MongoDB connect successful.')

        const results = await flashcardModel.deleteMany({
            shareId: {
                $in: [
                    '0',
                ],
            },

        })
        console.log(results)

        const count = await flashcardModel.countDocuments({})
        console.log(count)
    } catch (error) {
        console.log(error)
    } finally {
        await mongoose.connection.close(false)
        console.log('MongoDb connection closed.')
    }
}

main()
