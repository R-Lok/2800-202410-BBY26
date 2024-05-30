const express = require('express')
const router = new express.Router()
const generateController = require('../controllers/generate')


router.get('/', generateController.generateGET)

router.post('/bytext', generateController.textPOST)

router.post('/byimage', generateController.imagePOST)

router.post('/byphotoupload', generateController.photoPOST)

module.exports = router