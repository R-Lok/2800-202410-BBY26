const express = require('express')
const router = new express.Router()
const authController = require('../controllers/auth')


router.get('/register', authController.registerGET)

router.post('/register', authController.registerPOST)

router.get('/login', authController.loginGET)

router.post('/login', authController.loginPOST)

router.get('/logout', authController.logoutGET)

router.post('/resetPassword', authController.resetPasswordPOST)

module.exports = router
