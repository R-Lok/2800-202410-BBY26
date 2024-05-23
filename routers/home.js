const express = require('express')
const router = new express.Router()
const collectionsModel = require('../models/collections')
const usersModel = require('../models/users')
const auditLogsModel = require('../models/auditLog')

const { isConsecutiveDays } = require('../public/scripts/streak')
const { getPrevMonthLastDate, generateDaysOfPrevMonth, generateDaysOfCurrMonth, generateDaysOfNextMonth, getMonthName } = require('../public/scripts/calendar');

router.get('/', async (req, res) => {
    let existingActivity
    let activityName
    let days
    let studiedDays

    let date = new Date()
    let prevMonthDays = generateDaysOfPrevMonth(date)
    let currMonthDays = generateDaysOfCurrMonth(date)
    let nextMonthDays = generateDaysOfNextMonth(date)
    let monthName = getMonthName(date)
    let year = date.getFullYear()

    try {
        let prevMonthLastDate = getPrevMonthLastDate(date)
        let calendarStartDate = prevMonthLastDate.getDate() - prevMonthLastDate.getDay()
        prevMonthLastDate.setDate(calendarStartDate)
    
        let result = await auditLogsModel.find({ loginId: req.session.loginId, createdAt: { "$gte": prevMonthLastDate } })
        
        // makes and uses a set to store unique dates
        let studiedDaysSet = new Set(result.map(log => {
            let date = new Date(log.createdAt)
            return `${date.getMonth()}${date.getDate()}`
        }));

        // gets array back from the set
        studiedDays = Array.from(studiedDaysSet)

        let user = await usersModel.findOne({ loginId: req.session.loginId })
        days = user.streak

        let lastActivity = user.lastActivity
        
        if (lastActivity == null || lastActivity.timestamp == null || lastActivity.shareId == null) {
            existingActivity = 0
            return res.render('home', {
                prevMonthDays: prevMonthDays,
                currMonthDays: currMonthDays,
                nextMonthDays: nextMonthDays,
                monthName: monthName,
                year: year, 
                activityName: activityName,
                existingActivity: existingActivity,
                days: days, 
                studiedDays: studiedDays,
                name: req.session.name,
                email: req.session.email,
                pictureID:req.session.picture
            })
        }
        let dayDifference = isConsecutiveDays(lastActivity.timestamp, date)

        // If dates are NOT consecutive (isConsecutiveDays == 1) AND NOT the same (isConsecutiveDays == 0),
        // then reset the streak. 
        if ((dayDifference != 1) && (dayDifference != 0)) {
            user = await usersModel.findOneAndUpdate( { loginId: req.session.loginId },
                { $set: {
                    'lastActivity.timestamp': user.lastActivity.timestamp,
                    'lastActivity.shareId': user.lastActivity.shareId,
                    'streak': 0,
                } }, { returnOriginal: false }, )
            await user.save()
        }

        const collection = await collectionsModel.findOne( { shareId: lastActivity.shareId } )
        if (!collection) {
            existingActivity = 0
        } else {
            existingActivity = `/review/${lastActivity.shareId}`
            activityName = collection.setName
        }
    } catch (err) {
        console.log(`Error occurred in /home: ${err}`)
    }
    return res.render('home', {
        prevMonthDays: prevMonthDays,
        currMonthDays: currMonthDays,
        nextMonthDays: nextMonthDays,
        monthName: monthName,
        year: year,
        activityName: activityName,
        existingActivity: existingActivity,
        days: days,
        studiedDays: studiedDays,
        name: req.session.name,
        email: req.session.email,
        pictureID:req.session.picture
    })
})

router.post('/shareCode', (req, res) => {
    res.redirect(`/review/${req.body.shareId}`)
})

module.exports = router