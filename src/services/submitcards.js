const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const mongoose = require('mongoose')


// This function fetches the last used sharecode from the database, returns null if no last used sharecode (no documents in collection)
async function getLastSharecode() {
    try {
        const result = await collectionsModel.findOne().sort({ shareId: -1 }).select('shareId').exec()
        const lastShareCode = result ? result.shareId : null
        return { success: true, lastShareCode: lastShareCode }
    } catch (err) {
        console.log('Failed to fetch latestShareCode')
        return { error: true, message: 'Error with database connection' }
    }
}

// This function adds the provided shareId to each card element of the provided card array
function addShareIdToCards(cards, shareId) {
    const result = cards.map((card) => {
        return {
            shareId: `${shareId}`,
            ...card,
        }
    })
    return result
}

// This function writes the provided flashcard set into the database.
async function writeFlashCardSetToDB(setName, userId, shareId, flashcards) {
    // Start a db transaction, if any db operation results in error, abort all the operations (see first line in catch)
    const transactionSession = await mongoose.startSession()
    transactionSession.startTransaction()
    // write flashcard set, and flashcards to db
    try {
        await flashcardsModel.insertMany(flashcards, { session: transactionSession })
        console.log('flashcards insert ok')
        await collectionsModel.create([{ setName: `${setName}`, userId: userId, shareId: shareId }], { session: transactionSession })
        console.log('set insert ok')
        await transactionSession.commitTransaction()
        transactionSession.endSession()
        console.log(`Successfully wrote ${setName} to db`)
        return { success: true, shareId: shareId }
    } catch (err) {
        // if db write fails, abort transaction and send response json with error message.
        await transactionSession.abortTransaction()
        transactionSession.endSession()
        console.log('Error inserting db')
        return { error: true, message: 'Error inserting to database' }
    }
}

module.exports = {
    getLastSharecode,
    addShareIdToCards,
    writeFlashCardSetToDB,
}
