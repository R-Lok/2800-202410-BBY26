const crypto = require('node:crypto')
const { CustomError } = require('./customError')
const algorithm = 'AES-GCM'
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')

const generateKey = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')

const encrypt = async (text) => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedPlaintext = new TextEncoder().encode(text)

    try {
        const secretKey = await crypto.subtle.importKey('raw', Buffer.from(key, 'base64'), {
            name: algorithm,
            length: 256,
        }, true, ['encrypt', 'decrypt'])

        const content = await crypto.subtle.encrypt({
            name: algorithm,
            iv,
        }, secretKey, encodedPlaintext)

        return JSON.stringify({
            iv: Buffer.from(iv).toString('base64'),
            content: Buffer.from(content).toString('base64'),
        })
    } catch (error) {
        console.log(error)
        throw new CustomError('500', error.msg)
    }
}

const decrypt = async (encrypted) => {
    const { iv, content } = JSON.parse(encrypted)
    try {
        const secretKey = await crypto.subtle.importKey('raw', Buffer.from(key, 'base64'), {
            name: algorithm,
            length: 256,
        }, true, ['encrypt', 'decrypt'])

        const plainText = await crypto.subtle.decrypt({
            name: algorithm,
            iv: Buffer.from(iv, 'base64'),
        }, secretKey, Buffer.from(content, 'base64'))

        return new TextDecoder().decode(plainText)
    } catch (error) {
        throw new CustomError('500', error.msg)
    }
}

const hash = async (text) => {
    try {
        const data = new TextEncoder().encode(text)
        const hash = await crypto.subtle.digest('SHA-256', data)

        return Buffer.from(crypto.getRandomValues(new Uint8Array(hash))).toString('base64')
    } catch (error) {
        throw new CustomError('500', error.msg)
    }
}

module.exports = { generateKey, encrypt, decrypt, hash }
