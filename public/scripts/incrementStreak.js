require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const usersModel = require('../../models/users')

console.log('incrementStreak.js loaded')

const incrementStreak = async(req) => {
    try {
        const currentDate = new Date();
        console.log(`login: ${req.session.loginId}\ndate: ${currentDate}`)
    } catch (err) {
        console.log(`error occured`)
    }
    console.log(`outside of try catch`)
}

module.exports = { incrementStreak }