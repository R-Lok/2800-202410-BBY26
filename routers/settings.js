const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    return res.render('settings', { image1: 'images/depresso2.png' })
})

router.post('/editName', (req, res) => {
    console.log(req.body)
    return res.json(req.body)
})

router.post('/changePwd', (req, res) => {
    console.log(req.body)
    return res.json(req.body)
})

module.exports = router
