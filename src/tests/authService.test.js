const { authService } = require('../services/index')

const users = [
    { loginId: 'admin', name: 'admin', email: 'admin@gmail.com', password: 'admin' },
]

describe('auth service', () => {
    describe('register POST', () => {
        it('should post', async () => {
            const { loginId, name, email, password } = users[0]
            const user = await authService.registerPOST(loginId, name, email, password)
            console.log(user)
            expect(user.email).toBe(users[0].email)
        })

        // it('should throw an error (bad request)', async () => {
        //     const emptyRequest = { body: {} }
        //     const { code, error } = await authService.usersPOST(emptyRequest)
        //     expect(code).toBe(400)
        //     expect(error).toBe('missing email address.')
        // })
    })
})
