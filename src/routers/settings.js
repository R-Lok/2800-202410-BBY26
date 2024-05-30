const express = require('express')
const app = express()
app.use(express.json())
const router = new express.Router()
const settingsController = require('../controllers/settings')

// Renders the User Profile page to the client
router.get('/', settingsController.settingsGET)

// Updates the user's login Id with their input login Id
router.post('/editLoginId', settingsController.settingsEditLoginIdPOST)

// Updates the user's display name with their input display name
router.post('/editName', settingsController.settingsEditNamePOST)

// Updates the user's password with their input password
router.post('/changePwd', settingsController.settingsEditPasswordPOST)

// Updates the user's email with their input email
router.post('/editEmail', settingsController.settingsEditEmailPOST)

// Updates the user's profile picture with their selected preset profile picture
router.post('/changePic', settingsController.settingsChangePicPOST)


module.exports = router
