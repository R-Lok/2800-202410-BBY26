const authController = require('../../src/controllers/auth')
const { authService } = require('../../src/services/index')
const { CustomError } = require('../../src/utilities')

const users = [
    { loginId: 'admin', name: 'admin', email: 'admin@gmail.com', password: 'admin', confirmPassword: 'admin' },
    { loginId: 'test', name: 'test', email: 'test@gmail.com', password: '123', confirmPassword: '123' },
]

let res
let next

beforeEach(() => {
    res = {
        status: jest.fn().mockImplementation(function(statusCode) {
            this.statusCode = statusCode
            return this
        }),
        json: jest.fn().mockImplementation(function(json) {
            this.jsonData = json
            return this
        }),
    }
    next = jest.fn()
})


describe('auth controller', () => {
    describe('register POST', () => {
        it('should post', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    name: 'admin',
                    email: 'admin@gmail.com',
                    password: 'admin',
                    confirmPassword: 'admin',
                },
                session: {},
            }
            const result = await authController.registerPOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error (bad name)', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    name: '',
                    email: 'admin',
                    password: 'admin',
                    confirmPassword: 'admin',
                },
                session: {},
            }
            await authController.registerPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Display name is required')
            expect(error.code).toBe(422)
        })

        it('should throw an error (bad email)', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    name: 'admin',
                    email: 'admin',
                    password: '1',
                    confirmPassword: '1',
                },
                session: {},
            }
            await authController.registerPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Email must be a valid email')
            expect(error.code).toBe(422)
        })


        it('should throw an error (bad loginId)', async () => {
            const req = {
                body: {
                    loginId: '',
                    name: 'admin',
                    email: 'admin@gmail.com',
                    password: 'admin',
                    confirmPassword: 'admin',
                },
                session: {},
            }
            await authController.registerPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Login ID is required')
            expect(error.code).toBe(422)
        })

        it('should throw an error (bad password)', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    name: 'admin',
                    email: 'admin@gmail.com',
                    password: '1',
                    confirmPassword: '1',
                },
                session: {},
            }
            await authController.registerPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Password must be between 3 and 20 alpha-numeric characters')
            expect(error.code).toBe(422)
        })

        it('should throw an error (bad confirmPassword)', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    name: 'admin',
                    email: 'admin@gmail.com',
                    password: '123',
                    confirmPassword: '321',
                },
                session: {},
            }
            await authController.registerPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Passwords do not match')
            expect(error.code).toBe(422)
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
            const req = {
                body: {
                    loginId: 'admin',
                    password: 'admin',
                },
                session: {},
            }
            const result = await authController.loginPOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error (empty loginId)', async () => {
            const req = {
                body: {
                    loginId: '',
                    password: '1',
                },
                session: {},
            }
            await authController.loginPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Login ID is required')
            expect(error.code).toBe(422)
        })

        it('should throw an error (empty password)', async () => {
            const req = {
                body: {
                    loginId: 'admin',
                    password: '',
                },
                session: {},
            }
            await authController.loginPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Password is required')
            expect(error.code).toBe(422)
        })
    })

    describe('resetPassword POST', () => {
        let userId
        beforeEach(async () => {
            const user = await authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password)
            userId = user._id
        })
        it('should post', async () => {
            const req = {
                body: {
                    userId: userId.toString(),
                    password: 'newPassword',
                    confirmPassword: 'newPassword',
                },
                session: {},
            }
            const result = await authController.resetPasswordPOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error (invalid userId)', async () => {
            const req = {
                body: {
                    userId: '1',
                    password: 'newPassword',
                    confirmPassword: 'newPassword',
                },
                session: {},
            }
            await authController.resetPasswordPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Invalid object id')
            expect(error.code).toBe(422)
        })

        it('should throw an error (user not found)', async () => {
            const req = {
                body: {
                    userId: '6654dba10bb44c02ee72aa1d',
                    password: 'newPassword',
                    confirmPassword: 'newPassword',
                },
                session: {},
            }
            await authController.resetPasswordPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[404] user not found')
            expect(error.code).toBe(404)
        })

        it('should throw an error (passwords not match)', async () => {
            const req = {
                body: {
                    userId: userId.toString(),
                    password: 'admin',
                    confirmPassword: 'newPassword',
                },
                session: {},
            }
            await authController.resetPasswordPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[422] ValidationError: Passwords do not match')
            expect(error.code).toBe(422)
        })
    })
})
