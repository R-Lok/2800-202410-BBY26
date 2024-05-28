// require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const usersModel = require('../../models/users')

function isConsecutiveDays(lastDate, currDate) {
    // console.log(`\nisConsecutiveDays\n`)

    const d = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    const d2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
    // console.log(`lastDate: ${d}`)
    // console.log(`currDate: ${d2}`)

    // console.log(`${d.getTime()} ${d2.getTime()}`)

    const msDifferenceBetweenDays = Math.abs(d.getTime() - d2.getTime())
    const dayDifference = msDifferenceBetweenDays / (1000 * 60 * 60 * 24) // converting millisecond difference between dates to days

    // console.log(`${dayDifference}`)
    return dayDifference
}

const incrementStreak = async (req) => {
    try {
        const shareId = req.params.setid

        let user = await usersModel.findOne({ loginId: req.session.loginId })
        const date = new Date()
        // date.setMonth(5)
        // date.setDate(25)
        // console.log(`after setdate ${date.getDate()}`)

        const lastActivity = user.lastActivity
        // console.log(`lastActivity ${lastActivity.timestamp}`)

        // If lastActivity or its properties are null, then set the properties and increment the streak
        if ((lastActivity == null || lastActivity.timestamp == null || lastActivity.shareId == null) ||
            (isConsecutiveDays(lastActivity.timestamp, date)) || (user.streak == 0)) {
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: {
                    'lastActivity.timestamp': date,
                    'lastActivity.shareId': shareId,
                },
                $inc: {
                    streak: 1,
                } },
                { returnOriginal: false },
            )
            await user.save()
            return
        // else if the days are the same, then maintain
        } else if (isConsecutiveDays(lastActivity.timestamp, date) == 0) {
            const value = user.streak
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: {
                    'lastActivity.timestamp': date,
                    'lastActivity.shareId': shareId,
                    'streak': value,
                } },
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
