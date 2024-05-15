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
const securityQuestionsRouter = require('./routers/securityQuestions')

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

app.get('/', (req, res) => {
    const days = 3
    return res.render('home', { days: days, name: req.session.name, email: req.session.email })
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('/collection', async (req, res) => {
    const collections = await collectionsModel.find({ userId: 100 })
    return res.render('collection', { collections: collections })
})

app.post('/searchCollection', async (req, res) => {
    const search = req.body.search
    const regexPattern = new RegExp('^' + search, 'i')
    const collections = await collectionsModel.find({ userId: 100, setName: { $regex: regexPattern } })
    return res.render('collection', { collections: collections })
})

app.get('/deleteCollection/:shareid', async (req, res) => {
    const shareId = req.params.shareid
    console.log('Inside delete, shareid: ' + shareId)
    deleteSet(shareId)
    res.redirect('/collection')
})

async function deleteSet(shareID) {
    try {
        await collectionsModel.deleteOne({ shareId: shareID })
        console.log('Document deleted successfully')
    } catch (err) {
        console.error('Error deleting document: ', err)
    }
}

app.get('/test', (req, res) => {
    return res.render('template')
})

app.get('/landing', (req, res) => {
    return res.render('landing')
})

app.get('/generate', (req, res) => {
    return res.render('generate')
})

app.get('/signup', (req, res) => {
    return res.render('signup')
})

app.get('/review/:setid', (req, res) => {
    const cards = [
        {
            question: 'Element symbol for gold',
            answer: 'Au',
        },
        {
            question: 'Element symbol for Iron',
            answer: 'Fe',
        },
        {
            question: 'Element symbol for Nickel',
            answer: 'Ni',
        },
        {
            question: 'Element symbol for Zinc',
            answer: 'Zn',
        },
        {
            question: 'Element symbols for Mercury',
            answer: 'Hg',
        },
    ]
    const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: cards, id: req.params.setid }

    return res.render('review', carouselData)
})

app.get('*', (req, res) => {
    return res.status(404).json({ msg: 'page not found' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err })
})

module.exports = { server, app, mongoUrl }
