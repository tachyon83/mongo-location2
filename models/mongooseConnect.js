const mongoose = require('mongoose')
const mongoSettings = require('./settings/mongoSettings')

module.exports = () => {

    let dbConnection

    return new Promise((resolve, reject) => {
        if (dbConnection) return resolve()
        // using node.js promise
        mongoose.Promise = global.Promise
        mongoose.connect(process.env.mongoUri, mongoSettings.connectOption)
            .then(() => {
                console.log('[MongoDB]: successfully conneced to mongodb')
                console.log('[MongoDB]: the above message should appear only once!')
                console.log()
                dbConnection = mongoose.connection
                return resolve()
            })
            .catch(err => reject(err))
    })
}
