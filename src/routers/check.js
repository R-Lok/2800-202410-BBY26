const express = require('express')
const router = new express.Router()

// this route receives json data from the generate page. The JSON represents the flashcards
// and this route renders a "review" page to the client tolet them view the cards before saving them.
router.get('/', (req, res) => {
    try {
        const raw = JSON.parse(req.query.data)
        const data = raw.flashcards
        const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: data, queryType: 'finalize', pictureID: req.session.picture }

        return res.render('review', carouselData)
    } catch {
        return res.render('400', { error: 'Invalid data', pictureID: req.session.picture })
    }
})

module.exports = router
