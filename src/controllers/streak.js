const usersModel = require('../models/users')

// isConsecutiveDays checks if two dates are consecutive dates
function isConsecutiveDays(lastDate, currDate) {
    const d = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    const d2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
    // Gets the millisecond difference between dates
    const msDifferenceBetweenDays = Math.abs(d.getTime() - d2.getTime())
    // Converts millisecond difference between dates to days
    const dayDifference = msDifferenceBetweenDays / (1000 * 60 * 60 * 24)
    return dayDifference
}

// incrementStreak checks if streak should be incremented or maintained
const incrementStreak = async (req) => {
    try {
        let user = await usersModel.findOne({ loginId: req.session.loginId })
        const date = new Date()
        const lastActivity = user.lastActivity
        // Checks if user's last activity is null or if the user's lastActivity time and current date are consecutive
        if ((lastActivity === null || lastActivity.timestamp === null || lastActivity.shareId === null) ||
            (isConsecutiveDays(lastActivity.timestamp, date)) || (user.streak === 0)) {
            // If user's last activity is null or consecutive to the current date, then update lastActivity and increment streak
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: { 'lastActivity.timestamp': date, 'lastActivity.shareId': req.params.setid }, $inc: { streak: 1 } },
                { returnOriginal: false },
            )
        } else if (isConsecutiveDays(lastActivity.timestamp, date) === 0) {
            // If the user's last activity date and current date are the same, then update lastActivity and maintain the streak
            const value = user.streak
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: { 'lastActivity.timestamp': date, 'lastActivity.shareId': req.params.setid, 'streak': value } },
                { returnOriginal: false },
            )
        }
        await user.save()
    } catch (err) {
        console.log(`Error found: ${err}`)
        return
    }
    return
}

module.exports = { incrementStreak, isConsecutiveDays }
