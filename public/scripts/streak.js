// require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const usersModel = require('../../models/users')

function isConsecutiveDays(lastDate, currDate) {
    // console.log(`\nisConsecutiveDays\n`)

    let d = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    let d2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
    // console.log(`lastDate: ${d}`)
    // console.log(`currDate: ${d2}`)

    // console.log(`${d.getTime()} ${d2.getTime()}`)

    let msDifferenceBetweenDays = Math.abs(d.getTime() - d2.getTime())
    let dayDifference = msDifferenceBetweenDays / (1000 * 60 * 60 * 24) // converting millisecond difference between dates to days

    // console.log(`${dayDifference}`)
    return dayDifference
}

const incrementStreak = async(req) => {
    try {
        let shareId = req.params.setid

        let user = await usersModel.findOne({ loginId: req.session.loginId })
        let date = new Date()
        // date.setMonth(5)
        // date.setDate(25) 
        // console.log(`after setdate ${date.getDate()}`)
        
        let lastActivity = user.lastActivity;
        // console.log(`lastActivity ${lastActivity.timestamp}`)

        // If lastActivity or its properties are null, then set the properties and increment the streak
        if ((lastActivity == null || lastActivity.timestamp == null || lastActivity.shareId == null)
            || (isConsecutiveDays(lastActivity.timestamp, date)) || (user.streak == 0)) {
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                {$set: {
                        'lastActivity.timestamp': date,
                        'lastActivity.shareId': shareId,
                },
                $inc: {
                    streak: 1
                }},
                {returnOriginal: false}
            );
            await user.save();
            return;
        // else if the days are the same, then maintain
        } else if (isConsecutiveDays(lastActivity.timestamp, date) == 0) {
            let value = user.streak
            user = await usersModel.findOneAndUpdate(
                { loginId: req.session.loginId },
                { $set: {
                    'lastActivity.timestamp': date,
                    'lastActivity.shareId': shareId,
                    streak: value
                }},
                {returnOriginal: false}
            );
        }
        await user.save();
    } catch (err) {
        console.log(`Error found in incrementStreak.js: ${err}`);
        return;
    }
    return;
}

module.exports = { incrementStreak, isConsecutiveDays }