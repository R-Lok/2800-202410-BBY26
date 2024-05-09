const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
// const helmet = require('helmet')
const compression = require('compression')
const userRouter = require('./routers/users')
const settingRouter = require('./routers/settings')


const app = express()
const server = require('http').createServer(app)

const whitelist = ['http://localhost:3000']

app.use(cors({ credentials: true, origin: whitelist }))
// app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/` :
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`

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
    cookie: { secure: false },
}))

app.use('/members', userRouter)
app.use('/settings', settingRouter)

app.get('/', (req, res) => {
    return res.render('home', { email: req.session.email })
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
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
