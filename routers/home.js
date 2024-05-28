const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const usersModel = require('../models/users')
const auditLogsModel = require('../models/auditLog')

const { isConsecutiveDays } = require('../public/scripts/streak')
const {
    getPrevMonthLastDate,
    generateDaysOfPrevMonth,
    generateDaysOfCurrMonth,
    generateDaysOfNextMonth, 
    getMonthName,
    getStudiedDays,
    getStreakDays
} = require('../public/scripts/calendar');

router.get('/', async (req, res) => {
    const date = new Date()
    let existingActivity = 0
    let activityName
    let auditLogResult
    let user
    try {
        let prevMonthLastDate = getPrevMonthLastDate(date)
        let calendarStartDate = prevMonthLastDate.getDate() - prevMonthLastDate.getDay()
        prevMonthLastDate.setDate(calendarStartDate)
        auditLogResult = await auditLogsModel.find({ loginId: req.session.loginId, createdAt: { "$gte": prevMonthLastDate } })        
        user = await usersModel.findOne({ loginId: req.session.loginId })
        if (user.lastActivity == null || user.lastActivity.timestamp == null || user.lastActivity.shareId == null) return renderHome(req, res, date, activityName, existingActivity, user, auditLogResult)
        const dayDifference = isConsecutiveDays(user.lastActivity.timestamp, date)
        // If dates are not consecutive and not the same, then reset the streak. 
        if ((dayDifference != 1) && (dayDifference != 0)) {
            user = await usersModel.findOneAndUpdate( { loginId: req.session.loginId },
                { $set: { 'lastActivity.timestamp': user.lastActivity.timestamp, 'lastActivity.shareId': user.lastActivity.shareId, 'streak': 0, } },
                { returnOriginal: false }, )
            await user.save()
        }
        const collection = await collectionsModel.findOne( { shareId: user.lastActivity.shareId } )
        if (collection) {
            existingActivity = `/review/${user.lastActivity.shareId}`
            activityName = collection.setName
        }
    } catch (err) {
        console.log(`Error occurred in /home: ${err}`)
    }
    return renderHome(req, res, date, activityName, existingActivity, user, auditLogResult)
})

router.post('/shareCode', (req, res) => {
    if(req.body.shareId.toLowerCase() == 'egg'){
        res.redirect('/egg')
    } else {
        res.redirect(`/review/${req.body.shareId}`)
    }
})

function renderHome(req, res, date, activityName, existingActivity, user, auditLogResult) {
    return res.render('home', {
        prevMonthDays: generateDaysOfPrevMonth(date),
        currMonthDays: generateDaysOfCurrMonth(date),
        nextMonthDays: generateDaysOfNextMonth(date),
        monthName: getMonthName(date),
        year: date.getFullYear(),
        activityName: activityName,
        existingActivity: existingActivity,
        days: user.streak,
        studiedDays: getStudiedDays(auditLogResult),
        streakDays: getStreakDays(user.lastActivity.timestamp, date, user.streak),
        name: req.session.name,
        email: req.session.email,
        pictureID:req.session.picture
    })
}

module.exports = router