const express = require('express')
const app = express();
app.use(express.json());
const router = new express.Router()
const usersModel = require('../models/users')
const bcrypt = require('bcrypt')
const saltRounds = 12
const Joi = require('joi')
const { CustomError } = require('../utilities/customError')
const { decrypt } = require('../utilities/index')

router.get('/', async (req, res) => {
    let userId = req.session.userId
    let user = await usersModel.findById(userId).select("-_id picture name loginId email").lean();
    let email = await decrypt(user.email);
    return res.render('settings', {imageId: user.picture, name:user.name, loginId:user.loginId, email:email})
})

router.post('/editName', async (req, res) => {
    let userId = req.session.userId;
    let newName = req.body.newName;
    const result = await usersModel.findByIdAndUpdate(userId, {name:newName});
    return res.status(200).json({
        msg: 'ok'
    })
})

router.post('/changePwd', async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await usersModel.findById(userId)
        const prevPass = req.body.previousPwd;
        const newPass = req.body.newPwd;
        const confirmNewPass = req.body.confirmPwd;
        if (newPass !== confirmNewPass) {
            console.log(newPass)
            console.log(confirmNewPass)
            console.log("Incorrect pass check");
            throw new CustomError('401', 'Incorrect input')
        }
        const schema = Joi.object({
            prevPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
            newPass: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')).required(),
        })
        await schema.validateAsync({ prevPass, newPass })
            .catch((error) => {
                throw new CustomError('422', error)
        })

        const result = await bcrypt.compare(prevPass, user.password)
        if(!result) {
            console.log("Incorrect prev password");
            throw new CustomError('401', 'loginId or password incorrect!')
        }
        let hashedPass = await bcrypt.hash(newPass, saltRounds)
        await usersModel.findByIdAndUpdate(userId, {password: hashedPass});
        return res.status(200).json({message:'ok'});

    }   catch(error) {
        console.log(error.statusCode);
        res.status(400).json({message: error.message});

    }
})



module.exports = router
