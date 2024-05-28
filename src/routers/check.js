const express = require('express')
const router = new express.Router()

// this route receives json data from the generate page. The JSON represents the flashcards
// and this route renders a "review" page to the client tolet them view the cards before saving them.
router.get('/', (req, res) => {
    const querydata = decodeURI(req.query.data)
    const data = (JSON.parse(querydata)).flashcards

    const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: data, queryType: 'finalize', pictureID: req.session.picture }

    return res.render('review', carouselData)
})

module.exports = router
