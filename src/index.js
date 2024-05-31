require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })
const mongoose = require('mongoose')
const { server, app, mongoUrl } = require('./expressServer')

const mongoOptions = {
    user: process.env.DATABASE_USERNAME,
    pass: process.env.DATABASE_PASSWORD,
    autoIndex: process.env.AUTO_INDEX || false,
    dbName: process.env.DATABASE_NAME,
    maxPoolSize: 100,
    ssl: process.env.NODE_ENV === 'local' ? false : true,
}

//launches server
const launch = async () => {
    try {
        await Promise.all([
            mongoose.connect(mongoUrl, mongoOptions),
        ])
        console.log('MongoDB connect successful.')
        if (process.send) process.send('ready')

        server.listen(process.env.PORT, () => {
            const { address, port } = server.address()
            console.log('Server is listening at http://%s:%s', address, port)
            console.log(`Process is running now on ${app.get('env')}. (pid: ${process.pid})`)
        })
    } catch (err) {
        console.log(err)
        console.log('MongoDB or MQ connection failed')
        process.exit(1)
    }
}

const mongoDBShutdown = async () => {
    await mongoose.connection.close(false)
    console.log('MongoDb connection closed.')
}

//ensures graceful exit
process.on('SIGINT', () => {
    console.log('SIGINT signal received.')
    console.log('Closing http server...')
    server.close(async (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log('Http server closed.')
        try {
            await Promise.all([
                mongoDBShutdown(),
            ])
            process.exit(0)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    })
})

process.on('uncaughtException', (err) => {
    console.log(err)
})

launch()
