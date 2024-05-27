const express = require('express')
const app = express()
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const mongoose = require('mongoose')

//This route is responsible for writing the flashcards, and flashcard set information to the database.
router.post('/', async (req, res) => {
    let lastShareCode
    let shareId

    console.log("submitcards")

    // get the latest sharecode from collections
    try {
        const result = await collectionsModel.findOne().sort({ shareId: -1 }).select('shareId').exec()
        lastShareCode = result ? result.shareId : null
    } catch (err) {
        console.log('Failed to fetch latestShareCode')
    }
    
    //if the latestSharecode doesn't exist (database has no collections at all), set the shareId to 0 (first collection ever)
    if (lastShareCode === null) {
        shareId = 0
    } else {
        shareId = lastShareCode + 1
    }

    //use map to add the share id to each element of the cards array, to prepare for writing to DB
    const inputData = JSON.parse(req.body.cards).map((card) => {
        return {
            shareId: `${shareId}`,
            ...card,
        }
    })

    //Start a db transaction, if any db operation results in error, abort all the operations (see first line in catch)
    const transactionSession = await mongoose.startSession()
    transactionSession.startTransaction()
    //write flashcard set, and flashcards to db
    try {
        await flashcardsModel.insertMany(inputData, { session: transactionSession })
        console.log('flashcards insert ok')
        await collectionsModel.create([{ setName: `${req.body.name}`, userId: req.session.userId, shareId: shareId }], { session: transactionSession })
        console.log('set insert ok')
        await transactionSession.commitTransaction()
        transactionSession.endSession()
        console.log(`Successfully wrote ${req.body.name} to db`)
        res.status(200)
        res.json(JSON.stringify({ shareId: shareId }))
    } catch (err) {
        //if db write fails, abort transaction and send response json with error message.
        await transactionSession.abortTransaction()
        transactionSession.endSession()
        console.log('Error inserting db')
        res.status(503)
        res.json({message: 'Error saving set! Please try again.'})
    }
})

module.exports = router