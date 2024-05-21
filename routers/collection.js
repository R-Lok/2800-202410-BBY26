const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')

router.get('/', async (req, res) => {
    const userId = req.session.userId
    const collections = await collectionsModel.find({ userId: userId })
    return res.render('collection', { collections: collections, pictureID:req.session.picture })
})

router.post('/search', async (req, res) => {
    const userId = req.session.userId
    const search = req.body.search
    const regexPattern = new RegExp('^' + search, 'i')
    const collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } })
    return res.render('collection', { collections: collections, pictureID:req.session.picture })
})

router.get('/delete/:shareid', async (req, res) => {
    const userID = req.session.userId
    const shareID = req.params.shareid
    const setOwnerId = await collectionsModel.findOne({ shareId: shareID }).select('userId')

    if (userID != setOwnerId.userId) {
        res.render('403', { error: 'User Not Authorized', pictureID:req.session.picture })
    } else {
        await deleteSet(shareID)
        res.redirect('/collection')
    }
})

async function deleteSet(shareID) {
    try {
        await collectionsModel.deleteOne({ shareId: shareID })
        await flashcardsModel.deleteMany({ shareId: shareID })
        console.log('Document deleted successfully')
    } catch (err) {
        console.error('Error deleting document: ', err)
    }
}

module.exports = router
