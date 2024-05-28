const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')

// Route for collections page
router.get('/', async (req, res) => {
    req.session.sort = 'default'
    req.session.search = ''
    const userId = req.session.userId

    // Database read to find all flashcard sets queried using userId
    const collections = await collectionsModel.find({ userId: userId })
    return res.render('collection', { collections: collections, pictureID: req.session.picture, selectedOption: req.session.sort, search: req.session.search })
})

// Post route which takes search parameter and uses it to filter user's flashcard sets
router.post('/search', async (req, res) => {
    const userId = req.session.userId
    const search = req.body.search
    const sort = req.session.sort
    req.session.search = search
    const regexPattern = new RegExp('^' + search, 'i')
    let collections

    // Database read with conditional sorting based off of selected sort option from dropdown options
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

// Post route which sorts collection with current search parameter when sort option selection is changed
router.post('/sortCollection', async (req, res) => {
    try {
        const selectedOption = req.body.selectedOption
        const search = req.session.search
        const regexPattern = new RegExp('^' + search, 'i')
        const userId = req.session.userId
        req.session.sort = selectedOption
        let collections

        // Database read with conditional sorting based off of selected sort option from dropdown options
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

// Deletion route, flashcard set to be deleted depends on shareId request parameter
router.get('/delete/:sharedId', async (req, res) => {
    const userId = req.session.userId
    const shareId = req.params.shareId

    // Database read for the owner of the flashcard set and checks for authorization to delete
    const setOwnerId = await collectionsModel.findOne({ shareId: shareId }).select('userId')

    if (userId != setOwnerId.userId) {
        res.render('403', { error: 'User Not Authorized', pictureID: req.session.picture })
    } else {
        await deleteSet(shareId)
        res.redirect('/collection')
    }
})

// Deletion function used inside deletion route
async function deleteSet(shareId) {
    try {
        // Write to database to delete the flashcard set and flashcards associated with the shareId
        await collectionsModel.deleteOne({ shareId: shareId })
        await flashcardsModel.deleteMany({ shareId: shareId })
        console.log('Document deleted successfully')
    } catch (err) {
        console.error('Error deleting document: ', err)
    }
}

// Delete All route used to delete all flashcards sets and flashcards of user
router.get('/deleteAll', async (req, res) => {
    try {
        const userId = req.session.userId
        const sets = await collectionsModel.find({ userId: userId }).select('shareId')
        const shareIds = sets.map((set) => set.shareId)

        await collectionsModel.deleteMany({ userId: userId })
        await flashcardsModel.deleteMany({ shareId: { $in: shareIds } })
    } catch (error) {
        console.log(error)
    }
    res.redirect('/collection')
})

module.exports = router
