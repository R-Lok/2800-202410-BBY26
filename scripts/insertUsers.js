require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 12
const userModel = require('../src/models/users')
const { encrypt, hash } = require('../src/utilities/index')


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

        const userObjects = [
            {
                loginId: 'admin', name: 'admin', email: await encrypt('admin@gmail.com'),
                emailHash: await hash('admin@gmail.com'), password: await bcrypt.hash(process.env.ADMIN, saltRounds), role: 'admin',
                enable: true, security: true,
            },
            {
                loginId: 'test', name: 'test', email: await encrypt('test@gmail.com'),
                emailHash: await hash('test@gmail.com'), password: await bcrypt.hash('123', saltRounds), role: 'normal',
                enable: true, security: true,
            }]
        const results = await userModel.insertMany(userObjects)
        console.log(results)

        const users = await userModel.find({})
        console.log(users)
    } catch (error) {
        console.log(error)
    } finally {
        await mongoose.connection.close(false)
        console.log('MongoDb connection closed.')
    }
}

main()
