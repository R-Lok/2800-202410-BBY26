const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const auditlogModel = require("../models/auditLog")
const {incrementStreak} = require("../controllers/streak")

router.get('/:setid', async (req, res) => {
    try {
        console.log('set' + req.params.setid)
        const cards = await flashcardsModel.find({ shareId: Number(req.params.setid) }).select('-_id question answer')
        if (cards.length === 0) {
            return res.render('404', { error: 'Flashcard set does not exist!', pictureID: req.session.picture })
        }
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