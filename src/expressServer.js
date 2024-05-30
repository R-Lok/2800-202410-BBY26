const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path')
// const cors = require('cors')
// const helmet = require('helmet')
const compression = require('compression')
const checkRouter = require('./routers/check')
const reviewRouter = require('./routers/review')
const authRouter = require('./routers/auth')
const settingRouter = require('./routers/settings')
const submitcardsRouter = require('./routers/submitcards')
const adminRouter = require('./routers/admin')
const generateRouter = require('./routers/generate')
const { isAuth, isAdmin, hasSecurityQuestion } = require('./utilities/index')
const securityQuestionsRouter = require('./routers/securityQuestions')
const collectionRouter = require('./routers/collection')
const homeRouter = require('./routers/home')

const app = express()
const server = require('http').createServer(app)

// const whitelist = ['http://localhost:3000']

// app.use(cors({ credentials: true, origin: whitelist }))
// app.use(helmet)
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/?authSource=admin` :
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
app.use('/admin', isAdmin, hasSecurityQuestion, adminRouter)
app.use('/settings', isAuth, hasSecurityQuestion, settingRouter)
app.use('/securityQuestions', securityQuestionsRouter)
app.use('/collection', isAuth, hasSecurityQuestion, collectionRouter)
app.use('/check', isAuth, hasSecurityQuestion, checkRouter)
app.use('/review', isAuth, hasSecurityQuestion, reviewRouter)
app.use('/submitcards', isAuth, hasSecurityQuestion, submitcardsRouter)
app.use('/generate', isAuth, hasSecurityQuestion, generateRouter)
app.use('/home', isAuth, hasSecurityQuestion, homeRouter)
app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('/', (req, res) => {
    return req.session.email ? res.redirect('/home') : res.render('landing')
})

app.get('/egg', (req, res) => {
    return res.render('egg', { pictureID: req.session.picture })
})

app.get('*', (req, res) => {
    return res.status(404).render('404', { error: 'Page does not exist!', pictureID: req.session.picture })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, mongoUrl }
