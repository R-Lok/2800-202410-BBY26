// // source
// https://medium.com/@arievrchman/setting-up-mongodb-single-node-with-replica-set-and-authentication-for-dockerized-environment-b77b494a63d3

// Initialize the replica set
print('Initialize the replica set')
rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: 'localhost:27017' },
        // Add more members here if you want to set up additional nodes
    ],
})
print('Replica set initiated.')

const adminDB = db.getSiblingDB('admin')
print('Switched to the admin database.')

const isReady = () => {
    try {
        adminDB.createUser({
            user: 'root',
            pwd: '123456',
            roles: [{ role: 'root', db: 'admin' }],
        })
        print('Root user created.')

        adminDB.auth('root', '123456')
        print('Authenticated as root user.')

        const dbName = 'test'
        adminDB.createUser({
            user: 'admin',
            pwd: '123456',
            roles: [{ role: 'readWrite', db: dbName }],
        })
        print('Admin user created in test database.')
        return true
    } catch (error) {
        print(error)
        return false
    }
}

const retries = 30
while (!isReady() && retries > 0) {
    print('Sleep for 0.5 seconds...')
    sleep(500)
    retries--
}
