const { adminService } = require('../../src/services/index')
const { CustomError, encrypt, hash } = require('../../src/utilities')
const usersModel = require('../../src/models/users')

const users = [
    { loginId: 'admin', name: 'admin', email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { loginId: 'test', name: 'test', email: 'test@gmail.com', password: '123', role: 'normal' },
]

beforeEach(async () => {
    // insert by order
    for (const user of users) {
        await usersModel.create({
            loginId: user.loginId,
            name: user.name,
            email: await encrypt(user.email),
            emailHash: await hash(user.email),
            password: user.password,
            role: user.role,
        })
    }
})

describe('admin service', () => {
    describe('userListGET', () => {
        it('should get', async () => {
            const result = await adminService.userListGET({})
            expect(result.data).toHaveLength(2)
            expect(result.total).toBe(2)
            expect(result.data[0].email).toBe(users[1].email)
            expect(result.data[0].password).toBeUndefined()
        })

        it('should filter by loginId', async () => {
            const query = {
                loginId: 'te',
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(1)
            expect(result.total).toBe(1)
            expect(result.data[0].email).toBe(users[1].email)
            expect(result.data[0].password).toBeUndefined()
        })

        it('should filter by role', async () => {
            const query = {
                role: 'admin',
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(1)
            expect(result.total).toBe(1)
            expect(result.data[0].email).toBe(users[0].email)
            expect(result.data[0].role).toBe(users[0].role)
        })

        it('should get nothing', async () => {
            const query = {
                role: 'no such role',
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(0)
            expect(result.total).toBe(0)
        })

        it('should sort by _id asc', async () => {
            const query = {
                sortBy: '_id',
                sortDirection: 'asc',
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(2)
            expect(result.total).toBe(2)
            expect(result.data[0].email).toBe(users[0].email)
        })

        it('should sort by role', async () => {
            const query = {
                sortBy: 'role',
                sortDirection: 'asc',
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(2)
            expect(result.total).toBe(2)
            expect(result.data[0].email).toBe(users[0].email)
        })

        it('should skip 1', async () => {
            const query = {
                skip: 1,
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(1)
            expect(result.total).toBe(2)
            expect(result.data[0].email).toBe(users[0].email)
        })

        it('should limit 1', async () => {
            const query = {
                limit: 1,
            }
            const result = await adminService.userListGET(query)
            expect(result.data).toHaveLength(1)
            expect(result.total).toBe(2)
            expect(result.data[0].email).toBe(users[1].email)
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
            const result = await adminService.revokePOST(users[1].loginId)
            expect(result.loginId).toBe(users[1].loginId)
            expect(result.enable).toBe(false)
        })

        it('should throw an error (user not found)', async () => {
            await expect(adminService.revokePOST('notExisting'))
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
