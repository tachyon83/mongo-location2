const mongoose = require('mongoose')
const mongoSettings = require('./settings/mongoSettings')

module.exports = () => {

    return new Promise((resolve, reject) => {
        // using node.js promise
        mongoose.Promise = global.Promise
        mongoose.connect(process.env.mongoUri, mongoSettings.connectOption)
            .then(() => {
                console.log('successfully conneced to mongodb')
                return resolve()
            })
            .catch(err => reject(err))
        // dbConnection = mongoose.connection
    })
}
