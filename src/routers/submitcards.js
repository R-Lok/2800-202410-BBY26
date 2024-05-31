const express = require('express')
const router = new express.Router()
const saveFlashcardsController = require('../controllers/submitcards')


// This route is responsible for writing the flashcards, and flashcard set information to the database.
router.post('/', saveFlashcardsController.saveFlashCardSet)

module.exports = router
