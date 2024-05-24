const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')

router.get('/', async (req, res) => {
    req.session.sort = ''
    req.session.search = ''
    const userId = req.session.userId
    const collections = await collectionsModel.find({ userId: userId })
    return res.render('collection', { collections: collections, pictureID: req.session.picture, selectedOption: req.session.sort, search: req.session.search })
})

router.post('/search', async (req, res) => {
    const userId = req.session.userId
    const search = req.body.search
    const sort = req.session.sort
    req.session.search = search
    const regexPattern = new RegExp('^' + search, 'i')
    let collections

    switch (sort) {
    case 'alpha':
        collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ setName: 1 }).lean()
        break
    case 'new':
        collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ createdAt: -1 }).lean()
        break
    case 'viewed':
        collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ updatedAt: -1 }).lean()
        break
    default:
        collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } })
    }
    return res.render('collection', { collections: collections, pictureID: req.session.picture, selectedOption: sort, search: search })
})

router.get('/delete/:shareid', async (req, res) => {
    const userID = req.session.userId
    const shareID = req.params.shareid
    const setOwnerId = await collectionsModel.findOne({ shareId: shareID }).select('userId')

    if (userID != setOwnerId.userId) {
        res.render('403', { error: 'User Not Authorized', pictureID: req.session.picture })
    } else {
        await deleteSet(shareID)
        res.redirect('/collection')
    }
})

router.post('/sortCollection', async (req, res) => {
    try {
        const selectedOption = req.body.selectedOption
        const search = req.session.search
        const regexPattern = new RegExp('^' + search, 'i')
        const userId = req.session.userId
        req.session.sort = selectedOption
        let collections

        switch (selectedOption) {
        case 'alpha':
            collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ setName: 1 }).lean()
            break
        case 'new':
            collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ createdAt: -1 }).lean()
            break
        case 'viewed':
            collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ updatedAt: -1 }).lean()
            break
        default:
            collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } })
        }
        res.json({ collections })
    } catch (error) {
        console.log(error)
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
