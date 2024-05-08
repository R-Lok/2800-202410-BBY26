const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    const random = Math.floor(Math.random() * 3) + 1
    const name = req.session.name
    let pic
    if (random === 1) {
        pic = 'depresso.gif'
    } else if (random === 2) {
        pic = 'Dumud.webp'
    } else if (random === 3) {
        pic = 'depresso2.png'
    }
    return res.send(`
        Hi ${name}:
        <br><br>
        <img src="images/${pic}" style="width:400px;">
        <br><br>
        <a href='/'><button>home</button></a>
    `)
})

router.get('/profile', (req, res) => {
    return res.send('About user')
})

module.exports = router
