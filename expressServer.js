require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo');
// const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')


const app = express()
const server = require('http').createServer(app)

// const whitelist = ['http://localhost:9000', 'http://localhost:3000']

// app.use(cors({ credentials: true, origin: whitelist }))
app.use(helmet())
app.use(compression())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const mongoUrl = process.env.NODE_ENV == 'local' ?
`mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/`
: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=BBY26`


const options = {
    mongoUrl: mongoUrl,
	crypto: {
		secret: process.env.MONGODB_SESSION_SECRET
	},
    ttl: 10
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

app.get('*', (req, res) => {
    res.status(404)
    res.send("Page not found!")
})

module.exports = { server, app, mongoUrl }
