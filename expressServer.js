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
const flashcardsModel = require('./models/flashcards')
const mongoose = require('mongoose')


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
    cookie: { secure: process.env.SECURE_COOKIE === 'true' },
}))

app.use('/', authRouter)
app.use('/users', isAuth, userRouter)
app.use('/settings', isAuth, settingRouter)

app.get('/', (req, res) => {
    return res.render('home', { email: req.session.email })
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

app.get('/test', (req, res) => {
    return res.render('template')
})

app.get('/landing', (req, res) => {
    return res.render('landing')
})

app.get('/signup', (req, res) => {
    return res.render('signup')
})

app.get('/generate', (req, res) => {
    return res.render('generate')
})

app.post('/signupSubmit', (req, res) => {
    const userInfo = {
        name: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
    }

    console.log(userInfo)
    res.send('Test')
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
    const carouselData = {bg: "/images/plain-FFFFFF.svg", cards: cards, id: req.params.setid, queryType: "view"}

    return res.render('review', carouselData)
})

app.get("/check/:json", (req, res) => {

    data = [
        {
            "question": "What is the capital of France?",
            "answer": "Paris"
        },
        {
            "question": "Who wrote 'Romeo and Juliet'?",
            "answer": "William Shakespeare"
        },
        {
            "question": "What is the powerhouse of the cell?",
            "answer": "Mitochondria"
        },
        {
            "question": "What is the chemical symbol for water?",
            "answer": "H2O"
        },
        {
            "question": "What year did the Titanic sink?",
            "answer": "1912"
        }
    ]

    const carouselData = { bg: "/images/plain-FFFFFF.svg", cards: data, queryType: "finalize"}

    return res.render('review', carouselData)
})

app.post('/submitcards', async (req, res) => {
    console.log(req.body)
    console.log(req.body.name)
    console.log(JSON.parse(req.body.cards))

    let lastShareCode
    let shareId

    //get the latest sharecode from collections
    try {
         let result  = await collectionsModel.findOne().sort({shareId: -1}).select('shareId').exec()
         console.log(result)
         lastShareCode = result ? result.shareId : null
    } catch (err) {
        console.log("Failed to fetch latestShareCode")
    }

    if (!lastShareCode) {
        shareId = 0;
    } else {
        shareId = lastShareCode + 1;
    }
    console.log(shareId)

    console.log(req.session._id) //user _id

    const inputData = JSON.parse(req.body.cards).map(card => {
        return {
            shareId: `${shareId}`,
            ...card
        }
    })

    console.log(inputData)

    const transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();
    try{
        await flashcardsModel.insertMany(inputData)
        await collectionsModel.create({setName: `${req.body.name}`, userId: req.session._id, shareId: shareId })
        await transactionSession.commitTransaction()
        transactionSession.endSession()
        console.log("Successfully wrote to flashcard collection")
    } catch (err) {
        await transactionSession.abortTransaction()
        transactionSession.endSession()
        console.log("Error inserting to flashcards collection")
    }


    res.send()   
})

app.get('*', (req, res) => {
    return res.status(404).send('Page not found!')
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.status || 500).send(`
    <h1> ${err.message || err} </h1>
    <h1> ${err.errors || ''} </h1>
    <a href='/'><button>try again</button></a>
    `)
})

module.exports = { server, app, mongoUrl }
