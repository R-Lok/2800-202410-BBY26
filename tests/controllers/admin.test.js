const { adminController } = require('../../src/controllers/index')
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
    return Promise.all([
        authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password),
        authService.registerPOST(users[1].loginId, users[1].name, users[1].email, users[1].password),
    ])
})


describe('admin controller', () => {
    describe('userList GET', () => {
        it('should get', async () => {
            const req = {}
            const result = await adminController.userListGET(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.jsonData.total).toBe(2)

            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('impersonation POST', () => {
        it('should post', async () => {
            const req = {
                body: {
                    loginId: 'test',
                },
                session: {},
            }
            const result = await adminController.impersonationPOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('revoke POST', () => {
        it('should post', async () => {
            const req = {
                body: {
                    loginId: 'test',
                },
            }
            const result = await adminController.revokePOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })

        it('should fail (user not found)', async () => {
            const req = {
                body: {
                    loginId: 'not existing',
                },
            }
            await adminController.revokePOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[404] user not found')
            expect(error.code).toBe(404)
            expect(next).toHaveBeenCalled()
        })
    })

    describe('enablePOST', () => {
        it('should post', async () => {
            const req = {
                body: {
                    loginId: 'test',
                },
            }
            const result = await adminController.revokePOST(req, res, next)
            expect(result.status).toHaveBeenCalledWith(200)
            expect(result.statusCode).toBe(200)

            expect(res.json).toHaveBeenCalledWith({ msg: 'ok' })
            expect(res.jsonData).toEqual({ msg: 'ok' })

            expect(next).not.toHaveBeenCalled()
        })

        it('should fail (user not found)', async () => {
            const req = {
                body: {
                    loginId: 'not existing',
                },
            }
            await adminController.revokePOST(req, res, next)

            expect(next).toHaveBeenCalledWith(expect.any(CustomError))
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('[404] user not found')
            expect(error.code).toBe(404)
            expect(next).toHaveBeenCalled()
        })
    })
})
