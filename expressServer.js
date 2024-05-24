const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
// const cors = require('cors')
// const helmet = require('helmet')
const compression = require('compression')
const sharp = require("sharp");
const userRouter = require('./routers/users')
const checkRouter = require('./routers/check')
const { router: authRouter, isAuth, hasSecurityQuestion } = require('./routers/auth')
const settingRouter = require('./routers/settings')
const submitcardsRouter = require('./routers/submitcards')
const collectionsModel = require('./models/collections')
const OpenAI = require('openai')
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
const securityQuestionsRouter = require('./routers/securityQuestions')
const flashcardsModel = require('./models/flashcards')
const collectionRouter = require('./routers/collection')
const homeRouter = require('./routers/home')
const auditlogModel = require('./models/auditLog')
const mongoose = require('mongoose')

const { incrementStreak, isConsecutiveDays } = require('./public/scripts/streak')

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
app.use('/users', isAuth, hasSecurityQuestion, userRouter)
app.use('/settings', isAuth, hasSecurityQuestion, settingRouter)
app.use('/securityQuestions', securityQuestionsRouter)
app.use('/collection', isAuth, hasSecurityQuestion, collectionRouter)
app.use('/check', isAuth, hasSecurityQuestion, checkRouter)
app.use('/review', isAuth, hasSecurityQuestion)
app.use('/submitcards', isAuth, hasSecurityQuestion, submitcardsRouter)
app.use('/generate', isAuth, hasSecurityQuestion)
app.use('/api/generate', isAuth, hasSecurityQuestion)
app.use('/home', isAuth, hasSecurityQuestion, homeRouter)
app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('/test', (req, res) => {
    return res.render('template')
})

app.get('/', (req, res) => {
    return req.session.email ? res.redirect('/home') : res.render('landing')
})

app.get('/generate', (req, res) => {
    return res.render('generate', { pictureID: req.session.picture })
})

// route for receiving image input from user
app.post('/upload-image', async (req, res) => {
    const image = req.body.image
    const difficulty = req.body.difficulty
    const numQuestions = req.body.numQuestions
    // base64 string is in req.body.image
    try {
        const result = await generateImage(difficulty, numQuestions, image)
        res.status(200)
        return res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500)
        res.json(err)
    }
})

async function generateImage(difficulty, numQuestions, image) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages: [
                {
                    role: 'system', content: 'You are a assistant that generate flashcards for students studying quizzes and exams',
                },
                {
                    role: 'user',
                    content: [{
                        type: 'text', text: `Given the provided image, Generate an array in json format that contains ${numQuestions} flashcards object elments with ${difficulty} difficulty.
                Question and answer of flashcards should be the keys of each flashcard object element` }, { 'type': 'image_url', 'image_url': { 'url': image } }],
                },
            ],
        })
        return response.choices[0].message.content
    } catch (err) {
        console.log(err)
    }
}

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

async function convertImageToBase64Jpg(base64Input) {
    try {
        // Decode the base64 input image to a buffer
        const inputBuffer = Buffer.from(base64Input, "base64");

        // Use sharp to convert the input buffer to JPG format and get the base64 string
        const base64Output = await sharp(inputBuffer)
            .jpeg()
            .toBuffer()
            .then((data) => data.toString("base64"));

        return base64Output;
    } catch (error) {
        console.error("Error converting image to base64 JPG:", error);
        throw error;
    }
}

async function generateWithImage(base64Jpg, difficulty, numQuestions) {
    const imageUrl = `data:image/jpeg;base64,${base64Jpg}`;

    let completion;
    try {
        completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a assistant that generates flashcards for students studying quizzes and exam.",
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Given the following studying material shown in the image.
                  Generate an array in json format that contains ${numQuestions} flashcards object elments with ${difficulty} difficulty.
                  Question and answer of flashcards should be the keys of each flashcard object element`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    } catch (err) {
        console.log(`API Call fails: ${err}`);
    }
    const jsonResult = completion.choices[0].message.content;

    return jsonResult;
}

app.post("/api/generatebyimage", async (req, res) => {
    try {
      const {base64Input, difficulty, numQuestions} = req.body;
      const base64Jpg = await convertImageToBase64Jpg(base64Input);
      const result = await generateWithImage(base64Jpg, difficulty, numQuestions);
      return res.send(`/check/?data=${encodeURIComponent(result)}`)
    } catch {
      res.status(400).send("Fail to generate flashcards.");
    }
});

app.get('/review/:setid', async (req, res) => {
    try {
        incrementStreak(req)
        await auditlogModel.create({ loginId: req.session.loginId, type: 'flashcard', shareId: req.params.setid })

        console.log('set' + req.params.setid)
        await collectionsModel.findOneAndUpdate({ shareId: Number(req.params.setid) }, { updatedAt: new Date() })
        const cards = await flashcardsModel.find({ shareId: Number(req.params.setid) }).select('-_id question answer')
        if (cards.length === 0) {
            return res.render('404', { error: 'Flashcard set does not exist!', pictureID: req.session.picture })
        }
        const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: cards, id: req.params.setid, queryType: 'view', pictureID: req.session.picture }
        return res.render('review', carouselData)
    } catch (err) {
        console.log(`Failed to fetch cards for set ${req.params.setid}`)
        res.render('404', { error: 'Flashcard set does not exist!', pictureID: req.session.picture })
    }
})



app.get('/egg', (req, res) => {
    return res.render('egg', { pictureID: req.session.picture })
})

app.get('*', (req, res) => {
    return res.status(404).json({ msg: 'page not found' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, mongoUrl }
