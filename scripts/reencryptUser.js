require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const usersModel = require('../models/users')
const { CustomError, encrypt, hash } = require('../utilities/index')
const crypto = require('node:crypto')
const keyV1 = Buffer.from(process.env.ENCRYPTION_KEY_V1, 'hex')


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

// [
//     {
//       _id: new ObjectId('66485ad1a1e671a34dca811e'),
//       name: 'admin',
//       email: '{"iv":"12c013014a256e2045ae36cee3c8e39d","content":"940de214c897ffcbbc45a19cf1920f4a"}',
//       emailHash: '7932b2e116b076a54f452848eaabd5857f61bd957fe8a218faf216f24c9885bb'
//     },
//     {
//       _id: new ObjectId('66485ad1a1e671a34dca811f'),
//       name: 'test',
//       email: '{"iv":"67275a228c9c34a64ef3d807c6d1f751","content":"18310bca88b3d2d3153c881e7e93da64"}',
//       emailHash: '87924606b4131a8aceeeae8868531fbb9712aaa07a5d3a756b26ce0f5d6ca674'
//     }
//   ]

const decryptV1 = (encrypted) => {
    return new Promise((resolve, reject) => {
        try {
            const { iv, content } = JSON.parse(encrypted)
            const decipher = crypto.createDecipheriv('aes-256-cbc', keyV1, Buffer.from(iv, 'hex'))
            let decrypted = decipher.update(content, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return resolve(decrypted)
        } catch (error) {
            console.log(error)
            return reject(new CustomError('500', error.reason))
        }
    })
}

const updateUsers = (userUpdates) => {
    const bulkOps = userUpdates.map(({ id, email, emailHash }) => ({
        updateOne: {
            filter: { _id: id },
            update: { $set: { email, emailHash } },
        },
    }))

    return usersModel.bulkWrite(bulkOps)
}

const main = async () => {
    try {
        await mongoose.connect(mongoUrl, mongoOptions)
        console.log('MongoDB connect successful.')

        const users = await usersModel.find({}, { _id: 1, name: 1, email: 1, emailHash: 1 }).lean()
        console.log(users)

        const userObjects = await Promise.all(users.map(async (user) => {
            const email = await decryptV1(user.email)
            const [newEmail, newEmailHash] = await Promise.all([encrypt(email), hash(email)])
            return {
                id: user._id,
                email: newEmail,
                emailHash: newEmailHash,
            }
        }))
        console.log(userObjects)

        await updateUsers(userObjects)
        const results = await usersModel.find({})
        console.log(results)
    } catch (error) {
        console.log(error)
    } finally {
        await mongoose.connection.close(false)
        console.log('MongoDb connection closed.')
    }
}

main()
