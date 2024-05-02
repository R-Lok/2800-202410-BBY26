require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
// const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const bcrypt = require('bcrypt')
const saltRounds = 12
const { OpenAI } = require('openai')
const openai = new OpenAI({ apiKey: `${process.env.AI_KEY}` })


const app = express()
const server = require('http').createServer(app)

// const whitelist = ['http://localhost:9000', 'http://localhost:3000']

// app.use(cors({ credentials: true, origin: whitelist }))
app.use(helmet())
app.use(compression())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`


const options = {
    mongoUrl: mongoUrl,
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET,
    },
    ttl: 10,
}

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create(options),
    saveUninitialized: true,
    resave: true,
    // cookie: { secure: true }
}))

app.get('/', (req, res) => {
    res.send('hello world')
})

async function testApi(req, res) {
    const userInput = 'Osmosis is the diffusion of water through a semipermeable membrane according to the concentration gradient of water across the membrane. Whereas diffusion transports material across membranes and within cells, osmosis transports only water across a membrane and the membrane limits the diffusion of solutes in the water. Osmosis is a special case of diffusion. Water, like other substances, moves from an area of higher concentration to one of lower concentration.'
    const userNumCards = 3
    const completion = await openai.chat.completions.create({
        messages: [{ 'role': 'system', 'content': 'You are a helpful assistant. Your goal is to generate flashcards for the user. Answers should ONLY contain the json. Flashcards should be returned in json format, and each flashcard should have a "prompt" and "answer" attribute.' },
            { 'role': 'user', 'content': `Generate me ${userNumCards} flashcards, the material is: "${userInput}"` }],
        model: 'gpt-4-turbo',
        response_format: { type: 'json_object' },
    })

    // console.log(completion)
    // console.log(JSON.parse(completion.choices[0].message.content))
    return res.send(JSON.parse(completion.choices[0].message.content))
}

app.post('/gen', testApi)

app.get('*', (req, res) => {
    res.status(404)
    res.send('Page not found!')
})

module.exports = { server, app, mongoUrl }
