const { authService } = require('../../src/services/index')
const userSessionModel = require('../../src/models/userSessions')
const usersModel = require('../../src/models/users')

const users = [
    { loginId: 'admin', name: 'admin', email: 'admin@gmail.com', password: 'admin' },
    { loginId: 'test', name: 'test', email: 'test@gmail.com', password: '123' },
]


describe('auth service', () => {
    describe('register POST', () => {
        it('should post', async () => {
            const user = await authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password)
            expect(user.email).toBe(users[0].email)
        })

        it('should throw an error (bad request)', async () => {
            await expect(authService.registerPOST())
                .rejects.toThrow(new Error('data and salt arguments required'))
        })

        it('should throw an error (loginId already exists)', async () => {
            const { loginId, name, email, password } = users[0]
            await authService.registerPOST(loginId, name, email, password)
            await expect(authService.registerPOST(loginId, name, email, password))
                .rejects.toThrow(new Error('[405] loginId already exists.'))
        })

        it('should throw an error (email already exists)', async () => {
            const { loginId, name, email, password } = users[0]
            await authService.registerPOST(loginId, name, email, password)
            await expect(authService.registerPOST(users[1].loginId, name, email, password))
                .rejects.toThrow(new Error('[405] email already exists.'))
        })
    })

    describe('login POST', () => {
        beforeEach(() => {
            return Promise.all([
                authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password),
                authService.registerPOST(users[1].loginId, users[1].name, users[1].email, users[1].password),
            ])
        })

        it('should post', async () => {
            const user1 = await authService.loginPOST(users[0].loginId, users[0].password)
            expect(user1.email).toBe(users[0].email)

            const user2 = await authService.loginPOST(users[1].loginId, users[1].password)
            expect(user2.email).toBe(users[1].email)
        })

        it('should throw an error (user not found)', async () => {
            await expect(authService.loginPOST('notExisting', 'password'))
                .rejects.toThrow(new Error('[404] User is not found.'))
        })

        it('should throw an error (incorrect password)', async () => {
            await expect(authService.loginPOST('admin', 'password'))
                .rejects.toThrow(new Error('[401] Login ID or Password is Incorrect!'))
        })

        it('should throw an error (account disabled)', async () => {
            await usersModel.updateOne({ loginId: users[1].loginId }, { enable: false })
            await expect(authService.loginPOST(users[1].loginId, users[1].password))
                .rejects.toThrow(new Error('[403] Account Disabled!'))
        })
    })

    describe('logout GET', () => {
        let userId
        beforeEach(async () => {
            const user = await authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password)
            userId = user._id
        })
        it('should get', async () => {
            const sessionId = 'wo7Lud_4U3r08W6O1yiFpVbfGQOt1TN0'
            const req = { session: { id: sessionId } }
            const destroyMock = jest.fn(() => {})
            req.session.destroy = destroyMock

            await userSessionModel.create({
                sessionId: sessionId,
                userId: userId,
            })
            expect(await userSessionModel.countDocuments({})).toBe(1)

            await authService.logoutGET(req)
            expect(await userSessionModel.countDocuments({})).toBe(0)
        })
    })

    describe('resetPassword POST', () => {
        const userLists = []
        beforeEach(async () => {
            userLists.push(await authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password))
            userLists.push(await authService.registerPOST(users[1].loginId, users[1].name, users[1].email, users[1].password))
        })
        it('should post', async () => {
            const newPassword = 'newPassword'
            await authService.resetPasswordPOST({ userId: userLists[0]._id, password: newPassword })

            // old password should fail
            await expect(authService.loginPOST(users[0].loginId, users[0].password))
                .rejects.toThrow(new Error('[401] Login ID or Password is Incorrect!'))

            // new password should work
            const user1 = await authService.loginPOST(users[0].loginId, newPassword)
            expect(user1.email).toBe(users[0].email)
        })
    })
})
