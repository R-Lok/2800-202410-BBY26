// require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const usersModel = require('../../models/users')
const { isConsecutiveDays } = require('./isConsecutiveDays')

const incrementStreak = async(req) => {
    try {
        console.log(`\nincrementStreak\n`)

        let shareId = req.params.setid

        let user = await usersModel.findOne({ loginId: req.session.loginId })
        let date = new Date()
        // date.setMonth(5)
        // date.setDate(1) 
        // console.log(`after setdate ${date.getDate()}`)
        
        let lastActivity = user.lastActivity;
        console.log(`lastActivity ${lastActivity.timestamp}`)

        // If lastActivity or its properties are null, then set the properties and increment the streak
        if ((lastActivity == null || lastActivity.timestamp == null || lastActivity.shareId == null)
            || (isConsecutiveDays(lastActivity.timestamp, date)) || (user.streak == 0)) {
                console.log(`11`)
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
            console.log(`22`)
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
        // let prevActivityDate = lastActivity.timestamp.getDate();
        
        // reset or increment streak
        // if ((currActivityDate === prevActivityDate + 1) || (user.streak === 0)) {
        //     user = await usersModel.findOneAndUpdate(
        //         { loginId: req.session.loginId },
        //         {$set: {
        //                 'lastActivity.timestamp': date,
        //                 'lastActivity.shareId': shareId,
        //         },
        //         $inc: {
        //             streak: 1
        //         }},
        //         {returnOriginal: false}
        //     );
        // } else if (currActivityDate === prevActivityDate) {
        //     let value = user.streak
        //     user = await usersModel.findOneAndUpdate(
        //         { loginId: req.session.loginId },
        //         { $set: {
        //             'lastActivity.timestamp': date,
        //             'lastActivity.shareId': shareId,
        //             streak: value
        //         }},
        //         {returnOriginal: false}
        //     );
        // }
        await user.save();
    } catch (err) {
        console.log(`Error found in incrementStreak.js: ${err}`);
        return;
    }
    return;
}

module.exports = { incrementStreak }