const { generateImage, generate, convertImageToBase64Jpg } = require('../services/generate')

// middleware for users to upload study material and then generate flashcards
const generateGET = (req, res) => {
    return res.render('generate', { pictureID: req.session.picture })
}

// middleware for calling Open AI api for generating flashcards based on text upload
const textPOST = async (req, res) => {
    try {
        const result = await generate(req.body.difficulty, req.body.numQuestions, req.body.material)
        if (result.success) {
            return res.redirect(`/check/?data=${encodeURIComponent(result.data)}`)
        } else {
            res.status(500).json({ msg: 'Internal server error' })
        }
    } catch (err) {
        console.log('Error calling Open AI API')
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// middleware for calling OpenAI api for generating flashcards based on image upload
const imagePOST = async (req, res) => {
    try {
        const { base64Input, difficulty, numQuestions } = req.body
        const base64Jpg = await convertImageToBase64Jpg(base64Input)
        const imageUrl = `data:image/jpeg;base64,${base64Jpg}`
        const result = await generateImage(difficulty, numQuestions, imageUrl)
        if (result.success) {
            return res.send(`/check/?data=${encodeURIComponent(result.data)}`)
        } else {
            return res.status(500).json({ msg: 'Internal server error' })
        }
    } catch {
        res.status(500).send('Fail to generate flashcards.')
    }
}

// middleware for receiving image input from user
const photoPOST = async (req, res) => {
    const image = req.body.image
    const difficulty = req.body.difficulty
    const numQuestions = req.body.numQuestions
    // base64 string is in req.body.image
    try {
        const result = await generateImage(difficulty, numQuestions, image)
        if (result.success) {
            res.status(200)
            return res.json(result.data)
        } else {
            res.status(500)
            return res.json({ msg: 'Internal server error!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    generateGET,
    textPOST,
    imagePOST,
    photoPOST,
}
