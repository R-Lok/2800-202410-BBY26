const { authService, adminService } = require('../../src/services/index')
const { authController } = require('../../src/controllers/index')
const { CustomError } = require('../../src/utilities')

const users = [
    { loginId: 'admin', name: 'admin', email: 'admin@gmail.com', password: 'admin' },
    { loginId: 'test', name: 'test', email: 'test@gmail.com', password: '123' },
]

beforeEach(() => {
    return Promise.all([
        authService.registerPOST(users[0].loginId, users[0].name, users[0].email, users[0].password),
        authService.registerPOST(users[1].loginId, users[1].name, users[1].email, users[1].password),
    ])
})

describe('admin service', () => {
    describe('userListGET', () => {
        it('should get', async () => {
            const result = await adminService.userListGET({})
            expect(result.data).toHaveLength(2)
        })
    })

    describe('impersonationPOST', () => {
        it('should post', async () => {
            const result = await adminService.impersonationPOST(users[1].loginId)
            expect(result.loginId).toBe(users[1].loginId)
        })

        it('should throw an error (user not found)', async () => {
            await expect(adminService.impersonationPOST('6651784ef75e41b078b43c9d'))
                .rejects.toThrow(new CustomError('404', 'user not found'))
        })
    })

    describe('revokePOST', () => {
        it('should post', async () => {
            const req = {
                body: {
                    loginId: users[1].loginId,
                    password: users[1].password,
                },
                session: {
                    destroy: jest.fn(),
                },
            }
            await authController.loginPOST(req, {}, jest.fn())

            const result = await adminService.revokePOST(req, users[1].loginId)
            expect(result.loginId).toBe(users[1].loginId)
            expect(result.enable).toBe(false)
        })

        it('should throw an error (user not found)', async () => {
            const req = {}
            await expect(adminService.revokePOST(req, 'notExisting'))
                .rejects.toThrow(new CustomError('404', 'user not found'))
        })
    })

    describe('enablePOST', () => {
        it('should post', async () => {
            const result = await adminService.enablePOST(users[1].loginId)
            expect(result.loginId).toBe(users[1].loginId)
            expect(result.enable).toBe(true)
        })

        it('should throw an error (user not found)', async () => {
            await expect(adminService.enablePOST('notExisting'))
                .rejects.toThrow(new CustomError('404', 'user not found'))
        })
    })
})
