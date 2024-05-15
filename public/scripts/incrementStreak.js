require('dotenv').config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const usersModel = require('../../models/users')

console.log('incrementStreak.js loaded')

const incrementStreak = async(req) => {
    try {
        let shareId = req.params.setid;
        let currentDate = new Date();

        let user = await usersModel.findOneAndUpdate(
            { loginId: req.session.loginId },
            { $set: {
                'lastActivity.timestamp': currentDate,
                'lastActivity.shareId': shareId
            }},
            {returnOriginal: false}
        );
        if (!user) {
            throw console.error();
        }
        console.log(`after:${user}`);
        // log currentdate - will use later to check if date changed (eg 3->4)
        // if diff date than before, inc, as long as consecutive day
        // what update to db: user.streak
        await user.save();
    } catch (err) {
        console.log(`error occured`)
    }
    console.log(`outside of try catch`)
    return;
}

module.exports = { incrementStreak }