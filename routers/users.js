const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    return res.status(200).send('user lists')
})

router.get('/profile', (req, res) => {
    return res.render('profile', { name: req.session.name })
})

module.exports = router
