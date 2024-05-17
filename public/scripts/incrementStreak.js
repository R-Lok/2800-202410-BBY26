// require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const usersModel = require('../../models/users')
const incrementStreak = async(req) => {
    try {
        let shareId = req.params.setid;
        let user = await usersModel.findOne({ loginId: req.session.loginId });
        let date = new Date();
        let currActivityDate = date.getDate();
        let lastActivity = user.lastActivity;
        if (lastActivity === null || lastActivity.timestamp === null || lastActivity.timestamp === undefined || lastActivity.shareId === null || lastActivity.shareId === undefined ) {
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
        }
        let prevActivityDate = lastActivity.timestamp.getDate();
        
        // reset or increment streak
        if ((currActivityDate === prevActivityDate + 1) || (user.streak === 0)) {
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