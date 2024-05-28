const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const auditlogModel = require('../models/auditLog')
const { incrementStreak } = require('../controllers/streak')

// the review router has a parameter, setid which indicates which set of flashcards the user wants to view
// the route queries the db for this set of cards, and renders the flashcards to the client's browser.
router.get('/:setid', async (req, res) => {
    try {
        console.log('set' + req.params.setid)
        // retrieving flashcards with the same setid from db
        const cards = await flashcardsModel.find({ shareId: Number(req.params.setid) }).select('-_id question answer')

        // check if there are any cards associated with the setid
        if (cards.length === 0) {
            return res.render('404', { error: 'Flashcard set does not exist!', pictureID: req.session.picture })
        }

        // if flashcard set exists, update user's latestActivity, increment their study streak and log their view
        await collectionsModel.findOneAndUpdate({ shareId: Number(req.params.setid) }, { updatedAt: new Date() })
        incrementStreak(req)
        await auditlogModel.create({ loginId: req.session.loginId, type: 'flashcard', shareId: req.params.setid })
        const carouselData = { bg: '/images/plain-FFFFFF.svg', cards: cards, id: req.params.setid, queryType: 'view', pictureID: req.session.picture }
        return res.render('review', carouselData)
    } catch (err) {
        console.log(`Failed to fetch cards for set ${req.params.setid}`)
        res.render('404', { error: 'Flashcard set does not exist!', pictureID: req.session.picture })
    }
})

module.exports = router
