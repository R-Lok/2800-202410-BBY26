const crypto = require('node:crypto')
const { promisify } = require('node:util')
const randomBytesAsync = promisify(crypto.randomBytes)
const { CustomError } = require('./customError')
const algorithm = 'aes-256-cbc'
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')


const encrypt = async (text) => {
    const iv = await randomBytesAsync(16)
    return new Promise((resolve, reject) => {
        try {
            const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
            let encrypted = cipher.update(text, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            return resolve(JSON.stringify({
                iv: iv.toString('hex'),
                content: encrypted,
            }))
        } catch (error) {
            return reject(new CustomError('500', error.reason))
        }
    })
}

const decrypt = (encrypted) => {
    return new Promise((resolve, reject) => {
        try {
            const { iv, content } = JSON.parse(encrypted)
            const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
            let decrypted = decipher.update(content, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            return resolve(decrypted)
        } catch (error) {
            return reject(new CustomError('500', error.reason))
        }
    })
}

const hash = (text) => {
    return new Promise((resolve, reject) => {
        try {
            return resolve(crypto.createHash('sha256').update(text).digest('hex'))
        } catch (error) {
            return reject(new CustomError('500', error.reason))
        }
    })
}

module.exports = { encrypt, decrypt, hash }
