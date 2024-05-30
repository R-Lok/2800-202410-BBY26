const express = require('express')
const router = new express.Router()
const collectionController = require('../controllers/collection')

// Route for collections page
router.get('/', collectionController.collectionGET)

// Post route which takes search parameter and uses it to filter user's flashcard sets
router.post('/search', collectionController.collectionSearchPOST)

// Post route which sorts collection with current search parameter when sort option selection is changed
router.post('/sortCollection', collectionController.collectionSortPOST)

// Deletion route, flashcard set to be deleted depends on shareId request parameter
router.delete('/delete/:shareId', collectionController.collectionDELETE)

// Delete All route used to delete all flashcards sets and flashcards of user
router.delete('/deleteAll', collectionController.collectionAllDELETE)

module.exports = router
