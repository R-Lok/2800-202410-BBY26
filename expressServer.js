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
const usersModel = require('./models/users')
const mongoose = require('mongoose')

const { incrementStreak } = require('./public/scripts/incrementStreak')

const app = express()
const server = require('http').createServer(app)

// const whitelist = ['http://localhost:3000']

// app.use(cors({ credentials: true, origin: whitelist }))
// app.use(helmet())

app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}//?authSource=admin` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`

const options = {
    mongoUrl: mongoUrl,
    mongoOptions: {
        dbName: process.env.DATABASE_NAME,
    },
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
app.use('/check', isAuth)
app.use('/review', isAuth)
app.use('/submitcards', isAuth)
app.use('/generate', isAuth)
app.use('/api/generate', isAuth)
app.use('/home', isAuth)

app.get('/home', async (req, res) => {
    let existingActivity
    let activityName
    let days
    try {
        let user = await usersModel.findOne({ loginId: req.session.loginId })
        days = user.streak
        const date = new Date()
        const currActivityDate = date.getDate()
        const lastActivity = user.lastActivity
        if (lastActivity === null || lastActivity.timestamp === null || lastActivity.timestamp === undefined || lastActivity.shareId === null || lastActivity.shareId === undefined) {
            existingActivity = 0
            return res.render('home', { activityName: activityName, existingActivity: existingActivity, days: days, name: req.session.name, email: req.session.email, pictureID:req.session.picture })
        }
        const prevActivityDate = lastActivity.timestamp.getDate()

        if ((currActivityDate != prevActivityDate + 1) && (currActivityDate != prevActivityDate)) {
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: {
                    'lastActivity.timestamp': user.lastActivity.timestamp,
                    'lastActivity.shareId': user.lastActivity.shareId,
                    'streak': 0,
                } },
                { returnOriginal: false },
            )
            await user.save()
        }
        existingActivity = `/review/${lastActivity.shareId}`
        const collection = await collectionsModel.findOne({ shareId: lastActivity.shareId })
        if (!collection) {
            throw new Error('No collection found')
        }
        activityName = collection.setName
    } catch (err) {
        console.log(`Error occurred in /home`)
    }
    return res.render('home', { activityName: activityName, existingActivity: existingActivity, days: days, name: req.session.name, email: req.session.email, pictureID:req.session.picture })
})

app.post('/home/shareCode', (req, res) => {
    const shareId = req.body.shareId
    if (shareId === "Egg"){
        res.redirect(`/egg`)
    } else {
        res.redirect(`/review/${shareId}`)
    }
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
    return res.render('setSecurityQuestion', {pictureID:req.session.picture })
})

app.get('/generate', (req, res) => {
    return res.render('generate', {pictureID:req.session.picture })
})

// route for receiving image input from user
app.post('/upload-image', (req, res) => {
    console.log(req.body)
    res.send()
    // Jimmy will work on the backend for this endpoint - this is the endpoint for receiving image input
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
    incrementStreak(req)
    try {
        console.log('set' + req.params.setid)
        await collectionsModel.findOneAndUpdate({ shareId: Number(req.params.setid) }, {updatedAt: new Date() })
        const cards = await flashcardsModel.find({ shareId: Number(req.params.setid) }).select('-_id question answer')
        if (cards.length === 0) {
            return res.render('404', { error: 'Flashcard set does not exist!', pictureID:req.session.picture })
        }
        const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: cards, id: req.params.setid, queryType: 'view', pictureID: req.session.picture }
        return res.render('review', carouselData)
    } catch (err) {
        console.log(`Failed to fetch cards for set ${req.params.setid}`)
        res.render('404', { error: 'Flashcard set does not exist!', pictureID:req.session.picture })
    }
})

app.get('/check', (req, res) => {
    const querydata = req.query.data
    const data = (JSON.parse(querydata)).flashcards

    const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: data, queryType: 'finalize', pictureID:req.session.picture }

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
        await flashcardsModel.insertMany(inputData, { session: transactionSession })
        console.log('flashcards insert ok')
        await collectionsModel.create([{ setName: `${req.body.name}`, userId: req.session.userId, shareId: shareId }], { session: transactionSession })
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

app.get('/egg', (req, res) => {
    return res.render('egg', {pictureID:req.session.picture})
})

app.get('*', (req, res) => {
    return res.status(404).json({ msg: 'page not found' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, mongoUrl }
