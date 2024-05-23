require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const crypto = require('node:crypto')
const algorithm = 'AES-GCM'
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')

// const { promisify } = require('node:util')
// const randomBytesAsync = promisify(crypto.randomBytes)
// const { encrypt, decrypt, hash } = require('../utilities/index')
// // const usersModel = require('../models/users')

// const main = async () => {
//     // const result = await randomBytesAsync(32)
//     // console.log(result.toString('hex'))
//     const email = 'kimmy@coldmail123.com'
//     const { secretKey, iv, content } = await encrypt(email)
//     console.log(secretKey, iv, content)
//     console.log(await decrypt(content, iv, secretKey))
//     // console.log(await hash(email))
// }

// main()

const generateKey = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')


async function encrypt(text) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedPlaintext = new TextEncoder().encode(text)

    const secretKey = await crypto.subtle.importKey('raw', Buffer.from(key, 'base64'), {
        name: algorithm,
        length: 256,
    }, true, ['encrypt', 'decrypt'])

    const content = await crypto.subtle.encrypt({
        name: algorithm,
        iv,
    }, secretKey, encodedPlaintext)

    return {
        content: Buffer.from(content).toString('base64'),
        iv: Buffer.from(iv).toString('base64'),
    }
}

async function decrypt(content, iv) {
    const secretKey = await crypto.subtle.importKey('raw', Buffer.from(key, 'base64'), {
        name: algorithm,
        length: 256,
    }, true, ['encrypt', 'decrypt'])

    const plainText = await crypto.subtle.decrypt({
        name: algorithm,
        iv: Buffer.from(iv, 'base64'),
    }, secretKey, Buffer.from(content, 'base64'))

    return new TextDecoder().decode(plainText)
}

const hash = async (text) => {
    const data = new TextEncoder().encode(text)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Buffer.from(hash).toString('base64')

    // return Buffer.from(crypto.getRandomValues(new Uint8Array(hash))).toString('base64')
}

const main = async () => {
    // const {
    //     iv,
    //     content,
    // } = await encrypt('will@gmail.com')

    // console.log(`iv: ${iv}`)
    // console.log(`content: ${content}`)

    // console.log(await decrypt(
    //     content,
    //     iv,
    // ))
    console.log(await hash('will@gmail.com'))
    // console.log(generateKey())
}

main()
