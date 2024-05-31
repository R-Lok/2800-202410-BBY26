const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')

// Deletion function used inside deletion route
const deleteSet = async (shareId) => {
    try {
        // Write to database to delete the flashcard set and flashcards associated with the shareId
        await collectionsModel.deleteOne({ shareId: shareId })
        await flashcardsModel.deleteMany({ shareId: shareId })
    } catch (err) {
        console.error('Error deleting document: ', err)
        throw (err)
    }
}

// Queries and returns flashcard sets based off of search pattern, sorted in alphabetical order
const sortAlpha = async (userId, regexPattern) => {
    const collection = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ setName: 1 }).lean()
    return collection
}

// Queries and returns flashcard sets based off of search pattern, sorted by newest generated
const sortNew = async (userId, regexPattern) => {
    const collection = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ createdAt: -1 }).lean()
    return collection
}

// Queries and returns flashcard sets based off of search pattern, sorted by most recently viewed
const sortViewed = async (userId, regexPattern) => {
    const collection = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } }).sort({ updatedAt: -1 }).lean()
    return collection
}

// Queries and returns flashcard sets based off of search pattern, sorted by oldest generated
const sortOld = async (userId, regexPattern) => {
    const collection = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } })
    return collection
}

module.exports = {
    deleteSet,
    sortAlpha,
    sortNew,
    sortViewed,
    sortOld,
}
