const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
// const cors = require('cors')
// const helmet = require('helmet')
const compression = require('compression')
const userRouter = require('./routers/users')
const { router: authRouter, isAuth } = require('./routers/auth')
const settingRouter = require('./routers/settings')
const collectionsModel = require('./models/collections')
const OpenAI = require('openai')
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
const securityQuestionsRouter = require('./routers/securityQuestions')
const flashcardsModel = require('./models/flashcards')
const collectionRouter = require('./routers/collection')
const mongoose = require('mongoose')


const app = express()
const server = require('http').createServer(app)

// const whitelist = ['http://localhost:3000']

// app.use(cors({ credentials: true, origin: whitelist }))
// app.use(helmet())

// const {x, y, generateDaysOfCurrMonth} = require('./public/scripts/calendar.js');

app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`

const options = {
    mongoUrl: mongoUrl,
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET,
    },
    ttl: process.env.SESSION_TTL,
}

app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create(options),
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
}))

app.use('/', authRouter)
app.use('/users', isAuth, userRouter)
app.use('/settings', isAuth, settingRouter)
app.use('/securityQuestions', isAuth, securityQuestionsRouter)
app.use('/collection', isAuth, collectionRouter)

app.get('/home', (req, res) => {
    const days = 3
    return res.render('home', { days: days, name: req.session.name, email: req.session.email })
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})


app.get('/test', (req, res) => {
    return res.render('template')
})

app.get('/', (req, res) => {
    return req.session.email ? res.redirect('/home') : res.render('landing')
})

app.get('/setSecurityQuestion', (req, res) => {
    return res.render('setSecurityQuestion')
})

app.get('/generate', (req, res) => {
    return res.render('generate')
})

async function generate(difficulty, number, material) {
    let completion
    try {
        completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
            'You are a assistant that generates flashcards for students studying quizzes and exam.',
                },
                {
                    role: 'user',
                    content: `Given the following studying material in text: ${material}.
                Generate an array in json format that contains ${number} flashcards object elments with ${difficulty} difficulty.
                Question and answer of flashcards should be the keys of each flashcard object element`,
                },
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
    } catch (err) {
        console.log(`API Call fails: ${err}`)
    }
    const jsonResult = completion.choices[0].message.content

    return jsonResult
}

app.post('/api/generate', async (req, res) => {
    try {
        const result = await generate(req.body.difficulty, req.body.numQuestions, req.body.material)
        return res.redirect(`/check/?data=${result}`)
    } catch (err) {
        console.log('Error calling Open AI API')
    }
})

app.get('/review/:setid', async (req, res) => {
    try {
        console.log('set' + req.params.setid)
        const cards = await flashcardsModel.find({ shareId: Number(req.params.setid) }).select('-_id question answer')
        if (cards.length === 0) {
            return res.render('404', { error: 'Flashcard set does not exist!' })
        }
        const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: cards, id: req.params.setid, queryType: 'view' }
        return res.render('review', carouselData)
    } catch (err) {
        console.log(`Failed to fetch cards for set ${req.params.setid}`)
        res.render('404', { error: 'Flashcard set does not exist!' })
    }
})

app.get('/check', (req, res) => {
    const querydata = req.query.data
    const data = (JSON.parse(querydata)).flashcards

    const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: data, queryType: 'finalize' }

    return res.render('review', carouselData)
})

app.post('/submitcards', async (req, res) => {
    let lastShareCode
    let shareId

    // get the latest sharecode from collections
    try {
        const result = await collectionsModel.findOne().sort({ shareId: -1 }).select('shareId').exec()
        lastShareCode = result ? result.shareId : null
    } catch (err) {
        console.log('Failed to fetch latestShareCode')
    }

    if (lastShareCode === null) {
        shareId = 0
    } else {
        shareId = lastShareCode + 1
    }

    const inputData = JSON.parse(req.body.cards).map((card) => {
        return {
            shareId: `${shareId}`,
            ...card,
        }
    })

    const transactionSession = await mongoose.startSession()
    transactionSession.startTransaction()
    try {
        await flashcardsModel.insertMany(inputData)
        console.log('flashcards insert ok')
        await collectionsModel.create({ setName: `${req.body.name}`, userId: req.session.userId, shareId: shareId })
        console.log('set insert ok')
        await transactionSession.commitTransaction()
        transactionSession.endSession()
        console.log(`Successfully wrote ${req.body.name} to db`)
    } catch (err) {
        await transactionSession.abortTransaction()
        transactionSession.endSession()
        console.log('Error inserting db')
    }

    res.status(200)
    res.json(JSON.stringify({ shareId: shareId }))
})

app.get('*', (req, res) => {
    return res.status(404).json({ msg: 'page not found' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err })
})

module.exports = { server, app, mongoUrl }
