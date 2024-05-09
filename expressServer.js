const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
// const cors = require('cors')
// const helmet = require('helmet')
const compression = require('compression')
const userRouter = require('./routers/users')
const settingRouter = require('./routers/settings')


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
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`


const MongoClient = require("mongodb").MongoClient; 
var database = new MongoClient(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const options = {
    mongoUrl: mongoUrl,
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET,
    },
    ttl: process.env.SESSION_TTL,
}

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create(options),
    saveUninitialized: false,
    resave: false,
    cookie: { secure: process.env.SECURE_COOKIE === 'true' },
}))

app.use('/members', userRouter)
app.use('/settings', settingRouter)

app.get('/', (req, res) => {
    return res.render('home', { email: req.session.email })
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

<<<<<<< HEAD
app.get('/collection', async (req, res) => {
    var flashcardCollection = database.db(process.env.DATABASE_NAME).collection('flashcardset')
    const collections = await flashcardCollection.find({userId:100}).toArray();
    return res.render('collection', {collections, collections});
})

app.post('/searchCollection', async(req, res) => {
    var search = req.body.search;
    var flashcardCollection = database.db(process.env.DATABASE_NAME).collection('flashcardset')
    const regexPattern = new RegExp('^' + search, 'i');
    const collections = await flashcardCollection.find({userId: 100, setName: { $regex: regexPattern } }).toArray();
    return res.render('collection', {collections, collections});
    
});

=======
app.get('/test', (req, res) => {
    return res.render('template');
})

>>>>>>> dev
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
