const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/userList', adminController.userListGET)

router.post('/impersonation', adminController.impersonationPOST)

router.post('/revoke', adminController.revokePOST)

router.post('/enable', adminController.enablePOST)

module.exports = router
