// require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const usersModel = require('../../models/users')
// console.log('incrementStreak.js loaded')
const incrementStreak = async(req) => {
    try {
        let shareId = req.params.setid;
        let date = new Date();
        let currActivityDate = date.getDate();

        let user = await usersModel.findOne({ loginId: req.session.loginId });
        if (!user) {
            throw console.error();
        }
        let lastActivity = user.lastActivity;
        let prevActivityDate = lastActivity.timestamp.getDate();

        // reset or increment streak
        if ((currActivityDate === prevActivityDate + 1) || (user.streak === 0)) {
            console.log(1);
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
        } else if (currActivityDate === prevActivityDate) {
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
        console.log(`Error found in incrementStreak.js`);
        return;
    }
    return;
}

module.exports = { incrementStreak }