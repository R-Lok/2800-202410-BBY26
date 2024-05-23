const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    const querydata = req.query.data
    const data = (JSON.parse(querydata)).flashcards

    const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: data, queryType: 'finalize', pictureID: req.session.picture }

    return res.render('review', carouselData)
})

module.exports = router