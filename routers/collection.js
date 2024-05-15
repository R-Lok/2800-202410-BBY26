const express = require('express');
const router = new express.Router();
const collectionsModel = require('../models/collections')

router.get('/', async (req, res) => {
    let userId = req.session.userId;
    const collections = await collectionsModel.find({ userId: userId });
    return res.render('collection', { collections: collections })
})

router.post('/search', async (req, res) => {
    let userId = req.session.userId;
    const search = req.body.search
    const regexPattern = new RegExp('^' + search, 'i')
    const collections = await collectionsModel.find({ userId: userId, setName: { $regex: regexPattern } })
    return res.render('collection', { collections: collections })
})

router.get('/delete/:shareid', async (req, res) => {
    const shareId = req.params.shareid
    console.log('Inside delete, shareid: ' + shareId)

    async function deleteSet(shareID) {
        try {
            await collectionsModel.deleteOne({ shareId: shareID })
            console.log('Document deleted successfully')
        } catch (err) {
            console.error('Error deleting document: ', err)
        }
    }

    await deleteSet(shareId)
    res.redirect('/collection')
})

module.exports = router;