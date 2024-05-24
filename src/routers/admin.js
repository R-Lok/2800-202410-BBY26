const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/userList', adminController.userListGET)

router.post('/impersonation/:loginIn', adminController.impersonationPOST)

router.post('/revoke/:loginIn', adminController.revokePOST)

module.exports = router
