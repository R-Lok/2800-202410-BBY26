const express = require('express')
const router = new express.Router()
const { isAuth, isAdmin, noSecurityQuestion } = require('../utilities/index')
const { sqController } = require('../controllers/index')


router.get('/setup', sqController.sqGETSetup)

router.get('/', isAuth, sqController.sqGET)

router.post('/', isAuth, noSecurityQuestion, sqController.sqPOST)

router.put('/', isAuth, sqController.sqPUT)

router.delete('/:userId', isAuth, isAdmin, sqController.sqDELETE)

router.get('/:email', sqController.sqGETQuestion)

router.post('/checkAnswer', sqController.sqPOSTCheck)

module.exports = router
