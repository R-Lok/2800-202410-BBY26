const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const { collectionService } = require('../services/index')

// GET route to render the base collections page
const collectionGET = async (req, res) => {
    req.session.sort = 'default'
    req.session.search = ''
    const userId = req.session.userId

    // Database read to find all flashcard sets queried using userId
    const collections = await collectionsModel.find({ userId: userId }).sort({ updatedAt: -1 }).lean()
    return res.render('collection', { collections: collections, pictureID: req.session.picture, selectedOption: req.session.sort, search: req.session.search })
}

// Post route which takes search parameter and uses it to filter user's flashcard sets
const collectionSearchPOST = async (req, res) => {
    const userId = req.session.userId
    const search = req.body.search
    const sort = req.session.sort
    req.session.search = search
    const regexPattern = new RegExp('^' + search, 'i')
    let collections

    // Database read with conditional sorting based off of selected sort option from dropdown options
    switch (sort) {
    case 'alpha':
        collections = await collectionService.sortAlpha(userId, regexPattern)
        break
    case 'new':
        collections = await collectionService.sortNew(userId, regexPattern)
        break
    case 'old':
        collections = await collectionService.sortOld(userId, regexPattern)
        break
    default:
        collections = await collectionService.sortViewed(userId, regexPattern)
    }
    return res.render('collection', { collections: collections, pictureID: req.session.picture, selectedOption: sort, search: search })
}

// Sorts collection with current search parameter when sort option selection is changed
const collectionSortPOST = async (req, res) => {
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
            collections = await collectionService.sortAlpha(userId, regexPattern)
            break
        case 'new':
            collections = await collectionService.sortNew(userId, regexPattern)
            break
        case 'viewed':
            collections = await collectionService.sortOld(userId, regexPattern)
            break
        default:
            collections = await collectionService.sortViewed(userId, regexPattern)
        }
        res.json({ collections })
    } catch (error) {
        console.log(error)
    }
}

// Deletes flashcard set based on shareId request parameter
const collectionDELETE = async (req, res) => {
    const userId = req.session.userId
    const shareId = req.params.shareId

    try {
        // Database read for the owner of the flashcard set and checks for authorization to delete
        const setOwnerId = await collectionsModel.findOne({ shareId: shareId }).select('userId')
        const setOwnerIdString = setOwnerId.userId.toString()

        if (!setOwnerId) {
            return res.status(404).json({ message: 'Flashcard set not found' })
        }
        if (userId !== setOwnerIdString) {
            return res.status(403).json({ message: 'User not authorized' })
        }

        await collectionService.deleteSet(shareId)
        return res.status(200).json({ message: 'Flashcard set deleted successfully' })
    } catch (err) {
        return res.status(404).json({ message: 'Error! Cannot delete this flashcard set' })
    }
}

// Delete all flashcards sets and flashcards of user
const collectionAllDELETE = async (req, res) => {
    try {
        const userId = req.session.userId
        const sets = await collectionsModel.find({ userId: userId }).select('shareId')
        const shareIds = sets.map((set) => set.shareId)

        // Write to database to delete all flashcard sets and flashcards associated with the user
        await collectionsModel.deleteMany({ userId: userId })
        await flashcardsModel.deleteMany({ shareId: { $in: shareIds } })
        return res.status(200).json({ message: 'All flashcards sets deleted successfully' })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'Error! Cannot delete all flashcards' })
    }
}

module.exports = {
    collectionGET,
    collectionSearchPOST,
    collectionSortPOST,
    collectionDELETE,
    collectionAllDELETE,
}
