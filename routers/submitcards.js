const express = require('express')
const app = express()
const router = new express.Router()
const collectionsModel = require('../models/collections')
const flashcardsModel = require('../models/flashcards')
const mongoose = require('mongoose')


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

    if (lastShareCode === null) {
        shareId = 0
    } else {
        shareId = lastShareCode + 1
    }

    const inputData = JSON.parse(req.body.cards).map((card) => {
        return {
            shareId: `${shareId}`,
            ...card,
        }
    })

    const transactionSession = await mongoose.startSession()
    transactionSession.startTransaction()
    try {
        await flashcardsModel.insertMany(inputData, { session: transactionSession })
        console.log('flashcards insert ok')
        await collectionsModel.create([{ setName: `${req.body.name}`, userId: req.session.userId, shareId: shareId }], { session: transactionSession })
        console.log('set insert ok')
        await transactionSession.commitTransaction()
        transactionSession.endSession()
        console.log(`Successfully wrote ${req.body.name} to db`)
    } catch (err) {
        await transactionSession.abortTransaction()
        transactionSession.endSession()
        console.log('Error inserting db')
    }

    res.status(200)
    res.json(JSON.stringify({ shareId: shareId }))
})

module.exports = router